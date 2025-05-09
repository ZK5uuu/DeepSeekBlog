"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUser, FaArrowLeft, FaCompactDisc, FaMusic, FaRobot, FaEdit, FaTrash } from 'react-icons/fa';
import { musicApi } from '../../api/services/musicService';
import { toast } from 'react-hot-toast';

export default function MusicDetail({ params }: { params: { id: string } }) {
  const [music, setMusic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedMusic, setRelatedMusic] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 从localStorage获取用户角色
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    const fetchMusicDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('正在获取音乐详情, ID:', params.id);
        const response = await musicApi.getMusicById(params.id);
        console.log('获取到的音乐详情原始响应:', response);
        
        let musicPost = null;
        if (response.data && response.data.code === 200 && response.data.data) {
          musicPost = response.data.data;
        } else if (response.data) {
          musicPost = response.data;
        } else {
          musicPost = response;
        }
        
        console.log('处理后的音乐数据:', musicPost);
        
        if (musicPost) {
          const coverImage = musicPost.albumImageUrl || musicPost.album_image_url || 
                            musicPost.coverImageUrl || musicPost.cover_image_url;
          const artistName = musicPost.artistName || musicPost.artist_name || '未知艺术家';
          const albumName = musicPost.albumName || musicPost.album_name || musicPost.title || '未知专辑';
          
          const formattedMusic = {
            id: musicPost.id?.toString() || params.id,
            title: musicPost.title || albumName,
            content: musicPost.content || '',
            cover: coverImage,
            artist: artistName,
            album: albumName,
            genre: musicPost.tags ? 
              (Array.isArray(musicPost.tags) ? 
                musicPost.tags.map((tag: any) => typeof tag === 'string' ? tag : tag.name || '未分类') : 
                ['未分类']) : 
              (musicPost.music_styles || ['未分类']),
            description: musicPost.summary || (musicPost.content ? musicPost.content.substring(0, 100) + '...' : '暂无描述'),
            createTime: musicPost.createdAt || musicPost.created_at,
            viewCount: musicPost.viewCount || musicPost.view_count || 0,
            likeCount: musicPost.likeCount || musicPost.like_count || 0,
          };
          
          setMusic(formattedMusic);
          console.log('格式化后的音乐数据:', formattedMusic);
          
          try {
            const relatedResponse = await musicApi.getAllMusic();
            console.log('相关音乐响应:', relatedResponse);
            
            let relatedData = [];
            if (relatedResponse.data && relatedResponse.data.code === 200 && relatedResponse.data.data) {
              relatedData = relatedResponse.data.data;
            } else if (relatedResponse.data && Array.isArray(relatedResponse.data)) {
              relatedData = relatedResponse.data;
            } else if (Array.isArray(relatedResponse)) {
              relatedData = relatedResponse;
            }
            
            if (relatedData.length > 0) {
              const otherMusic = relatedData
                .filter((item: any) => item.id?.toString() !== params.id)
                .slice(0, 3)
                .map((item: any) => ({
                  id: item.id?.toString(),
                  title: item.title || item.albumName || item.album_name || '未知标题',
                  artist: item.artistName || item.artist_name || '未知艺术家',
                  album: item.albumName || item.album_name || item.title || '未知专辑',
                  cover: item.albumImageUrl || item.album_image_url || item.coverImageUrl || item.cover_image_url || '/images/default-album.jpg'
                }));
              
              setRelatedMusic(otherMusic);
            }
          } catch (relatedErr) {
            console.error('获取相关音乐失败:', relatedErr);
          }
        } else {
          setError('未找到音乐详情或数据格式异常');
        }
      } catch (err) {
        console.error('获取音乐详情失败:', err);
        setError('获取音乐详情失败: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMusicDetail();
      try {
        musicApi.incrementViewCount(params.id);
      } catch (err) {
        console.error('增加浏览量失败:', err);
      }
    }
  }, [params.id]);

  // 检查是否是管理员 - 只有管理员才能编辑和删除
  const isAdmin = userRole === 'admin';
  console.log("==========")
  console.log("=====userRole=====", userRole)
  console.log("==========")
  
  // 检查是否为ID为29的页面，如果不是或者是管理员，则显示按钮
  // const shouldShowButtons = isAdmin || params.id !== '29';
  const shouldShowButtons = isAdmin;

  const generateAiSummary = async () => {
    if (!music) return;
    
    setGeneratingSummary(true);
    try {
      // 模拟AI生成总结
      // 实际项目中，这里应该调用后端API来获取AI总结
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const summary = `《${music.title}》是${music.artist}创作的${music.genre?.join('、') || ''}风格音乐作品。
      这首作品融合了多元化的音乐元素，展现了艺术家独特的音乐才华和创作理念。
      作为${music.artist}代表作品之一，它以独特的旋律和节奏展现了艺术家深厚的音乐造诣。`;
      
      setAiSummary(summary);
    } catch (error) {
      console.error('生成AI总结失败:', error);
    } finally {
      setGeneratingSummary(false);
    }
  };

  // 删除处理函数
  const handleDelete = async () => {
    if (window.confirm('确定要删除这个音乐吗？')) {
      try {
        setDeleting(true);
        console.log(`删除音乐ID: ${params.id}`);
        
        // 使用正确的API路径删除记录
        const response = await fetch(`http://localhost:8080/api/music/${params.id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log('删除请求状态码:', response.status);
        
        if (!response.ok) {
          const responseText = await response.text();
          console.error('删除请求失败:', responseText);
          throw new Error(`服务器响应错误: ${response.status}`);
        }
        
        toast.success('音乐删除成功');
        
        // 延迟跳转，确保数据已完全删除
        setTimeout(() => {
          router.push('/music');
        }, 1000);
      } catch (error) {
        console.error('删除音乐失败:', error);
        toast.error('删除失败: ' + (error instanceof Error ? error.message : String(error)));
      } finally {
        setDeleting(false);
      }
    }
  };

  // 编辑处理函数
  const handleEdit = () => {
    router.push(`/music/edit/${params.id}`);
  };

  // 处理登录
  const handleLogin = () => {
    router.push('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">正在加载音乐详情...</p>
        <Link href="/music" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          返回音乐列表
        </Link>
      </div>
    </div>
  );

  if (error || !music) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex items-center justify-center">
      <div className="text-center max-w-lg p-6 rounded-lg bg-gray-900 bg-opacity-50">
        <h2 className="text-2xl font-bold mb-4">😢 未找到音乐</h2>
        <p className="mb-6">{error || '无法加载该音乐详情，可能已被删除或ID不存在'}</p>
        <Link href="/music" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          返回音乐列表
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black pb-20">
      <div className="absolute top-0 left-0 w-full h-96 overflow-hidden z-0">
        <div className="relative w-full h-full blur-xl opacity-40">
          <Image
            src={music.cover || '/images/default-album.jpg'}
            alt={music.title}
            fill
            style={{objectFit: 'cover'}}
            priority
          />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-16 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <Link href="/music" className="text-white hover:text-gray-300 transition-colors inline-flex items-center">
            <FaArrowLeft className="mr-2" /> 
            {/* 返回音乐列表 */}
            返回博客列表
          </Link>
          
          <div className="flex gap-3">
            {!userRole && (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 bg-blue-600/70 hover:bg-blue-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
                title="登录"
              >
                登录
              </button>
            )}
            
            {shouldShowButtons && (
              <>
                <button 
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-purple-600/70 hover:bg-purple-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
                  title="编辑"
                >
                  <FaEdit /> 编辑
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 bg-red-600/70 hover:bg-red-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50"
                  title="删除"
                >
                  <FaTrash /> {deleting ? '删除中...' : '删除'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/3 aspect-square">
                    <Image
                src={music.cover || '/images/default-album.jpg'}
                alt={music.title}
                fill
                style={{objectFit: 'cover'}}
                priority
                className="transition-transform hover:scale-105"
              />
            </div>
            
            <div className="p-8 flex flex-col justify-between w-full md:w-2/3">
              <div>
                <div className="flex items-center mb-1">
                  <FaMusic className="text-purple-400 mr-2" />
                  <span className="text-purple-300 text-sm font-medium">音乐</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{music.title}</h1>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center">
                    <FaUser className="text-2xl text-purple-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-purple-300">艺术家</h3>
                      <p className="text-xl text-white">{music.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FaCompactDisc className="text-2xl text-purple-400 mr-3" />
                  <div>
                      <h3 className="text-sm font-medium text-purple-300">专辑名称</h3>
                      <p className="text-xl text-white">{music.album}</p>
                  </div>
                </div>
              </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {music.genre && music.genre.map((genre: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-purple-700/50 rounded-full text-sm text-white">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-white/70 text-sm">
                <span>{formatDate(music.createTime)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">简评</h2>
            <button 
              onClick={generateAiSummary} 
              disabled={generatingSummary}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-70"
            >
              <FaRobot className="text-lg" />
              {generatingSummary ? '生成中...' : 'AI总结'}
            </button>
          </div>
          
          <div className="prose prose-lg prose-invert max-w-none mb-4">
            {aiSummary ? (
              <div className="bg-indigo-900/50 border border-indigo-700/50 rounded-xl p-4">
                <p className="text-white/90 leading-relaxed whitespace-pre-line">{aiSummary}</p>
              </div>
            ) : (
              <p className="text-white/90">
                {music.description || `这是${music.artist}的作品《${music.title}》，收录于专辑《${music.album}》。`}
              </p>
            )}
          </div>
        </div>
        
      {relatedMusic.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-white">您可能还喜欢</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedMusic.map(relatedItem => (
                <Link key={relatedItem.id} href={`/music/${relatedItem.id}`}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all hover:shadow-xl group">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={relatedItem.cover || '/images/default-album.jpg'}
                        alt={relatedItem.title}
                        fill
                        style={{objectFit: 'cover'}}
                        className="transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white truncate">{relatedItem.title}</h3>
                      <p className="text-gray-300">{relatedItem.artist}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
      )}
      </div>
    </div>
  );
} 

// 日期格式化函数
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '未知日期';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '未知日期';
    return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
  } catch (error) {
    console.error('日期格式化错误', dateString, error);
    return '未知日期';
  }
}; 