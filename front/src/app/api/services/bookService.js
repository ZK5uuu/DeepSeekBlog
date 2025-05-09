import api from '../axios';


// 1、封装 API 请求： 这些 service 文件主要用于封装与后端 API 的所有通信。它们定义了前端应用如何与后端服务进行交互。
// 2、抽象化 HTTP 请求： service 文件将原始的 HTTP 请求（如 GET, POST, PUT, DELETE 等）抽象成易于使用的函数。例如：
// 图书相关接口
export const bookApi = {
  // 获取图书列表
  getBookList: (params) => api.get('/books', { params }),
  
  // 获取图书详情
  getBookById: (id) => api.get(`/books/${id}`),
  
  // 根据图书类型获取图书列表
  getBooksByGenre: (genre) => api.get(`/books/genre/${genre}`),
  
  // 获取所有图书类型
  getAllGenres: () => api.get('/books/genres'),
  
  // 获取推荐图书
  getRecommendedBooks: (limit = 5) => api.get(`/books/recommended?limit=${limit}`),
  
  // 获取精选图书（评分最高的）
  getFeaturedBook: () => api.get('/books/featured'),
  
  // 获取最新图书
  getLatestBooks: (limit = 10) => api.get(`/books/latest?limit=${limit}`),
  
  // 搜索图书
  searchBooks: (query) => api.get(`/books/search?q=${encodeURIComponent(query)}`),
  
  // 获取作者信息
  getAuthorInfo: (authorId) => api.get(`/books/author/${authorId}`),
};

// 创建一些模拟数据，用于在后端API完成前测试
export const mockBooks = [
  {
    id: 1,
    title: "活着",
    author: "余华",
    year: 1993,
    cover: "/images/books/to-live.jpg",
    description: "讲述了农村人福贵悲惨的人生遭遇。福贵本是个阔少爷，因为嗜赌成性，卖光了家里田产，一贫如洗。",
    rating: 9.4,
    genre: ["小说", "中国文学", "现实主义"],
    pages: 226,
    publisher: "作家出版社"
  },
  {
    id: 2,
    title: "百年孤独",
    author: "加西亚·马尔克斯",
    year: 1967,
    cover: "/images/books/one-hundred-years.jpg",
    description: "讲述了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰，融入了神话传说、民间故事、宗教典故等神秘因素。",
    rating: 9.5,
    genre: ["小说", "魔幻现实主义", "外国文学"],
    pages: 360,
    publisher: "南海出版公司"
  },
  {
    id: 3,
    title: "三体",
    author: "刘慈欣",
    year: 2006,
    cover: "/images/books/three-body.jpg",
    description: "文化大革命如火如荼进行的同时，军方发起一个绝秘计划，派遣科学家向宇宙发出地球文明的信息。一个绝望的科学家向宇宙发出了地球文明的请求，四光年外的三体文明接收到了这个信息。",
    rating: 9.3,
    genre: ["科幻", "小说", "中国文学"],
    pages: 302,
    publisher: "重庆出版社"
  },
  {
    id: 4,
    title: "解忧杂货店",
    author: "东野圭吾",
    year: 2012,
    cover: "/images/books/convenience-store.jpg",
    description: "在一家偏僻的小镇杂货店，店主收到了来自陌生人的咨询信，决定给予回答，由此展开一系列奇妙故事。",
    rating: 8.9,
    genre: ["小说", "日本文学", "治愈"],
    pages: 291,
    publisher: "南海出版公司"
  },
  {
    id: 5,
    title: "人类简史",
    author: "尤瓦尔·赫拉利",
    year: 2014,
    cover: "/images/books/sapiens.jpg",
    description: "从十万年前有生命迹象开始，讲述了人类如何从默默无闻的动物演变成为地球霸主，创造出关乎上帝、国家、人权等概念。",
    rating: 9.2,
    genre: ["历史", "人类学", "科普"],
    pages: 440,
    publisher: "中信出版社"
  },
  // {
  //   id: 6,
  //   title: "红楼梦",
  //   author: "曹雪芹",
  //   year: 1791,
  //   cover: "/images/books/dream-of-red-chamber.jpg",
  //   description: "中国古典四大名著之一，描写了贾、史、王、薛四大家族的兴衰，以及以贾宝玉、林黛玉、薛宝钗为主的年轻一代的人生悲剧。",
  //   rating: 9.6,
  //   genre: ["古典文学", "小说", "中国文学"],
  //   pages: 1160,
  //   publisher: "人民文学出版社"
  // }
];

// 导出中英文类型映射
export const genreMapping = {
  '小说': { en: 'fiction', icon: '📖' },
  '科幻': { en: 'sci-fi', icon: '🚀' },
  '文学': { en: 'literature', icon: '✒️' },
  '历史': { en: 'history', icon: '🏛️' },
  '哲学': { en: 'philosophy', icon: '🧠' },
  '经济': { en: 'economics', icon: '💹' },
  '管理': { en: 'management', icon: '📊' },
  '传记': { en: 'biography', icon: '👤' },
  '艺术': { en: 'art', icon: '🎨' },
  '心理': { en: 'psychology', icon: '🧐' },
  '社科': { en: 'social-science', icon: '🌍' },
  '科普': { en: 'popular-science', icon: '🔬' },
  '教育': { en: 'education', icon: '🎓' },
  '古典文学': { en: 'classics', icon: '📜' },
  '中国文学': { en: 'chinese-literature', icon: '🏮' },
  '外国文学': { en: 'foreign-literature', icon: '🌐' },
  '魔幻': { en: 'fantasy', icon: '🧙' }
}; 