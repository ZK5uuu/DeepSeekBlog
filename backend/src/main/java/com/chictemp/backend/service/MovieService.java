package com.chictemp.backend.service;

import com.chictemp.backend.model.Movie;
import java.util.List;
import java.util.Map;

public interface MovieService {
    
    List<Movie> getMovieList(String sortBy, String order, int page, int pageSize);
    
    int countMovies();
    
    Movie getMovieById(int id);
    
    List<Movie> searchMovies(String query, int page, int pageSize);
    
    List<Movie> getMoviesByGenre(String genre, int page, int pageSize);
    
    List<String> getAllGenres();
    
    Map<String, Object> getMovieData(int page, int pageSize, String sortBy);
    
    int createMovie(Movie movie);
    
    int updateMovie(Movie movie);
    
    int deleteMovie(int id);
    
    // Additional methods
    Movie getMovieWithUserLikeStatus(int movieId, Integer userId);
    int incrementViewCount(int movieId);
    List<Movie> getUserLikedMovies(int userId, int page, int pageSize);
    boolean checkUserLikedMovie(int userId, int movieId);
    boolean toggleLikeMovie(int userId, int movieId);
    List<Movie> getRelatedMovies(int movieId);
} 