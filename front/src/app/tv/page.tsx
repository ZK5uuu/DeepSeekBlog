"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTv, FaSearch, FaFilter, FaChartBar, FaTag, FaEye, FaPlay, FaVideo } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';
import { FastAverageColor } from 'fast-average-color';
import { postApi } from '@/app/api/services/blogService';

// 日期格式化函数
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '未知日期';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '未知日期';
  }
};

// TV剧集接口定义
interface TVShow {
  id: number;
  title: string;
  creator: string;
  year: number;
  poster: string;
  description: string;
  rating: number;
  genre: string[];
  trailer?: string;
  isLiked?: boolean;
  views?: number;
  publishDate?: string;
  seasons?: number;
  episodes?: number;
  network?: string;
  status?: string;
  userId?: number;
}

// 检查用户是否已在会话中查看过这个剧集
const hasViewedInSession = (tvId: string): boolean => {
  // 开发环境下禁用
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
    return false;
  }
  
  try {
    const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '[]');
    return viewedPosts.includes(tvId);
  } catch (error) {
    console.error('检查已查看状态出错:', error);
    return false;
  }
};

// 将剧集标记为在会话中已查看
const markAsViewedInSession = (tvId: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '[]');
    if (!viewedPosts.includes(tvId)) {
      viewedPosts.push(tvId);
      sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
    }
  } catch (error) {
    console.error('标记已查看状态出错:', error);
  }
};

