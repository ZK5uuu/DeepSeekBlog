package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Tag {
    private Integer id;
    private String name;
    private LocalDateTime createdAt;
}