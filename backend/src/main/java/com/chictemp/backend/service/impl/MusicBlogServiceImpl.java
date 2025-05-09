package com.chictemp.backend.service.impl;

import com.chictemp.backend.dto.MusicPostResponse;
import com.chictemp.backend.entity.MusicBlog;
import com.chictemp.backend.mapper.MusicBlogMapper;
import com.chictemp.backend.service.MusicBlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;
import java.util.logging.Level;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@Service
public class MusicBlogServiceImpl implements MusicBlogService {
    private static final Logger logger = Logger.getLogger(MusicBlogServiceImpl.class.getName());

    @Autowired
    private MusicBlogMapper musicBlogMapper;

    @Override
    public List<MusicBlog> findAll() {
        logger.info("获取所有音乐博客");
        return musicBlogMapper.findAll();
    }

    @Override
    public MusicBlog findById(Integer id) {
        logger.info("获取音乐博客详情, id=" + id);
        if (id == null) {
            return null;
        }
        
        return musicBlogMapper.findById(id);
    }

    @Override
    @Transactional
    public MusicBlog create(MusicBlog musicBlog) {
        logger.info("创建音乐博客, title=" + musicBlog.getTitle());
        
        // 设置初始值
        if (musicBlog.getViewCount() == null) {
            musicBlog.setViewCount(0);
        }
        if (musicBlog.getLikeCount() == null) {
            musicBlog.setLikeCount(0);
        }
        if (musicBlog.getUsername() == null || musicBlog.getUsername().isEmpty()) {
            musicBlog.setUsername("管理员");
        }
        
        musicBlogMapper.insert(musicBlog);
        return musicBlog;
    }

    @Override
    @Transactional
    public MusicBlog update(Integer id, MusicBlog musicBlog) {
        logger.info("更新音乐博客, id=" + id);
        
        MusicBlog existingBlog = musicBlogMapper.findById(id);
        if (existingBlog == null) {
            throw new RuntimeException("音乐博客不存在");
        }
        
        // 更新属性
        musicBlog.setId(id);
        musicBlog.setCreatedAt(existingBlog.getCreatedAt());
        musicBlog.setViewCount(existingBlog.getViewCount());
        musicBlog.setLikeCount(existingBlog.getLikeCount());
        
        musicBlogMapper.update(musicBlog);
        return musicBlog;
    }

    @Override
    @Transactional
    public boolean delete(Integer id) {
        logger.info("删除音乐博客, id=" + id);
        
        MusicBlog blog = musicBlogMapper.findById(id);
        if (blog == null) {
            return false;
        }
        
        musicBlogMapper.delete(id);
        return true;
    }

    @Override
    public Integer incrementViewCount(Integer id) {
        if (id == null) {
            return 0;
        }
        
        try {
            logger.info("增加音乐博客浏览量, id=" + id);
            // 获取当前博客
            MusicBlog blog = musicBlogMapper.findById(id);
            if (blog == null) {
                return 0;
            }
            
            // 获取当前浏览量，如果为null则设为0
            Integer currentViewCount = blog.getViewCount();
            if (currentViewCount == null) {
                currentViewCount = 0;
            }
            
            // 增加浏览量
            Integer newViewCount = currentViewCount + 1;
            
            // 更新数据库
            musicBlogMapper.updateViewCount(id, newViewCount);
            
            return newViewCount;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "增加浏览量失败: " + e.getMessage(), e);
            return 0;
        }
    }

    @Override
    public Integer incrementLikeCount(Integer id) {
        if (id == null) {
            return 0;
        }
        
        try {
            logger.info("增加音乐博客点赞数, id=" + id);
            // 获取当前博客
            MusicBlog blog = musicBlogMapper.findById(id);
            if (blog == null) {
                return 0;
            }
            
            // 获取当前点赞数，如果为null则设为0
            Integer currentLikeCount = blog.getLikeCount();
            if (currentLikeCount == null) {
                currentLikeCount = 0;
            }
            
            // 增加点赞数
            Integer newLikeCount = currentLikeCount + 1;
            
            // 更新数据库
            musicBlogMapper.updateLikeCount(id, newLikeCount);
            
            return newLikeCount;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "增加点赞数失败: " + e.getMessage(), e);
            return 0;
        }
    }

    @Override
    public List<MusicPostResponse> convertToMusicPostResponse(List<MusicBlog> musicBlogs) {
        logger.info("转换音乐博客为前端响应格式, 数量=" + (musicBlogs != null ? musicBlogs.size() : 0));
        if (musicBlogs == null || musicBlogs.isEmpty()) {
            return new ArrayList<>();
        }
        
        return musicBlogs.stream()
                .map(this::convertToMusicPostResponse)
                .collect(Collectors.toList());
    }
    
    private MusicPostResponse convertToMusicPostResponse(MusicBlog blog) {
        MusicPostResponse response = new MusicPostResponse();
        response.setId(blog.getId().toString());
        response.setTitle(blog.getTitle());
        response.setContent(blog.getContent());
        
        // 使用专辑封面作为封面图片，如果没有则使用博客封面
        response.setCover_image_url(
            blog.getAlbumImageUrl() != null && !blog.getAlbumImageUrl().isEmpty() 
            ? blog.getAlbumImageUrl() 
            : blog.getCoverImageUrl()
        );
        
        // 为前端兼容设置字段
        response.setCoverImageUrl(response.getCover_image_url());
        
        // 格式化日期时间为ISO 8601格式
        response.setCreate_time(
            blog.getCreatedAt() != null 
            ? blog.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) 
            : LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
        
        // 为前端兼容设置字段
        response.setCreatedAt(response.getCreate_time());
        
        response.setViews(blog.getViewCount() != null ? blog.getViewCount() : 0);
        response.setViewCount(response.getViews()); // 兼容字段
        
        response.setLiked(false); // 默认值
        response.setLikes(blog.getLikeCount() != null ? blog.getLikeCount() : 0);
        response.setLikeCount(response.getLikes()); // 兼容字段
        
        response.setArtist_name(blog.getArtistName() != null ? blog.getArtistName() : "未知艺术家");
        response.setArtistName(response.getArtist_name()); // 兼容字段
        
        response.setAlbum_name(blog.getAlbumName() != null ? blog.getAlbumName() : "未知专辑");
        response.setAlbumName(response.getAlbum_name()); // 兼容字段
        
        // 添加专辑封面兼容字段
        response.setAlbum_image_url(blog.getAlbumImageUrl());
        response.setAlbumImageUrl(blog.getAlbumImageUrl());
        
        // 添加默认音乐风格
        response.setMusic_styles(Arrays.asList("电子", "流行"));
        
        // 为前端兼容设置标签
        response.setTags(response.getMusic_styles().stream()
                .map(style -> {
                    Map<String, String> tag = new HashMap<>();
                    tag.put("name", style);
                    return tag;
                })
                .collect(Collectors.toList()));
        
        // 设置用户名
        response.setUsername(blog.getUsername() != null ? blog.getUsername() : "匿名用户");
        
        // 为前端兼容设置作者字段
        Map<String, Object> author = new HashMap<>();
        author.put("id", 1);
        author.put("username", response.getUsername());
        response.setAuthor(author);
        
        // 设置内容类型
        response.setContentType("music");
        
        return response;
    }
} 