-- 插入测试用户（如果尚未存在）
INSERT IGNORE INTO users (id, username, password, email, created_at, updated_at)
VALUES (1, 'admin', '$2a$10$X7GxU5rNT3p3FJFgQ5OvJeCzCL7KfoO4CIhB1Xw4X0N/D9KOzMT3K', 'admin@example.com', NOW(), NOW());

-- 插入音乐风格标签
INSERT IGNORE INTO tags (name) VALUES ('Rock');
INSERT IGNORE INTO tags (name) VALUES ('Jazz');
INSERT IGNORE INTO tags (name) VALUES ('Classical');
INSERT IGNORE INTO tags (name) VALUES ('Pop');
INSERT IGNORE INTO tags (name) VALUES ('R&B');

-- 插入测试音乐博客数据
INSERT INTO blog_posts (
    title, 
    author_id, 
    cover_image_url, 
    summary, 
    content, 
    content_type, 
    artist_name, 
    album_name, 
    album_image_url, 
    content_link, 
    created_at, 
    updated_at
) VALUES (
    'Pink Floyd - The Dark Side of the Moon 评论', 
    1, 
    'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80', 
    '这是一张经典的摇滚专辑，被认为是有史以来最伟大的专辑之一。', 
    '《月之暗面》是Pink Floyd乐队的第八张录音室专辑，于1973年3月1日发行。这张专辑探索了压力、精神疾病、冲突和贪婪等影响现代生活的各种主题。专辑中的音乐以无缝连续的方式流动，营造出一种连贯的整体体验。最著名的曲目包括"Time"、"Money"和"The Great Gig in the Sky"。这张专辑的音乐和哲学深度使其成为有史以来最重要的摇滚专辑之一。', 
    'music', 
    'Pink Floyd', 
    'The Dark Side of the Moon', 
    'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80', 
    'https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv', 
    NOW(), 
    NOW()
);

INSERT INTO blog_posts (
    title, 
    author_id, 
    cover_image_url, 
    summary, 
    content, 
    content_type, 
    artist_name, 
    album_name, 
    album_image_url, 
    content_link, 
    created_at, 
    updated_at
) VALUES (
    'Miles Davis - Kind of Blue 爵士乐杰作', 
    1, 
    'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80', 
    'Kind of Blue 被广泛认为是有史以来最伟大的爵士专辑之一。', 
    '《Kind of Blue》是爵士乐历史上具有里程碑意义的专辑，发行于1959年8月17日。Miles Davis与约翰·科尔特兰、朱利安"坎农鲍尔"阿德利、比尔·埃文斯、温顿·凯利和吉米·科布等杰出音乐家合作创作了这张专辑。专辑采用了模态爵士乐风格，不同于之前基于和弦的即兴演奏。每个曲目都有简单的旋律和音阶，让音乐家们可以自由发挥其创造力。最著名的曲目包括"So What"、"Blue in Green"和"All Blues"。这张专辑以其创新、简约和情感深度，成为了爵士乐历史上最有影响力的录音之一。', 
    'music', 
    'Miles Davis', 
    'Kind of Blue', 
    'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80', 
    'https://open.spotify.com/album/1weenld61qoidwYuZ1GESA', 
    NOW(), 
    NOW() - INTERVAL 1 DAY
);

INSERT INTO blog_posts (
    title, 
    author_id, 
    cover_image_url, 
    summary, 
    content, 
    content_type, 
    artist_name, 
    album_name, 
    album_image_url, 
    content_link, 
    created_at, 
    updated_at
) VALUES (
    'Kendrick Lamar - To Pimp a Butterfly 现代经典', 
    1, 
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80', 
    '《To Pimp a Butterfly》是一张具有革命性意义的专辑，融合了说唱、爵士乐、放克和灵魂乐。', 
    '《To Pimp a Butterfly》是Kendrick Lamar于2015年3月15日发行的第三张录音室专辑。这张专辑以其复杂的音乐编排、深刻的社会评论和对非裔美国人文化的探索而闻名。Lamar与Thundercat、Flying Lotus、Kamasi Washington等艺术家合作，创造了一种融合了说唱、爵士乐、放克和灵魂乐的声音。专辑中的歌曲如"Alright"、"King Kunta"和"The Blacker the Berry"探讨了种族、身份、抑郁、名望和自尊等主题。这张专辑不仅在音乐上具有创新性，而且在文化和政治上也具有重要意义，被视为2010年代最具影响力的音乐作品之一。', 
    'music', 
    'Kendrick Lamar', 
    'To Pimp a Butterfly', 
    'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80', 
    'https://open.spotify.com/album/7ycBtnsMtyVbbwTfJwRjSP', 
    NOW(), 
    NOW() - INTERVAL 2 DAY
);

