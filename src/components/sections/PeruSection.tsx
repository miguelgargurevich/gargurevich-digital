import Link from 'next/link';
import { MessageCircle, CreditCard, Globe, ArrowRight } from 'lucide-react';

const UI_LABELS = {
  es: {
    badge: 'Hecho para Perú',
    title: 'Para negocios',
    titleHighlight: 'de Perú',
    subtitle: 'Entendemos cómo funciona el mercado peruano. Por eso trabajamos con las herramientas y los canales que tu cliente ya usa.',
    features: [
      {
        icon: 'credit-card',
        title: 'Aceptamos Yape y Plin',
        description: 'Paga como prefieras. Sin complicaciones de transferencias internacionales.',
      },
      {
        icon: 'message-circle',
        title: 'Soporte por WhatsApp en horario peruano',
        description: 'Respondemos de lunes a sábado de 9am a 7pm (hora Lima). Siempre hay alguien.',
      },
      {
        icon: 'globe',
        title: 'Dominio .pe o .com.pe en todos nuestros planes',
        description: 'Tu negocio con dirección peruana. Desde S/ 150/año con el plan Solo dominio + correos.',
      },
    ],
    ctaText: 'Ver planes desde S/ 150',
    ctaHref: '/ofertas',
  },
  en: {
    badge: 'Built for Peru',
    title: 'For businesses',
    titleHighlight: 'in Peru',
    subtitle: "We understand how the Peruvian market works. That's why we use the tools and channels your customers already trust.",
    features: [
      {
        icon: 'credit-card',
        title: 'We accept Yape and Plin',
        description: 'Pay however you prefer. No hassle with international transfers.',
      },
      {
        icon: 'message-circle',
        title: 'WhatsApp support in Peruvian hours',
        description: 'We respond Monday to Saturday, 9am–7pm (Lima time). Someone is always there.',
      },
      {
        icon: 'globe',
        title: '.pe or .com.pe domain in all our plans',
        description: 'Give your business a Peruvian address. Starting from S/ 150/year with our Domain + Corporate Email plan.',
      },
    ],
    ctaText: 'See plans from S/ 150',
    ctaHref: '/offers',
  },
};

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'credit-card': CreditCard,
  'message-circle': MessageCircle,
  globe: Globe,
};

interface Props {
  locale: string;
}

export default function PeruSection({ locale }: Props) {
  const ui = UI_LABELS[locale as 'es' | 'en'] ?? UI_LABELS.en;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,212,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.05),transparent_55%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-[#CFCFD2] mb-6">
            {/* Peru flag colors accent */}
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-3 rounded-sm bg-red-500 inline-block" />
              <span className="w-2 h-3 rounded-sm bg-white inline-block" />
              <span className="w-2 h-3 rounded-sm bg-red-500 inline-block" />
            </span>
            {ui.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
            {ui.title}{' '}
            <span className="gradient-text">{ui.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-[#A1A1AA] text-lg max-w-2xl mx-auto leading-8">
            {ui.subtitle}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-5 sm:grid-cols-3 mb-12">
          {ui.features.map((feature) => {
            const Icon = ICON_MAP[feature.icon] ?? Globe;
            return (
              <div
                key={feature.icon}
                className="rounded-2xl border border-white/10 bg-[#121212]/80 p-6 flex flex-col gap-3 hover:border-white/20 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#8B5CF6]/20 to-[#00D4FF]/20 border border-[#8B5CF6]/20 flex items-center justify-center">
                  <Icon size={18} className="text-[#8B5CF6]" />
                </div>
                <h3 className="text-white font-semibold text-sm leading-snug">{feature.title}</h3>
                <p className="text-[#A1A1AA] text-xs leading-6">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href={`/${locale}${ui.ctaHref}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#8B5CF6] to-[#00D4FF] text-background font-semibold text-sm hover:shadow-[0_0_24px_rgba(139,92,246,0.35)] transition-all duration-200 group"
          >
            {ui.ctaText}
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
