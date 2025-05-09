package com.chictemp.backend.service;

import com.chictemp.backend.entity.PostSummary;

public interface  DeepSeekService {
    String summarizeBlog(String blogContent);
    String summarizeBlog(String blogContent, Integer maxLength);
    PostSummary generateSummary(Integer postId);
    PostSummary findByPostId(Integer postId);
} 