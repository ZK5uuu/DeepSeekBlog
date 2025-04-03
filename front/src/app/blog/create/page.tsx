'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSave, FaTags, FaRobot, FaCheck, FaSpinner, FaImage } from 'react-icons/fa';

// 模拟AI总结API调用
const mockAiSummarize = async (text: string): Promise<string> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 这里是模拟的AI总结结果，实际应用中应调用真实的API
  return `这篇文章主要探讨了${text.slice(0, 100)}...等相关内容。文章结构清晰，论述有力，为读者提供了丰富的信息和独特的视角。`;
};

// 标签选项
const tagOptions = [
  '人工智能', '文学评论', '电影', '音乐', '科技', 
  '历史', '哲学', '科学', '艺术', '社会', '教育',
  '心理学', '环境', '健康', '政治', '经济'
];

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagSelectorRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭标签选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagSelectorRef.current && !tagSelectorRef.current.contains(event.target as Node)) {
        setShowTagSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 自动调整文本区域高度
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, [content]);

  // 处理标签选择
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  // 处理AI总结
  const handleAiSummarize = async () => {
    if (!content || content.length < 50) {
      alert('请至少输入50个字符以便AI生成有意义的摘要');
      return;
    }
    
    setIsGeneratingSummary(true);
    try {
      const summary = await mockAiSummarize(content);
      setAiSummary(summary);
    } catch (error) {
      console.error('生成摘要时出错:', error);
      alert('生成摘要时出错，请稍后再试');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // 完成博客创建
  const handleSave = async () => {
    if (!title) {
      alert('请输入博客标题');
      return;
    }
    
    if (!content || content.length < 100) {
      alert('请至少输入100个字符的内容');
      return;
    }
    
    if (selectedTags.length === 0) {
      alert('请至少选择一个标签');
      return;
    }
    
    setIsSaving(true);
    
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 实际应用中，这里应该调用API保存博客
    console.log({
      title,
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600',
      summary: aiSummary || content.slice(0, 150) + '...',
      tags: selectedTags,
      date: new Date().toISOString().split('T')[0],
      author: '当前用户' // 实际应用中应从用户会话获取
    });
    
    setIsSaving(false);
    
    // 保存成功后跳转到博客列表页
    router.push('/blog');
  };

  // 设置示例封面图
  const setExampleCover = () => {
    const exampleCovers = [
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600',
      'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=600',
      'https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=600'
    ];
    setCoverImage(exampleCovers[Math.floor(Math.random() * exampleCovers.length)]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-content pb-20">
      {/* 顶部导航 */}
      <header className="sticky top-16 z-30 bg-white dark:bg-card shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <Link href="/blog">
              <span className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                <FaArrowLeft className="mr-2" /> 返回博客列表
              </span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <button 
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  aiSummary ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={handleAiSummarize}
                disabled={isGeneratingSummary || !content}
              >
                {isGeneratingSummary ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> 生成中...
                  </>
                ) : aiSummary ? (
                  <>
                    <FaCheck className="mr-2" /> AI已总结
                  </>
                ) : (
                  <>
                    <FaRobot className="mr-2" /> AI总结
                  </>
                )}
              </button>
              
              <button 
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 flex items-center"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> 保存中...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> 完成
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 编辑区域 */}
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {/* 封面图选择 */}
          <div 
            className="h-48 md:h-64 mb-6 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 relative cursor-pointer"
            onClick={setExampleCover}
          >
            {coverImage ? (
              <div className="w-full h-full relative">
                <img 
                  src={coverImage} 
                  alt="封面预览" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white bg-black/50 px-3 py-2 rounded-md">点击更换封面</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <FaImage className="text-3xl mb-2" />
                <p>点击设置封面图片</p>
              </div>
            )}
          </div>
          
          {/* 标题输入 */}
          <input
            type="text"
            placeholder="输入博客标题..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl md:text-4xl font-bold mb-6 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
          />
          
          {/* 标签选择 */}
          <div className="mb-6 relative">
            <div 
              className="flex items-center flex-wrap gap-2 border border-gray-300 dark:border-gray-700 rounded-lg p-3 cursor-pointer"
              onClick={() => setShowTagSelector(!showTagSelector)}
            >
              {selectedTags.length > 0 ? (
                selectedTags.map(tag => (
                  <span 
                    key={tag}
                    className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 dark:text-gray-600 flex items-center">
                  <FaTags className="mr-2" /> 选择标签（最多5个）
                </span>
              )}
            </div>
            
            {showTagSelector && (
              <motion.div 
                ref={tagSelectorRef}
                className="absolute top-full mt-2 z-20 w-full bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map(tag => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(tag);
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-2">
                  已选 {selectedTags.length}/5
                </p>
              </motion.div>
            )}
          </div>
          
          {/* AI摘要区域 */}
          {aiSummary && (
            <motion.div 
              className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 flex items-center mb-2">
                <FaRobot className="mr-2" /> AI总结
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {aiSummary}
              </p>
            </motion.div>
          )}
          
          {/* 内容编辑器 */}
          <textarea
            ref={contentRef}
            placeholder="开始撰写博客内容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[300px] p-2 bg-transparent border-none outline-none resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
} 