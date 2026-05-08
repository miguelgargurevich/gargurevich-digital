import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Sparkles, Star, Zap, ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';

type OfferRow = Awaited<ReturnType<typeof db.offer.findMany>>[number];

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  zap: Zap,
  star: Star,
  sparkles: Sparkles,
};

const UI_LABELS = {
  es: {
    badge: 'Planes y Precios',
    title: 'Planes claros',
    titleHighlight: 'para tu negocio',
    subtitle: 'Sin letra chica ni costos ocultos. Elige el plan que mejor encaja con lo que necesitas.',
    viewAll: 'Ver todos los planes',
    popularBadge: 'Más popular',
    note: '*Precios referenciales. El costo final puede variar según alcance y funcionalidades.',
  },
  en: {
    badge: 'Plans & Pricing',
    title: 'Clear plans',
    titleHighlight: 'for your business',
    subtitle: 'No fine print, no hidden costs. Pick the plan that fits your needs best.',
    viewAll: 'View all plans',
    popularBadge: 'Most popular',
    note: '*Reference pricing. Final cost may vary based on scope and features.',
  },
};

interface Props {
  locale: string;
}

async function getPublishedOffers(): Promise<OfferRow[]> {
  try {
    return await db.offer.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  } catch {
    return [];
  }
}

export default async function OffersSection({ locale }: Props) {
  const offers = await getPublishedOffers();
  if (offers.length === 0) return null;

  const ui = UI_LABELS[locale as 'es' | 'en'] ?? UI_LABELS.en;

  return (
    <section id="ofertas" className="relative py-24 md:py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_60%)]" />
        <div className="dot-pattern absolute inset-0 opacity-10" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-[#CFCFD2] mb-6">
            <Sparkles size={14} className="text-[#8B5CF6]" />
            {ui.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
            {ui.title}{' '}
            <span className="gradient-text">{ui.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-[#A1A1AA] text-lg max-w-2xl mx-auto leading-8">{ui.subtitle}</p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-10">
          {offers.map((offer) => {
            const name = locale === 'es' ? offer.nameEs : offer.nameEn;
            const description = locale === 'es' ? offer.descriptionEs : offer.descriptionEn;
            const items = locale === 'es' ? offer.itemsEs : offer.itemsEn;
            const cta = locale === 'es' ? offer.ctaEs : offer.ctaEn;
            const forWho = locale === 'es' ? offer.forWhoEs : offer.forWhoEn;
            const priceNote = locale === 'es' ? offer.priceNoteEs : offer.priceNoteEn;
            const Icon = ICON_MAP[offer.icon] ?? Zap;

            return (
              <article
                key={offer.id}
                className={`relative rounded-3xl p-6 flex flex-col gap-4 transition-all duration-300 ${
                  offer.popular
                    ? 'border border-[#8B5CF6]/50 bg-linear-to-br from-[#8B5CF6]/8 via-[#00D4FF]/6 to-[#121212] shadow-[0_0_40px_rgba(139,92,246,0.10)]'
                    : 'border border-white/10 bg-[#121212]/90'
                }`}
              >
                {offer.popular && (
                  <div className="absolute -top-3.5 left-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-[#8B5CF6] to-[#00D4FF] text-background text-xs font-semibold shadow-[0_0_16px_rgba(139,92,246,0.5)]">
                      <Star size={10} className="fill-current" />
                      {ui.popularBadge}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                      offer.popular
                        ? 'bg-linear-to-br from-[#8B5CF6]/30 to-[#00D4FF]/30 border border-[#8B5CF6]/30'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <Icon size={16} className={offer.popular ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'} />
                    </div>
                    <h3 className="text-base font-semibold text-white leading-snug">{name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xl font-bold ${offer.popular ? 'text-[#8B5CF6]' : 'text-white'}`}>
                      {offer.price}
                    </p>
                    <p className="text-[10px] text-[#71717A] mt-0.5">{priceNote}</p>
                  </div>
                </div>

                <p className="text-[#A1A1AA] text-xs leading-6">{description}</p>

                <ul className="space-y-2 flex-1">
                  {items.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[#D4D4D8] text-xs">
                      <CheckCircle2
                        size={13}
                        className={`mt-0.5 shrink-0 ${offer.popular ? 'text-[#8B5CF6]' : 'text-[#52525B]'}`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                  {items.length > 3 && (
                    <li className="text-[#52525B] text-xs pl-5">+{items.length - 3} más...</li>
                  )}
                </ul>

                <p className="text-[10px] text-[#52525B] border-t border-white/6 pt-3">{forWho}</p>

                <Link
                  href={`/${locale}?plan=${offer.planKey}#contacto`}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 font-medium text-xs transition-all duration-200 ${
                    offer.popular
                      ? 'bg-linear-to-r from-[#8B5CF6] to-[#00D4FF] text-background hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]'
                      : 'border border-white/10 text-white hover:bg-white/5'
                  }`}
                >
                  {cta}
                  <ArrowUpRight size={12} />
                </Link>
              </article>
            );
          })}
        </div>

        {/* Note + View all */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#52525B]">{ui.note}</p>
          <Link
            href={`/${locale}/ofertas`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-sm text-white hover:bg-white/5 hover:border-white/25 transition-all group"
          >
            {ui.viewAll}
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
