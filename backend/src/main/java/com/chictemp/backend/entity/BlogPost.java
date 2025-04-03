package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BlogPost {
    private Integer id;
    private String title;
    private Integer authorId;
    private String coverImageUrl;
    private String summary;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 非数据库字段
    private User author;
    private List<Tag> tags;
    private Integer likeCount;
    private Integer commentCount;
}