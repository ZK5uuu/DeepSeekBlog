"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaSort, FaPlay, FaVideo, FaUser, FaHeart, FaRegHeart, FaChartBar, FaFilm, FaRegCalendarAlt, FaPen } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { movieApi, mockMovies, genreMapping } from "../api/services/movieService";
import { useRouter, usePathname } from "next/navigation";
import { format, isValid, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FastAverageColor } from 'fast-average-color';
import { IoMdRefresh } from 'react-icons/io';

// 添加日期格式化函数
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '未知日期';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '未知日期';
    return format(date, 'yyyy年MM月dd日', { locale: zhCN });
  } catch (error) {
    console.error('日期格式化错误', dateString, error);
    return '未知日期';
  }
};

// 定义电影类型
interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  poster: string;
  description: string;
  rating: number;
  genre: string[];
  trailer?: string;
  isLiked?: boolean;
  views?: number;
  publishDate?: string;
}

// 用于会话存储已查看文章的键
const VIEWED_POSTS_SESSION_KEY = 'viewed_movies';

// 检查电影是否已在当前会话中被查看
const hasViewedInSession = (movieId: string): boolean => {
  try {
    // 在开发环境下始终允许增加浏览量，方便测试
    if (process.env.NODE_ENV !== 'production') {
      console.log('开发环境，允许增加浏览量');
      return false;
    }
    
    const storedMovies = sessionStorage.getItem(VIEWED_POSTS_SESSION_KEY);
    if (!storedMovies) return false;
    
    const viewedMoviesArray = JSON.parse(storedMovies);
    return Array.isArray(viewedMoviesArray) && viewedMoviesArray.includes(movieId);
  } catch (error) {
    console.error('检查查看状态时出错:', error);
    return false; // 出错时默认为未查看
  }
};

