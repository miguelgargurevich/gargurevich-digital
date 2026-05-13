import { Zap, Bot, BarChart3, Moon, MessageCircleQuestion, FileBarChart2 } from 'lucide-react';

const PROBLEM_CARDS = [
  {
    icon: Moon,
    title: '¿Pierdes ventas de noche?',
    description: 'Un agente IA responde WhatsApp a las 2am, nunca pierdas un lead por horario.'
  },
  {
    icon: MessageCircleQuestion,
    title: '¿Clientes preguntan lo mismo siempre?',
    description: 'El bot responde FAQs y dudas frecuentes al instante, sin cansancio ni errores.'
  },
  {
    icon: FileBarChart2,
    title: '¿Pasas horas en reportes?',
    description: 'La IA genera insights y reportes automáticos, ahorra tiempo y toma mejores decisiones.'
  }
];

export default function ProblemSection() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-[#0D0D0D] via-[#10151A] to-[#0D0D0D] overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-12">
          ¿Qué problema resolvemos?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {PROBLEM_CARDS.map((card, i) => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-[#16181A]/80 p-8 flex flex-col items-center text-center shadow-lg hover:border-[#00D4FF]/40 transition-all duration-200">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#00D4FF]/20 to-[#10B981]/20 mb-5">
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
