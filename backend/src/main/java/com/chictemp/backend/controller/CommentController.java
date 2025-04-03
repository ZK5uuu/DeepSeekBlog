package com.chictemp.backend.controller;

import com.chictemp.backend.dto.ApiResponse;
import com.chictemp.backend.dto.CommentRequest;
import com.chictemp.backend.entity.Comment;
import com.chictemp.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}")
    public ApiResponse<List<Comment>> getByPostId(@PathVariable Integer postId) {
        return ApiResponse.success(commentService.findByPostId(postId));
    }

    @PostMapping
    public ApiResponse<Comment> create(@RequestBody CommentRequest request, @RequestHeader("User-Id") Integer userId) {
        try {
            Comment comment = commentService.create(request, userId);
            return ApiResponse.success(comment);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<Comment> update(@PathVariable Integer id, @RequestBody String content) {
        try {
            Comment comment = commentService.update(id, content);
            return ApiResponse.success(comment);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Integer id) {
        boolean success = commentService.delete(id);
        if (success) {
            return ApiResponse.success(true);
        } else {
            return ApiResponse.error("删除失败");
        }
    }
}