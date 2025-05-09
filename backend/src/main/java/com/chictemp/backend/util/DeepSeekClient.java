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
import java.util.HashSet;
import java.util.Set;

@Component
public class DeepSeekClient {
    private static final Logger logger = LoggerFactory.getLogger(DeepSeekClient.class);

    @Value("${deepseek.api.key}")
    private String apiKey;

    @Value("${deepseek.api.url}")
    private String apiUrl;

    // 使用具有超时设置的RestTemplate
    private final RestTemplate restTemplate;
    
    public DeepSeekClient() {
        // 设置系统属性以支持代理（如果存在）
        setProxyProperties();
        
        this.restTemplate = new RestTemplate();
        
        // 输出当前服务器网络情况
        try {
            logger.info("尝试DNS解析 api.deepseek.ai...");
            java.net.InetAddress address = java.net.InetAddress.getByName("api.deepseek.ai");
            logger.info("解析结果: {}", address.getHostAddress());
            
            // 测试网络连接
            testNetworkConnection();
        } catch (Exception e) {
            logger.error("DNS解析或网络测试失败: {}", e.getMessage());
        }
    }

    // 设置系统代理属性
    private void setProxyProperties() {
        // 如果环境变量中有代理设置，则使用它们
        String httpProxy = System.getenv("HTTP_PROXY");
        String httpsProxy = System.getenv("HTTPS_PROXY");
        
        if (httpsProxy != null && !httpsProxy.isEmpty()) {
            try {
                java.net.URL proxyUrl = new java.net.URL(httpsProxy);
                System.setProperty("https.proxyHost", proxyUrl.getHost());
                System.setProperty("https.proxyPort", String.valueOf(proxyUrl.getPort() != -1 ? proxyUrl.getPort() : 80));
                logger.info("已设置HTTPS代理: {}:{}", proxyUrl.getHost(), proxyUrl.getPort());
            } catch (Exception e) {
                logger.error("无法解析HTTPS代理设置: {}", e.getMessage());
            }
        } else if (httpProxy != null && !httpProxy.isEmpty()) {
            try {
                java.net.URL proxyUrl = new java.net.URL(httpProxy);
                System.setProperty("http.proxyHost", proxyUrl.getHost());
                System.setProperty("http.proxyPort", String.valueOf(proxyUrl.getPort() != -1 ? proxyUrl.getPort() : 80));
                logger.info("已设置HTTP代理: {}:{}", proxyUrl.getHost(), proxyUrl.getPort());
            } catch (Exception e) {
                logger.error("无法解析HTTP代理设置: {}", e.getMessage());
            }
        }
    }
    
    // 测试网络连接
    private void testNetworkConnection() {
        try {
            // 尝试连接到DeepSeek API服务器
            logger.info("测试与DeepSeek API的网络连接...");
            java.net.Socket socket = new java.net.Socket();
            socket.connect(new java.net.InetSocketAddress("api.deepseek.ai", 443), 5000);
            socket.close();
            logger.info("成功连接到DeepSeek API服务器");
        } catch (Exception e) {
            logger.error("无法连接到DeepSeek API服务器: {}", e.getMessage());
            
            // 尝试连接到其他常用服务器以测试基本网络连接
            try {
                logger.info("测试基本网络连接（连接到google.com）...");
                java.net.Socket socket = new java.net.Socket();
                socket.connect(new java.net.InetSocketAddress("google.com", 443), 5000);
                socket.close();
                logger.info("基本网络连接正常");
            } catch (Exception ex) {
                logger.error("基本网络连接测试失败: {}", ex.getMessage());
            }
        }
    }

