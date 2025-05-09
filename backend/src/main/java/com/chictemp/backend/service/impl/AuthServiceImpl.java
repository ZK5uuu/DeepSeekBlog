package com.chictemp.backend.service.impl;

import com.chictemp.backend.dto.LoginRequest;
import com.chictemp.backend.dto.LoginResponse;
import com.chictemp.backend.entity.Admin;
import com.chictemp.backend.entity.User;
import com.chictemp.backend.mapper.AdminMapper;
import com.chictemp.backend.mapper.UserMapper;
import com.chictemp.backend.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);
    
    // 简单的内存令牌存储，生产环境应使用Redis等
    private final Map<String, String> tokenStore = new HashMap<>();
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private AdminMapper adminMapper;

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        // 尝试作为管理员登录
        Admin admin = adminMapper.findByUsernameAndPassword(
                loginRequest.getUsername(), loginRequest.getPassword());
        
        if (admin != null) {
            String token = generateToken(admin.getUsername(), "admin");
            return new LoginResponse(token, "admin", admin.getUsername());
        }
        
        // 尝试作为普通用户登录
        User user = userMapper.findByUsernameAndPassword(
                loginRequest.getUsername(), loginRequest.getPassword());
        
        if (user != null) {
            String token = generateToken(user.getUsername(), "user");
            return new LoginResponse(token, "user", user.getUsername());
        }
        
        return null; // 登录失败
    }

    @Override
    public boolean validateToken(String token) {
        return tokenStore.containsKey(token);
    }

    @Override
    public String getUserRoleFromToken(String token) {
        return tokenStore.get(token);
    }
    
    private String generateToken(String username, String role) {
        String token = UUID.randomUUID().toString();
        // 存储令牌与角色的映射
        tokenStore.put(token, role);
        logger.info("Generated token for user {} with role {}", username, role);
        return token;
    }
} 