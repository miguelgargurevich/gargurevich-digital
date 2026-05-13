import { getLocale, getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import PortfolioGrid, { type PortfolioProjectItem } from './PortfolioGrid';

type DbProjectRow = Awaited<
  ReturnType<typeof db.portfolioProject.findMany>
>[number];

const AVAILABLE_LOCAL_PROJECT_IMAGES = new Set(['/projects/dashboardia.png']);

function projectPlaceholderDataUri(title: string, color: string) {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0B0B" />
      <stop offset="100%" stop-color="#151515" />
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)" />
  <rect x="100" y="100" width="1400" height="700" rx="36" fill="${color}22" stroke="${color}66" stroke-width="2"/>
  <text x="800" y="430" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="64" font-weight="700">${safeTitle}</text>
  <text x="800" y="500" text-anchor="middle" fill="#A1A1AA" font-family="Arial, sans-serif" font-size="28">Image pending upload</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}


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

function resolveProjectImages(row: DbProjectRow, locale: string): string[] {
  const parsedImages = parseImageUrls(row.imageUrl);
  const validImages = parsedImages.filter((url) => {
    if (!url.startsWith('/projects/')) return true;
    return AVAILABLE_LOCAL_PROJECT_IMAGES.has(url);
  });

  if (validImages.length > 0) {
    return validImages;
  }

  const title = locale === 'es' ? row.titleEs : row.titleEn;
  return [projectPlaceholderDataUri(title, row.color || '#00D4FF')];
}

function isDbUnavailableError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return /Can't reach database server|PrismaClientInitializationError|ECONNREFUSED/i.test(err.message);
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
        images: resolveProjectImages(row, locale),
      };
    });
  } catch (err) {
    if (!isDbUnavailableError(err)) {
      console.error('getProjectsFromDb ERROR:', err);
    }
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
