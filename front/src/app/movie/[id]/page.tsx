"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFilm, FaArrowLeft, FaCalendarAlt, FaUser, FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { movieApi } from '../../api/services/movieService';

// 简单的电影详情页（使用movieService获取数据）
export default function MovieDetail() {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // 使用movieApi获取电影详情数据
  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!movieId) {
          setError("电影ID不存在");
          setIsLoading(false);
          return;
        }
        
        // 增加电影浏览量
        await movieApi.incrementViews(movieId);
        
        // 获取电影详情
        const response = await movieApi.getMovie(movieId);
        
        if (response.status === 200) {
          // 格式化电影数据
          let movieData = response.data;
          
          // 获取相关电影推荐
          const relatedResponse = await movieApi.getRelatedMovies(movieId);
          if (relatedResponse.status === 200) {
            movieData.relatedMovies = relatedResponse.data;
          }
          
          setMovie(movieData);
        } else {
          setError("获取电影详情失败");
        }
      } catch (err) {
        console.error('获取电影详情出错:', err);
        setError('获取电影数据时发生错误');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [movieId]);
  
  // 编辑电影
  const handleEdit = () => {
    router.push(`/movie/edit/${movieId}`);
  };
  
  // 打开删除确认弹窗
  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };
  
  // 关闭删除确认弹窗
  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };
  
  // 删除电影
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await movieApi.deleteMovie(movieId);
      
      if (response.status === 200) {
        alert("电影已成功删除");
        router.push("/movie");
      } else {
        alert(`删除失败: ${response.data?.message || '未知错误'}`);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error('删除电影出错:', err);
      alert("删除电影失败，请稍后重试");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // 错误状态
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <FaFilm className="text-6xl text-purple-400 mb-4 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">找不到电影</h1>
          <p className="text-gray-600 mb-6">{error || "请尝试访问其他电影"}</p>
          <Link href="/movie">
            <button className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition flex items-center mx-auto">
              <FaArrowLeft className="mr-2" /> 返回电影列表
            </button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部返回导航 */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/movie">
            <button className="text-white flex items-center hover:text-purple-200 transition">
              <FaArrowLeft className="mr-2" /> 返回电影列表
            </button>
          </Link>
          <div className="flex space-x-3">
            <button 
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center text-sm"
            >
              <FaEdit className="mr-1" /> 编辑
            </button>
            <button 
              onClick={openDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center text-sm"
              disabled={isDeleting}
            >
              <FaTrash className="mr-1" /> 删除
              {isDeleting && (
                <span className="ml-1 h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* 电影信息 */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 顶部信息区域 */}
          <div className="md:flex">
            {/* 海报区域 */}
            <div className="md:w-1/3 p-6">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                <Image 
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* 信息区域 */}
            <div className="md:w-2/3 p-6">
              <div className="flex flex-wrap items-center mb-4">
                {movie.genre.map((genre: string) => (
                  <span key={genre} className="mr-2 mb-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{movie.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <FaUser className="mr-1" />
                <span className="mr-4">{movie.director}</span>
                <FaCalendarAlt className="mr-1" />
                <span className="mr-4">{movie.year}</span>
                <FaStar className="text-yellow-500 mr-1" />
                <span>{movie.rating}/10</span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-2">电影简介</h2>
              <p className="text-gray-600 mb-6">{movie.description}</p>
            </div>
          </div>
          
          {/* 预告片区域（如果有） */}
          {movie.trailer && (
            <div className="p-6 border-t">
              <h2 className="text-xl font-bold text-gray-800 mb-4">电影预告片</h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={movie.trailer.replace('watch?v=', 'embed/')}
                  title="Movie Trailer"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          
          {/* 页脚提示 */}
          <div className="bg-gray-50 p-6 text-center border-t">
            <p className="text-gray-500">实际项目中这里可以展示影评列表、相关电影推荐等更多内容</p>
          </div>
        </div>
      </div>
      
      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">确认删除</h2>
            <p className="text-gray-600 mb-6">
              您确定要删除电影 "{movie.title}" 吗？此操作不可恢复。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteConfirm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                disabled={isDeleting}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? '删除中...' : '确认删除'}
                {isDeleting && (
                  <span className="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 