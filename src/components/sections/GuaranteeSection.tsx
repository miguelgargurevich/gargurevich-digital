import { ShieldCheck } from 'lucide-react';

type Locale = 'es' | 'en';

const COPY: Record<Locale, { title: string; body: string }> = {
  es: {
    title: 'Garantia 30 dias',
    body: '30 dias para probar tu Agente IA sin riesgo. Si no responde bien, lo reentrenamos gratis. Si aun asi no te sirve, cancelas y no pagas el siguiente mes.',
  },
  en: {
    title: '30-day guarantee',
    body: 'Try your AI Agent for 30 days risk-free. If it does not respond well, we retrain it at no cost. If it still does not fit your operation, you cancel and do not pay the next month.',
  },
};

export default function GuaranteeSection({ locale = 'es' }: { locale?: Locale }) {
  const content = COPY[locale];

  return (
    <section className="relative overflow-hidden bg-background py-8 md:py-10">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 md:px-12 lg:px-16">
        <article className="rounded-3xl border border-white/12 border-l-4 border-l-[#22C55E] bg-[#111111]/88 p-6 md:p-8 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
          <div className="flex items-start gap-4 md:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#22C55E]/16 border border-[#22C55E]/40">
              <ShieldCheck className="text-[#86EFAC]" size={24} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white">{content.title}</h3>
              <p className="mt-2 text-sm md:text-base leading-7 text-[#D4D4D8]">{content.body}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
