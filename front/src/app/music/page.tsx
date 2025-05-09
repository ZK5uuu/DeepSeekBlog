"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter, FaSort, FaPlay, FaHeadphones, FaUser, FaHeart, FaRegHeart, FaChartBar, FaMusic, FaCompactDisc, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { postApi } from "../api/services/blogService";
import { useRouter, usePathname } from "next/navigation";
import { format, isValid, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getDebugMusic, getMusic } from '../api/services/musicService';

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

// Define a type for blog post data from API
interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string;
  createdAt: string;
  viewCount?: number;
  liked?: boolean;
  likeCount?: number;
  artistName?: string;
  albumName?: string;
  albumImageUrl?: string;
  contentType?: string;
  tags?: any[];
  authorId?: number;
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
}

// Use BlogPost as the base type for Music, making all fields required for the UI
interface Music extends Omit<BlogPost, 'coverImageUrl' | 'viewCount' | 'liked' | 'likeCount' | 'artistName' | 'albumName'> {
  coverImageUrl: string;
  viewCount: number;
  liked: boolean;
  likeCount: number;
  artistName: string;
  albumName: string;
  tags: any[];
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  // 兼容字段
  music_styles: string[];
  views?: number;
  likes?: number;
  create_time?: string;
}

// 用于会话存储已查看文章的键
const VIEWED_POSTS_SESSION_KEY = 'viewed_posts';

// 检查帖子是否已在当前会话中被查看
const hasViewedInSession = (postId: string): boolean => {
  try {
    // 在开发环境下始终允许增加浏览量，方便测试
    if (process.env.NODE_ENV !== 'production') {
      console.log('开发环境，允许增加浏览量');
      return false;
    }
    
    const storedPosts = sessionStorage.getItem(VIEWED_POSTS_SESSION_KEY);
    if (!storedPosts) return false;
    
    const viewedPostsArray = JSON.parse(storedPosts);
    return Array.isArray(viewedPostsArray) && viewedPostsArray.includes(postId);
  } catch (error) {
    console.error('检查查看状态时出错:', error);
    return false; // 出错时默认为未查看
  }
};

// 标记帖子为已在会话中查看
const markAsViewedInSession = (postId: string): void => {
  try {
    const storedPosts = sessionStorage.getItem(VIEWED_POSTS_SESSION_KEY);
    
    if (storedPosts) {
      try {
        const parsed = JSON.parse(storedPosts);
        if (Array.isArray(parsed)) {
          const viewedPosts = parsed;
          if (!viewedPosts.includes(postId)) {
            viewedPosts.push(postId);
            sessionStorage.setItem(VIEWED_POSTS_SESSION_KEY, JSON.stringify(viewedPosts));
            console.log(`已将帖子 ${postId} 标记为已查看`);
          } else {
            console.log(`帖子 ${postId} 已经被标记为已查看，不再增加浏览量`);
          }
        }
      } catch {
        // 解析错误，使用空数组
        const viewedPosts = [postId];
        sessionStorage.setItem(VIEWED_POSTS_SESSION_KEY, JSON.stringify(viewedPosts));
        console.log(`帖子 ${postId} 标记为已查看时出错，使用空数组`);
      }
    } else {
      // 不存在记录，创建新数组
      const viewedPosts = [postId];
      sessionStorage.setItem(VIEWED_POSTS_SESSION_KEY, JSON.stringify(viewedPosts));
      console.log(`帖子 ${postId} 标记为已查看时出错，sessionStorage中没有viewed_posts`);
    }
  } catch (error) {
    console.error('标记为已查看时出错', error);
  }
};

