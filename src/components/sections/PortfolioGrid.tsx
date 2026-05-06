'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Github, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
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
  images: string[];
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
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useMemo(() => {
    console.log('PortfolioGrid (Client): Received projects:', projects.map(p => p.id).join(', '));
  }, [projects]);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [projects, activeProjectId]
  );

  const openProjectModal = (project: PortfolioProjectItem) => {
    setActiveProjectId(project.id);
    setActiveImageIndex(0);
  };

  const closeProjectModal = () => {
    setActiveProjectId(null);
    setActiveImageIndex(0);
  };

  const nextImage = () => {
    if (!activeProject || activeProject.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % activeProject.images.length);
  };

  const prevImage = () => {
    if (!activeProject || activeProject.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + activeProject.images.length) % activeProject.images.length);
  };

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
              <div
                className="h-full flex flex-col cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => openProjectModal(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectModal(project);
                  }
                }}
                aria-label={`Ver detalle de ${project.title}`}
              >
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
                  {project.images[0] && (
                    <img
                      src={project.images[0]}
                      alt={`${project.title} screenshot`}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}

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
                        onClick={(e) => e.stopPropagation()}
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
                          onClick={(e) => e.stopPropagation()}
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

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 z-100 bg-black/75 backdrop-blur-sm p-4 md:p-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectModal}
          >
            <motion.div
              className="max-w-6xl mx-auto bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 md:p-6 border-b border-white/10 flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProject.color }} />
                    <span className="text-xs text-[#A1A1AA]">Proyecto destacado</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{activeProject.title}</h3>
                  <p className="text-[#A1A1AA] mt-2 max-w-3xl">{activeProject.description}</p>
                </div>
                <button
                  type="button"
                  onClick={closeProjectModal}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-all"
                  aria-label="Cerrar detalle"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-white/10">
                  <div className="relative aspect-video bg-[#0b0b0b]">
                    {activeProject.images.length > 0 ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeProject.images[activeImageIndex]}
                          alt={`${activeProject.title} captura ${activeImageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {activeProject.images.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={prevImage}
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/45 hover:bg-black/65 text-white transition-all"
                              aria-label="Imagen anterior"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={nextImage}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/45 hover:bg-black/65 text-white transition-all"
                              aria-label="Siguiente imagen"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[#52525B] text-sm">
                        Sin capturas disponibles para este proyecto
                      </div>
                    )}
                  </div>

                  {activeProject.images.length > 1 && (
                    <div className="p-4 flex items-center gap-2 overflow-x-auto">
                      {activeProject.images.map((url, idx) => (
                        <button
                          key={`${url}-${idx}`}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative shrink-0 w-20 h-12 rounded-md overflow-hidden border transition-all ${
                            idx === activeImageIndex ? 'border-[#00D4FF]' : 'border-white/10'
                          }`}
                          aria-label={`Ver imagen ${idx + 1}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5 md:p-6">
                  <h4 className="text-sm text-[#71717A] uppercase tracking-wider mb-3">Puntos de valor</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeProject.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2.5 py-1 text-xs rounded-full font-medium"
                        style={{ backgroundColor: `${activeProject.color}16`, color: activeProject.color }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-sm text-[#71717A] uppercase tracking-wider mb-3">Stack tecnologico</h4>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {activeProject.tech.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 text-[11px] rounded-md bg-white/5 text-[#A1A1AA]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={activeProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-all"
                    >
                      <Github size={15} />
                      Ver codigo
                    </a>

                    {activeProject.live !== '#' && (
                      <a
                        href={activeProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00D4FF] hover:bg-[#00B8D9] text-[#0a0a0a] text-sm font-semibold transition-all"
                      >
                        <ExternalLink size={15} />
                        Ver demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
