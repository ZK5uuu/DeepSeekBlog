-- 这个文件用于初始数据的导入
-- 初始用户已在schema.sql中创建

-- 创建初始标签
INSERT INTO tags (name, description) VALUES 
('人工智能', '关于AI和机器学习的内容'),
('文学评论', '书籍、小说和文学作品的评论'),
('电影', '电影相关的内容和评论'),
('音乐', '音乐相关的内容和评论'),
('科技', '关于最新科技发展和趋势'),
('历史', '历史事件和人物相关内容'),
('哲学', '哲学思想和理论讨论'),
('科学', '科学发现和理论相关内容'),
('艺术', '艺术作品和艺术理论'),
('社会', '社会现象和社会问题讨论'),
('教育', '教育理论和方法'),
('心理学', '心理学理论和实践'),
('环境', '环境保护和生态问题'),
('健康', '健康生活和医疗知识'),
('政治', '政治理论和时事分析'),
('经济', '经济理论和市场分析')
ON DUPLICATE KEY UPDATE id = id; 

-- 添加示例电影数据
INSERT INTO movies (title, director, year, poster, description, rating, genre_list, trailer, view_count) VALUES
('盗梦空间', '克里斯托弗·诺兰', 2010, 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', '一个盗梦高手和他的团队被雇来在一个目标人物的潜意识中植入一个想法，而这可能是唯一的方法让他重获自由。', 8.8, '科幻,动作,冒险', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 1250),
('星际穿越', '克里斯托弗·诺兰', 2014, 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', '在不久的将来，地球面临环境危机，一组宇航员穿越虫洞寻找一个新的家园来拯救人类。', 8.6, '科幻,冒险,奇幻', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 980),
('楚门的世界', '彼得·威尔', 1998, 'https://m.media-amazon.com/images/M/MV5BMDIzODcyY2EtMmY2MC00ZWVlLTgwMzAtMjQwOWUyNmJjNTYyXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg', '一个普通人慢慢发现自己的整个生活都是一个电视真人秀节目的一部分。', 8.1, '喜剧,奇幻', 'https://www.youtube.com/watch?v=dlnmQbPGuls', 850),
('让子弹飞', '姜文', 2010, 'https://m.media-amazon.com/images/M/MV5BMTM1Njc5NDU4MV5BMl5BanBnXkFtZTcwOTYxNjc5Ng@@._V1_SX300.jpg', '一个土匪头子假装成县长来到鹅城，却决定反抗当地的恶霸。', 8.7, '动作,喜剧,犯罪', 'https://www.youtube.com/watch?v=YIpNKXP7pAU', 1500),
('千与千寻', '宫崎骏', 2001, 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', '小女孩千寻和父母意外进入神灵世界，她必须在这个奇特的世界里找到回家的方法。', 8.6, '动画,奇幻,冒险', 'https://www.youtube.com/watch?v=ByXuk9QqQkk', 2200),
('指环王：王者归来', '彼得·杰克逊', 2003, 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', '护戒小队的旅程达到高潮，阿拉贡领导一场对抗索隆军队的战争，而弗罗多与山姆接近魔多。', 8.9, '奇幻,冒险,动作', 'https://www.youtube.com/watch?v=r5X-hFf6Bwo', 1800),
('肖申克的救赎', '弗兰克·德拉邦特', 1994, 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', '一个银行家被错误地判处终身监禁，在肖申克监狱中与一个走私犯成为朋友，并找到了救赎之路。', 9.3, '犯罪,奇幻', 'https://www.youtube.com/watch?v=6hB3S9bIaco', 2500),
('疯狂动物城', '拜伦·霍华德', 2016, 'https://m.media-amazon.com/images/M/MV5BOTMyMjEyNzIzMV5BMl5BanBnXkFtZTgwNzIyNjU0NzE@._V1_SX300.jpg', '在一个由动物组成的大都市中，一个新晋警官和一个狡猾的狐狸必须联手破解一个复杂的案件。', 8.0, '动画,冒险,喜剧', 'https://www.youtube.com/watch?v=jWM0ct-OLsM', 1600);

-- 添加标签
INSERT IGNORE INTO tags (name) VALUES
('科幻'), ('动作'), ('冒险'), ('喜剧'), ('奇幻'), ('犯罪'), ('动画'); 