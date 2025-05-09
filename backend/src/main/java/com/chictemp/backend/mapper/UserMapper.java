package com.chictemp.backend.mapper;

import com.chictemp.backend.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

/**
 * 用户数据访问接口
 */
@Mapper
public interface UserMapper {
    
    /**
     * 通过用户名查找用户
     * @param username 用户名
     * @return 用户对象
     */
    User findByUsername(String username);
    
    /**
     * 通过用户名和密码查找用户
     * @param username 用户名
     * @param password 密码
     * @return 用户对象
     */
    User findByUsernameAndPassword(@Param("username") String username, @Param("password") String password);
    
    /**
     * 通过邮箱查找用户
     * @param email 邮箱
     * @return 用户对象
     */
    User findByEmail(String email);
    
    /**
     * 创建新用户
     * @param user 用户对象
     * @return 受影响的行数
     */
    int insert(User user);
    
    /**
     * 更新用户信息
     * @param user 用户对象
     * @return 受影响的行数
     */
    int update(User user);
    
    /**
     * 删除用户
     * @param id 用户ID
     * @return 受影响的行数
     */
    int deleteById(Long id);
    
    /**
     * 获取用户总数
     * @return 用户数量
     */
    int count();
    
    User findById(Integer id);
    List<User> findAll();
}