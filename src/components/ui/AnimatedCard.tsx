'use client';

import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export default function AnimatedCard({
  children,
  className = '',
  glowColor = 'rgba(0, 212, 255, 0.15)',
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    
    rotateX.set(yPct * -20);
    rotateY.set(xPct * 20);
    
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const background = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      ${glowColor},
      transparent 80%
    )
  `;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      
      {/* Card content */}
      <div
        className="relative h-full w-full rounded-2xl bg-[#141414] border border-white/10 overflow-hidden"
        style={{ transform: 'translateZ(50px)' }}
      >
        {children}
      </div>
      
      {/* Shine effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: useMotionTemplate`
            linear-gradient(
              115deg,
              transparent 0%,
              rgba(255, 255, 255, 0.03) ${mouseX}px,
              transparent 100%
            )
          `,
        }}
      />
    </motion.div>
  );
}

// Simpler hover card with scale and glow
export function HoverCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Glow behind */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#00D4FF]/20 to-[#8B5CF6]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card */}
      <div className="relative h-full rounded-2xl bg-[#141414] border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-[#00D4FF]/30">
        {children}
      </div>
    </motion.div>
  );
}

// Bento grid card with different sizes
export function BentoCard({
  children,
  className = '',
  size = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'large' | 'wide' | 'tall';
}) {
  const sizeClasses = {
    default: '',
    large: 'md:col-span-2 md:row-span-2',
    wide: 'md:col-span-2',
    tall: 'md:row-span-2',
  };

  return (
    <motion.div
      className={`group relative ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#00D4FF]/30 to-[#8B5CF6]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      
      {/* Card background */}
      <div className="relative h-full rounded-2xl bg-[#141414]/80 backdrop-blur-sm border border-white/10 overflow-hidden group-hover:border-transparent transition-colors duration-300">
        {children}
      </div>
    </motion.div>
  );
}
