package com.chictemp.backend.controller;

import com.chictemp.backend.dto.ApiResponse;
import com.chictemp.backend.dto.MusicPostResponse;
import com.chictemp.backend.entity.MusicBlog;
import com.chictemp.backend.service.MusicBlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.logging.Level;

@RestController
public class MusicController {
    private static final Logger logger = Logger.getLogger(MusicController.class.getName());
    
    @Autowired
    private MusicBlogService musicBlogService;
    
    // 这个端点是给/music前端页面提供数据 - 主要接口
    @GetMapping("/api/posts/type/music")
    public ApiResponse<List<MusicPostResponse>> getMusicForPage() {
        try {
            logger.info("获取所有音乐博客给前端页面");
            List<MusicBlog> blogs = musicBlogService.findAll();
            
            if (blogs == null || blogs.isEmpty()) {
                logger.info("没有找到任何音乐博客数据");
                return ApiResponse.success(new ArrayList<>());
            }
            
            List<MusicPostResponse> response = musicBlogService.convertToMusicPostResponse(blogs);
            logger.info("成功获取音乐博客，数量: " + response.size());
            return ApiResponse.success(response);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "获取音乐博客失败: " + e.getMessage(), e);
            return ApiResponse.error("获取音乐博客列表失败: " + e.getMessage());
        }
    }

    // 下面是独立的音乐博客API接口
    @GetMapping("/api/music")
    public ApiResponse<List<MusicPostResponse>> getAllMusic() {
        try {
            logger.info("获取所有音乐博客");
            List<MusicBlog> blogs = musicBlogService.findAll();
            List<MusicPostResponse> response = musicBlogService.convertToMusicPostResponse(blogs);
            logger.info("成功获取音乐博客，数量: " + response.size());
            return ApiResponse.success(response);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "获取音乐博客失败: " + e.getMessage(), e);
            return ApiResponse.error("获取音乐博客列表失败: " + e.getMessage());
        }
    }
    
    // 创建新的音乐博客
    @PostMapping("/api/music")
    public ApiResponse<MusicBlog> createMusic(@RequestBody MusicBlog musicBlog) {
        try {
            logger.info("创建新的音乐博客: " + musicBlog.getTitle());
            MusicBlog createdBlog = musicBlogService.create(musicBlog);
            logger.info("音乐博客创建成功, ID: " + createdBlog.getId());
            return ApiResponse.success(createdBlog);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "创建音乐博客失败: " + e.getMessage(), e);
            return ApiResponse.error("创建音乐博客失败: " + e.getMessage());
        }
    }

    @GetMapping("/api/music/{id}")
    public ApiResponse<MusicPostResponse> getMusicById(@PathVariable Integer id) {
        try {
            logger.info("获取音乐博客详情, id=" + id);
            MusicBlog blog = musicBlogService.findById(id);
            if (blog != null) {
                List<MusicBlog> blogs = new ArrayList<>();
                blogs.add(blog);
                List<MusicPostResponse> response = musicBlogService.convertToMusicPostResponse(blogs);
                return ApiResponse.success(response.get(0));
            } else {
                return ApiResponse.error("音乐博客不存在");
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "获取音乐博客详情失败, id=" + id + ", 错误: " + e.getMessage(), e);
            return ApiResponse.error("获取音乐博客详情失败: " + e.getMessage());
        }
    }

    @PutMapping("/api/music/{id}")
    public ApiResponse<MusicPostResponse> putMusicById(@PathVariable Integer id, @RequestBody MusicBlog musicBlog) {
        try {
            logger.info("更新音乐博客详情, id=" + id);
            MusicBlog blog = musicBlogService.update(id, musicBlog);
            if (blog != null) {
                List<MusicBlog> blogs = new ArrayList<>();
                blogs.add(blog);
                List<MusicPostResponse> response = musicBlogService.convertToMusicPostResponse(blogs);
                return ApiResponse.success(response.get(0));
            } else {
                return ApiResponse.error("音乐博客不存在");
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "更新音乐博客详情失败, id=" + id + ", 错误: " + e.getMessage(), e);
            return ApiResponse.error("更新音乐博客详情失败: " + e.getMessage());
        }
    }

    @DeleteMapping("/api/music/{id}")
    public ApiResponse<Boolean> delMusicById(@PathVariable Integer id) {
        try {
            logger.info("更新音乐博客详情, id=" + id);
            boolean result = musicBlogService.delete(id);
            if (result) {
                return ApiResponse.success(result);
            } else {
                return ApiResponse.error("更新博客详情失败");
            }
        } catch (Exception e) {
            logger.log(Level.SEVERE, "更新音乐博客详情失败, id=" + id + ", 错误: " + e.getMessage(), e);
            return ApiResponse.error("更新音乐博客详情失败: " + e.getMessage());
        }
    }

    @PostMapping("/api/music/{id}/view")
    public ApiResponse<Boolean> incrementViewCount(@PathVariable Integer id) {
        try {
            logger.info("增加音乐博客浏览量, id=" + id);
            Integer newViewCount = musicBlogService.incrementViewCount(id);
            logger.info("音乐博客浏览量已增加, id=" + id + ", 新浏览量=" + newViewCount);
            return ApiResponse.success(true);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "增加音乐博客浏览量失败, id=" + id + ", 错误: " + e.getMessage(), e);
            return ApiResponse.error("增加浏览量失败: " + e.getMessage());
        }
    }

    @PostMapping("/api/music/{id}/like")
    public ApiResponse<Boolean> incrementLikeCount(@PathVariable Integer id) {
        try {
            logger.info("增加音乐博客点赞数, id=" + id);
            Integer newLikeCount = musicBlogService.incrementLikeCount(id);
            logger.info("音乐博客点赞数已增加, id=" + id + ", 新点赞数=" + newLikeCount);
            return ApiResponse.success(true);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "增加音乐博客点赞数失败, id=" + id + ", 错误: " + e.getMessage(), e);
            return ApiResponse.error("增加点赞数失败: " + e.getMessage());
        }
    }
    
    // 调试用的端点，显示原始数据
    @GetMapping("/api/music/debug")
    public ApiResponse<List<MusicBlog>> getDebugInfo() {
        try {
            logger.info("获取音乐博客调试信息");
            List<MusicBlog> blogs = musicBlogService.findAll();
            logger.info("成功获取音乐博客调试信息，数量: " + blogs.size());
            return ApiResponse.success(blogs);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "获取音乐博客调试信息失败: " + e.getMessage(), e);
            return ApiResponse.error("获取调试信息失败: " + e.getMessage());
        }
    }
} 