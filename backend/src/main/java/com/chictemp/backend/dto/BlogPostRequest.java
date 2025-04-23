package com.chictemp.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class BlogPostRequest {
    private String title;
    private String coverImageUrl;
    private String summary;
    private String content;
    private List<String> tags;
    private String contentType = "blog"; // default: blog, options: book, movie, music
    private String artistName;  // 音乐评论专用
    private String albumName;   // 音乐评论专用
    private String albumImageUrl; // 音乐评论专用-专辑封面
    private String contentLink; // 外部链接
}