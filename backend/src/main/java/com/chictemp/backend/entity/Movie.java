package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Movie {
    private Integer id;
    private String title;
    private Integer year;
    private String poster;
    private String genreList; // 存储为逗号分隔的值
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 非数据库字段
    private List<String> genre; // 用于API响应
} 