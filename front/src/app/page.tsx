'use client';

// import HeroCarousel from './components/home/HeroCarousel';
// import FeaturedContent from './components/home/FeaturedContent';
// import { motion, useScroll, useTransform, useInView } from 'framer-motion';
// import { useRef, useEffect, useState, ReactNode } from 'react';
import LoginPage from './login/page';

// const fadeInUpVariant = {
//   hidden: { opacity: 0, scale: 0.8, y: 40 },
//   visible: { 
//     opacity: 1, 
//     scale: 1, 
//     y: 0,
//     transition: { 
//       duration: 0.6, 
//       ease: [0.22, 1, 0.36, 1] 
//     }
//   }
// };

// const staggerContainerVariant = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2,
//       delayChildren: 0.3,
//     }
//   }
// };

// function AnimatedSection({ children, className = "" }: { children: ReactNode, className?: string }) {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: false, amount: 0.2 });
  
//   return (
//     <motion.div
//       ref={ref}
//       initial="hidden"
//       animate={isInView ? "visible" : "hidden"}
//       variants={fadeInUpVariant}
//       className={className}
//     >
//       {children}
//     </motion.div>
//   );
// }

export default function Home() {
  // const scrollRef = useRef(null);
  // const [hasScrolled, setHasScrolled] = useState(false);
  
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 100 && !hasScrolled) {
  //       setHasScrolled(true);
  //     }
  //   };
    
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [hasScrolled]);
  
  return (
    <LoginPage></LoginPage>
  );
}
