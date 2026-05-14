import Link from 'next/link';
import { ArrowUpRight, Bot, Globe2, Sparkles, Star, Workflow, Zap } from 'lucide-react';

type OfferCard = {
  id: string;
  planKey: string;
  icon: string;
  popular: boolean;
  nameEs: string;
  nameEn: string;
  price: string;
  priceNoteEs: string;
  priceNoteEn: string;
  descriptionEs: string;
  descriptionEn: string;
  itemsEs: string[];
  itemsEn: string[];
  ctaEs: string;
  ctaEn: string;
  forWhoEs: string;
  forWhoEn: string;
};

interface Props {
  locale: 'es' | 'en';
  offers: OfferCard[];
}

const CONTENT = {
  es: {
    badge: 'Oferta por niveles',
    title: 'No solo construimos sitios, creamos sistemas que trabajan por ti',
    subtitle:
      'Cada nivel impulsa una etapa de madurez tecnologica: presencia, atencion con IA, automatizacion y memoria empresarial.',
    labels: [
      'Starter: Presencia Digital para captar y convertir.',
      'Growth: Agente IA para ventas y soporte 24/7.',
      'Scale: Automatizacion para escalar operacion.',
      'Signature: Memoria Empresarial para ventaja competitiva.',
    ],
    annualBundle: 'Pack anual 4 niveles: consulta descuento por contratacion conjunta.',
  },
  en: {
    badge: 'Layered offering',
    title: 'We do not just build websites, we build systems that work for you',
    subtitle:
      'Each layer advances your technology maturity: presence, AI service, automation, and enterprise memory.',
    labels: [
      'Starter: Digital Presence to attract and convert.',
      'Growth: AI Agent for 24/7 sales and support.',
      'Scale: Automation to scale operations.',
      'Signature: Enterprise Memory for competitive advantage.',
    ],
    annualBundle: '4-layer annual bundle: ask for a combined-contract discount.',
  },
} as const;

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  zap: Zap,
  star: Star,
  sparkles: Sparkles,
};

const ACCENT_BY_PLAN: Record<string, string> = {
  'capa-1-presencia-digital': 'from-[#00D4FF] to-[#22D3EE]',
  'capa-2-agente-ia': 'from-[#10B981] to-[#34D399]',
  'capa-3-automatizacion': 'from-[#F59E0B] to-[#FB923C]',
  'capa-4-memoria-empresarial': 'from-[#7C3AED] to-[#A78BFA]',
  'presencia-digital-ia': 'from-[#00D4FF] to-[#22D3EE]',
  'asistente-ia-experto': 'from-[#10B981] to-[#34D399]',
  'automatizacion-inteligente': 'from-[#F59E0B] to-[#FB923C]',
};

const FALLBACK_ICONS: Array<React.ComponentType<{ size?: number; className?: string }>> = [Globe2, Bot, Workflow];

function getTierTitle(planKey: string, locale: 'es' | 'en', fallback: string): string {
  const titles: Record<string, { es: string; en: string }> = {
    'capa-1-presencia-digital': {
      es: 'Starter — Presencia Digital',
      en: 'Starter — Digital Presence',
    },
    'capa-2-agente-ia': {
      es: 'Growth — Agente IA',
      en: 'Growth — AI Agent',
    },
    'capa-3-automatizacion': {
      es: 'Scale — Automatizacion Inteligente',
      en: 'Scale — Smart Automation',
    },
    'capa-4-memoria-empresarial': {
      es: 'Signature — Memoria Empresarial',
      en: 'Signature — Enterprise Memory',
    },
  };

  return titles[planKey]?.[locale] ?? fallback;
}

function splitTierTitle(title: string): { tier: string; name: string } {
  const [tier, name] = title.split('—').map((part) => part.trim());
  return {
    tier: tier ?? title,
    name: name ?? '',
  };
}

