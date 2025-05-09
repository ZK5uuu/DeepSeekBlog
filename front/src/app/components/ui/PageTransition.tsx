'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useNavigationContext } from '@/app/providers';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const { sourceRect, setSourceRect } = useNavigationContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // 监听路由变化时重置起点位置
  useEffect(() => {
    return () => setSourceRect(null);
  }, [pathname, setSourceRect]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        ref={contentRef}
        initial={(sourceRect && {
          clipPath: `circle(40px at ${sourceRect.x + sourceRect.width / 2}px ${sourceRect.y + sourceRect.height / 2}px)`,
          opacity: 0.5,
        }) || { opacity: 0 }}
        animate={{
          clipPath: "circle(200% at center)",
          opacity: 1,
        }}
        exit={{ 
          opacity: 0,
          transition: { duration: 0.3 } 
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 