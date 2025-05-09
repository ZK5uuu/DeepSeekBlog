-- 音乐博客表 - 简化版，无外键约束
DROP TABLE IF EXISTS music_blogs;
CREATE TABLE IF NOT EXISTS music_blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    cover_image_url VARCHAR(255),
    artist_name VARCHAR(255) NOT NULL,
    album_name VARCHAR(255) NOT NULL,
    album_image_url VARCHAR(255),
    content_link VARCHAR(255),
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    username VARCHAR(100) DEFAULT '管理员',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 音乐风格表
CREATE TABLE IF NOT EXISTS music_styles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 音乐博客与风格关联表
CREATE TABLE IF NOT EXISTS music_blog_styles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    music_blog_id INT NOT NULL,
    style_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (music_blog_id) REFERENCES music_blogs(id) ON DELETE CASCADE,
    FOREIGN KEY (style_id) REFERENCES music_styles(id) ON DELETE CASCADE,
    UNIQUE (music_blog_id, style_id)
);

-- 添加一些示例数据
INSERT INTO music_blogs (title, content, cover_image_url, artist_name, album_name, album_image_url, username)
VALUES 
('地磁卡1974年的研究报告', '这是一张融合了实验电子和民族音乐元素的专辑，展现了70年代电子音乐的前卫性与创新性。', 
'https://i.scdn.co/image/ab67616d0000b273f46e4d86e6e6673be7cc41fe', 
'地磁卡', '1974年的研究报告', 'https://i.scdn.co/image/ab67616d0000b273f46e4d86e6e6673be7cc41fe', '管理员'),

('陈鸿宇《理想三旬》评测', '《理想三旬》是一首充满文艺气息的民谣作品，陈鸿宇用他特有的嗓音讲述着对理想的向往与现实的思考。', 
'https://p2.music.126.net/cqTTEPAaxXG3cOwaE4E_0g==/109951163104103366.jpg', 
'陈鸿宇', '浓烟下的诗歌电台', 'https://p2.music.126.net/cqTTEPAaxXG3cOwaE4E_0g==/109951163104103366.jpg', '管理员'),

('周杰伦《七里香》专辑赏析', '《七里香》是周杰伦创作生涯中的经典之作，融合中国传统元素与现代流行音乐。', 
'https://i.scdn.co/image/ab67616d0000b2733d92b2ad5af9fbc8637425f0', 
'周杰伦', '七里香', 'https://i.scdn.co/image/ab67616d0000b2733d92b2ad5af9fbc8637425f0', '管理员');

-- 添加一些音乐风格
INSERT INTO music_styles (name) VALUES 
('电子'), ('实验'), ('民谣'), ('流行'), ('摇滚'), ('嘻哈'), ('古典'), ('爵士'), ('蓝调'), ('民族');

-- 添加音乐与风格的关联
INSERT INTO music_blog_styles (music_blog_id, style_id) VALUES 
(1, 1), (1, 2), (1, 10), -- 地磁卡：电子、实验、民族
(2, 3), -- 陈鸿宇：民谣
(3, 4); -- 周杰伦：流行 