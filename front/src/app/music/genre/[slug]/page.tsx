'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaArrowLeft, FaHeadphones } from 'react-icons/fa';

// 使用与详情页相同的音乐数据
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
  'R&B': { en: 'rnb', icon: '🎤' },
  '情歌': { en: 'love', icon: '💖' },
  '流行': { en: 'pop', icon: '🎵' },
  '励志': { en: 'motivational', icon: '🎶' },
  '华语': { en: 'chinese', icon: '🇨🇳' },
  '爵士': { en: 'jazz', icon: '🎷' },
  '都市': { en: 'urban', icon: '🏙️' }
};

// 反向映射，从英文映射到中文
const reverseGenreMapping = Object.entries(genreMapping).reduce(
  (acc, [zh, { en }]) => ({ ...acc, [en]: zh }), 
  {} as Record<string, string>
);

export default function MusicGenrePage({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true);
  const [genreZh, setGenreZh] = useState<string>('');
  const [filteredMusic, setFilteredMusic] = useState<any[]>([]);
  const [otherGenres, setOtherGenres] = useState<string[]>([]);

  useEffect(() => {
    const genreSlug = params.slug;
    const genre = reverseGenreMapping[genreSlug];
    
    if (genre) {
      setGenreZh(genre);
      // 查找包含此类型的所有音乐
      const music = musicData.filter(music => music.genre.includes(genre));
      setFilteredMusic(music);
      
      // 获取其他类型以供推荐
      setOtherGenres(allGenres.filter(g => g !== genre).slice(0, 5));
    }
    
    setLoading(false);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-content">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!genreZh) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-content">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">类型未找到</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">抱歉，我们无法找到此音乐类型。</p>
        <Link href="/music">
          <span className="btn-primary inline-flex items-center bg-purple-600 hover:bg-purple-700">
            <FaArrowLeft className="mr-2" /> 返回音乐列表
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 类型头部 */}
      <header className="bg-purple-700 dark:bg-purple-900 text-white py-20">
        <div className="container-custom">
          <Link href="/music" className="text-white/80 hover:text-white transition-colors mb-4 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> 返回音乐列表
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {genreMapping[genreZh]?.icon} {genreZh}音乐
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            探索所有{genreZh}类型的音乐。我们精心筛选了各种{genreZh}作品，满足您的听觉体验。
          </p>
        </div>
      </header>

      {/* 音乐列表 */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="section-title mb-8">{filteredMusic.length}首{genreZh}音乐</h2>
          
          {filteredMusic.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMusic.map(music => (
                <Link key={music.id} href={`/music/${music.id}`}>
                  <motion.div 
                    className="bg-white dark:bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-52 w-full">
                      <Image
                        src={music.cover}
                        alt={music.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
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
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{music.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{music.artist}</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-1">{music.description}</p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {music.genre.map((g: string) => (
                          <Link key={g} href={`/music/genre/${genreMapping[g]?.en || g}`} 
                            onClick={(e) => music.genre.length > 1 && g === genreZh ? e.stopPropagation() : null}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              g === genreZh ? 
                              'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 font-medium' : 
                              'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {g}
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
              <p className="text-gray-600 dark:text-gray-400">暂无此类型的音乐。</p>
            </div>
          )}
        </div>
      </section>

      {/* 其他类型推荐 */}
      <section className="py-12 bg-gray-50 dark:bg-card">
        <div className="container-custom">
          <h2 className="section-title mb-6">探索其他类型</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {otherGenres.map(genre => (
              <Link key={genre} href={`/music/genre/${genreMapping[genre]?.en || genre}`}>
                <div className="bg-white dark:bg-content rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                  <div className="text-3xl mb-2">{genreMapping[genre]?.icon || '🎵'}</div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{genre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {musicData.filter(m => m.genre.includes(genre)).length}首音乐
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 