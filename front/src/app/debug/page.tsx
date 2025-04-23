"use client";
import React, { useState } from 'react';
import { postApi } from '../api/services/blogService';

export default function DebugPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testGetAllPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.getAllPosts();
      console.log('所有文章响应:', response);
      setResponse(response);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  
  const testGetMusicPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.getPostsByContentType('music');
      console.log('音乐文章响应:', response);
      setResponse(response);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  
  const testGetBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await postApi.getPostsByContentType('blog');
      console.log('博客文章响应:', response);
      setResponse(response);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API 调试页面</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <button 
          onClick={testGetAllPosts}
          disabled={loading}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          获取所有文章
        </button>
        
        <button 
          onClick={testGetMusicPosts}
          disabled={loading}
          className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          获取音乐文章
        </button>
        
        <button 
          onClick={testGetBlogPosts}
          disabled={loading}
          className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          获取博客文章
        </button>
      </div>
      
      {loading && (
        <div className="w-full p-4 bg-gray-100 rounded-lg mb-4">
          加载中...
        </div>
      )}
      
      {error && (
        <div className="w-full p-4 bg-red-100 text-red-800 rounded-lg mb-4">
          <h3 className="font-bold mb-2">错误:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div className="w-full">
          <h3 className="font-bold mb-2">响应:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 