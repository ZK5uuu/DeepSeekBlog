'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { postApi } from '@/app/api/services/blogService';

// 音乐风格标签
const musicStyleTags = [
  '摇滚', '民谣', '欧美流行', '爵士', '冷爵士', '流行', '放克', '乡村摇滚'
];

interface MusicReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistName?: string;
  albumName?: string;
  onSuccess?: () => void;
}

export default function MusicReviewModal({
  isOpen,
  onClose,
  artistName: initialArtistName = '',
  albumName: initialAlbumName = '',
  onSuccess
}: MusicReviewModalProps) {
  // 音乐评论状态
  const [artistName, setArtistName] = useState(initialArtistName);
  const [albumName, setAlbumName] = useState(initialAlbumName);
  const [musicStyles, setMusicStyles] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // 处理音乐风格标签选择
  const toggleMusicStyle = (style: string) => {
    if (musicStyles.includes(style)) {
      setMusicStyles(musicStyles.filter(s => s !== style));
    } else {
      setMusicStyles([...musicStyles, style]);
    }
  }

  // 保存乐评
  const handleSaveReview = async () => {
    if (!artistName) {
      alert('请输入艺术家名称');
      return;
    }
    
    if (!albumName) {
      alert('请输入专辑名称');
      return;
    }
    
    if (musicStyles.length === 0) {
      alert('请至少选择一个音乐风格');
      return;
    }
    
    if (!content || content.length < 30) {
      alert('请至少输入30个字符的乐评内容');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // 准备数据
      const blogData = {
        title: albumName, // 使用专辑名称作为标题
        content,
        summary: content.slice(0, 50) + '...',
        tags: musicStyles,
        contentType: 'music',
        artistName,
        albumName,
        coverImageUrl: '', // 音乐评论没有封面图片
      };
      
      console.log('正在保存音乐评论:', blogData);
      
      // 调用相同的API
      const result = await postApi.createPost(blogData);
      console.log('音乐评论保存成功:', result);
      
      // 成功回调
      if (onSuccess) {
        onSuccess();
      }
      
      // 关闭弹窗
      resetAndClose();
    } catch (error: any) {
      console.error('保存音乐评论时出错:', error);
      alert(`保存失败: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 重置表单并关闭
  const resetAndClose = () => {
    setArtistName('');
    setAlbumName('');
    setMusicStyles([]);
    setContent('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">写新乐评</h2>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                onClick={onClose}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              {/* 艺术家 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  艺术家
                </label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="艺术家名称"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                />
              </div>
              
              {/* 专辑名称 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  专辑名称
                </label>
                <input
                  type="text"
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  placeholder="专辑名称"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                />
              </div>
              
              {/* 风格标签 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  风格
                </label>
                <div className="flex flex-wrap gap-2">
                  {musicStyleTags.map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleMusicStyle(style)}
                      className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                        musicStyles.includes(style)
                          ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-medium'
                          : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 乐评内容 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  乐评内容
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="写下对这首音乐的感想..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg min-h-[120px] resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                />
              </div>
              
              {/* 底部按钮 */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveReview}
                  disabled={isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>保存中...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>发布乐评</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 