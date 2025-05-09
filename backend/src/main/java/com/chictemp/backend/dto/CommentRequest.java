package com.chictemp.backend.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private Integer postId;
    private String content;
}