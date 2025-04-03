package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.PostSummary;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface PostSummaryMapper {
    PostSummary findById(Integer id);
    PostSummary findByPostId(Integer postId);
    int insert(PostSummary postSummary);
    int update(PostSummary postSummary);
    int delete(Integer id);
}