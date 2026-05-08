import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ProcessSection from "@/components/sections/ProcessSection";
import { Suspense } from 'react';
import ContactSection from "@/components/sections/ContactSection";
import OffersSection from "@/components/sections/OffersSection";
import PeruSection from "@/components/sections/PeruSection";
import { db } from '@/lib/db';

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
    badge: locale === 'es' ? 'Presencia Digital para Negocios Peruanos' : (settings['hero.badgeEn'] || settings['hero.badgeEs']),
    title: locale === 'es'
      ? 'Tu negocio merece una web que traiga clientes, no solo visitas'
      : (settings['hero.titleEn'] || settings['hero.titleEs']),
    subtitle: locale === 'es'
      ? 'Landing pages, sitios corporativos y presencia digital completa para negocios peruanos. Con dominio propio, correos profesionales y soporte real en WhatsApp. Desde S/299. Yape y Plin. Garantia de 15 dias.'
      : (settings['hero.subtitleEn'] || settings['hero.subtitleEs']),
  };

  const contactOverrides = {
    email: settings['contact.email'],
    whatsapp: settings['contact.whatsapp'],
    location: settings['contact.location'],
  };

  return (
    <>
      <HeroSection overrides={heroOverrides} />
      <ServicesSection />
      <PortfolioSection />
      <TechStackSection />
      <ProcessSection />
        <OffersSection locale={locale} />
        <PeruSection locale={locale} />
      <Suspense fallback={null}>
        <ContactSection overrides={contactOverrides} offers={offers} />
      </Suspense>
    </>
  );
}
