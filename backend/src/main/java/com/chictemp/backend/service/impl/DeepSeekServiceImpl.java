package com.chictemp.backend.service.impl;

import com.chictemp.backend.entity.BlogPost;
import com.chictemp.backend.entity.PostSummary;
import com.chictemp.backend.mapper.PostSummaryMapper;
import com.chictemp.backend.service.BlogPostService;
import com.chictemp.backend.service.DeepSeekService;
import com.chictemp.backend.util.DeepSeekClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;

import java.time.LocalDateTime;

@Service
public class DeepSeekServiceImpl implements DeepSeekService {

    private static final Logger logger = LoggerFactory.getLogger(DeepSeekServiceImpl.class);

    @Autowired
    private PostSummaryMapper postSummaryMapper;

    @Autowired
    private BlogPostService blogPostService;
    
    @Autowired
    private DeepSeekClient deepSeekClient;

    @Override
    public String summarizeBlog(String blogContent) {
        try {
            return deepSeekClient.generateSummary(blogContent);
        } catch (Exception e) {
            logger.error("调用DeepSeek API生成摘要时出错", e);
            return "摘要生成失败，请稍后再试";
        }
    }

    @Override
    public String summarizeBlog(String blogContent, Integer maxLength) {
        try {
            return deepSeekClient.generateSummary(blogContent, maxLength);
        } catch (Exception e) {
            logger.error("调用DeepSeek API生成摘要时出错", e);
            return "摘要生成失败，请稍后再试";
        }
    }

    @Override
    public PostSummary generateSummary(Integer postId) {
        BlogPost post = blogPostService.findById(postId);
        if (post == null) {
            throw new RuntimeException("文章不存在");
        }

        // 先检查是否已存在摘要
        PostSummary existingSummary = findByPostId(postId);
        if (existingSummary != null) {
            return existingSummary;
        }

        // 调用DeepSeek API生成摘要
        String summaryContent = deepSeekClient.generateSummary(post.getContent());
        
        PostSummary summary = new PostSummary();
        summary.setPostId(postId);
        summary.setContent(summaryContent);
        summary.setCreatedAt(LocalDateTime.now());
        
        // 保存到数据库
        postSummaryMapper.insert(summary);
        
        return summary;
    }

    @Override
    public PostSummary findByPostId(Integer postId) {
        // 从数据库查询
        return postSummaryMapper.findByPostId(postId);
    }
} 