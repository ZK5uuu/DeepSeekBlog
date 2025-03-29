'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaCalendarAlt, FaUser, FaArrowLeft, FaClock, FaTag, FaYoutube, FaPlay } from 'react-icons/fa';

// 示例电影数据 - 在实际应用中应从API获取
const moviesData = [
  {
    id: 1,
    title: '星际穿越',
    director: '克里斯托弗·诺兰',
    year: 2014,
    poster: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=600',
    description: '一部关于爱、时间和宇宙的科幻巨作，探索人类跨越星际旅行的可能性。',
    fullDescription: `《星际穿越》是一部融合了硬科幻元素与深沉情感的电影杰作。故事设定在一个地球即将无法居住的未来，人类面临灭绝危机。

前NASA宇航员库珀（马修·麦康纳饰）被命运引导加入一项秘密任务，穿越虫洞寻找可能适合人类居住的新星球。在太空旅行中，相对论效应使得时间产生了巨大差异，地球上的几十年可能只是宇航员经历的几小时。

影片通过对黑洞、五维空间和时间相对性的探索，展现了科学与人类情感的交织。库珀与女儿墨菲之间的父女情感成为贯穿全片的核心线索，诺兰巧妙地将复杂的物理概念与人类最基本的情感连接起来。

《星际穿越》不仅是一部关于宇宙探索的科幻巨作，更是一个关于爱、牺牲和永恒的寓言。影片提出了一个深刻的问题：爱是否可以超越时间和空间的限制？这种超越物理规律的情感力量，最终成为拯救人类的关键。`,
    rating: 4.8,
    genre: ['科幻', '冒险', '剧情'],
    duration: '2小时49分钟',
    cast: ['马修·麦康纳', '安妮·海瑟薇', '杰西卡·查斯坦', '麦肯吉·弗依'],
    trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    reviews: [
      {
        author: '影评人A',
        content: '《星际穿越》是诺兰导演的巅峰之作，将科学与情感完美融合。',
        rating: 5
      },
      {
        author: '影评人B',
        content: '影片中的视觉效果令人惊叹，但真正打动人心的是父女之间跨越时空的情感纽带。',
        rating: 4.5
      }
    ],
    relatedMovies: [2, 6]
  },
  {
    id: 2,
    title: '肖申克的救赎',
    director: '弗兰克·德拉邦特',
    year: 1994,
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600',
    description: '希望让人自由，讲述了一段不屈服于命运的旅程。',
    fullDescription: `《肖申克的救赎》是一部深刻探讨希望、友谊和救赎主题的经典之作。故事讲述了银行家安迪·杜佛雷斯因被错误指控谋杀妻子及其情人而被判终身监禁的故事。

在肖申克监狱的高墙内，安迪遇见了红，一个能够在监狱中搞到任何东西的犯人。随着时间推移，两人之间建立了深厚的友谊。尽管身处绝望的环境，安迪始终保持着对自由的渴望和对生活的希望。

影片以安迪历经19年策划的越狱为高潮，他不仅实现了自己的自由，还揭露了监狱长的腐败，并为许多狱友带来了希望。《肖申克的救赎》不仅仅是一个关于越狱的故事，更是一个关于人性尊严和不屈精神的赞歌。

正如影片中的经典台词："希望是件好东西，也许是最好的东西，好东西永不消逝。"《肖申克的救赎》告诉我们，即使在最黑暗的环境中，希望也能成为照亮前路的明灯。`,
    rating: 4.9,
    genre: ['剧情', '犯罪'],
    duration: '2小时22分钟',
    cast: ['蒂姆·罗宾斯', '摩根·弗里曼', '鲍勃·冈顿', '威廉姆·赛德勒'],
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    reviews: [
      {
        author: '影评人C',
        content: '这部电影完美诠释了"希望"的力量，是电影史上不可错过的作品。',
        rating: 5
      }
    ],
    relatedMovies: [1, 3]
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
    duration: '2小时5分钟',
    cast: ['柊瑠美', '入野自由', '夏木真理', '菅原文太'],
    trailer: 'https://www.youtube.com/watch?v=ByXuk9QqQkk',
    reviews: [],
    relatedMovies: [2, 4]
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
    duration: '2小时16分钟',
    cast: ['基努·里维斯', '劳伦斯·菲什伯恩', '凯莉-安·莫斯', '雨果·维文'],
    trailer: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    reviews: [],
    relatedMovies: [1, 6]
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
    duration: '1小时43分钟',
    cast: ['金·凯瑞', '劳拉·琳妮', '艾德·哈里斯', '诺亚·艾默里奇'],
    trailer: 'https://www.youtube.com/watch?v=dlnmQbPGuls',
    reviews: [],
    relatedMovies: [2, 5]
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
    duration: '2小时28分钟',
    cast: ['莱昂纳多·迪卡普里奥', '约瑟夫·高登-莱维特', '艾伦·佩吉', '汤姆·哈迪'],
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    reviews: [],
    relatedMovies: [1, 4]
  }
];

