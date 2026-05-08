import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Sparkles, Star, Zap } from 'lucide-react';
import { db } from '@/lib/db';
import { setRequestLocale } from 'next-intl/server';

type OfferRow = Awaited<ReturnType<typeof db.offer.findMany>>[number];

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  zap: Zap,
  star: Star,
  sparkles: Sparkles,
};

const UI_LABELS = {
  es: {
    metaTitle: 'Mis Servicios | Gargurevich Digital',
    metaDescription: 'Planes claros para negocios que quieren vender mejor: Google Business, landing WhatsApp, web editable, web corporativa y mantenimiento.',
    badge: 'Mis Servicios',
    title: 'Una web que te genera clientes, no solo visitas',
    subtitle: 'Elige el plan que mejor encaja con tu negocio. Sin letra chica, con costos claros desde el inicio.',
    packagesTitle: 'Elige tu plan',
    popularBadge: 'Más popular',
    ctaSecondary: 'Volver al inicio',
    note: 'El dominio es tuyo desde el día 1. Yo solo te ayudo a registrarlo y renovarlo si lo necesitas.',
    summaryTitle: 'Resumen de costos después del primer año',
    summaryDomainLabel: 'Renovación de dominio .pe o .com.pe',
    summaryDomainValue: 'S/ 95 por año',
    summaryHostLabel: 'Hosting si no tienes mensualidad activa',
    summaryHostValue: 'S/ 20 - 30/mes',
    summarySupportLabel: 'Mensualidad de soporte y mantenimiento',
    summarySupportValue: 'S/ 19, 39, 79 o 149',
    summaryOwnerNote: 'El dominio es tuyo desde el día 1. Si en el futuro quieres llevarte tu web a otro proveedor, no hay problema: te entrego todo.',
    empty: 'No hay planes disponibles en este momento.',
  },
  en: {
    metaTitle: 'My Services | Gargurevich Digital',
    metaDescription: 'Clear plans for businesses that want to sell better: Google Business, WhatsApp landing page, editable website, corporate website and maintenance.',
    badge: 'My Services',
    title: 'A website that brings clients, not just traffic',
    subtitle: 'Pick the plan that fits your business best. No fine print, with clear costs from the start.',
    packagesTitle: 'Choose your plan',
    popularBadge: 'Most popular',
    ctaSecondary: 'Back to home',
    note: 'The domain is yours from day one. I only help register and renew it if you need it.',
    summaryTitle: 'Cost summary after the first year',
    summaryDomainLabel: '.pe or .com.pe domain renewal',
    summaryDomainValue: 'S/ 95 per year',
    summaryHostLabel: 'Hosting if you do not have an active monthly plan',
    summaryHostValue: 'S/ 20 - 30/mo',
    summarySupportLabel: 'Support and maintenance monthly fee',
    summarySupportValue: 'S/ 19, 39, 79 or 149',
    summaryOwnerNote: 'The domain is yours from day one. If you ever want to move your site to another provider, no problem: I deliver everything.',
    empty: 'No plans available at the moment.',
  },
};

async function getPublishedOffers(): Promise<OfferRow[]> {
  try {
    return await db.offer.findMany({ where: { published: true }, orderBy: { order: 'asc' } });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ui = UI_LABELS[locale as 'es' | 'en'] ?? UI_LABELS.en;
  return { title: ui.metaTitle, description: ui.metaDescription };
}

export default async function OffersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const offers = await getPublishedOffers();
  const ui = UI_LABELS[locale as 'es' | 'en'] ?? UI_LABELS.en;

  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.16),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.14),transparent_24%),linear-gradient(180deg,#090909_0%,#101010_100%)]" />
        <div className="dot-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Hero */}
        <div className="max-w-3xl mb-14 md:mb-18">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-[#CFCFD2]">
            <Sparkles size={14} className="text-[#00D4FF]" />
            {ui.badge}
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">
            {ui.title}
          </h1>
          <p className="mt-5 text-lg text-[#A1A1AA] leading-8">{ui.subtitle}</p>
        </div>

        {/* Packages */}
        <div className="mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">{ui.packagesTitle}</h2>

          {offers.length === 0 ? (
            <p className="text-[#71717A]">{ui.empty}</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
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
                    className={`relative rounded-3xl p-7 flex flex-col gap-5 transition-all duration-300 ${
                      offer.popular
                        ? 'border border-[#00D4FF]/50 bg-linear-to-br from-[#00D4FF]/8 via-[#8B5CF6]/6 to-[#121212] shadow-[0_0_40px_rgba(0,212,255,0.10)]'
                        : 'border border-white/10 bg-[#121212]/90 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]'
                    }`}
                  >
                    {offer.popular && (
                      <div className="absolute -top-3.5 left-7">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-[#00D4FF] to-[#8B5CF6] text-background text-xs font-semibold shadow-[0_0_16px_rgba(0,212,255,0.5)]">
                          <Star size={11} className="fill-current" />
                          {ui.popularBadge}
                        </span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                          offer.popular
                            ? 'bg-linear-to-br from-[#00D4FF]/30 to-[#8B5CF6]/30 border border-[#00D4FF]/30'
                            : 'bg-white/5 border border-white/10'
                        }`}>
                          <Icon size={18} className={offer.popular ? 'text-[#00D4FF]' : 'text-[#A1A1AA]'} />
                        </div>
                        <h3 className="text-xl font-semibold text-white">{name}</h3>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-2xl font-bold ${offer.popular ? 'text-[#00D4FF]' : 'text-white'}`}>
                          {offer.price}
                        </p>
                        <p className="text-xs text-[#71717A] mt-0.5">{priceNote}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#A1A1AA] leading-7 text-sm">{description}</p>

                    {/* Features */}
                    <ul className="space-y-2.5 flex-1">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[#D4D4D8] text-sm">
                          <CheckCircle2
                            size={16}
                            className={`mt-0.5 shrink-0 ${offer.popular ? 'text-[#00D4FF]' : 'text-[#52525B]'}`}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* For who */}
                    <p className="text-xs text-[#71717A] border-t border-white/6 pt-4">{forWho}</p>

                    {/* CTA */}
                    <Link
                      href={`/${locale}?plan=${offer.planKey}#contacto`}
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium text-sm transition-all duration-200 ${
                        offer.popular
                          ? 'bg-linear-to-r from-[#00D4FF] to-[#8B5CF6] text-background hover:shadow-[0_0_24px_rgba(0,212,255,0.35)]'
                          : 'border border-white/10 text-white hover:bg-white/5'
                      }`}
                    >
                      {cta}
                      <ArrowUpRight size={15} />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Note */}
        <div className="rounded-3xl border border-white/8 bg-white/3 px-6 py-5 text-sm text-[#71717A] mb-10">
          {ui.note}
        </div>

        {/* Yearly summary */}
        <div className="rounded-3xl border border-white/10 bg-[#121212]/90 p-6 mb-10">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold text-white">{ui.summaryTitle}</h3>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                {ui.summaryOwnerNote}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-[#71717A]">{ui.summaryDomainLabel}</p>
              <p className="mt-1 text-sm font-semibold text-white">{ui.summaryDomainValue}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-[#71717A]">{ui.summaryHostLabel}</p>
              <p className="mt-1 text-sm font-semibold text-white">{ui.summaryHostValue}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
              <p className="text-xs text-[#71717A]">{ui.summarySupportLabel}</p>
              <p className="mt-1 text-sm font-semibold text-white">{ui.summarySupportValue}</p>
            </div>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-white hover:bg-white/5 transition-colors w-full sm:w-auto"
          >
            {ui.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
