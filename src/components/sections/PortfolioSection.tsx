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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(280px,auto)]">
          {projects.map((project) => (
            <BentoCard key={project.id} size={project.size}>
              <div className="h-full p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
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
                    >
                      <Github size={16} className="text-[#A1A1AA]" />
                    </a>
                    {project.live !== '#' && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                      >
                        <ExternalLink size={16} className="text-[#A1A1AA]" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-[#A1A1AA] text-sm mb-4 flex-grow line-clamp-3">
                  {project.description}
                </p>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 text-xs rounded-md"
                      style={{ 
                        backgroundColor: `${project.color}15`,
                        color: project.color 
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {project.tech.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs rounded-md bg-white/5 text-[#71717A]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 4 && (
                    <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-[#71717A]">
                      +{project.tech.length - 4}
                    </span>
                  )}
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
