import api from '../axios';

// 音乐相关接口
export const musicApi = {
  // 获取音乐列表
  getMusicList: (params) => api.get('/music', { params }),
  
  // 获取音乐详情
  getMusicById: (id) => api.get(`/music/${id}`),
  
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
};

// 创建一些模拟数据，用于在后端API完成前测试
export const mockMusic = [
  {
    id: 1,
    title: "春江花月夜",
    artist: "李云迪",
    year: 2008,
    cover: "/images/music/moonlight.jpg",
    description: "改编自唐代诗人张若虚的同名诗作，通过钢琴演奏展现出中国古典音乐的韵味与美感。",
    rating: 9.5,
    genre: ["古典", "钢琴", "中国风"],
    sampleUrl: "https://music.163.com/song/media/outer/url?id=5264843.mp3"
  },
  {
    id: 2,
    title: "梁祝",
    artist: "吕思清",
    year: 2002,
    cover: "/images/music/butterfly-lovers.jpg",
    description: "中国传统名曲，讲述了梁山伯与祝英台的爱情故事，被誉为'东方的罗密欧与朱丽叶'。",
    rating: 9.7,
    genre: ["古典", "小提琴", "交响乐"],
    sampleUrl: "https://music.163.com/song/media/outer/url?id=5281339.mp3"
  },
  {
    id: 3,
    title: "夜曲",
    artist: "周杰伦",
    year: 2005,
    cover: "/images/music/nocturne.jpg",
    description: "周杰伦经典作品，歌曲以钢琴伴奏为主，讲述了一段忧伤的爱情故事。",
    rating: 9.3,
    genre: ["流行", "R&B", "情歌"],
    sampleUrl: "https://music.163.com/song/media/outer/url?id=185815.mp3"
  },
  {
    id: 4,
    title: "克罗地亚狂想曲",
    artist: "马克西姆",
    year: 2012,
    cover: "/images/music/croatian-rhapsody.jpg",
    description: "融合了克罗地亚民族音乐与古典钢琴的现代作品，热情奔放又不失优雅。",
    rating: 9.0,
    genre: ["现代", "钢琴", "世界音乐"],
    sampleUrl: "https://music.163.com/song/media/outer/url?id=1843398057.mp3"
  },
  {
    id: 5,
    title: "月光奏鸣曲",
    artist: "贝多芬",
    year: 1801,
    cover: "/images/music/moonlight-sonata.jpg",
    description: "贝多芬最著名的钢琴奏鸣曲之一，第一乐章以平静而忧伤的旋律著称。",
    rating: 9.8,
    genre: ["古典", "钢琴", "奏鸣曲"],
    sampleUrl: "https://music.163.com/song/media/outer/url?id=5276933.mp3"
  },
  {
    id: 6,
    title: "River Flows In You",
    artist: "李闰珉",
    year: 2011,
    cover: "/images/music/river-flows.jpg",
    description: "韩国作曲家李闰珉创作的钢琴曲，优美而富有感染力，被广泛用于影视作品。",
    rating: 9.2,
    genre: ["纯音乐", "钢琴", "现代"],
    sampleUrl: "https://music.163.com/song/media/outer/url?id=4010197.mp3"
  }
];

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