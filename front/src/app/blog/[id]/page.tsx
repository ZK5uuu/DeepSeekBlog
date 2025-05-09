'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaHeart, FaArrowLeft, FaEdit, FaTrash, FaCheck, FaTag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import AISummaryButton from '@/app/components/ui/AISummaryButton';
import { postApi } from '@/app/api/services/blogService';
import { Toaster, toast } from 'react-hot-toast';
import { FastAverageColor } from 'fast-average-color';

// 检查是否在浏览器环境中
const isBrowser = () => typeof window !== 'undefined';

// 用于本地存储浏览量的键
const VIEW_COUNT_STORAGE_KEY = 'music_blog_view_counts';
// 用于会话存储已查看文章的键
const VIEWED_POSTS_SESSION_KEY = 'viewed_posts';

// 更新本地存储中的浏览量
const updateLocalViewCount = (postId: string, incrementBy: number = 1): void => {
  if (!isBrowser()) return;
  
  const storedData = localStorage.getItem(VIEW_COUNT_STORAGE_KEY);
  let viewCounts: Record<string, number> = {};
  
  try {
    viewCounts = storedData ? JSON.parse(storedData) : {};
  } catch (e) {
    console.error('解析本地浏览量数据失败:', e);
  }
  
  viewCounts[postId] = (viewCounts[postId] || 0) + incrementBy;
  localStorage.setItem(VIEW_COUNT_STORAGE_KEY, JSON.stringify(viewCounts));
};

// 检查文章是否已在当前会话中被查看
const hasViewedInSession = (postId: string): boolean => {
  // 在开发模式下总是返回false，这样浏览量就会增加
  if (!isBrowser()) return false;
  
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }
  
  const viewedPosts = sessionStorage.getItem(VIEWED_POSTS_SESSION_KEY);
  if (!viewedPosts) return false;
  
  try {
    const viewedPostsArray = JSON.parse(viewedPosts);
    return Array.isArray(viewedPostsArray) && viewedPostsArray.includes(postId);
  } catch (e) {
    console.error('解析会话浏览记录失败:', e);
    return false;
  }
};

// 标记文章在当前会话中已被查看
const markAsViewedInSession = (postId: string): void => {
  if (!isBrowser()) return;
  
  try {
    const viewedPosts = sessionStorage.getItem(VIEWED_POSTS_SESSION_KEY);
    let viewedPostsArray: string[] = [];
    
    if (viewedPosts) {
      const parsed = JSON.parse(viewedPosts);
      if (Array.isArray(parsed)) {
        viewedPostsArray = parsed;
      } else {
        console.warn('会话存储中的viewed_posts不是数组，将重置为空数组');
      }
    }
    
    if (!viewedPostsArray.includes(postId)) {
      viewedPostsArray.push(postId);
      sessionStorage.setItem(VIEWED_POSTS_SESSION_KEY, JSON.stringify(viewedPostsArray));
      console.log(`已将文章 ${postId} 标记为已查看，会话存储已更新`);
    } else {
      console.log(`文章 ${postId} 已经在会话中被标记为已查看`);
    }
  } catch (e) {
    console.error('更新会话浏览记录失败:', e);
    // 出错时尝试重置会话存储
    try {
      sessionStorage.setItem(VIEWED_POSTS_SESSION_KEY, JSON.stringify([postId]));
      console.log('会话存储已重置，并添加当前文章ID');
    } catch (resetError) {
      console.error('重置会话存储失败:', resetError);
    }
  }
};

