package com.chictemp.backend.service;

import com.chictemp.backend.dto.MusicPostResponse;
import com.chictemp.backend.entity.MusicBlog;
import java.util.List;

public interface MusicBlogService {
    List<MusicBlog> findAll();
    MusicBlog findById(Integer id);
    MusicBlog create(MusicBlog musicBlog);
    MusicBlog update(Integer id, MusicBlog musicBlog);
    boolean delete(Integer id);
    Integer incrementViewCount(Integer id);
    Integer incrementLikeCount(Integer id);
    
    // 转换成前端需要的格式
    List<MusicPostResponse> convertToMusicPostResponse(List<MusicBlog> musicBlogs);
} 