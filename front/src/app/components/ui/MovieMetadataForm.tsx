'use client';

import { useState } from 'react';
import { FaStar, FaPlus } from 'react-icons/fa';

interface MovieMetadata {
  title: string;
  director: string;
  posterUrl: string;
  year: number;
  duration: string;
  genre: string[];
  rating: number;
  actors: string[];
}

interface MovieMetadataFormProps {
  metadata: MovieMetadata;
  onChange: (metadata: MovieMetadata) => void;
}

export default function MovieMetadataForm({ metadata, onChange }: MovieMetadataFormProps) {
  const [newGenre, setNewGenre] = useState('');
  const [newActor, setNewActor] = useState('');

  // 电影类型建议
  const genreSuggestions = [
    '动作', '冒险', '喜剧', '犯罪', '剧情', '奇幻', '恐怖', 
    '悬疑', '爱情', '科幻', '惊悚', '战争', '西部', '动画', 
    '纪录片', '家庭', '历史', '音乐', '传记', '运动'
  ];

  const handleRatingChange = (rating: number) => {
    onChange({ ...metadata, rating });
  };

  const handleAddGenre = () => {
    if (newGenre && !metadata.genre.includes(newGenre)) {
      onChange({ ...metadata, genre: [...metadata.genre, newGenre] });
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (genre: string) => {
    onChange({ ...metadata, genre: metadata.genre.filter(g => g !== genre) });
  };

  const handleAddActor = () => {
    if (newActor && !metadata.actors.includes(newActor)) {
      onChange({ ...metadata, actors: [...metadata.actors, newActor] });
      setNewActor('');
    }
  };

  const handleRemoveActor = (actor: string) => {
    onChange({ ...metadata, actors: metadata.actors.filter(a => a !== actor) });
  };

  const handleAddGenreSuggestion = (genre: string) => {
    if (!metadata.genre.includes(genre)) {
      onChange({ ...metadata, genre: [...metadata.genre, genre] });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">电影信息</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 电影名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            电影名称
          </label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => onChange({ ...metadata, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="输入电影名称"
          />
        </div>
        
        {/* 导演 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            导演
          </label>
          <input
            type="text"
            value={metadata.director}
            onChange={(e) => onChange({ ...metadata, director: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="输入导演姓名"
          />
        </div>

        {/* 海报链接 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            海报URL
          </label>
          <input
            type="text"
            value={metadata.posterUrl}
            onChange={(e) => onChange({ ...metadata, posterUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="输入海报图片链接"
          />
        </div>

        {/* 上映年份 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            上映年份
          </label>
          <input
            type="number"
            value={metadata.year || ''}
            onChange={(e) => onChange({ ...metadata, year: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="输入上映年份"
          />
        </div>

        {/* 片长 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            片长
          </label>
          <input
            type="text"
            value={metadata.duration}
            onChange={(e) => onChange({ ...metadata, duration: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="例如: 120分钟"
          />
        </div>

        {/* 评分 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            评分 ({metadata.rating}/10)
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-2xl focus:outline-none ${
                  star <= metadata.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                <FaStar />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 电影类型 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          电影类型
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {metadata.genre.map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-sm flex items-center dark:bg-indigo-900 dark:text-indigo-200"
            >
              {genre}
              <button
                type="button"
                onClick={() => handleRemoveGenre(genre)}
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
          {genreSuggestions.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => handleAddGenreSuggestion(genre)}
              disabled={metadata.genre.includes(genre)}
              className={`px-2 py-1 text-xs rounded-md ${
                metadata.genre.includes(genre)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* 主演 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          主演
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {metadata.actors.map((actor) => (
            <span
              key={actor}
              className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm flex items-center dark:bg-green-900 dark:text-green-200"
            >
              {actor}
              <button
                type="button"
                onClick={() => handleRemoveActor(actor)}
                className="ml-1 text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={newActor}
            onChange={(e) => setNewActor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="添加主演"
          />
          <button
            type="button"
            onClick={handleAddActor}
            className="px-3 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
} 