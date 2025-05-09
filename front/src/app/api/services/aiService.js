import api from '../axios';

// AI相关接口
export const aiApi = {
  // 生成文章摘要
  generateSummary: (postId) => api.post(`/deepseek/summary/${postId}`),
  
  // 获取已生成的摘要
  getSummary: (postId) => api.get(`/deepseek/summary/${postId}`),
};

export default aiApi; 