package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.MusicBlog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface MusicBlogMapper {
    List<MusicBlog> findAll();
    MusicBlog findById(Integer id);
    void insert(MusicBlog musicBlog);
    void update(MusicBlog musicBlog);
    void delete(Integer id);
    
    /**
     * 更新文章浏览量
     * @param id 文章ID
     * @param viewCount 新的浏览量
     */
    void updateViewCount(@Param("id") Integer id, @Param("viewCount") Integer viewCount);
    
    /**
     * 更新点赞数
     * @param id 文章ID
     * @param likeCount 新的点赞数
     */
    void updateLikeCount(@Param("id") Integer id, @Param("likeCount") Integer likeCount);
} 