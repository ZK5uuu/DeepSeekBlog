package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MusicStyle {
    private Integer id;
    private String name;
    private LocalDateTime createdAt;
} 