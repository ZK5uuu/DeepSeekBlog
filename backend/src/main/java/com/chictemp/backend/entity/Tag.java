package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Tag {
    private Integer id;
    private String name;
    private LocalDateTime createdAt;
    
    // 非数据库字段
    private Integer postCount; // 使用该标签的文章数量
}