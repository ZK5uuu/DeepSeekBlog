package com.chictemp.backend.service;

import com.chictemp.backend.entity.BlogPost;
import com.chictemp.backend.dto.BlogPostRequest;
import java.util.List;

public interface BlogPostService {
    BlogPost findById(Integer id);
    List<BlogPost> findAll();
    List<BlogPost> findByAuthorId(Integer authorId);
    List<BlogPost> findByTagId(Integer tagId);
    List<BlogPost> findByContentType(String contentType);
    BlogPost create(BlogPostRequest request, Integer authorId);
    BlogPost update(Integer id, BlogPostRequest request);
    boolean delete(Integer id);
    Integer incrementViewCount(Integer id);
}