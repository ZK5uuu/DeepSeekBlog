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
import { FastAverageColor } from 'fast-average-color';

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

  // 备用模拟数据
  const mockMusicData: Music[] = [
    {
      id: "1",
      title: "The Dark Side of the Moon - 经典专辑评论",
      content: "这是Pink Floyd的经典之作，让人沉浸在深邃的音乐世界中。专辑中的Time和Money是我最喜欢的曲目，完美展现了乐队的实验精神和音乐才华。",
      coverImageUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      createdAt: "2023-11-01T08:30:00.000Z",
      create_time: "2023-11-01T08:30:00.000Z",
      viewCount: 256,
      views: 256, 
      liked: false,
      likeCount: 58,
      likes: 58,
      artistName: "Pink Floyd",
      albumName: "The Dark Side of the Moon",
      music_styles: ["Rock", "Experimental"],
      tags: [{ id: 1, name: "Rock" }, { id: 2, name: "Experimental" }],
      author: {
        id: 1,
        username: "musiclover"
      }
    },
    {
      id: "2",
      title: "Kind of Blue - 爵士乐杰作",
      content: "Miles Davis的《Kind of Blue》是爵士乐历史上的里程碑，完美融合了模态爵士风格，每一个音符都散发着独特魅力。",
      coverImageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      createdAt: "2023-11-05T10:15:00.000Z",
      create_time: "2023-11-05T10:15:00.000Z",
      viewCount: 189,
      views: 189,
      liked: true,
      likeCount: 43,
      likes: 43,
      artistName: "Miles Davis",
      albumName: "Kind of Blue",
      music_styles: ["Jazz", "Modal Jazz"],
      tags: [{ id: 3, name: "Jazz" }, { id: 4, name: "Modal Jazz" }],
      author: {
        id: 2,
        username: "jazzfan"
      }
    },
    {
      id: "3",
      title: "To Pimp a Butterfly - 现代经典",
      content: "Kendrick Lamar的《To Pimp a Butterfly》融合了爵士、放克和说唱元素，不仅是音乐作品，更是对社会议题的深刻反思。",
      coverImageUrl: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
      createdAt: "2023-11-10T15:45:00.000Z",
      create_time: "2023-11-10T15:45:00.000Z",
      viewCount: 312,
      views: 312,
      liked: false,
      likeCount: 76,
      likes: 76,
      artistName: "Kendrick Lamar",
      albumName: "To Pimp a Butterfly",
      music_styles: ["R&B", "Hip Hop"],
      tags: [{ id: 5, name: "R&B" }, { id: 6, name: "Hip Hop" }],
      author: {
        id: 3,
        username: "musiccritic"
      }
    },
    {
      id: "4",
      title: "Blue Train - 萨克斯巅峰",
      content: "John Coltrane的《Blue Train》是硬博普爵士乐的代表作，尤其是他在萨克斯上的演奏技巧令人惊叹。",
      coverImageUrl: "https://images.unsplash.com/photo-1454922915609-78549ad709bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=872&q=80",
      createdAt: "2023-11-15T09:20:00.000Z",
      create_time: "2023-11-15T09:20:00.000Z",
      viewCount: 145,
      views: 145,
      liked: false,
      likeCount: 32,
      likes: 32,
      artistName: "John Coltrane",
      albumName: "Blue Train",
      music_styles: ["Jazz", "Hard Bop"],
      tags: [{ id: 7, name: "Jazz" }, { id: 8, name: "Hard Bop" }],
      author: {
        id: 4,
        username: "saxplayer"
      }
    }
  ];

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
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching music posts with content_type:', content_type);

      // Get posts by content type
      const response = await postApi.getPostsByContentType(content_type);
      
      console.log('API Response:', response);
      console.log('Raw data from API:', response.data);
      
      if (response && response.data && response.data.length > 0) {
        console.log('Fetched posts from API:', response.data);
        
        const mappedMusic = response.data.map((post: any) => {
          console.log('Processing post:', JSON.stringify(post, null, 2));
          
          // 检查是否为MusicPostResponse格式（后端为音乐类型返回的特殊格式）
          const isMusicResponseFormat = post.artist_name !== undefined && post.album_name !== undefined;
          console.log('Is MusicPostResponse format:', isMusicResponseFormat);
          
          if (isMusicResponseFormat) {
            // 使用MusicPostResponse格式（蛇形命名）
            console.log('使用MusicPostResponse格式处理数据');
            return {
              id: post.id.toString(),
              title: post.title,
              content: post.content || '',
              coverImageUrl: post.cover_image_url || '',
              createdAt: post.create_time || new Date().toISOString(),
              viewCount: post.views || 0,
              liked: post.liked || false,
              likeCount: post.likes || 0,
              artistName: post.artist_name || '未知艺术家',
              albumName: post.album_name || '未知专辑',
              albumImageUrl: post.cover_image_url || '',  // MusicPostResponse中使用cover_image_url
              contentType: 'music',
              tags: post.music_styles ? post.music_styles.map((style: string) => ({ name: style })) : [],
              author: { 
                id: 1, 
                username: post.username || '未知作者' 
              },
              // 为兼容现有代码的字段
              music_styles: post.music_styles || [],
              username: post.username || '未知作者',
              create_time: post.create_time || new Date().toISOString(),
              views: post.views || 0,
              likes: post.likes || 0,
            };
          } else {
            // 使用标准BlogPost格式（驼峰命名）
            console.log('使用标准BlogPost格式处理数据');
            return {
              id: post.id.toString(),
              title: post.title,
              content: post.content || '',
              coverImageUrl: post.albumImageUrl || post.coverImageUrl || '',
              createdAt: post.createdAt || new Date().toISOString(),
              viewCount: post.viewCount || 0,
              liked: false, // API需要补充
              likeCount: post.likeCount || 0,
              artistName: post.artistName || '未知艺术家',
              albumName: post.albumName || '未知专辑',
              albumImageUrl: post.albumImageUrl || '',
              contentType: post.contentType || 'music',
              tags: post.tags || [],
              author: post.author || { 
                id: post.authorId || 1, 
                username: post.author?.username || '未知作者' 
              },
              // 为兼容现有代码的字段
              music_styles: post.tags ? post.tags.map((tag: any) => tag.name) : [],
              username: post.author ? post.author.username : '未知作者',
              create_time: post.createdAt || new Date().toISOString(),
              views: post.viewCount || 0,
              likes: post.likeCount || 0,
            };
          }
        });

        console.log('Mapped music data:', mappedMusic);
        setMusic(mappedMusic);
      } else {
        console.log('No music posts found or empty response, falling back to mock data');
        setMusic(mockMusicData);
        }
      } catch (error) {
      console.error('Error fetching music posts:', error);
      setError('获取音乐博客失败，已显示模拟数据');
      // 使用模拟数据作为后备选项
      setMusic(mockMusicData);
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

  const MusicCard = ({ music, onLike }: { music: Music; onLike: (id: string) => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);
    const [bgColor, setBgColor] = useState<string>('');
    const [textColor, setTextColor] = useState<string>('white');
    const [isColorExtracted, setIsColorExtracted] = useState(false);
    
    // 简化卡片样式，使用固定背景色
    const getDefaultBackgroundColor = () => {
      // 根据索引返回不同的背景色
      const colors = ['bg-blue-700', 'bg-orange-700', 'bg-green-700', 'bg-gray-700'];
      const index = Math.abs(music.id.charCodeAt(0)) % colors.length;
      return colors[index];
    };

    const handleCardClick = () => {
      console.log('Card clicked, navigating to blog detail page for ID:', music.id);
      router.push(`/blog/${music.id}`);
    };
    
    const handleLikeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onLike(music.id);
    };

    // 获取封面图片源
    const getImageSrc = () => {
      // 优先使用albumImageUrl（专辑封面）
      if (music.albumImageUrl) {
        console.log(`使用专辑封面: ${music.albumImageUrl}`);
        return music.albumImageUrl;
      }
      // 其次使用coverImageUrl（文章封面）
      if (music.coverImageUrl) {
        console.log(`使用文章封面: ${music.coverImageUrl}`);
        return music.coverImageUrl;
      }
      // 最后使用默认图片
      console.log('使用默认封面图片');
      return 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bXVzaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60';
    };

    // 获取显示标题
    const getDisplayTitle = () => {
      if (music.albumName) return music.albumName;
      if (music.title) return music.title;
      return "未知专辑";
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
            {music.artistName || "未知艺术家"}
          </p>
          
          {/* 标签显示 */}
          <div className="flex items-center mt-2 space-x-2">
            {(music.tags && music.tags.length > 0) ? (
              <span className="px-2 py-1 text-xs rounded-full bg-black/20">
                {music.tags[0].name || music.tags[0]}
              </span>
            ) : (music.music_styles && music.music_styles.length > 0) ? (
              <span className="px-2 py-1 text-xs rounded-full bg-black/20">
                {music.music_styles[0]}
              </span>
            ) : (
              <span className="px-2 py-1 text-xs rounded-full bg-black/20">
                音乐
              </span>
            )}
          </div>
          
          {/* 底部信息 */}
          <div className="flex justify-between items-center mt-3 text-sm">
            <div className="flex items-center">
              <span className="mr-2">{music.viewCount || music.views || 0}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span>{formatDate(music.createdAt || music.create_time)}</span>
            <button 
              onClick={handleLikeClick}
              className="flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={music.liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {music.likeCount || music.likes || 0}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 页面标题区域 */}
      <div className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 py-12 px-4 md:px-8 shadow-md text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 flex items-center text-white">
                <span className="text-pink-400 mr-3">
                  <FaHeadphones className="text-pink-400" />
                </span>
                音乐世界
              </h1>
              <p className="text-purple-200 text-sm md:text-base max-w-2xl">
                探索音乐的无限可能，分享你的音乐感受
              </p>
            </div>
            <Link href="/blog/create?type=music">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 bg-pink-600 text-white px-6 py-3 rounded-full font-medium flex items-center shadow-lg"
              >
                <FaPlay className="mr-2" /> 写乐评
              </motion.button>
            </Link>
          </div>
          
          {/* 数据统计区域 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-900/60 p-4 rounded-xl backdrop-blur-sm shadow-lg flex flex-col items-center justify-center">
              <div className="flex items-center">
                <span className="text-pink-400 mr-2">
                  <FaMusic />
                </span>
                <p className="text-sm font-medium text-pink-200">总乐评数</p>
              </div>
              <p className="text-3xl font-bold text-white">{music.length}</p>
            </div>
           
            <div className="bg-blue-900/60 p-4 rounded-xl backdrop-blur-sm shadow-lg flex flex-col items-center justify-center">
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">
                  <FaFilter />
                </span>
                <p className="text-sm font-medium text-blue-200">筛选结果</p>
              </div>
              <p className="text-3xl font-bold text-white">{filteredMusic.length}</p>
              </div>
              
            <div className="bg-blue-900/60 p-4 rounded-xl backdrop-blur-sm shadow-lg flex flex-col items-center justify-center">
              <div className="flex items-center">
                <span className="text-cyan-400 mr-2">
                  <FaChartBar />
                </span>
                <p className="text-sm font-medium text-cyan-200">风格数量</p>
              </div>
              <p className="text-3xl font-bold text-white">{musicGenres.length}</p>
            </div>
          </div>
          
          {/* 搜索和筛选区域 */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* 搜索框 */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="搜索音乐、艺人或专辑..."
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
                音乐风格
              </motion.button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute right-0 mt-2 w-72 bg-blue-900/90 backdrop-blur-md border border-blue-800/30 shadow-xl rounded-xl p-4 z-10"
                  >
                    <p className="text-sm font-medium mb-3 text-pink-400">选择音乐风格</p>
                    <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent pr-2">
                      {musicGenres.map((genre) => (
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
                  onClick={() => fetchMusic()}
                  className="mt-3 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded-md text-white transition-colors"
                >
                  重试
                </button>
            </div>
          )}
            
            {filteredMusic.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMusic.map((item) => (
                  <MusicCard key={item.id} music={item} onLike={handleLike} />
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

