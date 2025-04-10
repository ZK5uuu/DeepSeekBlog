package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.BlogPost;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface BlogPostMapper {
    List<BlogPost> findAll();
    BlogPost findById(Integer id);
    List<BlogPost> findByAuthorId(Integer authorId);
    List<BlogPost> findByTagId(Integer tagId);
    void insert(BlogPost post);
    void update(BlogPost post);
    void delete(Integer id);
    int countComments(Integer postId);
    int countLikes(Integer postId);
}