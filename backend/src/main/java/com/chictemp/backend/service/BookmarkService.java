package com.chictemp.backend.service;

public interface BookmarkService {
    boolean bookmark(Integer postId, Integer userId);
    boolean unbookmark(Integer postId, Integer userId);
    boolean isBookmarked(Integer postId, Integer userId);
    int countByPostId(Integer postId);
}