export default function MovieDetail({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);

  useEffect(() => {
    // 在实际项目中，这里应该是API请求
    const movieId = parseInt(params.id);
    const foundMovie = moviesData.find(m => m.id === movieId);
    
    if (foundMovie) {
      setMovie(foundMovie);
      
      // 获取相关电影
      if (foundMovie.relatedMovies && foundMovie.relatedMovies.length > 0) {
        const related = moviesData.filter(m => foundMovie.relatedMovies.includes(m.id));
        setRelatedMovies(related);
      }
    }
    
    setLoading(false);
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-content">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-content">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">电影未找到</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">抱歉，我们无法找到您请求的电影。</p>
      <Link href="/movies">
        <span className="btn-primary inline-flex items-center bg-purple-600 hover:bg-purple-700">
          <FaArrowLeft className="mr-2" /> 返回电影列表
        </span>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 电影海报背景 */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white dark:to-content"></div>
        </div>
        <div className="container-custom relative h-full flex flex-col justify-end pb-10">
          <Link href="/movies" className="text-white hover:text-gray-300 transition-colors mb-4 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> 返回电影列表
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
          <div className="flex flex-wrap items-center text-white gap-4 mb-4">
            <span className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" /> {movie.rating.toFixed(1)}
            </span>
            <span className="flex items-center">
              <FaCalendarAlt className="mr-1" /> {movie.year}
            </span>
            <span className="flex items-center">
              <FaClock className="mr-1" /> {movie.duration}
            </span>
            <div className="flex gap-2">
              {movie.genre.map((genre: string) => (
                <span key={genre} className="px-2 py-1 text-xs bg-purple-600/80 rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 电影详情 */}
      <section className="py-12 bg-white dark:bg-content">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 左侧信息栏 */}
            <div className="md:w-1/3">
              {/* 如果有预告片，显示预告片按钮 */}
              {movie.trailer && (
                <a 
                  href={movie.trailer} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block mb-6 relative group"
                >
                  <div className="relative h-48 rounded-xl overflow-hidden">
                    <Image
                      src={movie.poster}
                      alt={`${movie.title} 预告片`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="w-16 h-16 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full mb-2 group-hover:scale-110 transition-transform duration-300">
                        <FaPlay className="text-xl ml-1" />
                      </span>
                      <span className="text-white font-medium flex items-center">
                        <FaYoutube className="text-2xl mr-2" /> 观看预告片
                      </span>
                    </div>
                  </div>
                </a>
              )}

              <div className="bg-gray-50 dark:bg-card rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">影片信息</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">导演</p>
                    <p className="text-gray-900 dark:text-white">{movie.director}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">上映年份</p>
                    <p className="text-gray-900 dark:text-white">{movie.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">时长</p>
                    <p className="text-gray-900 dark:text-white">{movie.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">类型</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {movie.genre.map((genre: string) => (
                        <span key={genre} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-card rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">主要演员</h3>
                <ul className="space-y-2">
                  {movie.cast.map((actor: string, index: number) => (
                    <li key={index} className="text-gray-800 dark:text-gray-200 flex items-center">
                      <FaUser className="mr-2 text-purple-600 dark:text-purple-400" /> {actor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 右侧内容区 */}
            <div className="md:w-2/3">
              <div className="bg-white dark:bg-content rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">剧情简介</h2>
                <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                  {movie.fullDescription ? (
                    movie.fullDescription.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))
                  ) : (
                    <p>{movie.description}</p>
                  )}
                </div>
              </div>

              {/* 观众评论 */}
              <div className="bg-white dark:bg-content rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">观众评论</h2>
                
                {movie.reviews && movie.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {movie.reviews.map((review: any, index: number) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{review.author}</h4>
                          <div className="flex items-center text-yellow-500">
                            <FaStar className="mr-1" /> 
                            <span className="text-gray-700 dark:text-gray-300">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-6">暂无评论</p>
                )}
                
                <button className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  写评论
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 相关电影推荐 */}
      {relatedMovies.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-card">
          <div className="container-custom">
            <h2 className="section-title text-center mb-8">相关推荐</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedMovies.map(relatedMovie => (
                <Link key={relatedMovie.id} href={`/movies/${relatedMovie.id}`}>
                  <motion.div 
                    className="bg-white dark:bg-content rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedMovie.poster}
                        alt={relatedMovie.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-white">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{relatedMovie.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-800/60 rounded text-white">
                            {relatedMovie.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{relatedMovie.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{relatedMovie.director}</p>
                      <div className="flex flex-wrap gap-1">
                        {relatedMovie.genre.slice(0, 2).map((g: string) => (
                          <span key={g} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 