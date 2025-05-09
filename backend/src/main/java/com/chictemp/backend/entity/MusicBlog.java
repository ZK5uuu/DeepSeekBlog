package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MusicBlog {
    private Integer id;
    private String title;
    private String content;
    private String coverImageUrl;
    private String artistName;
    private String albumName;
    private String albumImageUrl;
    private String contentLink;
    private Integer viewCount;
    private Integer likeCount;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 