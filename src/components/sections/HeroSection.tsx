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
  maturityHeading: string;
  maturitySubheading: string;
  maturity: { label: string; value: string; result: string }[];
}> = {
  es: {
    rotatingWords: ['presencia digital', 'agente IA', 'automatizacion', 'memoria empresarial'],
    ctas: {
      solutions: 'Ver soluciones',
      call: 'Agendar llamada',
      whatsapp: 'Hablar por WhatsApp',
    },
    maturityHeading: 'Ruta de Madurez Empresarial',
    maturitySubheading: 'Cada nivel incrementa ventas, velocidad operativa y ventaja competitiva.',
    maturity: [
      { label: 'Presencia Digital', value: 'Nivel 1: Fundacion', result: 'Mas visibilidad y demanda inicial' },
      { label: 'Agente IA para Negocio', value: 'Nivel 2: Atencion 24/7', result: 'Leads atendidos sin friccion' },
      { label: 'Automatizacion Inteligente', value: 'Nivel 3: Operacion conectada', result: 'Menos carga operativa y mas velocidad' },
      { label: 'Memoria Empresarial (RAG)', value: 'Nivel 4: Ventaja competitiva', result: 'Decisiones con conocimiento interno' },
    ],
  },
  en: {
    rotatingWords: ['digital presence', 'AI agent', 'automation', 'enterprise memory'],
    ctas: {
      solutions: 'View solutions',
      call: 'Book a call',
      whatsapp: 'Chat on WhatsApp',
    },
    maturityHeading: 'Business Maturity Roadmap',
    maturitySubheading: 'Each level increases sales performance, operational speed, and strategic advantage.',
    maturity: [
      { label: 'Digital Presence', value: 'Level 1: Foundation', result: 'Higher visibility and initial demand' },
      { label: 'AI Agent for Business', value: 'Level 2: 24/7 service', result: 'Leads handled without friction' },
      { label: 'Smart Automation', value: 'Level 3: Connected operations', result: 'Less operational load and faster cycles' },
      { label: 'Enterprise Memory (RAG)', value: 'Level 4: Competitive edge', result: 'Decisions powered by internal knowledge' },
    ],
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

        <motion.div
          className="relative mt-12 md:mt-14 rounded-3xl border border-white/12 bg-linear-to-br from-[#0E1114]/90 via-[#12161B]/90 to-[#0B0E12]/90 backdrop-blur-xl p-6 md:p-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(0,212,255,0.12),transparent_35%),radial-gradient(circle_at_80%_100%,rgba(124,58,237,0.12),transparent_32%)]" />

          <div className="mb-6 md:mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8]">{copy.maturityHeading}</p>
            <p className="mt-2 text-sm md:text-base text-[#A1A1AA]">{copy.maturitySubheading}</p>
          </div>

          <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="pointer-events-none hidden xl:block absolute left-[8%] right-[8%] top-5 h-0.5 bg-linear-to-r from-[#00D4FF]/30 via-[#10B981]/35 to-[#7C3AED]/30" />
            {copy.maturity.map((item, index) => (
              <motion.div
                key={item.label}
                className="group relative rounded-2xl border border-white/10 bg-[#13161B]/80 p-4 md:p-5 overflow-hidden shadow-[0_14px_32px_rgba(0,0,0,0.25)]"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.08, duration: 0.45 }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#00D4FF] via-[#10B981] to-[#7C3AED] opacity-85" />
                <div className="mb-4 flex items-center gap-3">
                  <div className="relative h-9 w-9 shrink-0 rounded-full border border-[#00D4FF]/45 bg-[#00D4FF]/12 flex items-center justify-center text-sm font-semibold text-[#D5F4FF]">
                    {index + 1}
                    <div className="absolute -inset-1.25 rounded-full border border-[#00D4FF]/25" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#94A3B8]">{locale === 'es' ? `Etapa ${index + 1}` : `Stage ${index + 1}`}</p>
                </div>
                <p className="text-white font-semibold leading-snug">{item.label}</p>
                <p className="mt-2 text-sm text-[#D4D4D8]">{item.value}</p>
                <p className="mt-3 text-xs text-[#9CA3AF] leading-5">{item.result}</p>
                <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#00D4FF] to-[#10B981]"
                    style={{ width: `${(index + 1) * 25}%` }}
                  />
                </div>
              </motion.div>
            ))}
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
