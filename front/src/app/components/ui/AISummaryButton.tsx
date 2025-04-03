'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaSpinner } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { aiApi } from '@/app/api';

interface AISummaryButtonProps {
  content: string;
  title: string;
  postId: number;
}

export default function AISummaryButton({ content, title, postId }: AISummaryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  const generateSummary = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // 先尝试获取已有摘要
      let summaryData;
      try {
        const response = await aiApi.getSummary(postId);
        if (response.data) {
          summaryData = response.data;
        }
      } catch (err) {
        // 如果获取失败或不存在，则生成新的摘要
        const response = await aiApi.generateSummary(postId);
        summaryData = response.data;
      }
      
      if (summaryData && summaryData.content) {
        setSummary(summaryData.content);
        setShowSummary(true);
      } else {
        throw new Error('未能获取摘要内容');
      }
    } catch (err) {
      console.error('生成摘要时出错:', err);
      setError('生成摘要时发生错误，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={generateSummary}
        disabled={isLoading}
        className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin mr-2" />
        ) : (
          <FaRobot className="mr-2" />
        )}
        {isLoading ? '生成摘要中...' : 'AI总结'}
      </motion.button>

      {/* 错误提示 */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* 弹出的摘要窗口 */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSummary(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI摘要</h3>
                <button
                  onClick={() => setShowSummary(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                  {summary.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 italic">
                  由 DeepSeek AI 模型生成的摘要
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 