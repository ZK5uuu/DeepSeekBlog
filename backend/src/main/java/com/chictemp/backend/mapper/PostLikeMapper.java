package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.PostLike;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PostLikeMapper {
    int insert(PostLike postLike);
    int delete(@Param("postId") Integer postId, @Param("userId") Integer userId);
    PostLike findByPostIdAndUserId(@Param("postId") Integer postId, @Param("userId") Integer userId);
    int countByPostId(Integer postId);
    List<Integer> findPostIdsByUserId(Integer userId);
}