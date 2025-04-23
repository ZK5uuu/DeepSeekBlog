import axios from 'axios';

// 默认的API路径
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 电影类型映射
export const genreMapping = {
  "动作": { name: "动作", icon: "🔥" },
  "喜剧": { name: "喜剧", icon: "😂" },
  "科幻": { name: "科幻", icon: "🚀" },
  "恐怖": { name: "恐怖", icon: "👻" },
  "动画": { name: "动画", icon: "🎬" },
  "悬疑": { name: "悬疑", icon: "🔍" },
  "犯罪": { name: "犯罪", icon: "🕵️" },
  "冒险": { name: "冒险", icon: "🌍" },
  "奇幻": { name: "奇幻", icon: "🧙" },
  "爱情": { name: "爱情", icon: "❤️" },
  "纪录片": { name: "纪录片", icon: "📹" },
  "家庭": { name: "家庭", icon: "👨‍👩‍👧" },
};

// 模拟电影数据 - 当API不可用时使用
export const mockMovies = [
  {
    id: 1,
    title: "盗梦空间",
    director: "克里斯托弗·诺兰",
    year: 2010,
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    description: "一个盗梦高手和他的团队被雇来在一个目标人物的潜意识中植入一个想法，而这可能是唯一的方法让他重获自由。",
    rating: 8.8,
    genre: ["科幻", "动作", "冒险"],
    trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0"
  },
  {
    id: 2,
    title: "星际穿越",
    director: "克里斯托弗·诺兰",
    year: 2014,
    poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    description: "在不久的将来，地球面临环境危机，一组宇航员穿越虫洞寻找一个新的家园来拯救人类。",
    rating: 8.6,
    genre: ["科幻", "冒险", "奇幻"],
    trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E"
  },
  {
    id: 3,
    title: "楚门的世界",
    director: "彼得·威尔",
    year: 1998,
    poster: "https://m.media-amazon.com/images/M/MV5BMDIzODcyY2EtMmY2MC00ZWVlLTgwMzAtMjQwOWUyNmJjNTYyXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg",
    description: "一个普通人慢慢发现自己的整个生活都是一个电视真人秀节目的一部分。",
    rating: 8.1,
    genre: ["喜剧", "奇幻"],
    trailer: "https://www.youtube.com/watch?v=dlnmQbPGuls"
  },
  {
    id: 4,
    title: "让子弹飞",
    director: "姜文",
    year: 2010,
    poster: "https://m.media-amazon.com/images/M/MV5BMTM1Njc5NDU4MV5BMl5BanBnXkFtZTcwOTYxNjc5Ng@@._V1_SX300.jpg",
    description: "一个土匪头子假装成县长来到鹅城，却决定反抗当地的恶霸。",
    rating: 8.7,
    genre: ["动作", "喜剧", "犯罪"],
    trailer: "https://www.youtube.com/watch?v=YIpNKXP7pAU"
  },
  {
    id: 5,
    title: "千与千寻",
    director: "宫崎骏",
    year: 2001,
    poster: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    description: "小女孩千寻和父母意外进入神灵世界，她必须在这个奇特的世界里找到回家的方法。",
    rating: 8.6,
    genre: ["动画", "奇幻", "冒险"],
    trailer: "https://www.youtube.com/watch?v=ByXuk9QqQkk"
  },
  {
    id: 6,
    title: "指环王：王者归来",
    director: "彼得·杰克逊",
    year: 2003,
    poster: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    description: "护戒小队的旅程达到高潮，阿拉贡领导一场对抗索隆军队的战争，而弗罗多与山姆接近魔多。",
    rating: 8.9,
    genre: ["奇幻", "冒险", "动作"],
    trailer: "https://www.youtube.com/watch?v=r5X-hFf6Bwo"
  },
  {
    id: 7,
    title: "肖申克的救赎",
    director: "弗兰克·德拉邦特",
    year: 1994,
    poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    description: "一个银行家被错误地判处终身监禁，在肖申克监狱中与一个走私犯成为朋友，并找到了救赎之路。",
    rating: 9.3,
    genre: ["犯罪", "奇幻"],
    trailer: "https://www.youtube.com/watch?v=6hB3S9bIaco"
  },
  {
    id: 8,
    title: "疯狂动物城",
    director: "拜伦·霍华德",
    year: 2016,
    poster: "https://m.media-amazon.com/images/M/MV5BOTMyMjEyNzIzMV5BMl5BanBnXkFtZTgwNzIyNjU0NzE@._V1_SX300.jpg",
    description: "在一个由动物组成的大都市中，一个新晋警官和一个狡猾的狐狸必须联手破解一个复杂的案件。",
    rating: 8.0,
    genre: ["动画", "冒险", "喜剧"],
    trailer: "https://www.youtube.com/watch?v=jWM0ct-OLsM"
  }
];

