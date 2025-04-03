package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface CommentMapper {
    Comment findById(Integer id);
    List<Comment> findByPostId(Integer postId);
    List<Comment> findByUserId(Integer userId);
    int insert(Comment comment);
    int update(Comment comment);
    int delete(Integer id);
    int countByPostId(Integer postId);
}