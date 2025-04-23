package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.Movie;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface MovieMapper {
    
    @Select("SELECT * FROM movies ORDER BY ${sortField} ${sortOrder} LIMIT #{offset}, #{limit}")
    List<Movie> getMovieList(@Param("sortField") String sortField, 
                            @Param("sortOrder") String sortOrder, 
                            @Param("offset") int offset, 
                            @Param("limit") int limit);
    
    @Select("SELECT COUNT(*) FROM movies")
    int countMovies();
    
    @Select("SELECT * FROM movies WHERE id = #{id}")
    Movie getMovieById(@Param("id") int id);
    
    @Select("SELECT * FROM movies WHERE " +
            "title LIKE CONCAT('%', #{keyword}, '%') OR " +
            "director LIKE CONCAT('%', #{keyword}, '%') OR " +
            "description LIKE CONCAT('%', #{keyword}, '%') " +
            "ORDER BY ${sortField} ${sortOrder} " +
            "LIMIT #{offset}, #{limit}")
    List<Movie> searchMovies(@Param("keyword") String keyword, 
                            @Param("sortField") String sortField, 
                            @Param("sortOrder") String sortOrder, 
                            @Param("offset") int offset, 
                            @Param("limit") int limit);
    
    @Select("SELECT * FROM movies WHERE genre_list LIKE CONCAT('%', #{genre}, '%') " +
            "ORDER BY ${sortField} ${sortOrder} " +
            "LIMIT #{offset}, #{limit}")
    List<Movie> getMoviesByGenre(@Param("genre") String genre, 
                                @Param("sortField") String sortField, 
                                @Param("sortOrder") String sortOrder, 
                                @Param("offset") int offset, 
                                @Param("limit") int limit);
    
    @Insert("INSERT INTO movies(title, director, year, poster, description, rating, genre_list, trailer) " +
            "VALUES(#{title}, #{director}, #{year}, #{poster}, #{description}, #{rating}, #{genreList}, #{trailer})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertMovie(Movie movie);
    
    @Update("UPDATE movies SET " +
            "title = #{title}, " +
            "director = #{director}, " +
            "year = #{year}, " +
            "poster = #{poster}, " +
            "description = #{description}, " +
            "rating = #{rating}, " +
            "genre_list = #{genreList}, " +
            "trailer = #{trailer}, " +
            "updated_at = NOW() " +
            "WHERE id = #{id}")
    int updateMovie(Movie movie);
    
    @Delete("DELETE FROM movies WHERE id = #{id}")
    int deleteMovie(@Param("id") int id);
    
    @Update("UPDATE movies SET view_count = view_count + 1 WHERE id = #{id}")
    int incrementViewCount(@Param("id") int id);
    
    @Select("SELECT m.* FROM movies m " +
            "INNER JOIN user_liked_movies ulm ON m.id = ulm.movie_id " +
            "WHERE ulm.user_id = #{userId} " +
            "ORDER BY ulm.created_at DESC " +
            "LIMIT #{offset}, #{limit}")
    List<Movie> getUserLikedMovies(@Param("userId") int userId, 
                                  @Param("offset") int offset, 
                                  @Param("limit") int limit);
    
    @Select("SELECT COUNT(*) FROM user_liked_movies WHERE user_id = #{userId} AND movie_id = #{movieId}")
    int checkUserLikedMovie(@Param("userId") int userId, @Param("movieId") int movieId);
    
    @Insert("INSERT INTO user_liked_movies(user_id, movie_id) VALUES(#{userId}, #{movieId})")
    int likeMovie(@Param("userId") int userId, @Param("movieId") int movieId);
    
    @Delete("DELETE FROM user_liked_movies WHERE user_id = #{userId} AND movie_id = #{movieId}")
    int unlikeMovie(@Param("userId") int userId, @Param("movieId") int movieId);
    
    @Select("SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(genre_list, ',', n.n), ',', -1) AS genre " +
            "FROM movies " +
            "CROSS JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) n " +
            "WHERE LENGTH(genre_list) - LENGTH(REPLACE(genre_list, ',', '')) >= n.n - 1 " +
            "GROUP BY genre " +
            "ORDER BY genre")
    List<String> getAllGenres();
} 