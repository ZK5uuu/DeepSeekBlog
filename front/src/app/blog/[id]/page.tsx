'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaHeart, FaBookmark, FaShare, FaComment, FaTag, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import AISummaryButton from '@/app/components/ui/AISummaryButton';
import { postApi, commentApi } from '@/app/api/services/blogService';

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // 获取博客文章数据
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      
      try {
        const postId = Array.isArray(params.id) ? params.id[0] : params.id;
        
        // 获取文章详情
        const postResponse = await postApi.getPostById(postId);
        
        if (postResponse && postResponse.data) {
          setPost(postResponse.data);
          
          // 获取评论
          const commentsResponse = await commentApi.getCommentsByPostId(postId);
          if (commentsResponse && commentsResponse.data) {
            setComments(commentsResponse.data);
          }
          
          // 获取推荐文章
          const recommendResponse = await postApi.getRecommendPosts(3);
          if (recommendResponse && recommendResponse.data) {
            // 过滤掉当前文章
            const filtered = recommendResponse.data.filter((p: any) => p.id !== postId);
            setRelatedPosts(filtered);
          }
        } else {
          // 文章不存在，跳转到博客列表页
          router.push('/blog');
        }
      } catch (error) {
        console.error('获取文章数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [params.id, router]);
  
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      return;
    }
    
    setSubmittingComment(true);
    
    try {
      // 实际应用中，调用API提交评论
      const commentData = {
        postId: post.id,
        content: comment,
        // 用户ID实际应从登录会话中获取
        userId: 1
      };
      
      const response = await commentApi.createComment(commentData);
      
      if (response && response.data) {
        // 添加新评论到列表
        setComments([...comments, response.data]);
        // 清空评论框
        setComment('');
      }
    } catch (error) {
      console.error('提交评论失败:', error);
    } finally {
      setSubmittingComment(false);
    }
  };
  
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
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // 渲染加载状态
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  // 文章不存在
  if (!post) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">找不到您请求的文章内容</p>
        <Link href="/blog" className="btn-primary bg-indigo-600 hover:bg-indigo-700">
          返回博客列表
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-content min-h-screen">
      {/* 返回按钮 */}
      <div className="bg-gray-50 dark:bg-card py-4 sticky top-0 z-20 shadow-sm">
        <div className="container-custom">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <FaArrowLeft className="mr-2" /> 返回
          </button>
        </div>
      </div>
      
      {/* 文章头部 */}
      <header className="pt-8 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>
            
            {/* 作者和日期 */}
            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center mr-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 overflow-hidden mr-3">
                  {post.author?.avatarUrl ? (
                    <Image 
                      src={post.author.avatarUrl}
                      alt={post.author?.name || '作者'}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                      {post.author?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{post.author?.name || '匿名用户'}</p>
                  <p className="text-sm">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              
              {/* 阅读时间估计 */}
              <div className="text-sm">
                预计阅读时间: {Math.max(1, Math.ceil((post.content?.length || 0) / 800))} 分钟
              </div>
            </div>
            
            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags && post.tags.map((tag: any) => (
                <Link key={tag.id} href={`/blog?tag=${tag.name}`}>
                  <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer">
                    <FaTag className="inline mr-1 text-xs" /> {tag.name}
                  </span>
                </Link>
              ))}
            </div>
            
            {/* 封面图片 */}
            <div className="relative w-full h-[40vh] min-h-[300px] mb-8 rounded-xl overflow-hidden">
              <Image
                src={post.coverImageUrl || '/images/placeholder.jpg'}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
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
                <div className="mb-8 text-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border-l-4 border-indigo-500">
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
                  className="prose prose-lg dark:prose-invert prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-lg max-w-none mb-12"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* 交互按钮 */}
                <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 dark:border-gray-800 mb-8">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        liked 
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      <FaHeart /> {liked ? '已点赞' : '点赞'} ({post.likeCount || 0})
                    </button>
                    <button 
                      onClick={() => setBookmarked(!bookmarked)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        bookmarked 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <FaBookmark /> {bookmarked ? '已收藏' : '收藏'}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                    >
                      <FaShare /> 分享
                    </button>
                    
                    {/* 分享选项 */}
                    {showShareOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                        <ul className="py-2">
                          <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">微信</li>
                          <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">微博</li>
                          <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">QQ</li>
                          <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">复制链接</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 评论区 */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <FaComment className="mr-2" /> 评论 ({comments.length})
                  </h3>
                  
                  {/* 评论表单 */}
                  <form onSubmit={handleCommentSubmit} className="mb-8">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="分享你的想法..."
                      className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white mb-4 min-h-[100px]"
                    />
                    <button 
                      type="submit"
                      disabled={submittingComment || !comment.trim()}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? '提交中...' : '发表评论'}
                    </button>
                  </form>
                  
                  {/* 评论列表 */}
                  <div className="space-y-6">
                    {comments.length > 0 ? (
                      comments.map((comment: any) => (
                        <div key={comment.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 overflow-hidden mr-3 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                              {comment.user?.avatarUrl ? (
                                <Image 
                                  src={comment.user.avatarUrl}
                                  alt={comment.user?.name || '用户'}
                                  width={32}
                                  height={32}
                                />
                              ) : (
                                comment.user?.name?.charAt(0) || 'U'
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{comment.user?.name || '匿名用户'}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">还没有评论，来发表第一条评论吧！</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 右侧相关文章 */}
            <div className="w-full lg:w-1/4">
              <div className="sticky top-24">
                <h3 className="text-xl font-bold mb-6">相关文章</h3>
                
                {relatedPosts.length > 0 ? (
                  <div className="space-y-6">
                    {relatedPosts.map((related: any) => (
                      <Link key={related.id} href={`/blog/${related.id}`}>
                        <div className="group">
                          <div className="relative h-40 overflow-hidden rounded-lg mb-3">
                            <Image
                              src={related.coverImageUrl || '/images/placeholder.jpg'}
                              alt={related.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <h4 className="font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">{related.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{related.summary}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">暂无相关文章</p>
                )}
                
                {/* 订阅区 */}
                <div className="mt-10 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <h4 className="font-bold text-lg mb-3">订阅更新</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    输入您的邮箱地址，获取最新文章通知。
                  </p>
                  <form className="space-y-3">
                    <input 
                      type="email" 
                      placeholder="您的邮箱地址" 
                      className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                    />
                    <button 
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                    >
                      订阅
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 