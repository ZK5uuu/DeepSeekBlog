package com.chictemp.backend.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Component
public class DeepSeekClient {
    @Value("${deepseek.api.key}")
    private String apiKey;

    @Value("${deepseek.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateSummary(String content) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "deepseek-chat");

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", "请总结以下文章的要点，不超过200字：\n\n" + content);

        requestBody.put("messages", new Object[]{message});
        requestBody.put("max_tokens", 300);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        Map response = restTemplate.postForObject(apiUrl, request, Map.class);

        // 解析响应
        if (response != null && response.containsKey("choices")) {
            Object[] choices = (Object[]) response.get("choices");
            if (choices.length > 0) {
                Map<String, Object> choice = (Map<String, Object>) choices[0];
                Map<String, Object> responseMessage = (Map<String, Object>) choice.get("message");
                return (String) responseMessage.get("content");
            }
        }

        throw new RuntimeException("生成摘要失败");
    }
}