    // 使用备用方案生成摘要
    private String generateFallbackSummary(String content) {
        logger.info("使用增强的本地备用方案生成摘要");
        if (content == null || content.isEmpty()) {
            return "内容为空，无法生成摘要";
        }
        
        try {
            // 取出标点符号
            String[] sentences = content.split("[。！？.!?]");
            StringBuilder summary = new StringBuilder();
            
            // 提取内容特征
            Set<String> topics = new HashSet<>();
            
            // 从内容中提取可能的主题词
            String[] commonTopics = {"人生", "情感", "科技", "教育", "环境", "健康", "社会", "经济", "文化", "艺术", "历史", "科学", "自然"};
            for (String topic : commonTopics) {
                if (content.contains(topic)) {
                    topics.add(topic);
                }
            }
            
            // 使用第一句话内容
            if (sentences.length > 0) {
                String firstSentence = sentences[0].trim();
                if (firstSentence.length() > 15) {
                    firstSentence = firstSentence.substring(0, 15);
                }
                summary.append(firstSentence);
            } else {
                // 如果没有句子，截取前15个字符
                summary.append(content.length() > 15 ? content.substring(0, 15) : content);
            }
            
            // 根据内容添加主题相关描述
            if (!topics.isEmpty()) {
                summary.append("，涉及");
                int count = 0;
                for (String topic : topics) {
                    if (count > 0) summary.append("、");
                    summary.append(topic);
                    count++;
                    if (count >= 2) break; // 最多显示2个主题
                }
                summary.append("探讨");
            } else {
                // 如果没有识别出主题，添加一般性描述
                if (sentences.length > 1) {
                    // 使用第二句话的前几个字
                    String secondSentence = sentences[1].trim();
                    if (!secondSentence.isEmpty()) {
                        int maxLength = 10;
                        summary.append("，");
                        summary.append(secondSentence.length() > maxLength ? 
                                      secondSentence.substring(0, maxLength) : secondSentence);
                    }
                }
            }
            
            // 确保总结不超过30个字
            String result = summary.toString();
            if (result.length() > 30) {
                result = result.substring(0, 30);
            }
            
            return result;
        } catch (Exception e) {
            logger.error("生成本地摘要时出错", e);
            return content.length() > 30 ? content.substring(0, 30) : content;
        }
    }

    public String generateSummary(String content) {
        return generateSummary(content, 30); // 默认使用30字摘要长度
    }

    public String generateSummary(String content, Integer maxLength) {
        logger.debug("开始生成摘要，内容长度: {} 字符，最大长度限制: {} 字", content.length(), maxLength);
        
        // 只尝试少数几个已验证的模型和端点组合
        String[][] endpointModelPairs = {
            {apiUrl + "/v1/chat/completions", "deepseek-chat"},
            {"https://api.deepseek.com/v1/chat/completions", "deepseek-chat"},
            {"https://api.deepseek.ai/v1/chat/completions", "deepseek-chat"}
        };
        
        // 添加重试机制
        int maxRetries = 2;
        Exception lastException = null;
        
        // 尝试API调用，最多重试指定次数
        for (String[] pair : endpointModelPairs) {
            String endpoint = pair[0];
            String model = pair[1];
            
            for (int retryCount = 0; retryCount <= maxRetries; retryCount++) {
                try {
                    // 如果是重试，添加延迟
                    if (retryCount > 0) {
                        logger.info("第 {} 次重试调用 {} 使用模型 {}", retryCount, endpoint, model);
                        Thread.sleep(1000 * retryCount); // 增加的延迟
                    } else {
                        logger.info("尝试API端点: {} 使用模型: {}", endpoint, model);
                    }
                    
                    String result = callDeepSeekAPI(endpoint, content, model, maxLength);
                    if (result != null && !result.startsWith("摘要生成失败") && !result.startsWith("API调用失败")) {
                        logger.info("API调用成功: {} 使用模型: {}", endpoint, model);
                        return result;
                    } else if (result != null) {
                        logger.warn("API返回错误 (尝试 {}/{}): {}", retryCount + 1, maxRetries + 1, result);
                    }
                } catch (Exception e) {
                    lastException = e;
                    logger.error("API调用失败 (尝试 {}/{}): {} - {}", 
                                 retryCount + 1, maxRetries + 1, e.getClass().getName(), e.getMessage());
                }
            }
        }
        
        // 所有API调用失败，使用增强的本地摘要生成
        logger.warn("所有API调用失败，使用增强的本地摘要生成...");
        if (lastException != null) {
            logger.error("最后捕获的异常: ", lastException);
        }
        
        return generateEnhancedSummary(content, maxLength);
    }
    
