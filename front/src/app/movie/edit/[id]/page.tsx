"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { movieApi } from '../../../api/services/movieService';
import Image from 'next/image';

const EditMovie = () => {
  const params = useParams();
  const router = useRouter();
  const movieId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [movie, setMovie] = useState<{
    id: string | number;
    title: string;
    director: string;
    year: number;
    poster: string;
    description: string;
    rating: number;
    genre: string[];
    trailer?: string;
  }>({
    id: '',
    title: '',
    director: '',
    year: new Date().getFullYear(),
    poster: '',
    description: '',
    rating: 0,
    genre: [],
    trailer: ''
  });
  
  // 获取电影数据
  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!movieId) {
          setError("电影ID不存在");
          setIsLoading(false);
          return;
        }
        
        const response = await movieApi.getMovie(movieId);
        
        if (response.status === 200) {
          // 确保genre是数组格式
          const movieData = response.data;
          if (typeof movieData.genre === 'string') {
            movieData.genre = movieData.genre.split(',').map((g: string) => g.trim());
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
    
    fetchMovie();
  }, [movieId]);
  
  // 处理表单更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovie({
      ...movie,
      [name]: value
    });
  };
  
  // 处理类型更新
  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genreValue = e.target.value;
    setMovie({
      ...movie,
      genre: genreValue.split(',').map(g => g.trim())
    });
  };
  
  // 处理海报预览
  const getPosterPreview = () => {
    if (movie.poster && movie.poster.trim() !== '') {
      return movie.poster;
    }
    return 'https://via.placeholder.com/300x450?text=No+Poster';
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // 表单验证
      if (!movie.title || !movie.year || !movie.poster) {
        setError('请填写所有必填字段');
        setIsSaving(false);
        return;
      }
      
      // 确保我们保留了所有必要的字段
      const updatedMovie = {
        ...movie,
        // 确保这些字段在UI中已被移除，但在提交时仍包含
        director: movie.director,
        description: movie.description,
        rating: movie.rating,
        trailer: movie.trailer
      };
      
      const response = await movieApi.updateMovie(updatedMovie);
      
      if (response.status === 200) {
        setSuccessMessage('电影信息已成功更新');
        
        // 2秒后跳转回详情页
        setTimeout(() => {
          router.push(`/movie/${movieId}`);
        }, 2000);
      } else {
        setError(`更新失败: ${response.data?.message || '未知错误'}`);
      }
    } catch (err) {
      console.error('更新电影信息出错:', err);
      setError('更新电影信息时发生错误，请稍后再试');
    } finally {
      setIsSaving(false);
    }
  };
  
  // 取消编辑
  const handleCancel = () => {
    router.push(`/movie/${movieId}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载电影信息...</p>
        </div>
      </div>
    );
  }
  
  if (error && !movie.title) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">编辑电影出错</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href={`/movie/${movieId}`}>
            <button className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition flex items-center mx-auto">
              <FaArrowLeft className="mr-2" /> 返回电影详情
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
        <div className="max-w-7xl mx-auto">
          <Link href={`/movie/${movieId}`}>
            <button className="text-white flex items-center hover:text-purple-200 transition">
              <FaArrowLeft className="mr-2" /> 返回电影详情
            </button>
          </Link>
        </div>
      </div>
      
      {/* 编辑表单 */}
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">编辑电影</h1>
          
          {/* 成功或错误消息 */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md flex items-center">
              <span className="mr-2">✓</span> {successMessage}
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex items-center">
              <span className="mr-2">✕</span> {error}
            </div>
          )}
          
          <div className="md:flex gap-8 mb-6">
            {/* 左侧表单 */}
            <div className="md:w-2/3">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* 电影标题 */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      电影标题 *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={movie.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* 年份 */}
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      上映年份 *
                    </label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={movie.year}
                      onChange={handleChange}
                      required
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* 海报链接 */}
                  <div>
                    <label htmlFor="poster" className="block text-sm font-medium text-gray-700 mb-1">
                      海报链接 *
                    </label>
                    <input
                      type="url"
                      id="poster"
                      name="poster"
                      value={movie.poster}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* 类型 */}
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                      电影类型 (用逗号分隔) *
                    </label>
                    <input
                      type="text"
                      id="genre"
                      name="genre"
                      value={Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                      onChange={handleGenreChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-gray-500 text-xs mt-1">例如: 动作, 科幻, 冒险</p>
                  </div>
                  
                  {/* 按钮 */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition flex items-center"
                      disabled={isSaving}
                    >
                      <FaTimes className="mr-2" /> 取消
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <FaSpinner className="mr-2 animate-spin" /> 保存中...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" /> 保存
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            {/* 右侧预览 */}
            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-3">海报预览</h3>
                <div className="relative aspect-[2/3] rounded overflow-hidden shadow-md">
                  <Image 
                    src={getPosterPreview()}
                    alt="电影海报预览"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovie; 