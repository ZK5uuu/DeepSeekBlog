"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { postApi } from '../../api/services/blogService';

export default function MusicDebugPage() {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    fetchMusicData();
  }, []);

  const fetchMusicData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 尝试直接获取音乐类型的数据
      const response = await postApi.getPostsByContentType('music');
      console.log('音乐数据响应:', response);
      
      // 保存原始响应
      setRawData(response);
      
      // 处理响应数据
      if (response && response.data) {
        setResponse(response.data);
      } else {
        setResponse(response);
      }
    } catch (err) {
      console.error('获取音乐数据错误:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">音乐数据调试页面</h1>
        <div className="flex gap-3">
          <Link href="/music" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            返回音乐页面
          </Link>
          <button 
            onClick={fetchMusicData}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            刷新数据
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="w-full p-4 bg-gray-100 rounded-lg mb-4">
          正在加载音乐数据...
        </div>
      )}
      
      {error && (
        <div className="w-full p-4 bg-red-100 text-red-800 rounded-lg mb-4">
          <h3 className="font-bold mb-2">错误:</h3>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">API端点信息</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p><strong>URL:</strong> http://localhost:8080/posts/type/music</p>
          <p><strong>方法:</strong> GET</p>
          <p><strong>预期响应:</strong> 音乐类型的博客文章数据</p>
        </div>
      </div>
      
      {rawData && (
        <div className="w-full mb-8">
          <h2 className="text-xl font-semibold mb-3">原始响应</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
      )}
      
      {response && (
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-3">处理后的数据</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
      
      {response && Array.isArray(response) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">音乐记录列表</h2>
          <div className="grid gap-4">
            {response.map((item: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">{item.title || item.albumName || '无标题'}</h3>
                  <span className="text-gray-500">ID: {item.id}</span>
                </div>
                <p className="text-gray-600 mt-2">艺术家: {item.artistName || '未知'}</p>
                <p className="text-gray-600">专辑: {item.albumName || '未知'}</p>
                {item.content && <p className="mt-2 text-sm text-gray-700">{item.content.substring(0, 100)}...</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {response && (!Array.isArray(response) || response.length === 0) && (
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold text-yellow-700">注意</h3>
          <p className="text-yellow-700 mt-2">
            没有找到任何音乐记录或数据结构不是数组。请检查API响应格式或确保数据库中有音乐类型的记录。
          </p>
        </div>
      )}
    </div>
  );
} 