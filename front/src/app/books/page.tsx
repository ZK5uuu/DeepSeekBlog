'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaSearch, FaBookOpen, FaTimes, FaSort, FaUser } from 'react-icons/fa';

// 书籍数据
const booksData = [
  {
    id: 1,
    title: '未来简史',
    author: '尤瓦尔·赫拉利',
    year: 2017,
    cover: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?q=80&w=600',
    description: '探索人类未来可能面临的挑战和机遇，深入分析技术发展对人类社会的影响。',
    rating: 4.7,
    genre: ['历史', '哲学', '科技'],
    previewUrl: 'https://book.douban.com/subject/26943161/'
  },
  {
    id: 2,
    title: '活着',
    author: '余华',
    year: 1993,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600',
    description: '讲述了农村人福贵悲惨的人生遭遇，深刻揭示了命运的无常与生活的真谛。',
    rating: 4.9,
    genre: ['小说', '文学', '中国现代'],
    previewUrl: 'https://book.douban.com/subject/4913064/'
  },
  {
    id: 3,
    title: '人工智能简史',
    author: '尼克',
    year: 2019,
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600',
    description: '从图灵测试到深度学习，全面介绍人工智能的发展历程、技术原理与未来前景。',
    rating: 4.5,
    genre: ['科技', '计算机', '科普'],
    previewUrl: 'https://book.douban.com/subject/34836531/'
  },
  {
    id: 4,
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    year: 1967,
    cover: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600',
    description: '讲述了布恩迪亚家族七代人的传奇故事，是魔幻现实主义文学的代表作。',
    rating: 4.8,
    genre: ['小说', '魔幻现实主义', '外国文学'],
    previewUrl: 'https://book.douban.com/subject/6082808/'
  },
  {
    id: 5,
    title: '设计心理学',
    author: '唐纳德·诺曼',
    year: 2015,
    cover: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600',
    description: '探讨设计与人类心理的关系，解析如何创造出符合用户认知与情感需求的产品。',
    rating: 4.6,
    genre: ['设计', '心理学', '科技'],
    previewUrl: 'https://book.douban.com/subject/26742341/'
  },
  {
    id: 6,
    title: '三体',
    author: '刘慈欣',
    year: 2008,
    cover: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=600',
    description: '描绘了人类文明与三体文明的惊心动魄的遭遇，展现宏大的宇宙想象。',
    rating: 4.9,
    genre: ['科幻', '小说', '中国文学'],
    previewUrl: 'https://book.douban.com/subject/2567698/'
  }
];

// 获取所有唯一的书籍类型
const allGenres = Array.from(new Set(booksData.flatMap(book => book.genre)));

