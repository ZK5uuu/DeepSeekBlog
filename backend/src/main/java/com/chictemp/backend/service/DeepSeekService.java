package com.chictemp.backend.service;

import com.chictemp.backend.entity.PostSummary;

public interface DeepSeekService {
    PostSummary generateSummary(Integer postId);
    PostSummary findByPostId(Integer postId);
}