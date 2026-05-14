"use client";
import { motion } from 'framer-motion';
import { Zap, Bot, Workflow } from 'lucide-react';

type Locale = 'es' | 'en';

const TIMELINE_CONTENT: Record<
  Locale,
  {
    badge: string;
    title: string;
    subtitle: string;
    stepLabel: string;
    steps: Array<{ number: string; icon: typeof Zap; title: string; description: string }>;
  }
> = {
  es: {
    badge: 'Implementacion',
    title: 'Implementacion clara en 3 pasos',
    subtitle: 'Un flujo corto, moderno y medible para pasar de idea a operacion con IA.',
    stepLabel: 'PASO',
    steps: [
      {
        number: '01',
        icon: Zap,
        title: 'Kickoff y Setup',
        description: 'Definimos objetivos, configuramos el entorno y recibimos tu informacion clave. Todo en menos de 48h.',
      },
      {
        number: '02',
        icon: Bot,
        title: 'Entrenamiento y Pruebas',
        description: 'Entrenamos el agente IA con tus datos, probamos respuestas y ajustamos el flujo segun tus necesidades.',
      },
      {
        number: '03',
        icon: Workflow,
        title: 'Despliegue y Optimizacion',
        description: 'Lanzamos el sistema en produccion, conectamos canales y medimos resultados para iterar.',
      },
    ],
  },
  en: {
    badge: 'Implementation',
    title: 'Clear implementation in 3 steps',
    subtitle: 'A short, modern and measurable flow to go from idea to AI-enabled operation.',
    stepLabel: 'STEP',
    steps: [
      {
        number: '01',
        icon: Zap,
        title: 'Kickoff and Setup',
        description: 'We define goals, configure the environment and gather key inputs. All within 48h.',
      },
      {
        number: '02',
        icon: Bot,
        title: 'Training and Testing',
        description: 'We train the AI agent with your data, test responses and tune the flow to your needs.',
      },
      {
        number: '03',
        icon: Workflow,
        title: 'Launch and Optimization',
        description: 'We launch to production, connect channels and track results for continuous iteration.',
      },
    ],
  },
};

export default function TimelineSection({ locale = 'es' }: { locale?: Locale }) {
  const content = TIMELINE_CONTENT[locale];

  return (
    <section id="proceso" className="scroll-mt-28 relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-linear-to-b from-[#0C1014] via-[#111111] to-[#0C1014]" />
      <div className="absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#00D4FF]/12 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#10B981]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs tracking-[0.14em] text-[#D4D4D8] uppercase">
            {content.badge}
          </span>
          <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#A1A1AA] sm:text-base">
            {content.subtitle}
          </p>
        </div>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-linear-to-r from-[#00D4FF]/10 via-[#00D4FF]/45 to-[#10B981]/30 md:block" />

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {content.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.number}
                  className="relative rounded-3xl border border-white/12 bg-[#121212]/88 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="absolute -top-4 left-1/2 hidden -translate-x-1/2 md:block">
                    <span className="block h-3 w-3 rounded-full border border-[#00D4FF]/50 bg-[#0C1014]" />
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-semibold tracking-[0.16em] text-[#71717A]">{content.stepLabel} {step.number}</span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-linear-to-br from-[#00D4FF]/20 to-[#10B981]/20">
                      <Icon size={20} className="text-[#00D4FF]" />
                    </div>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-white md:text-[1.28rem]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">{step.description}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
