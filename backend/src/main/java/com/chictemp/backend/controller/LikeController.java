package com.chictemp.backend.controller;

import com.chictemp.backend.dto.ApiResponse;
import com.chictemp.backend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
public class LikeController {
    @Autowired
    private LikeService likeService;

    @PostMapping("/{postId}")
    public ApiResponse<Boolean> like(@PathVariable Integer postId, @RequestHeader("User-Id") Integer userId) {
        boolean success = likeService.like(postId, userId);
        return ApiResponse.success(success);
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Boolean> unlike(@PathVariable Integer postId, @RequestHeader("User-Id") Integer userId) {
        boolean success = likeService.unlike(postId, userId);
        return ApiResponse.success(success);
    }

    @GetMapping("/{postId}/check")
    public ApiResponse<Boolean> isLiked(@PathVariable Integer postId, @RequestHeader("User-Id") Integer userId) {
        boolean isLiked = likeService.isLiked(postId, userId);
        return ApiResponse.success(isLiked);
    }

    @GetMapping("/{postId}/count")
    public ApiResponse<Integer> count(@PathVariable Integer postId) {
        int count = likeService.countByPostId(postId);
        return ApiResponse.success(count);
    }
}