package com.chictemp.backend.controller;

import com.chictemp.backend.service.DeepSeekService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/summary")
public class SummaryController {
    
    private static final Logger logger = LoggerFactory.getLogger(SummaryController.class);

    @Autowired
    private DeepSeekService deepSeekService;

    @PostMapping("/generate")
    public String generateSummary(@RequestBody Map<String, Object> request) {
        String content = (String) request.get("content");
        Integer maxLength = request.containsKey("maxLength") ? (Integer) request.get("maxLength") : 30;//content字段检查
        
        if (content == null || content.isEmpty()) {
            return "内容为空，无法生成摘要";
        }
        
        logger.info("收到生成摘要请求，内容长度: {} 字符，最大摘要长度: {}", content.length(), maxLength);
        try {
            String summary = deepSeekService.summarizeBlog(content, maxLength);
            logger.info("摘要生成成功，长度: {} 字符", summary.length());
            return summary;
        } catch (Exception e) {
            logger.error("生成摘要时发生错误: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    // 添加一个简单的测试接口，用于验证连接
    @GetMapping("/test")
    public String testConnection() {
        logger.info("收到测试连接请求");
        return "连接成功，后端服务正常运行";
    }
} 