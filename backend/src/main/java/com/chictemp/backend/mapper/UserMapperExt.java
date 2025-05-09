package com.chictemp.backend.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserMapperExt {
    
    @Update("SET FOREIGN_KEY_CHECKS = 0")
    void disableForeignKeyChecks();
    
    @Update("SET FOREIGN_KEY_CHECKS = 1")
    void enableForeignKeyChecks();
    
    @Insert("INSERT INTO users (id, username, password_hash, email, name) VALUES (#{id}, #{username}, #{password}, #{email}, #{username})")
    int insertWithId(@Param("id") Integer id, @Param("username") String username, @Param("password") String password, @Param("email") String email);
} 