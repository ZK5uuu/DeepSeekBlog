package com.chictemp.backend.service.impl;

import com.chictemp.backend.dto.BlogPostRequest;
import com.chictemp.backend.entity.BlogPost;
import com.chictemp.backend.entity.Tag;
import com.chictemp.backend.entity.User;
import com.chictemp.backend.mapper.BlogPostMapper;
import com.chictemp.backend.mapper.TagMapper;
import com.chictemp.backend.mapper.PostTagMapper;
import com.chictemp.backend.mapper.UserMapperExt;
import com.chictemp.backend.service.BlogPostService;
import com.chictemp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.logging.Level;

@Service
public class BlogPostServiceImpl implements BlogPostService {
    private static final Logger logger = Logger.getLogger(BlogPostServiceImpl.class.getName());

    @Autowired
    private BlogPostMapper blogPostMapper;

    @Autowired
    private UserService userService;
    
    @Autowired
    private TagMapper tagMapper;
    
    @Autowired
    private PostTagMapper postTagMapper;

    @Autowired
    private UserMapperExt userMapperExt;

    @Override
    public List<BlogPost> findAll() {
        List<BlogPost> posts = blogPostMapper.findAll();
        enrichPosts(posts);
        return posts;
    }

    @Override
    public BlogPost findById(Integer id) {
        if (id == null) {
            return null;
        }
        
        BlogPost post = blogPostMapper.findById(id);
        if (post != null) {
            enrichPost(post);
        }
        return post;
    }

    @Override
    @Transactional
    public BlogPost create(BlogPostRequest request, Integer userId) {
        // 验证用户
        User user = null;
        
        logger.info("创建博客 - 收到请求数据: " + request);
        logger.info("创建博客 - 封面图片URL: " + request.getCoverImageUrl());
        logger.info("创建博客 - 专辑图片URL: " + request.getAlbumImageUrl());
        
        // 检查用户是否存在
        try {
            user = userService.findByUsername("user" + userId);
        } catch (Exception e) {
            logger.warning("查找用户时出错: " + e.getMessage());
        }
        
        if (user == null) {
            // 如果用户不存在，创建默认用户
            user = new User();
            user.setUsername("user" + userId);
            user.setPassword("admin123"); // 默认密码
            user.setEmail("user" + userId + "@example.com"); // 设置默认邮箱
            user.setRole("user"); // 设置默认角色
            
            try {
                // 尝试保存用户
                user = userService.register(user);
                if (user == null) {
                    logger.warning("注册用户失败");
                }
            } catch (Exception e) {
                logger.warning("创建用户失败: " + e.getMessage());
                
                try {
                    // 关闭外键约束
                    userMapperExt.disableForeignKeyChecks();
                    // 直接插入固定ID的用户，提供非空email
                    userMapperExt.insertWithId(userId, "user" + userId, 
                        "$2a$10$X7GxU5rNT3p3FJFgQ5OvJeCzCL7KfoO4CIhB1Xw4X0N/D9KOzMT3K", 
                        "user" + userId + "@example.com");
                    
                    // 重新获取用户
                    user = userService.findByUsername("user" + userId);
                    if (user == null) {
                        // 如果还是获取不到，创建临时对象
                        user = new User();
                        user.setUsername("user" + userId);
                    }
                } catch (Exception ex) {
                    logger.severe("创建临时用户失败: " + ex.getMessage());
                    throw new RuntimeException("无法创建临时用户: " + ex.getMessage());
                } finally {
                    try {
                        // 重新启用外键约束
                        userMapperExt.enableForeignKeyChecks();
                    } catch (Exception ex) {
                        logger.warning("重新启用外键约束失败: " + ex.getMessage());
                    }
                }
            }
        }

        // 创建博客
        BlogPost post = new BlogPost();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        
        // 设置封面图片URL - 打印出URL值
        String coverImageUrl = request.getCoverImageUrl();
        logger.info("设置封面图片URL: " + coverImageUrl);
        if (coverImageUrl != null) {
            // 移除任何可能的不可见字符
            coverImageUrl = coverImageUrl.replaceAll("[\\u200B-\\u200D\\uFEFF]", "");
            logger.info("清理后的封面图片URL: " + coverImageUrl);
        }
        post.setCoverImageUrl(coverImageUrl);
        
        if (user.getId() != null) {
            post.setAuthorId(user.getId().intValue());
        } else {
            post.setAuthorId(userId);
        }
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        
        // 设置内容类型相关字段
        post.setContentType(request.getContentType());
        post.setArtistName(request.getArtistName());
        post.setAlbumName(request.getAlbumName());
        
        // 设置专辑封面图片URL - 打印出URL值
        String albumImageUrl = request.getAlbumImageUrl();
        logger.info("设置专辑封面图片URL: " + albumImageUrl);
        if (albumImageUrl != null) {
            // 移除任何可能的不可见字符
            albumImageUrl = albumImageUrl.replaceAll("[\\u200B-\\u200D\\uFEFF]", "");
            logger.info("清理后的专辑封面图片URL: " + albumImageUrl);
        }
        post.setAlbumImageUrl(albumImageUrl);
        
        post.setContentLink(request.getContentLink());
        
        // 尝试关闭外键约束插入博客
        try {
            blogPostMapper.insert(post);
        } catch (Exception e) {
            logger.warning("插入博客失败，尝试关闭外键约束: " + e.getMessage());
            
            try {
                // 关闭外键约束
                userMapperExt.disableForeignKeyChecks();
                // 重新插入
                blogPostMapper.insert(post);
            } finally {
                // 重新启用外键约束
                userMapperExt.enableForeignKeyChecks();
            }
        }
        
        // 处理标签
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            processPostTags(post.getId(), request.getTags());
        }
        
