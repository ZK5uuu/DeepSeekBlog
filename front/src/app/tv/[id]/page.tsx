"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaTv, FaArrowLeft, FaCalendarAlt, FaUser, FaStar } from 'react-icons/fa';

// 简单的TV详情页（实际项目中会从API获取数据）
export default function TVShowDetail() {
  const params = useParams();
  const router = useRouter();
  const tvId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tvShow, setTVShow] = useState<any>(null);
  
  // 模拟从API获取数据
  useEffect(() => {
    const fetchTVShowDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 根据ID匹配电视剧数据
        // 实际项目中应从API获取
        const mockTVShows = [
          {
            id: 1,
            title: "绝命毒师",
            creator: "文斯·吉利根",
            year: 2008,
            poster: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDY1LWJjMjEtMDI2N2ZlOTdhYjQxXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
            description: "一位高中化学老师被诊断出肺癌，为了给家人留下足够的钱，开始制造和销售冰毒。",
            rating: 9.5,
            genre: ["剧情", "犯罪", "惊悚"],
            seasons: 5,
            episodes: 62,
            network: "AMC",
            status: "已完结",
            views: 1245,
            isLiked: false
          },
          {
            id: 2,
            title: "权力的游戏",
            creator: "大卫·贝尼奥夫, D.B.威斯",
            year: 2011,
            poster: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg",
            description: "几个贵族家族为争夺铁王座而进行的政治和战争。",
            rating: 9.2,
            genre: ["剧情", "奇幻", "冒险"],
            seasons: 8,
            episodes: 73,
            network: "HBO",
            status: "已完结",
            views: 1879,
            isLiked: false
          },
          {
            id: 3,
            title: "怪奇物语",
            creator: "达菲兄弟",
            year: 2016,
            poster: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
            description: "一个小男孩神秘失踪，小镇揭开了一系列秘密，超自然力量，一个奇怪的小女孩。",
            rating: 8.7,
            genre: ["剧情", "恐怖", "科幻"],
            seasons: 4,
            episodes: 34,
            network: "Netflix",
            status: "进行中",
            views: 967,
            isLiked: false
          }
        ];
        
        const found = mockTVShows.find(show => show.id.toString() === tvId);
        
        if (found) {
          setTVShow(found);
        } else {
          setError("未找到剧集信息");
        }
      } catch (err) {
        console.error('获取剧集详情出错:', err);
        setError('获取剧集数据时发生错误');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (tvId) {
      fetchTVShowDetails();
    }
  }, [tvId]);
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // 错误状态
  if (error || !tvShow) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <FaTv className="text-6xl text-blue-400 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">找不到剧集</h1>
          <p className="text-gray-600 mb-6">{error || "请尝试访问其他剧集"}</p>
          <Link href="/tv">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition flex items-center mx-auto">
              <FaArrowLeft className="mr-2" /> 返回剧集列表
            </button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部返回导航 */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/tv">
            <button className="text-white flex items-center hover:text-blue-200 transition">
              <FaArrowLeft className="mr-2" /> 返回剧集列表
            </button>
          </Link>
        </div>
      </div>
      
      {/* 剧集信息 */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 顶部信息区域 */}
          <div className="md:flex">
            {/* 海报区域 */}
            <div className="md:w-1/3 p-6">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                <Image 
                  src={tvShow.poster}
                  alt={tvShow.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* 信息区域 */}
            <div className="md:w-2/3 p-6">
              <div className="flex flex-wrap items-center mb-4">
                {tvShow.genre.map((genre: string) => (
                  <span key={genre} className="mr-2 mb-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{tvShow.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <FaUser className="mr-1" />
                <span className="mr-4">{tvShow.creator}</span>
                <FaCalendarAlt className="mr-1" />
                <span className="mr-4">{tvShow.year}</span>
                <FaStar className="text-yellow-500 mr-1" />
                <span>{tvShow.rating}/10</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">频道/平台</p>
                  <p className="font-semibold">{tvShow.network}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">状态</p>
                  <p className="font-semibold">{tvShow.status}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">季数/集数</p>
                  <p className="font-semibold">{tvShow.seasons}季 / {tvShow.episodes}集</p>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-2">剧情简介</h2>
              <p className="text-gray-600 mb-6">{tvShow.description}</p>
              
              <div className="mt-4 space-x-3">
                <button className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                  写剧评
                </button>
                <button className="px-5 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition">
                  收藏
                </button>
              </div>
            </div>
          </div>
          
          {/* 页脚提示 */}
          <div className="bg-gray-50 p-6 text-center border-t">
            <p className="text-gray-500">这是一个示例页面，实际项目中这里可以展示剧评列表、相关剧集推荐等更多内容</p>
          </div>
        </div>
      </div>
    </div>
  );
} 