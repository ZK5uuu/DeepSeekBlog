package com.chictemp.backend.controller;

import com.chictemp.backend.model.Movie;
import com.chictemp.backend.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    /**
     * 获取电影列表
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getMovies(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "DESC") String order) {
        
        List<Movie> movies = movieService.getMovieList(sortBy, order, page, size);
        int total = movieService.countMovies();
        
        Map<String, Object> response = new HashMap<>();
        response.put("movies", movies);
        response.put("currentPage", page);
        response.put("totalItems", total);
        response.put("totalPages", (int) Math.ceil((double) total / size));
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取单个电影详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovie(@PathVariable int id) {
        Movie movie = movieService.getMovieById(id);
        if (movie != null) {
            return ResponseEntity.ok(movie);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 创建新电影
     */
    @PostMapping
    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie) {
        int result = movieService.createMovie(movie);
        if (result > 0) {
            return ResponseEntity.status(HttpStatus.CREATED).body(movie);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 更新电影信息
     */
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable int id, @RequestBody Movie movie) {
        Movie existingMovie = movieService.getMovieById(id);
        if (existingMovie == null) {
            return ResponseEntity.notFound().build();
        }
        
        movie.setId(id);
        int result = movieService.updateMovie(movie);
        if (result > 0) {
            return ResponseEntity.ok(movie);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 删除电影
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable int id) {
        int result = movieService.deleteMovie(id);
        if (result > 0) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 根据关键词搜索电影
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<Movie> movies = movieService.searchMovies(query, page, size);
        
        Map<String, Object> response = new HashMap<>();
        response.put("movies", movies);
        response.put("currentPage", page);
        response.put("query", query);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取所有电影类型（去重）
     */
    @GetMapping("/genres")
    public ResponseEntity<List<String>> getAllGenres() {
        List<String> genres = movieService.getAllGenres();
        return ResponseEntity.ok(genres);
    }
    
    /**
     * 根据类型筛选电影
     */
    @GetMapping("/genre/{genre}")
    public ResponseEntity<Map<String, Object>> getMoviesByGenre(
            @PathVariable String genre,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<Movie> movies = movieService.getMoviesByGenre(genre, page, size);
        
        Map<String, Object> response = new HashMap<>();
        response.put("movies", movies);
        response.put("currentPage", page);
        response.put("genre", genre);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 增加电影的浏览量
     */
    @PostMapping("/{id}/views")
    public ResponseEntity<Map<String, Object>> incrementViews(@PathVariable int id) {
        int result = movieService.incrementViewCount(id);
        
        Map<String, Object> response = new HashMap<>();
        if (result > 0) {
            response.put("success", true);
            response.put("message", "浏览量增加成功");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "电影不存在");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
    
    /**
     * 切换电影的喜欢状态
     */
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable int id,
            @RequestParam int userId) {
        
        boolean toggled = movieService.toggleLikeMovie(userId, id);
        boolean isLiked = movieService.checkUserLikedMovie(userId, id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", toggled);
        response.put("isLiked", isLiked);
        response.put("message", isLiked ? "已添加到收藏" : "已从收藏中移除");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 获取相关电影推荐
     */
    @GetMapping("/{id}/related")
    public ResponseEntity<List<Movie>> getRelatedMovies(@PathVariable int id) {
        List<Movie> relatedMovies = movieService.getRelatedMovies(id);
        return ResponseEntity.ok(relatedMovies);
    }
    
    /**
     * 获取用户收藏的电影
     */
    @GetMapping("/user/{userId}/liked")
    public ResponseEntity<List<Movie>> getUserLikedMovies(
            @PathVariable int userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<Movie> likedMovies = movieService.getUserLikedMovies(userId, page, size);
        return ResponseEntity.ok(likedMovies);
    }
    
    /**
     * 检查用户是否收藏了指定电影
     */
    @GetMapping("/user/{userId}/liked/{movieId}")
    public ResponseEntity<Map<String, Object>> checkUserLikedMovie(
            @PathVariable int userId,
            @PathVariable int movieId) {
        
        boolean isLiked = movieService.checkUserLikedMovie(userId, movieId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("isLiked", isLiked);
        
        return ResponseEntity.ok(response);
    }
} 