package com.chictemp.backend.util;

import com.chictemp.backend.entity.Movie;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class to convert between entity and model Movie objects
 */
public class MovieConverter {

    /**
     * Convert entity Movie to model Movie
     */
    public static com.chictemp.backend.model.Movie toModel(Movie entity) {
        if (entity == null) return null;
        
        com.chictemp.backend.model.Movie model = new com.chictemp.backend.model.Movie();
        model.setId(entity.getId());
        model.setTitle(entity.getTitle());
        model.setYear(entity.getYear());
        model.setPoster(entity.getPoster());
        model.setGenreList(entity.getGenreList());
        model.setCreatedAt(entity.getCreatedAt());
        model.setUpdatedAt(entity.getUpdatedAt());
        
        // Process genre list if available
        if (entity.getGenreList() != null && !entity.getGenreList().isEmpty()) {
            List<String> genres = Arrays.asList(entity.getGenreList().split(","));
            model.setGenre(genres);
        }
        
        return model;
    }

    /**
     * Convert model Movie to entity Movie
     */
    public static Movie toEntity(com.chictemp.backend.model.Movie model) {
        if (model == null) return null;
        
        Movie entity = new Movie();
        entity.setId(model.getId());
        entity.setTitle(model.getTitle());
        entity.setYear(model.getYear());
        entity.setPoster(model.getPoster());
        
        // Convert genre list to comma-separated string if available
        if (model.getGenre() != null && !model.getGenre().isEmpty()) {
            String genreList = String.join(",", model.getGenre());
            entity.setGenreList(genreList);
        } else {
            entity.setGenreList(model.getGenreList());
        }
        
        entity.setCreatedAt(model.getCreatedAt());
        entity.setUpdatedAt(model.getUpdatedAt());
        
        return entity;
    }

    /**
     * Convert list of entity Movies to list of model Movies
     */
    public static List<com.chictemp.backend.model.Movie> toModelList(List<Movie> entities) {
        if (entities == null) return null;
        return entities.stream()
                .map(MovieConverter::toModel)
                .collect(Collectors.toList());
    }

    /**
     * Convert list of model Movies to list of entity Movies
     */
    public static List<Movie> toEntityList(List<com.chictemp.backend.model.Movie> models) {
        if (models == null) return null;
        return models.stream()
                .map(MovieConverter::toEntity)
                .collect(Collectors.toList());
    }
} 