// 在MusicPage组件之前添加一个新的ItemCard组件
const MusicItemCard = ({ item, index }: { item: Music; index: number }) => {
  const [bgColor, setBgColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('white');
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const router = useRouter();
  
  // 从图片提取颜色
  const extractColor = async () => {
    if (!imageRef.current || bgColor) return;
    
    try {
      // 使用客户端安全的导入方式
      const { FastAverageColor } = await import('fast-average-color');
      const fac = new FastAverageColor();
      const color = await fac.getColorAsync(imageRef.current);
      
      console.log(`提取的颜色: ${color.hex}, 是否暗色: ${color.isDark}`);
      
      // 设置背景色和文本颜色
      setBgColor(color.hex);
      setTextColor(color.isDark ? 'white' : '#333');
    } catch (e) {
      console.error('提取颜色失败:', e);
      // 使用默认颜色
      setBgColor('#1f2937');
      setTextColor('white');
    }
  };
  
  // 图片加载完成后提取颜色
  useEffect(() => {
    if (isLoaded && imageRef.current) {
      extractColor();
    }
  }, [isLoaded]);
  
  const handleCardClick = () => {
    router.push(`/music/${item.id}`);
  };
  
  return (
    <div 
      className="rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-56">
        <Image 
          ref={imageRef as any}
          src={item.coverImageUrl || '/images/default-album.jpg'} 
          alt={item.title || `音乐${index + 1}`}
          fill
          style={{objectFit: 'cover'}}
          onLoadingComplete={() => setIsLoaded(true)}
          crossOrigin="anonymous"
        />
      </div>
      <div className="p-4" style={{ 
        backgroundColor: bgColor || '#1f2937',
        color: textColor
      }}>
        <h3 className="text-xl font-bold mb-2">{item.title || `音乐${index + 1}`}</h3>
        <p className="opacity-80">{item.artistName || '未知艺术家'}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs px-2 py-1 rounded-full bg-black/20">
            电子
          </span>
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {item.viewCount || 0}
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {item.likeCount || 0}
            </span>
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center text-sm text-opacity-70">
          <span>{formatDate(item.createdAt || '2025/05/09')}</span>
        </div>
      </div>
    </div>
  );
};

export default function MusicPage() {
  const [music, setMusic] = useState<Music[]>([]);
  const [filteredMusic, setFilteredMusic] = useState<Music[]>([]);
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
  
  // 固定的音乐风格列表
  const musicGenres = ["Classical", "Jazz", "R&B", "Soul/Neo Soul", "Rock", "Funk", "Ballet", "Else"];

  // 过滤和排序音乐列表
  const filterAndSortMusic = () => {
    // 筛选逻辑
    let filtered = music.filter((item) => {
      // 搜索项过滤
      const searchMatch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.albumName.toLowerCase().includes(searchTerm.toLowerCase());

      // 风格过滤
      const genreMatch =
        selectedGenre === null ||
        (selectedGenre === "Else" 
          ? item.music_styles.some(style => !musicGenres.slice(0, -1).includes(style))
          : item.music_styles.includes(selectedGenre));

      // 用户博客过滤
      const userMatch = !isUserBlogs || (userId && item.author.username === userId);

      return searchMatch && genreMatch && userMatch;
    });

    // 排序逻辑
    switch (sortOption) {
      case "newest":
        filtered = [...filtered].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered = [...filtered].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
    }

    setFilteredMusic(filtered);
  };

  // 获取当前用户ID - 这里简化处理
  useEffect(() => {
    // 模拟用户认证，实际项目中应从AuthContext获取
    const mockUserId = localStorage.getItem("userId") || null;
    setUserId(mockUserId);
  }, []);

  // 获取音乐数据
  const fetchMusic = async (content_type = "music") => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`开始请求${content_type}类型的数据`);
      
      // 从API获取数据
      const response = await postApi.getPostsByContentType(content_type);
      console.log('获取到的音乐数据:', response);
      
      // 处理从API获取的数据
      if (response && response.data) {
        let musicData;
        
        // 检查响应格式
        if (Array.isArray(response.data)) {
          musicData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          musicData = response.data.data;
        } else {
          console.error('无法识别的数据格式:', response.data);
          setError('无法识别的数据格式');
          setIsLoading(false);
          return;
        }
        
        console.log('处理后的音乐数据:', musicData);
        
        if (musicData.length > 0) {
          // 标准化数据结构
          const normalizedMusic = musicData.map((post: any) => ({
            id: post.id?.toString() || '',
            title: post.title || post.albumName || '',
            content: post.content || '',
            coverImageUrl: post.coverImageUrl || post.albumImageUrl || post.cover_image_url || '',
            createdAt: post.createdAt || post.create_time || new Date().toISOString(),
            viewCount: post.viewCount || post.view_count || 0,
            liked: post.liked || false,
            likeCount: post.likeCount || post.like_count || 0,
            artistName: post.artistName || post.artist_name || '',
            albumName: post.albumName || post.album_name || '',
            albumImageUrl: post.albumImageUrl || post.album_image_url || '',
            contentType: post.contentType || 'music',
            tags: post.tags || [],
            music_styles: post.tags || [], // 兼容字段
            author: post.author || {
              id: 1,
              username: post.username || '管理员'
            }
          }));
          
          setMusic(normalizedMusic);
          setFilteredMusic(normalizedMusic);
        } else {
          console.warn('API返回的音乐数据为空');
          setError('没有找到任何音乐记录');
          setMusic([]);
          setFilteredMusic([]);
        }
      } else {
        console.error('API响应数据格式不正确:', response);
        setError('API响应数据格式不正确');
        
        // 清空现有数据
        setMusic([]);
        setFilteredMusic([]);
      }
    } catch (error: any) {
      console.error('获取音乐数据失败:', error);
      setError(`获取音乐数据失败: ${error.message || '未知错误'}`);
      
      // 清空现有数据
      setMusic([]);
      setFilteredMusic([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 监听过滤条件变化
  useEffect(() => {
    filterAndSortMusic();
  }, [searchTerm, selectedGenre, sortOption, music, isUserBlogs, userId]);

  // 添加获取数据的useEffect
  useEffect(() => {
    console.log('音乐页pathname改变，重新获取数据');
    fetchMusic();
  }, [pathname]);
  
  // 添加路由事件监听，确保页面获取最新数据
  useEffect(() => {
    console.log('设置页面可见性和历史导航监听');
    
    // 定义页面可见性变化处理函数
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('页面重新变为可见，刷新数据');
        fetchMusic();
      }
    };
    
    // 定义历史导航处理函数
    const handlePopState = () => {
      console.log('检测到浏览器导航事件（后退/前进），刷新数据');
      fetchMusic();
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

  // 切换用户博客显示
  const toggleUserBlogs = () => {
    setIsUserBlogs(!isUserBlogs);
  };

  // 添加或移除音乐风格
  const toggleGenre = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  // 处理点赞
  const handleLike = async (id: string) => {
    try {
      // 使用博客API处理点赞
      await postApi.likePost(id);
      console.log(`Liked music with ID: ${id}`);
      
      // 更新本地状态
      setMusic(music.map(item => 
        item.id === id 
          ? { ...item, liked: !item.liked } 
          : item
      ));
    } catch (error) {
      console.error("Failed to like music:", error);
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

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 调试链接 */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link 
          href="/music/debug" 
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
        >
          <span className="text-xs">调试</span>
        </Link>
      </div>
      
      {/* 页面头部 */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 flex items-center text-white">
                <span className="text-pink-400 mr-3">
                  <FaHeadphones className="text-pink-400" />
                </span>
                {/* 音乐世界 */}
                博客世界
              </h1>
              <p className="text-purple-200 text-sm md:text-base max-w-2xl">
                {/* 探索音乐的无限可能，分享你的音乐感受 */}
                探索博客的无限可能，分享你的博客感受
              </p>
            </div>
            <Link href="/blog/create?type=music">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 bg-pink-600 text-white px-6 py-3 rounded-full font-medium flex items-center shadow-lg"
              >
                <FaPlay className="mr-2" /> 
                {/* 写乐评 */}创建博客
              </motion.button>
            </Link>
          </div>
          
          {/* 搜索和筛选区域 */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* 搜索框 */}
            <div className="relative flex-grow">
              <input
                type="text"
                // placeholder="搜索音乐、艺人或专辑..."
                placeholder="搜索博客..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-blue-900/30 border border-blue-800/30 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-white placeholder-purple-300"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" />
            </div>
          </div>
        </div>
      </header>
      
      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* 错误提示 */}
        {error && (
          <div className="w-full max-w-7xl mx-auto px-4 py-6 mb-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium">数据加载出错</h3>
                <p className="text-sm mt-1">{error}</p>
                <button 
                  onClick={() => fetchMusic()} 
                  className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
                >
                  重试
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {filteredMusic.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMusic.map((item, index) => (
                  <MusicItemCard key={item.id || index} item={item} index={index} />
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
                  <FaHeadphones className="text-6xl text-indigo-400" />
                </motion.div>
                {isUserBlogs ? (
                  <div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">还没有发布过乐评</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      分享你对喜爱音乐的感受和见解，让更多人了解你的音乐品味
                    </p>
                    <Link href="/blog/create?type=music">
                      <motion.button 
                        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(110, 0, 255, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-full font-medium flex items-center mx-auto shadow-lg"
                      >
                        <FaPlay className="mr-2" /> 写第一篇乐评
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">没有找到相关乐评</h3>
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
          <Link href="/blog/create?type=music">
            <motion.button
              whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(110, 72, 170, 0.7)" }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg"
            >
              <FaPlay className="text-2xl" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
} 

