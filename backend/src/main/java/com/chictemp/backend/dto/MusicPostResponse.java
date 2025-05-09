package com.chictemp.backend.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class MusicPostResponse {
    // 原始字段(下划线风格)
    private String id;
    private String title;
    private String content;
    private String cover_image_url;
    private String create_time;
    private int views;
    private boolean liked;
    private int likes;
    private String artist_name;
    private String album_name;
    private String album_image_url;
    private List<String> music_styles;
    private String username;
    
    // 兼容字段(驼峰风格)
    private String coverImageUrl;
    private String createdAt;
    private int viewCount;
    private int likeCount;
    private String artistName;
    private String albumName;
    private String albumImageUrl;
    private String contentType;
    private List<Map<String, String>> tags;
    private Map<String, Object> author;
} 