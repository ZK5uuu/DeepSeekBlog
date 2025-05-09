package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.Tag;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface TagMapper {
    /**
     * 获取所有标签
     */
    List<Tag> findAll();
    
    /**
     * 根据ID获取标签
     */
    Tag findById(Integer id);
    
    /**
     * 根据名称获取标签
     */
    Tag findByName(String name);
    
    /**
     * 根据博客ID获取标签列表
     */
    List<Tag> findByPostId(Integer postId);
    
    /**
     * 新增标签
     */
    void insert(Tag tag);
    
    /**
     * 更新标签
     */
    void update(Tag tag);
    
    /**
     * 删除标签
     */
    void delete(Integer id);
    
    /**
     * 获取热门标签
     */
    List<Tag> findPopular(Integer limit);
}