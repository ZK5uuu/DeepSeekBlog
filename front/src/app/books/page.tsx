'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaStar, FaSearch, FaFilter, FaBook, FaRegClock, FaUser, FaFlag } from 'react-icons/fa';
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
  isFlagged?: boolean;
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
  show: { y: 0, opacity: 1 }
};

// BooksPage 组件： 这是整个页面的主组件，包含了所有的状态管理和子组件。
export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year'>('rating');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
  const [flaggedBooks, setFlaggedBooks] = useState<number[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  
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
            setAllBooks(response.data);
          } else {
            // 如果API不可用，使用模拟数据
            setAllBooks(mockBooks);
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
            setFeaturedBook(featuredResponse.data);
          } else {
            // 使用评分最高的图书作为精选
            const featured = mockBooks.reduce((prev, current) => 
              prev.rating > current.rating ? prev : current
            );
            setFeaturedBook(featured);
          }
        } catch (error) {
          console.log('API不可用，使用模拟数据', error);
          // 使用模拟数据
          setAllBooks(mockBooks);
          const extractedGenres = Array.from(new Set(mockBooks.flatMap(book => book.genre)));
          setGenres(extractedGenres);
          const featured = mockBooks.reduce((prev, current) => 
            prev.rating > current.rating ? prev : current
          );
          setFeaturedBook(featured);
        }
        
        // 加载已标记的图书
        const savedFlags = localStorage.getItem('flaggedBooks');
        if (savedFlags) {
          setFlaggedBooks(JSON.parse(savedFlags));
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
    }
    
    // 添加标记状态
    result = result.map(book => ({
      ...book,
      isFlagged: flaggedBooks.includes(book.id)
    }));
    
    setFilteredBooks(result);
  }, [searchTerm, selectedGenre, sortBy, allBooks, flaggedBooks]);
  
  // handleFlag 函数 - 标记图书
  // 这个函数用于处理用户标记或取消标记图书的操作。它会更新 flaggedBooks 状态并将结果保存到本地存储中。
  const handleFlag = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let newFlaggedBooks;
    if (flaggedBooks.includes(id)) {
      newFlaggedBooks = flaggedBooks.filter(bookId => bookId !== id);
    } else {
      newFlaggedBooks = [...flaggedBooks, id];
    }
    
    setFlaggedBooks(newFlaggedBooks);
    localStorage.setItem('flaggedBooks', JSON.stringify(newFlaggedBooks));
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortBy('rating');
  };
  
  // 仅显示已标记图书
  const showOnlyFlagged = () => {
    if (flaggedBooks.length > 0) {
      const flaggedOnlyBooks = allBooks.filter(book => 
        flaggedBooks.includes(book.id)
      ).map(book => ({
        ...book,
        isFlagged: true
      }));
      setFilteredBooks(flaggedOnlyBooks);
    }
  };




  // return 返回的 JSX 结构被 React 用来创建虚拟 DOM。
  // React 比较新旧虚拟 DOM，计算出需要更新的部分。

  //   用户与页面交互（如搜索、筛选），可能触发组件的重新渲染。 
  //   每次重新渲染，都会再次执行到 return 语句，生成新的 JSX 结构。
  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 英雄区域 */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        {/* 背景图 */}
        <div className="absolute inset-0 z-0">
          {featuredBook ? (
            <Image
              src={featuredBook.cover}
              alt="图书背景"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-yellow-800 to-amber-600"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        {/* 内容 */}
        <div className="container-custom relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">探索优质图书</h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 text-white/80">
            发现来自不同领域的优质图书，开启阅读之旅。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {featuredBook ? (
              <Link href={`/books/${featuredBook.id}`} className="btn-primary bg-amber-600 hover:bg-amber-700">
                推荐：{featuredBook.title}
              </Link>
            ) : (
              <button className="btn-primary bg-amber-600 hover:bg-amber-700 opacity-50 cursor-not-allowed">
                暂无推荐图书
              </button>
            )}
            
            <button 
              onClick={() => document.getElementById('book-list')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary border-white/30 hover:bg-white/10"
            >
              浏览所有图书
            </button>
          </div>
        </div>
      </section>

      {/* 搜索和筛选区域 */}
      <section className="py-12 bg-gray-50 dark:bg-card sticky top-0 z-20" id="book-list">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <h2 className="section-title mb-0">图书列表</h2>

            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-60">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索图书..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-content focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 outline-none"
                />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center"
              >
                <FaFilter className="mr-2" /> 筛选
              </button>
            </div>
          </div>
          
          {/* 筛选选项 */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center">
              {/* 类型筛选 */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">类型:</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedGenre('')}
                    className={`px-3 py-1 rounded-full text-sm ${selectedGenre === '' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    全部
                  </button>
                  {genres.map(genre => (
                    <button 
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm ${selectedGenre === genre ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {genreMapping[genre]?.icon || ''} {genre}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 排序选项 */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">排序:</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSortBy('rating')}
                    className={`px-3 py-1 rounded-full text-sm ${sortBy === 'rating' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <FaStar className="inline mr-1" /> 评分
                  </button>
                  <button 
                    onClick={() => setSortBy('year')}
                    className={`px-3 py-1 rounded-full text-sm ${sortBy === 'year' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <FaRegClock className="inline mr-1" /> 年份
                  </button>
                </div>
              </div>
              
              {/* 已标记图书筛选 */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">已标记:</span>
                <button 
                  onClick={showOnlyFlagged}
                  disabled={flaggedBooks.length === 0}
                  className={`px-3 py-1 rounded-full text-sm ${
                    flaggedBooks.length === 0 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-amber-100 dark:hover:bg-amber-900/20'
                  }`}
                >
                  <FaFlag className="inline mr-1" /> 已标记 ({flaggedBooks.length})
                </button>
              </div>
              
              {/* 重置按钮 */}
              {(searchTerm || selectedGenre || sortBy !== 'rating') && (
                <button 
                  onClick={resetFilters}
                  className="text-amber-600 dark:text-amber-400 text-sm hover:underline ml-auto"
                >
                  重置所有筛选
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 图书列表 */}
      <section className="py-16 bg-white dark:bg-content">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">正在加载图书数据...</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredBooks.map(book => (
                <motion.div key={book.id} variants={item}>
                  <Link href={`/books/${book.id}`}>
                    <div className="card overflow-hidden h-full flex flex-col group">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={book.cover}
                          alt={book.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-white">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span>{book.rating.toFixed(1)}</span>
                              </div>
                              <span className="text-sm text-white">{book.year}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 标记图标 */}
                        <button
                          onClick={(e) => handleFlag(book.id, e)}
                          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                            book.isFlagged 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/80 text-gray-600 hover:bg-red-100'
                          }`}
                        >
                          <FaFlag className={book.isFlagged ? 'text-white' : 'text-gray-600'} />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{book.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{book.author} · {book.year}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {book.genre.map(g => (
                            <span 
                              key={g} 
                              className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {genreMapping[g]?.icon || ''} {g}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{book.description}</p>
                        <div className="flex items-center justify-between mt-auto text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <FaBook className="mr-1" />
                            {book.pages}页
                          </span>
                          <span>{book.publisher}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">暂无图书数据</p>
              {(searchTerm || selectedGenre) ? (
                <p className="mt-2 text-gray-400 dark:text-gray-500">请尝试调整筛选条件</p>
              ) : (
                <p className="mt-2 text-gray-400 dark:text-gray-500">请从数据库获取数据或添加图书</p>
              )}
              {(searchTerm || selectedGenre) && (
                <button 
                  onClick={resetFilters}
                  className="btn-primary bg-amber-600 hover:bg-amber-700 mt-4"
                >
                  重置筛选条件
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 