// 新增检测系统颜色模式的函数
const getSystemColorScheme = (): 'light' | 'dark' => {
  if (!isBrowser()) return 'light';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [canEditDelete, setCanEditDelete] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFullscreenSuccess, setShowFullscreenSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [bgColor, setBgColor] = useState<string>('');
  const [textColor, setTextColor] = useState<string>('');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(getSystemColorScheme());
  
  // 图片引用
  const coverImageRef = useRef<HTMLImageElement>(null);
  
  // 获取当前用户ID (模拟)
  const [currentUserId, setCurrentUserId] = useState<string>('1');
  
  // 添加客户端检测钩子
  useEffect(() => {
    if (isBrowser()) {
      // 只在客户端获取localStorage数据
      setCurrentUserId(localStorage.getItem('userId') || '1');
    }
  }, []);
  
  // 获取博客文章数据
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      
      try {
        const postId = Array.isArray(params.id) ? params.id[0] : params.id;
        console.log('正在获取文章详情, id=', postId);
        
        // 获取文章详情
        console.log('API调用: postApi.getPostById:', `${postId}`);
        const postResponse = await postApi.getPostById(postId);
        console.log('文章详情响应:', postResponse);
        
        if (postResponse) {
          console.log('文章数据:', postResponse);
          // 确保我们正确设置文章数据
          const postData = postResponse.data || postResponse;
          setPost(postData);
          
          // 增加文章浏览量 - 只在当前会话首次查看时增加
          if (postId && !hasViewedInSession(postId.toString())) {
            try {
              console.log('确认浏览状态: 首次查看该文章，准备增加浏览量');
              console.log('调用API: postApi.viewPost, id=', postId);
              
              // 先标记为已查看，确保在API调用前就防止重复增加
              markAsViewedInSession(postId.toString());
              console.log('已在会话中标记为已查看 (API调用前)');
              
              // 只调用API一次增加浏览量，确保计数只增加1
              await postApi.viewPost(postId);
              console.log('API浏览量已更新');
            } catch (viewError) {
              console.error('增加浏览量失败:', viewError);
            }
          } else {
            console.log('浏览状态: 该文章在本次会话中已被查看过，不增加浏览量');
          }
          
          // 检查当前用户是否为作者，是则可以编辑删除
          // 将 currentUserId 转为数字进行比较，避免字符串与数字的比较问题
          const authorId = postData.authorId;
          const currentUserIdNum = parseInt(currentUserId);
          // 为方便调试，先始终设置为true
          const isAuthor = true; // authorId === currentUserIdNum; 
          
          console.log('编辑权限调试:');
          console.log('  当前用户ID:', currentUserId, '(类型:', typeof currentUserId, ')');
          console.log('  当前用户ID转数字:', currentUserIdNum, '(类型:', typeof currentUserIdNum, ')');
          console.log('  文章作者ID:', authorId, '(类型:', typeof authorId, ')');
          console.log('  是否为作者:', isAuthor);
          
          // 设置编辑权限状态
          setCanEditDelete(isAuthor);
          
          // 获取推荐文章
          console.log('正在获取推荐文章...');
          try {
            const recommendResponse = await postApi.getRecommendPosts(3);
            console.log('推荐文章响应:', recommendResponse);
            if (recommendResponse && recommendResponse.data) {
              // 过滤掉当前文章
              const postIdStr = typeof postId === 'string' ? postId : String(postId);
              const filtered = recommendResponse.data.filter((p: any) => String(p.id) !== postIdStr);
              setRelatedPosts(filtered);
            }
          } catch (error) {
            console.error('获取推荐文章失败:', error);
          }
        } else {
          console.error('文章不存在或响应无效');
          // 文章不存在，跳转到博客列表页
          toast.error('文章不存在或已被删除');
          setTimeout(() => router.push('/'), 2000);
        }
      } catch (error) {
        console.error('获取文章数据失败:', error);
        toast.error('获取文章数据失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [params.id, router, currentUserId]);
  
  // 监听系统颜色模式变化
  useEffect(() => {
    if (!isBrowser()) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 初始化颜色模式
    setColorScheme(mediaQuery.matches ? 'dark' : 'light');
    
    // 创建变更监听函数
    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };
    
    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 兼容旧浏览器
      mediaQuery.addListener(handleChange);
    }
    
    // 清理函数
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // 兼容旧浏览器
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // 当颜色模式变化时，更新文本颜色
  useEffect(() => {
    setTextColor(colorScheme === 'dark' ? '#ffffff' : '#000000');
  }, [colorScheme]);
  
  // 提取图片主色
  useEffect(() => {
    if (!isBrowser()) return;
    
    const extractColorFromImage = async () => {
      if (!post) return;
      
      // 优先使用专辑封面图
      const imageUrl = post.contentType === 'music' && post.albumImageUrl 
        ? post.albumImageUrl 
        : post.coverImageUrl;
        
      if (!imageUrl) return;
      
      try {
        console.log('尝试提取图片颜色:', imageUrl);
        const fac = new FastAverageColor();
        
        if (coverImageRef.current) {
          console.log('找到图片元素，提取颜色中...');
          const color = await fac.getColorAsync(coverImageRef.current);
          console.log('提取的颜色:', color);
          
          if (color && !color.error) {
            // 设置背景色为提取的颜色
            setBgColor(color.hex);
            
            // 根据系统颜色模式设置文字颜色，而不是根据背景亮度
            // 在亮色模式下使用黑色文本，在暗色模式下使用白色文本
            setTextColor(colorScheme === 'dark' ? '#ffffff' : '#000000');
            
            // 全局应用颜色到整个页面（不限于音乐内容）
            // 设置全局背景为更强的颜色
            document.body.style.backgroundColor = `${color.hex}70`;
            // 设置渐变背景，顶部更深，底部稍浅
            document.body.style.backgroundImage = `linear-gradient(to bottom, ${color.hex}90, ${color.hex}50)`;
            // 添加全局颜色到页面根元素
            document.documentElement.style.setProperty('--theme-color', color.hex);
            document.documentElement.style.setProperty('--theme-color-light', `${color.hex}40`);
            document.documentElement.style.setProperty('--theme-color-dark', `${color.hex}90`);
            document.documentElement.style.setProperty('--text-color', colorScheme === 'dark' ? '#ffffff' : '#000000');
            
            return () => {
              document.body.style.backgroundColor = '';
              document.body.style.backgroundImage = '';
              document.documentElement.style.removeProperty('--theme-color');
              document.documentElement.style.removeProperty('--theme-color-light');
              document.documentElement.style.removeProperty('--theme-color-dark');
              document.documentElement.style.removeProperty('--text-color');
            };
          }
        }
      } catch (error) {
        console.error('提取图片颜色失败:', error);
      }
    };
    
    if (post && coverImageRef.current) {
      extractColorFromImage();
    }
  }, [post, coverImageRef.current, colorScheme]);
  
  // 处理点赞功能
  const handleLike = async () => {
    if (!isBrowser() || !post) return;
    
    try {
      if (!liked) {
        await postApi.likePost(post.id);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('操作失败:', error);
    }
  };
  
  // 处理删除博客
  const handleDeletePost = async () => {
    if (!post) return;
    
    setIsDeleting(true);
    try {
      // 确保我们获取正确的文章ID
      const postId = post.id || (post.data && post.data.id);
      
      if (!postId) {
        console.error('无法获取文章ID:', post);
        toast.error('删除失败: 无法获取文章ID');
        setIsDeleting(false);
        return;
      }
      
      console.log('尝试删除文章，ID:', postId);
      
      // 调用删除API
      const response = await postApi.deletePost(postId);
      console.log('删除响应:', response);
      
      setShowDeleteModal(false);
      
      // 获取内容类型 - 针对不同类型内容跳转到不同页面
      const contentType = post.contentType || '';
      let redirectPath = '/';
      
      // 根据内容类型决定跳转位置
      if (contentType.toLowerCase() === 'music') {
        redirectPath = '/music';
      } else if (contentType.toLowerCase() === 'movie') {
        redirectPath = '/movie';
      } else if (contentType.toLowerCase() === 'book') {
        redirectPath = '/book';
      }
      
      console.log(`文章删除成功，将在显示成功提示后跳转到: ${redirectPath}`);
      
      // 保存重定向URL
      setRedirectUrl(redirectPath);
      setSuccessMessage('文章已成功删除');
      
      // 显示全屏删除成功提示
      setShowFullscreenSuccess(true);
      
      // 显示Toast提示
      toast.success('文章已成功删除', {
        duration: 5000,
        icon: '🗑️',
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
        }
      });

      // 不自动跳转，等待用户确认
    } catch (error: any) {
      console.error('删除文章失败:', error);
      toast.error(`删除文章失败: ${error.message || '请稍后再试'}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // 处理编辑博客
  const handleEditPost = () => {
    if (!isBrowser() || !post) return;
    
    console.log('点击编辑按钮');
    console.log('编辑权限状态:', canEditDelete);
    console.log('文章ID:', post.id);
    console.log('文章类型:', post.contentType);
    
    // 检查是否有权限编辑
    if (!canEditDelete) {
      toast.error('您没有权限编辑此文章');
      return;
    }
    
    // 跳转到编辑页面，并传递博客ID
    const editUrl = `/blog/create?edit=${post.id}&type=${post.contentType || 'blog'}`;
    console.log('跳转到编辑页面:', editUrl);
    router.push(editUrl);
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Toaster position="top-center" />
      
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner />
        </div>
      ) : post ? (
        <>
          {/* 顶部渐变背景区域 */}
          <div 
            className="relative w-full h-96 bg-cover bg-center" 
          style={{
              backgroundImage: post.coverImageUrl ? `url(${post.coverImageUrl})` : 'none',
              backgroundColor: bgColor || (colorScheme === 'dark' ? '#1f2937' : '#f0f9ff')
            }}
          >
            {/* 半透明渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 backdrop-blur-sm"></div>
            
            {/* 返回按钮 - 悬浮在左上角 */}
            <div className="absolute top-6 left-6 z-10">
              <Link href="/blog">
                <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all shadow-lg">
                  <FaArrowLeft />
                  <span>返回</span>
                </button>
              </Link>
            </div>
            
            {/* 文章标题和元数据 - 置于图片底部 */}
            <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl font-bold mb-3 text-shadow-lg"
              >
                {post.title}
              </motion.h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-white/80">
                <div className="flex items-center">
                  <span className="mr-2">作者:</span>
                  <span className="font-medium">{post.author?.username || '管理员'}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="mr-2">发布于:</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <span>浏览:</span>
                  <span>{post.viewCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 主要内容区域 */}
          <div className="max-w-5xl mx-auto px-4 py-8 relative -mt-16 z-20">
            {/* 文章内容卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8"
            >
              {/* 标签区域 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag: any, index: number) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium flex items-center"
                    >
                      <FaTag className="mr-1 text-xs" />
                      {typeof tag === 'object' ? tag.name : tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* 内容区域 - 使用更优雅的排版 */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {post.content && post.content.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                {!post.content && (
                  <p className="mb-4 text-gray-500 dark:text-gray-400 italic">暂无内容</p>
                )}
              </div>
              
              {/* 音乐评论专属信息 */}
              {post.contentType === 'music' && (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">音乐信息</h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    {post.albumImageUrl && (
                      <div className="w-48 h-48 rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={post.albumImageUrl}
                          alt={post.albumName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="mb-3">
                        <span className="text-gray-500 dark:text-gray-400 block text-sm">艺术家</span>
                        <span className="text-xl font-medium">{post.artistName}</span>
                      </div>
                      <div className="mb-3">
                        <span className="text-gray-500 dark:text-gray-400 block text-sm">专辑</span>
                        <span className="text-xl font-medium">{post.albumName}</span>
                      </div>
                      {post.contentLink && (
                        <a 
                          href={post.contentLink} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <span className="mr-2">收听</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* 交互区域 - 点赞、编辑、删除 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 mb-8"
            >
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  liked 
                    ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                }`}
              >
                <FaHeart className={`${liked ? 'text-pink-600 dark:text-pink-400' : ''}`} />
                <span>{post.likeCount || 0}</span>
              </button>
              
              {/* 操作按钮组 */}
              {canEditDelete && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEditPost}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <FaEdit />
                    <span>编辑</span>
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <FaTrash />
                    <span>删除</span>
                  </button>
                </div>
              )}
            </motion.div>
            
            {/* 相关文章区域 */}
            {relatedPosts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">相关推荐</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost: any) => (
                    <Link 
                      href={`/blog/${relatedPost.id}`} 
                      key={relatedPost.id}
                      className="group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                        <div className="h-48 overflow-hidden">
                          {relatedPost.coverImageUrl ? (
                            <img
                              src={relatedPost.coverImageUrl}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500"></div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {relatedPost.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                            {relatedPost.summary || (relatedPost.content ? relatedPost.content.substring(0, 120) + '...' : '暂无内容')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
          </motion.div>
        )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">该文章可能已被删除或不存在</p>
          <Link href="/blog">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              返回博客列表
            </button>
          </Link>
        </div>
      )}
      
      {/* 删除确认模态框 */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">确认删除</h2>
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                您确定要删除这篇文章吗？此操作不可撤销。
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  disabled={isDeleting}
                >
                  取消
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <LoadingSpinner />
                      <span>删除中...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      <span>确认删除</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 成功操作全屏反馈 */}
      <AnimatePresence>
        {showFullscreenSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-green-600/90 dark:bg-green-900/90 flex flex-col items-center justify-center z-50 text-white"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <FaCheck className="text-4xl" />
              </div>
              <h2 className="text-3xl font-bold mb-2">{successMessage}</h2>
              <p className="text-lg text-white/80 mb-8">您将被重定向到新页面...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 