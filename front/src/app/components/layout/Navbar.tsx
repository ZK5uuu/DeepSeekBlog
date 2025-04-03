'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaBook, FaFilm, FaMusic, FaPen } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { useNavigationContext } from '@/app/providers';

const navigation = [
  { name: '书籍', href: '/books', icon: <FaBook className="mr-2" /> },
  { name: '电影', href: '/movies', icon: <FaFilm className="mr-2" /> },
  { name: '音乐', href: '/music', icon: <FaMusic className="mr-2" /> },
  { name: '博客', href: '/blog', icon: <FaPen className="mr-2" /> },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { setSourceRect } = useNavigationContext();

  // 初始化并监听深色模式状态
  useEffect(() => {
    // 检查当前模式
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

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
            
            {/* 移动端主题切换 */}
            {mounted && (
              <div className="flex items-center py-2">
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