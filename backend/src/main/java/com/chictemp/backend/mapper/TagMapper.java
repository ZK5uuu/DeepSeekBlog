package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.Tag;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface TagMapper {
    Tag findById(Integer id);
    Tag findByName(String name);
    List<Tag> findAll();
    List<Tag> findByPostId(Integer postId);
    int insert(Tag tag);
    int update(Tag tag);
    int delete(Integer id);
}