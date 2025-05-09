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
    private String contentType; // blog, book, movie, music
    private String artistName;  // 音乐评论专用
    private String albumName;   // 音乐评论专用
    private String albumImageUrl; // 音乐评论专用-专辑封面
    private String contentLink; // 外部链接
    private Integer viewCount; // 浏览量
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 非数据库字段
    private User author;
    private List<Tag> tags;
    private Integer likeCount;
    private Integer commentCount;
}