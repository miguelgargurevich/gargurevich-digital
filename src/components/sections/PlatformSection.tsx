'use client';

import { motion } from 'framer-motion';
import { Bot, LayoutTemplate, Workflow, Brain, ArrowRight } from 'lucide-react';

const CONTENT = {
  es: {
    badge: 'La plataforma',
    title: 'Tu negocio en WhatsApp, con IA y automatizacion',
    subtitle:
      'No vendemos solo una pagina. Damos de alta un sistema completo por cliente: presencia premium, un agente que atiende solo y los flujos que mueven tu operacion. Todo sobre infraestructura propia.',
    flowTitle: 'Como lo montamos',
    steps: [
      { title: 'Landing premium', description: 'Una pagina de alta conversion, generada y personalizada para tu negocio, con dominio y SSL listos.' },
      { title: 'Agente IA propio', description: 'Un asistente en WhatsApp/Telegram que conoce tu negocio, responde 24/7 y captura leads sin que muevas un dedo.' },
      { title: 'Automatizacion n8n', description: 'Flujos que conectan el chat con tu CRM, correo, base de datos y las acciones que repites cada dia.' },
      { title: 'Memoria y dashboard', description: 'Notas, contactos, reuniones y documentos consultables por el agente. Tu negocio con memoria, no con respuestas sueltas.' },
    ],
    closing: 'En minutos, no en semanas. Y escala por capas a medida que tu negocio crece.',
    cta: 'Quiero mi plataforma',
  },
  en: {
    badge: 'The platform',
    title: 'Your business on WhatsApp, with AI and automation',
    subtitle:
      'We do not just sell a page. We provision a full system per client: premium presence, an agent that handles conversations on its own, and the flows that run your operation. All on our own infrastructure.',
    flowTitle: 'How we set it up',
    steps: [
      { title: 'Premium landing', description: 'A high-conversion page, generated and tailored to your business, with domain and SSL ready to go.' },
      { title: 'Your own AI agent', description: 'An assistant on WhatsApp/Telegram that knows your business, answers 24/7, and captures leads hands-free.' },
      { title: 'n8n automation', description: 'Flows that connect the chat to your CRM, email, database, and the actions you repeat every day.' },
      { title: 'Memory and dashboard', description: 'Notes, contacts, meetings, and documents the agent can query. A business with memory, not scattered replies.' },
    ],
    closing: 'In minutes, not weeks. And it scales in layers as your business grows.',
    cta: 'I want my platform',
  },
} as const;

const ICONS = [LayoutTemplate, Bot, Workflow, Brain];

export default function PlatformSection({ locale = 'es' }: { locale?: string }) {
  const content = locale === 'es' ? CONTENT.es : CONTENT.en;

  return (
    <section id="platform" className="scroll-mt-28 relative py-24 md:py-30 overflow-hidden">
      <div className="absolute inset-0 bg-background">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#10B981]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#00D4FF]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-3xl mb-14 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-[#CFCFD2]">
            {content.badge}
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">{content.title}</h2>
          <p className="mt-5 text-lg text-[#A1A1AA] leading-8">{content.subtitle}</p>
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8] mb-8">{content.flowTitle}</p>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {content.steps.map((step, index) => {
            const Icon = ICONS[index];
            return (
              <motion.article
                key={step.title}
                className="relative rounded-3xl border border-white/12 bg-[#111111]/85 p-6"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#00D4FF]/20 to-[#10B981]/20 border border-white/10 flex items-center justify-center">
                    <Icon size={17} className="text-[#10B981]" />
                  </div>
                  <span className="text-3xl font-bold text-white/10">0{index + 1}</span>
                </div>
                <h3 className="text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-[#A1A1AA] leading-6">{step.description}</p>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-lg text-[#CFCFD2] font-medium max-w-2xl">{content.closing}</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 shrink-0 px-6 py-3 rounded-full bg-linear-to-r from-[#00D4FF] to-[#10B981] text-[#0A0A0A] font-semibold hover:opacity-90 transition-opacity"
          >
            {content.cta}
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
