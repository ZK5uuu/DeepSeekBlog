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

// 用于本地存储浏览量的键
const VIEW_COUNT_STORAGE_KEY = 'music_blog_view_counts';
// 用于会话存储已查看文章的键
const VIEWED_POSTS_SESSION_KEY = 'viewed_posts';

// 更新本地存储中的浏览量
const updateLocalViewCount = (postId: string, incrementBy: number = 1): void => {
  if (typeof window === 'undefined') return;
  
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
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }
  
  if (typeof window === 'undefined') return false;
  
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
  if (typeof window === 'undefined') return;
  
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
  if (typeof window === 'undefined') return 'light';
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
  const currentUserId = localStorage.getItem('userId') || '1';
  
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
  
  const handleLike = async () => {
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
    if (!post) return;
    
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
  
  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size={12} />
      </div>
    );
  }
  
  // 文章不存在
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">文章不存在或已被删除</h1>
        <Link href="/blog" className="text-blue-500 hover:underline">
          返回博客列表
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20" style={{ 
      color: textColor,
      position: 'relative',
      zIndex: 1
    }}>
      <Toaster position="top-center" />
      
      {/* 全局渐变背景效果 */}
      {bgColor && (
        <div 
          className="fixed inset-0 pointer-events-none z-0" 
          style={{
            background: `radial-gradient(circle at top, ${bgColor}60, transparent 70%), 
                        radial-gradient(circle at bottom, ${bgColor}60, transparent 70%)`,
            opacity: 0.8
          }}
        />
      )}
      
      {/* 全屏成功消息 */}
      <AnimatePresence>
        {showFullscreenSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-green-500 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold mb-4">{successMessage}</h2>
              <p className="mb-6 text-gray-600">即将跳转...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 删除确认模态框 */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-4">确认删除</h2>
              <p className="mb-6 text-gray-600">确定要删除这篇文章吗？此操作无法撤销。</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                  disabled={isDeleting}
                >
                  取消
                </button>
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  disabled={isDeleting}
                >
                  {isDeleting ? <LoadingSpinner size={4} /> : '确认删除'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 文章头部 */}
      <header 
        className="py-12 relative z-10" 
        style={{ 
          backgroundColor: bgColor ? `${bgColor}60` : undefined,
          boxShadow: bgColor ? `0 4px 30px ${bgColor}70` : undefined
        }}
      >
        <div className="container-custom">
          <div className="max-w-3xl">
            {/* 返回按钮 */}
            <Link href="/blog" className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <FaArrowLeft /> 返回文章列表
            </Link>
            
            {/* 作者和编辑按钮 */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                  <div className="flex items-center gap-1 text-sm opacity-75">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <span>{post.readingTime} 分钟阅读</span>
                    <span>•</span>
                    <span>{post.viewCount || 0} 次阅读</span>
                  </div>
                </div>
              </div>
              
              {/* 编辑/删除按钮 - 仅对作者显示 */}
              {canEditDelete && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleEditPost}
                    className="p-2 rounded-full"
                    style={{ 
                      backgroundColor: bgColor ? `${bgColor}20` : 'rgba(243, 244, 246, 1)'
                    }}
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              )}
            </div>
            
            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags && post.tags.map((tag: any) => (
                <span 
                  key={tag.id} 
                  className="px-3 py-1 rounded-full text-sm cursor-pointer"
                  style={{ 
                    backgroundColor: bgColor ? `${bgColor}50` : 'rgba(243, 244, 246, 1)',
                    color: textColor || 'inherit',
                    boxShadow: bgColor ? `0 2px 8px ${bgColor}40` : undefined
                  }}
                >
                  <FaTag className="inline mr-1 text-xs" /> {tag.name}
                </span>
              ))}
            </div>
            
            {/* 封面图片 */}
            <div className="relative w-full h-[40vh] min-h-[300px] mb-8 rounded-xl overflow-hidden">
              <Image
                src={post.albumImageUrl || post.coverImageUrl || '/images/placeholder.jpg'}
                alt={post.title}
                fill
                style={{ objectFit: 'contain' }}
                priority
                ref={coverImageRef as any}
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* 文章内容 */}
      <main className="pb-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧文章内容 */}
            <div className="w-full lg:w-3/4">
              <div className="max-w-3xl">
                {/* 文章摘要 */}
                <div 
                  className="mb-8 text-lg p-4 rounded-lg border-l-4"
                  style={{ 
                    backgroundColor: bgColor ? `${bgColor}60` : 'rgba(249, 250, 251, 1)',
                    borderColor: bgColor || 'rgba(79, 70, 229, 1)',
                    boxShadow: bgColor ? `0 4px 15px ${bgColor}40` : undefined
                  }}
                >
                  {post.summary}
                </div>
                
                {/* AI摘要按钮 */}
                <div className="mb-8">
                  <AISummaryButton 
                    content={post.content} 
                    title={post.title}
                    postId={post.id}
                  />
                </div>
                
                {/* 文章正文 */}
                <article 
                  className="prose prose-lg max-w-none mb-12"
                  style={{ 
                    color: textColor,
                    // 确保链接和其他元素也有适当的颜色
                    '--tw-prose-body': textColor,
                    '--tw-prose-headings': textColor,
                    '--tw-prose-lead': textColor,
                    '--tw-prose-links': bgColor || (colorScheme === 'dark' ? '#8db3ed' : '#2563eb'),
                    '--tw-prose-bold': textColor,
                    '--tw-prose-counters': textColor,
                    '--tw-prose-bullets': textColor,
                    '--tw-prose-hr': textColor,
                    '--tw-prose-quotes': textColor,
                    '--tw-prose-quote-borders': bgColor || '#e5e7eb',
                    '--tw-prose-captions': textColor,
                    '--tw-prose-code': textColor,
                    '--tw-prose-pre-code': colorScheme === 'dark' ? '#e5e7eb' : '#1f2937',
                    '--tw-prose-pre-bg': colorScheme === 'dark' ? '#1f2937' : '#f3f4f6',
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* 交互按钮 - 只保留点赞 */}
                <div className="flex items-center justify-between py-6 border-t border-b mb-8" 
                  style={{ 
                    borderColor: bgColor ? `${bgColor}70` : 'rgba(229, 231, 235, 1)',
                    background: bgColor ? `${bgColor}30` : undefined
                  }}>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleLike}
                      className="flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ 
                        backgroundColor: liked ? 'rgba(239, 68, 68, 0.1)' : bgColor ? `${bgColor}20` : 'rgba(243, 244, 246, 1)',
                        color: liked ? 'rgb(220, 38, 38)' : textColor || 'inherit'
                      }}
                    >
                      <FaHeart /> {liked ? '已点赞' : '点赞'} ({post.likeCount || 0})
                    </button>
                  </div>
                </div>
                
                {/* 相关文章 */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6">相关推荐</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPosts.length > 0 ? (
                      relatedPosts.map((relatedPost: any) => (
                        <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id}>
                          <div 
                            className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                            style={{ 
                              backgroundColor: bgColor ? `${bgColor}15` : 'white',
                              color: textColor || 'inherit'
                            }}
                          >
                            <div className="relative h-40 w-full">
                              <Image
                                src={relatedPost.coverImageUrl || '/images/placeholder.jpg'}
                                alt={relatedPost.title}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-bold text-lg mb-2 line-clamp-2">{relatedPost.title}</h4>
                              <p className="text-sm opacity-75 line-clamp-2">{relatedPost.summary}</p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="col-span-2 opacity-75">暂无相关推荐</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 右侧信息 */}
            <div className="w-full lg:w-1/4">
              {/* 作者信息 */}
              <div 
                className="rounded-xl p-6 mb-8"
                style={{ 
                  backgroundColor: bgColor ? `${bgColor}60` : 'rgba(249, 250, 251, 1)',
                  boxShadow: bgColor ? `0 4px 20px ${bgColor}40` : undefined
                }}
              >
                <h3 className="font-bold text-xl mb-4">关于作者</h3>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-14 h-14 rounded-full overflow-hidden mr-4 flex items-center justify-center"
                    style={{ 
                      backgroundColor: bgColor ? `${bgColor}33` : 'rgba(79, 70, 229, 0.1)'
                    }}
                  >
                    {post.author?.avatarUrl ? (
                      <Image 
                        src={post.author.avatarUrl}
                        alt={post.author?.name || '作者'}
                        width={56}
                        height={56}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        {post.author?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{post.author?.name || '匿名用户'}</p>
                    <p className="text-sm opacity-75">发布于 {formatDate(post.createdAt)}</p>
                  </div>
                </div>
                <p className="opacity-75 text-sm">
                  {post.author?.bio || '这个作者很懒，还没有填写个人简介。'}
                </p>
              </div>
              
              {/* 专辑/音乐信息 - 仅在内容类型为音乐时显示 */}
              {post.contentType === 'music' && (
                <div 
                  className="rounded-xl p-6 mb-8"
                  style={{ 
                    backgroundColor: bgColor ? `${bgColor}70` : 'rgba(249, 250, 251, 1)',
                    boxShadow: bgColor ? `0 8px 25px ${bgColor}60` : undefined
                  }}
                >
                  <h3 className="font-bold text-xl mb-4">音乐信息</h3>
                  {post.albumImageUrl && (
                    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={post.albumImageUrl}
                        alt={post.albumName || post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <p className="font-bold">{post.albumName || '未知专辑'}</p>
                  <p className="opacity-75 mb-2">{post.artistName || '未知艺术家'}</p>
                  
                  {post.music_styles && post.music_styles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.music_styles.map((style: string, index: number) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 text-xs rounded-full"
                          style={{ 
                            backgroundColor: bgColor ? `${bgColor}33` : 'rgba(243, 244, 246, 1)'
                          }}
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* 文章统计 */}
              <div 
                className="rounded-xl p-6"
                style={{ 
                  backgroundColor: bgColor ? `${bgColor}60` : 'rgba(249, 250, 251, 1)',
                  boxShadow: bgColor ? `0 4px 20px ${bgColor}40` : undefined
                }}
              >
                <h3 className="font-bold text-xl mb-4">文章信息</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="opacity-75">发布日期</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">阅读次数</span>
                    <span>{post.viewCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">点赞数</span>
                    <span>{post.likeCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">字数</span>
                    <span>{post.content ? post.content.replace(/<[^>]*>/g, '').length : 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 