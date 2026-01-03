'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import AnimatedCounter from '../ui/AnimatedCounter';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';

const statsConfig = [
  {
    key: 'projects',
    value: 50,
    suffix: '+',
    icon: TrendingUp,
    color: '#00D4FF',
  },
  {
    key: 'clients',
    value: 100,
    suffix: '%',
    icon: Users,
    color: '#8B5CF6',
  },
  {
    key: 'experience',
    value: 3,
    suffix: '+',
    icon: Award,
    color: '#10B981',
  },
  {
    key: 'support',
    value: 24,
    suffix: '/7',
    icon: Clock,
    color: '#F59E0B',
  },
];

export default function StatsSection() {
  const t = useTranslations('stats');
  return (
    <section className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#0A0A0A] to-[#111111]" />

      <div className="relative max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {statsConfig.map((stat, index) => (
            <motion.div
              key={stat.key}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Card */}
              <div className="p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl bg-[#141414] border border-white/10 text-center transition-all duration-300 group-hover:border-white/20">
                {/* Icon */}
                <div
                  className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>

                {/* Number */}
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  <AnimatedCounter
                    to={stat.value}
                    suffix={stat.suffix}
                    className="gradient-text"
                  />
                </div>

                {/* Label */}
                <p className="text-sm text-[#A1A1AA]">{t(stat.key)}</p>
              </div>

              {/* Glow effect on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
                style={{ backgroundColor: `${stat.color}10` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