function OfferTile({ offer, locale }: { offer: OfferCard; locale: 'es' | 'en' }) {
  const fallbackTitle = locale === 'es' ? offer.nameEs : offer.nameEn;
  const title = getTierTitle(offer.planKey, locale, fallbackTitle);
  const tierParts = splitTierTitle(title);
  const serviceName = tierParts.name || fallbackTitle;
  const description = locale === 'es' ? offer.descriptionEs : offer.descriptionEn;
  const items = locale === 'es' ? offer.itemsEs : offer.itemsEn;
  const cta = locale === 'es' ? offer.ctaEs : offer.ctaEn;
  const forWho = locale === 'es' ? offer.forWhoEs : offer.forWhoEn;
  const priceNote = locale === 'es' ? offer.priceNoteEs : offer.priceNoteEn;

  const AccentIcon = ICON_MAP[offer.icon];
  const FallbackIcon = FALLBACK_ICONS[Math.min(2, offer.id.length % 3)];
  const Icon = AccentIcon ?? FallbackIcon;
  const accent = ACCENT_BY_PLAN[offer.planKey] ?? 'from-[#00D4FF] to-[#22D3EE]';

  return (
    <article className="relative rounded-3xl border border-white/12 bg-[#111111]/88 backdrop-blur-xl p-7 md:p-8 h-full flex flex-col shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20">
      <div className="mb-5 flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl bg-linear-to-br ${accent} flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.3)]`}>
          <Icon size={20} className="text-background" />
        </div>
        <span className="inline-block px-2.5 py-1 rounded-full border border-[#00D4FF]/35 bg-[#00D4FF]/10 text-[#67E8F9] text-[11px] tracking-[0.12em] uppercase">
          {tierParts.tier}
        </span>
      </div>

      <h3 className="text-2xl font-semibold leading-tight text-white">{serviceName}</h3>
      <p className="mt-3 text-sm text-[#A1A1AA] leading-6">{description}</p>

      <div className="mt-5 space-y-1">
        <p className="text-base font-semibold text-white">{offer.price}</p>
        <p className="text-xs text-[#A1A1AA]">{priceNote}</p>
      </div>

      <ul className="mt-6 space-y-3 flex-1">
        {items.map((benefit) => (
          <li key={benefit} className="flex items-start gap-3 text-sm text-[#CFCFD2]">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00D4FF] shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-xs text-[#A1A1AA]">{forWho}</p>

      <Link
        href={`/${locale}?plan=${offer.planKey}#contacto`}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 text-white px-5 py-3 text-sm font-medium transition-all duration-200 hover:border-[#00D4FF]/55 hover:bg-[#00D4FF]/10"
      >
        {cta}
        <ArrowUpRight size={15} />
      </Link>
    </article>
  );
}

export default function OffersSection({ locale, offers }: Props) {
  if (!offers || offers.length === 0) return null;

  const content = locale === 'es' ? CONTENT.es : CONTENT.en;
  const layerOrder = [
    'capa-1-presencia-digital',
    'capa-2-agente-ia',
    'capa-3-automatizacion',
    'capa-4-memoria-empresarial',
  ];
  const selectedOffers = layerOrder
    .map((planKey) => offers.find((offer) => offer.planKey === planKey))
    .filter((offer): offer is OfferCard => Boolean(offer));
  const cards = selectedOffers.length > 0
    ? selectedOffers
    : offers.filter((offer) => offer.planKey.startsWith('capa-')).slice(0, 4);

  return (
    <section id="ofertas" className="relative overflow-hidden bg-background py-24 md:py-30">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(0,212,255,0.16),transparent_35%),radial-gradient(circle_at_85%_16%,rgba(16,185,129,0.15),transparent_30%),linear-gradient(180deg,#090909_0%,#101010_100%)]" />
        <div className="dot-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-4xl mb-14 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-[#CFCFD2]">
            {content.badge}
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">{content.title}</h2>
          <p className="mt-5 text-lg text-[#A1A1AA] leading-8">{content.subtitle}</p>

          <div className="mt-6 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {content.labels.map((label) => (
              <p key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-[#D4D4D8]">
                {label}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((offer) => (
            <OfferTile key={offer.id} offer={offer} locale={locale} />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-[#00D4FF]/25 bg-[#00D4FF]/8 px-5 py-4 text-sm text-[#D6F4FF]">
          {content.annualBundle}
        </div>
      </div>
    </section>
  );
}
