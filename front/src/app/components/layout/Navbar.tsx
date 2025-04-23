'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaBook, FaFilm, FaMusic, FaPlus, FaPen, FaChevronDown } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useNavigationContext } from '@/app/providers';

const navigation = [
  { name: '书籍', href: '/book', icon: <FaBook className="mr-2" /> },
  { name: '电影', href: '/movie', icon: <FaFilm className="mr-2" /> },
  { name: '音乐', href: '/music', icon: <FaMusic className="mr-2" /> },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { setSourceRect } = useNavigationContext();
  const createMenuRef = useRef<HTMLDivElement>(null);
  
  // 初始化并监听深色模式状态
  useEffect(() => {
    // 检查当前模式
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleCreateMenu = () => setIsCreateOpen(!isCreateOpen);
  const showCreateMenu = () => setIsCreateOpen(true);
  const hideCreateMenu = () => setIsCreateOpen(false);

  // 点击外部关闭创建菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setIsCreateOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 记录点击位置函数
  const handleNavigationClick = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSourceRect(rect);
  };

  // 切换深色模式
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // 更新HTML类名和本地存储
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-white/80 dark:bg-navbar dark:border-navbar-border backdrop-blur-md border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          {/* 网站标志 */}
          <Link href="/" onClick={handleNavigationClick}>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                知识分享
              </span>
            </motion.div>
          </Link>

          {/* 桌面导航链接 */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} onClick={handleNavigationClick}>
                <motion.span 
                  className="nav-link flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon} {item.name}
                </motion.span>
              </Link>
            ))}
            
            {/* 创建按钮和下拉菜单 */}
            <div 
              className="relative" 
              ref={createMenuRef}
              onMouseEnter={showCreateMenu}
              onMouseLeave={hideCreateMenu}
            >
              <motion.button
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full ml-2 shadow-sm hover:shadow-md transition-shadow"
                onClick={toggleCreateMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus className="mr-1" /> 创建 <FaChevronDown className="ml-1 text-xs" />
              </motion.button>
              
              {/* 创建下拉菜单 */}
              <AnimatePresence>
                {isCreateOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-52 rounded-xl overflow-hidden shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm z-50 border border-gray-100 dark:border-gray-700"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="py-1 divide-y divide-gray-100 dark:divide-gray-700" role="menu" aria-orientation="vertical">
                      <Link href="/blog/create?type=book" onClick={() => setIsCreateOpen(false)}>
                        <motion.div 
                          className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center group"
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 500, damping: 17 }}
                        >
                          <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <FaBook className="text-xs" />
                          </span>
                          <div>
                            <p className="font-medium">写书评</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">分享你读过的好书</p>
                          </div>
                        </motion.div>
                      </Link>
                      <Link href="/blog/create?type=movie" onClick={() => setIsCreateOpen(false)}>
                        <motion.div 
                          className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center group"
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 500, damping: 17 }}
                        >
                          <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <FaFilm className="text-xs" />
                          </span>
                          <div>
                            <p className="font-medium">写影评</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">分享你看过的电影</p>
                          </div>
                        </motion.div>
                      </Link>
                      <Link href="/blog/create?type=music" onClick={() => setIsCreateOpen(false)}>
                        <motion.div 
                          className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center group"
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 500, damping: 17 }}
                        >
                          <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <FaMusic className="text-xs" />
                          </span>
                          <div>
                            <p className="font-medium">写乐评</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">分享你喜爱的音乐</p>
                          </div>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* 主题切换按钮 - 最简化版 */}
            {mounted && (
              <button
                className="theme-toggle-btn ml-4 focus:outline-none"
                onClick={toggleDarkMode}
                aria-label="切换深色模式"
              >
                {darkMode ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-blue-600" />
                )}
              </button>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none text-gray-700 dark:text-gray-300"
              aria-label="打开菜单"
            >
              {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      <motion.div 
        className="md:hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        {isOpen && (
          <div className="container-custom py-4 space-y-3 border-t border-gray-200 dark:border-gray-800">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={(e) => {
                  handleNavigationClick(e);
                  setIsOpen(false);
                }}
              >
                <motion.div 
                  className="nav-link flex items-center py-2"
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon} {item.name}
                </motion.div>
              </Link>
            ))}
            
            {/* 移动端创建选项 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-1">创建内容</p>
              
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl overflow-hidden">
                <Link href="/blog/create?type=book" onClick={() => setIsOpen(false)}>
                  <motion.div 
                    className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700/70"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 17 }}
                  >
                    <span className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <FaBook />
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">写书评</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">分享你读过的好书</p>
                    </div>
                  </motion.div>
                </Link>
                
                <Link href="/blog/create?type=movie" onClick={() => setIsOpen(false)}>
                  <motion.div 
                    className="flex items-center p-3 border-t border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/70"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 17 }}
                  >
                    <span className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <FaFilm />
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">写影评</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">分享你看过的电影</p>
                    </div>
                  </motion.div>
                </Link>
                
                <Link href="/blog/create?type=music" onClick={() => setIsOpen(false)}>
                  <motion.div 
                    className="flex items-center p-3 border-t border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700/70"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 500, damping: 17 }}
                  >
                    <span className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <FaMusic />
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">写乐评</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">分享你喜爱的音乐</p>
                    </div>
                  </motion.div>
                </Link>
              </div>
            </div>
            
            {/* 移动端主题切换 */}
            {mounted && (
              <div className="flex items-center py-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center nav-link"
                  aria-label="切换深色模式"
                >
                  {darkMode ? (
                    <><FaSun className="mr-2 text-yellow-400" /> 亮色模式</>
                  ) : (
                    <><FaMoon className="mr-2 text-blue-600" /> 深色模式</>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.nav>
  );
} 