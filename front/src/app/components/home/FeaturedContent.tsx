'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { FaBook, FaFilm, FaMusic, FaArrowRight } from 'react-icons/fa';
import { useNavigationContext } from '@/app/providers';

// 示例数据 - 实际项目中应从API获取
const books = [
  {
    id: 1,
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600',
    description: '从人类起源到现代文明的演变，探讨我们如何走到今天。',
  },
  {
    id: 2,
    title: '原子习惯',
    author: '詹姆斯·克利尔',
    cover: 'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?q=80&w=600',
    description: '如何养成良好习惯，戒除不良习惯的实用指南。',
  },
  {
    id: 3,
    title: '瓦尔登湖',
    author: '亨利·戴维·梭罗',
    cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=600',
    description: '一部关于简单生活和自然和谐的杰作。',
  },
];

const movies = [
  {
    id: 1,
    title: '星际穿越',
    director: '克里斯托弗·诺兰',
    poster: 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?q=80&w=600',
    description: '一部关于爱、时间和宇宙的科幻巨作。',
  },
  {
    id: 2,
    title: '肖申克的救赎',
    director: '弗兰克·德拉邦特',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600',
    description: '希望让人自由，讲述了一段不屈服于命运的旅程。',
  },
  {
    id: 3,
    title: '千与千寻',
    director: '宫崎骏',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600',
    description: '少女千寻在异世界的奇幻冒险和成长故事。',
  },
];

const music = [
  {
    id: 1,
    title: '钢琴协奏曲第二号',
    artist: '拉赫玛尼诺夫',
    cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=600',
    description: '一部充满激情和忧郁的古典音乐杰作。',
  },
  {
    id: 2,
    title: 'Abbey Road',
    artist: '披头士',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600',
    description: '披头士乐队最具影响力的专辑之一。',
  },
  {
    id: 3,
    title: '四季',
    artist: '维瓦尔第',
    cover: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600',
    description: '描绘春夏秋冬四季更替的古典音乐名作。',
  },
];

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function FeaturedContent() {
  const { setSourceRect } = useNavigationContext();

  // 记录点击位置
  const handleNavigationClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSourceRect(rect);
  };

  return (
    <section className="py-16 bg-white dark:bg-content">
      <div className="container-custom">
        <h2 className="section-title text-center mb-10">每周精选</h2>
        
        <Tab.Group>
          <Tab.List className="flex space-x-1 bg-gray-100 dark:bg-card p-1 rounded-lg mb-6 max-w-md mx-auto">
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium rounded-md flex items-center justify-center transition-all ${
                  selected
                    ? 'bg-white dark:bg-content shadow text-blue-600 dark:text-blue-400'
                    : 'hover:bg-white/[0.12] hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
            >
              <FaBook className="mr-2" />
              书籍
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium rounded-md flex items-center justify-center transition-all ${
                  selected
                    ? 'bg-white dark:bg-content shadow text-blue-600 dark:text-blue-400'
                    : 'hover:bg-white/[0.12] hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
            >
              <FaFilm className="mr-2" />
              电影
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium rounded-md flex items-center justify-center transition-all ${
                  selected
                    ? 'bg-white dark:bg-content shadow text-blue-600 dark:text-blue-400'
                    : 'hover:bg-white/[0.12] hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
            >
              <FaMusic className="mr-2" />
              音乐
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            {/* 书籍面板 */}
            <Tab.Panel>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {books.map((book) => (
                  <motion.div 
                    key={book.id} 
                    className="card bg-white dark:bg-card overflow-hidden border dark:border-gray-800"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{book.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">作者: {book.author}</p>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{book.description}</p>
                      <Link href={`/books/${book.id}`} onClick={handleNavigationClick}>
                        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                          了解更多 <FaArrowRight className="ml-1 text-sm" />
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="text-center mt-10">
                <Link href="/books" onClick={handleNavigationClick}>
                  <span className="btn-primary inline-flex items-center">
                    查看所有书籍 <FaArrowRight className="ml-2" />
                  </span>
                </Link>
              </div>
            </Tab.Panel>
            
            {/* 电影面板 */}
            <Tab.Panel>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {movies.map((movie) => (
                  <motion.div 
                    key={movie.id} 
                    className="card bg-white dark:bg-card overflow-hidden border dark:border-gray-800"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{movie.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">导演: {movie.director}</p>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{movie.description}</p>
                      <Link href={`/movies/${movie.id}`} onClick={handleNavigationClick}>
                        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                          了解更多 <FaArrowRight className="ml-1 text-sm" />
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="text-center mt-10">
                <Link href="/movies" onClick={handleNavigationClick}>
                  <span className="btn-primary inline-flex items-center">
                    查看所有电影 <FaArrowRight className="ml-2" />
                  </span>
                </Link>
              </div>
            </Tab.Panel>
            
            {/* 音乐面板 */}
            <Tab.Panel>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {music.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="card bg-white dark:bg-card overflow-hidden border dark:border-gray-800"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={item.cover}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">艺术家: {item.artist}</p>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                      <Link href={`/music/${item.id}`} onClick={handleNavigationClick}>
                        <span className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                          了解更多 <FaArrowRight className="ml-1 text-sm" />
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="text-center mt-10">
                <Link href="/music" onClick={handleNavigationClick}>
                  <span className="btn-primary inline-flex items-center">
                    查看所有音乐 <FaArrowRight className="ml-2" />
                  </span>
                </Link>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
} 