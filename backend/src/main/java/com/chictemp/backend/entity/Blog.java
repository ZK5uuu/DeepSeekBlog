package com.chictemp.backend.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Blog {
    private Integer id;
    private String userName;
    private String artistName;
    private String content;
    private LocalDateTime createdTime;
    private LocalDateTime modifyTime;
    private String opus;
    private String album;
    private String aiContend;
} 