INSERT INTO blog_posts (
    title, 
    author_id, 
    cover_image_url, 
    summary, 
    content, 
    content_type, 
    artist_name, 
    album_name, 
    album_image_url, 
    content_link, 
    created_at, 
    updated_at
) VALUES (
    'John Coltrane - Blue Train 萨克斯巅峰', 
    1, 
    'https://images.unsplash.com/photo-1454922915609-78549ad709bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=872&q=80', 
    'Blue Train 是 John Coltrane 在硬波普爵士乐领域的代表作。', 
    '《Blue Train》是John Coltrane于1958年发行的一张爵士乐专辑，被认为是硬波普爵士乐的经典之作。在这张专辑中，Coltrane 展示了他在中音萨克斯上的出色技巧和创新理念。他与一群杰出的音乐家合作，包括李·摩根（小号）、柯蒂斯·富勒（长号）、肯尼·德鲁（钢琴）、保罗·钱伯斯（贝斯）和菲利·乔·琼斯（鼓）。专辑中的每首曲目都展示了Coltrane的音乐实力，特别是标题曲"Blue Train"和"Moment\'s Notice"。这张专辑以其复杂的和声进行、严密的编曲和精湛的即兴演奏而闻名，被认为是爵士乐历史上的重要作品之一。', 
    'music', 
    'John Coltrane', 
    'Blue Train', 
    'https://images.unsplash.com/photo-1454922915609-78549ad709bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=872&q=80', 
    'https://open.spotify.com/album/6zyvUQ6H3OXFXiZXd6cT3W', 
    NOW(), 
    NOW() - INTERVAL 3 DAY
);

-- 为音乐博客添加标签关联
-- 获取刚才插入的博客文章 ID
SET @pink_floyd_post_id = (SELECT id FROM blog_posts WHERE title = 'Pink Floyd - The Dark Side of the Moon 评论' LIMIT 1);
SET @miles_davis_post_id = (SELECT id FROM blog_posts WHERE title = 'Miles Davis - Kind of Blue 爵士乐杰作' LIMIT 1);
SET @kendrick_lamar_post_id = (SELECT id FROM blog_posts WHERE title = 'Kendrick Lamar - To Pimp a Butterfly 现代经典' LIMIT 1);
SET @john_coltrane_post_id = (SELECT id FROM blog_posts WHERE title = 'John Coltrane - Blue Train 萨克斯巅峰' LIMIT 1);

-- 获取标签 ID
SET @rock_tag_id = (SELECT id FROM tags WHERE name = 'Rock' LIMIT 1);
SET @jazz_tag_id = (SELECT id FROM tags WHERE name = 'Jazz' LIMIT 1);
SET @classical_tag_id = (SELECT id FROM tags WHERE name = 'Classical' LIMIT 1);
SET @pop_tag_id = (SELECT id FROM tags WHERE name = 'Pop' LIMIT 1);
SET @rnb_tag_id = (SELECT id FROM tags WHERE name = 'R&B' LIMIT 1);

-- 添加博客-标签关联
INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (@pink_floyd_post_id, @rock_tag_id);
INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (@miles_davis_post_id, @jazz_tag_id);
INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (@kendrick_lamar_post_id, @rnb_tag_id);
INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (@john_coltrane_post_id, @jazz_tag_id); 