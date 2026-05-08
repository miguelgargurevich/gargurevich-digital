import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ProcessSection from "@/components/sections/ProcessSection";
import StatsSection from "@/components/sections/StatsSection";
import ContactSection from "@/components/sections/ContactSection";
import OffersSection from "@/components/sections/OffersSection";
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
    badge: locale === 'es' ? settings['hero.badgeEs'] : settings['hero.badgeEn'],
    title: locale === 'es' ? settings['hero.titleEs'] : settings['hero.titleEn'],
    subtitle: locale === 'es' ? settings['hero.subtitleEs'] : settings['hero.subtitleEn'],
  };

  const contactOverrides = {
    email: settings['contact.email'],
    whatsapp: settings['contact.whatsapp'],
    location: settings['contact.location'],
  };

  const statsOverrides = {
    projects: settings['stats.projects'],
    clients: settings['stats.clients'],
    experience: settings['stats.experience'],
  };

  return (
    <>
      <HeroSection overrides={heroOverrides} />
      <ServicesSection />
      <StatsSection overrides={statsOverrides} />
      <PortfolioSection />
      <TechStackSection />
      <ProcessSection />
        <OffersSection locale={locale} />
      <ContactSection overrides={contactOverrides} offers={offers} />
    </>
  );
}
