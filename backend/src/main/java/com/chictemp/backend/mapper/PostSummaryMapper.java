package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.PostSummary;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostSummaryMapper {
    void insert(PostSummary summary);
    PostSummary findByPostId(Integer postId);
}