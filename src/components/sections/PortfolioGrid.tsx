'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';
import { BentoCard } from '../ui/AnimatedCard';
import { LineReveal } from '../ui/TextReveal';

export interface PortfolioProjectItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  tech: string[];
  github: string;
  live: string;
  size: 'default' | 'wide' | 'tall' | 'large';
  color: string;
  image: string;
}

interface PortfolioGridProps {
  projects: PortfolioProjectItem[];
  labels: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    viewProject: string;
  };
}

export default function PortfolioGrid({ projects, labels }: PortfolioGridProps) {
  return (
    <section id="portafolio" className="relative py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-[#111111]">
        <div className="dot-pattern absolute inset-0 opacity-30" />
      </div>

      <div className="relative max-w-350 mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5"
          >
            <Star className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm text-[#A1A1AA]">{labels.badge}</span>
          </motion.div>

          <LineReveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">{labels.title} </span>
              <span className="gradient-text">{labels.titleHighlight}</span>
            </h2>
          </LineReveal>

          <motion.p
            className="text-[#A1A1AA] text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {labels.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(360px,auto)]">
          {projects.map((project) => (
            <BentoCard key={project.id} size={project.size}>
              <div className="h-full flex flex-col">
                <div
                  className="relative overflow-hidden shrink-0"
                  style={{ height: project.size === 'large' ? '220px' : '160px' }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(145deg, ${project.color}22 0%, #0d0d0d 80%)` }}
                  />

                  <div className="absolute inset-0 p-3">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                      <div
                        className="flex-1 h-3 rounded-full mx-2"
                        style={{ backgroundColor: `${project.color}18` }}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3.5 rounded" style={{ backgroundColor: `${project.color}28`, width: '70%' }} />
                      <div className="h-2.5 rounded" style={{ backgroundColor: `${project.color}18`, width: '90%' }} />
                      <div className="h-2.5 rounded" style={{ backgroundColor: `${project.color}14`, width: '55%' }} />
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

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />

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

                  <div className="absolute bottom-0 inset-x-0 h-14 bg-linear-to-t from-[#141414] to-transparent pointer-events-none" />
                </div>

                <div className="flex-1 px-5 pb-5 pt-3 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300"
                        aria-label="Codigo fuente"
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

                  <h3 className="text-lg font-semibold text-white mb-2 leading-snug">{project.title}</h3>

                  <p className="text-[#A1A1AA] text-xs leading-relaxed mb-3 grow line-clamp-4">{project.description}</p>

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

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                    {project.tech.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-[11px] rounded-md bg-white/5 text-[#71717A]">
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
            <span>{labels.viewProject}</span>
            <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
