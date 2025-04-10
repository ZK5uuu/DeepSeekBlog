'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaCalendarAlt, FaUser, FaTag, FaPen } from 'react-icons/fa';
import { postApi, tagApi } from '../api/services/blogService';

// 标签数据
const popularTags: string[] = [];

// 动画配置
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载博客和标签数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取博客列表
        const postsResponse = await postApi.getPostList({});
        setAllBlogs(postsResponse.data || []);
        setFilteredBlogs(postsResponse.data || []);
        
        // 获取热门标签
        const tagsResponse = await tagApi.getPopularTags();
        if (tagsResponse.data && tagsResponse.data.length > 0) {
          const tagNames = tagsResponse.data.map((tag: any) => tag.name);
          setTags(tagNames);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理搜索和标签筛选
  useEffect(() => {
    if (!allBlogs.length) return;
    
    let result = [...allBlogs];
    
    // 按搜索词筛选
    if (searchTerm) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.author?.name && blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 按标签筛选
    if (selectedTag) {
      result = result.filter(blog => 
        blog.tags && blog.tags.some((tag: any) => 
          tag.name === selectedTag
        )
      );
    }
    
    setFilteredBlogs(result);
  }, [searchTerm, selectedTag, allBlogs]);

  // 重置筛选器
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTag(null);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 博客页面标题区域 */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">博客</h1>
            <p className="text-xl text-white/90 mb-8">
              探索我们的观点、见解与分享。从书籍、电影到音乐，我们记录思考的点滴。
            </p>
            <Link href="/blog/create">
              <span className="btn-primary inline-flex items-center bg-white text-indigo-600 hover:bg-indigo-100 px-6 py-3">
                <FaPen className="mr-2" /> 写博客
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 搜索和筛选区域 */}
      <section className="py-8 bg-gray-50 dark:bg-card sticky top-16 z-20 shadow-sm">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* 搜索框 */}
            <div className="relative w-full md:w-auto flex-1 max-w-md">
              <input
                type="text"
                placeholder="搜索博客内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-content text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent transition-all outline-none"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* 标签筛选 */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {tags.slice(0, 6).map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-sm px-3 py-1 rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
              
              {/* 重置按钮 */}
              {(searchTerm || selectedTag) && (
                <button 
                  onClick={resetFilters}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm flex items-center"
                >
                  <FaTimes className="mr-1" /> 重置筛选
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 博客列表 */}
      <section className="py-12">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">正在加载博客数据...</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredBlogs.map(blog => (
                <Link key={blog.id} href={`/blog/${blog.id}`}>
                  <motion.article 
                    className="bg-white dark:bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
                    whileHover={{ y: -5 }}
                    variants={item}
                  >
                    <div className="relative h-52">
                      <Image
                        src={blog.coverImageUrl || '/images/placeholder.jpg'}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center mr-4">
                          <FaUser className="mr-1" /> {blog.author?.name || '匿名'}
                        </span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" /> {formatDate(blog.createdAt)}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{blog.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{blog.summary}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags && blog.tags.map((tag: any) => (
                          <span 
                            key={tag.id} 
                            className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedTag(tag.name);
                            }}
                          >
                            <FaTag className="inline mr-1 text-xs" /> {tag.name}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">继续阅读 →</div>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </motion.div>
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">没有找到符合条件的博客</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">请尝试调整搜索条件或浏览其他标签。</p>
              <button 
                onClick={resetFilters}
                className="btn-primary bg-indigo-600 hover:bg-indigo-700"
              >
                查看所有博客
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 标签云 */}
      <section className="py-12 bg-gray-50 dark:bg-card">
        <div className="container-custom">
          <h2 className="section-title mb-8">探索更多标签</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-content hover:bg-indigo-100 dark:hover:bg-indigo-900/30 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">订阅我们的博客</h2>
            <p className="text-gray-300 mb-8">
              第一时间获取最新博客内容和独家见解，直接发送到您的邮箱。
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input 
                type="email" 
                placeholder="输入您的邮箱地址" 
                className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-r-lg font-medium transition-colors duration-300">
                订阅
              </button>
            </div>
            <p className="text-xs text-gray-400">
              我们尊重您的隐私，您可以随时取消订阅。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 