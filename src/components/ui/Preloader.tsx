'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    // Simulate loading progress
    let start = 0;
    const duration = 2000; // 2 seconds minimum loading time
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      start += step;
      if (start >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = '';
        }, 500); // Wait a bit at 100%
      } else {
        setProgress(Math.floor(start));
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-[#00D4FF]/10 rounded-full blur-[100px]"
              animate={{ 
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div 
              className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[100px]"
              animate={{ 
                x: [0, -100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 4 }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Mark or Icon */}
            <motion.div 
              className="w-16 h-16 border-t-2 border-r-2 border-[#00D4FF] rounded-full mb-8 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-12 h-12 border-b-2 border-l-2 border-[#8B5CF6] rounded-full" />
            </motion.div>
            
            {/* Counter */}
            <div className="overflow-hidden h-20 flex items-center justify-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-6xl md:text-8xl font-bold font-mono text-white tracking-tighter"
              >
                {progress}%
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-6 text-[#A1A1AA] uppercase tracking-[0.2em] text-xs font-semibold"
            >
              Gargurevich Digital
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
