package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AdminMapper {
    
    @Select("SELECT * FROM admin WHERE username = #{username} AND password = #{password}")
    Admin findByUsernameAndPassword(@Param("username") String username, @Param("password") String password);
    
    @Select("SELECT * FROM admin WHERE username = #{username}")
    Admin findByUsername(@Param("username") String username);
} 