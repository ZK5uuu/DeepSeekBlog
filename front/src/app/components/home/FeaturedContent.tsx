'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  const [activeIndex, setActiveIndex] = useState(0);
  // 添加滚动容器引用
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // 监听滚动位置更新活动索引
  useEffect(() => {
    if (!scrollContainerRef.current || music.length <= 0) return;
    
    const updateActiveIndex = () => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const cardWidth = 320; // 大致估计的卡片宽度
      const gap = 24; // space-x-6 = 1.5rem = 24px
      const scrollWidth = cardWidth + gap;
      
      // 计算当前活动索引
      let index = Math.round(container.scrollLeft / scrollWidth);
      
      // 确保索引在有效范围内
      if (index >= music.length) {
        index = 0;
      }
      
      setActiveIndex(index);
    };
    
    const container = scrollContainerRef.current;
    container.addEventListener('scroll', updateActiveIndex);
    
    // 初始化活动索引
    updateActiveIndex();
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', updateActiveIndex);
      }
    };
  }, [music.length]);

  // 自动滚动功能
  useEffect(() => {
    if (!scrollContainerRef.current || music.length <= 0) return;
    
    // 计算单个卡片宽度（包含间距）
    const cardWidth = 320; // 大致估计的卡片宽度
    const gap = 24; // space-x-6 = 1.5rem = 24px
    const scrollWidth = cardWidth + gap;
    
    let scrollAnimation: number | null = null;
    let isScrolling = false; // 添加标志避免重复触发滚动
    
    // 真正的无限循环滚动 - 当到达末尾时，跳到开头继续滚动
    const setupInfiniteScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const wrapper = container.querySelector('.music-wrapper') as HTMLElement;
      
      if (!wrapper) return;
      
      // 复制所有卡片，添加到列表末尾，实现无缝循环
      const clonedItems = Array.from(wrapper.children).map(child => child.cloneNode(true));
      clonedItems.forEach(node => wrapper.appendChild(node));
    };
    
    // 执行初始设置
    setupInfiniteScroll();
    
    // 平滑滚动的函数 - 使用requestAnimationFrame实现更流畅的滚动
    const smoothScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const wrapper = container.querySelector('.music-wrapper') as HTMLElement;
      
      if (!wrapper) return;
      
      // 原始内容宽度（不包括克隆部分）
      const originalContentWidth = music.length * scrollWidth;
      
      // 减小每秒滚动距离，使视觉效果更平滑
      const scrollSpeed = scrollWidth / 6; // 每秒滚动的像素（速度变慢）
      
      // 当前滚动位置
      let currentPosition = container.scrollLeft;
      let lastTimestamp = 0;
      
      // 动画帧函数
      const scrollFrame = (timestamp: number) => {
        if (!scrollContainerRef.current) return;
        
        // 如果已经被用户交互暂停，停止动画
        if (isScrolling) {
          scrollAnimation = null;
          return;
        }
        
        // 计算两帧之间的时间差，确保动画速率一致
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        
        // 根据时间差调整滚动距离，保持恒定速度
        const moveDistance = (scrollSpeed * deltaTime) / 1000; // 每毫秒移动的距离
        currentPosition += moveDistance;
        
        // 无缝循环：当滚动超过原始内容宽度时，立即跳回到开始位置
        if (currentPosition >= originalContentWidth) {
          currentPosition = 0;
          container.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          // 平滑滚动到新位置
          container.scrollTo({ left: currentPosition, behavior: 'auto' });
        }
        
        // 更新活动索引，使用Math.floor避免频繁跳动
        const newIndex = Math.floor(currentPosition / scrollWidth) % music.length;
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
        
        // 继续下一帧动画
        scrollAnimation = requestAnimationFrame(scrollFrame);
      };
      
      // 启动动画
      scrollAnimation = requestAnimationFrame(scrollFrame);
    };
    
    // 开始自动滚动
    const startAutoScroll = () => {
      // 如果已有动画，取消它
      if (scrollAnimation) {
        cancelAnimationFrame(scrollAnimation);
        scrollAnimation = null;
      }
      
      // 开始新的平滑滚动
      smoothScroll();
    };
    
    // 停止自动滚动
    const stopAutoScroll = () => {
      if (scrollAnimation) {
        cancelAnimationFrame(scrollAnimation);
        scrollAnimation = null;
      }
    };
    
    // 启动自动滚动
    startAutoScroll();
    
    // 当用户手动滚动时暂停自动滚动
    const handleUserScroll = () => {
      if (isScrolling) return;
      
      // 用户交互时停止动画
      stopAutoScroll();
      
      // 无缝循环：检查滚动位置是否需要重置
      const container = scrollContainerRef.current;
      if (!container) return;
      
      // 原始内容宽度
      const originalContentWidth = music.length * scrollWidth;
      
      // 如果滚动位置接近或超过原始内容宽度，重置到开始
      if (container.scrollLeft >= originalContentWidth) {
        container.scrollTo({ left: 0, behavior: 'auto' });
      }
      
      // 用户停止滚动5秒后恢复自动滚动
      const resumeTimeout = setTimeout(() => {
        startAutoScroll();
      }, 5000);
      
      // 如果用户在5秒内再次滚动，清除定时器
      return () => clearTimeout(resumeTimeout);
    };
    
    // 鼠标悬停时暂停自动滚动
    const handleMouseEnter = () => {
      stopAutoScroll();
    };
    
    // 鼠标离开时恢复自动滚动
    const handleMouseLeave = () => {
      startAutoScroll();
    };
    
    // 添加事件监听
    const container = scrollContainerRef.current;
    container.addEventListener('scroll', handleUserScroll);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // 清理函数
    return () => {
      stopAutoScroll();
      if (container) {
        container.removeEventListener('scroll', handleUserScroll);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [music.length]); // 当音乐数据改变时重新设置

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
      // router.push(`/blog/${music.id}`);
      router.push(`/music/${music.id}`);
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
        whileHover={{ 
          y: -8,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
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

  // 添加滚动控制函数
  const scrollPrev = () => {
    if (!scrollContainerRef.current || music.length <= 0) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = 320; // 大致估计的卡片宽度
    const gap = 24; // space-x-6 = 1.5rem = 24px
    const scrollWidth = cardWidth + gap;
    
    // 获取当前滚动位置
    const currentScroll = container.scrollLeft;
    
    // 原始内容宽度
    const originalContentWidth = music.length * scrollWidth;
    
    let targetPosition;
    
    // 如果已经在开头，则滚动到末尾
    if (currentScroll < scrollWidth) {
      targetPosition = originalContentWidth - scrollWidth;
    } else {
      // 否则正常滚动到上一个
      targetPosition = currentScroll - scrollWidth;
    }
    
    // 使用平滑动画效果滚动到目标位置
    const startPosition = currentScroll;
    const distance = targetPosition - startPosition;
    const duration = 600; // 增加动画持续时间，使过渡更平滑
    const startTime = performance.now();
    
    // 创建平滑动画
    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime >= duration) {
        // 动画结束，设置最终位置
        container.scrollTo({ left: targetPosition, behavior: 'auto' });
        
        // 更新活动索引
        const newIndex = Math.floor(targetPosition / scrollWidth) % music.length;
        setActiveIndex(newIndex);
        return;
      }
      
      // 计算当前动画帧的位置
      const progress = elapsedTime / duration;
      
      // 自定义缓动函数 - 更平滑的过渡
      const easeProgress = progress < 0.5 ?
        4 * Math.pow(progress, 3) :
        1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentPosition = startPosition + distance * easeProgress;
      
      // 设置滚动位置
      container.scrollTo({ left: currentPosition, behavior: 'auto' });
      
      // 继续下一帧
      requestAnimationFrame(animateScroll);
    };
    
    // 开始动画
    requestAnimationFrame(animateScroll);
  };
  
  const scrollNext = () => {
    if (!scrollContainerRef.current || music.length <= 0) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = 320; // 大致估计的卡片宽度
    const gap = 24; // space-x-6 = 1.5rem = 24px
    const scrollWidth = cardWidth + gap;
    
    // 原始内容宽度
    const originalContentWidth = music.length * scrollWidth;
    
    // 获取当前滚动位置
    const currentScroll = container.scrollLeft;
    
    let targetPosition;
    
    // 如果已经到末尾，则滚动到开头
    if (currentScroll >= originalContentWidth - scrollWidth * 1.5) {
      targetPosition = 0;
    } else {
      // 否则正常滚动到下一个
      targetPosition = currentScroll + scrollWidth;
    }
    
    // 使用平滑动画效果滚动到目标位置
    const startPosition = currentScroll;
    const distance = targetPosition - startPosition;
    const duration = 600; // 增加动画持续时间，使过渡更平滑
    const startTime = performance.now();
    
    // 创建平滑动画
    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime >= duration) {
        // 动画结束，设置最终位置
        container.scrollTo({ left: targetPosition, behavior: 'auto' });
        
        // 更新活动索引
        const newIndex = Math.floor(targetPosition / scrollWidth) % music.length;
        setActiveIndex(newIndex);
        return;
      }
      
      // 计算当前动画帧的位置
      const progress = elapsedTime / duration;
      
      // 自定义缓动函数 - 更平滑的过渡
      const easeProgress = progress < 0.5 ?
        4 * Math.pow(progress, 3) :
        1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentPosition = startPosition + distance * easeProgress;
      
      // 设置滚动位置
      container.scrollTo({ left: currentPosition, behavior: 'auto' });
      
      // 继续下一帧
      requestAnimationFrame(animateScroll);
    };
    
    // 开始动画
    requestAnimationFrame(animateScroll);
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
        
        {/* 直接显示音乐内容 */}
        <div className="mt-2">
          {music.length > 0 ? (
            <div className="relative overflow-hidden px-4">
              {/* 左侧渐变阴影指示器 */}
              <div className="absolute left-0 top-0 bottom-0 w-[10%] bg-gradient-to-r from-white dark:from-content to-transparent z-10 pointer-events-none" />
              
              {/* 左侧导航按钮 */}
              <button 
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="滚动到上一个"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="overflow-x-auto scrollbar-hide scroll-container -mx-4 px-4" ref={scrollContainerRef}>
                <motion.div 
                  className="flex space-x-6 pb-4 pt-2 pl-[10%] pr-[calc(10%+1.5rem)] music-wrapper"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {music.map((item) => (
                    <div key={item.id} className="w-[calc(33.33%-1rem)] min-w-[280px] max-w-[320px] flex-shrink-0">
                      <MusicCard music={item} />
                    </div>
                  ))}
                </motion.div>
              </div>
              
              {/* 右侧导航按钮 */}
              <button 
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="滚动到下一个"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* 右侧渐变阴影指示器 */}
              <div className="absolute right-0 top-0 bottom-0 w-[10%] bg-gradient-to-l from-white dark:from-content to-transparent z-10 pointer-events-none" />
            </div>
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">暂无音乐数据，请从数据库获取</p>
            </div>
          )}
          
          <div className="text-center mt-10">
            {/* 滚动位置指示器 */}
            {music.length > 0 && (
              <div className="flex justify-center mb-6 space-x-2">
                {music.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!scrollContainerRef.current) return;
                      const cardWidth = 320; // 大致估计的卡片宽度
                      const gap = 24; // space-x-6 = 1.5rem = 24px
                      const scrollWidth = cardWidth + gap;
                      const originalContentWidth = music.length * scrollWidth;
                      
                      // 计算当前滚动位置对应的卡片索引
                      const currentIndex = Math.round(scrollContainerRef.current.scrollLeft / scrollWidth);
                      
                      // 如果点击的是当前卡片，不做任何操作
                      if (idx === currentIndex) return;
                      
                      // 计算目标位置
                      const targetPosition = idx * scrollWidth;
                      
                      // 获取当前滚动位置
                      const startPosition = scrollContainerRef.current.scrollLeft;
                      const distance = targetPosition - startPosition;
                      const duration = 800; // 毫秒，稍微长一点的动画时间
                      const startTime = performance.now();
                      
                      // 创建平滑动画
                      const animateScroll = (currentTime: number) => {
                        if (!scrollContainerRef.current) return;
                        
                        const elapsedTime = currentTime - startTime;
                        
                        if (elapsedTime >= duration) {
                          // 动画结束，设置最终位置
                          scrollContainerRef.current.scrollTo({ left: targetPosition, behavior: 'auto' });
                          
                          // 更新活动索引
                          setActiveIndex(idx);
                          return;
                        }
                        
                        // 使用更平滑的缓动函数
                        const progress = elapsedTime / duration;
                        
                        // 使用缓入缓出的三次方缓动函数，比二次方更平滑
                        const easeProgress = progress < 0.5 ?
                          4 * Math.pow(progress, 3) :
                          1 - Math.pow(-2 * progress + 2, 3) / 2;
                        
                        const currentPosition = startPosition + distance * easeProgress;
                        
                        // 设置滚动位置
                        scrollContainerRef.current.scrollTo({ left: currentPosition, behavior: 'auto' });
                        
                        // 继续下一帧
                        requestAnimationFrame(animateScroll);
                      };
                      
                      // 开始动画
                      requestAnimationFrame(animateScroll);
                      
                      // 暂停自动滚动一段时间，让用户有时间查看
                      const container = scrollContainerRef.current;
                      const scrollEvent = new Event('scroll');
                      container.dispatchEvent(scrollEvent);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-blue-600 w-4' : 'bg-gray-300 dark:bg-gray-700'}`}
                    aria-label={`滚动到第${idx + 1}个项目`}
                  />
                ))}
              </div>
            )}
            
            <Link href="/music" onClick={handleNavigationClick}>
              <span className="btn-primary inline-flex items-center">
                查看所有内容 <FaArrowRight className="ml-2" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 