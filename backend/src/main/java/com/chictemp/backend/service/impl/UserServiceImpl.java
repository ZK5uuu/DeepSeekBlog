package com.chictemp.backend.service.impl;

import com.chictemp.backend.entity.User;
import com.chictemp.backend.mapper.UserMapper;
import com.chictemp.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService {
    
    private static final Logger logger = Logger.getLogger(UserServiceImpl.class.getName());
    
    @Autowired
    private UserMapper userMapper;
    
    @Override
    public User findByUsername(String username) {
        logger.info("通过用户名查找用户: " + username);
        User user = userMapper.findByUsername(username);
        if (user != null) {
            logger.info("找到用户: " + username);
        } else {
            logger.info("未找到用户: " + username);
        }
        return user;
    }
    
    @Override
    public User findByEmail(String email) {
        logger.info("通过邮箱查找用户: " + email);
        return userMapper.findByEmail(email);
    }
    
    @Override
    @Transactional
    public User register(User user) throws Exception {
        logger.info("开始注册用户: " + user.getUsername());
        
        // 验证用户名是否已存在
        if (!isUsernameAvailable(user.getUsername())) {
            logger.info("注册失败: 用户名 " + user.getUsername() + " 已存在");
            throw new Exception("用户名已存在");
        }
        
        // 验证邮箱是否已存在
        if (!isEmailAvailable(user.getEmail())) {
            logger.info("注册失败: 邮箱 " + user.getEmail() + " 已存在");
            throw new Exception("邮箱已存在");
        }
        
        // 设置创建时间和更新时间
        Date now = new Date();
        user.setCreateTime(now);
        user.setUpdateTime(now);
        
        // 默认角色为普通用户
//        if (user.getRole() == null || user.getRole().isEmpty()) {
//            user.setRole("user");
//        }
        
        // 密码加密
        String rawPassword = user.getPassword();
        String encryptedPassword = encryptPassword(rawPassword);
        logger.info("密码加密: 原密码长度=" + rawPassword.length() + "，加密后长度=" + encryptedPassword.length());
        user.setPassword(encryptedPassword);
        
        // 插入用户
        logger.info("执行用户插入操作");
        int result = userMapper.insert(user);
        if (result > 0) {
            logger.info("用户注册成功: " + user.getUsername());
            return user;
        } else {
            logger.warning("用户注册失败: " + user.getUsername());
            return null;
        }
    }
    
    @Override
    public User login(String username, String password) {
        logger.info("用户登录尝试: " + username);
        
        // 根据用户名查找用户
        User user = userMapper.findByUsername(username);
        
        if (user == null) {
            logger.info("登录失败: 用户名不存在 - " + username);
            return null;
        }
        
//        logger.info("找到用户: " + username + ", 角色: " + user.getRole());
        
        // 验证密码
        String inputEncryptedPassword = encryptPassword(password);
        String storedPassword = user.getPassword();
        
        logger.info("密码比对: 输入密码(加密后)=" + inputEncryptedPassword);
        logger.info("密码比对: 存储密码=" + storedPassword);
        
        if (matchPassword(password, storedPassword)) {
            logger.info("密码验证成功，登录成功: " + username);
            return user;
        } else {
            logger.info("密码验证失败，登录失败: " + username);
            return null;
        }
    }
    
    @Override
    @Transactional
    public boolean updateUser(User user) {
        logger.info("更新用户信息: " + user.getUsername());
        
        // 设置更新时间
        user.setUpdateTime(new Date());
        
        // 如果密码不为空，对密码进行加密
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(encryptPassword(user.getPassword()));
        }
        
        int result = userMapper.update(user);
        return result > 0;
    }
    
    @Override
    public boolean isUsernameAvailable(String username) {
        logger.info("检查用户名是否可用: " + username);
        boolean available = userMapper.findByUsername(username) == null;
        logger.info("用户名 " + username + " 是否可用: " + available);
        return available;
    }
    
    @Override
    public boolean isEmailAvailable(String email) {
        logger.info("检查邮箱是否可用: " + email);
        boolean available = userMapper.findByEmail(email) == null;
        logger.info("邮箱 " + email + " 是否可用: " + available);
        return available;
    }
    
    /**
     * 密码加密
     * @param password 原始密码
     * @return 加密后的密码
     */
    private String encryptPassword(String password) {
        logger.fine("执行密码加密，原密码长度: " + password.length());
        if (password == null) {
            logger.warning("尝试加密null密码");
            return null;
        }
        
        // 使用MD5加密
        String encryptedPassword = DigestUtils.md5DigestAsHex(password.getBytes(StandardCharsets.UTF_8));
        logger.fine("密码加密完成，加密后长度: " + encryptedPassword.length());
        return encryptedPassword;
    }
    
    /**
     * 密码匹配
     * @param inputPassword 输入的密码
     * @param storedPassword 存储的密码
     * @return 是否匹配
     */
    private boolean matchPassword(String inputPassword, String storedPassword) {
        logger.fine("执行密码比对");
        if (inputPassword == null || storedPassword == null) {
            logger.warning("密码比对参数为null");
            return false;
        }
        
        // 将输入密码加密后与存储的加密密码进行比较
        String encryptedPassword = encryptPassword(inputPassword);
        logger.fine("输入密码(加密后): " + encryptedPassword);
        logger.fine("存储密码: " + storedPassword);
        
        boolean matches = encryptedPassword.equals(storedPassword);
        logger.fine("密码比对结果: " + matches);
        return matches;
    }
} 