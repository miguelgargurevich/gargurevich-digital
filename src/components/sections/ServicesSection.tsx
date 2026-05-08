import { getLocale, getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import ServicesSectionClient from './ServicesSectionClient';

async function getServicesFromDb(locale: string) {
  try {
    const rows = await db.service.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });

    return rows.map((row) => ({
      slug: row.slug,
      icon: row.icon,
      title: locale === 'es' ? row.titleEs : row.titleEn,
      description: locale === 'es' ? row.descriptionEs : row.descriptionEn,
      features: locale === 'es' ? row.featuresEs : row.featuresEn,
    }));
  } catch {
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function ServicesSection() {
  const locale = await getLocale();
  const t = await getTranslations('services');
  const services = await getServicesFromDb(locale);

  if (services.length === 0) {
    return null;
  }

  return (
    <ServicesSectionClient
      services={services}
      labels={{
        badge: t('badge'),
        title: t('title'),
        titleHighlight: t('titleHighlight'),
        subtitle: t('subtitle'),
        learnMore: t('learnMore'),
        cta: t('cta'),
      }}
    />
  );
}
