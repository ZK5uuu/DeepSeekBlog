-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    bio TEXT,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 博客文章表（包含音乐评论功能）
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT NOT NULL,
    cover_image_url VARCHAR(255),
    summary TEXT,
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'blog', -- 可选: blog, book, movie, music
    artist_name VARCHAR(255), -- 音乐评论专用：艺术家名称
    album_name VARCHAR(255), -- 音乐评论专用：专辑名称
    album_image_url VARCHAR(255), -- 音乐评论专用：专辑封面图片URL
    content_link VARCHAR(255), -- 外部链接，例如音乐/书籍/电影的URL
    view_count INT DEFAULT 0, -- 浏览量计数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE (post_id, tag_id)
);

-- 文章摘要表
CREATE TABLE IF NOT EXISTS post_summaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);

-- 初始数据：创建默认用户
INSERT INTO users (username, password, name, bio) 
VALUES ('admin', '$2a$10$X7GxU5rNT3p3FJFgQ5OvJeCzCL7KfoO4CIhB1Xw4X0N/D9KOzMT3K', '管理员', '博客系统管理员')
ON DUPLICATE KEY UPDATE id = id; 