package com.chictemp.backend.service.impl;

import com.chictemp.backend.mapper.MovieMapper;
import com.chictemp.backend.service.MovieService;
import com.chictemp.backend.util.MovieConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieMapper movieMapper;

    @Override
    public List<com.chictemp.backend.model.Movie> getMovieList(String sortBy, String order, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        String sortField = getSortField(sortBy);
        
        List<com.chictemp.backend.entity.Movie> entityMovies = movieMapper.getMovieList(sortField, order, offset, pageSize);
        return MovieConverter.toModelList(entityMovies);
    }

    private String getSortField(String sortBy) {
        switch (sortBy) {
            case "title": return "title";
            case "year": return "year";
            case "rating": return "rating";
            case "views": return "view_count";
            case "newest": return "id";
            default: return "id";
        }
    }

    @Override
    public int countMovies() {
        return movieMapper.countMovies();
    }

    @Override
    public com.chictemp.backend.model.Movie getMovieById(int id) {
        com.chictemp.backend.entity.Movie entityMovie = movieMapper.getMovieById(id);
        return MovieConverter.toModel(entityMovie);
    }

    @Override
    public List<com.chictemp.backend.model.Movie> searchMovies(String query, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        String sortField = "id";
        String order = "desc";
        
        List<com.chictemp.backend.entity.Movie> entityMovies = movieMapper.searchMovies(query, sortField, order, offset, pageSize);
        return MovieConverter.toModelList(entityMovies);
    }

    @Override
    public List<com.chictemp.backend.model.Movie> getMoviesByGenre(String genre, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        String sortField = "id";
        String order = "desc";
        
        List<com.chictemp.backend.entity.Movie> entityMovies = movieMapper.getMoviesByGenre(genre, sortField, order, offset, pageSize);
        return MovieConverter.toModelList(entityMovies);
    }

    @Override
    public List<String> getAllGenres() {
        return movieMapper.getAllGenres();
    }

    @Override
    public Map<String, Object> getMovieData(int page, int pageSize, String sortBy) {
        Map<String, Object> result = new HashMap<>();
        String order = "desc";
        
        List<com.chictemp.backend.model.Movie> movies = getMovieList(sortBy, order, page, pageSize);
        int total = countMovies();
        List<String> genres = getAllGenres();
        
        result.put("movies", movies);
        result.put("total", total);
        result.put("genres", genres);
        return result;
    }

    @Override
    public int createMovie(com.chictemp.backend.model.Movie movie) {
        com.chictemp.backend.entity.Movie entityMovie = MovieConverter.toEntity(movie);
        return movieMapper.insertMovie(entityMovie);
    }

    @Override
    public int updateMovie(com.chictemp.backend.model.Movie movie) {
        com.chictemp.backend.entity.Movie entityMovie = MovieConverter.toEntity(movie);
        return movieMapper.updateMovie(entityMovie);
    }

    @Override
    public int deleteMovie(int id) {
        return movieMapper.deleteMovie(id);
    }

    @Override
    public com.chictemp.backend.model.Movie getMovieWithUserLikeStatus(int movieId, Integer userId) {
        com.chictemp.backend.model.Movie movie = getMovieById(movieId);
        if (movie != null && userId != null) {
            boolean isLiked = checkUserLikedMovie(userId, movieId);
            movie.setIsLiked(isLiked);
        }
        return movie;
    }

    @Override
    public int incrementViewCount(int movieId) {
        return movieMapper.incrementViewCount(movieId);
    }

    @Override
    public List<com.chictemp.backend.model.Movie> getUserLikedMovies(int userId, int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        List<com.chictemp.backend.entity.Movie> entityMovies = movieMapper.getUserLikedMovies(userId, offset, pageSize);
        List<com.chictemp.backend.model.Movie> movies = MovieConverter.toModelList(entityMovies);
        
        // Mark all movies as liked
        for (com.chictemp.backend.model.Movie movie : movies) {
            movie.setIsLiked(true);
        }
        
        return movies;
    }

    @Override
    public boolean checkUserLikedMovie(int userId, int movieId) {
        return movieMapper.checkUserLikedMovie(userId, movieId) > 0;
    }

    @Override
    public boolean toggleLikeMovie(int userId, int movieId) {
        boolean isLiked = checkUserLikedMovie(userId, movieId);
        
        if (isLiked) {
            // Unlike the movie
            movieMapper.unlikeMovie(userId, movieId);
            return false;
        } else {
            // Like the movie
            movieMapper.likeMovie(userId, movieId);
            return true;
        }
    }

    @Override
    public List<com.chictemp.backend.model.Movie> getRelatedMovies(int movieId) {
        com.chictemp.backend.model.Movie movie = getMovieById(movieId);
        if (movie == null || movie.getGenre() == null || movie.getGenre().isEmpty()) {
            return new ArrayList<>();
        }
        
        // Get movies with similar genres
        List<com.chictemp.backend.model.Movie> relatedMovies = new ArrayList<>();
        for (String genre : movie.getGenre()) {
            List<com.chictemp.backend.model.Movie> genreMovies = getMoviesByGenre(genre, 1, 5);
            relatedMovies.addAll(genreMovies);
        }
        
        // Remove duplicates and the original movie
        return relatedMovies.stream()
                .filter(m -> m.getId() != movieId)
                .distinct()
                .limit(5)
                .collect(Collectors.toList());
    }
} 