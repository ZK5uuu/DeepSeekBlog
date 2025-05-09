"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { musicApi } from '../../../api/services/musicService';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaSave, FaUpload, FaTimes } from 'react-icons/fa';

interface MusicFormData {
  title: string;
  artist: string;
  album: string;
  genre: string[];
  description: string;
  cover: string;
}

export default function EditMusic({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<MusicFormData>({
    title: '',
    artist: '',
    album: '',
    genre: [],
    description: '',
    cover: '',
  });
  const [genreInput, setGenreInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setLoading(true);
        console.log('获取音乐详情用于编辑, ID:', params.id);
        
        // const response = await fetch(`/api/blogPost/${params.id}`);
        const response = await fetch(`http://localhost:8080/api/music/${params.id}`);
        if (!response.ok) {
          throw new Error(`获取数据失败: ${response.status}`);
        }
        
        const musicData = await response.json();
        console.log(musicData)
        if (musicData) {
          setFormData({
            title: musicData.data.title || '',
            artist: musicData.data.artist_name || '',
            album: musicData.data.album_name || '',
            genre: Array.isArray(musicData.tags) ? musicData.tags : [],
            description: musicData.summary || musicData.data.content || '',
            cover: musicData.album_image_url || '',
          });
          
          setPreviewImage(musicData.data.album_image_url || null);
        } else {
          setError('未找到音乐数据');
        }
      } catch (err) {
        console.error('获取音乐详情失败:', err);
        setError('获取音乐详情失败: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMusicData();
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genre.includes(genreInput.trim())) {
      setFormData(prev => ({
        ...prev,
        genre: [...prev.genre, genreInput.trim()]
      }));
      setGenreInput('');
    }
  };

  const handleRemoveGenre = (index: number) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 在实际项目中，这里应该上传图片到服务器或云存储
      // 这里仅做本地预览
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData(prev => ({ ...prev, cover: file.name })); // 实际中应该是图片URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.artist) {
      toast.error('标题和艺术家是必填项');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // 准备提交数据
      // const submitData = {
      //   id: parseInt(params.id),
      //   title: formData.title,
      //   artist_name: formData.artist,
      //   album_name: formData.album,
      //   tags: formData.genre,
      //   summary: formData.description,
      //   content: formData.description,
      //   album_image_url: previewImage || formData.cover,
      //   content_type: 'music_blogs'
      // };
      const submitData = {
        id: parseInt(params.id),
        title: formData.title,
        artistName: formData.artist,
        albumName: formData.album,
        tags: formData.genre,
        summary: formData.description,
        content: formData.description,
        albumImageUrl: previewImage || formData.cover,
        contentType: 'music_blogs'
      };
      
      console.log(`准备更新音乐数据: ID=${params.id}`, submitData);
      
      // 尝试不同的API路径
      // 注意: 使用不同的API路径，这里尝试直接访问原始API
      const response = await fetch(`http://localhost:8080/api/music/${params.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('更新失败:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`更新失败: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log('更新成功:', result);
      
      toast.success('音乐信息更新成功');
      
      // 延迟跳转，确保数据已完全保存
      setTimeout(() => {
        router.push(`/music/${params.id}`);
      }, 1000);
    } catch (error) {
      console.error('更新音乐信息失败:', error);
      toast.error('更新失败: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">正在加载音乐数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center text-white">
        <div className="text-center max-w-lg p-6 rounded-lg bg-gray-900 bg-opacity-50">
          <h2 className="text-2xl font-bold mb-4">加载失败</h2>
          <p className="mb-6">{error}</p>
          <Link href="/music" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            返回音乐列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 bg-indigo-900/80 border-b border-indigo-800">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">编辑音乐</h1>
              <Link href={`/music/${params.id}`} className="text-white hover:text-gray-300 transition-colors">
                <FaArrowLeft className="text-xl" />
              </Link>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                    音乐标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-white/20 border border-indigo-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入音乐标题"
                  />
                </div>
                
                <div>
                  <label htmlFor="artist" className="block text-sm font-medium text-white mb-1">
                    艺术家 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="artist"
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-white/20 border border-indigo-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入艺术家名称"
                  />
                </div>
                
                <div>
                  <label htmlFor="album" className="block text-sm font-medium text-white mb-1">
                    专辑名称
                  </label>
                  <input
                    type="text"
                    id="album"
                    name="album"
                    value={formData.album}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/20 border border-indigo-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入专辑名称"
                  />
                </div>
                
                {/* <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    风格标签
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={genreInput}
                      onChange={(e) => setGenreInput(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/20 border border-indigo-600/30 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="添加风格标签"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())}
                    />
                    <button
                      type="button"
                      onClick={handleAddGenre}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg transition-colors"
                    >
                      添加
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.genre.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-indigo-700/50 rounded-full text-sm text-white"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveGenre(index)}
                          className="ml-2 text-white/70 hover:text-white"
                        >
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div> */}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    封面图片
                  </label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-600/30 rounded-lg p-4 h-60 bg-white/5">
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={previewImage}
                          alt="封面预览"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImage(null)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                        <FaUpload className="text-3xl text-indigo-400 mb-2" />
                        <span className="text-indigo-300">点击或拖拽上传封面图片</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                    简介描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2 bg-white/20 border border-indigo-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="输入音乐描述或简介"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t border-indigo-800/30">
              <Link
                href={`/music/${params.id}`}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70"
              >
                <FaSave />
                {submitting ? '保存中...' : '保存修改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 