'use client';

import HeroCarousel from './components/home/HeroCarousel';
import FeaturedContent from './components/home/FeaturedContent';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState, ReactNode } from 'react';

const fadeInUpVariant = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

function AnimatedSection({ children, className = "" }: { children: ReactNode, className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUpVariant}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const scrollRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-content" ref={scrollRef}>
      <HeroCarousel />{/* 轮播图 */}
      
      <FeaturedContent />
      
      {/* 关于部分 */}
      <section className="py-16 bg-white dark:bg-content">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <AnimatedSection className="md:w-1/2">
              <h2 className="section-title">关于知识分享</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                知识分享是一个个人博客网站，致力于记录每周学习的书籍、电影和音乐，并通过深入思考将这些内容转化为有价值的博客文章。
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                在这里，我们相信知识的力量和分享的乐趣。每一本书、每一部电影、每一首音乐都能带给我们新的视角和思考。
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                欢迎加入这个知识探索和分享的旅程！
              </p>
            </AnimatedSection>
            <AnimatedSection className="md:w-1/2 relative h-80 rounded-xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-90"></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
                <h3 className="text-3xl font-bold mb-4">每周学习</h3>
                <p className="text-xl mb-6">记录阅读、观影和音乐体验</p>
                <motion.div 
                  className="grid grid-cols-3 gap-4 w-full"
                  variants={staggerContainerVariant}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="bg-white/20 p-3 rounded-lg backdrop-blur-sm"
                    variants={fadeInUpVariant}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl font-bold">书籍</div>
                    <div>探索知识</div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/20 p-3 rounded-lg backdrop-blur-sm"
                    variants={fadeInUpVariant}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl font-bold">电影</div>
                    <div>视觉体验</div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/20 p-3 rounded-lg backdrop-blur-sm"
                    variants={fadeInUpVariant}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl font-bold">音乐</div>
                    <div>听觉享受</div>
                  </motion.div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* 特性部分 */}
      <section className="py-16 bg-gray-50 dark:bg-content">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-title text-center mb-12">网站特色</h2>
          </AnimatedSection>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.div 
              className="bg-white dark:bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={fadeInUpVariant}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">每周读物</h3>
              <p className="text-gray-700 dark:text-gray-300">
                记录每周阅读的书籍，分享精彩段落和个人感悟，探索书中的智慧。
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={fadeInUpVariant}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">电影评论</h3>
              <p className="text-gray-700 dark:text-gray-300">
                分享观影体验，解析电影主题和艺术表现，记录电影带来的思考。
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={fadeInUpVariant}
              whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">音乐推荐</h3>
              <p className="text-gray-700 dark:text-gray-300">
                推荐每周聆听的音乐作品，分享音乐背后的故事和个人感受。
              </p>
            </motion.div>
          </motion.div>
          
          <div className="mt-12 text-center">
            <AnimatedSection>
              <div className="inline-block bg-white dark:bg-card p-6 rounded-xl shadow-md">
                <motion.div 
                  className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600 dark:text-red-400"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">AI内容总结</h3>
                <p className="text-gray-700 dark:text-gray-300 max-w-lg mx-auto">
                  使用DeepSeek AI模型为博客内容提供智能摘要，让您快速把握文章要点。
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
