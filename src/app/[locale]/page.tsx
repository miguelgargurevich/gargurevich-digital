import HeroSection from "@/components/sections/HeroSection";
import AuthoritySection from "@/components/sections/AuthoritySection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ProcessSection from "@/components/sections/ProcessSection";
import { Suspense } from 'react';
import ContactSection from "@/components/sections/ContactSection";
import OffersSection from "@/components/sections/OffersSection";
import PeruSection from "@/components/sections/PeruSection";
import { db } from '@/lib/db';

type HeroWordsVariant = 'aggressive' | 'premium' | 'balanced';

const HERO_WORDS_ES: Record<HeroWordsVariant, string[]> = {
  aggressive: ['clientes hoy', 'mas leads por WhatsApp', 'ventas cada semana', 'resultados medibles'],
  premium: ['presencia premium', 'marca que inspira confianza', 'autoridad digital', 'crecimiento sostenible'],
  balanced: ['clientes reales', 'mas mensajes por WhatsApp', 'ventas constantes', 'autoridad digital'],
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
        planKey: true,
        nameEs: true,
        nameEn: true,
        price: true,
        descriptionEs: true,
        descriptionEn: true,
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
    badge: locale === 'es' ? 'Presencia Digital para Negocios' : (settings['hero.badgeEn'] || settings['hero.badgeEs']),
    title: locale === 'es'
      ? 'Ayudo a negocios a convertir su presencia digital en'
      : (settings['hero.titleEn'] || settings['hero.titleEs']),
    subtitle: locale === 'es'
      ? 'Landing pages, webs corporativas y automatización de leads. Todo enfocado en que tu cliente te encuentre, te escriba y te compre. Desde S/299. Yape y Plin. Garantía 15 días.'
      : (settings['hero.subtitleEn'] || settings['hero.subtitleEs']),
    painHook: locale === 'es'
      ? 'Si tu negocio no aparece en Google, no tiene forma de recibir pedidos por WhatsApp o tu web no convierte… estás perdiendo clientes hoy. Yo resuelvo eso en menos de 48 horas.'
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
      <AuthoritySection />
      <section id="servicios">
        <OffersSection locale={locale} />
      </section>
      <PortfolioSection />
      <TechStackSection />
      <ProcessSection />
      <PeruSection locale={locale} />
      <Suspense fallback={null}>
        <ContactSection overrides={contactOverrides} offers={offers} />
      </Suspense>
    </>
  );
}
