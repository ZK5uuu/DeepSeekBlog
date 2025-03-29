'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaBook, FaFilm, FaMusic, FaPen } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

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

  // 初始化并监听深色模式状态
  useEffect(() => {
    // 检查当前模式
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  
  // 直接操作DOM切换深色模式
  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      // 切换前临时禁用过渡效果
      document.documentElement.classList.add('notransition');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
      // 强制重排以立即应用样式变化
      window.getComputedStyle(document.documentElement).backgroundColor;
      document.documentElement.classList.remove('notransition');
    } else {
      // 切换前临时禁用过渡效果
      document.documentElement.classList.add('notransition');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
      // 强制重排以立即应用样式变化
      window.getComputedStyle(document.documentElement).backgroundColor;
      document.documentElement.classList.remove('notransition');
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
          <Link href="/">
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
              <Link key={item.name} href={item.href}>
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
          <div className="md:hidden flex items-center">
            {mounted && (
              <button
                className="theme-toggle-btn mr-2 focus:outline-none"
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
            
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
            </button>
          </div>
        </div>

        {/* 移动端下拉菜单 */}
        {isOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="py-2 space-y-1 border-t border-gray-200 dark:border-gray-700 mt-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <motion.div 
                    className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon} {item.name}
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
} 