// TV剧集页面组件
export default function TVPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  // 状态管理
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [filteredShows, setFilteredShows] = useState<TVShow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'year'>('rating');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isUserBlogs, setIsUserBlogs] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [likedShows, setLikedShows] = useState<number[]>([]);
  
  // 从所有剧集中提取所有可用的类型
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    tvShows.forEach(show => {
      if (show.genre && show.genre.length > 0) {
        show.genre.forEach(g => genres.add(g));
      }
    });
    return Array.from(genres).sort();
  }, [tvShows]);
  
  // 类型映射（带图标）
  const genreMapping: Record<string, { icon: React.ReactNode }> = {
    "剧情": { icon: <FaVideo className="inline-block mr-1" /> },
    "喜剧": { icon: <FaVideo className="inline-block mr-1" /> },
    "科幻": { icon: <FaVideo className="inline-block mr-1" /> },
    "动作": { icon: <FaVideo className="inline-block mr-1" /> },
    "冒险": { icon: <FaVideo className="inline-block mr-1" /> },
    "奇幻": { icon: <FaVideo className="inline-block mr-1" /> },
    "悬疑": { icon: <FaVideo className="inline-block mr-1" /> },
    "惊悚": { icon: <FaVideo className="inline-block mr-1" /> },
    "恐怖": { icon: <FaVideo className="inline-block mr-1" /> },
    "动画": { icon: <FaVideo className="inline-block mr-1" /> },
  };
  
  // 筛选和排序TV剧集
  const filterAndSortShows = () => {
    if (!tvShows.length) {
      setFilteredShows([]);
      return;
    }
    
    // 筛选用户自己的博客
    let filtered = tvShows;
    if (isUserBlogs && userId) {
      filtered = tvShows.filter(show => show.userId === userId);
    }
    
    // 根据搜索词筛选
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(show => 
        show.title.toLowerCase().includes(term) || 
        show.creator.toLowerCase().includes(term) || 
        show.description?.toLowerCase().includes(term) ||
        show.network?.toLowerCase().includes(term)
      );
    }
    
    // 根据所选类型筛选
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(show => 
        show.genre && show.genre.some(g => selectedGenres.includes(g))
      );
    }
    
    // 排序
    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'year') {
      filtered = [...filtered].sort((a, b) => (b.year || 0) - (a.year || 0));
    }
    
    setFilteredShows(filtered);
  };
  
  // 获取TV剧集数据
  const fetchTVShows = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟API调用
      // 实际项目中应替换为真实的API调用
      // const response = await fetch('/api/tv');
      // const data = await response.json();
      
      // 示例数据
      const mockData: TVShow[] = [
        {
          id: 1,
          title: "绝命毒师",
          creator: "文斯·吉利根",
          year: 2008,
          poster: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDY1LWJjMjEtMDI2N2ZlOTdhYjQxXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
          description: "一位高中化学老师被诊断出肺癌，为了给家人留下足够的钱，开始制造和销售冰毒。",
          rating: 9.5,
          genre: ["剧情", "犯罪", "惊悚"],
          seasons: 5,
          episodes: 62,
          network: "AMC",
          status: "已完结",
          views: Math.floor(Math.random() * 1000) + 100,
          isLiked: false
        },
        {
          id: 2,
          title: "权力的游戏",
          creator: "大卫·贝尼奥夫, D.B.威斯",
          year: 2011,
          poster: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg",
          description: "几个贵族家族为争夺铁王座而进行的政治和战争。",
          rating: 9.2,
          genre: ["剧情", "奇幻", "冒险"],
          seasons: 8,
          episodes: 73,
          network: "HBO",
          status: "已完结",
          views: Math.floor(Math.random() * 1000) + 100,
          isLiked: false
        },
        {
          id: 3,
          title: "怪奇物语",
          creator: "达菲兄弟",
          year: 2016,
          poster: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
          description: "一个小男孩神秘失踪，小镇揭开了一系列秘密，超自然力量，一个奇怪的小女孩。",
          rating: 8.7,
          genre: ["剧情", "恐怖", "科幻"],
          seasons: 4,
          episodes: 34,
          network: "Netflix",
          status: "进行中",
          views: Math.floor(Math.random() * 1000) + 100,
          isLiked: false
        },
        {
          id: 4,
          title: "黑镜",
          creator: "查理·布鲁克",
          year: 2011,
          poster: "https://m.media-amazon.com/images/M/MV5BYTM3YWVhMDMtNjczMy00NGEyLWJhZDctYjNhMTRkNDE0ZTI1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
          description: "展示了现代科技可能带来的黑暗面的独立剧集。",
          rating: 8.8,
          genre: ["剧情", "科幻", "惊悚"],
          seasons: 5,
          episodes: 22,
          network: "Netflix",
          status: "进行中",
          views: Math.floor(Math.random() * 1000) + 100,
          isLiked: false
        },
        {
          id: 5,
          title: "爱，死亡和机器人",
          creator: "蒂姆·米勒",
          year: 2019,
          poster: "https://m.media-amazon.com/images/M/MV5BYTNiYTNkNTAtYzE3ZS00ZDQ1LWEwZTYtZjI1NzYzMWJjY2U4XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
          description: "一系列短片动画，涵盖多种类型，包括科幻、奇幻、恐怖和喜剧。",
          rating: 8.5,
          genre: ["动画", "科幻", "奇幻"],
          seasons: 3,
          episodes: 35,
          network: "Netflix",
          status: "进行中",
          views: Math.floor(Math.random() * 1000) + 100,
          isLiked: false
        },
        {
          id: 6,
          title: "切尔诺贝利",
          creator: "克雷格·马辛",
          year: 2019,
          poster: "https://m.media-amazon.com/images/M/MV5BZGQ2YmMxZmEtYjI5OS00NzlkLTlkNTEtYWMyMzkyMzc2MDU5XkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_.jpg",
          description: "讲述1986年切尔诺贝利核电站爆炸的故事。",
          rating: 9.4,
          genre: ["剧情", "历史", "惊悚"],
          seasons: 1,
          episodes: 5,
          network: "HBO",
          status: "已完结",
          views: Math.floor(Math.random() * 1000) + 100,
          isLiked: false
        }
      ];
      
      // 获取本地存储的点赞数据
      const storedLikedShows = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('likedShows') || '[]') 
        : [];
      
      setLikedShows(storedLikedShows);
      
      // 添加用户点赞状态
      const showsWithLikes = mockData.map(show => ({
        ...show,
        isLiked: storedLikedShows.includes(show.id)
      }));
      
      setTVShows(showsWithLikes);
      setFilteredShows(showsWithLikes);
    } catch (err) {
      console.error('获取TV剧集列表出错:', err);
      setError('获取TV剧集数据时发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取TV剧集数据
  useEffect(() => {
    fetchTVShows();
  }, [pathname]);
  
  // 监听筛选条件变化
  useEffect(() => {
    filterAndSortShows();
  }, [searchTerm, selectedGenres, sortBy, tvShows, isUserBlogs, userId]);

  // 处理点赞
  const handleLike = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // 更新本地状态
      let newLikedShows;
      if (likedShows.includes(id)) {
        newLikedShows = likedShows.filter(showId => showId !== id);
      } else {
        newLikedShows = [...likedShows, id];
      }
      
      setLikedShows(newLikedShows);
      localStorage.setItem('likedShows', JSON.stringify(newLikedShows));
      
      // 更新显示的剧集列表
      setTVShows(tvShows.map(show => 
        show.id === id 
          ? { ...show, isLiked: !show.isLiked } 
          : show
      ));
    } catch (error) {
      console.error("点赞失败:", error);
    }
  };

  // 切换用户博客显示
  const toggleUserBlogs = () => {
    setIsUserBlogs(!isUserBlogs);
  };

  // 处理类型选择
  const handleGenreSelect = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
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

  // TV剧集卡片组件
  const TVShowCard = ({ show }: { show: TVShow }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const [bgColor, setBgColor] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('white');
    const [isColorExtracted, setIsColorExtracted] = useState(false);
    
    // 简化卡片样式，使用固定背景色
    const getDefaultBackgroundColor = () => {
      // 根据索引返回不同的背景色
      const colors = ['bg-blue-700', 'bg-orange-700', 'bg-green-700', 'bg-gray-700'];
      const index = Math.abs(show.id) % colors.length;
      return colors[index];
    };

    const handleCardClick = () => {
      console.log('卡片点击，导航到剧集详情页:', show.id);
      router.push(`/tv/${show.id}`);
    };
    
    const handleLikeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleLike(show.id, e);
    };

    // 获取封面图片源
    const getImageSrc = () => {
      if (show.poster && show.poster.startsWith('/')) {
        return `https://image.tmdb.org/t/p/w500${show.poster}`;
      }
      if (show.poster) {
        return show.poster;
      }
      // 最后使用默认图片
      return 'https://images.unsplash.com/photo-1540224871915-bc8ffb782bdf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80';
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
            alt={show.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onLoadingComplete={() => setIsLoaded(true)}
            crossOrigin="anonymous"
          />
        </div>
        <div className="p-4" style={{ color: textColor }}>
          <h3 className="text-xl font-bold truncate">
            {show.title}
          </h3>
          <p className="text-sm mt-1 opacity-85">
            {show.creator || "未知创作者"} • {show.network || "未知频道"}
          </p>
          
          {/* 标签显示 */}
          <div className="flex items-center mt-2 space-x-2">
            {show.genre && show.genre.length > 0 ? (
              <span className="px-2 py-1 text-xs rounded-full bg-black/20">
                {show.genre[0]}
              </span>
            ) : (
              <span className="px-2 py-1 text-xs rounded-full bg-black/20">
                剧集
              </span>
            )}
            {show.status && (
              <span className="px-2 py-1 text-xs rounded-full bg-black/20">
                {show.status}
              </span>
            )}
          </div>
          
          {/* 底部信息 */}
          <div className="flex justify-between items-center mt-3 text-sm">
            <div className="flex items-center">
              <span className="mr-2">{show.views || 0}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span>{show.seasons} 季 • {show.episodes} 集</span>
            <button 
              onClick={handleLikeClick}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={show.isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {show.isLiked ? '已喜欢' : '喜欢'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 计算统计数据
  const totalShows = tvShows.length;
  const filteredCount = filteredShows.length;
  const genreCount = allGenres.length;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 页面标题区域 */}
      <div className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 py-12 px-4 md:px-8 shadow-md text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 flex items-center text-white">
                <span className="text-cyan-400 mr-3">
                  <FaTv className="text-cyan-400" />
                </span>
                精彩剧集
              </h1>
              <p className="text-blue-200 text-sm md:text-base max-w-2xl">
                发现优质电视剧，分享你的观剧体验和感受
              </p>
            </div>
            <Link href="/blog/create?type=tv">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 bg-cyan-600 text-white px-6 py-3 rounded-full font-medium flex items-center shadow-lg"
              >
                <FaPlay className="mr-2" /> 写剧评
              </motion.button>
            </Link>
          </div>
          
          {/* 数据统计区域 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-900/60 p-4 rounded-xl backdrop-blur-sm shadow-lg flex flex-col items-center justify-center">
              <div className="flex items-center">
                <span className="text-cyan-400 mr-2">
                  <FaTv />
                </span>
                <p className="text-sm font-medium text-cyan-200">总剧评数</p>
              </div>
              <p className="text-3xl font-bold text-white">{totalShows}</p>
            </div>
           
            <div className="bg-blue-900/60 p-4 rounded-xl backdrop-blur-sm shadow-lg flex flex-col items-center justify-center">
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">
                  <FaFilter />
                </span>
                <p className="text-sm font-medium text-blue-200">筛选结果</p>
              </div>
              <p className="text-3xl font-bold text-white">{filteredCount}</p>
            </div>
              
            <div className="bg-blue-900/60 p-4 rounded-xl backdrop-blur-sm shadow-lg flex flex-col items-center justify-center">
              <div className="flex items-center">
                <span className="text-indigo-400 mr-2">
                  <FaChartBar />
                </span>
                <p className="text-sm font-medium text-indigo-200">类型数量</p>
              </div>
              <p className="text-3xl font-bold text-white">{genreCount}</p>
            </div>
          </div>
          
          {/* 搜索和筛选区域 */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* 搜索框 */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="搜索剧名、创作者或关键词..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-blue-900/30 border border-blue-800/30 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-blue-300"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
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
                剧集类型
              </motion.button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute right-0 mt-2 w-72 bg-blue-900/90 backdrop-blur-md border border-blue-800/30 shadow-xl rounded-xl p-4 z-10"
                  >
                    <p className="text-sm font-medium mb-3 text-cyan-400">选择剧集类型</p>
                    <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent pr-2">
                      {allGenres.map((genre) => (
                        <button 
                          key={genre}
                          onClick={() => handleGenreSelect(genre)}
                          className={`text-xs px-3 py-1.5 rounded-full ${
                            selectedGenres.includes(genre)
                              ? "bg-cyan-600 text-white shadow-md"
                              : "bg-blue-800/50 text-blue-200 hover:bg-blue-700/50"
                          }`}
                        >
                          {genreMapping[genre]?.icon} {genre}
                        </button>
                      ))}
                    </div>
                    {selectedGenres.length > 0 && (
                      <button
                        onClick={() => setSelectedGenres([])}
                        className="text-xs text-cyan-400 mt-3 hover:text-cyan-300 flex items-center"
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
            
            {/* 排序选项 */}
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm">排序:</span>
              <select
                className="bg-blue-900/30 border border-blue-800/30 rounded-lg py-2 px-3 text-sm text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'year')}
              >
                <option value="rating">评分</option>
                <option value="year">年份</option>
              </select>
              
              <button 
                onClick={fetchTVShows}
                className="ml-2 bg-blue-700/40 text-white p-2 rounded-lg"
                title="刷新"
              >
                <IoMdRefresh />
              </button>
            </div>
          </div>
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
                  onClick={fetchTVShows}
                  className="mt-3 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded-md text-white transition-colors"
                >
                  重试
                </button>
              </div>
            )}
            
            {filteredShows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShows.map((show) => (
                  <TVShowCard key={show.id} show={show} />
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
                  <FaTv className="text-6xl text-indigo-400" />
                </motion.div>
                {isUserBlogs ? (
                  <div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-3">还没有发布过剧评</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      分享你对喜爱剧集的感受和见解，让更多人了解你的观剧品味
                    </p>
                    <Link href="/blog/create?type=tv">
                      <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 168, 255, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-full font-medium flex items-center mx-auto shadow-lg"
                      >
                        <FaPlay className="mr-2" /> 写第一篇剧评
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-3">没有找到相关剧评</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      尝试调整筛选条件或搜索关键词，发现更多精彩内容
                    </p>
                    
                    <motion.button 
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedGenres([]);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 px-6 py-2 bg-blue-100 rounded-full border border-blue-200 text-blue-600 flex items-center mx-auto"
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
      </div>
    </div>
  );
} 