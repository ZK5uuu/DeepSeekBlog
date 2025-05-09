package com.chictemp.backend.config;

import com.chictemp.backend.config.dao.MyUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 这里应该连接数据库查询用户
        // 示例数据
        if ("admin".equals(username)) {
            return new MyUserDetails(
                    "admin",
                    "{bcrypt}$2a$10$exampleHash", // 实际应使用BCrypt加密
                    List.of("ADMIN", "USER") // 超级管理员拥有所有权限
            );
        } else {
            return new MyUserDetails(
                    "user",
                    "{bcrypt}$2a$10$exampleHash",
                    List.of("USER")
            );
        }
//        throw new UsernameNotFoundException("User not found");
    }
}