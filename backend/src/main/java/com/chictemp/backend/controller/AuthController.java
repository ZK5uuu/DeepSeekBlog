package com.chictemp.backend.controller;

import com.chictemp.backend.entity.User;
import com.chictemp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * 用户认证控制器
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private static final Logger logger = Logger.getLogger(AuthController.class.getName());
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户注册
     * @param user 用户信息
     * @return 注册结果
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            logger.info("收到注册请求: " + user.getUsername() + ", 邮箱: " + user.getEmail());
            
            // 校验用户名是否已存在
            if (!userService.isUsernameAvailable(user.getUsername())) {
                logger.info("注册失败: 用户名已存在 - " + user.getUsername());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createResponse(false, "用户名已存在"));
            }
            
            // 校验邮箱是否已存在
            if (!userService.isEmailAvailable(user.getEmail())) {
                logger.info("注册失败: 邮箱已存在 - " + user.getEmail());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(createResponse(false, "邮箱已存在"));
            }
            
            // 注册用户
            User registeredUser = userService.register(user);
            
            if (registeredUser != null) {
                // 隐藏密码
                registeredUser.setPassword(null);
                logger.info("注册成功: " + registeredUser.getUsername());
                return ResponseEntity.ok(createResponse(true, "注册成功", registeredUser));
            } else {
                logger.warning("注册失败: 用户创建失败");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(createResponse(false, "注册失败，请稍后重试"));
            }
        } catch (Exception e) {
            logger.log(Level.WARNING, "注册异常", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createResponse(false, e.getMessage()));
        }
    }
    
    /**
     * 用户登录
     * @param loginData 登录信息
     * @return 登录结果
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        
        logger.info("收到登录请求: 用户名=" + username);
        
        // 验证参数
        if (username == null || password == null) {
            logger.warning("登录失败: 用户名或密码为空");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createResponse(false, "用户名和密码不能为空"));
        }
        
        try {
            // 验证登录
            User user = userService.login(username, password);
            
            if (user != null) {
                // 隐藏密码
                user.setPassword(null);
                logger.info("登录成功: " + username + ", 角色: ");
                
                Map<String, Object> responseData = createResponse(true, "登录成功", user);
                logger.info("返回登录响应: " + responseData);
                return ResponseEntity.ok(responseData);
            } else {
                logger.warning("登录失败: 用户名或密码错误 - " + username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createResponse(false, "用户名或密码错误"));
            }
        } catch (Exception e) {
            logger.log(Level.WARNING, "登录异常", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createResponse(false, "登录过程中发生错误: " + e.getMessage()));
        }
    }
    
    /**
     * 检查用户名是否可用
     * @param username 用户名
     * @return 检查结果
     */
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        logger.info("检查用户名是否可用: " + username);
        boolean isAvailable = userService.isUsernameAvailable(username);
        logger.info("用户名 " + username + " 是否可用: " + isAvailable);
        return ResponseEntity.ok(createResponse(true, isAvailable ? "用户名可用" : "用户名已存在", 
                Map.of("available", isAvailable)));
    }
    
    /**
     * 检查邮箱是否可用
     * @param email 邮箱
     * @return 检查结果
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        logger.info("检查邮箱是否可用: " + email);
        boolean isAvailable = userService.isEmailAvailable(email);
        logger.info("邮箱 " + email + " 是否可用: " + isAvailable);
        return ResponseEntity.ok(createResponse(true, isAvailable ? "邮箱可用" : "邮箱已存在", 
                Map.of("available", isAvailable)));
    }
    
    /**
     * 创建统一响应结构
     * @param success 是否成功
     * @param message 消息
     * @return 响应结构
     */
    private Map<String, Object> createResponse(boolean success, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        return response;
    }
    
    /**
     * 创建统一响应结构（带数据）
     * @param success 是否成功
     * @param message 消息
     * @param data 数据
     * @return 响应结构
     */
    private Map<String, Object> createResponse(boolean success, String message, Object data) {
        Map<String, Object> response = createResponse(success, message);
        response.put("data", data);
        return response;
    }
} 