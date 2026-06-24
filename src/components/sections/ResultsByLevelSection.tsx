type Locale = 'es' | 'en';

type Story = {
  business: string;
  problem: string;
  solution: string;
  result: string;
};

const STORIES: Record<Locale, Story[]> = {
  es: [
    {
      business: "Taller mecanico: 'El Turbo'",
      problem: 'Pocos clientes fuera de horario',
      solution: 'Agente IA agenda citas nocturnas',
      result: '+40% citas fuera de horario',
    },
    {
      business: "Clinica dental: 'Sonrisa'",
      problem: 'Recepcionista saturada de consultas',
      solution: 'Bot responde precios 24/7',
      result: 'Recepcionista liberada 3h/dia',
    },
    {
      business: "Consultoria: 'G&A'",
      problem: 'Mucho tiempo en transcribir llamadas',
      solution: 'Whisper transcribe llamadas',
      result: 'Ahorro S/2,000/mes en administrativo',
    },
  ],
  en: [
    {
      business: "Auto shop: 'El Turbo'",
      problem: 'Low booking volume after hours',
      solution: 'AI Agent schedules night appointments',
      result: '+40% after-hours bookings',
    },
    {
      business: "Dental clinic: 'Sonrisa'",
      problem: 'Front desk overloaded with repetitive questions',
      solution: 'Bot answers pricing questions 24/7',
      result: 'Front desk freed up 3h/day',
    },
    {
      business: "Consulting: 'G&A'",
      problem: 'Too much time spent transcribing calls',
      solution: 'Whisper transcribes calls automatically',
      result: 'Savings of S/2,000 per month in admin work',
    },
  ],
};

const LABELS: Record<Locale, { title: string; problem: string; solution: string }> = {
  es: {
    title: 'Resultados reales por nivel',
    problem: 'Problema',
    solution: 'Solucion IA',
  },
  en: {
    title: 'Real outcomes by level',
    problem: 'Problem',
    solution: 'AI solution',
  },
};

export default function ResultsByLevelSection({ locale = 'es' }: { locale?: Locale }) {
  const stories = STORIES[locale];
  const labels = LABELS[locale];

  return (
    <section className="relative overflow-hidden bg-background py-10 md:py-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(0,212,255,0.08),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(16,185,129,0.07),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-8 md:mb-10">
          <h3 className="text-3xl md:text-4xl font-semibold text-white">{labels.title}</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stories.map((s, i) => (
          <article
            key={i}
            className="rounded-3xl border border-white/12 bg-[#111111]/88 p-5 md:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <p className="text-sm font-semibold text-[#67E8F9]">{s.business}</p>
            <p className="mt-4 text-sm leading-6 text-[#D4D4D8]"><span className="text-white font-medium">{labels.problem}:</span> {s.problem}</p>
            <p className="mt-2 text-sm leading-6 text-[#D4D4D8]"><span className="text-white font-medium">{labels.solution}:</span> {s.solution}</p>
            <p className="mt-5 inline-flex rounded-full border border-[#22C55E]/35 bg-[#22C55E]/10 px-3 py-1.5 text-sm font-semibold text-[#86EFAC]">
              {s.result}
            </p>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