    /**
     * 增强的本地摘要生成方法
     */
    private String generateEnhancedSummary(String content) {
        return generateEnhancedSummary(content, 30);
    }
    
    /**
     * 增强的本地摘要生成方法，带有长度限制
     */
    private String generateEnhancedSummary(String content, Integer maxLength) {
        logger.info("使用高级本地摘要生成，限制长度: {}", maxLength);
        if (content == null || content.isEmpty()) {
            return "内容为空，无法生成摘要";
        }
        
        try {
            // 更智能的本地摘要算法
            
            // 1. 提取关键句子
            String[] sentences = content.split("[。！？.!?]");
            if (sentences.length == 0) {
                return "内容结构无法解析";
            }
            
            // 2. 优先使用第一句话，通常包含主题
            String firstSentence = sentences[0].trim();
            
            // 3. 关键词提取
            Map<String, Integer> keywordFrequency = new HashMap<>();
            String[] keywordList = {
                "自卑", "勇气", "人生", "哲学", "心理", "成长", "情感", "疗愈", 
                "思考", "智慧", "希望", "力量", "意义", "生活", "价值", "世界",
                "社会", "技术", "科学", "环境", "健康", "教育", "文化", "艺术",
                "历史", "未来", "发展", "创新", "挑战", "机遇", "成功", "失败"
            };
            
            for (String keyword : keywordList) {
                if (content.contains(keyword)) {
                    int count = 0;
                    int lastIndex = 0;
                    while ((lastIndex = content.indexOf(keyword, lastIndex)) != -1) {
                        count++;
                        lastIndex += keyword.length();
                    }
                    keywordFrequency.put(keyword, count);
                }
            }
            
            // 4. 根据频率排序关键词
            List<Map.Entry<String, Integer>> sortedKeywords = new ArrayList<>(keywordFrequency.entrySet());
            sortedKeywords.sort((a, b) -> b.getValue().compareTo(a.getValue()));
            
            // 5. 构建摘要
            StringBuilder summaryBuilder = new StringBuilder();
            
            // 添加首句精简版
            if (firstSentence.length() > maxLength * 2/3) {
                // 查找关键部分
                int endPos = Math.min(firstSentence.length(), maxLength * 2/3);
                // 尝试在标点处截断
                for (int i = maxLength/2; i < Math.min(firstSentence.length(), maxLength * 3/4); i++) {
                    char c = firstSentence.charAt(i);
                    if (c == '，' || c == ',' || c == '、' || c == ' ') {
                        endPos = i;
                        break;
                    }
                }
                summaryBuilder.append(firstSentence.substring(0, endPos));
            } else {
                summaryBuilder.append(firstSentence);
            }
            
            // 如果有关键词，添加关键词
            if (!sortedKeywords.isEmpty()) {
                summaryBuilder.append("，探讨");
                
                // 添加前2个最频繁的关键词
                int added = 0;
                for (Map.Entry<String, Integer> entry : sortedKeywords) {
                    if (added > 0) summaryBuilder.append("与");
                    summaryBuilder.append(entry.getKey());
                    added++;
                    if (added >= 2) break;
                }
                
                // 根据内容类型添加结尾
                if (content.contains("书") || content.contains("作者") || content.contains("阅读")) {
                    summaryBuilder.append("的思考");
                } else if (content.contains("科学") || content.contains("研究") || content.contains("技术")) {
                    summaryBuilder.append("的发展");
                } else {
                    summaryBuilder.append("的关系");
                }
            }
            
            // 确保总结不超过指定字数
            String result = summaryBuilder.toString();
            if (result.length() > maxLength) {
                result = result.substring(0, maxLength);
            }
            
            logger.info("成功生成本地摘要: {}", result);
            return result;
            
        } catch (Exception e) {
            logger.error("生成本地摘要时出错", e);
            // 最简单的备用方案：截取内容开头
            return "摘要生成失败，返回内容开头: " + 
                   (content.length() > maxLength ? content.substring(0, maxLength) + "..." : content);
        }
    }
    
