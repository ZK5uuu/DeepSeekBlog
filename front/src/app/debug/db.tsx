"use client";

import { useState, useEffect } from 'react';
import { postApi } from '../api/services/blogService';
import Link from 'next/link';

export default function DBPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 获取所有文章
        console.log('获取所有博客文章...');
        const response = await postApi.getPostList({});
        console.log('所有文章响应:', response);
        
        const allPosts = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.content || []);
        
        setPosts(allPosts);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError('获取数据失败，请查看控制台了解详情');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-800 text-white py-8 px-4">
      <div className="max-w-full mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-xl font-mono">数据库表内容</h1>
          <div>
            <Link href="/debug" className="text-blue-400 hover:text-blue-300 mr-4 text-sm">
              返回调试页面
            </Link>
            <Link href="/" className="text-gray-400 hover:text-gray-300 text-sm">
              返回首页
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 border border-gray-700 shadow-lg">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <th className="px-3 py-2 text-left text-xs font-mono border-r border-gray-700">id</th>
                  <th className="px-3 py-2 text-left text-xs font-mono border-r border-gray-700">title</th>
                  <th className="px-3 py-2 text-left text-xs font-mono border-r border-gray-700">author_id</th>
                  <th className="px-3 py-2 text-left text-xs font-mono border-r border-gray-700">cover_image_url</th>
                  <th className="px-3 py-2 text-left text-xs font-mono border-r border-gray-700">summary</th>
                  <th className="px-3 py-2 text-left text-xs font-mono">content</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post: any, index: number) => (
                  <tr key={post.id} className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} hover:bg-gray-700`}>
                    <td className="px-3 py-2 text-sm font-mono border-r border-gray-700 whitespace-nowrap">{post.id}</td>
                    <td className="px-3 py-2 text-sm font-mono border-r border-gray-700 whitespace-nowrap">{post.title || ''}</td>
                    <td className="px-3 py-2 text-sm font-mono border-r border-gray-700 whitespace-nowrap">{post.userId || post.authorId || 1}</td>
                    <td className="px-3 py-2 text-sm font-mono border-r border-gray-700">
                      {post.coverImageUrl ? (
                        <div className="max-w-xs truncate">
                          {post.coverImageUrl}
                        </div>
                      ) : post.albumImageUrl ? (
                        <div className="max-w-xs truncate">
                          {post.albumImageUrl}
                        </div>
                      ) : ''}
                    </td>
                    <td className="px-3 py-2 text-sm font-mono border-r border-gray-700">
                      <div className="max-w-xs truncate">
                        {post.summary || ''}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm font-mono">
                      <div className="max-w-xs truncate">
                        {post.content || ''}
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-center text-gray-400">
                      没有找到数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 