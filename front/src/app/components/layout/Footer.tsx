'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeart, FaGithub, FaTwitter, FaWeibo } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-content border-t border-gray-200 dark:border-gray-800">
      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 网站信息 */}
          <div className="md:col-span-2">
            <Link href="/">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                知识分享
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              记录每周的书籍、电影和音乐，分享知识与感悟。
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub size={20} />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter size={20} />
              </motion.a>
              <motion.a
                href="https://weibo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaWeibo size={20} />
              </motion.a>
            </div>
          </div>
          
          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/books">
                  <span className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">书籍</span>
                </Link>
              </li>
              <li>
                <Link href="/movies">
                  <span className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">电影</span>
                </Link>
              </li>
              <li>
                <Link href="/music">
                  <span className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">音乐</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 联系方式 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400">
                邮箱: Ksoul021124@gmail.com
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                地址: 福建省福州市闽江学院
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center">
            © {currentYear} 知识分享. 用 
            <FaHeart className="text-red-500 mx-1" /> 
            制作
          </p>
        </div>
      </div>
    </footer>
  );
} 