    // 调用DeepSeek API
    private String callDeepSeekAPI(String endpoint, String content, String modelName) {
        return callDeepSeekAPI(endpoint, content, modelName, 30);
    }

    // 调用DeepSeek API，带有长度限制
    private String callDeepSeekAPI(String endpoint, String content, String modelName, Integer maxLength) {
        try {
            // 打印请求信息
            logger.info("调用API: {} 使用模型: {}, 最大长度: {}", endpoint, modelName, maxLength);
            
            // 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
            headers.set("Accept", "application/json");
            headers.set("User-Agent", "Spring Application");

            // 构建请求体
        Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);

            // 构建消息
        List<Map<String, Object>> messages = new ArrayList<>();
        
            // 添加系统提示
        Map<String, Object> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
            systemMessage.put("content", String.format("你是一个极简摘要助手。生成%d字以内的中文摘要，直接给出核心内容，不用引导语。", maxLength));
        messages.add(systemMessage);

            // 添加用户消息
        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
            userMessage.put("content", String.format("对以下内容生成%d字以内的摘要，不要复制原文：\n\n%s", maxLength, content));
        messages.add(userMessage);

        requestBody.put("messages", messages);
            requestBody.put("max_tokens", maxLength * 2);
            requestBody.put("temperature", 0.5);
            
            // 创建HTTP请求实体
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // 发送请求
            logger.debug("发送请求到: {}", endpoint);
            Map<String, Object> response = restTemplate.postForObject(endpoint, request, Map.class);
            
            // 处理响应
            if (response != null) {
                if (response.containsKey("error")) {
                    // 处理错误
                    Map<String, Object> error = (Map<String, Object>) response.get("error");
                    logger.error("API错误: {}", error);
                    return "摘要生成失败: " + error.get("message");
                }
                
                if (response.containsKey("choices")) {
                    // 处理成功响应
                    Object choicesObj = response.get("choices");
                    if (choicesObj instanceof ArrayList) {
                        List<?> choices = (List<?>) choicesObj;
                        if (!choices.isEmpty()) {
                            Map<String, Object> choice = (Map<String, Object>) choices.get(0);
                    Map<String, Object> responseMessage = (Map<String, Object>) choice.get("message");
                            String summary = (String) responseMessage.get("content");
                            
                            // 清理摘要
                            summary = cleanSummary(summary);
                            
                            // 截断到指定长度
                            if (summary.length() > maxLength) {
                                summary = summary.substring(0, maxLength);
                            }
                            
                            logger.info("成功生成摘要: {}", summary);
                            return summary;
                        }
                    }
                }
            }
            
            return "无法从API响应中提取摘要";
        } catch (Exception e) {
            logger.error("API调用异常: {}", e.getMessage());
            throw e;
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

    // 添加手动HTTP请求作为备选方法
    private String manualHttpRequest(String url, Map<String, Object> requestBody) {
        try {
            logger.info("尝试使用手动HTTP请求调用API: {}, 模型: {}", url, requestBody.get("model"));
            
            // 转换请求体为JSON
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String jsonBody = mapper.writeValueAsString(requestBody);
            logger.debug("请求体JSON: {}", jsonBody);
            
            // 创建URL连接
            java.net.URL apiUrl = new java.net.URL(url);
            java.net.HttpURLConnection connection = (java.net.HttpURLConnection) apiUrl.openConnection();
            
            // 设置请求方法和头部
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Authorization", "Bearer " + apiKey);
            connection.setRequestProperty("User-Agent", "JavaClient/1.0");
            
            // 启用输入/输出流
            connection.setDoInput(true);
            connection.setDoOutput(true);
            
            // 设置超时
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(30000);
            
            // 发送请求体
            try (java.io.OutputStream os = connection.getOutputStream()) {
                byte[] input = jsonBody.getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            
            // 获取响应
            int responseCode = connection.getResponseCode();
            logger.info("API响应状态码: {}", responseCode);
            
            // 读取响应
            StringBuilder response = new StringBuilder();
            try (java.io.BufferedReader br = new java.io.BufferedReader(
                    new java.io.InputStreamReader(
                            responseCode >= 400 ? connection.getErrorStream() : connection.getInputStream(), "utf-8"))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            }
            
            logger.debug("API原始响应: {}", response.toString());
            
            // 解析响应
            if (responseCode >= 200 && responseCode < 300) {
                Map<String, Object> responseMap = mapper.readValue(response.toString(), Map.class);
                
                if (responseMap.containsKey("choices")) {
                    Object[] choices = (Object[]) responseMap.get("choices");
                    if (choices.length > 0) {
                        Map<String, Object> choice = (Map<String, Object>) choices[0];
                        Map<String, Object> message = (Map<String, Object>) choice.get("message");
                        String content = (String) message.get("content");
                        return cleanSummary(content);
                    }
                }
                
                return "无法从响应中提取摘要";
            } else {
                return "API调用失败，状态码: " + responseCode + ", 响应: " + response.toString();
            }
        } catch (Exception e) {
            logger.error("手动HTTP请求失败: {}", e.getMessage(), e);
            return null;
        }
    }

    // 尝试使用OpenAI API作为备选
    private String tryOpenAIFallback(String content) {
        try {
            logger.info("尝试连接到OpenAI API");
            
            String openaiApiKey = System.getenv("OPENAI_API_KEY");
            if (openaiApiKey == null || openaiApiKey.isEmpty()) {
                openaiApiKey = "sk_dummy_key"; // 填入你的OpenAI API密钥
                logger.info("未找到环境变量中的OpenAI API密钥，使用硬编码密钥");
            }
            
            // 如果没有配置OpenAI API密钥，则不尝试
            if ("sk_dummy_key".equals(openaiApiKey)) {
                logger.info("未配置真实的OpenAI API密钥，跳过OpenAI备选");
                return null;
            }
            
            // 创建OpenAI API请求
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + openaiApiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-3.5-turbo");
            
            List<Map<String, Object>> messages = new ArrayList<>();
            Map<String, Object> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "生成一个30字以内的中文摘要，不要使用引导语");
            messages.add(systemMessage);
            
            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", "请为以下内容生成30字以内的摘要：" + content);
            messages.add(userMessage);
            
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 50);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // 发送请求到OpenAI API
            Map response = restTemplate.postForObject("https://api.openai.com/v1/chat/completions", request, Map.class);
            
            if (response != null && response.containsKey("choices")) {
                Object[] choices = (Object[]) response.get("choices");
                if (choices.length > 0) {
                    Map<String, Object> choice = (Map<String, Object>) choices[0];
                    Map<String, Object> message = (Map<String, Object>) choice.get("message");
                    String summaryContent = (String) message.get("content");
                    
                    // 清理并返回摘要
                    summaryContent = cleanSummary(summaryContent);
                    if (summaryContent.length() > 30) {
                        summaryContent = summaryContent.substring(0, 30);
                    }
                    
                    return summaryContent;
                }
            }
            
            return null;
        } catch (Exception e) {
            logger.error("OpenAI API调用失败: {}", e.getMessage());
            return null;
        }
    }
}