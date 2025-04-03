package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.PostBookmark;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PostBookmarkMapper {
    int insert(PostBookmark postBookmark);
    int delete(@Param("postId") Integer postId, @Param("userId") Integer userId);
    PostBookmark findByPostIdAndUserId(@Param("postId") Integer postId, @Param("userId") Integer userId);
    int countByPostId(Integer postId);
    List<Integer> findPostIdsByUserId(Integer userId);
}