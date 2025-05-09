/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80032 (8.0.32)
 Source Host           : localhost:3306
 Source Schema         : deepseek_blog

 Target Server Type    : MySQL
 Target Server Version : 80032 (8.0.32)
 File Encoding         : 65001

 Date: 06/05/2025 22:37:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for blog
-- ----------------------------
DROP TABLE IF EXISTS `blog`;
CREATE TABLE `blog`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名',
  `artist_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作者名称',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '博客内容',
  `created_time` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `modify_time` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `opus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作品名称',
  `album` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '作品图片 url 地址',
  `ai_contend` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '经AI 总结后的博\n客内容',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of blog
-- ----------------------------

-- ----------------------------
-- Table structure for blog_post
-- ----------------------------
DROP TABLE IF EXISTS `blog_post`;
CREATE TABLE `blog_post`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章标题',
  `author_id` int UNSIGNED NOT NULL COMMENT '作者ID（关联用户表）',
  `cover_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '封面图URL',
  `summary` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '文章摘要',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章正文内容',
  `content_type` enum('blog','book','movie','music') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'blog' COMMENT '内容类型（枚举值）',
  `artist_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '音乐评论专用-艺术家名称',
  `album_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '音乐评论专用-专辑名称',
  `album_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '音乐评论专用-专辑封面URL',
  `content_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '外部关联内容链接',
  `view_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览量',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of blog_post
-- ----------------------------

-- ----------------------------
-- Table structure for music_blogs
-- ----------------------------
DROP TABLE IF EXISTS `music_blogs`;
CREATE TABLE `music_blogs`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '博客标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '正文内容',
  `cover_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '封面图URL',
  `artist_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '艺术家名称',
  `album_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '专辑名称',
  `album_image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '专辑封面URL',
  `content_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '外部关联链接',
  `view_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览量',
  `like_count` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '作者用户名',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '音乐博客内容表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of music_blogs
-- ----------------------------
INSERT INTO `music_blogs` VALUES (1, '施工图额受到广大华人', '说的话投入付款的好人更多很容易系统就说的话投入付款的好人更多很容易系统就说的话投入付款的好人更多很容易系统就说的话投入付款的好人更多很容易系统就说的话投入付款的好人更多很容易系统就说的话投入付款的好人更多很容易系统就说的话投入付款的好人更多很容易系统就说的话投入付款的好人更多很容易系统就说的话投入付款的好人更多很容易系统就', 'http://localhost:8080/api/files/0e0b6a49-924a-488b-8bdd-628fc619921e.gif', 'sd光和热', '施工图额受到广大华人', 'http://localhost:8080/api/files/0e0b6a49-924a-488b-8bdd-628fc619921e.gif', '', 4, 0, 'testUser06', '2025-05-06 20:21:05', '2025-05-06 20:39:23');
INSERT INTO `music_blogs` VALUES (2, 'sgeheh阿松大1', '123456testUsertestUsertestUsertestUser爱对方的条件try就testUsertestUsertestUsertestUser爱对方的条件try就testUsertestUsertestUsertestUser爱对方的条件try就testUsertestUsertestUsertestUser爱对方的条件try就testUsertestUsertestUsertestUser爱对方的条件try就sgh', 'http://localhost:8080/api/files/f95700e1-7954-46ad-94db-0180d02024c0.gif', '是符合图光和热3', 'sgeheh阿松大57', 'http://localhost:8080/api/files/f95700e1-7954-46ad-94db-0180d02024c0.gif', '', 47, 0, 'testUser', '2025-05-06 20:30:13', '2025-05-06 22:14:39');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '角色名称',
  `role_desc` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '角色注释说明',
  `create_time` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'admin', '创建管理员', '2025-05-06 21:42:32');
INSERT INTO `role` VALUES (2, 'user', '普通用户', '2025-05-06 21:42:49');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '登录账号',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '加密密码',
  `nick_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '角色',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱地址',
  `status` int NULL DEFAULT 1 COMMENT '账号状态(0-禁用,1-正常)',
  `create_time` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 'admin', 'admin', 'admin@qq.com', 1, '2025-05-06 21:53:40', '2025-05-06 21:53:40');
INSERT INTO `user` VALUES (2, 'testUser', 'e10adc3949ba59abbe56e057f20f883e', 'testUser', 'user', '11111@qq.com', 1, '2025-05-06 21:53:45', '2025-05-06 21:53:45');
INSERT INTO `user` VALUES (3, 'testUser01', 'e10adc3949ba59abbe56e057f20f883e', 'testUser01', 'user', '22222@qq.com', 1, '2025-05-06 21:53:46', '2025-05-06 21:53:46');
INSERT INTO `user` VALUES (4, 'testUser02', 'e10adc3949ba59abbe56e057f20f883e', 'testUser02', 'user', '222222222@qq.com', 1, '2025-05-06 21:53:46', '2025-05-06 21:53:46');
INSERT INTO `user` VALUES (5, 'testUser03', 'e10adc3949ba59abbe56e057f20f883e', 'testUser03', 'user', '333333333333@qq.com', 1, '2025-05-06 21:53:47', '2025-05-06 21:53:47');
INSERT INTO `user` VALUES (6, 'testUser04', 'e10adc3949ba59abbe56e057f20f883e', 'testUser04', 'user', '4444444444@qq.com', 1, '2025-05-06 21:53:48', '2025-05-06 21:53:48');
INSERT INTO `user` VALUES (7, 'testUser05', 'e10adc3949ba59abbe56e057f20f883e', 'testUser05', 'user', '55555@qq.com', 1, '2025-05-06 21:53:48', '2025-05-06 21:53:48');
INSERT INTO `user` VALUES (8, 'testUser06', 'e10adc3949ba59abbe56e057f20f883e', 'testUser06', 'user', '66666@qq.com', 1, '2025-05-06 21:53:50', '2025-05-06 21:53:50');

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role`  (
  `user_id` bigint NOT NULL COMMENT '用户表ID',
  `role_id` bigint NOT NULL COMMENT '角色表ID',
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_role
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
