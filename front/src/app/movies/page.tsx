'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaSearch, FaFilter, FaRegClock, FaYoutube, FaPlay, FaFlag } from 'react-icons/fa';
import { movieApi, mockMovies, genreMapping as importedGenreMapping } from '../api/services/movieService';

// 类型定义
interface Movie {
  id: number;
  title: string;
  director: string;
  year: number;
  poster: string;
  description: string;
  rating: number;
  genre: string[];
  trailer: string;
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

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year'>('rating');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]); 
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [flaggedMovies, setFlaggedMovies] = useState<number[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  
  // 加载电影数据
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // 尝试从API获取数据
        try {
          // 获取所有电影
          const response = await movieApi.getMovieList({});
          if (response && response.data) {
            setAllMovies(response.data);
          } else {
            // 如果API不可用，使用模拟数据
            setAllMovies(mockMovies);
          }
          
          // 获取电影类型
          const genreResponse = await movieApi.getAllGenres();
          if (genreResponse && genreResponse.data) {
            setGenres(genreResponse.data);
          } else {
            // 使用从模拟数据中提取的类型
            const extractedGenres = Array.from(new Set(mockMovies.flatMap(movie => movie.genre)));
            setGenres(extractedGenres);
          }
          
          // 获取精选电影
          const featuredResponse = await movieApi.getFeaturedMovie();
          if (featuredResponse && featuredResponse.data) {
            setFeaturedMovie(featuredResponse.data);
          } else {
            // 使用评分最高的电影作为精选
            const featured = mockMovies.reduce((prev, current) => 
              prev.rating > current.rating ? prev : current
            );
            setFeaturedMovie(featured);
          }
        } catch (error) {
          console.log('API不可用，使用模拟数据', error);
          // 使用模拟数据
          setAllMovies(mockMovies);
          const extractedGenres = Array.from(new Set(mockMovies.flatMap(movie => movie.genre)));
          setGenres(extractedGenres);
          const featured = mockMovies.reduce((prev, current) => 
            prev.rating > current.rating ? prev : current
          );
          setFeaturedMovie(featured);
        }
        
        // 加载已标记的电影
        const savedFlags = localStorage.getItem('flaggedMovies');
        if (savedFlags) {
          setFlaggedMovies(JSON.parse(savedFlags));
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);
  
  // 筛选电影
  useEffect(() => {
    if (!allMovies.length) return;
    
    let result = [...allMovies];
    
    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(term) || 
        movie.director.toLowerCase().includes(term) ||
        movie.description.toLowerCase().includes(term)
      );
    }
    
    // 类型筛选
    if (selectedGenre) {
      result = result.filter(movie => movie.genre.includes(selectedGenre));
    }
    
    // 排序
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year') {
      result.sort((a, b) => b.year - a.year);
    }
    
    // 添加标记状态
    result = result.map(movie => ({
      ...movie,
      isFlagged: flaggedMovies.includes(movie.id)
    }));
    
