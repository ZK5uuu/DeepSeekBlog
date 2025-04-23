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

// 音乐模拟数据
export const mockMusics = [
  {
    id: 1,
    title: "Shape of My Heart",
    artist: "Sting",
    year: 1993,
    cover: "/music-covers/sting.jpg",
    description: "优雅的吉他旋律和Sting富有情感的演唱，这首歌讲述了一个纸牌玩家在游戏中的哲学态度，以此作为人生隐喻。",
    album: "Ten Summoner's Tales",
    rating: 4.8,
    genre: ["摇滚", "民谣"],
    duration: "4:33",
    sampleUrl: "https://music.example.com/sting/shape-of-my-heart"
  },
  {
    id: 2,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    year: 1975,
    cover: "/music-covers/queen.jpg",
    description: "这首六分钟的史诗般作品融合了歌剧、重金属和摇滚，被认为是Queen最具代表性的歌曲之一。",
    album: "A Night at the Opera",
    rating: 4.9,
    genre: ["摇滚", "歌剧摇滚"],
    duration: "5:55",
    sampleUrl: "https://music.example.com/queen/bohemian-rhapsody"
  },
  {
    id: 3,
    title: "Take Five",
    artist: "Dave Brubeck",
    year: 1959,
    cover: "/music-covers/dave.jpg",
    description: "爵士乐历史上最著名的作品之一，以其不寻常的5/4拍子和萨克斯风独奏而闻名于世。",
    album: "Time Out",
    rating: 4.7,
    genre: ["爵士", "冷爵士"],
    duration: "5:24",
    sampleUrl: "https://music.example.com/dave-brubeck/take-five"
  },
  {
    id: 4,
    title: "Billie Jean",
    artist: "Michael Jackson",
    year: 1982,
    cover: "/music-covers/mj.jpg",
    description: "这首标志性的流行歌曲以其独特的贝斯线和MJ标志性的舞步而广为人知，也是他最具代表性的作品之一。",
    album: "Thriller",
    rating: 4.9,
    genre: ["流行", "放克"],
    duration: "4:54",
    sampleUrl: "https://music.example.com/michael-jackson/billie-jean"
  },
  {
    id: 5,
    title: "Imagine",
    artist: "John Lennon",
    year: 1971,
    cover: "/music-covers/lennon.jpg",
    description: "这首充满和平与希望的钢琴民谣是列侬最著名的个人作品，呼吁人们想象一个和平的世界。",
    album: "Imagine",
    rating: 4.8,
    genre: ["摇滚", "民谣"],
    duration: "3:03",
    sampleUrl: "https://music.example.com/john-lennon/imagine"
  },
  {
    id: 6,
    title: "Hotel California",
    artist: "Eagles",
    year: 1976,
    cover: "/music-covers/eagles.jpg",
    description: "这首充满神秘色彩的摇滚经典以其双重吉他独奏和隐喻性歌词著称，持续影响着几代音乐人。",
    album: "Hotel California",
    rating: 4.9,
    genre: ["摇滚", "乡村摇滚"],
    duration: "6:30",
    sampleUrl: "https://music.example.com/eagles/hotel-california"
  }
];

// 如果之前有 mockMusic 数组，保留它的兼容性
export const mockMusic = mockMusics;

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