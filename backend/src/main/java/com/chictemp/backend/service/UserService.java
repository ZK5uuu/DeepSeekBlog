package com.chictemp.backend.service;

import com.chictemp.backend.entity.User;
import com.chictemp.backend.dto.LoginRequest;
import com.chictemp.backend.dto.RegisterRequest;
import java.util.List;

public interface UserService {
    User findById(Integer id);
    User findByUsername(String username);
    User register(RegisterRequest request);
    User login(LoginRequest request);
    List<User> findAll();
    User update(User user);
    boolean delete(Integer id);
}