package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostSummary {
    private Integer id;
    private Integer postId;
    private String content;
    private LocalDateTime createdAt;
}