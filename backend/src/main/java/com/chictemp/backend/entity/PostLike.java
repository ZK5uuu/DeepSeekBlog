package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostLike {
    private Integer postId;
    private Integer userId;
    private LocalDateTime createdAt;
}