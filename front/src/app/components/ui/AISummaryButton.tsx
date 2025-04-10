'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaSpinner, FaLightbulb } from 'react-icons/fa';
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
    
    console.log(`开始为文章 ID: ${postId} 生成摘要`);
    console.log(`文章标题: ${title}`);
    console.log(`文章内容长度: ${content.length} 字符`);
    
    try {
      // 先尝试获取已有摘要
      let summaryData;
      try {
        console.log(`尝试获取已有摘要, 请求URL: /deepseek/summary/${postId}`);
        const response = await aiApi.getSummary(postId);
        console.log('获取摘要API响应:', response);
        
        if (response && response.data) {
          summaryData = response.data;
          console.log("获取到已有摘要:", response.data);
        }
      } catch (err: any) {
        console.log(`获取已有摘要失败: ${err.message}`);
        console.log("尝试生成新摘要...");
        
        // 如果获取失败或不存在，则生成新的摘要
        console.log(`生成新摘要, 请求URL: /deepseek/summary/${postId} (POST)`);
        const response = await aiApi.generateSummary(postId);
        console.log('生成摘要API响应:', response);
        
        summaryData = response.data;
        console.log("生成新摘要成功:", response.data);
      }
      
      if (summaryData && summaryData.content) {
        console.log(`摘要内容: ${summaryData.content}`);
        setSummary(summaryData.content);
        setShowSummary(true);
      } else {
        console.error('摘要数据无效:', summaryData);
        throw new Error('未能获取摘要内容');
      }
    } catch (err: any) {
      console.error('生成摘要时出错:', err);
      console.error('错误详情:', err.response || err.message);
      setError(`生成摘要时发生错误: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={generateSummary}
        disabled={isLoading}
        className={`flex items-center justify-center px-4 py-2 rounded-full text-white font-medium shadow-md transition-all duration-300 ${
          isLoading 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105'
        }`}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin mr-2" />
        ) : (
          <FaRobot className="mr-2" />
        )}
        {isLoading ? '正在生成AI摘要...' : '30字极简解析'}
      </motion.button>

      {/* 错误提示 */}
      {error && (
        <motion.div 
          className="mt-4 p-4 bg-red-100 text-red-700 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <FaLightbulb className="mr-2" />
            <div>
              <p className="font-bold">摘要生成失败</p>
              <p>{error}</p>
            </div>
          </div>
        </motion.div>
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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <h3 className="text-lg font-bold flex items-center">
                  <FaRobot className="mr-2" /> AI极简解析
                </h3>
                <button
                  onClick={() => setShowSummary(false)}
                  className="text-white hover:bg-white/20 p-1 rounded-full"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-center">
                  <div className="text-2xl font-bold text-center py-6 px-8 bg-gray-50 dark:bg-gray-900 rounded-lg max-w-md">
                    {summary}
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <div className="text-gray-500 dark:text-gray-400 italic">
                    由 DeepSeek AI 模型生成的30字极简解析
                  </div>
                  <div className="text-blue-500 cursor-pointer hover:underline">
                    反馈
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 