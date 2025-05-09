-- 删除原有的users表（如果存在）
DROP TABLE IF EXISTS users;

-- 重新创建用户表
CREATE TABLE IF NOT EXISTS user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（MD5加密）',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    role VARCHAR(20) DEFAULT 'user' COMMENT '角色：admin-管理员，user-普通用户',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT='用户表';

-- 创建初始管理员账户
INSERT INTO user (username, password, email, role) 
VALUES ('admin', MD5('admin123'), 'admin@example.com', 'admin');

-- 创建示例用户账户
INSERT INTO user (username, password, email, role) 
VALUES ('test', MD5('test123'), 'test@example.com', 'user');

-- 更新blog_posts表的外键引用
ALTER TABLE blog_posts
DROP FOREIGN KEY IF EXISTS blog_posts_ibfk_1;

-- 修改外键字段类型
ALTER TABLE blog_posts
MODIFY COLUMN author_id BIGINT;

-- 添加新的外键关系
ALTER TABLE blog_posts
ADD CONSTRAINT blog_posts_author_fk
FOREIGN KEY (author_id) REFERENCES user(id); 