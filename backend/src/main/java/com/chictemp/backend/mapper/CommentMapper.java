package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface CommentMapper {
    Comment findById(Integer id);
    List<Comment> findByPostId(Integer postId);
    void insert(Comment comment);
    void update(Comment comment);
    void delete(Integer id);
}