// 标记电影为已在会话中查看
const markAsViewedInSession = (movieId: string): void => {
  try {
    const storedMovies = sessionStorage.getItem(VIEWED_POSTS_SESSION_KEY);
    
    if (storedMovies) {
      try {
        const parsed = JSON.parse(storedMovies);
        if (Array.isArray(parsed)) {
          const viewedMovies = parsed;
          if (!viewedMovies.includes(movieId)) {
            viewedMovies.push(movieId);
            sessionStorage.setItem(VIEWED_POSTS_SESSION_KEY, JSON.stringify(viewedMovies));
            console.log(`已将电影 ${movieId} 标记为已查看`);
          } else {
            console.log(`电影 ${movieId} 已经被标记为已查看，不再增加浏览量`);
          }
        }
      } catch {
        // 解析错误，使用空数组
        const viewedMovies = [movieId];
        sessionStorage.setItem(VIEWED_POSTS_SESSION_KEY, JSON.stringify(viewedMovies));
        console.log(`电影 ${movieId} 标记为已查看时出错，使用空数组`);
      }
    } else {
      // 不存在记录，创建新数组
      const viewedMovies = [movieId];
      sessionStorage.setItem(VIEWED_POSTS_SESSION_KEY, JSON.stringify(viewedMovies));
      console.log(`电影 ${movieId} 标记为已查看时出错，sessionStorage中没有viewed_movies`);
    }
  } catch (error) {
    console.error('标记为已查看时出错', error);
  }
};

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"newest" | "oldest">("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isUserBlogs, setIsUserBlogs] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  
  // 获取所有可用的电影类型
  const movieGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach(movie => {
      movie.genre.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }, [movies]);

  // 筛选和排序电影
  const filterAndSortMovies = () => {
    if (!movies.length) {
      setFilteredMovies([]);
      return;
    }
    
    let filtered = [...movies];
    
    // 搜索筛选
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(term) || 
        movie.director.toLowerCase().includes(term) ||
        movie.description?.toLowerCase().includes(term)
      );
    }
    
    // 类型筛选
    if (selectedGenre) {
      filtered = filtered.filter(movie => 
        movie.genre.includes(selectedGenre)
      );
    }
    
    // 排序逻辑
    if (sortOption === "newest") {
      filtered = [...filtered].sort((a, b) => b.year - a.year);
    } else {
      filtered = [...filtered].sort((a, b) => a.year - b.year);
    }
    
    setFilteredMovies(filtered);
  };
  
  // 获取电影数据
  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await movieApi.getMovieList({
        page: 1,
        size: 50,
        sortBy: sortOption,
        order: "DESC"
      });
      
      if (response.status === 200) {
        // 从API响应中提取电影列表
        const moviesData = response.data.movies || response.data || [];
        
        // 为电影添加喜欢状态（如果用户已登录）
        const moviesWithLikeStatus = moviesData.map((movie: Movie) => ({
          ...movie,
          isLiked: likedMovies.includes(movie.id)
        }));
        
        setMovies(moviesWithLikeStatus);
        setFilteredMovies(moviesWithLikeStatus);
      } else {
        setError('获取电影数据失败');
      }
    } catch (err) {
      console.error('获取电影列表出错:', err);
      setError('获取电影数据时发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取电影数据
  useEffect(() => {
    // 获取当前用户ID - 这里简化处理
    const mockUserId = localStorage.getItem("userId") || null;
    setUserId(mockUserId);
    
    // 加载已喜欢的电影
    const savedLikes = localStorage.getItem('likedMovies');
    if (savedLikes) {
      setLikedMovies(JSON.parse(savedLikes));
    }
    
    fetchMovies();
    
    // 添加页面可见性变化监听
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('页面变为可见，刷新数据');
        fetchMovies();
      }
    };
    
    // 定义历史导航处理函数
    const handlePopState = () => {
      console.log('检测到浏览器导航事件（后退/前进），刷新数据');
      fetchMovies();
    };
    
    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 添加历史导航监听
    window.addEventListener('popstate', handlePopState);
    
    // 返回函数（组件卸载时会执行）
    return () => {
      console.log('清除页面事件监听');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 监听筛选条件变化
  useEffect(() => {
    filterAndSortMovies();
  }, [searchTerm, selectedGenre, sortOption, movies]);
  
  // 切换用户博客显示
  const toggleUserBlogs = () => {
    setIsUserBlogs(!isUserBlogs);
  };

  // 添加或移除电影类型
  const toggleGenre = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  // 处理点赞
  const handleLike = async (id: number) => {
    try {
      // 更新本地状态
      let newLikedMovies;
      if (likedMovies.includes(id)) {
        newLikedMovies = likedMovies.filter(movieId => movieId !== id);
      } else {
        newLikedMovies = [...likedMovies, id];
      }
      
      setLikedMovies(newLikedMovies);
      localStorage.setItem('likedMovies', JSON.stringify(newLikedMovies));
      
      // 更新显示的电影列表
      setMovies(movies.map(movie => 
        movie.id === id 
          ? { ...movie, isLiked: !movie.isLiked } 
          : movie
      ));

      console.log(`Liked movie with ID: ${id}`);
    } catch (error) {
      console.error("Failed to like movie:", error);
    }
  };

  // 骨架屏组件
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-black/30 rounded-xl overflow-hidden shadow-lg animate-pulse border border-purple-500/10">
          <div className="h-48 bg-purple-900/20"></div>
          <div className="p-4">
            <div className="h-6 bg-purple-900/20 rounded-lg mb-3 w-3/4"></div>
            <div className="h-4 bg-purple-900/20 rounded-lg mb-2 w-1/2"></div>
            <div className="h-4 bg-purple-900/20 rounded-lg mb-2 w-5/6"></div>
            <div className="h-4 bg-purple-900/20 rounded-lg w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const MovieCard = ({ movie, onLike }: { movie: Movie; onLike: (id: number) => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const [bgColor, setBgColor] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('white');
    const [isColorExtracted, setIsColorExtracted] = useState(false);
    
    // 简化卡片样式，使用固定背景色
    const getDefaultBackgroundColor = () => {
      // 根据索引返回不同的背景色
      const colors = ['bg-blue-700', 'bg-orange-700', 'bg-green-700', 'bg-gray-700'];
      const index = Math.abs(movie.id) % colors.length;
      return colors[index];
    };
 
    const handleCardClick = () => {
      console.log('Card clicked, navigating to movie detail page for ID:', movie.id);
      router.push(`/movie/${movie.id}`);
    };
    
    const handleLikeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onLike(movie.id);
    };

    // 获取封面图片源
    const getImageSrc = () => {
      if (movie.poster && movie.poster.startsWith('/')) {
        return `https://image.tmdb.org/t/p/w500${movie.poster}`;
      }
      if (movie.poster) {
        return movie.poster;
      }
      // 最后使用默认图片
      return 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80';
    };

    // 获取显示标题
    const getDisplayTitle = () => {
      return movie.title || "未知电影";
    };
    
    // 从图片提取颜色
    const extractColor = async () => {
      if (!imageRef.current || isColorExtracted) return;
      
      try {
        const fac = new FastAverageColor();
        const color = await fac.getColorAsync(imageRef.current);
        
        console.log(`提取的颜色: ${color.hex}, 是否暗色: ${color.isDark}, rgba: ${color.rgba}`);
        
        // 直接设置背景色为提取的颜色
        setBgColor(color.hex);
        
        // 根据背景色亮度设置文本颜色
        setTextColor(color.isDark ? 'white' : '#333');
        
        // 标记颜色已提取
        setIsColorExtracted(true);
      } catch (e) {
        console.error('提取颜色失败:', e);
      }
    };
    
    // 图片加载完成后提取颜色
    useEffect(() => {
      if (isLoaded && imageRef.current) {
        extractColor();
      }
    }, [isLoaded]);

    return (
      <div 
        className={`rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${!isColorExtracted ? getDefaultBackgroundColor() : ''}`}
        onClick={handleCardClick}
        style={{
          backgroundColor: isColorExtracted ? bgColor : undefined,
        }}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            ref={imageRef as any}
            src={getImageSrc()}
            alt={getDisplayTitle()}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onLoadingComplete={() => setIsLoaded(true)}
            crossOrigin="anonymous"
          />
        </div>
        <div className="p-4" style={{ color: textColor }}>
          <h3 className="text-xl font-bold truncate">
            {getDisplayTitle()}
          </h3>
          <p className="text-sm mt-1 opacity-85">
            {movie.director || "未知导演"}
          </p>
          
          {/* 标签显示 */}
          <div className="flex items-center mt-2 space-x-2">
            {(movie.genre && movie.genre.length > 0) ? (
              <span className="px-2 py-1 text-xs rounded-full bg-black/20">
                {movie.genre[0]}
              </span>
            ) : (
              <span className="px-2 py-1 text-xs rounded-full bg-black/20">
                电影
              </span>
            )}
          </div>
          
          {/* 底部信息 */}
          <div className="flex justify-between items-center mt-3 text-sm">
            <div className="flex items-center">
              <span className="mr-2">{movie.views || 0}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span>{movie.year}</span>
            <button 
              onClick={handleLikeClick}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={movie.isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {movie.isLiked ? '已喜欢' : '喜欢'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
        <FaFilm className="mr-2 text-indigo-600" />
        电影推荐
      </h1>

      {/* 添加"创建新电影"按钮 */}
      <div className="flex justify-end mb-6">
        <Link 
          href="/movie/create" 
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors shadow-md"
        >
          <FaPen className="mr-2" />
          <span>创建新电影</span>
        </Link>
      </div>
      
      {/* 搜索和筛选控件 */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* 搜索框 */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="搜索电影、导演或关键词..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-blue-900/30 border border-blue-800/30 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-white placeholder-purple-300"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
        </div>

        {/* 筛选按钮 */}
        <div className="relative">
          <motion.button
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsSortOpen(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-5 py-3 bg-blue-900/40 border border-blue-800/30 rounded-full text-white hover:bg-blue-800/50 shadow-md"
          >
            <FaFilter className="mr-2" />
            电影类型
          </motion.button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute right-0 mt-2 w-72 bg-blue-900/90 backdrop-blur-md border border-blue-800/30 shadow-xl rounded-xl p-4 z-10"
              >
                <p className="text-sm font-medium mb-3 text-pink-400">选择电影类型</p>
                <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent pr-2">
                  {movieGenres.map((genre) => (
                    <button 
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`text-xs px-3 py-1.5 rounded-full ${
                        selectedGenre === genre
                          ? "bg-pink-600 text-white shadow-md"
                          : "bg-blue-800/50 text-blue-200 hover:bg-blue-700/50"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                {selectedGenre && (
                  <button
                    onClick={() => setSelectedGenre(null)}
                    className="text-xs text-pink-400 mt-3 hover:text-pink-300 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    清除所有选择
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* 最新按钮 */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-5 py-3 bg-blue-900/40 border border-blue-800/30 rounded-full text-white hover:bg-blue-800/50 shadow-md"
          >
            最新
          </motion.button>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* 添加错误信息显示 */}
            {error && (
              <div className="w-full bg-red-100 border border-red-300 rounded-lg p-4 mb-6 text-red-700">
                <p className="font-medium mb-1">获取数据时出错</p>
                <p>{error}</p>
                <button 
                  onClick={() => fetchMovies()}
                  className="mt-3 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded-md text-white transition-colors"
                >
                  重试
                </button>
              </div>
            )}
            
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMovies.map((item) => (
                  <MovieCard key={item.id} movie={item} onLike={handleLike} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-700">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center mb-6 border border-indigo-200 shadow-lg"
                >
                  <FaVideo className="text-6xl text-indigo-400" />
                </motion.div>
                {isUserBlogs ? (
                  <div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">还没有发布过影评</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      分享你对喜爱电影的感受和见解，让更多人了解你的电影品味
                    </p>
                    <Link href="/blog/create?type=movie">
                      <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(110, 0, 255, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium flex items-center mx-auto shadow-lg"
                      >
                        <FaPlay className="mr-2" /> 写第一篇影评
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">没有找到相关影评</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      尝试调整筛选条件或搜索关键词，发现更多精彩内容
                    </p>
                    
                    <motion.button 
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedGenre(null);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 px-6 py-2 bg-indigo-100 rounded-full border border-indigo-200 text-indigo-600 flex items-center mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      重置筛选条件
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {/* 悬浮创建按钮 */}
        <div className="fixed bottom-8 right-8 md:hidden">
          <Link href="/blog/create?type=movie">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(110, 0, 255, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
            >
              <FaPen className="text-xl" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
} 