        // 补充作者信息和标签信息
        enrichPost(post);
        
        return post;
    }

    @Override
    @Transactional
    public BlogPost update(Integer id, BlogPostRequest request) {
        BlogPost post = blogPostMapper.findById(id);
        if (post == null) {
            throw new RuntimeException("文章不存在");
        }
        
        logger.info("更新博客 - 收到请求数据: " + request);
        logger.info("更新博客 - 封面图片URL: " + request.getCoverImageUrl());
        logger.info("更新博客 - 专辑图片URL: " + request.getAlbumImageUrl());
        
        // 更新博客信息
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        
        // 设置封面图片URL - 打印出URL值
        String coverImageUrl = request.getCoverImageUrl();
        logger.info("更新设置封面图片URL: " + coverImageUrl);
        if (coverImageUrl != null) {
            // 移除任何可能的不可见字符
            coverImageUrl = coverImageUrl.replaceAll("[\\u200B-\\u200D\\uFEFF]", "");
            logger.info("更新清理后的封面图片URL: " + coverImageUrl);
        }
        post.setCoverImageUrl(coverImageUrl);
        
        post.setUpdatedAt(LocalDateTime.now());
        
        // 更新内容类型相关字段
        post.setContentType(request.getContentType());
        post.setArtistName(request.getArtistName());
        post.setAlbumName(request.getAlbumName());
        
        // 设置专辑封面图片URL - 打印出URL值
        String albumImageUrl = request.getAlbumImageUrl();
        logger.info("更新设置专辑封面图片URL: " + albumImageUrl);
        if (albumImageUrl != null) {
            // 移除任何可能的不可见字符
            albumImageUrl = albumImageUrl.replaceAll("[\\u200B-\\u200D\\uFEFF]", "");
            logger.info("更新清理后的专辑封面图片URL: " + albumImageUrl);
        }
        post.setAlbumImageUrl(albumImageUrl);
        
        post.setContentLink(request.getContentLink());
        
        blogPostMapper.update(post);
        
        // 更新标签关系
        if (request.getTags() != null) {
            // 先删除旧关联
            postTagMapper.deleteByPostId(id);
            
            // 再添加新关联
            if (!request.getTags().isEmpty()) {
                processPostTags(id, request.getTags());
            }
        }
        
        // 补充作者信息和标签信息
        enrichPost(post);
        
        return post;
    }

    @Override
    @Transactional
    public boolean delete(Integer id) {
        try {
            blogPostMapper.delete(id);
            postTagMapper.deleteByPostId(id); // 删除关联的标签
            return true;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "删除博客时出错", e);
            return false;
        }
    }

    @Override
    public List<BlogPost> findByAuthorId(Integer authorId) {
        List<BlogPost> posts = blogPostMapper.findByAuthorId(authorId);
        enrichPosts(posts);
        return posts;
    }

    @Override
    public List<BlogPost> findByTagId(Integer tagId) {
        List<BlogPost> posts = blogPostMapper.findByTagId(tagId);
        enrichPosts(posts);
        return posts;
    }
    
    @Override
    public List<BlogPost> findByContentType(String contentType) {
        logger.info("查询内容类型博客: " + contentType);
        
        if (contentType == null || contentType.isEmpty()) {
            logger.warning("内容类型为空，返回空列表");
            return new ArrayList<>();
        }
        
        try {
            // 尝试直接查询（可能区分大小写）
            List<BlogPost> posts = blogPostMapper.findByContentType(contentType);
            logger.info("直接查询结果数量: " + (posts != null ? posts.size() : 0));
            
            // 如果没有结果，尝试不区分大小写的查询（全小写）
            if (posts == null || posts.isEmpty()) {
                String lowercaseType = contentType.toLowerCase();
                logger.info("尝试使用小写内容类型查询: " + lowercaseType);
                
                posts = blogPostMapper.findByContentType(lowercaseType);
                logger.info("小写查询结果数量: " + (posts != null ? posts.size() : 0));
                
                // 如果还是没有结果，尝试大写查询
                if (posts == null || posts.isEmpty()) {
                    String uppercaseType = contentType.toUpperCase();
                    logger.info("尝试使用大写内容类型查询: " + uppercaseType);
                    
                    posts = blogPostMapper.findByContentType(uppercaseType);
                    logger.info("大写查询结果数量: " + (posts != null ? posts.size() : 0));
                }
            }
            
            // 补充博客数据
            enrichPosts(posts);
            
            logger.info("返回内容类型博客结果，类型: " + contentType + ", 数量: " + (posts != null ? posts.size() : 0));
            return posts != null ? posts : new ArrayList<>();
            
        } catch (Exception e) {
            logger.severe("查询内容类型博客异常: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    @Override
    public Integer incrementViewCount(Integer id) {
        if (id == null) {
            return 0;
        }
        
        try {
            // 获取当前博客
            BlogPost post = blogPostMapper.findById(id);
            if (post == null) {
                return 0;
            }
            
            // 获取当前浏览量，如果为null则设为0
            Integer currentViewCount = post.getViewCount();
            if (currentViewCount == null) {
                currentViewCount = 0;
            }
            
            // 增加浏览量
            Integer newViewCount = currentViewCount + 1;
            post.setViewCount(newViewCount);
            
            // 更新数据库
            blogPostMapper.updateViewCount(id, newViewCount);
            
            return newViewCount;
        } catch (Exception e) {
            logger.log(Level.SEVERE, "增加浏览量时出错", e);
            return 0;
        }
    }
    
    /**
     * 处理博客的标签
     */
    private void processPostTags(Integer postId, List<String> tagNames) {
        for (String tagName : tagNames) {
            // 查找标签是否已存在
            Tag tag = tagMapper.findByName(tagName);
            
            // 如果标签不存在，则创建
            if (tag == null) {
                tag = new Tag();
                tag.setName(tagName);
                tagMapper.insert(tag);
            }
            
            // 创建博客-标签关联
            postTagMapper.insertRelation(postId, tag.getId());
        }
    }
    
    /**
     * 为博客列表补充信息
     */
    private void enrichPosts(List<BlogPost> posts) {
        if (posts == null || posts.isEmpty()) {
            return;
        }
        
        for (BlogPost post : posts) {
            enrichPost(post);
        }
    }
    
    /**
     * 为单个博客补充信息
     */
    private void enrichPost(BlogPost post) {
        if (post == null) {
            return;
        }
        
        // 补充作者信息
        if (post.getAuthorId() != null) {
            try {
                User user = userService.findByUsername("user" + post.getAuthorId());
                if (user != null) {
                    post.setAuthor(user);
                }
            } catch (Exception e) {
                logger.warning("获取作者信息失败: " + e.getMessage());
            }
        }
        
        // 补充标签信息
        List<Tag> tags = tagMapper.findByPostId(post.getId());
        post.setTags(tags);
        
        // 设置默认值为0
        post.setLikeCount(0);
        post.setCommentCount(0);
    }
}