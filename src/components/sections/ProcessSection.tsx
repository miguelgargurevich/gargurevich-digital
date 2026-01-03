'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  MessageSquare, 
  FileSearch, 
  Palette, 
  Code2, 
  Rocket, 
  Settings,
  ArrowRight 
} from 'lucide-react';
import { LineReveal } from '../ui/TextReveal';

const stepsConfig = [
  {
    key: 'consultation',
    number: '01',
    icon: MessageSquare,
    color: '#00D4FF',
  },
  {
    key: 'analysis',
    number: '02',
    icon: FileSearch,
    color: '#8B5CF6',
  },
  {
    key: 'design',
    number: '03',
    icon: Palette,
    color: '#10B981',
  },
  {
    key: 'development',
    number: '04',
    icon: Code2,
    color: '#F59E0B',
  },
  {
    key: 'qa',
    number: '05',
    icon: Settings,
    color: '#EF4444',
  },
  {
    key: 'launch',
    number: '06',
    icon: Rocket,
    color: '#EC4899',
  },
];

export default function ProcessSection() {
  const t = useTranslations('process');
  return (
    <section id="proceso" className="relative py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#111111]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5"
          >
            <Settings className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm text-[#A1A1AA]">{t('badge')}</span>
          </motion.div>

          <LineReveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">{t('title')} </span>
              <span className="gradient-text">{t('titleHighlight')}</span>
            </h2>
          </LineReveal>

          <motion.p
            className="text-[#A1A1AA] text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00D4FF] via-[#8B5CF6] to-[#EC4899]" />

          <div className="space-y-8 lg:space-y-0">
            {stepsConfig.map((step, index) => {
              const stepData = t.raw(`steps.${step.key}`);
              return (
              <motion.div
                key={step.key}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-8 ${
                  index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px', amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Content */}
                <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:col-start-2 lg:pl-12'}`}>
                  <motion.div
                    className="group p-6 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div className={`flex items-start gap-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${step.color}20` }}
                      >
                        <step.icon size={24} style={{ color: step.color }} />
                      </div>

                      <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                        <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                          <span 
                            className="text-xs font-mono"
                            style={{ color: step.color }}
                          >
                            {step.number}
                          </span>
                          <h3 className="text-lg font-semibold text-white">
                            {stepData.title}
                          </h3>
                        </div>
                        
                        <p className="text-[#A1A1AA] text-sm mb-3">
                          {stepData.description}
                        </p>

                        <span className="inline-flex items-center gap-1 text-xs text-[#71717A]">
                          <span className="w-1 h-1 rounded-full bg-[#71717A]" />
                          {stepData.duration}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Timeline node (desktop) */}
                <motion.div
                  className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ 
                      borderColor: step.color,
                      backgroundColor: '#0A0A0A'
                    }}
                  />
                </motion.div>

                {/* Empty space for grid (desktop) */}
                <div className={`hidden lg:block ${index % 2 === 0 ? 'lg:col-start-2' : ''}`} />
              </motion.div>
            );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6] text-[#0A0A0A] font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.3)]"
          >
            Comenzar mi Proyecto
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
