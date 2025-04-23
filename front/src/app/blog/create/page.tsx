'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaSave, FaTags, FaRobot, FaCheck, FaSpinner, FaImage, FaBook, FaFilm, FaMusic, FaPen, FaInfo } from 'react-icons/fa';
import { postApi } from '@/app/api/services/blogService';

// AI摘要生成函数
const aiSummarize = async (text: string): Promise<string> => {
  try {
    console.log('开始调用API生成摘要，内容长度:', text.length);
    
    // 首先测试连接
    try {
      const testResponse = await fetch('http://localhost:8080/api/summary/test');
      if (testResponse.ok) {
        console.log('连接测试成功:', await testResponse.text());
      } else {
        console.error('连接测试失败:', testResponse.status);
        return '无法连接到服务器，请检查后端服务是否正常运行';
      }
    } catch (error) {
      console.error('连接测试异常:', error);
      return '无法连接到服务器，请检查网络连接';
    }
    
    // 创建请求数据对象，包含摘要字数限制
    const requestData = {
      content: text,
      maxLength: 30 // 限制摘要最多30字
    };

    // 使用JSON格式发送请求
    const response = await fetch('http://localhost:8080/api/summary/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      console.error('API调用失败:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('错误详情:', errorText);
      return `摘要生成失败: ${response.status} - ${errorText || response.statusText}`;
    }
    
    const summaryText = await response.text();
    console.log('摘要生成成功，长度:', summaryText.length);
    
    // 确保摘要不超过30字
    const trimmedSummary = summaryText.length > 30 ? summaryText.substring(0, 30) + '...' : summaryText;
    return trimmedSummary || '摘要生成成功，但内容为空';
  } catch (error) {
    console.error('生成摘要时出错:', error);
    return '摘要生成失败，请稍后再试';
  }
};

// 标签选项
const tagOptions = [
  '人工智能', '文学评论', '电影', '音乐', '科技', 
  '历史', '哲学', '科学', '艺术', '社会', '教育',
  '心理学', '环境', '健康', '政治', '经济'
];

// 内容类型
type ContentType = 'book' | 'movie' | 'music';

// 内容类型配置
const contentTypeConfig = {
  book: {
    icon: <FaBook className="text-blue-500" />,
    label: '书籍评论',
    description: '分享你读过的好书',
    color: 'blue'
  },
  movie: {
    icon: <FaFilm className="text-red-500" />,
    label: '电影评论',
    description: '分享你看过的电影',
    color: 'red'
  },
  music: {
    icon: <FaMusic className="text-purple-500" />,
    label: '音乐评论',
    description: '分享你喜爱的音乐',
    color: 'purple'
  }
};

// 添加音乐风格标签
const musicStyleTags = [
  'Classical', 'Jazz', 'R&B', 'Soul/Neo Soul', 'Rock', 'Funk', 'Ballet', 'Else'
];

// 添加电影类型标签
const movieGenreTags = [
  '动作', '冒险', '喜剧', '剧情', '恐怖', '科幻', 
  '奇幻', '动画', '纪录片', '爱情', '悬疑', '惊悚'
];

