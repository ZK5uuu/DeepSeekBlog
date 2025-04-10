import api from '../axios';

// 电影相关接口
export const movieApi = {
  // 获取电影列表
  getMovieList: (params) => api.get('/movies', { params }),
  
  // 获取电影详情
  getMovieById: (id) => api.get(`/movies/${id}`),
  
  // 根据电影类型获取电影列表
  getMoviesByGenre: (genre) => api.get(`/movies/genre/${genre}`),
  
  // 获取所有电影类型
  getAllGenres: () => api.get('/movies/genres'),
  
  // 获取推荐电影
  getRecommendedMovies: (limit = 5) => api.get(`/movies/recommended?limit=${limit}`),
  
  // 获取精选电影（评分最高的）
  getFeaturedMovie: () => api.get('/movies/featured'),
  
  // 获取最新电影
  getLatestMovies: (limit = 10) => api.get(`/movies/latest?limit=${limit}`),
  
  // 搜索电影
  searchMovies: (query) => api.get(`/movies/search?q=${encodeURIComponent(query)}`),
};

// 创建一些模拟数据，用于在后端API完成前测试
export const mockMovies = [
  {
    id: 1,
    title: "星际穿越",
    director: "克里斯托弗·诺兰",
    year: 2014,
    poster: "/images/movies/interstellar.jpg",
    description: "在不远的未来，地球面临粮食危机，一组宇航员通过一个神秘出现的虫洞前往宇宙深处，寻找人类新家园。",
    rating: 9.3,
    genre: ["科幻", "冒险", "剧情"],
    trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E"
  },
  {
    id: 2,
    title: "盗梦空间",
    director: "克里斯托弗·诺兰",
    year: 2010,
    poster: "/images/movies/inception.jpg",
    description: "一位专业的梦境盗取者受邀在一个人的潜意识中植入想法，而非窃取。这个危险任务可能是他完成的最后一项工作。",
    rating: 9.1,
    genre: ["科幻", "动作", "冒险"],
    trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0"
  },
  {
    id: 3,
    title: "肖申克的救赎",
    director: "弗兰克·德拉邦特",
    year: 1994,
    poster: "/images/movies/shawshank.jpg",
    description: "银行家安迪因妻子谋杀而被错误定罪，在肖申克监狱服刑。在那里，他与红成为朋友，并找到了希望。",
    rating: 9.7,
    genre: ["剧情", "犯罪"],
    trailer: "https://www.youtube.com/watch?v=6hB3S9bIaco"
  },
  {
    id: 4,
    title: "千与千寻",
    director: "宫崎骏",
    year: 2001,
    poster: "/images/movies/spirited-away.jpg",
    description: "小女孩千寻与父母误入一个神秘的世界，在那里人类会变成动物，而她的父母变成了猪。她必须找到回家的路。",
    rating: 9.4,
    genre: ["动画", "奇幻", "冒险"],
    trailer: "https://www.youtube.com/watch?v=ByXuk9QqQkk"
  },
  {
    id: 5,
    title: "黑暗骑士",
    director: "克里斯托弗·诺兰",
    year: 2008,
    poster: "/images/movies/dark-knight.jpg",
    description: "蝙蝠侠与警察上尉戈登和检察官哈维·登特联手打击犯罪，面对一个叫做小丑的混乱制造者的挑战。",
    rating: 9.2,
    genre: ["动作", "犯罪", "剧情"],
    trailer: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
  },
  {
    id: 6,
    title: "这个杀手不太冷",
    director: "吕克·贝松",
    year: 1994,
    poster: "/images/movies/leon.jpg",
    description: "一个专业杀手在纽约遇见了一个小女孩，女孩的家人被警察杀害，杀手将她收留并教她成为杀手。",
    rating: 9.0,
    genre: ["剧情", "犯罪", "动作"],
    trailer: "https://www.youtube.com/watch?v=jawVxq1Iyl0"
  }
];

// 导出中英文类型映射
export const genreMapping = {
  '科幻': { en: 'sci-fi', icon: '🚀' },
  '冒险': { en: 'adventure', icon: '🗺️' },
  '剧情': { en: 'drama', icon: '🎭' },
  '犯罪': { en: 'crime', icon: '🔍' },
  '动画': { en: 'animation', icon: '🎬' },
  '奇幻': { en: 'fantasy', icon: '✨' },
  '动作': { en: 'action', icon: '💥' },
  '喜剧': { en: 'comedy', icon: '😄' }
}; 