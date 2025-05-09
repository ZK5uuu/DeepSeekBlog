package com.chictemp.backend.service;

import com.chictemp.backend.entity.User;

/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 通过用户名查找用户
     * @param username 用户名
     * @return 用户对象，未找到则返回null
     */
    User findByUsername(String username);
    
    /**
     * 通过邮箱查找用户
     * @param email 邮箱
     * @return 用户对象，未找到则返回null
     */
    User findByEmail(String email);
    
    /**
     * 注册新用户
     * @param user 用户信息
     * @return 注册成功返回用户对象，失败返回null
     * @throws Exception 用户名或邮箱已存在时抛出异常
     */
    User register(User user) throws Exception;
    
    /**
     * 用户登录验证
     * @param username 用户名
     * @param password 密码
     * @return 登录成功返回用户对象，失败返回null
     */
    User login(String username, String password);
    
    /**
     * 更新用户信息
     * @param user 用户信息
     * @return 更新成功返回true，失败返回false
     */
    boolean updateUser(User user);
    
    /**
     * 判断用户名是否可用（不存在）
     * @param username 用户名
     * @return 可用返回true，已存在返回false
     */
    boolean isUsernameAvailable(String username);
    
    /**
     * 判断邮箱是否可用（不存在）
     * @param email 邮箱
     * @return 可用返回true，已存在返回false
     */
    boolean isEmailAvailable(String email);
}