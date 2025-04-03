package com.chictemp.backend.controller;

import com.chictemp.backend.dto.ApiResponse;
import com.chictemp.backend.dto.LoginRequest;
import com.chictemp.backend.dto.RegisterRequest;
import com.chictemp.backend.entity.User;
import com.chictemp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ApiResponse<User> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            return ApiResponse.success(user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ApiResponse<User> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request);
            return ApiResponse.success(user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<User> getById(@PathVariable Integer id) {
        User user = userService.findById(id);
        if (user != null) {
            return ApiResponse.success(user);
        } else {
            return ApiResponse.error("用户不存在");
        }
    }
}