export default function CreateBlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('book');
  const [contentLink, setContentLink] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // 编辑模式状态
  const [isEditMode, setIsEditMode] = useState(false);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  
  // 音乐评论特定字段
  const [artistName, setArtistName] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [musicStyles, setMusicStyles] = useState<string[]>([]);
  const [albumImageUrl, setAlbumImageUrl] = useState('');
  const [isUploadingAlbumImage, setIsUploadingAlbumImage] = useState(false);
  
  // 添加电影相关状态
  const [movieTitle, setMovieTitle] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [moviePoster, setMoviePoster] = useState('');
  const [movieGenres, setMovieGenres] = useState<string[]>([]);
  const [isUploadingMoviePoster, setIsUploadingMoviePoster] = useState(false);
  const moviePosterInputRef = useRef<HTMLInputElement>(null);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const tagSelectorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const albumImageInputRef = useRef<HTMLInputElement>(null);

  // 从URL参数获取内容类型和编辑模式
  useEffect(() => {
    // 检查是否在客户端环境
    if (typeof window !== 'undefined') {
      // 获取内容类型
      const typeParam = searchParams.get('type');
      console.log('URL参数类型:', typeParam);
      if (typeParam && ['book', 'movie', 'music'].includes(typeParam)) {
        setContentType(typeParam as ContentType);
        console.log('设置内容类型为:', typeParam);
      }
      
      // 检查是否是编辑模式
      const editParam = searchParams.get('edit');
      if (editParam) {
        setIsEditMode(true);
        setEditPostId(editParam);
        console.log('编辑模式, 博客ID:', editParam);
      }
    }
  }, [searchParams]);

  // 在编辑模式下加载博客数据
  useEffect(() => {
    const loadPostData = async () => {
      if (!isEditMode || !editPostId) return;
      
      setIsLoadingPost(true);
      try {
        console.log('加载博客数据, ID:', editPostId);
        const response = await postApi.getPostById(editPostId);
        console.log('博客数据加载成功:', response);
        
        if (response && (response.data || response)) {
          const postData = response.data || response;
          
          // 填充表单数据
          setTitle(postData.title || '');
          setContent(postData.content || '');
          setCoverImage(postData.coverImageUrl || '');
          setAiSummary(postData.summary || '');
          setContentLink(postData.contentLink || '');
          
          // 设置内容类型
          if (postData.contentType && ['book', 'movie', 'music'].includes(postData.contentType)) {
            setContentType(postData.contentType as ContentType);
          }
          
          // 设置标签
          if (postData.tags) {
            if (postData.contentType === 'music') {
              // 音乐风格标签
              const styles = postData.tags.map((tag: any) => 
                typeof tag === 'string' ? tag : tag.name
              ).filter(Boolean);
              setMusicStyles(styles);
            } else if (postData.contentType === 'movie') {
              // 电影类型标签
              const genres = postData.tags.map((tag: any) => 
                typeof tag === 'string' ? tag : tag.name
              ).filter(Boolean);
              setMovieGenres(genres);
              
              // 电影特定字段
              setMovieTitle(postData.movieTitle || '');
              setMovieYear(postData.movieYear || '');
              setMoviePoster(postData.moviePoster || '');
            } else {
              // 普通标签
              const tags = postData.tags.map((tag: any) => 
                typeof tag === 'string' ? tag : tag.name
              ).filter(Boolean);
              setSelectedTags(tags);
            }
          }
          
          // 音乐特定字段
          if (postData.contentType === 'music') {
            setArtistName(postData.artistName || '');
            setAlbumName(postData.albumName || '');
            setAlbumImageUrl(postData.albumImageUrl || '');
          }
          
          console.log('博客数据填充完成');
        } else {
          console.error('无法获取博客数据或数据格式不正确');
          alert('无法加载博客内容，请稍后重试');
        }
      } catch (error) {
        console.error('加载博客数据失败:', error);
        alert('加载博客数据失败，请稍后重试');
      } finally {
        setIsLoadingPost(false);
      }
    };
    
    loadPostData();
  }, [isEditMode, editPostId]);

  // 当内容类型改变时，自动聚焦到标题
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [contentType]);

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
      contentRef.current.style.height = `${Math.max(300, contentRef.current.scrollHeight)}px`;
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

  // 处理音乐风格标签选择
  const toggleMusicStyle = (style: string) => {
    if (musicStyles.includes(style)) {
      setMusicStyles(musicStyles.filter(s => s !== style));
    } else {
      setMusicStyles([...musicStyles, style]);
    }
  }

  // 处理电影类型选择
  const toggleMovieGenre = (genre: string) => {
    if (movieGenres.includes(genre)) {
      setMovieGenres(movieGenres.filter(g => g !== genre));
    } else {
      setMovieGenres([...movieGenres, genre]);
    }
  };

  // 处理AI总结
  const handleAiSummarize = async () => {
    if (!content || content.length === 0) {
      alert('请先输入内容以便AI生成摘要');
      return;
    }
    
    setIsGeneratingSummary(true);
    try {
      console.log('开始生成摘要，内容长度:', content.length);
      const summary = await aiSummarize(content);
      console.log('获得摘要结果:', summary);
      setAiSummary(summary);
      
      // 如果生成成功且不是错误消息，显示成功提示
      if (!summary.includes('失败') && !summary.includes('无法连接')) {
        // 可选：显示成功提示
      }
    } catch (error) {
      console.error('生成摘要时出错:', error);
      alert('生成摘要时出错，请稍后再试');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // 处理专辑图片上传
  const handleAlbumImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件');
      return;
    }
    
    // 验证文件大小 (10MB 限制)
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过10MB');
      return;
    }
    
    setIsUploadingAlbumImage(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8080/api/files/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`上传失败: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.code === 0 && result.data.url) {
        // 设置专辑图片URL
        setAlbumImageUrl(`http://localhost:8080${result.data.url}`);
      } else {
        throw new Error('上传失败: ' + result.message);
      }
    } catch (error: any) {
      console.error('图片上传失败:', error);
      alert(`上传失败: ${error.message}`);
    } finally {
      setIsUploadingAlbumImage(false);
      // 清空文件输入，以便用户可以再次选择同一文件
      if (albumImageInputRef.current) {
        albumImageInputRef.current.value = '';
      }
    }
  };

  // 处理电影海报上传
  const handleMoviePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }
    
    // 处理图片上传
    setIsUploadingMoviePoster(true);
    
    try {
      // 使用FileReader直接读取图片数据，而不是上传到服务器
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const imageUrl = event.target.result as string;
          setMoviePoster(imageUrl);
          setCoverImage(imageUrl); // 同时设置为封面图片
          console.log('电影海报已设置为封面图片');
          setIsUploadingMoviePoster(false);
        }
      };
      
      reader.onerror = () => {
        console.error('读取图片失败');
        alert('读取图片失败，请重试');
        setIsUploadingMoviePoster(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('处理图片时出错:', error);
      alert('处理图片失败，请稍后重试');
      setIsUploadingMoviePoster(false);
      
      // 设置默认电影海报
      const defaultPoster = 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
      setMoviePoster(defaultPoster);
      setCoverImage(defaultPoster);
    }
  };

  // 保存博客文章
  const handleSave = async () => {
    // 根据内容类型验证不同的字段
    if (contentType === 'music') {
      if (!artistName.trim()) {
        alert('请输入艺术家名称');
        return;
      }
      
      if (musicStyles.length === 0) {
        alert('请至少选择一个音乐风格');
        return;
      }
    } else if (contentType === 'movie') {
      if (!movieTitle.trim()) {
        alert('请输入电影名称');
        return;
      }
      
      if (!movieYear.trim()) {
        alert('请输入电影年份');
        return;
      }
      
      if (!moviePoster) {
        alert('请上传电影海报');
        return;
      }
      
      if (movieGenres.length === 0) {
        alert('请至少选择一个电影类型');
        return;
      }
    } else {
      // 非音乐内容类型才检查标题
      if (!title.trim()) {
        alert('请输入标题');
        return;
      }
      
      if (!content.trim() || content.length < 100) {
        alert('请输入至少100个字符的内容');
      return;
      }
    }
    
    setIsSaving(true);
    
    try {
      // 准备提交的数据
      const blogData = {
        title: contentType === 'movie' ? movieTitle : title,
        content,
        summary: aiSummary || content.substring(0, 100) + '...',
        tags: contentType === 'music' ? musicStyles : contentType === 'movie' ? movieGenres : selectedTags,
        contentLink,
        contentType,
        // 根据内容类型添加不同的元数据
        ...(contentType === 'music' && {
          artistName,
          albumName,
          albumImageUrl
        }),
        ...(contentType === 'movie' && {
          movieTitle,
          movieYear,
          moviePoster,
          director: '', // 可以添加导演字段，这里默认为空
          rating: 0 // 可以添加评分字段，这里默认为0
        }),
        // 根据内容类型设置封面图片
        coverImageUrl: contentType === 'music' && albumImageUrl 
          ? albumImageUrl 
          : contentType === 'movie' && moviePoster
            ? moviePoster
            : coverImage
      };

      console.log('保存的博客数据:', blogData);

      // 调用API保存博客
      let result;
      if (isEditMode && editPostId) {
        // 更新现有博客
        console.log('更新现有博客, ID:', editPostId);
        result = await postApi.updatePost(editPostId, blogData);
        console.log('博客更新成功:', result);
      } else {
        // 创建新博客
        console.log('创建新博客');
        result = await postApi.createPost(blogData);
        console.log('博客创建成功:', result);
      }

      // 显示成功消息
      setShowSuccessMessage(true);

      // 根据内容类型决定跳转位置
      let redirectPath = '/blog';
      if (contentType === 'music') {
        redirectPath = '/music';
      } else if (contentType === 'movie') {
        redirectPath = '/movie'; 
      } else if (contentType === 'book') {
        redirectPath = '/book';
      }
                         
      console.log(`${isEditMode ? '更新' : '创建'}成功，将在3秒后跳转到: ${redirectPath}`);

      // 3秒后重定向到相应页面
      setTimeout(() => {
        router.push(redirectPath);
      }, 3000);
    } catch (error: any) {
      console.error(`${isEditMode ? '更新' : '保存'}博客时出错:`, error);
      alert(`${isEditMode ? '更新' : '保存'}失败: ${error.message}`);
    } finally {
    setIsSaving(false);
    }
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

  // 获取摘要显示内容
  const getSummaryDisplay = () => {
    if (isGeneratingSummary) {
      return (
        <motion.div 
          className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 flex items-center mb-2">
            <FaRobot className="mr-2" /> AI总结生成中
          </h3>
          <div className="flex flex-col space-y-2">
            {/* 矩阵式加载指示器 */}
            <div className="h-4 w-full relative overflow-hidden">
              <div className="absolute inset-0 flex space-x-1">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-green-200 dark:bg-green-800/40 rounded-sm"
                    initial={{ height: '30%' }}
                    animate={{ 
                      height: ['30%', '100%', '30%'],
                      transition: { 
                        repeat: Infinity,
                        duration: 1.5,
                        delay: i * 0.06,
                        ease: [0.4, 0.0, 0.2, 1]
                      }
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* 向量轨迹 */}
            <div className="h-2 w-full bg-green-100 dark:bg-green-900/40 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-400" 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut" 
                }}
                style={{ width: '50%' }}
              />
            </div>
            
            <div className="flex justify-between items-center text-xs text-green-600 dark:text-green-400 font-mono">
              <span>正在解析内容向量...</span>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                思维计算中
              </motion.span>
            </div>
          </div>
        </motion.div>
      );
    }
    
    if (aiSummary) {
      // 检查是否是本地生成的摘要（不再使用固定字符串判断）
      const isLocalGenerated = aiSummary.startsWith("内容为空") || 
                              aiSummary.includes("生成摘要时出错") || 
                              aiSummary.includes("无法连接");
      
      return (
        <motion.div 
          className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 flex items-center mb-3">
            <FaRobot className="mr-2" /> AI生成摘要
          </h3>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-100 dark:border-green-900/30">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {aiSummary}
            </p>
          </div>
          {isLocalGenerated && (
            <p className="text-xs text-gray-500 mt-2 italic flex items-center">
              <FaInfo className="mr-1" /> 使用了本地备用摘要功能，非AI生成
            </p>
          )}
        </motion.div>
      );
    }
    
    return null;
  };

  // 获取当前内容类型配置
  const currentTypeConfig = contentTypeConfig[contentType];
  
  // 当前内容类型下的背景渐变颜色
  const gradientColors = {
    blue: 'from-blue-600 to-indigo-600',
    red: 'from-red-600 to-pink-600',
    purple: 'from-purple-600 to-pink-600'
  };

  // 加载中状态
  if (isLoadingPost) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">正在加载博客数据...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 成功保存提示 */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl max-w-md w-full mx-4 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <FaCheck className="text-3xl text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {isEditMode ? '更新成功!' : '保存成功!'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                您的{currentTypeConfig.label}已成功{isEditMode ? '更新' : '保存'}，即将跳转到{contentType === 'music' ? '音乐列表' : contentType === 'movie' ? '电影列表' : contentType === 'book' ? '书籍列表' : '博客列表'}...
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部导航 */}
      <header className="sticky top-16 z-30 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href={contentType === 'book' ? "/book" : contentType === 'movie' ? "/movie" : "/music"}>
              <span className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2 group-hover:-translate-x-1 transition-transform">
                  <FaArrowLeft className="text-gray-500 dark:text-gray-400" />
                </span>
                返回{contentType === 'book' ? "书籍" : contentType === 'movie' ? "电影" : "音乐"}页面
              </span>
            </Link>
            
            {/* 美化元素代替原来的按钮 */}
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-purple-800/30 flex items-center shadow-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className={`w-3 h-3 rounded-full mr-2 bg-gradient-to-r ${gradientColors[currentTypeConfig.color as keyof typeof gradientColors]} animate-pulse`}></div>
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isEditMode ? '编辑' : '创作'}{currentTypeConfig.label}
              </span>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        {/* 内容类型选择器 - 编辑模式下隐藏 */}
        {!isEditMode && (
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              {(Object.keys(contentTypeConfig) as ContentType[]).map((type) => (
                <motion.button
                  key={type}
                  type="button"
                  onClick={() => setContentType(type)}
                  className={`relative flex flex-col items-center justify-center py-5 px-4 rounded-xl border-2 transition-all h-full ${
                    contentType === type
                      ? `border-${contentTypeConfig[type].color as string}-500 bg-${contentTypeConfig[type].color as string}-50 dark:bg-${contentTypeConfig[type].color as string}-900/20`
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className={`text-3xl mb-3 ${contentType === type ? `text-${contentTypeConfig[type].color as string}-500` : 'text-gray-400 dark:text-gray-500'}`}>
                    {contentTypeConfig[type].icon}
                  </div>
                  <h3 className={`text-base font-medium ${contentType === type ? 'text-gray-800 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {contentTypeConfig[type].label}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {contentTypeConfig[type].description}
                  </p>
                  {contentType === type && (
                    <motion.div 
                      className="absolute -right-1 -top-1 w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <FaCheck className="text-white text-xs" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
                </div>
              </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 max-w-3xl mx-auto">
          {/* 标题区域 */}
          <div className={`bg-gradient-to-r ${gradientColors[currentTypeConfig.color as keyof typeof gradientColors]} p-8`}>
            {contentType === 'music' ? (
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                创建专辑评论
              </h1>
            ) : contentType === 'movie' ? (
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                创建电影评论
              </h1>
            ) : (
              <input
                ref={titleRef}
                type="text"
                placeholder={`请输入${currentTypeConfig.label}标题...`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none outline-none text-white placeholder-white/70 focus:placeholder-white/50"
              />
            )}
          </div>
          
          <div className="p-8">
            {/* 内容链接 */}
            <div className="mb-8 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                {currentTypeConfig.icon}
                <span className="ml-2">{contentTypeConfig[contentType].label}信息</span>
              </h3>
              
              {contentType === 'music' ? (
                <div className="space-y-4">
                  {/* 专辑名称放在最上方 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      专辑名称
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                        placeholder="专辑名称"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-900 dark:text-white text-lg font-medium"
                      />
                    </div>
                  </div>
                  
                  {/* 艺术家名称放在专辑名称下方 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      艺术家
                    </label>
                    <div className="relative">
          <input
            type="text"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        placeholder="艺术家名称"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      专辑封面
                    </label>
                    <div className="relative">
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer flex-shrink-0">
                          <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/60 transition-colors">
                            选择图片
                          </span>
                          <input 
                            type="file" 
                            ref={albumImageInputRef}
                            accept="image/*"
                            onChange={handleAlbumImageUpload}
                            className="hidden" 
                          />
                        </label>
                      </div>
                      {isUploadingAlbumImage && (
                        <div className="mt-3 flex items-center text-sm text-purple-600">
                          <FaSpinner className="animate-spin mr-2" />
                          正在上传图片...
                        </div>
                      )}
                      {albumImageUrl && (
                        <div className="mt-3 aspect-square w-36 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                          <Image 
                            src={albumImageUrl}
                            alt="专辑封面"
                            fill
                            style={{ objectFit: 'cover' }}
                            onError={() => {
                              setAlbumImageUrl('');
                              alert('无法加载图片，请检查URL是否正确');
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
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
                </div>
              ) : contentType === 'movie' ? (
                <div className="space-y-4">
                  {/* 电影名称 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      电影名称
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={movieTitle}
                        onChange={(e) => setMovieTitle(e.target.value)}
                        placeholder="电影名称"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-900 dark:text-white text-lg font-medium"
                      />
                    </div>
                  </div>
                  
                  {/* 电影年份 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      上映年份
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={movieYear}
                        onChange={(e) => setMovieYear(e.target.value)}
                        placeholder="如：2023"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  {/* 电影海报 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      电影海报
                    </label>
                    <div className="relative">
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer flex-shrink-0">
                          <span className="inline-block px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors">
                            选择图片
                          </span>
                          <input 
                            type="file" 
                            ref={moviePosterInputRef}
                            accept="image/*"
                            onChange={handleMoviePosterUpload}
                            className="hidden" 
                          />
                        </label>
                      </div>
                      {isUploadingMoviePoster && (
                        <div className="mt-3 flex items-center text-sm text-red-600">
                          <FaSpinner className="animate-spin mr-2" />
                          正在上传图片...
                        </div>
                      )}
                      {moviePoster && (
                        <div className="mt-3 aspect-[2/3] w-36 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                          <Image 
                            src={moviePoster}
                            alt="电影海报"
                            fill
                            style={{ objectFit: 'cover' }}
                            onError={() => {
                              setMoviePoster('');
                              alert('无法加载图片，请检查URL是否正确');
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 电影类型 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      电影类型
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {movieGenreTags.map(genre => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleMovieGenre(genre)}
                          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                            movieGenres.includes(genre)
                              ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium'
                              : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    链接到{contentType === 'book' ? '书籍' : '音乐'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={contentLink}
                      onChange={(e) => setContentLink(e.target.value)}
                      className="w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                      placeholder={`输入${contentType === 'book' ? '书籍' : '音乐'}页面URL链接`}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {currentTypeConfig.icon}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    从{contentType === 'book' ? '书籍' : '音乐'}页面复制链接，或直接输入ID
                  </p>
                </div>
              )}
            </div>
            
            {/* 博客内容 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {contentType === 'music' ? '乐评内容' : '内容'}
              </label>
              <div className="relative">
                <textarea
                  ref={contentRef}
                  placeholder={contentType === 'music' ? '写下对这首音乐的感想...' : `开始写${currentTypeConfig.label}内容...`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[300px] p-5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none transition-all"
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {content.length} 字符
                </div>
              </div>
            </div>
            
            {/* AI生成的摘要 */}
            {getSummaryDisplay()}
            
            {/* 封面图片设置 - 音乐类型和电影类型不显示 */}
            {contentType !== 'music' && contentType !== 'movie' && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <FaImage className="mr-2" /> 封面图片
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="输入封面图片URL"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full pl-10 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <FaImage className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <motion.button
                      onClick={setExampleCover}
                      className="w-full h-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaImage className="mr-2" /> 随机封面图片
                    </motion.button>
                  </div>
                </div>
                
                {coverImage && (
                  <div className="mt-4 relative aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                    <Image 
                      src={coverImage}
                      alt="封面预览"
                      fill
                      style={{ objectFit: 'cover' }}
                      onError={() => {
                        setCoverImage('');
                        alert('无法加载图片，请检查URL是否正确');
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* 标签选择 - 音乐和电影类型不显示，因为已经有专用标签 */}
            {contentType !== 'music' && contentType !== 'movie' && (
              <div className="mb-4 relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <FaTags className="mr-2" /> 内容标签 
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400">
                    已选 {selectedTags.length}/5
                  </span>
                </label>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map(tag => (
                    <motion.span 
                      key={tag}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm flex items-center shadow-sm"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      layout
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="ml-2 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700"
                      >
                        ×
                    </button>
                    </motion.span>
                  ))}
                </div>
                
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowTagSelector(!showTagSelector)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between shadow-sm transition-all"
                  >
                    <span className="flex items-center">
                      <FaTags className="mr-2 text-gray-400" />
                      {selectedTags.length === 0 ? '选择标签' : '添加或移除标签'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform ${showTagSelector ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {showTagSelector && (
                      <motion.div 
                        ref={tagSelectorRef}
                        className="absolute mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10 w-full max-h-[300px] overflow-y-auto"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {tagOptions.map(tag => (
                            <motion.button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              disabled={selectedTags.length >= 5 && !selectedTags.includes(tag)}
                              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                                selectedTags.includes(tag)
                                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium'
                                  : selectedTags.length >= 5
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                              whileHover={selectedTags.length < 5 || selectedTags.includes(tag) ? { scale: 1.05 } : {}}
                              whileTap={selectedTags.length < 5 || selectedTags.includes(tag) ? { scale: 0.95 } : {}}
                            >
                              {tag}
                            </motion.button>
                          ))}
                        </div>
              </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
            
            {/* 底部操作按钮 - 移到内容标签下方 */}
            <div className="mt-10 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentType === 'music' ? (
                // 乐评特定按钮
                <>
                  <button 
                    className={`relative overflow-hidden flex items-center justify-center px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                      aiSummary 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : isGeneratingSummary
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={handleAiSummarize}
                    disabled={isGeneratingSummary}
                  >
                    {isGeneratingSummary ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        生成中...
                      </>
                    ) : aiSummary ? (
                      <>
                        <FaCheck className="mr-2" />
                        已生成摘要
                      </>
                    ) : (
                      <>
                        <FaRobot className="mr-2" />
                        AI生成摘要
                      </>
                    )}
                  </button>
                  
                  <motion.button 
                    className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-base font-medium"
                    onClick={handleSave}
                    disabled={isSaving || !artistName || musicStyles.length === 0}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isSaving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> 
                        保存中...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> 
                        发布乐评
                      </>
                    )}
                  </motion.button>
                </>
              ) : contentType === 'movie' ? (
                // 电影特定按钮
                <>
                  <button 
                    className={`relative overflow-hidden flex items-center justify-center px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                      aiSummary 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : isGeneratingSummary
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={handleAiSummarize}
                    disabled={isGeneratingSummary || content.length < 50}
                  >
                    {isGeneratingSummary ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        生成中...
                      </>
                    ) : aiSummary ? (
                      <>
                        <FaCheck className="mr-2" />
                        已生成摘要
                      </>
                    ) : (
                      <>
                        <FaRobot className="mr-2" />
                        AI生成摘要
                      </>
                    )}
                  </button>
                  
                  <motion.button 
                    className={`flex items-center justify-center bg-gradient-to-r ${gradientColors[currentTypeConfig.color as keyof typeof gradientColors]} text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-base font-medium`}
                    onClick={handleSave}
                    disabled={isSaving || !movieTitle || content.length < 100 || movieGenres.length === 0}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isSaving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> 
                        保存中...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> 
                        发布电影评论
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                // 原有按钮
                <>
                  <button 
                    className={`relative overflow-hidden flex items-center justify-center px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                      aiSummary 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : isGeneratingSummary
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={handleAiSummarize}
                    disabled={isGeneratingSummary || content.length < 50}
                  >
                    {isGeneratingSummary ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        生成中...
                      </>
                    ) : aiSummary ? (
                      <>
                        <FaCheck className="mr-2" />
                        已生成摘要
                      </>
                    ) : (
                      <>
                        <FaRobot className="mr-2" />
                        AI生成摘要
                      </>
                    )}
                  </button>
                  
                  <motion.button 
                    className={`flex items-center justify-center bg-gradient-to-r ${gradientColors[currentTypeConfig.color as keyof typeof gradientColors]} text-white px-8 py-3 rounded-xl shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-base font-medium`}
                    onClick={handleSave}
                    disabled={isSaving || !title || content.length < 100 || selectedTags.length === 0}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isSaving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> 
                        保存中...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> 
                        发布{currentTypeConfig.label}
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 