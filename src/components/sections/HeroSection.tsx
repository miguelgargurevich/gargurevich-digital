'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MessageCircle, Sparkles } from 'lucide-react';
import ParticleBackground, { GradientMesh } from '../ui/ParticleBackground';
import { WordRotate } from '../ui/Typewriter';
import MagneticButton from '../ui/MagneticButton';
import TextReveal from '../ui/TextReveal';

interface HeroSectionOverrides {
  badge?: string;
  title?: string;
  subtitle?: string;
  rotatingWords?: string[];
  painHook?: string;
}

type Locale = 'es' | 'en';

const HERO_COPY: Record<Locale, {
  rotatingWords: string[];
  ctas: { solutions: string; call: string; whatsapp: string };
}> = {
  es: {
    rotatingWords: ['presencia digital', 'agente IA', 'automatizacion', 'memoria empresarial'],
    ctas: {
      solutions: 'Ver soluciones',
      call: 'Agendar llamada',
      whatsapp: 'Hablar por WhatsApp',
    },
  },
  en: {
    rotatingWords: ['digital presence', 'AI agent', 'automation', 'enterprise memory'],
    ctas: {
      solutions: 'View solutions',
      call: 'Book a call',
      whatsapp: 'Chat on WhatsApp',
    },
  },
};

export default function HeroSection({ locale = 'es', overrides }: { locale?: Locale; overrides?: HeroSectionOverrides }) {
  const copy = HERO_COPY[locale];
  const rotatingWords = overrides?.rotatingWords ?? copy.rotatingWords;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-background">
        <GradientMesh />
        <ParticleBackground />
        <div className="grid-pattern absolute inset-0" />
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(0,212,255,0.15),transparent_38%),radial-gradient(ellipse_at_80%_10%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(ellipse_at_center,transparent_0%,#0A0A0A_72%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-350 mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-32 pb-24 md:pt-40 md:pb-28">
        <motion.div
          className="grid gap-10 lg:grid-cols-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-5xl">
            <motion.p
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-sm text-[#A1A1AA]">{overrides?.badge || 'Sistema digital para negocios modernos'}</span>
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <TextReveal className="text-white">
                {overrides?.title || 'Web, IA y automatización para negocios modernos'}
              </TextReveal>
              <br />
              <span className="gradient-text">
                <WordRotate words={rotatingWords} duration={2800} />
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              {overrides?.subtitle || 'Creamos presencia digital profesional, asistentes IA y automatizaciones que ayudan a tu negocio a operar mejor.'}
            </motion.p>

            {overrides?.painHook && (
              <motion.p
                className="text-sm md:text-base text-[#E4E4E7] max-w-2xl mb-8 px-4 py-3 border border-white/12 rounded-xl bg-white/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
              >
                {overrides.painHook}
              </motion.p>
            )}

            <motion.div
              className="flex flex-col sm:flex-row sm:flex-wrap items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
            >
              <MagneticButton
                href="#servicios"
                variant="primary"
                size="lg"
                icon={<ArrowRight size={18} />}
              >
                {copy.ctas.solutions}
              </MagneticButton>

              <MagneticButton
                href="#contacto"
                variant="secondary"
                size="lg"
                icon={<Calendar size={18} />}
              >
                {copy.ctas.call}
              </MagneticButton>

              <MagneticButton
                href="https://wa.me/51966918363"
                variant="ghost"
                size="lg"
                icon={<MessageCircle size={18} />}
              >
                {copy.ctas.whatsapp}
              </MagneticButton>
            </motion.div>
          </div>
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
            className="w-1.5 h-1.5 rounded-full bg-linear-to-b from-[#00D4FF] to-[#10B981]"
            animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
