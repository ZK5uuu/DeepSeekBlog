'use client';

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

// 创建一个上下文来存储点击的源元素位置信息
export const NavigationContext = createContext<{
  sourceRect: DOMRect | null;
  setSourceRect: (rect: DOMRect | null) => void;
}>({
  sourceRect: null,
  setSourceRect: () => {},
});

export const useNavigationContext = () => useContext(NavigationContext);

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

export default function Providers({ children }: { children: ReactNode }) {
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      storageKey="theme"
    >
      <DarkModeScript />
      <NavigationContext.Provider value={{ sourceRect, setSourceRect }}>
        {children}
      </NavigationContext.Provider>
    </ThemeProvider>
  );
} 