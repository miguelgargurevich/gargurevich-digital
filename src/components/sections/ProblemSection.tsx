import { Moon, MessageCircleQuestion, FileBarChart2 } from 'lucide-react';

type Locale = 'es' | 'en';

const PROBLEM_CONTENT: Record<Locale, { title: string; cards: Array<{ icon: typeof Moon; title: string; description: string }> }> = {
  es: {
    title: 'Resultados que tu negocio necesita hoy',
    cards: [
      {
        icon: Moon,
        title: '¿Pierdes oportunidades fuera de horario?',
        description: 'Tu agente IA responde en minutos por WhatsApp y web para que no se enfrie ningun lead.',
      },
      {
        icon: MessageCircleQuestion,
        title: '¿Tu equipo repite respuestas todo el dia?',
        description: 'Automatiza preguntas frecuentes con respuestas claras y consistentes, sin saturar a tu personal.',
      },
      {
        icon: FileBarChart2,
        title: '¿La operacion te quita tiempo para vender?',
        description: 'Con automatizacion e indicadores clave, recuperas horas y tomas decisiones con mejor informacion.',
      },
    ],
  },
  en: {
    title: 'Outcomes your business needs now',
    cards: [
      {
        icon: Moon,
        title: 'Losing opportunities after hours?',
        description: 'Your AI agent replies on WhatsApp and web in minutes, so no lead goes cold.',
      },
      {
        icon: MessageCircleQuestion,
        title: 'Is your team repeating the same answers all day?',
        description: 'Automate recurring questions with clear, consistent responses without burning out your staff.',
      },
      {
        icon: FileBarChart2,
        title: 'Is operations stealing time from sales?',
        description: 'With automation and actionable metrics, you regain hours and make better decisions faster.',
      },
    ],
  },
};

export default function ProblemSection({ locale = 'es' }: { locale?: Locale }) {
  const content = PROBLEM_CONTENT[locale];

  return (
    <section className="relative py-20 md:py-28 bg-linear-to-b from-[#0D0D0D] via-[#10151A] to-[#0D0D0D] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-12">
          {content.title}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {content.cards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-[#16181A]/80 p-8 flex flex-col items-center text-center shadow-lg hover:border-[#00D4FF]/40 transition-all duration-200">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-linear-to-br from-[#00D4FF]/20 to-[#10B981]/20 mb-5">
                <card.icon size={28} className="text-[#00D4FF]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
              <p className="text-[#A1A1AA] text-base">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
