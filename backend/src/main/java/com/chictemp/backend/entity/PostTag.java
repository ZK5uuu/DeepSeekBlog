package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostTag {
    private Integer id;
    private Integer postId;
    private Integer tagId;
    private LocalDateTime createdAt;
}