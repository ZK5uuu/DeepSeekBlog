'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaArrowLeft, FaPlay } from 'react-icons/fa';

// 使用与详情页相同的电影数据
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

// 反向映射，从英文映射到中文
const reverseGenreMapping = Object.entries(genreMapping).reduce(
  (acc, [zh, { en }]) => ({ ...acc, [en]: zh }), 
  {} as Record<string, string>
);

export default function GenrePage({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true);
  const [genreZh, setGenreZh] = useState<string>('');
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [otherGenres, setOtherGenres] = useState<string[]>([]);

  useEffect(() => {
    const genreSlug = params.slug;
    const genre = reverseGenreMapping[genreSlug];
    
    if (genre) {
      setGenreZh(genre);
      // 查找包含此类型的所有电影
      const movies = moviesData.filter(movie => movie.genre.includes(genre));
      setFilteredMovies(movies);
      
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
        <p className="text-gray-600 dark:text-gray-400 mb-6">抱歉，我们无法找到此电影类型。</p>
        <Link href="/movies">
          <span className="btn-primary inline-flex items-center bg-purple-600 hover:bg-purple-700">
            <FaArrowLeft className="mr-2" /> 返回电影列表
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
          <Link href="/movies" className="text-white/80 hover:text-white transition-colors mb-4 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> 返回电影列表
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {genreMapping[genreZh]?.icon} {genreZh}电影
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            探索所有{genreZh}类型的电影。我们精心筛选了各种{genreZh}作品，满足您的观影口味。
          </p>
        </div>
      </header>

      {/* 电影列表 */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="section-title mb-8">{filteredMovies.length}部{genreZh}电影</h2>
          
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMovies.map(movie => (
                <Link key={movie.id} href={`/movies/${movie.id}`}>
                  <motion.div 
                    className="bg-white dark:bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-52 w-full">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
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
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{movie.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{movie.director}</p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-1">{movie.description}</p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {movie.genre.map((g: string) => (
                          <Link key={g} href={`/movies/genre/${genreMapping[g]?.en || g}`} 
                            onClick={(e) => movie.genre.length > 1 && g === genreZh ? e.stopPropagation() : null}
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
              <p className="text-gray-600 dark:text-gray-400">暂无此类型的电影。</p>
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
              <Link key={genre} href={`/movies/genre/${genreMapping[genre]?.en || genre}`}>
                <div className="bg-white dark:bg-content rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800">
                  <div className="text-3xl mb-2">{genreMapping[genre]?.icon || '🎬'}</div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{genre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {moviesData.filter(m => m.genre.includes(genre)).length}部电影
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