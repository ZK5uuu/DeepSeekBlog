package com.chictemp.backend.controller;

import com.chictemp.backend.dto.ApiResponse;
import com.chictemp.backend.dto.BlogPostRequest;
import com.chictemp.backend.entity.BlogPost;
import com.chictemp.backend.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/posts")
public class BlogPostController {
    @Autowired
    private BlogPostService blogPostService;

    @GetMapping
    public ApiResponse<List<BlogPost>> getAll() {
        return ApiResponse.success(blogPostService.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<BlogPost> getById(@PathVariable Integer id) {
        BlogPost post = blogPostService.findById(id);
        if (post != null) {
            return ApiResponse.success(post);
        } else {
            return ApiResponse.error("文章不存在");
        }
    }

    @PostMapping
    public ApiResponse<BlogPost> create(@RequestBody BlogPostRequest request, @RequestHeader("User-Id") Integer userId) {
        try {
            BlogPost post = blogPostService.create(request, userId);
            return ApiResponse.success(post);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<BlogPost> update(@PathVariable Integer id, @RequestBody BlogPostRequest request) {
        try {
            BlogPost post = blogPostService.update(id, request);
            return ApiResponse.success(post);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Integer id) {
        boolean success = blogPostService.delete(id);
        if (success) {
            return ApiResponse.success(true);
        } else {
            return ApiResponse.error("删除失败");
        }
    }

    @GetMapping("/author/{authorId}")
    public ApiResponse<List<BlogPost>> getByAuthorId(@PathVariable Integer authorId) {
        return ApiResponse.success(blogPostService.findByAuthorId(authorId));
    }

    @GetMapping("/tag/{tagId}")
    public ApiResponse<List<BlogPost>> getByTagId(@PathVariable Integer tagId) {
        return ApiResponse.success(blogPostService.findByTagId(tagId));
    }
}