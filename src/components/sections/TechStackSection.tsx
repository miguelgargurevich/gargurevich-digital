'use client';

import { motion } from 'framer-motion';
import { CircuitBoard, Cloud, Gauge, Handshake, Layers3, Rocket, ShieldCheck, Waypoints } from 'lucide-react';

const DIFFERENTIATORS = {
  es: {
    badge: 'Diferenciadores',
    title: 'Capacidad tecnica con foco comercial',
    subtitle:
      'Cada implementacion se diseña para operar estable, escalar por etapas y sostener resultados en el tiempo.',
    items: [
      { title: 'Deploy rapido', description: 'Iteraciones cortas y publicacion continua sin depender de procesos manuales.' },
      { title: 'IA integrada', description: 'Asistentes conectados a informacion real de tu negocio, no respuestas genericas.' },
      { title: 'Hosting incluido', description: 'Infraestructura gestionada para salir a produccion con SSL y monitoreo base.' },
      { title: 'Automatizaciones reales', description: 'Flujos operativos con n8n, eventos y acciones que eliminan tareas repetitivas.' },
      { title: 'Escalable', description: 'Arquitectura modular para crecer de landing a sistema completo sin rehacer todo.' },
      { title: 'Atencion personalizada', description: 'Acompañamiento cercano para decisiones de producto, datos y operacion.' },
      { title: 'Arquitectura moderna', description: 'Stack actual con buenas practicas de rendimiento, seguridad y mantenibilidad.' },
      { title: 'Integraciones', description: 'Conexiones con WhatsApp, CRMs, formularios, bases de datos y servicios externos.' },
    ],
  },
  en: {
    badge: 'Differentiators',
    title: 'Technical capability with business focus',
    subtitle:
      'Each implementation is designed for stability, stage-based growth, and sustained outcomes over time.',
    items: [
      { title: 'Fast deployment', description: 'Short iterations and continuous releases without manual-heavy workflows.' },
      { title: 'Built-in AI', description: 'Assistants connected to real business data, not generic scripted answers.' },
      { title: 'Hosting included', description: 'Managed infrastructure with SSL and baseline monitoring from day one.' },
      { title: 'Real automations', description: 'Operational workflows with n8n, event-driven actions, and less repetitive work.' },
      { title: 'Scalable', description: 'Modular architecture to grow from landing page to full system without rebuilds.' },
      { title: 'Personalized support', description: 'Hands-on guidance for product, data, and operations decisions.' },
      { title: 'Modern architecture', description: 'Current stack with strong performance, security, and maintainability standards.' },
      { title: 'Integrations', description: 'Connections with WhatsApp, CRMs, forms, databases, and external services.' },
    ],
  },
} as const;

const ICONS = [Rocket, CircuitBoard, Cloud, Waypoints, Layers3, Handshake, ShieldCheck, Gauge];

export default function TechStackSection({ locale = 'es' }: { locale?: string }) {
  const content = locale === 'es' ? DIFFERENTIATORS.es : DIFFERENTIATORS.en;

  return (
    <section id="tech" className="scroll-mt-28 relative py-24 md:py-30 overflow-hidden">
      <div className="absolute inset-0 bg-background">
        <div className="grid-pattern absolute inset-0 opacity-35" />
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-[#00D4FF]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#10B981]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-3xl mb-14 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-[#CFCFD2]">
            {content.badge}
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">{content.title}</h2>
          <p className="mt-5 text-lg text-[#A1A1AA] leading-8">{content.subtitle}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, index) => {
            const Icon = ICONS[index];
            return (
              <motion.article
                key={item.title}
                className="rounded-3xl border border-white/12 bg-[#111111]/85 p-6"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#00D4FF]/20 to-[#10B981]/20 border border-white/10 flex items-center justify-center mb-4">
                  <Icon size={17} className="text-[#00D4FF]" />
                </div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-[#A1A1AA] leading-6">{item.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
