package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.PostTag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface PostTagMapper {
    /**
     * 创建博客-标签关联
     * @param postTag 博客-标签关联对象
     */
    void insert(PostTag postTag);
    
    /**
     * 创建博客-标签关联
     * @param postId 博客ID
     * @param tagId 标签ID
     */
    void insertRelation(@Param("postId") Integer postId, @Param("tagId") Integer tagId);
    
    /**
     * 删除博客的所有标签关联
     * @param postId 博客ID
     */
    void deleteByPostId(Integer postId);
    
    /**
     * 删除标签的所有博客关联
     * @param tagId 标签ID
     */
    void deleteByTagId(Integer tagId);

    List<PostTag> findByPostId(Integer postId);
    List<PostTag> findByTagId(Integer tagId);
}