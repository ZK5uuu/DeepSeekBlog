'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { FaBook, FaFilm, FaMusic, FaArrowRight } from 'react-icons/fa';
import { useNavigationContext } from '@/app/providers';

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
  const [books, setBooks] = useState([]);
  const [movies, setMovies] = useState([]);
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);

  // 获取数据
  useEffect(() => {
    // 模拟API加载
    setLoading(false);
  }, []);

  // 记录点击位置
  const handleNavigationClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSourceRect(rect);
  };

  // 加载状态渲染
  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-content">
        <div className="container-custom">
          <h2 className="section-title text-center mb-10">每周精选</h2>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500 dark:text-gray-400">正在加载内容...</p>
          </div>
        </div>
      </section>
    );
  }

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
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">暂无书籍数据，请从数据库获取</p>
                </div>
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
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">暂无电影数据，请从数据库获取</p>
                </div>
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
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">暂无音乐数据，请从数据库获取</p>
                </div>
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