// 创建类型映射（用于路由）
const genreMapping: Record<string, { en: string, icon: string }> = {
  '历史': { en: 'history', icon: '📜' },
  '哲学': { en: 'philosophy', icon: '🧠' },
  '科技': { en: 'technology', icon: '💻' },
  '小说': { en: 'fiction', icon: '📚' },
  '文学': { en: 'literature', icon: '📖' },
  '中国现代': { en: 'modern-chinese', icon: '🇨🇳' },
  '计算机': { en: 'computer', icon: '🖥️' },
  '科普': { en: 'popular-science', icon: '🔬' },
  '魔幻现实主义': { en: 'magical-realism', icon: '✨' },
  '外国文学': { en: 'foreign-literature', icon: '🌍' },
  '设计': { en: 'design', icon: '🎨' },
  '心理学': { en: 'psychology', icon: '🧩' },
  '科幻': { en: 'science-fiction', icon: '🚀' },
  '中国文学': { en: 'chinese-literature', icon: '🏮' }
};

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'rating' | 'year'>('rating');
  const [filteredBooks, setFilteredBooks] = useState(booksData);

  // 处理搜索和筛选
  useEffect(() => {
    let result = [...booksData];
    
    // 按搜索词筛选
    if (searchTerm) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 按类型筛选
    if (selectedGenre) {
      result = result.filter(book => book.genre.includes(selectedGenre));
    }
    
    // 排序
    result.sort((a, b) => {
      if (sortOption === 'rating') {
        return b.rating - a.rating;
      } else {
        return b.year - a.year;
      }
    });
    
    setFilteredBooks(result);
  }, [searchTerm, selectedGenre, sortOption]);

  // 重置筛选器
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre(null);
    setSortOption('rating');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 英雄区域 */}
      <section className="hero-section relative bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-900 dark:to-gray-900 py-24 lg:py-32 text-white">
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">发现好书，拓展视野</h1>
            <p className="text-xl text-white/90 mb-8">
              探索精选书籍，获取新知识与灵感。从经典名著到前沿科技，总有一本适合你。
            </p>
            <div className="flex flex-wrap gap-3">
              {['小说', '科技', '哲学'].map(genre => (
                <button 
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md backdrop-blur-sm transition-colors duration-300"
                >
                  {genreMapping[genre]?.icon} {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -right-5 -bottom-5 w-1/2 h-1/2 rotate-12 bg-blue-300 rounded-3xl"></div>
          <div className="absolute right-1/4 top-1/4 w-1/3 h-1/3 -rotate-12 bg-blue-500 rounded-3xl"></div>
          <div className="absolute left-1/4 bottom-1/4 w-1/4 h-1/4 rotate-45 bg-blue-400 rounded-3xl"></div>
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
                placeholder="搜索书名或作者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-content text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all outline-none"
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

            <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
              {/* 分类筛选 */}
              <div className="dropdown-container group relative inline-block">
                <button className="btn-secondary inline-flex items-center">
                  {selectedGenre ? `${genreMapping[selectedGenre]?.icon || '📚'} ${selectedGenre}` : '📚 所有类型'}
                  <span className="ml-1">▼</span>
                </button>
                <div className="dropdown-menu hidden group-hover:block absolute left-0 mt-1 w-48 bg-white dark:bg-card rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  <div 
                    className={`px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${!selectedGenre ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : ''}`}
                    onClick={() => setSelectedGenre(null)}
                  >
                    📚 所有类型
                  </div>
                  {allGenres.map(genre => (
                    <div 
                      key={genre}
                      className={`px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${selectedGenre === genre ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : ''}`}
                      onClick={() => setSelectedGenre(genre)}
                    >
                      {genreMapping[genre]?.icon || '📚'} {genre}
                    </div>
                  ))}
                </div>
              </div>

              {/* 排序选项 */}
              <div className="dropdown-container group relative inline-block">
                <button className="btn-secondary inline-flex items-center">
                  <FaSort className="mr-2" />
                  {sortOption === 'rating' ? '评分排序' : '出版年份'}
                  <span className="ml-1">▼</span>
                </button>
                <div className="dropdown-menu hidden group-hover:block absolute left-0 mt-1 w-36 bg-white dark:bg-card rounded-lg shadow-lg z-10">
                  <div 
                    className={`px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${sortOption === 'rating' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : ''}`}
                    onClick={() => setSortOption('rating')}
                  >
                    <FaStar className="inline mr-2" /> 评分排序
                  </div>
                  <div 
                    className={`px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${sortOption === 'year' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium' : ''}`}
                    onClick={() => setSortOption('year')}
                  >
                    <FaSort className="inline mr-2" /> 出版年份
                  </div>
                </div>
              </div>

              {/* 重置按钮 */}
              {(searchTerm || selectedGenre || sortOption !== 'rating') && (
                <button 
                  onClick={resetFilters}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center"
                >
                  <FaTimes className="mr-1" /> 重置筛选
                </button>
              )}
            </div>
          </div>

          {/* 筛选结果信息 */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredBooks.length > 0 
              ? `找到 ${filteredBooks.length} 本${selectedGenre ? selectedGenre : ''}书籍` 
              : '没有找到符合条件的书籍'}
          </div>
        </div>
      </section>

      {/* 书籍列表 */}
      <section className="py-12">
        <div className="container-custom">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map(book => (
                <Link key={book.id} href={`/books/${book.id}`}>
                  <motion.div 
                    className="bg-white dark:bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-52 w-full">
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="absolute top-0 right-0 p-2">
                        <span className="text-xs px-2 py-1 bg-blue-600 rounded text-white">
                          {book.year}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{book.rating.toFixed(1)}</span>
                          </div>
                          {book.previewUrl && (
                            <a 
                              href={book.previewUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center text-white bg-green-600 rounded-full px-2 py-1 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaBookOpen className="mr-1" /> 预览
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{book.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 flex items-center">
                        <FaUser className="mr-1 text-blue-500" /> {book.author}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-1">{book.description}</p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {book.genre.map(g => (
                          <Link key={g} href={`/books/genre/${genreMapping[g]?.en || g}`} 
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                          >
                            {genreMapping[g]?.icon || '📚'} {g}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">没有找到符合条件的书籍</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">请尝试调整搜索条件或浏览其他类别。</p>
              <button 
                onClick={resetFilters}
                className="btn-primary bg-blue-600 hover:bg-blue-700"
              >
                查看所有书籍
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 每周推荐 */}
      <section className="py-12 bg-gray-50 dark:bg-card">
        <div className="container-custom">
          <h2 className="section-title mb-8">每周推荐</h2>
          <motion.div 
            className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative h-64 md:h-auto">
                <Image
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600"
                  alt="每周推荐书籍"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6 md:w-2/3 flex flex-col">
                <span className="text-blue-700 dark:text-blue-400 font-medium mb-2">每周精选</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">原则</h3>
                <div className="mb-2 flex items-center">
                  <span className="text-gray-700 dark:text-gray-300 text-sm mr-3">
                    <FaUser className="inline mr-1" /> 瑞·达利欧
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-400 text-sm flex items-center">
                    <FaStar className="mr-1" /> 4.8
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 flex-1">
                  桥水基金创始人分享其成功的生活和工作原则，帮助读者建立自己的决策框架，实现个人和职业的成长。通过透明的沟通和基于证据的决策，打造高效团队和组织。
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    🧠 哲学
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    💼 管理
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    💡 自我提升
                  </span>
                </div>
                <Link href="/books/7" className="btn-primary bg-blue-600 hover:bg-blue-700 self-start">
                  查看详情
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">订阅每周书评</h2>
            <p className="text-gray-300 mb-8">
              及时获取最新书评、阅读推荐和独家内容，每周直接发送到您的邮箱。
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input 
                type="email" 
                placeholder="输入您的邮箱地址" 
                className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-r-lg font-medium transition-colors duration-300">
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