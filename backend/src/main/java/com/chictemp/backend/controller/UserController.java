package com.chictemp.backend.controller;

import com.chictemp.backend.dto.ApiResponse;
import com.chictemp.backend.dto.LoginRequest;
import com.chictemp.backend.dto.RegisterRequest;
import com.chictemp.backend.entity.User;
import com.chictemp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private static final Logger logger = Logger.getLogger(UserController.class.getName());
    
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ApiResponse<User> register(@RequestBody RegisterRequest request) {
        try {
            // 创建用户对象
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setRole("user");   // 默认注册的都是普通用户
            
            // 调用服务进行注册
            User registeredUser = userService.register(user);
            if (registeredUser != null) {
                // 隐藏密码
                registeredUser.setPassword(null);
                return ApiResponse.success(registeredUser);
            } else {
                return ApiResponse.error("注册失败，请稍后重试");
            }
        } catch (Exception e) {
            logger.warning("注册失败: " + e.getMessage());
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ApiResponse<User> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getUsername(), request.getPassword());
            if (user != null) {
                // 隐藏密码
                user.setPassword(null);
                return ApiResponse.success(user);
            } else {
                return ApiResponse.error("用户名或密码错误");
            }
        } catch (Exception e) {
            logger.warning("登录失败: " + e.getMessage());
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/check-username")
    public ApiResponse<Boolean> checkUsername(@RequestParam String username) {
        boolean isAvailable = userService.isUsernameAvailable(username);
        return ApiResponse.success(isAvailable);
    }

    @GetMapping("/check-email")
    public ApiResponse<Boolean> checkEmail(@RequestParam String email) {
        boolean isAvailable = userService.isEmailAvailable(email);
        return ApiResponse.success(isAvailable);
    }
}