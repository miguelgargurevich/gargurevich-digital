'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ExternalLink, Github, Star } from 'lucide-react';
import { BentoCard } from '../ui/AnimatedCard';
import { LineReveal } from '../ui/TextReveal';

type ProjectId = 'dashboardia' | 'invoiceapp' | 'house' | 'jafernandez' | 'lumic' | 'portfolio';

const projectMeta = [
  {
    id: 'dashboardia',
    image: '/projects/dashboardia.png',
    tech: ['Next.js 14', 'React 18', 'Node.js', 'Prisma', 'PostgreSQL', 'Supabase', 'Gemini API'],
    github: 'https://github.com/miguelgargurevich/dashboardia-llm',
    live: '#',
    size: 'large' as const,
    color: '#00D4FF',
  },
  {
    id: 'invoiceapp',
    image: '/projects/invoiceapp.png',
    tech: ['Next.js 14', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase', 'Resend'],
    github: 'https://github.com/miguelgargurevich/invoiceapp',
    live: 'https://invoiceapp.vercel.app',
    size: 'wide' as const,
    color: '#8B5CF6',
  },
  {
    id: 'house',
    image: '/projects/house.png',
    tech: ['React 18', 'Vite', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'Gemini API'],
    github: 'https://github.com/miguelgargurevich/house',
    live: '#',
    size: 'tall' as const,
    color: '#10B981',
  },
  {
    id: 'jafernandez',
    image: '/projects/jafernandez.png',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zod'],
    github: 'https://github.com/miguelgargurevich/jafernandezelectric',
    live: '#',
    size: 'default' as const,
    color: '#F59E0B',
  },
  {
    id: 'lumic',
    image: '/projects/lumic.png',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', '.NET 9', 'JWT'],
    github: 'https://github.com/miguelgargurevich/lumic',
    live: '#',
    size: 'default' as const,
    color: '#EC4899',
  },
  {
    id: 'portfolio',
    image: '/projects/portfolio.png',
    tech: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'next-intl', 'Gemini AI'],
    github: 'https://github.com/miguelgargurevich/miguel-gargurevich-portfolio',
    live: '#',
    size: 'wide' as const,
    color: '#EF4444',
  },
] as const;

export default function PortfolioSection() {
  const t = useTranslations('portfolio');
  const projects = projectMeta.map((project) => {
    const content = t.raw(`items.${project.id}`) as {
      title: string;
      description: string;
      features: string[];
    };

    return {
      ...project,
      ...content,
    };
  });
  
  return (
    <section id="portafolio" className="relative py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#111111]">
        <div className="dot-pattern absolute inset-0 opacity-30" />
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
            <Star className="w-4 h-4 text-[#00D4FF]" />
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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(360px,auto)]">
          {projects.map((project) => (
            <BentoCard key={project.id} size={project.size}>
              <div className="h-full flex flex-col">

                {/* ── Screenshot / Preview area ── */}
                <div
                  className="relative overflow-hidden shrink-0"
                  style={{ height: project.size === 'large' ? '220px' : '160px' }}
                >
                  {/* Colored gradient background (always visible as base) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(145deg, ${project.color}22 0%, #0d0d0d 80%)`,
                    }}
                  />

                  {/* Mock browser / UI skeleton */}
                  <div className="absolute inset-0 p-3">
                    {/* Fake browser chrome */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                      <div
                        className="flex-1 h-3 rounded-full mx-2"
                        style={{ backgroundColor: `${project.color}18` }}
                      />
                    </div>
                    {/* Fake content rows */}
                    <div className="space-y-2">
                      <div
                        className="h-3.5 rounded"
                        style={{ backgroundColor: `${project.color}28`, width: '70%' }}
                      />
                      <div
                        className="h-2.5 rounded"
                        style={{ backgroundColor: `${project.color}18`, width: '90%' }}
                      />
                      <div
                        className="h-2.5 rounded"
                        style={{ backgroundColor: `${project.color}14`, width: '55%' }}
                      />
                      {/* Fake card row */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="rounded"
                            style={{
                              height: project.size === 'large' ? '48px' : '36px',
                              backgroundColor: `${project.color}12`,
                              border: `1px solid ${project.color}20`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Real screenshot — shown when file exists in /public/projects/ */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />

                  {/* LIVE badge */}
                  {project.live !== '#' && (
                    <span
                      className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold rounded-full"
                      style={{
                        backgroundColor: `${project.color}30`,
                        color: project.color,
                        border: `1px solid ${project.color}40`,
                      }}
                    >
                      LIVE
                    </span>
                  )}

                  {/* Bottom fade into card */}
                  <div className="absolute bottom-0 inset-x-0 h-14 bg-linear-to-t from-[#141414] to-transparent pointer-events-none" />
                </div>

                {/* ── Card content ── */}
                <div className="flex-1 px-5 pb-5 pt-3 flex flex-col">
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                        aria-label="Código fuente"
                      >
                        <Github size={14} className="text-[#A1A1AA]" />
                      </a>
                      {project.live !== '#' && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                          aria-label="Ver proyecto"
                        >
                          <ExternalLink size={14} className="text-[#A1A1AA]" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#A1A1AA] text-xs leading-relaxed mb-3 grow line-clamp-4">
                    {project.description}
                  </p>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-0.5 text-[11px] rounded-md font-medium"
                        style={{
                          backgroundColor: `${project.color}15`,
                          color: project.color,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[11px] rounded-md bg-white/5 text-[#71717A]"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="px-2 py-0.5 text-[11px] rounded-md bg-white/5 text-[#71717A]">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </BentoCard>
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <a
            href="https://github.com/miguelgargurevich"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white transition-colors duration-300"
          >
            <Github size={20} />
            <span>{t('viewProject')}</span>
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
