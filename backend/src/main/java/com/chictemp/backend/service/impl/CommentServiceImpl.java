package com.chictemp.backend.service.impl;

import com.chictemp.backend.dto.CommentRequest;
import com.chictemp.backend.entity.Comment;
import com.chictemp.backend.entity.User;
import com.chictemp.backend.mapper.CommentMapper;
import com.chictemp.backend.service.BlogPostService;
import com.chictemp.backend.service.CommentService;
import com.chictemp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private BlogPostService blogPostService;

    @Autowired
    private UserService userService;

    @Override
    public Comment findById(Integer id) {
        // 实际项目中会从数据库查询
        // 这里简单返回模拟数据
        return id > 0 ? new Comment() : null;
    }

    @Override
    public List<Comment> findByPostId(Integer postId) {
        // 实际项目中会从数据库查询
        // 这里简单返回模拟数据
        return new ArrayList<>();
    }

    @Override
    public Comment create(CommentRequest request, Integer userId) {
        if (blogPostService.findById(request.getPostId()) == null) {
            throw new RuntimeException("文章不存在");
        }

        User user = userService.findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        Comment comment = new Comment();
        comment.setPostId(request.getPostId());
        comment.setContent(request.getContent());
        comment.setUserId(userId);
        comment.setCreatedAt(LocalDateTime.now());
        
        // 实际项目中会保存到数据库
        // commentMapper.insert(comment);
        comment.setId(1); // 模拟保存后生成ID
        
        return comment;
    }

    @Override
    public Comment update(Integer id, String content) {
        // 实际项目中会通过ID查询评论
        Comment comment = new Comment();
        comment.setId(id);
        comment.setContent(content);
        
        // 实际项目中会更新到数据库
        // commentMapper.update(comment);
        
        return comment;
    }

    @Override
    public boolean delete(Integer id) {
        // 实际项目中会从数据库删除
        // commentMapper.delete(id);
        
        return true;
    }
} 