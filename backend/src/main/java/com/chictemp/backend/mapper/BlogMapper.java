package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.Blog;
import com.chictemp.backend.entity.MusicBlog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BlogMapper {
    List<Blog> findAll();
    Blog findById(Integer id);
    void insert(Blog blog);
    void update(Blog blog);
    void delete(Integer id);
} 