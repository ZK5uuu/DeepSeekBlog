'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';

// 防止深色模式闪烁的脚本组件
function DarkModeScript() {
  useEffect(() => {
    // 检查如果用户已经有主题偏好或系统偏好
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // 立即应用正确的主题类，防止闪烁
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      storageKey="theme"
    >
      <DarkModeScript />
      {children}
    </ThemeProvider>
  );
} 