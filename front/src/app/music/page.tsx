'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaSearch, FaFilter, FaRegClock, FaHeadphones, FaMusic } from 'react-icons/fa';

// 音乐数据
const musicData = [
  {
    id: 1,
    title: '爱爱爱',
    artist: '方大同',
    year: 2007,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600',
    description: '温暖动人的情歌，诠释了爱情最纯粹的状态，方大同标志性的温柔嗓音令人陶醉。',
    rating: 4.8,
    genre: ['R&B', '情歌', '流行'],
    sampleUrl: 'https://music.163.com/song?id=66463'
  },
  {
    id: 2,
    title: '小小的太阳',
    artist: '陶喆',
    year: 2001,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600',
    description: '充满阳光感的正能量歌曲，陶喆以明亮的旋律和积极的歌词传递希望和温暖。',
    rating: 4.9,
    genre: ['流行', '励志', '华语'],
    sampleUrl: 'https://music.163.com/song?id=277822'
  },
  {
    id: 3,
    title: '独家记忆',
    artist: '陶喆',
    year: 2006,
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600',
    description: '深情款款的经典情歌，陶喆以细腻的情感表达和精妙的编曲诠释爱的记忆。',
    rating: 4.7,
    genre: ['流行', '情歌', '华语'],
    sampleUrl: 'https://music.163.com/song?id=277827'
  },
  {
    id: 4,
    title: '黑白灰',
    artist: '方大同',
    year: 2012,
    cover: 'https://images.unsplash.com/photo-1477233534935-f5e6fe7c1159?q=80&w=600',
    description: '融合爵士与R&B元素的都市情歌，方大同以独特的音乐风格展现内心的复杂情感。',
    rating: 4.6,
    genre: ['R&B', '爵士', '都市'],
    sampleUrl: 'https://music.163.com/song?id=22463811'
  },
  {
    id: 5,
    title: '寻找爱的起点',
    artist: '陶喆',
    year: 2004,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600',
    description: '陶喆早期代表作，温暖的旋律和富有共鸣的歌词打动了无数聆听者的心。',
    rating: 4.5,
    genre: ['流行', '情歌', '都市'],
    sampleUrl: 'https://music.163.com/song?id=277814'
  },
  {
    id: 6,
    title: '微凉',
    artist: '方大同',
    year: 2015,
    cover: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600',
    description: '轻柔抒情的都市情歌，方大同以细腻的嗓音和深沉的情感诠释成熟爱情的微妙变化。',
    rating: 4.9,
    genre: ['R&B', '情歌', '都市'],
    sampleUrl: 'https://music.163.com/song?id=29764562'
  }
];

// 获取所有唯一的音乐类型
const allGenres = Array.from(new Set(musicData.flatMap(music => music.genre)));

// 音乐类型的图标映射
const genreMapping: Record<string, { en: string, icon: string }> = {
  '古典': { en: 'classical', icon: '🎻' },
  '交响乐': { en: 'symphony', icon: '🎼' },
  '现代': { en: 'modern', icon: '🎹' },
  '流行': { en: 'pop', icon: '🎤' },
  '民谣': { en: 'folk', icon: '🪕' },
  '抒情': { en: 'lyrical', icon: '🎵' },
  '电子': { en: 'electronic', icon: '🎛️' },
  '实验': { en: 'experimental', icon: '🔊' },
  '氛围': { en: 'ambient', icon: '🌊' },
  '民族': { en: 'ethnic', icon: '🏮' },
  '纯音乐': { en: 'instrumental', icon: '🎶' },
  '舞曲': { en: 'dance', icon: '💃' },
  '经典': { en: 'classic', icon: '📀' },
  'R&B': { en: 'rnb', icon: '🎤' },
  '情歌': { en: 'love', icon: '💖' },
  '励志': { en: 'motivational', icon: '🎶' },
  '华语': { en: 'chinese', icon: '🇨🇳' }
};

export default function MusicPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'year'>('rating');
  const [filteredMusic, setFilteredMusic] = useState(musicData);
  const [showFilters, setShowFilters] = useState(false);
  
  // 筛选音乐
  useEffect(() => {
    let result = [...musicData];
    
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
    
    setFilteredMusic(result);
  }, [searchTerm, selectedGenre, sortBy]);

  // 精选音乐（评分最高的）
  const featuredMusic = musicData.reduce((prev, current) => 
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
            src={featuredMusic.cover}
            alt="音乐背景"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        </div>
        
        {/* 内容 */}
        <div className="container-custom relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">探索优质音乐</h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 text-white/80">
            发现来自不同流派的音乐作品，感受声音的艺术魅力。
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/music/${featuredMusic.id}`} className="btn-primary bg-purple-600 hover:bg-purple-700">
              推荐：{featuredMusic.title}
            </Link>
            
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
      <section className="py-12 bg-gray-50 dark:bg-card sticky top-0 z-20">
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
            找到 {filteredMusic.length} 首音乐
            {selectedGenre && <span> • 类型: {selectedGenre}</span>}
            {searchTerm && <span> • 搜索: "{searchTerm}"</span>}
          </div>
        </div>
      </section>

      {/* 音乐列表 */}
      <section className="py-12" id="music-list">
        <div className="container-custom">
          {filteredMusic.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredMusic.map((music) => (
                <motion.div key={music.id} variants={item}>
                  <div className="bg-white dark:bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full flex flex-col">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={music.cover}
                        alt={music.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-0 right-0 p-2">
                        <span className="text-xs px-2 py-1 bg-purple-600 rounded text-white">
                          {music.year}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-white">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{music.rating.toFixed(1)}</span>
                          </div>
                          {music.sampleUrl && (
                            <a 
                              href={music.sampleUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center text-white bg-green-600 rounded-full px-2 py-1 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaHeadphones className="mr-1" /> 试听
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link href={`/music/${music.id}`} className="flex-1 flex flex-col p-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{music.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{music.artist}</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-1">{music.description}</p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {music.genre.map((genre: string) => (
                          <Link 
                            key={genre} 
                            href={`/music/genre/${genreMapping[genre]?.en || genre}`}
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
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">未找到音乐</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">尝试调整您的搜索条件</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('');
                }}
                className="btn-primary bg-purple-600 hover:bg-purple-700"
              >
                查看所有音乐
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 音乐分类浏览 */}
      <section className="py-12 bg-gray-50 dark:bg-card">
        <div className="container-custom">
          <h2 className="section-title mb-8">按类型浏览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allGenres.map(genre => (
              <Link key={genre} href={`/music/genre/${genreMapping[genre]?.en || genre}`}>
                <div className="bg-white dark:bg-content p-6 rounded-lg text-center hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 h-full">
                  <div className="text-4xl mb-3">{genreMapping[genre]?.icon || '🎵'}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{genre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {musicData.filter(m => m.genre.includes(genre)).length}首音乐
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
          <h2 className="text-3xl font-bold mb-4">不错过最新音乐推荐</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            订阅我们的通讯，获取每周推荐和音乐评论。
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