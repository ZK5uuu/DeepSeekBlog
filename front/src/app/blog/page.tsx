'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaCalendarAlt, FaUser, FaTag, FaPen } from 'react-icons/fa';

// 模拟博客数据
const blogData = [
  {
    id: 1,
    title: '深度学习如何改变我们的阅读方式',
    author: '张研究',
    date: '2023-11-05',
    cover: 'https://images.unsplash.com/photo-1546146830-2cca9512c68e?q=80&w=600',
    summary: 'AI技术正在改变我们获取信息和阅读的方式，本文探讨了深度学习模型如何帮助我们更高效地处理和理解大量文本信息。',
    tags: ['人工智能', '深度学习', '阅读'],
    contentPreview: '随着大型语言模型的发展，我们处理信息的方式正在发生根本性的变化...'
  },
  {
    id: 2,
    title: '电影《奥本海默》中的科学与道德困境',
    author: '李影评',
    date: '2023-10-18',
    cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600',
    summary: '克里斯托弗·诺兰的《奥本海默》不仅仅是一部传记片，更是对科学责任与道德困境的深刻探讨。',
    tags: ['电影评论', '科学伦理', '历史'],
    contentPreview: '罗伯特·奥本海默被称为"原子弹之父"，他的故事充满了科学成就与道德挣扎...'
  },
  {
    id: 3,
    title: '音乐流媒体如何改变了音乐产业',
    author: '王音乐',
    date: '2023-09-22',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600',
    summary: '从实体唱片到数字下载再到流媒体订阅，音乐产业在过去二十年经历了巨大变革。',
    tags: ['音乐', '科技', '产业分析'],
    contentPreview: '流媒体平台如Spotify和Apple Music的兴起彻底改变了音乐的制作、分发和消费方式...'
  },
  {
    id: 4,
    title: '读《百年孤独》：现实与魔幻的交织',
    author: '赵书评',
    date: '2023-08-15',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600',
    summary: '加西亚·马尔克斯的代表作《百年孤独》如何通过魔幻现实主义手法展现拉丁美洲的历史与文化。',
    tags: ['文学评论', '魔幻现实主义', '经典阅读'],
    contentPreview: '《百年孤独》讲述了布恩迪亚家族七代人的故事，通过家族兴衰折射出哥伦比亚乃至整个拉丁美洲的历史...'
  }
];

// 标签数据
const popularTags = [
  '人工智能', '文学评论', '电影', '音乐', '科技', '历史', '哲学', '科学', '艺术', '社会'
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredBlogs, setFilteredBlogs] = useState(blogData);

  // 处理搜索和标签筛选
  useEffect(() => {
    let result = [...blogData];
    
    // 按搜索词筛选
    if (searchTerm) {
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 按标签筛选
    if (selectedTag) {
      result = result.filter(blog => blog.tags.includes(selectedTag));
    }
    
    setFilteredBlogs(result);
  }, [searchTerm, selectedTag]);

  // 重置筛选器
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTag(null);
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
              {popularTags.slice(0, 6).map(tag => (
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <Link key={blog.id} href={`/blog/${blog.id}`}>
                  <motion.article 
                    className="bg-white dark:bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-52">
                      <Image
                        src={blog.cover}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center mr-4">
                          <FaUser className="mr-1" /> {blog.author}
                        </span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" /> {blog.date}
                        </span>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{blog.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{blog.summary}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedTag(tag);
                            }}
                          >
                            <FaTag className="inline mr-1 text-xs" /> {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">继续阅读 →</div>
                    </div>
                  </motion.article>
                </Link>
              ))
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
        </div>
      </section>

      {/* 标签云 */}
      <section className="py-12 bg-gray-50 dark:bg-card">
        <div className="container-custom">
          <h2 className="section-title mb-8">探索更多标签</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {popularTags.map(tag => (
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