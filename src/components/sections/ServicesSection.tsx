'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Layout, 
  Globe, 
  ShoppingCart, 
  Cpu, 
  Smartphone, 
  Server,
  ArrowRight
} from 'lucide-react';
import { HoverCard } from '../ui/AnimatedCard';
import { LineReveal } from '../ui/TextReveal';
import MagneticButton from '../ui/MagneticButton';
import { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Layout,
  Globe,
  ShoppingCart,
  Smartphone,
  Cpu,
  Server,
};

const colorMap: Record<string, string> = {
  landing: '#00D4FF',
  website: '#8B5CF6',
  ecommerce: '#10B981',
  webapp: '#F59E0B',
  ai: '#EF4444',
  devops: '#EC4899',
};

export default function ServicesSection() {
  const t = useTranslations('services');
  return (
    <section id="servicios" className="relative py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0A0A]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl" />
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {(['landing', 'website', 'ecommerce', 'webapp', 'ai', 'devops'] as const).map((serviceKey, index) => {
            const service = t.raw(`items.${serviceKey}`);
            const Icon = iconMap[serviceKey === 'landing' ? 'Layout' : serviceKey === 'website' ? 'Globe' : serviceKey === 'ecommerce' ? 'ShoppingCart' : serviceKey === 'webapp' ? 'Smartphone' : serviceKey === 'ai' ? 'Cpu' : 'Server'];
            const color = colorMap[serviceKey];
            return (
            <motion.div
              key={serviceKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px', amount: 0.3 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <HoverCard className="h-full">
                <div className="p-6 md:p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon size={28} style={{ color: color }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#A1A1AA] text-sm mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[#71717A]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <a
                    href="#contacto"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 group/link"
                    style={{ color: color }}
                  >
                    {t('learnMore')}
                    <ArrowRight 
                      size={14} 
                      className="transition-transform duration-300 group-hover/link:translate-x-1" 
                    />
                  </a>
                </div>
              </HoverCard>
            </motion.div>
          );})}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <MagneticButton
            href="#contacto"
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} />}
          >
            {t('cta')}
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
