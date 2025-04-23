package com.chictemp.backend.dto;

import com.chictemp.backend.entity.BlogPost;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class MusicPostResponse {
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
    private List<String> music_styles;
    private String username;

    // 从BlogPost实体转换为MusicPostResponse
    public static MusicPostResponse fromBlogPost(BlogPost post) {
        MusicPostResponse response = new MusicPostResponse();
        response.setId(post.getId().toString());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        
        // 使用专辑封面作为封面图片，如果没有则使用博客封面
        response.setCover_image_url(
            post.getAlbumImageUrl() != null && !post.getAlbumImageUrl().isEmpty() 
            ? post.getAlbumImageUrl() 
            : post.getCoverImageUrl()
        );
        
        // 格式化日期时间为ISO 8601格式
        response.setCreate_time(
            post.getCreatedAt() != null 
            ? post.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME) 
            : LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
        
        // 使用实际的浏览量数据
        response.setViews(post.getViewCount() != null ? post.getViewCount() : 0);
        
        response.setLiked(false); // 默认值
        response.setLikes(post.getLikeCount() != null ? post.getLikeCount() : 0);
        response.setArtist_name(post.getArtistName() != null ? post.getArtistName() : "未知艺术家");
        response.setAlbum_name(post.getAlbumName() != null ? post.getAlbumName() : "未知专辑");
        
        // 从标签转换为音乐风格
        if (post.getTags() != null && !post.getTags().isEmpty()) {
            response.setMusic_styles(
                post.getTags().stream()
                    .map(tag -> tag.getName())
                    .collect(Collectors.toList())
            );
        } else {
            // 默认音乐风格
            response.setMusic_styles(Arrays.asList("未分类"));
        }
        
        // 设置用户名
        response.setUsername(
            post.getAuthor() != null && post.getAuthor().getUsername() != null 
            ? post.getAuthor().getUsername() 
            : "匿名用户"
        );
        
        return response;
    }
    
    // 将BlogPost列表转换为MusicPostResponse列表
    public static List<MusicPostResponse> fromBlogPostList(List<BlogPost> posts) {
        return posts.stream()
            .map(MusicPostResponse::fromBlogPost)
            .collect(Collectors.toList());
    }
} 