import { getLocale, getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import PortfolioGrid, { type PortfolioProjectItem } from './PortfolioGrid';

type DbProjectRow = Awaited<
  ReturnType<typeof db.portfolioProject.findMany>
>[number];


function parseImageUrls(value: string | null | undefined): string[] {
  if (!value) return [];

  let candidates: string[] = [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      candidates = parsed.map((item) => String(item));
    }
  } catch {
    candidates = value.split(/[\n,|;]/g);
  }

  const unique: string[] = [];
  for (const candidate of candidates) {
    const url = candidate.trim();
    if (!url) continue;
    
    // Permitir rutas locales (empiezan con /)
    // Permitir URLs externas (empiezan con http)
    const isLocal = url.startsWith('/');
    const isExternal = url.startsWith('http');
    
    if (isLocal || isExternal) {
      if (!unique.includes(url)) unique.push(url);
    }
  }

  return unique;
}

async function getProjectsFromDb(locale: string): Promise<PortfolioProjectItem[] | null> {
  try {
    const rows = await db.portfolioProject.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });

    if (rows.length === 0) {
      return null;
    }

    const sizeBySlug: Record<string, PortfolioProjectItem['size']> = {
      dashboardia: 'large',
      invoiceapp: 'wide',
      house: 'tall',
      jafernandez: 'default',
      lumic: 'default',
      portfolio: 'wide',
      solucionesintegrales: 'default',
      pcm: 'default',
    };

    return rows.map((row: DbProjectRow) => {
      const parsedImages = parseImageUrls(row.imageUrl);
      return {
        id: row.slug,
        title: locale === 'es' ? row.titleEs : row.titleEn,
        description: locale === 'es' ? row.descriptionEs : row.descriptionEn,
        features: locale === 'es' ? row.featuresEs : row.featuresEn,
        tech: row.tech,
        github: row.github,
        live: row.live,
        color: row.color,
        size: sizeBySlug[row.slug] ?? 'default',
        images: parsedImages,
      };
    });
  } catch (err) {
    console.error('getProjectsFromDb ERROR:', err);
    return null;
  }
}

export const dynamic = 'force-dynamic';

export default async function PortfolioSection() {
  const locale = await getLocale();
  const t = await getTranslations('portfolio');

  const dbProjects = await getProjectsFromDb(locale);

  if (!dbProjects || dbProjects.length === 0) {
    return null;
  }

  return (
    <PortfolioGrid
      projects={dbProjects}
      labels={{
        badge: t('badge'),
        title: t('title'),
        titleHighlight: t('titleHighlight'),
        subtitle: t('subtitle'),
        viewProject: t('viewProject'),
      }}
    />
  );
}
