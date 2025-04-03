package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.PostTag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PostTagMapper {
    int insert(PostTag postTag);
    int deleteByPostId(Integer postId);
    int deleteByTagId(Integer tagId);
    List<PostTag> findByPostId(Integer postId);
    List<PostTag> findByTagId(Integer tagId);
}