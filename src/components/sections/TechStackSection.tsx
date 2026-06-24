'use client';

import { motion } from 'framer-motion';
import { CircuitBoard, Cloud, Gauge, Handshake, Layers3, Rocket, ShieldCheck, Waypoints } from 'lucide-react';

const DIFFERENTIATORS = {
  es: {
    badge: 'Diferenciadores',
    title: 'Capacidad tecnica con foco comercial',
    subtitle:
      'Cada implementacion corre sobre infraestructura propia, escala por etapas y sostiene resultados en el tiempo.',
    poweredBy: 'Construido sobre',
    technologies: 'Next.js • n8n • Docker • Traefik • PostgreSQL • WhatsApp API • Groq · OpenAI · Gemini • RAG • Grafana',
    items: [
      { title: 'Agente IA multicanal', description: 'Asistentes en WhatsApp y Telegram conectados a la informacion real de tu negocio, con cadena de modelos de respaldo para no caerse nunca.' },
      { title: 'Provisioning automatico', description: 'Damos de alta un cliente nuevo con su landing premium, su agente IA y sus flujos n8n en minutos, no semanas.' },
      { title: 'Infra self-hosted gestionada', description: 'Servidor propio con SSL automatico, backups y aislamiento por cliente. Sin costos sorpresa de terceros.' },
      { title: 'Automatizaciones reales', description: 'Flujos operativos con n8n: eventos, webhooks y acciones que eliminan tareas repetitivas.' },
      { title: 'Monitoreo proactivo', description: 'El sistema se vigila solo: limpia, se autorepara y avisa por Telegram antes de que algo falle.' },
      { title: 'Memoria empresarial', description: 'Dashboard con RAG: notas, contactos, reuniones y documentos consultables por el agente IA.' },
      { title: 'Escalable por capas', description: 'Arquitectura modular para crecer de una landing a un sistema completo sin rehacer nada.' },
      { title: 'Atencion personalizada', description: 'Acompañamiento cercano para decisiones de producto, datos y operacion.' },
    ],
  },
  en: {
    badge: 'Differentiators',
    title: 'Technical capability with business focus',
    subtitle:
      'Every implementation runs on our own infrastructure, scales in stages, and sustains outcomes over time.',
    poweredBy: 'Built on',
    technologies: 'Next.js • n8n • Docker • Traefik • PostgreSQL • WhatsApp API • Groq · OpenAI · Gemini • RAG • Grafana',
    items: [
      { title: 'Multichannel AI agent', description: 'Assistants on WhatsApp and Telegram wired to your real business data, with a model fallback chain so they never go down.' },
      { title: 'Automated provisioning', description: 'We onboard a new client with their premium landing, AI agent, and n8n flows in minutes, not weeks.' },
      { title: 'Managed self-hosted infra', description: 'Our own server with automatic SSL, backups, and per-client isolation. No surprise third-party costs.' },
      { title: 'Real automations', description: 'Operational workflows with n8n: events, webhooks, and actions that remove repetitive work.' },
      { title: 'Proactive monitoring', description: 'The system watches itself: it cleans up, self-heals, and alerts via Telegram before anything breaks.' },
      { title: 'Enterprise memory', description: 'Dashboard with RAG: notes, contacts, meetings, and documents the AI agent can query.' },
      { title: 'Scalable by layers', description: 'Modular architecture to grow from a landing page to a full system without rebuilds.' },
      { title: 'Personalized support', description: 'Hands-on guidance for product, data, and operations decisions.' },
    ],
  },
} as const;

const ICONS = [CircuitBoard, Rocket, Cloud, Waypoints, ShieldCheck, Layers3, Gauge, Handshake];

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

        <motion.div
          className="mt-16 pt-12 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8]">{content.poweredBy}</p>
          <p className="mt-3 text-lg text-[#CFCFD2] font-medium">{content.technologies}</p>
        </motion.div>
      </div>
    </section>
  );
}
