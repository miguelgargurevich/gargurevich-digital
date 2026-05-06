'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ParticleBackground, { GradientMesh } from '../ui/ParticleBackground';
import { WordRotate } from '../ui/Typewriter';
import MagneticButton from '../ui/MagneticButton';
import TextReveal from '../ui/TextReveal';

interface HeroSectionOverrides {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export default function HeroSection({ overrides }: { overrides?: HeroSectionOverrides }) {
  const t = useTranslations('hero');
  const rotatingWords = t.raw('rotatingWords') as string[];

  const stats = [
    { value: t('stats.projects.value'), label: t('stats.projects.label') },
    { value: t('stats.satisfaction.value'), label: t('stats.satisfaction.label') },
    { value: t('stats.experience.value'), label: t('stats.experience.label') },
    { value: t('stats.support.value'), label: t('stats.support.label') },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-background">
        <GradientMesh />
        <ParticleBackground />
        <div className="grid-pattern absolute inset-0" />
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0A0A0A_70%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-350 mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-32 pb-24 md:pt-40 md:pb-32">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm text-[#A1A1AA]">{overrides?.badge || t('badge')}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <TextReveal className="text-white">
              {overrides?.title || t('title')}
            </TextReveal>
            <br />
            <span className="gradient-text">
              <WordRotate words={rotatingWords} duration={3000} />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {overrides?.subtitle || t('subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <MagneticButton
              href="#contacto"
              variant="primary"
              size="lg"
              icon={<ArrowRight size={18} />}
            >
              {t('cta.primary')}
            </MagneticButton>
            
            <MagneticButton
              href="#portafolio"
              variant="secondary"
              size="lg"
            >
              {t('cta.secondary')}
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-[#71717A]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-linear-to-b from-[#00D4FF] to-[#8B5CF6]"
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
