import HeroSection from "@/components/sections/HeroSection";
import ProblemSection from "@/components/sections/ProblemSection";
import OffersSection from "@/components/sections/OffersSection";
import GuaranteeSection from "@/components/sections/GuaranteeSection";
import ResultsByLevelSection from "@/components/sections/ResultsByLevelSection";
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
  aggressive: ['presencia que convierte', 'agente IA 24/7', 'operacion automatizada', 'memoria empresarial'],
  premium: ['presencia digital premium', 'IA para ventas y soporte', 'automatizacion operativa', 'inteligencia con contexto'],
  balanced: ['presencia digital', 'agente IA', 'automatizacion', 'memoria empresarial'],
};

const HERO_WORDS_EN: Record<HeroWordsVariant, string[]> = {
  aggressive: ['conversion-ready presence', '24/7 AI agent', 'automated operations', 'enterprise memory'],
  premium: ['premium digital presence', 'AI for sales and support', 'operational automation', 'context-aware intelligence'],
  balanced: ['digital presence', 'AI agent', 'automation', 'enterprise memory'],
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
      where: {
        published: true,
        planKey: {
          startsWith: 'capa-',
        },
      },
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

  const heroBadge = locale === 'es'
    ? (settings['hero.badgeEs'] || 'Plataforma IA para SMB LATAM')
    : (settings['hero.badgeEn'] || 'AI Platform for LATAM SMBs');
  const heroTitle = locale === 'es'
    ? (settings['hero.titleEs'] || 'Creamos sistemas inteligentes para vender, atender y operar mejor')
    : (settings['hero.titleEn'] || 'We build intelligent systems to sell, serve, and operate better');
  const heroSubtitle = locale === 'es'
    ? (settings['hero.subtitleEs'] || 'Integramos presencia digital, agentes IA y automatizacion para que tu empresa responda mas rapido, ahorre tiempo y crezca con orden.')
    : (settings['hero.subtitleEn'] || 'We combine digital presence, AI agents, and automation so your company can respond faster, save time, and scale with structure.');

  const heroOverrides = {
    badge: heroBadge,
    title: heroTitle,
    subtitle: heroSubtitle,
    painHook: locale === 'es'
      ? 'Avanzas por 4 capas de madurez: Presencia Digital IA, Agente IA Experto, Automatizacion Inteligente y Memoria Empresarial.'
      : 'Scale through 4 maturity layers: AI Digital Presence, Expert AI Agent, Smart Automation, and Enterprise Memory.',
    rotatingWords: locale === 'es'
      ? HERO_WORDS_ES[HERO_WORDS_VARIANT_ES]
      : HERO_WORDS_EN[HERO_WORDS_VARIANT_ES],
  };

  const contactOverrides = {
    email: settings['contact.email'],
    whatsapp: settings['contact.whatsapp'],
    location: settings['contact.location'],
  };

  return (
    <>
      <HeroSection locale={locale} overrides={heroOverrides} />
      <ProblemSection locale={locale} />
      <OffersSection locale={locale} offers={offers} />
      <GuaranteeSection />
      <ResultsByLevelSection />
      <TimelineSection locale={locale} />
      <TechStackSection locale={locale} />
      <PortfolioSection />
      <PeruSection locale={locale} />
      <Suspense fallback={null}>
        <ContactSection overrides={contactOverrides} offers={offers} />
      </Suspense>
    </>
  );
}
