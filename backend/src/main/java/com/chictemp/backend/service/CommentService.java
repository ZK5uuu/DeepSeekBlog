package com.chictemp.backend.service;

import com.chictemp.backend.entity.Comment;
import com.chictemp.backend.dto.CommentRequest;
import java.util.List;

public interface CommentService {
    Comment findById(Integer id);
    List<Comment> findByPostId(Integer postId);
    Comment create(CommentRequest request, Integer userId);
    Comment update(Integer id, String content);
    boolean delete(Integer id);
}