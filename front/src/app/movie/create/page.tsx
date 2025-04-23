'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSave, FaUpload, FaSpinner, FaFilm, FaImage, FaPlus, FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { movieApi, genreMapping } from '@/app/api/services/movieService';

// 电影类型建议
const genreSuggestions = [
  '动作', '冒险', '喜剧', '犯罪', '剧情', '奇幻', '恐怖', 
  '悬疑', '爱情', '科幻', '惊悚', '战争', '西部', '动画', 
  '纪录片', '家庭', '历史', '音乐', '传记', '运动'
];

export default function CreateMoviePage() {
  const router = useRouter();
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState('');
  const [rating, setRating] = useState(0);
  const [genre, setGenre] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [trailer, setTrailer] = useState('');
  
  // 上传状态
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // refs
  const posterInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  
  // 自动聚焦到标题
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);
  
  // 添加电影类型
  const handleAddGenre = () => {
    if (newGenre && !genre.includes(newGenre)) {
      setGenre([...genre, newGenre]);
      setNewGenre('');
    }
  };
  
  // 删除电影类型
  const handleRemoveGenre = (genreToRemove: string) => {
    setGenre(genre.filter(g => g !== genreToRemove));
  };
  
  // 添加预设电影类型
  const handleAddGenreSuggestion = (genreSuggestion: string) => {
    if (!genre.includes(genreSuggestion)) {
      setGenre([...genre, genreSuggestion]);
    }
  };
  
  // 触发上传海报
  const handlePosterUploadClick = () => {
    if (posterInputRef.current) {
      posterInputRef.current.click();
    }
  };

  // 上传海报图片
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片文件');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 这里可以替换为真实的图片上传API
      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 使用FileReader创建本地URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setPoster(event.target.result.toString());
          toast.success('海报上传成功');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('上传海报失败:', error);
      toast.error('上传海报失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };
  
  // 设置评分
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  
  // 保存电影
  const handleSave = async () => {
    // 表单验证
    if (!title) {
      toast.error('请输入电影标题');
      titleRef.current?.focus();
      return;
    }
    
    if (!director) {
      toast.error('请输入导演姓名');
      return;
    }
    
    if (!year) {
      toast.error('请输入上映年份');
      return;
    }
    
    if (!description) {
      toast.error('请输入电影简介');
      return;
    }
    
    if (!poster) {
      toast.error('请上传或提供电影海报');
      return;
    }
    
    if (genre.length === 0) {
      toast.error('请至少选择一个电影类型');
      return;
    }
    
    if (rating === 0) {
      toast.error('请为电影评分');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // 创建电影数据对象
      const movieData = {
        title,
        director,
        year: parseInt(year),
        description,
        poster,
        genre,
        genreList: genre.join(','),
        rating,
        trailer: trailer || undefined
      };
      
      console.log('提交电影数据:', movieData);
      
      // 调用API创建电影
      const response = await movieApi.createMovie(movieData);
      console.log('创建电影成功:', response);
      
      // 获取创建的电影ID
      const createdMovieId = response.data?.movie?.id || response.data?.id;
      
      // 显示成功消息
      toast.success('电影创建成功！');
      setShowSuccessMessage(true);
      
      // 3秒后跳转到电影详情页或列表页
      setTimeout(() => {
        if (createdMovieId) {
          // 如果有ID，跳转到详情页
          router.push(`/movie/${createdMovieId}`);
        } else {
          // 否则跳转到列表页
          router.push('/movie');
        }
      }, 3000);
    } catch (error: any) {
      console.error('保存电影失败:', error);
      let errMsg = '保存电影失败，请重试';
      
      // 尝试获取详细错误信息
      if (error.response?.data?.message) {
        errMsg = `错误: ${error.response.data.message}`;
      } else if (error.message) {
        errMsg = `错误: ${error.message}`;
      }
      
      setErrorMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* 返回按钮和标题 */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.push('/movie')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>返回电影列表</span>
        </button>
        <h1 className="text-2xl font-bold flex items-center">
          <FaFilm className="mr-2 text-red-500" />
          <span>添加新电影</span>
        </h1>
      </div>
      
      {/* 成功提示 */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg shadow-md dark:bg-green-900 dark:text-green-200"
        >
          <p className="font-medium">电影添加成功！</p>
          <p className="text-sm">即将跳转到电影列表页...</p>
        </motion.div>
      )}
      
      {/* 错误提示 */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg shadow-md dark:bg-red-900 dark:text-red-200"
        >
          <p className="font-medium">添加失败</p>
          <p className="text-sm">{errorMessage}</p>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧表单 */}
        <div className="md:col-span-2 space-y-6">
          {/* 电影基本信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4 dark:border-gray-700">基本信息</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  电影标题 <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="输入电影标题"
                />
              </div>
              
              <div>
                <label htmlFor="director" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  导演 <span className="text-red-500">*</span>
                </label>
                <input
                  id="director"
                  type="text"
                  value={director}
                  onChange={(e) => setDirector(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="输入导演姓名"
                />
              </div>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  上映年份 <span className="text-red-500">*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="输入上映年份，如2023"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  简介 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="输入电影简介"
                />
              </div>
            </div>
          </div>
          
          {/* 电影类型和评分 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4 dark:border-gray-700">电影类型与评分</h2>
            
            <div className="space-y-4">
              {/* 电影类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  电影类型 <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {genre.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm flex items-center dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {g}
                      <button
                        type="button"
                        onClick={() => handleRemoveGenre(g)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="添加电影类型"
                  />
                  <button
                    type="button"
                    onClick={handleAddGenre}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none"
                  >
                    <FaPlus />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {genreSuggestions.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleAddGenreSuggestion(g)}
                      disabled={genre.includes(g)}
                      className={`px-2 py-1 text-xs rounded-md ${
                        genre.includes(g)
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 评分 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  评分 <span className="text-red-500">*</span> ({rating}/10)
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`text-2xl focus:outline-none ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 预告片链接 */}
              <div>
                <label htmlFor="trailer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  预告片链接 (可选)
                </label>
                <input
                  id="trailer"
                  type="text"
                  value={trailer}
                  onChange={(e) => setTrailer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="输入Youtube或其他视频链接"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧海报和保存按钮 */}
        <div className="space-y-6">
          {/* 海报上传区域 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4 dark:border-gray-700">
              电影海报 <span className="text-red-500">*</span>
            </h2>
            
            <div className="flex flex-col items-center space-y-4">
              {poster ? (
                <div className="relative w-full">
                  <img
                    src={poster}
                    alt="电影海报预览"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => setPoster('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    title="删除海报"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  onClick={handlePosterUploadClick}
                  className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors dark:border-gray-600 dark:hover:border-indigo-400"
                >
                  <FaImage className="text-4xl text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">点击上传海报</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">推荐尺寸: 300 x 450</p>
                </div>
              )}
              
              <input
                ref={posterInputRef}
                type="file"
                accept="image/*"
                onChange={handlePosterUpload}
                className="hidden"
              />
              
              {poster ? (
                <button
                  onClick={handlePosterUploadClick}
                  className="px-4 py-2 flex items-center justify-center text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      <span>上传中...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload className="mr-2" />
                      <span>更换海报</span>
                    </>
                  )}
                </button>
              ) : null}
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                支持JPG、PNG格式，最大10MB
              </p>
            </div>
          </div>
          
          {/* 保存按钮 */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 px-4 flex items-center justify-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                <span>保存电影</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 