package com.chictemp.backend.service.impl;

import com.chictemp.backend.dto.BlogPostRequest;
import com.chictemp.backend.entity.BlogPost;
import com.chictemp.backend.entity.User;
import com.chictemp.backend.mapper.BlogPostMapper;
import com.chictemp.backend.service.BlogPostService;
import com.chictemp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BlogPostServiceImpl implements BlogPostService {

    @Autowired
    private BlogPostMapper blogPostMapper;

    @Autowired
    private UserService userService;

    @Override
    public List<BlogPost> findAll() {
        // 实际项目中会从数据库查询
        // 这里简单返回模拟数据
        return new ArrayList<>();
    }

    @Override
    public BlogPost findById(Integer id) {
        // 实际项目中会从数据库查询
        // 这里简单返回模拟数据
        return id > 0 ? new BlogPost() : null;
    }

    @Override
    public BlogPost create(BlogPostRequest request, Integer userId) {
        User user = userService.findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        BlogPost post = new BlogPost();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthorId(userId);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        // 实际项目中会保存到数据库
        // blogPostMapper.insert(post);
        post.setId(1); // 模拟保存后生成ID
        
        return post;
    }

    @Override
    public BlogPost update(Integer id, BlogPostRequest request) {
        BlogPost post = findById(id);
        if (post == null) {
            throw new RuntimeException("文章不存在");
        }
        
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setUpdatedAt(LocalDateTime.now());
        
        // 实际项目中会更新到数据库
        // blogPostMapper.update(post);
        
        return post;
    }

    @Override
    public boolean delete(Integer id) {
        BlogPost post = findById(id);
        if (post == null) {
            return false;
        }
        
        // 实际项目中会从数据库删除
        // blogPostMapper.delete(id);
        
        return true;
    }

    @Override
    public List<BlogPost> findByAuthorId(Integer authorId) {
        // 实际项目中会从数据库查询
        return new ArrayList<>();
    }

    @Override
    public List<BlogPost> findByTagId(Integer tagId) {
        // 实际项目中会从数据库查询
        return new ArrayList<>();
    }
}