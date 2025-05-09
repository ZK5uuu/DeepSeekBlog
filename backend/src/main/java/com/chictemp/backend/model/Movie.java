package com.chictemp.backend.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Movie {
    private Integer id;
    private String title;
    private String director;
    private Integer year;
    private String poster;
    private String description;
    private Double rating;
    private String trailer;
    private Integer viewCount;
    private String genreList; // Stored as comma-separated values
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Non-database fields
    private List<String> genre; // For API response
    private boolean isLiked; // For user-specific like status
    
    // Additional methods if needed
    public boolean isLiked() {
        return isLiked;
    }
    
    public void setIsLiked(boolean isLiked) {
        this.isLiked = isLiked;
    }
} 