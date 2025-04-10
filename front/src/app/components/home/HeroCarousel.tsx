'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { useNavigationContext } from '@/app/providers';
import { FaBook, FaFilm, FaMusic } from 'react-icons/fa';

// 更新后的轮播图数据
const carouselItems = [
  {
    id: 1,
    title: '每周精选书籍',
    description: '探索思想的海洋，发现知识的宝藏，每周为您推荐值得阅读的好书。',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600',
    link: '/books',
    linkText: '浏览书籍',
    color: 'from-blue-600 to-indigo-600',
    icon: FaBook
  },
  {
    id: 2,
    title: '电影鉴赏',
    description: '走进光影的世界，感受视觉的震撼，分享经典电影的艺术魅力与内涵。',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600',
    link: '/movies',
    linkText: '查看影评',
    color: 'from-red-600 to-pink-600',
    icon: FaFilm
  },
  {
    id: 3,
    title: '音乐推荐',
    description: '聆听心灵的声音，感受旋律的力量，发现打动人心的音乐作品。',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600',
    link: '/music',
    linkText: '探索音乐',
    color: 'from-green-600 to-teal-600',
    icon: FaMusic
  }
];

export default function HeroCarousel() {
  const { setSourceRect } = useNavigationContext();
  
  // 记录点击位置
  const handleNavigationClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSourceRect(rect);
  };
  
  return (
    <section className="relative w-full h-[500px] sm:h-[600px] overflow-hidden bg-white dark:bg-content transition-colors duration-300">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        effect={'fade'}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="w-full h-full"
      >
        {carouselItems.map((item) => (
          <SwiperSlide key={item.id} className="relative">
            {/* 背景图片 */}
            <div className="absolute inset-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className="absolute inset-0 bg-black opacity-50 dark:opacity-60"></div>
            </div>
            
            {/* 内容 */}
            <motion.div
              className="relative h-full flex flex-col justify-center items-center text-center px-4 md:px-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className={`text-5xl mb-6 bg-gradient-to-r ${item.color} p-5 rounded-full`}>
                <item.icon />
              </div>
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                {item.title}
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 max-w-2xl">
                {item.description}
              </p>
              <Link href={item.link}>
                <motion.button
                  className={`px-6 py-3 rounded-full bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg flex items-center`}
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNavigationClick}
                >
                  <item.icon className="mr-2" /> {item.linkText}
                </motion.button>
              </Link>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* 装饰元素 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="text-white dark:text-content">
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,61.3C1200,48,1320,32,1380,24L1440,16L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
          ></path>
        </svg>
      </div>
    </section>
  );
} 