    setFilteredMovies(result);
  }, [searchTerm, selectedGenre, sortBy, allMovies, flaggedMovies]);
  
  // 标记电影
  const handleFlag = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let newFlaggedMovies;
    if (flaggedMovies.includes(id)) {
      newFlaggedMovies = flaggedMovies.filter(movieId => movieId !== id);
    } else {
      newFlaggedMovies = [...flaggedMovies, id];
    }
    
    setFlaggedMovies(newFlaggedMovies);
    localStorage.setItem('flaggedMovies', JSON.stringify(newFlaggedMovies));
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortBy('rating');
  };

  // 仅显示已标记电影
  const showOnlyFlagged = () => {
    if (flaggedMovies.length > 0) {
      const flaggedOnlyMovies = allMovies.filter(movie => 
        flaggedMovies.includes(movie.id)
      ).map(movie => ({
        ...movie,
        isFlagged: true
      }));
      setFilteredMovies(flaggedOnlyMovies);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 英雄区域 */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        {/* 背景图 */}
        <div className="absolute inset-0 z-0">
          {featuredMovie ? (
            <Image
              src={featuredMovie.poster}
              alt="电影背景"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        {/* 内容 */}
        <div className="container-custom relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">探索精彩电影</h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 text-white/80">
            发现令人惊叹的故事、令人难忘的角色和改变世界的电影。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {featuredMovie ? (
              <Link href={`/movies/${featuredMovie.id}`} className="btn-primary bg-purple-600 hover:bg-purple-700">
                推荐：{featuredMovie.title}
              </Link>
            ) : (
              <button className="btn-primary bg-purple-600 hover:bg-purple-700 opacity-50 cursor-not-allowed">
                暂无推荐电影
              </button>
            )}
            
            <button 
              onClick={() => document.getElementById('movie-list')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary border-white/30 hover:bg-white/10"
            >
              浏览所有电影
            </button>
          </div>
        </div>
      </section>

      {/* 搜索和筛选区域 */}
      <section className="py-12 bg-gray-50 dark:bg-card sticky top-0 z-20" id="movie-list">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <h2 className="section-title mb-0">电影列表</h2>

            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-60">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索电影..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-content focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 outline-none"
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
                    className={`px-3 py-1 rounded-full text-sm ${selectedGenre === '' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    全部
                  </button>
                  {genres.map(genre => (
                    <button 
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm ${selectedGenre === genre ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
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
                    className={`px-3 py-1 rounded-full text-sm ${sortBy === 'rating' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <FaStar className="inline mr-1" /> 评分
                  </button>
                  <button 
                    onClick={() => setSortBy('year')}
                    className={`px-3 py-1 rounded-full text-sm ${sortBy === 'year' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <FaRegClock className="inline mr-1" /> 年份
                  </button>
                </div>
              </div>
              
              {/* 已标记电影筛选 */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">已标记:</span>
                <button 
                  onClick={showOnlyFlagged}
                  disabled={flaggedMovies.length === 0}
                  className={`px-3 py-1 rounded-full text-sm ${
                    flaggedMovies.length === 0 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                  }`}
                >
                  <FaFlag className="inline mr-1" /> 已标记 ({flaggedMovies.length})
                </button>
              </div>
              
              {/* 重置按钮 */}
              {(searchTerm || selectedGenre || sortBy !== 'rating') && (
                <button 
                  onClick={resetFilters}
                  className="text-purple-600 dark:text-purple-400 text-sm hover:underline ml-auto"
                >
                  重置所有筛选
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 电影列表 */}
      <section className="py-16 bg-white dark:bg-content">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">正在加载电影数据...</p>
            </div>
          ) : filteredMovies.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredMovies.map(movie => (
                <motion.div key={movie.id} variants={item}>
                  <Link href={`/movies/${movie.id}`}>
                    <div className="card overflow-hidden h-full flex flex-col group">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={movie.poster}
                          alt={movie.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-white">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span>{movie.rating.toFixed(1)}</span>
                              </div>
                              <span className="text-sm text-white">{movie.year}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 标记图标 */}
                        <button
                          onClick={(e) => handleFlag(movie.id, e)}
                          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                            movie.isFlagged 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/80 text-gray-600 hover:bg-red-100'
                          }`}
                        >
                          <FaFlag className={movie.isFlagged ? 'text-white' : 'text-gray-600'} />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{movie.director} · {movie.year}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {movie.genre.map(g => (
                            <span 
                              key={g} 
                              className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {genreMapping[g]?.icon || ''} {g}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{movie.description}</p>
                        <a 
                          href={movie.trailer} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-purple-600 dark:text-purple-400 hover:underline mt-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaYoutube className="mr-1" />
                          观看预告片
                        </a>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">暂无电影数据</p>
              {(searchTerm || selectedGenre) ? (
                <p className="mt-2 text-gray-400 dark:text-gray-500">请尝试调整筛选条件</p>
              ) : (
                <p className="mt-2 text-gray-400 dark:text-gray-500">请从数据库获取数据或添加电影</p>
              )}
              {(searchTerm || selectedGenre) && (
                <button 
                  onClick={resetFilters}
                  className="btn-primary bg-purple-600 hover:bg-purple-700 mt-4"
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