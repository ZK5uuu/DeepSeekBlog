"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaBook, FaMusic, FaVideo, FaMoon, FaSun, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username: string | null, role: string | null } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 从localStorage获取用户信息
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      if (username && role) {
        setUserInfo({ username, role });
      }
      
      // 检查主题偏好
      const theme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(theme === 'dark' || (!theme && prefersDark));
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };
  
  const logout = () => {
    // 清除登录信息
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setUserInfo(null);
    
    // 关闭菜单
    setIsOpen(false);
    
    // 跳转到首页
    router.push('/');
  };
  
  const goToLogin = () => {
    router.push('/login');
    setIsOpen(false);
  };

  useEffect(() => {
    // 初始化深色模式
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-navbar dark:border-navbar-border backdrop-blur-md border-b border-gray-200">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center" tabIndex={0}>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">知识分享</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Link href="/book">
              <span className="nav-link flex items-center" tabIndex={0}>
                <FaBook className="mr-2" /> 书籍
              </span>
            </Link>
            <Link href="/movie">
              <span className="nav-link flex items-center" tabIndex={0}>
                <FaVideo className="mr-2" /> 电影
              </span>
            </Link>
            <Link href="/music">
              <span className="nav-link flex items-center" tabIndex={0}>
                <FaMusic className="mr-2" /> 音乐
              </span>
            </Link>
            
            {/* 用户信息和登录/退出登录 */}
            {userInfo ? (
              <div className="relative mx-2">
                <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <FaUser className="mr-1" />
                  <span>{userInfo.username}</span>
                  <span className="ml-2 text-xs opacity-70">({userInfo.role === 'admin' ? '管理员' : '用户'})</span>
                  <button 
                    onClick={logout}
                    className="ml-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="退出登录"
                  >
                    <FaSignOutAlt />
                  </button>
                </button>
              </div>
            ) : (
              <button 
                onClick={goToLogin}
                className="nav-link flex items-center"
                tabIndex={0}
              >
                <FaUser className="mr-2" /> 登录
              </button>
            )}
            
            {/* 主题切换按钮 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-300 transition-colors"
              aria-label={darkMode ? '切换至亮色模式' : '切换至深色模式'}
            >
              {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
            </button>
          </div>

          <div className="md:hidden">
            <button
              className="focus:outline-none text-gray-700 dark:text-gray-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="打开菜单"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" height="24" width="24">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 overflow-hidden"
          >
            <div className="px-4 py-2 space-y-1">
              <Link href="/book">
                <span className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsOpen(false)}>
                  <FaBook className="inline mr-2" /> 书籍
                </span>
              </Link>
              <Link href="/movie">
                <span className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsOpen(false)}>
                  <FaVideo className="inline mr-2" /> 电影
                </span>
              </Link>
              <Link href="/music">
                <span className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsOpen(false)}>
                  <FaMusic className="inline mr-2" /> 音乐
                </span>
              </Link>
              
              {/* 用户信息和登录/退出登录 (移动端) */}
              {userInfo ? (
                <div className="py-2 px-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaUser className="mr-2" />
                      <span>{userInfo.username}</span>
                      <span className="ml-2 text-xs opacity-70">({userInfo.role === 'admin' ? '管理员' : '用户'})</span>
                    </div>
                    <button 
                      onClick={logout}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="退出登录"
                    >
                      <FaSignOutAlt />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={goToLogin}
                  className="w-full text-left block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaUser className="inline mr-2" /> 登录
                </button>
              )}
              
              {/* 主题切换按钮 (移动端) */}
              <button
                onClick={toggleDarkMode}
                className="w-full text-left flex items-center py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
                {darkMode ? '切换亮色模式' : '切换深色模式'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}