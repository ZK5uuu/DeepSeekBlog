package com.chictemp.backend.service;

public interface LikeService {
    boolean like(Integer postId, Integer userId);
    boolean unlike(Integer postId, Integer userId);
    boolean isLiked(Integer postId, Integer userId);
    int countByPostId(Integer postId);
}