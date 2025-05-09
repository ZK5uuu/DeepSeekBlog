# 路由指南 / Routing Guide

## 路由结构 / Route Structure

此应用使用 Next.js 的 App Router 文件系统路由。以下是主要路由结构：

This application uses Next.js App Router file-based routing. Here's the main route structure:

### 主要路由 / Main Routes

| 路径 / Path | 描述 / Description |
|-------------|-------------------|
| `/book` | 书籍页面 / Book page |
| `/movie` | 电影页面 / Movie page |
| `/movie/[id]` | 电影详情页 / Movie detail page |
| `/music` | 音乐页面 / Music page |
| `/blog/create` | 创建博客页面 / Create blog page |
| `/blog/[id]` | 博客详情页 / Blog detail page |

### 重定向路由 / Redirect Routes

以下路由为冗余路由，会自动重定向到对应的主要路由：

The following routes are redundant and will automatically redirect to the corresponding main routes:

| 冗余路由 / Redundant Path | 重定向目标 / Redirects To |
|--------------------------|-------------------------|
| `/movies` | `/movie` |
| `/movies/[id]` | `/movie/[id]` |
| `/movies/genre` | `/movie` |

## 导航结构 / Navigation Structure

导航栏中的链接使用以下路径：
The navigation bar links use the following paths:

- 书籍 / Books: `/book`
- 电影 / Movies: `/movie`
- 音乐 / Music: `/music`

## 路由说明 / Route Notes

1. 为保持一致性，所有新功能和链接应使用单数形式的路径（如 `/movie` 而非 `/movies`）
2. 旧版本中的复数形式路径（如 `/movies`）已被设置为重定向，以保持向后兼容性

1. For consistency, all new features and links should use the singular form of paths (e.g., `/movie` instead of `/movies`)
2. The plural form paths from older versions (e.g., `/movies`) have been set up as redirects to maintain backward compatibility 