'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bot, Calendar, MessageCircle, Sparkles } from 'lucide-react';
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

export default function HeroSection({ overrides }: { overrides?: HeroSectionOverrides }) {
  const rotatingWords = overrides?.rotatingWords ?? ['presencia digital', 'asistente IA', 'automatizaciones'];
  const trustPoints = [
    { icon: Bot, title: 'IA aplicada al negocio', description: 'Agentes entrenados con tu información real.' },
    { icon: Calendar, title: 'Implementación rápida', description: 'Despliegues ágiles sin procesos complejos.' },
    { icon: MessageCircle, title: 'Operación conectada', description: 'WhatsApp, CRM y procesos en un solo flujo.' },
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(0,212,255,0.15),transparent_38%),radial-gradient(ellipse_at_80%_10%,rgba(16,185,129,0.14),transparent_34%),radial-gradient(ellipse_at_center,transparent_0%,#0A0A0A_72%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-350 mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-32 pb-24 md:pt-40 md:pb-28">
        <motion.div
          className="grid gap-12 lg:grid-cols-[1.1fr,0.9fr] items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div>
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
                Ver soluciones
              </MagneticButton>

              <MagneticButton
                href="#contacto"
                variant="secondary"
                size="lg"
                icon={<Calendar size={18} />}
              >
                Agendar llamada
              </MagneticButton>

              <MagneticButton
                href="https://wa.me/51966918363"
                variant="ghost"
                size="lg"
                icon={<MessageCircle size={18} />}
              >
                Hablar por WhatsApp
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div className="absolute -top-8 -right-8 w-38 h-38 rounded-full bg-[#00D4FF]/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-8 w-38 h-38 rounded-full bg-[#10B981]/15 blur-3xl" />

            <div className="relative rounded-3xl border border-white/12 bg-[#111111]/80 backdrop-blur-xl p-6 md:p-7 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-2xl border border-[#00D4FF]/30 bg-[#00D4FF]/8 p-4">
                  <p className="text-xs text-[#A1A1AA] mb-1">Deploy inicial</p>
                  <p className="text-2xl font-semibold text-white">48h</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-[#A1A1AA] mb-1">Modalidad</p>
                  <p className="text-2xl font-semibold text-white">3 niveles</p>
                </div>
              </div>

              <div className="space-y-3">
                {trustPoints.map((point, index) => (
                  <motion.div
                    key={point.title}
                    className="rounded-2xl border border-white/10 bg-white/4 p-4"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.08 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-xl bg-linear-to-br from-[#00D4FF]/20 to-[#10B981]/20 border border-white/10 flex items-center justify-center">
                        <point.icon size={17} className="text-[#00D4FF]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{point.title}</p>
                        <p className="text-xs text-[#A1A1AA] mt-1">{point.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 md:mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {[
            { label: 'Presencia Digital IA', value: 'Nivel 1' },
            { label: 'Asistente IA para Negocio', value: 'Nivel 2' },
            { label: 'Automatización Inteligente', value: 'Nivel 3' },
            { label: 'Soporte y evolución', value: 'Mensual' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/4 p-4">
              <p className="text-xs text-[#71717A]">{item.label}</p>
              <p className="mt-1 text-base md:text-lg text-white font-semibold">{item.value}</p>
            </div>
          ))}
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
