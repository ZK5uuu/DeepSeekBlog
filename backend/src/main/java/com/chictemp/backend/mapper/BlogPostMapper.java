package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.BlogPost;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface BlogPostMapper {
    BlogPost findById(Integer id);
    List<BlogPost> findAll();
    List<BlogPost> findByAuthorId(Integer authorId);
    List<BlogPost> findByTagId(Integer tagId);
    int insert(BlogPost blogPost);
    int update(BlogPost blogPost);
    int delete(Integer id);
    int countComments(Integer postId);
    int countLikes(Integer postId);
}