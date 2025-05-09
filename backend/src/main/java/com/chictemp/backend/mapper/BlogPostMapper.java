package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.BlogPost;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface BlogPostMapper {
    List<BlogPost> findAll();
    BlogPost findById(Integer id);
    List<BlogPost> findByAuthorId(Integer authorId);
    List<BlogPost> findByTagId(Integer tagId);
    List<BlogPost> findByContentType(String contentType);
    void insert(BlogPost post);
    void update(BlogPost post);
    void delete(Integer id);
    
    /**
     * 更新文章浏览量
     * @param id 文章ID
     * @param viewCount 新的浏览量
     */
    void updateViewCount(@Param("id") Integer id, @Param("viewCount") Integer viewCount);
}