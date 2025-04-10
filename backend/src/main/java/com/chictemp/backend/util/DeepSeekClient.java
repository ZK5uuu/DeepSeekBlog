package com.chictemp.backend.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class DeepSeekClient {
    private static final Logger logger = LoggerFactory.getLogger(DeepSeekClient.class);

    @Value("${deepseek.api.key}")
    private String apiKey;

    @Value("${deepseek.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateSummary(String content) {
        logger.debug("开始生成摘要，内容长度: {} 字符", content.length());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "deepseek-chat");

        List<Map<String, Object>> messages = new ArrayList<>();
        
        // 系统提示，指导模型如何生成摘要
        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content", "你是一个专业的极简摘要助手。你的任务是提取文章的最核心内容，并以极度简洁的方式表达。必须严格遵循以下规则：\n" +
                "1. 摘要必须严格控制在30个汉字以内，这是硬性要求\n" +
                "2. 直接给出核心内容，不要使用任何引导语和模板句式\n" +
                "3. 保留文章的最关键信息，用最精炼的语言表达\n" +
                "4. 严禁直接复制原文的句子，必须用自己的话概括\n" +
                "5. 确保摘要内容客观准确\n" +
                "6. 不要使用'本文'、'作者'等词语\n" +
                "7. 回答必须简短精炼，不超过30个汉字\n" +
                "8. 绝对禁止复制粘贴原文内容，必须真正理解并提炼");
        messages.add(systemMessage);

        // 用户请求
        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", "请对以下文章内容生成一个严格控制在30个汉字以内的极简摘要。禁止复制原文内容，必须用你自己的话概括核心内容：\n\n" + content);
        messages.add(userMessage);

        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 50); // 减少token数量，因为摘要很短
        requestBody.put("temperature", 0.5); // 提高创造性，避免直接复制
        requestBody.put("top_p", 0.8);
        requestBody.put("frequency_penalty", 1.0); // 添加频率惩罚，减少重复
        requestBody.put("presence_penalty", 1.0); // 添加存在惩罚，鼓励创新

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            // 记录API请求
            logger.debug("调用DeepSeek API，URL: {}, 请求头: {}", apiUrl + "/v1/chat/completions", headers);
            logger.debug("请求体: {}", requestBody);
            
            Map response = restTemplate.postForObject(apiUrl + "/v1/chat/completions", request, Map.class);
            
            // 记录API响应
            logger.debug("DeepSeek API响应: {}", response);

            // 解析响应
            if (response != null && response.containsKey("choices")) {
                Object[] choices = (Object[]) response.get("choices");
                if (choices.length > 0) {
                    Map<String, Object> choice = (Map<String, Object>) choices[0];
                    Map<String, Object> responseMessage = (Map<String, Object>) choice.get("message");
                    String summaryContent = (String) responseMessage.get("content");
                    
                    // 清理摘要内容，移除可能的引导语
                    summaryContent = cleanSummary(summaryContent);
                    
                    // 检查生成的摘要是否只是原文的一部分
                    if (content.contains(summaryContent) && summaryContent.length() > 15) {
                        logger.warn("检测到摘要可能只是原文的复制，尝试再次生成");
                        // 重新生成摘要，使用更高的惩罚参数
                        Map<String, Object> retryMessage = new HashMap<>();
                        retryMessage.put("role", "user");
                        retryMessage.put("content", "你刚才的回答只是复制了原文。请重新尝试，用你自己的语言总结这篇文章的核心内容，30字以内：");
                        messages.add(retryMessage);
                        requestBody.put("messages", messages);
                        requestBody.put("temperature", 0.7);
                        requestBody.put("frequency_penalty", 1.5);
                        requestBody.put("presence_penalty", 1.5);
                        
                        HttpEntity<Map<String, Object>> retryRequest = new HttpEntity<>(requestBody, headers);
                        response = restTemplate.postForObject(apiUrl + "/v1/chat/completions", retryRequest, Map.class);
                        
                        if (response != null && response.containsKey("choices")) {
                            choices = (Object[]) response.get("choices");
                            if (choices.length > 0) {
                                choice = (Map<String, Object>) choices[0];
                                responseMessage = (Map<String, Object>) choice.get("message");
                                summaryContent = (String) responseMessage.get("content");
                                summaryContent = cleanSummary(summaryContent);
                            }
                        }
                    }
                    
                    // 确保摘要不超过30字
                    if (summaryContent.length() > 30) {
                        logger.warn("摘要超过30字限制 ({}字)，将被截断", summaryContent.length());
                        summaryContent = summaryContent.substring(0, 30);
                    }
                    
                    logger.info("成功生成摘要: {}", summaryContent);
                    return summaryContent;
                }
            }
            logger.error("DeepSeek API响应不包含有效摘要");
            throw new RuntimeException("解析AI响应失败");
        } catch (Exception e) {
            logger.error("DeepSeek API调用失败", e);
            throw new RuntimeException("调用AI生成摘要失败: " + e.getMessage(), e);
        }
    }
    
    /**
     * 清理摘要内容，移除常见的引导语和模板句式
     */
    private String cleanSummary(String summary) {
        if (summary == null) return "";
        
        // 去除首尾空白
        summary = summary.trim();
        
        // 移除常见引导语模式
        String[] patterns = {
            "^摘要[:：]\\s*", 
            "^以下是摘要[:：]\\s*",
            "^文章摘要[:：]\\s*",
            "^这篇文章[:：]\\s*",
            "^这篇文章的主要内容是\\s*",
            "^这篇文章主要讲述了\\s*",
            "^核心内容[:：]\\s*",
            "^极简摘要[:：]\\s*",
            "^30字摘要[:：]\\s*"
        };
        
        for (String patternStr : patterns) {
            summary = Pattern.compile(patternStr).matcher(summary).replaceAll("");
        }
        
        // 移除首尾的英文引号
        if (summary.startsWith("\"") || summary.startsWith("'")) {
            summary = summary.substring(1);
        }
        
        if (summary.endsWith("\"") || summary.endsWith("'")) {
            summary = summary.substring(0, summary.length() - 1);
        }
        
        return summary.trim();
    }
}