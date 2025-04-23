package com.chictemp.backend.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Integer id;
    private String username;
    private String email;
    private String password;
    private String name;
    private String avatar;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}