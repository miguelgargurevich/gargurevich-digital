'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(0);
  const fps = 30; // Limit to 30 FPS for better performance
  const frameInterval = 1000 / fps;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
      particles.current = [];

      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? '#00D4FF' : '#8B5CF6',
        });
      }
    };

    const drawParticles = (currentTime: number) => {
      // Throttle to target FPS
      const elapsed = currentTime - lastFrameTime.current;
      
      if (elapsed < frameInterval) {
        animationFrame.current = requestAnimationFrame(drawParticles);
        return;
      }
      
      lastFrameTime.current = currentTime - (elapsed % frameInterval);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction (optimized - only every 3rd frame)
        if (i % 3 === 0) {
          const dx = mousePos.current.x - particle.x;
          const dy = mousePos.current.y - particle.y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < 22500) { // 150^2
            const dist = Math.sqrt(distSq);
            const force = (150 - dist) / 150;
            particle.vx -= (dx / dist) * force * 0.015;
            particle.vy -= (dy / dist) * force * 0.015;
          }
        }

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();

        // Draw connections (reduced for performance)
        if (i % 2 === 0) { // Only draw connections for every other particle
          particles.current.slice(i + 1, i + 6).forEach((otherParticle) => { // Limit connections
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < 14400) { // 120^2
              const distance = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = 0.08 * (1 - distance / 120);
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        }
      });

      animationFrame.current = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    createParticles();
    drawParticles(0);

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
    
    // Throttle mouse move updates
    let mouseMoveTimeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        mousePos.current = { x: e.clientX, y: e.clientY };
      }, 16); // ~60fps max for mouse tracking
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [frameInterval]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}

// Gradient Mesh Background
export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cyan blob */}
      <motion.div
        className="absolute w-150 h-150 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '-10%',
          right: '-10%',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Purple blob */}
      <motion.div
        className="absolute w-125 h-125 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: '-5%',
          left: '-5%',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Center glow */}
      <motion.div
        className="absolute w-200 h-200 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.05) 0%, transparent 60%)',
          filter: 'blur(80px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
