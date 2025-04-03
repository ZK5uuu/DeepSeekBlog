import api from '../axios';

// 文章相关接口
export const postApi = {
  // 获取文章列表
  getPostList: (params) => api.get('/posts', { params }),
  
  // 获取文章详情
  getPostById: (id) => api.get(`/posts/${id}`),
  
  // 创建文章
  createPost: (data) => api.post('/posts', data),
  
  // 更新文章
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  
  // 删除文章
  deletePost: (id) => api.delete(`/posts/${id}`),
  
  // 获取推荐文章
  getRecommendPosts: (limit = 5) => api.get(`/posts/recommend?limit=${limit}`),
  
  // 根据标签获取文章
  getPostsByTagId: (tagId) => api.get(`/posts/tag/${tagId}`),
  
  // 点赞文章
  likePost: (id) => api.post(`/posts/${id}/like`),
  
  // 获取热门标签
  getPopularTags: (limit = 10) => api.get(`/posts/tags/popular?limit=${limit}`),
};

// 标签相关接口
export const tagApi = {
  // 获取标签列表
  getTagList: (params) => api.get('/tags', { params }),
  
  // 获取标签详情
  getTagById: (id) => api.get(`/tags/${id}`),
  
  // 创建标签
  createTag: (data) => api.post('/tags', data),
  
  // 更新标签
  updateTag: (id, data) => api.put(`/tags/${id}`, data),
  
  // 删除标签
  deleteTag: (id) => api.delete(`/tags/${id}`),
  
  // 获取热门标签
  getPopularTags: (limit = 10) => api.get(`/tags/popular?limit=${limit}`),
  
  // 根据文章ID获取标签列表
  getTagsByPostId: (postId) => api.get(`/tags/post/${postId}`),
};

// 评论相关接口
export const commentApi = {
  // 创建评论
  createComment: (data) => api.post('/comments', data),
  
  // 更新评论
  updateComment: (id, data) => api.put(`/comments/${id}`, data),
  
  // 删除评论
  deleteComment: (id) => api.delete(`/comments/${id}`),
  
  // 获取评论详情
  getCommentById: (id) => api.get(`/comments/${id}`),
  
  // 根据文章ID获取评论列表
  getCommentsByPostId: (postId) => api.get(`/comments/post/${postId}`),
  
  // 根据用户ID获取评论列表
  getCommentsByUserId: (userId) => api.get(`/comments/user/${userId}`),
  
  // 点赞评论
  likeComment: (id) => api.post(`/comments/${id}/like`),
}; 