// 电影 API 服务
export const movieApi = {
  // 获取电影列表
  getMovieList: async (params = {}) => {
    try {
      const { page = 1, size = 20, sortBy = 'newest', order = 'DESC' } = params;
      
      try {
        // 调用真实API
        const response = await axios.get(`${API_URL}/api/movies`, { 
          params: { page, size, sortBy, order } 
        });
        
        // 如果API调用成功，返回真实数据
        return response;
      } catch (apiError) {
        console.warn("API调用失败，使用模拟数据:", apiError);
        
        // 使用模拟数据
        return { 
          data: {
            movies: mockMovies,
            currentPage: 1,
            totalItems: mockMovies.length,
            totalPages: 1
          },
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error("获取电影列表时出错:", error);
      throw error;
    }
  },
  
  // 获取单个电影详情
  getMovie: async (id) => {
    try {
      try {
        // 调用真实API
        const response = await axios.get(`${API_URL}/api/movies/${id}`);
        return response;
      } catch (apiError) {
        console.warn(`API调用失败，使用模拟数据 (id=${id}):`, apiError);
        
        // 使用模拟数据
        const movie = mockMovies.find(movie => movie.id === parseInt(id));
        if (!movie) {
          throw new Error('电影不存在');
        }
        
        return {
          data: movie,
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error(`获取电影 ${id} 时出错:`, error);
      throw error;
    }
  },
  
  // 更新浏览量
  incrementViews: async (id) => {
    try {
      try {
        // 调用真实API
        const response = await axios.post(`${API_URL}/api/movies/${id}/views`);
        return response;
      } catch (apiError) {
        console.warn(`API调用失败，使用模拟响应 (id=${id}):`, apiError);
        
        // 模拟成功响应
        return {
          data: { success: true, message: '浏览量增加成功' },
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error(`更新电影 ${id} 浏览量时出错:`, error);
      throw error;
    }
  },
  
  // 更新电影喜欢状态
  toggleLike: async (id, userId = 1) => {
    try {
      try {
        // 调用真实API
        const response = await axios.post(`${API_URL}/api/movies/${id}/like`, null, {
          params: { userId }
        });
        return response;
      } catch (apiError) {
        console.warn(`API调用失败，使用模拟响应 (id=${id}):`, apiError);
        
        // 模拟成功响应
        return {
          data: { 
            success: true, 
            message: '喜欢状态更新成功',
            isLiked: true 
          },
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error(`更新电影 ${id} 喜欢状态时出错:`, error);
      throw error;
    }
  },
  
  // 获取相关电影推荐
  getRelatedMovies: async (id) => {
    try {
      try {
        // 调用真实API
        const response = await axios.get(`${API_URL}/api/movies/${id}/related`);
        return response;
      } catch (apiError) {
        console.warn(`API调用失败，使用模拟数据 (id=${id}):`, apiError);
        
        // 使用模拟数据随机选择3个电影作为相关推荐
        const relatedMovies = mockMovies
          .filter(movie => movie.id !== parseInt(id))
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        return {
          data: relatedMovies,
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error(`获取电影 ${id} 的相关推荐时出错:`, error);
      throw error;
    }
  },
  
  // 获取所有电影类型
  getGenres: async () => {
    try {
      try {
        // 调用真实API
        const response = await axios.get(`${API_URL}/api/movies/genres`);
        return response;
      } catch (apiError) {
        console.warn("API调用失败，使用模拟数据:", apiError);
        
        // 从模拟数据中提取所有类型
        const genres = [...new Set(mockMovies.flatMap(movie => movie.genre))];
        
        return {
          data: genres,
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error("获取电影类型时出错:", error);
      throw error;
    }
  },
  
  // 根据类型获取电影
  getMoviesByGenre: async (genre, params = {}) => {
    try {
      const { page = 1, size = 20, sortBy = 'rating', order = 'DESC' } = params;
      
      try {
        // 调用真实API
        const response = await axios.get(`${API_URL}/api/movies/genre/${genre}`, {
          params: { page, size, sortBy, order }
        });
        return response;
      } catch (apiError) {
        console.warn(`API调用失败，使用模拟数据 (genre=${genre}):`, apiError);
        
        // 使用模拟数据筛选指定类型的电影
        const filteredMovies = mockMovies.filter(movie => 
          movie.genre && movie.genre.includes(genre)
        );
        
        return {
          data: {
            movies: filteredMovies,
            currentPage: 1,
            totalItems: filteredMovies.length,
            totalPages: 1,
            genre
          },
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error(`获取类型为 ${genre} 的电影时出错:`, error);
      throw error;
    }
  },
  
  // 搜索电影
  searchMovies: async (query, params = {}) => {
    try {
      const { page = 1, size = 20, sortBy = 'rating', order = 'DESC' } = params;
      
      try {
        // 调用真实API
        const response = await axios.get(`${API_URL}/api/movies/search`, {
          params: { query, page, size, sortBy, order }
        });
        return response;
      } catch (apiError) {
        console.warn(`API调用失败，使用模拟数据 (query=${query}):`, apiError);
        
        // 使用模拟数据进行搜索
        const searchQuery = query.toLowerCase();
        const searchResults = mockMovies.filter(movie => 
          movie.title.toLowerCase().includes(searchQuery) ||
          movie.director.toLowerCase().includes(searchQuery) ||
          movie.description.toLowerCase().includes(searchQuery) ||
          (movie.genre && movie.genre.some(g => g.toLowerCase().includes(searchQuery)))
        );
        
        return {
          data: {
            movies: searchResults,
            currentPage: 1,
            totalItems: searchResults.length,
            totalPages: 1,
            query
          },
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error(`搜索电影 "${query}" 时出错:`, error);
      throw error;
    }
  },
  
  // 删除电影
  deleteMovie: async (id) => {
    try {
      console.log(`正在删除电影 ID: ${id}`);
      try {
        // 调用真实API
        const response = await axios.delete(`${API_URL}/api/movies/${id}`);
        console.log(`删除电影 ID: ${id} 成功:`, response.data);
        return response;
      } catch (apiError) {
        console.warn(`删除电影 API调用失败 (id=${id}):`, apiError);
        
        // 模拟环境处理 - 从mockMovies中删除
        if (process.env.NODE_ENV === 'development') {
          const movieIndex = mockMovies.findIndex(movie => movie.id === parseInt(id));
          if (movieIndex !== -1) {
            console.log(`在模拟数据中删除电影 ID: ${id}`);
            mockMovies.splice(movieIndex, 1);
          }
        }
        
        // 模拟成功响应
        return {
          data: { success: true, message: '电影删除成功' },
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error(`删除电影 ${id} 时出错:`, error);
      throw error;
    }
  },
  
  // 创建新电影
  createMovie: async (movieData) => {
    try {
      console.log('正在创建新电影:', movieData);
      
      // 确保genre字段格式正确 - 后端可能需要字符串格式
      const newMovie = { ...movieData };
      // 如果前端没有提供genreList但提供了genre数组，则自动添加
      if (Array.isArray(newMovie.genre) && !newMovie.genreList) {
        newMovie.genreList = newMovie.genre.join(',');
      }
      
      try {
        // 调用真实API
        const response = await axios.post(`${API_URL}/api/movies`, newMovie);
        console.log('创建电影成功:', response.data);
        return response;
      } catch (apiError) {
        console.warn('创建电影 API调用失败:', apiError);
        console.log('API错误详情:', apiError.response?.data || apiError.message);
        
        // 模拟环境处理 - 添加到mockMovies
        if (process.env.NODE_ENV === 'development') {
          // 生成新ID - 在模拟数据中使用最大ID + 1
          const newId = Math.max(...mockMovies.map(m => m.id), 0) + 1;
          const createdMovie = { 
            ...newMovie, 
            id: newId,
            // 添加默认值
            views: 0,
            publishDate: new Date().toISOString()
          };
          
          console.log(`在模拟数据中添加新电影 ID: ${newId}`);
          mockMovies.push(createdMovie);
          
          // 模拟成功响应
          return {
            data: { 
              success: true, 
              message: '电影创建成功',
              movie: createdMovie,
              id: newId
            },
            status: 201,
            statusText: 'Created'
          };
        }
        
        // 如果不是开发环境，重新抛出错误
        throw apiError;
      }
    } catch (error) {
      console.error('创建电影时出错:', error);
      throw error;
    }
  },
  
  // 更新电影信息
  updateMovie: async (movie) => {
    try {
      console.log(`正在更新电影 ID: ${movie.id}`, movie);
      
      // 确保genre字段格式正确 - 后端可能需要字符串格式
      const updatedMovie = { ...movie };
      if (Array.isArray(updatedMovie.genre)) {
        updatedMovie.genreList = updatedMovie.genre.join(',');
      }
      
      try {
        // 调用真实API
        const response = await axios.put(`${API_URL}/api/movies/${movie.id}`, updatedMovie);
        console.log(`更新电影 ID: ${movie.id} 成功:`, response.data);
        return response;
      } catch (apiError) {
        console.warn(`更新电影 API调用失败 (id=${movie.id}):`, apiError);
        
        // 模拟环境处理 - 更新mockMovies
        if (process.env.NODE_ENV === 'development') {
          const movieIndex = mockMovies.findIndex(m => m.id === parseInt(movie.id));
          if (movieIndex !== -1) {
            console.log(`在模拟数据中更新电影 ID: ${movie.id}`);
            mockMovies[movieIndex] = { 
              ...mockMovies[movieIndex], 
              ...movie,
              // 确保保留所有必要字段
              id: parseInt(movie.id)
            };
          }
        }
        
        // 模拟成功响应
        return {
          data: { 
            success: true, 
            message: '电影更新成功',
            movie: movie
          },
          status: 200,
          statusText: 'OK'
        };
      }
    } catch (error) {
      console.error(`更新电影 ${movie.id} 时出错:`, error);
      throw error;
    }
  }
}; 