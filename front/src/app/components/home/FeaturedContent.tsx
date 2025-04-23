'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { FaBook, FaFilm, FaMusic, FaArrowRight } from 'react-icons/fa';
import { useNavigationContext } from '@/app/providers';
import { postApi } from '@/app/api/services/blogService';
import { format, isValid, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { FastAverageColor } from 'fast-average-color';

// 添加日期格式化函数
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '未知日期';
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return '未知日期';
    return format(date, 'yyyy/MM/dd', { locale: zhCN });
  } catch (error) {
    console.error('日期格式化错误', dateString, error);
    return '未知日期';
  }
};

// 定义音乐类型（简化版本，只包含需要的字段）
interface Music {
  id: string;
  title: string;
  content?: string;
  coverImageUrl?: string;
  albumImageUrl?: string;
  createdAt: string;
  viewCount?: number;
  likeCount?: number;
  artistName: string;
  albumName: string;
  liked?: boolean;
  tags?: any[];
  music_styles?: string[];
  create_time?: string;
  views?: number;
  likes?: number;
}

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function FeaturedContent() {
  const { setSourceRect } = useNavigationContext();
  const [books, setBooks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [music, setMusic] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 获取音乐数据
        const musicResponse = await postApi.getPostsByContentType('music');
        console.log('获取到的音乐数据:', musicResponse);
        
        if (musicResponse && musicResponse.data && musicResponse.data.length > 0) {
          // 映射音乐数据
          const mappedMusic = musicResponse.data.map((post: any) => {
            // 检查是否为MusicPostResponse格式（后端为音乐类型返回的特殊格式）
            const isMusicResponseFormat = post.artist_name !== undefined && post.album_name !== undefined;
            
            if (isMusicResponseFormat) {
              // 使用MusicPostResponse格式（蛇形命名）
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
                tags: post.music_styles ? post.music_styles.map((style: string) => ({ name: style })) : [],
                music_styles: post.music_styles || [],
                views: post.views || 0,
                likes: post.likes || 0,
                create_time: post.create_time || new Date().toISOString(),
              };
            } else {
              // 使用标准BlogPost格式（驼峰命名）
              return {
                id: post.id.toString(),
                title: post.title,
                content: post.content || '',
                coverImageUrl: post.albumImageUrl || post.coverImageUrl || '',
                createdAt: post.createdAt || new Date().toISOString(),
                viewCount: post.viewCount || 0,
                liked: false,
                likeCount: post.likeCount || 0,
                artistName: post.artistName || '未知艺术家',
                albumName: post.albumName || '未知专辑',
                albumImageUrl: post.albumImageUrl || '',
                tags: post.tags || [],
                music_styles: post.tags ? post.tags.map((tag: any) => tag.name) : [],
                views: post.viewCount || 0,
                likes: post.likeCount || 0,
                create_time: post.createdAt || new Date().toISOString(),
              };
            }
          });
          
          // 只获取最新的6条音乐记录
          setMusic(mappedMusic.slice(0, 6));
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 音乐卡片组件
  const MusicCard = ({ music }: { music: Music }) => {
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

    // 获取封面图片源
    const getImageSrc = () => {
      // 优先使用albumImageUrl（专辑封面）
      if (music.albumImageUrl) {
        return music.albumImageUrl;
      }
      // 其次使用coverImageUrl（文章封面）
      if (music.coverImageUrl) {
        return music.coverImageUrl;
      }
      // 最后使用默认图片
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
      <motion.div 
        className={`rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${!isColorExtracted ? getDefaultBackgroundColor() : ''}`}
        onClick={handleCardClick}
        style={{
          backgroundColor: isColorExtracted ? bgColor : undefined,
        }}
        variants={itemVariants}
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
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={music.liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {music.likeCount || music.likes || 0}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // 记录点击位置
  const handleNavigationClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSourceRect(rect);
  };

  // 加载状态渲染
  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-content">
        <div className="container-custom">
          <h2 className="section-title text-center mb-10">每周精选</h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500 dark:text-gray-400">正在加载内容...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-content">
      <div className="container-custom">
        <h2 className="section-title text-center mb-10">每周精选</h2>
        
        <Tab.Group>
          <Tab.List className="flex space-x-1 bg-gray-100 dark:bg-card p-1 rounded-lg mb-6 max-w-md mx-auto">
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium rounded-md flex items-center justify-center transition-all ${
                  selected
                    ? 'bg-white dark:bg-content shadow text-blue-600 dark:text-blue-400'
                    : 'hover:bg-white/[0.12] hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
            >
              <FaBook className="mr-2" />
              书籍
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium rounded-md flex items-center justify-center transition-all ${
                  selected
                    ? 'bg-white dark:bg-content shadow text-blue-600 dark:text-blue-400'
                    : 'hover:bg-white/[0.12] hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
            >
              <FaFilm className="mr-2" />
              电影
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium rounded-md flex items-center justify-center transition-all ${
                  selected
                    ? 'bg-white dark:bg-content shadow text-blue-600 dark:text-blue-400'
                    : 'hover:bg-white/[0.12] hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
            >
              <FaMusic className="mr-2" />
              音乐
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            {/* 书籍面板 */}
            <Tab.Panel>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">暂无书籍数据，请从数据库获取</p>
                </div>
              </motion.div>
              
              <div className="text-center mt-10">
                <Link href="/books" onClick={handleNavigationClick}>
                  <span className="btn-primary inline-flex items-center">
                    查看所有书籍 <FaArrowRight className="ml-2" />
                  </span>
                </Link>
              </div>
            </Tab.Panel>
            
            {/* 电影面板 */}
            <Tab.Panel>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">暂无电影数据，请从数据库获取</p>
                </div>
              </motion.div>
              
              <div className="text-center mt-10">
                <Link href="/movies" onClick={handleNavigationClick}>
                  <span className="btn-primary inline-flex items-center">
                    查看所有电影 <FaArrowRight className="ml-2" />
                  </span>
                </Link>
              </div>
            </Tab.Panel>
            
            {/* 音乐面板 */}
            <Tab.Panel>
              {music.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {music.map((item) => (
                    <MusicCard key={item.id} music={item} />
                  ))}
                </motion.div>
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">暂无音乐数据，请从数据库获取</p>
                </div>
              )}
              
              <div className="text-center mt-10">
                <Link href="/music" onClick={handleNavigationClick}>
                  <span className="btn-primary inline-flex items-center">
                    查看所有音乐 <FaArrowRight className="ml-2" />
                  </span>
                </Link>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
} 