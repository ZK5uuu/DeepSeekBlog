package com.chictemp.backend.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface BookmarkMapper {
    void insert(Integer postId, Integer userId);
    void delete(Integer postId, Integer userId);
    Integer findByPostIdAndUserId(Integer postId, Integer userId);
    List<Integer> findPostIdsByUserId(Integer userId);
    int countByPostId(Integer postId);
} 