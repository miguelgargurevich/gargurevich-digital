import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import LayersSection from "@/components/sections/LayersSection";
import TimelineSection from "@/components/sections/TimelineSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TechStackSection from "@/components/sections/TechStackSection";
import { Suspense } from 'react';
import ContactSection from "@/components/sections/ContactSection";
import PeruSection from "@/components/sections/PeruSection";
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type HeroWordsVariant = 'aggressive' | 'premium' | 'balanced';

const HERO_WORDS_ES: Record<HeroWordsVariant, string[]> = {
  aggressive: ['lanzamiento en 48h', 'asistente IA 24/7', 'operacion automatizada', 'decisiones con datos'],
  premium: ['presencia digital premium', 'IA para ventas y soporte', 'arquitectura escalable', 'automatizacion operativa'],
  balanced: ['presencia digital', 'asistente IA', 'automatizaciones'],
};

// Switch here for quick A/B tests without touching the hero component.
const HERO_WORDS_VARIANT_ES: HeroWordsVariant = 'balanced';

async function getSiteSettings() {
  try {
    const rows = await db.siteSetting.findMany();
    return rows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

async function getPublishedOffers() {
  try {
    return await db.offer.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        planKey: true,
        icon: true,
        popular: true,
        nameEs: true,
        nameEn: true,
        price: true,
        priceNoteEs: true,
        priceNoteEn: true,
        descriptionEs: true,
        descriptionEn: true,
        itemsEs: true,
        itemsEn: true,
        ctaEs: true,
        ctaEn: true,
        forWhoEs: true,
        forWhoEn: true,
      },
    });
  } catch {
    return [];
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: 'es' | 'en' }>;
}) {
  const { locale } = await params;
  const [settings, offers] = await Promise.all([getSiteSettings(), getPublishedOffers()]);

  const heroOverrides = {
    badge: locale === 'es' ? 'Web + IA + Automatizacion' : (settings['hero.badgeEn'] || settings['hero.badgeEs']),
    title: locale === 'es'
      ? 'Web, IA y automatizacion para negocios modernos'
      : (settings['hero.titleEn'] || settings['hero.titleEs']),
    subtitle: locale === 'es'
      ? 'Creamos presencia digital profesional, asistentes IA y automatizaciones que ayudan a tu negocio a operar mejor.'
      : (settings['hero.subtitleEn'] || settings['hero.subtitleEs']),
    painHook: locale === 'es'
      ? 'Implementacion por etapas: empezamos con presencia digital, activamos IA para atencion y luego automatizamos la operacion.'
      : undefined,
    rotatingWords: locale === 'es'
      ? HERO_WORDS_ES[HERO_WORDS_VARIANT_ES]
      : undefined,
  };

  const contactOverrides = {
    email: settings['contact.email'],
    whatsapp: settings['contact.whatsapp'],
    location: settings['contact.location'],
  };

  return (
    <>
      <HeroSection overrides={heroOverrides} />
      <ProblemSection />
      <LayersSection />
      <TimelineSection />
      <TechStackSection locale={locale} />
      <PortfolioSection />
      <PeruSection locale={locale} />
      <Suspense fallback={null}>
        <ContactSection overrides={contactOverrides} offers={offers} />
      </Suspense>
    </>
  );
}
