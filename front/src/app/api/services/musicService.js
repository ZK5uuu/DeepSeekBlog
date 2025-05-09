import api from '../axios';

// 音乐相关接口
export const musicApi = {
  // 获取音乐列表
  getMusicList: (params) => api.get('/music', { params }),
  
  // 获取音乐详情
  getMusicById: (id) => {
    console.log(`请求音乐详情: ID=${id}, URL=/api/music/${id}`);
    return api.get(`/api/music/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(`音乐详情响应:`, response);
      return response;
    })
    .catch(error => {
      console.error(`获取音乐详情出错:`, error);
      throw error;
    });
  },
  
  // 根据音乐类型获取音乐列表
  getMusicByGenre: (genre) => api.get(`/music/genre/${genre}`),
  
  // 获取所有音乐类型
  getAllGenres: () => api.get('/music/genres'),
  
  // 获取推荐音乐
  getRecommendedMusic: (limit = 5) => api.get(`/music/recommended?limit=${limit}`),
  
  // 获取精选音乐（评分最高的）
  getFeaturedMusic: () => api.get('/music/featured'),
  
  // 获取最新音乐
  getLatestMusic: (limit = 10) => api.get(`/music/latest?limit=${limit}`),
  
  // 搜索音乐
  searchMusic: (query) => api.get(`/music/search?q=${encodeURIComponent(query)}`),
  
  // 获取音乐试听链接
  getMusicSample: (id) => api.get(`/music/${id}/sample`),
  
  // 获取所有音乐
  getAllMusic: () => {
    console.log('请求所有音乐, URL=/api/music');
    return api.get('/api/music', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('所有音乐响应:', response);
      return response;
    })
    .catch(error => {
      console.error('获取所有音乐出错:', error);
      throw error;
    });
  },
  
  // 增加浏览量
  incrementViewCount: (id) => {
    console.log(`增加音乐浏览量: ID=${id}`);
    return api.post(`/api/music/${id}/view`, {});
  },
  
  // 增加点赞数
  incrementLikeCount: (id) => api.post(`/api/music/${id}/like`, {}),
  
  // 删除音乐
  deleteMusic: (id) => {
    console.log(`删除音乐: ID=${id}`);
    return api.delete(`/api/music/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  },
  
  // 更新音乐
  updateMusic: (id, data) => {
    console.log(`更新音乐数据: ID=${id}`, data);
    return api.put(`/api/music/${id}`, data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  },
  
  // 创建新音乐
  createMusic: (data) => {
    console.log('创建新音乐', data);
    return api.post('/api/music', data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  },
  
  // 获取调试信息
  getDebugInfo: () => {
    console.log('请求音乐调试信息');
    return api.get('/api/music/debug');
  }
};

// 导出中英文类型映射
export const genreMapping = {
  '古典': { en: 'classical', icon: '🎻' },
  '交响乐': { en: 'symphony', icon: '🎼' },
  '现代': { en: 'modern', icon: '🎹' },
  '流行': { en: 'pop', icon: '🎤' },
  '民谣': { en: 'folk', icon: '🪕' },
  '抒情': { en: 'lyrical', icon: '🎵' },
  '电子': { en: 'electronic', icon: '🎛️' },
  '实验': { en: 'experimental', icon: '🔊' },
  '氛围': { en: 'ambient', icon: '🌊' },
  '民族': { en: 'ethnic', icon: '🏮' },
  '纯音乐': { en: 'instrumental', icon: '🎶' },
  '舞曲': { en: 'dance', icon: '💃' },
  '经典': { en: 'classic', icon: '📀' },
  'R&B': { en: 'rnb', icon: '🎤' },
  '情歌': { en: 'love', icon: '💖' },
  '励志': { en: 'motivational', icon: '🎶' },
  '华语': { en: 'chinese', icon: '🇨🇳' }
}; 