package com.chictemp.backend.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LikeMapper {
    void insert(Integer postId, Integer userId);
    void delete(Integer postId, Integer userId);
    Integer findByPostIdAndUserId(Integer postId, Integer userId);
    int countByPostId(Integer postId);
} 