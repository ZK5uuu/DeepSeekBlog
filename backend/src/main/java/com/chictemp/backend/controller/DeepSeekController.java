package com.chictemp.backend.controller;

import com.chictemp.backend.dto.ApiResponse;
import com.chictemp.backend.entity.PostSummary;
import com.chictemp.backend.service.DeepSeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/deepseek")
public class DeepSeekController {
    @Autowired
    private DeepSeekService deepSeekService;

    @PostMapping("/summary/{postId}")
    public ApiResponse<PostSummary> generateSummary(@PathVariable Integer postId) {
        try {
            PostSummary summary = deepSeekService.generateSummary(postId);
            return ApiResponse.success(summary);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/summary/{postId}")
    public ApiResponse<PostSummary> getSummary(@PathVariable Integer postId) {
        PostSummary summary = deepSeekService.findByPostId(postId);
        if (summary != null) {
            return ApiResponse.success(summary);
        } else {
            return ApiResponse.error("未找到摘要");
        }
    }
}