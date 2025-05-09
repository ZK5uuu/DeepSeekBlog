package com.chictemp.backend.controller;

import com.chictemp.backend.dto.ApiResponse;
import com.chictemp.backend.dto.BlogPostRequest;
import com.chictemp.backend.dto.MusicPostResponse;
import com.chictemp.backend.entity.BlogPost;
import com.chictemp.backend.entity.MusicBlog;
import com.chictemp.backend.service.BlogPostService;
import com.chictemp.backend.service.MusicBlogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/posts")
public class BlogPostController {
    private static final Logger logger = LoggerFactory.getLogger(BlogPostController.class);
    
    @Autowired
    private BlogPostService blogPostService;
    
    @Autowired
    private MusicBlogService musicBlogService;

    @GetMapping
    public ApiResponse<List<BlogPost>> getAll() {
        try {
            logger.info("获取所有博客");
            return ApiResponse.success(blogPostService.findAll());
        } catch (Exception e) {
            logger.error("获取所有博客失败", e);
            return ApiResponse.error("获取博客列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<BlogPost> getById(@PathVariable Integer id) {
        try {
            logger.info("获取博客详情, id={}", id);
            BlogPost post = blogPostService.findById(id);
            if (post != null) {
                return ApiResponse.success(post);
            } else {
                return ApiResponse.error("文章不存在");
            }
        } catch (Exception e) {
            logger.error("获取博客详情失败, id={}", id, e);
            return ApiResponse.error("获取博客详情失败: " + e.getMessage());
        }
    }

    @PostMapping
    @ResponseBody
    public ApiResponse<BlogPost> create(@RequestBody BlogPostRequest request, @RequestHeader(name = "User-Id", defaultValue = "1") Integer userId) {
        try {
            logger.info("创建博客请求开始, userId={}, title={}, coverImageUrl={}", 
                userId, request.getTitle(), request.getCoverImageUrl());
            
            // 清理URL中的不可见字符
            if (request.getCoverImageUrl() != null) {
                String cleanCoverUrl = request.getCoverImageUrl().replaceAll("[\\u200B-\\u200D\\uFEFF]", "");
                logger.info("原始封面URL: [{}], 清理后封面URL: [{}]", request.getCoverImageUrl(), cleanCoverUrl);
                request.setCoverImageUrl(cleanCoverUrl);
            }
            
            if (request.getAlbumImageUrl() != null) {
                String cleanAlbumUrl = request.getAlbumImageUrl().replaceAll("[\\u200B-\\u200D\\uFEFF]", "");
                logger.info("原始专辑封面URL: [{}], 清理后专辑封面URL: [{}]", request.getAlbumImageUrl(), cleanAlbumUrl);
                request.setAlbumImageUrl(cleanAlbumUrl);
            }
            
            BlogPost post = blogPostService.create(request, userId);
            logger.info("创建博客成功, id={}, coverImageUrl={}", post.getId(), post.getCoverImageUrl());
            return ApiResponse.success(post);
        } catch (Exception e) {
            logger.error("创建博客失败", e);
            // 返回更详细的错误信息给前端
            return ApiResponse.error("创建博客失败: " + e.getMessage() + (e.getCause() != null ? ": " + e.getCause().getMessage() : ""));
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<BlogPost> update(@PathVariable Integer id, @RequestBody BlogPostRequest request) {
        try {
            logger.info("更新博客请求开始, id={}, coverImageUrl={}", id, request.getCoverImageUrl());
            
            // 清理URL中的不可见字符
            if (request.getCoverImageUrl() != null) {
                String cleanCoverUrl = request.getCoverImageUrl().replaceAll("[\\u200B-\\u200D\\uFEFF]", "");
                logger.info("更新原始封面URL: [{}], 清理后封面URL: [{}]", request.getCoverImageUrl(), cleanCoverUrl);
                request.setCoverImageUrl(cleanCoverUrl);
            }
            
            if (request.getAlbumImageUrl() != null) {
                String cleanAlbumUrl = request.getAlbumImageUrl().replaceAll("[\\u200B-\\u200D\\uFEFF]", "");
                logger.info("更新原始专辑封面URL: [{}], 清理后专辑封面URL: [{}]", request.getAlbumImageUrl(), cleanAlbumUrl);
                request.setAlbumImageUrl(cleanAlbumUrl);
            }
            
            BlogPost post = blogPostService.update(id, request);
            logger.info("更新博客成功, id={}, coverImageUrl={}", post.getId(), post.getCoverImageUrl());
            return ApiResponse.success(post);
        } catch (Exception e) {
            logger.error("更新博客失败, id={}", id, e);
            return ApiResponse.error("更新博客失败: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Integer id) {
        try {
            logger.info("删除博客, id={}", id);
            boolean result = blogPostService.delete(id);
            if (result) {
                return ApiResponse.success(true);
            } else {
                return ApiResponse.error("博客不存在或删除失败");
            }
        } catch (Exception e) {
            logger.error("删除博客失败, id={}", id, e);
            return ApiResponse.error("删除博客失败: " + e.getMessage());
        }
    }

    @GetMapping("/author/{authorId}")
    public ApiResponse<List<BlogPost>> getByAuthorId(@PathVariable Integer authorId) {
        return ApiResponse.success(blogPostService.findByAuthorId(authorId));
    }

    @GetMapping("/tag/{tagId}")
    public ApiResponse<List<BlogPost>> getByTagId(@PathVariable Integer tagId) {
        return ApiResponse.success(blogPostService.findByTagId(tagId));
    }

    @GetMapping("/type/{contentType}")
    public ApiResponse<?> getByContentType(@PathVariable String contentType) {
        try {
            logger.info("获取特定类型的内容: contentType=" + contentType);
            
            // 如果是音乐类型，优先使用music_blogs表
            if ("music".equalsIgnoreCase(contentType)) {
                logger.info("查询music_blogs表获取音乐数据");
                List<MusicBlog> musicBlogs = musicBlogService.findAll();
                if (musicBlogs != null && !musicBlogs.isEmpty()) {
                    List<MusicPostResponse> musicPosts = musicBlogService.convertToMusicPostResponse(musicBlogs);
                    logger.info("从music_blogs表转换数据成功，条数: " + musicPosts.size());
                    return ApiResponse.success(musicPosts);
                }
                
                logger.info("music_blogs表为空，尝试从传统博客表获取");
            }
            
            // 获取博客表中的数据
            List<BlogPost> posts = blogPostService.findByContentType(contentType);
            logger.info("从博客表获取到的数据数量: " + posts.size());
            
            // 如果是音乐类型，需要手动转换为MusicPostResponse格式
            if ("music".equalsIgnoreCase(contentType)) {
                logger.info("转换为音乐评论格式, 文章数量: " + posts.size());
                
                // 手动转换为MusicPostResponse格式
                List<MusicPostResponse> musicPosts = posts.stream().map(post -> {
                    MusicPostResponse response = new MusicPostResponse();
                    response.setId(post.getId().toString());
                    response.setTitle(post.getTitle());
                    response.setContent(post.getContent());
                    response.setCover_image_url(post.getAlbumImageUrl() != null ? 
                                               post.getAlbumImageUrl() : post.getCoverImageUrl());
                    response.setCoverImageUrl(response.getCover_image_url());
                    response.setArtist_name(post.getArtistName() != null ? post.getArtistName() : "未知艺术家");
                    response.setArtistName(response.getArtist_name());
                    response.setAlbum_name(post.getAlbumName() != null ? post.getAlbumName() : "未知专辑");
                    response.setAlbumName(response.getAlbum_name());
                    response.setUsername(post.getAuthor() != null ? post.getAuthor().getUsername() : "管理员");
                    response.setViewCount(post.getViewCount() != null ? post.getViewCount() : 0);
                    response.setViews(response.getViewCount());
                    response.setLikeCount(post.getLikeCount() != null ? post.getLikeCount() : 0);
                    response.setLikes(response.getLikeCount());
                    response.setContentType("music");
                    return response;
                }).collect(Collectors.toList());
                
                return ApiResponse.success(musicPosts);
            }
            
            // 其他类型返回原始格式
            return ApiResponse.success(posts);
        } catch (Exception e) {
            logger.error("获取特定类型内容失败: contentType=" + contentType, e);
            return ApiResponse.error("获取内容失败: " + e.getMessage());
        }
    }

    @GetMapping("/recommend")
    public ApiResponse<List<BlogPost>> getRecommendPosts(@RequestParam(defaultValue = "5") Integer limit) {
        try {
            logger.info("获取推荐博客, limit={}", limit);
            // 简单实现：返回最新的几篇文章作为推荐
            List<BlogPost> posts = blogPostService.findAll();
            // 限制返回数量
            int size = Math.min(limit, posts.size());
            return ApiResponse.success(posts.subList(0, size));
        } catch (Exception e) {
            logger.error("获取推荐博客失败", e);
            return ApiResponse.error("获取推荐博客列表失败: " + e.getMessage());
        }
    }
    
    // 用于测试修复封面图片URL的端点
    @PostMapping("/fix-cover/{id}")
    public ApiResponse<BlogPost> fixCoverImage(@PathVariable Integer id, @RequestParam String coverUrl) {
        try {
            logger.info("修复博客封面图片, id={}, newUrl={}", id, coverUrl);
            
            // 获取现有博客
            BlogPost post = blogPostService.findById(id);
            if (post == null) {
                return ApiResponse.error("博客不存在");
            }
            
            // 使用现有数据构建请求
            BlogPostRequest request = new BlogPostRequest();
            request.setTitle(post.getTitle());
            request.setSummary(post.getSummary());
            request.setContent(post.getContent());
            request.setContentType(post.getContentType());
            request.setArtistName(post.getArtistName());
            request.setAlbumName(post.getAlbumName());
            request.setAlbumImageUrl(post.getAlbumImageUrl());
            request.setContentLink(post.getContentLink());
            
            // 设置新的封面URL
            request.setCoverImageUrl(coverUrl);
            
            // 更新博客
            BlogPost updatedPost = blogPostService.update(id, request);
            return ApiResponse.success(updatedPost);
        } catch (Exception e) {
            logger.error("修复博客封面图片失败, id={}", id, e);
            return ApiResponse.error("修复封面图片失败: " + e.getMessage());
        }
    }

    // 增加文章浏览量
    @PostMapping("/{id}/view")
    public ApiResponse<Boolean> incrementViewCount(@PathVariable Integer id) {
        try {
            logger.info("增加文章浏览量, id={}", id);
            // 调用服务层方法增加浏览量
            Integer newViewCount = blogPostService.incrementViewCount(id);
            logger.info("文章浏览量已增加, id={}, 新浏览量={}", id, newViewCount);
            return ApiResponse.success(true);
        } catch (Exception e) {
            logger.error("增加文章浏览量失败, id={}", id, e);
            return ApiResponse.error("增加浏览量失败: " + e.getMessage());
        }
    }
}