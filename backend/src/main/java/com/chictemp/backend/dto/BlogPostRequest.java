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
}