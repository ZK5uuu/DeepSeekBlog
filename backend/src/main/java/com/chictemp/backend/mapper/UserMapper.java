package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface UserMapper {
    User findById(Integer id);
    User findByUsername(String username);
    User findByEmail(String email);
    int insert(User user);
    int update(User user);
    int delete(Integer id);
    List<User> findAll();
}