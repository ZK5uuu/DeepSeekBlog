'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaSearch, FaFilter, FaRegClock, FaHeadphones, FaMusic, FaFlag } from 'react-icons/fa';
import { musicApi, mockMusic, genreMapping as importedGenreMapping } from '../api/services/musicService';

// 类型定义
interface Music {
  id: number;
  title: string;
  artist: string;
  year: number;
  cover: string;
  description: string;
  rating: number;
  genre: string[];
  sampleUrl: string;
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

export default function MusicPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year'>('rating');
  const [filteredMusic, setFilteredMusic] = useState<Music[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);
  const [featuredMusic, setFeaturedMusic] = useState<Music | null>(null);
  const [flaggedMusic, setFlaggedMusic] = useState<number[]>([]);
  const [allMusic, setAllMusic] = useState<Music[]>([]);
  
  // 加载音乐数据
  useEffect(() => {
    const fetchMusic = async () => {
      try {
        setLoading(true);
        
        // 尝试从API获取数据
        try {
          // 获取所有音乐
          const response = await musicApi.getMusicList({});
          if (response && response.data) {
            setAllMusic(response.data);
          } else {
            // 如果API不可用，使用模拟数据
            setAllMusic(mockMusic);
          }
          
          // 获取音乐类型
          const genreResponse = await musicApi.getAllGenres();
          if (genreResponse && genreResponse.data) {
            setGenres(genreResponse.data);
          } else {
            // 使用从模拟数据中提取的类型
            const extractedGenres = Array.from(new Set(mockMusic.flatMap(music => music.genre)));
            setGenres(extractedGenres);
          }
          
          // 获取精选音乐
          const featuredResponse = await musicApi.getFeaturedMusic();
          if (featuredResponse && featuredResponse.data) {
            setFeaturedMusic(featuredResponse.data);
          } else {
            // 使用评分最高的音乐作为精选
            const featured = mockMusic.reduce((prev, current) => 
              prev.rating > current.rating ? prev : current
            );
            setFeaturedMusic(featured);
          }
        } catch (error) {
          console.log('API不可用，使用模拟数据', error);
          // 使用模拟数据
          setAllMusic(mockMusic);
          const extractedGenres = Array.from(new Set(mockMusic.flatMap(music => music.genre)));
          setGenres(extractedGenres);
          const featured = mockMusic.reduce((prev, current) => 
            prev.rating > current.rating ? prev : current
          );
          setFeaturedMusic(featured);
        }
        
        // 加载已标记的音乐
        const savedFlags = localStorage.getItem('flaggedMusic');
        if (savedFlags) {
          setFlaggedMusic(JSON.parse(savedFlags));
        }
      } catch (error) {
        console.error('Error fetching music:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);
  
  // 筛选音乐
  useEffect(() => {
    if (!allMusic.length) return;
    
    let result = [...allMusic];
    
    // 搜索筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(music => 
        music.title.toLowerCase().includes(term) || 
        music.artist.toLowerCase().includes(term) ||
        music.description.toLowerCase().includes(term)
      );
    }
    
    // 类型筛选
    if (selectedGenre) {
      result = result.filter(music => music.genre.includes(selectedGenre));
    }
    
    // 排序
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year') {
      result.sort((a, b) => b.year - a.year);
    }
    
    // 添加标记状态
    result = result.map(music => ({
      ...music,
      isFlagged: flaggedMusic.includes(music.id)
    }));
    
    setFilteredMusic(result);
  }, [searchTerm, selectedGenre, sortBy, allMusic, flaggedMusic]);
  
  // 标记音乐
  const handleFlag = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let newFlaggedMusic;
    if (flaggedMusic.includes(id)) {
      newFlaggedMusic = flaggedMusic.filter(musicId => musicId !== id);
    } else {
      newFlaggedMusic = [...flaggedMusic, id];
    }
    
    setFlaggedMusic(newFlaggedMusic);
    localStorage.setItem('flaggedMusic', JSON.stringify(newFlaggedMusic));
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortBy('rating');
  };
  
  // 仅显示已标记音乐
  const showOnlyFlagged = () => {
    if (flaggedMusic.length > 0) {
      const flaggedOnlyMusic = allMusic.filter(music => 
        flaggedMusic.includes(music.id)
      ).map(music => ({
        ...music,
        isFlagged: true
      }));
      setFilteredMusic(flaggedOnlyMusic);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 英雄区域 */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        {/* 背景图 */}
        <div className="absolute inset-0 z-0">
          {featuredMusic ? (
            <Image
              src={featuredMusic.cover}
              alt="音乐背景"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-900 to-teal-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        {/* 内容 */}
        <div className="container-custom relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">探索优质音乐</h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 text-white/80">
            发现来自不同流派的音乐作品，感受声音的艺术魅力。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {featuredMusic ? (
              <Link href={`/music/${featuredMusic.id}`} className="btn-primary bg-teal-600 hover:bg-teal-700">
                推荐：{featuredMusic.title}
              </Link>
            ) : (
              <button className="btn-primary bg-teal-600 hover:bg-teal-700 opacity-50 cursor-not-allowed">
                暂无推荐音乐
              </button>
            )}
            
            <button 
              onClick={() => document.getElementById('music-list')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary border-white/30 hover:bg-white/10"
            >
              浏览所有音乐
            </button>
          </div>
        </div>
      </section>

      {/* 搜索和筛选区域 */}
      <section className="py-12 bg-gray-50 dark:bg-card sticky top-0 z-20" id="music-list">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <h2 className="section-title mb-0">音乐列表</h2>

            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-60">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索音乐..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-content focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-600 outline-none"
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
                    className={`px-3 py-1 rounded-full text-sm ${selectedGenre === '' ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    全部
                  </button>
                  {genres.map(genre => (
                    <button 
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1 rounded-full text-sm ${selectedGenre === genre ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
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
                    className={`px-3 py-1 rounded-full text-sm ${sortBy === 'rating' ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <FaStar className="inline mr-1" /> 评分
                  </button>
                  <button 
                    onClick={() => setSortBy('year')}
                    className={`px-3 py-1 rounded-full text-sm ${sortBy === 'year' ? 'bg-teal-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                  >
                    <FaRegClock className="inline mr-1" /> 年份
                  </button>
                </div>
              </div>
              
              {/* 已标记音乐筛选 */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">已标记:</span>
                <button 
                  onClick={showOnlyFlagged}
                  disabled={flaggedMusic.length === 0}
                  className={`px-3 py-1 rounded-full text-sm ${
                    flaggedMusic.length === 0 
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/20'
                  }`}
                >
                  <FaFlag className="inline mr-1" /> 已标记 ({flaggedMusic.length})
                </button>
              </div>
              
              {/* 重置按钮 */}
              {(searchTerm || selectedGenre || sortBy !== 'rating') && (
                <button 
                  onClick={resetFilters}
                  className="text-teal-600 dark:text-teal-400 text-sm hover:underline ml-auto"
                >
                  重置所有筛选
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 音乐列表 */}
      <section className="py-16 bg-white dark:bg-content">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">正在加载音乐数据...</p>
            </div>
          ) : filteredMusic.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredMusic.map(music => (
                <motion.div key={music.id} variants={item}>
                  <Link href={`/music/${music.id}`}>
                    <div className="card overflow-hidden h-full flex flex-col group">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={music.cover}
                          alt={music.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center text-white">
                                <FaStar className="text-yellow-400 mr-1" />
                                <span>{music.rating.toFixed(1)}</span>
                              </div>
                              <span className="text-sm text-white">{music.year}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 标记图标 */}
                        <button
                          onClick={(e) => handleFlag(music.id, e)}
                          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                            music.isFlagged 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/80 text-gray-600 hover:bg-red-100'
                          }`}
                        >
                          <FaFlag className={music.isFlagged ? 'text-white' : 'text-gray-600'} />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{music.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{music.artist} · {music.year}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {music.genre.map(g => (
                            <span 
                              key={g} 
                              className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {genreMapping[g]?.icon || ''} {g}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{music.description}</p>
                        <a 
                          href={music.sampleUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-teal-600 dark:text-teal-400 hover:underline mt-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaHeadphones className="mr-1" />
                          试听歌曲
                        </a>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">暂无音乐数据</p>
              {(searchTerm || selectedGenre) ? (
                <p className="mt-2 text-gray-400 dark:text-gray-500">请尝试调整筛选条件</p>
              ) : (
                <p className="mt-2 text-gray-400 dark:text-gray-500">请从数据库获取数据或添加音乐</p>
              )}
              {(searchTerm || selectedGenre) && (
                <button 
                  onClick={resetFilters}
                  className="btn-primary bg-teal-600 hover:bg-teal-700 mt-4"
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