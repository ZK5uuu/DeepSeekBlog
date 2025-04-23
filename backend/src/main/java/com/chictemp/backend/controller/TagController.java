package com.chictemp.backend.controller;

import com.chictemp.backend.dto.ApiResponse;
import com.chictemp.backend.entity.Tag;
import com.chictemp.backend.mapper.TagMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
public class TagController {
    private static final Logger logger = LoggerFactory.getLogger(TagController.class);
    
    @Autowired
    private TagMapper tagMapper;

    /**
     * 获取所有标签
     */
    @GetMapping
    public ApiResponse<List<Tag>> getAll() {
        try {
            logger.info("获取所有标签");
            List<Tag> tags = tagMapper.findAll();
            return ApiResponse.success(tags);
        } catch (Exception e) {
            logger.error("获取标签列表失败", e);
            return ApiResponse.error("获取标签列表失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID获取标签
     */
    @GetMapping("/{id}")
    public ApiResponse<Tag> getById(@PathVariable Integer id) {
        try {
            logger.info("获取标签, id={}", id);
            Tag tag = tagMapper.findById(id);
            if (tag != null) {
                return ApiResponse.success(tag);
            } else {
                return ApiResponse.error("标签不存在");
            }
        } catch (Exception e) {
            logger.error("获取标签失败, id={}", id, e);
            return ApiResponse.error("获取标签失败: " + e.getMessage());
        }
    }

    /**
     * 创建标签
     */
    @PostMapping
    public ApiResponse<Tag> create(@RequestBody Tag tag) {
        try {
            logger.info("创建标签: {}", tag.getName());
            // 检查是否已存在同名标签
            Tag existingTag = tagMapper.findByName(tag.getName());
            if (existingTag != null) {
                return ApiResponse.error("标签名已存在");
            }
            tagMapper.insert(tag);
            return ApiResponse.success(tag);
        } catch (Exception e) {
            logger.error("创建标签失败", e);
            return ApiResponse.error("创建标签失败: " + e.getMessage());
        }
    }

    /**
     * 更新标签
     */
    @PutMapping("/{id}")
    public ApiResponse<Tag> update(@PathVariable Integer id, @RequestBody Tag tag) {
        try {
            logger.info("更新标签, id={}", id);
            Tag existingTag = tagMapper.findById(id);
            if (existingTag == null) {
                return ApiResponse.error("标签不存在");
            }
            tag.setId(id);
            tagMapper.update(tag);
            return ApiResponse.success(tag);
        } catch (Exception e) {
            logger.error("更新标签失败, id={}", id, e);
            return ApiResponse.error("更新标签失败: " + e.getMessage());
        }
    }

    /**
     * 删除标签
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(@PathVariable Integer id) {
        try {
            logger.info("删除标签, id={}", id);
            Tag existingTag = tagMapper.findById(id);
            if (existingTag == null) {
                return ApiResponse.error("标签不存在");
            }
            tagMapper.delete(id);
            return ApiResponse.success(true);
        } catch (Exception e) {
            logger.error("删除标签失败, id={}", id, e);
            return ApiResponse.error("删除标签失败: " + e.getMessage());
        }
    }

    /**
     * 获取热门标签
     */
    @GetMapping("/popular")
    public ApiResponse<List<Tag>> getPopular(@RequestParam(defaultValue = "10") Integer limit) {
        try {
            logger.info("获取热门标签, limit={}", limit);
            List<Tag> tags = tagMapper.findPopular(limit);
            return ApiResponse.success(tags);
        } catch (Exception e) {
            logger.error("获取热门标签失败", e);
            return ApiResponse.error("获取热门标签失败: " + e.getMessage());
        }
    }

    /**
     * 根据文章ID获取标签
     */
    @GetMapping("/post/{postId}")
    public ApiResponse<List<Tag>> getByPostId(@PathVariable Integer postId) {
        try {
            logger.info("获取文章标签, postId={}", postId);
            List<Tag> tags = tagMapper.findByPostId(postId);
            return ApiResponse.success(tags);
        } catch (Exception e) {
            logger.error("获取文章标签失败, postId={}", postId, e);
            return ApiResponse.error("获取文章标签失败: " + e.getMessage());
        }
    }
} 