'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaSearch, FaFilter, FaBook, FaRegClock, FaUser, FaHeart, FaPen, FaPlus } from 'react-icons/fa';
import { bookApi, mockBooks, genreMapping as importedGenreMapping } from '../api/services/bookService';

// 类型定义
interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  cover: string;
  description: string;
  rating: number;
  genre: string[];
  pages: number;
  publisher: string;
  isLiked?: boolean;
  views?: number;
  publishDate?: string;
}

// 定义genreMapping的接口类型，带有字符串索引签名
interface GenreMap {
  [key: string]: { en: string; icon: string };
}

// 使用类型断言确保导入的genreMapping符合GenreMap接口
const genreMapping = importedGenreMapping as GenreMap;

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
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } }
};

// BooksPage 组件： 这是整个页面的主组件，包含了所有的状态管理和子组件。
export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'views'>('rating');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
  const [likedBooks, setLikedBooks] = useState<number[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // useEffect 钩子 - 加载图书数据：

  // 这个 useEffect 在组件挂载时执行，负责从 API 获取图书列表、图书类型和精选图书。
  // 如果 API 不可用，它会使用模拟数据。这个函数为整个页面提供了初始数据。
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // 尝试从API获取数据
        try {
          // 获取所有图书
          const response = await bookApi.getBookList({});
          if (response && response.data) {
            // 为每个图书添加模拟的博客数据
            const enhancedBooks = response.data.map((book: Book) => ({
              ...book,
              views: Math.floor(Math.random() * 1000),
              publishDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }));
            setAllBooks(enhancedBooks);
          } else {
            // 如果API不可用，使用模拟数据
            const enhancedMockBooks = mockBooks.map(book => ({
              ...book,
              views: Math.floor(Math.random() * 1000),
              publishDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }));
            setAllBooks(enhancedMockBooks);
          }
          
          // 获取图书类型
          const genreResponse = await bookApi.getAllGenres();
          if (genreResponse && genreResponse.data) {
            setGenres(genreResponse.data);
          } else {
            // 使用从模拟数据中提取的类型
            const extractedGenres = Array.from(new Set(mockBooks.flatMap(book => book.genre)));
            setGenres(extractedGenres);
          }
          
          // 获取精选图书
          const featuredResponse = await bookApi.getFeaturedBook();
          if (featuredResponse && featuredResponse.data) {
            setFeaturedBook({
              ...featuredResponse.data,
              views: Math.floor(Math.random() * 1000) + 500,
              publishDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
          } else {
            // 使用评分最高的图书作为精选
            const featured = mockBooks.reduce((prev, current) => 
              prev.rating > current.rating ? prev : current
            );
            setFeaturedBook({
              ...featured,
              views: Math.floor(Math.random() * 1000) + 500,
              publishDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
          }
        } catch (error) {
          console.log('API不可用，使用模拟数据', error);
          // 使用模拟数据
          const enhancedMockBooks = mockBooks.map(book => ({
            ...book,
            views: Math.floor(Math.random() * 1000),
            publishDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }));
          setAllBooks(enhancedMockBooks);
          
          const extractedGenres = Array.from(new Set(mockBooks.flatMap(book => book.genre)));
          setGenres(extractedGenres);
          
          const featured = mockBooks.reduce((prev, current) => 
            prev.rating > current.rating ? prev : current
          );
          setFeaturedBook({
            ...featured,
            views: Math.floor(Math.random() * 1000) + 500,
            publishDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
        }
        
        // 加载已喜欢的图书
        const savedLikes = localStorage.getItem('likedBooks');
        if (savedLikes) {
          setLikedBooks(JSON.parse(savedLikes));
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);
  
  // useEffect 钩子 - 筛选图书：
  // 这个 useEffect 负责根据用户的筛选条件（搜索词、类型、排序方式）对图书列表进行筛选和排序。每当相关的状态发生变化时，它都会重新计算筛选后的图书列表。
  useEffect(() => {
    if (!allBooks.length) return;
    
    let result = [...allBooks];
    
    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term) ||
        book.description.toLowerCase().includes(term)
      );
    }
    
    // 类型筛选
    if (selectedGenre) {
      result = result.filter(book => book.genre.includes(selectedGenre));
    }
    
    // 排序
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'views') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    // 添加喜欢状态
    result = result.map(book => ({
      ...book,
      isLiked: likedBooks.includes(book.id)
    }));
    
    setFilteredBooks(result);
  }, [searchTerm, selectedGenre, sortBy, allBooks, likedBooks]);
  
  // handleLike 函数 - 喜欢图书
  // 这个函数用于处理用户喜欢或取消喜欢图书的操作。它会更新 likedBooks 状态并将结果保存到本地存储中。
  const handleLike = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let newLikedBooks;
    if (likedBooks.includes(id)) {
      newLikedBooks = likedBooks.filter(bookId => bookId !== id);
    } else {
      newLikedBooks = [...likedBooks, id];
    }
    
    setLikedBooks(newLikedBooks);
    localStorage.setItem('likedBooks', JSON.stringify(newLikedBooks));
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortBy('rating');
  };
  
  // 仅显示已喜欢图书
  const showOnlyLiked = () => {
    if (likedBooks.length > 0) {
      const likedOnlyBooks = allBooks.filter(book => 
        likedBooks.includes(book.id)
      ).map(book => ({
        ...book,
        isLiked: true
      }));
      setFilteredBooks(likedOnlyBooks);
    }
  };

  // return 返回的 JSX 结构被 React 用来创建虚拟 DOM。
  // React 比较新旧虚拟 DOM，计算出需要更新的部分。

  //   用户与页面交互（如搜索、筛选），可能触发组件的重新渲染。 
  //   每次重新渲染，都会再次执行到 return 语句，生成新的 JSX 结构。
  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 英雄区域 */}
      <motion.section 
        className="relative h-[70vh] min-h-[500px] flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* 背景图 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {featuredBook ? (
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8 }}
              className="w-full h-full"
            >
              <Image
                src={featuredBook.cover}
                alt="图书背景"
                fill
                style={{ objectFit: 'cover' }}
                priority
                className="brightness-50"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-yellow-800 to-amber-600"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/40"></div>
        </div>
        
        {/* 内容 */}
        <div className="container-custom relative z-10 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* 文字介绍 */}
            <motion.div 
              className="md:w-1/2"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                书籍<span className="text-amber-400">阅读</span>笔记
              </h1>
              <p className="text-xl max-w-2xl mb-8 text-white/80">
                记录你的阅读体验，分享文学感悟。每一本书都是一次心灵的旅行。
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 rounded-full text-sm bg-amber-800/50 text-amber-200 border border-amber-700">阅读体验</span>
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-800/50 text-yellow-200 border border-yellow-700">书评分享</span>
                <span className="px-3 py-1 rounded-full text-sm bg-orange-800/50 text-orange-200 border border-orange-700">精彩摘录</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewPostModal(true)}
                  className="btn-primary bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 flex items-center justify-center gap-2"
                >
                  <FaPen /> 写读书笔记
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('book-list')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-secondary border-white/30 hover:bg-white/10"
                >
                  浏览所有笔记
                </motion.button>
              </div>
            </motion.div>
            
            {/* 精选图书卡片 */}
            {featuredBook && (
              <motion.div 
                className="md:w-1/2 flex justify-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative max-w-md">
                  {/* 精选标签 */}
                  <div className="absolute -top-4 -right-4 z-10">
                    <div className="bg-amber-500 text-black font-bold px-4 py-1 rounded-full shadow-lg transform rotate-12">
                      推荐
                    </div>
                  </div>
                  
                  {/* 卡片 */}
                  <motion.div 
                    className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <div className="bg-amber-600 p-2 rounded-full mr-3">
                          <FaBook className="text-white" />
                        </div>
                        <span className="text-amber-300 font-medium">精选读书笔记</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2">{featuredBook.title}</h3>
                      
                      <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
                        <span>{featuredBook.year}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <FaStar className="text-yellow-500 mr-1" /> {featuredBook.rating}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <FaRegClock className="mr-1" /> {featuredBook.publishDate}
                        </span>
                      </div>
                      
                      <p className="text-white/80 mb-4 line-clamp-3">
                        {featuredBook.description}
                      </p>
                      
                      <Link href={`/books/${featuredBook.id}`} className="text-amber-400 hover:text-amber-300 font-medium flex items-center">
                        阅读完整笔记 →
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* 搜索和筛选区域 */}
      <section className="py-8 bg-gray-50 dark:bg-card sticky top-0 z-20" id="book-list">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="section-title mb-0">读书笔记</h2>
              <div className="flex h-6 items-center">
                <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-0.5 text-sm font-medium text-amber-600 dark:text-amber-300">
                  {filteredBooks.length} 篇
                </span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewPostModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-4 py-2 rounded-lg shadow-md"
            >
              <FaPlus /> 写新读书笔记
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* 搜索框 */}
            <div className="relative flex-1 min-w-[260px]">
              <input
                type="text"
                placeholder="搜索读书笔记..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* 类型筛选 */}
            <div className="flex-shrink-0">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              >
                <option value="">所有类型</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            
            {/* 排序选项 */}
            <div className="flex-shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'year' | 'views')}
                className="py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
              >
                <option value="rating">评分排序</option>
                <option value="year">年份排序</option>
                <option value="views">阅读量排序</option>
              </select>
            </div>
            
            {/* 喜欢过滤器 */}
            <button 
              onClick={showOnlyLiked}
              disabled={likedBooks.length === 0}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg border transition ${
                likedBooks.length === 0 
                  ? 'border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                  : 'border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
              }`}
            >
              <FaHeart className={likedBooks.length === 0 ? 'text-gray-400 dark:text-gray-600' : 'text-red-500'} />
              我喜欢的
            </button>
            
            {/* 重置按钮 */}
            {(searchTerm || selectedGenre || sortBy !== 'rating') && (
              <button 
                onClick={resetFilters}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                重置
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 图书列表 */}
      <section ref={containerRef} className="py-12 bg-white dark:bg-content min-h-[50vh]">
        <div className="container-custom">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : filteredBooks.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBooks.map(book => (
                <motion.div 
                  key={book.id}
                  variants={item}
                  layout
                  className="group"
                >
                  <Link href={`/books/${book.id}`}>
                    <motion.article 
                      className="h-full flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-card shadow-md hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -6 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={book.cover}
                          alt={book.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        
                        {/* 类型标签 */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {book.genre.slice(0, 2).map(g => (
                            <span key={g} className="px-2 py-1 rounded-md text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                              {g}
                            </span>
                          ))}
                        </div>
                        
                        {/* 评分标签 */}
                        <div className="absolute top-3 right-3">
                          <span className="flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-500/90 text-white">
                            <FaStar className="mr-1" /> {book.rating}
                          </span>
                        </div>
                        
                        {/* 时间和年份信息 */}
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-xs">
                          <span className="flex items-center bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                            <FaRegClock className="mr-1" /> {book.publishDate}
                          </span>
                          <span className="bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                            {book.year}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{book.title}</h3>
                          <button 
                            onClick={(e) => handleLike(book.id, e)}
                            className="flex-shrink-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500 transition-colors"
                            aria-label={book.isLiked ? "取消喜欢" : "喜欢"}
                          >
                            <FaHeart className={book.isLiked ? "text-red-500" : ""} />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3 flex-1">
                          {book.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                          <span>作者: {book.author}</span>
                          <span className="flex items-center">
                            <FaRegClock className="mr-1" /> {book.views || 0} 阅读
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              variants={fadeIn}
              initial="hidden"
              animate="show"
              className="text-center py-20"
            >
              <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-6">
                <FaSearch size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">未找到读书笔记</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                没有找到符合当前筛选条件的读书笔记。尝试调整筛选条件或创建新的读书笔记。
              </p>
              <button 
                onClick={resetFilters}
                className="btn-primary bg-amber-600 hover:bg-amber-700 mr-4"
              >
                清除筛选条件
              </button>
              <button 
                onClick={() => setShowNewPostModal(true)}
                className="btn-secondary border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
              >
                <FaPlus className="mr-2" /> 写新读书笔记
              </button>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* 写新读书笔记模态框 */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewPostModal(false)}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FaPen className="mr-3 text-amber-600 dark:text-amber-400" /> 写新读书笔记
                </h3>
                <button 
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    书籍标题
                  </label>
                  <input 
                    type="text"
                    placeholder="输入书籍标题..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      作者
                    </label>
                    <input 
                      type="text"
                      placeholder="作者姓名..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      出版年份
                    </label>
                    <input 
                      type="number"
                      placeholder="出版年份..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    类型
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.slice(0, 10).map(genre => (
                      <button 
                        key={genre}
                        className="px-3 py-1 rounded-full text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/50"
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    阅读感受
                  </label>
                  <textarea 
                    rows={6}
                    placeholder="写下你对这本书的感想..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setShowNewPostModal(false)}
                    className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    取消
                  </button>
                  <button 
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white shadow-md"
                  >
                    发布笔记
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 