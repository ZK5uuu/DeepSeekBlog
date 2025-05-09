package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.MusicStyle;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface MusicStyleMapper {
    List<MusicStyle> findAll();
    MusicStyle findById(Integer id);
    MusicStyle findByName(String name);
    List<MusicStyle> findByMusicBlogId(Integer musicBlogId);
    void insert(MusicStyle style);
    void update(MusicStyle style);
    void delete(Integer id);
    
    // 添加音乐风格关联
    void insertRelation(Integer musicBlogId, Integer styleId);
    
    // 删除音乐风格关联
    void deleteRelationByMusicBlogId(Integer musicBlogId);
} 