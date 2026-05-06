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

interface StatsOverrides {
  projects?: string;
  clients?: string;
  experience?: string;
}

function parseStatValue(input: string | undefined, fallback: { value: number; suffix: string }) {
  if (!input) return fallback;
  const match = input.match(/(\d+(?:\.\d+)?)(.*)/);
  if (!match) return fallback;

  const parsedValue = Number(match[1]);
  if (Number.isNaN(parsedValue)) return fallback;

  const suffix = match[2]?.trim() || '';
  return { value: parsedValue, suffix };
}

export default function StatsSection({ overrides }: { overrides?: StatsOverrides }) {
  const t = useTranslations('stats');
  const valuesByKey = {
    projects: parseStatValue(overrides?.projects, { value: 50, suffix: '+' }),
    clients: parseStatValue(overrides?.clients, { value: 100, suffix: '%' }),
    experience: parseStatValue(overrides?.experience, { value: 3, suffix: '+' }),
    support: { value: 24, suffix: '/7' },
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-[#111111] via-background to-[#111111]" />

      <div className="relative max-w-350 mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
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
                    to={valuesByKey[stat.key as keyof typeof valuesByKey].value}
                    suffix={valuesByKey[stat.key as keyof typeof valuesByKey].suffix}
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
