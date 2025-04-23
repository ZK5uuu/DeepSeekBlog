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
  deletePost: (id) => {
    console.log(`正在删除文章, ID: ${id}`);
    return api.delete(`/posts/${id}`)
      .then(response => {
        console.log('删除文章成功:', response);
        return response;
      })
      .catch(error => {
        console.error('删除文章API错误:', error);
        throw error;
      });
  },
  
  // 获取推荐文章
  getRecommendPosts: (limit = 5) => api.get(`/posts/recommend?limit=${limit}`),
  
  // 根据标签获取文章
  getPostsByTagId: (tagId) => api.get(`/posts/tag/${tagId}`),
  
  // 根据内容类型获取文章
  getPostsByContentType: (contentType) => {
    console.log(`请求内容类型: ${contentType}，URL: /posts/type/${contentType}`);
    return api.get(`/posts/type/${contentType}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(`内容类型${contentType}的响应:`, response);
      console.log(`响应数据结构:`, JSON.stringify(response.data, null, 2));
      return response;
    })
    .catch(error => {
      console.error(`获取${contentType}内容类型出错:`, error);
      throw error;
    });
  },
  
  // 点赞文章
  likePost: (id) => api.post(`/posts/${id}/like`),
  
  // 增加文章浏览量
  viewPost: (id) => {
    console.log(`[浏览量] 开始请求增加文章浏览量 ID=${id}`);
    
    // 检查是否已经存在进行中的请求
    if (postApi._pendingViewRequests && postApi._pendingViewRequests[id]) {
      console.log(`[浏览量] 已存在对ID=${id}的浏览量请求，跳过`);
      return postApi._pendingViewRequests[id];
    }
    
    // 创建并存储请求Promise
    if (!postApi._pendingViewRequests) postApi._pendingViewRequests = {};
    
    const request = api.post(`/posts/${id}/view`)
      .then(response => {
        console.log(`[浏览量] 增加浏览量成功: ID=${id}`, response);
        // 请求完成后清除
        if (postApi._pendingViewRequests) {
          delete postApi._pendingViewRequests[id];
        }
        return response;
      })
      .catch(error => {
        console.error(`[浏览量] 增加浏览量API错误: ID=${id}`, error);
        // 请求完成后清除
        if (postApi._pendingViewRequests) {
          delete postApi._pendingViewRequests[id];
        }
        throw error;
      });
    
    postApi._pendingViewRequests[id] = request;
    return request;
  },
  
  // 获取所有数据库文章（调试用）
  getAllPosts: () => api.get('/posts/all'),
};

// 标签相关接口
export const tagApi = {
  // 获取标签列表
  getTagList: () => api.get('/tags'),
  
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