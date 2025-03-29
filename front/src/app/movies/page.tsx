'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaSearch, FaFilter, FaRegClock, FaYoutube, FaPlay } from 'react-icons/fa';

// 使用与其他页面相同的电影数据
const moviesData = [
  {
    id: 1,
    title: '星际穿越',
    director: '克里斯托弗·诺兰',
    year: 2014,
    poster: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=600',
    description: '一部关于爱、时间和宇宙的科幻巨作，探索人类跨越星际旅行的可能性。',
    rating: 4.8,
    genre: ['科幻', '冒险', '剧情'],
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E'
  },
  {
    id: 2,
    title: '肖申克的救赎',
    director: '弗兰克·德拉邦特',
    year: 1994,
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600',
    description: '希望让人自由，讲述了一段不屈服于命运的旅程。',
    rating: 4.9,
    genre: ['剧情', '犯罪'],
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco'
  },
  {
    id: 3,
    title: '千与千寻',
    director: '宫崎骏',
    year: 2001,
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600',
    description: '少女千寻在异世界的奇幻冒险和成长故事。',
    rating: 4.7,
    genre: ['动画', '奇幻', '冒险'],
    trailer: 'https://www.youtube.com/watch?v=ByXuk9QqQkk'
  },
  {
    id: 4,
    title: '黑客帝国',
    director: '沃卓斯基姐妹',
    year: 1999,
    poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600',
    description: '一个关于虚拟现实和人类意识的科幻经典。',
    rating: 4.7,
    genre: ['科幻', '动作'],
    trailer: 'https://www.youtube.com/watch?v=vKQi3bBA1y8'
  },
  {
    id: 5,
    title: '楚门的世界',
    director: '彼得·威尔',
    year: 1998,
    poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600',
    description: '一个关于真实与虚构、自由与控制的寓言。',
    rating: 4.6,
    genre: ['剧情', '科幻', '喜剧'],
    trailer: 'https://www.youtube.com/watch?v=dlnmQbPGuls'
  },
  {
    id: 6,
    title: '盗梦空间',
    director: '克里斯托弗·诺兰',
    year: 2010,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600',
    description: '关于梦境、现实和潜意识的复杂探索。',
    rating: 4.8,
    genre: ['科幻', '动作', '冒险'],
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
  }
];

// 获取所有唯一的电影类型
const allGenres = Array.from(new Set(moviesData.flatMap(movie => movie.genre)));

// 电影类型的中英文映射（用于URL和显示）
const genreMapping: Record<string, { en: string, icon: string }> = {
  '科幻': { en: 'sci-fi', icon: '🚀' },
  '冒险': { en: 'adventure', icon: '🗺️' },
  '剧情': { en: 'drama', icon: '🎭' },
  '犯罪': { en: 'crime', icon: '🔍' },
  '动画': { en: 'animation', icon: '🎬' },
  '奇幻': { en: 'fantasy', icon: '✨' },
  '动作': { en: 'action', icon: '💥' },
  '喜剧': { en: 'comedy', icon: '😄' }
};

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year'>('rating');
  const [filteredMovies, setFilteredMovies] = useState(moviesData);
  const [showFilters, setShowFilters] = useState(false);
  
  // 筛选电影
  useEffect(() => {
    let result = [...moviesData];
    
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
    
    setFilteredMovies(result);
  }, [searchTerm, selectedGenre, sortBy]);

  // 精选电影（评分最高的）
  const featuredMovie = moviesData.reduce((prev, current) => 
    prev.rating > current.rating ? prev : current
  );

  // 动画变体
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

  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 英雄区域 */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        {/* 背景图 */}
        <div className="absolute inset-0 z-0">
          <Image
            src={featuredMovie.poster}
            alt="电影背景"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        {/* 内容 */}
        <div className="container-custom relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">探索精彩电影</h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 text-white/80">
            发现令人惊叹的故事、令人难忘的角色和改变世界的电影。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/movies/${featuredMovie.id}`} className="btn-primary bg-purple-600 hover:bg-purple-700">
              推荐：{featuredMovie.title}
            </Link>
            
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
      <section className="py-12 bg-gray-50 dark:bg-card sticky top-0 z-20">
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
                  className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
              >
                <FaFilter /> <span className="hidden sm:inline">筛选</span>
              </button>
            </div>
          </div>
          
          {/* 筛选选项 */}
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">类型</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedGenre('')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedGenre === '' ? 
                        'bg-purple-600 text-white' : 
                        'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      全部
                    </button>
                    
                    {allGenres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre === selectedGenre ? '' : genre)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          genre === selectedGenre ? 
                          'bg-purple-600 text-white' : 
                          'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {genreMapping[genre]?.icon && <span className="mr-1">{genreMapping[genre].icon}</span>}
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2">排序方式</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy('rating')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        sortBy === 'rating' ? 
                        'bg-purple-600 text-white' : 
                        'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FaStar className="inline mr-1" />
                      评分
                    </button>
                    
                    <button
                      onClick={() => setSortBy('year')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        sortBy === 'year' ? 
                        'bg-purple-600 text-white' : 
                        'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FaRegClock className="inline mr-1" />
                      年份
                    </button>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedGenre('');
                      setSortBy('rating');
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="text-gray-600 dark:text-gray-400">
            找到 {filteredMovies.length} 部电影
            {selectedGenre && <span> • 类型: {selectedGenre}</span>}
            {searchTerm && <span> • 搜索: "{searchTerm}"</span>}
          </div>
        </div>
      </section>

      {/* 电影列表 */}
      <section className="py-12" id="movie-list">
        <div className="container-custom">
          {filteredMovies.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredMovies.map((movie) => (
                <motion.div key={movie.id} variants={item}>
                  <div className="bg-white dark:bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full flex flex-col">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-0 right-0 p-2">
                        <span className="text-xs px-2 py-1 bg-purple-600 rounded text-white">
                          {movie.year}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{movie.rating.toFixed(1)}</span>
                          </div>
                          {movie.trailer && (
                            <a 
                              href={movie.trailer} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center text-white bg-red-600 rounded-full px-2 py-1 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaPlay className="mr-1" /> 预告片
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link href={`/movies/${movie.id}`} className="flex-1 flex flex-col p-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{movie.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{movie.director}</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-1">{movie.description}</p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {movie.genre.map((genre: string) => (
                          <Link 
                            key={genre} 
                            href={`/movies/genre/${genreMapping[genre]?.en || genre}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            {genre}
                          </Link>
                        ))}
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">未找到电影</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">尝试调整您的搜索条件</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('');
                }}
                className="btn-primary bg-purple-600 hover:bg-purple-700"
              >
                查看所有电影
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 电影分类浏览 */}
      <section className="py-12 bg-gray-50 dark:bg-card">
        <div className="container-custom">
          <h2 className="section-title mb-8">按类型浏览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allGenres.map(genre => (
              <Link key={genre} href={`/movies/genre/${genreMapping[genre]?.en || genre}`}>
                <div className="bg-white dark:bg-content p-6 rounded-lg text-center hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 h-full">
                  <div className="text-4xl mb-3">{genreMapping[genre]?.icon || '🎬'}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{genre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {moviesData.filter(m => m.genre.includes(genre)).length}部电影
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 订阅区域 */}
      <section className="py-16 bg-purple-700 dark:bg-purple-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">不错过最新电影资讯</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            订阅我们的通讯，获取每周推荐和电影评论。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="您的邮箱地址"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"
            />
            <button className="px-6 py-3 bg-white text-purple-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              订阅
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 