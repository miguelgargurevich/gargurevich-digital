import { getLocale, getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import PortfolioGrid, { type PortfolioProjectItem } from './PortfolioGrid';

type ProjectId = 'dashboardia' | 'invoiceapp' | 'house' | 'jafernandez' | 'lumic' | 'portfolio' | 'solucionesintegrales' | 'pcm';

const projectMeta: Array<{
  id: ProjectId;
  tech: string[];
  github: string;
  live: string;
  size: 'default' | 'wide' | 'tall' | 'large';
  color: string;
}> = [
  {
    id: 'dashboardia',
    tech: ['Next.js 14', 'React 18', 'Node.js', 'Prisma', 'PostgreSQL', 'Supabase', 'Gemini API'],
    github: 'https://github.com/miguelgargurevich/dashboardia-llm',
    live: '#',
    size: 'large',
    color: '#00D4FF',
  },
  {
    id: 'invoiceapp',
    tech: ['Next.js 14', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase', 'Resend'],
    github: 'https://github.com/miguelgargurevich/invoiceapp',
    live: 'https://invoiceapp.vercel.app',
    size: 'wide',
    color: '#8B5CF6',
  },
  {
    id: 'house',
    tech: ['React 18', 'Vite', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'Gemini API'],
    github: 'https://github.com/miguelgargurevich/house',
    live: '#',
    size: 'tall',
    color: '#10B981',
  },
  {
    id: 'jafernandez',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zod'],
    github: 'https://github.com/miguelgargurevich/jafernandezelectric',
    live: '#',
    size: 'default',
    color: '#F59E0B',
  },
  {
    id: 'lumic',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', '.NET 9', 'JWT'],
    github: 'https://github.com/miguelgargurevich/lumic',
    live: '#',
    size: 'default',
    color: '#EC4899',
  },
  {
    id: 'portfolio',
    tech: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'next-intl', 'Gemini AI'],
    github: 'https://github.com/miguelgargurevich/miguel-gargurevich-portfolio',
    live: '#',
    size: 'wide',
    color: '#EF4444',
  },
  {
    id: 'solucionesintegrales',
    tech: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Cloudflare R2', 'Resend'],
    github: 'https://github.com/miguelgargurevich/solucionesintegralesjs',
    live: 'https://solucionesintegralesjs.vercel.app',
    size: 'default',
    color: '#3B82F6',
  },
  {
    id: 'pcm',
    tech: ['.NET 9', 'React 19', 'PostgreSQL', 'CQRS', 'MediatR', 'Docker', 'reCAPTCHA'],
    github: 'https://github.com/miguelgargurevich/pcm',
    live: 'https://pcm-eight.vercel.app',
    size: 'default',
    color: '#6366F1',
  },
] as const;

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

    console.log(`getProjectsFromDb: Found ${rows.length} published projects in DB`);

    if (rows.length === 0) {
      console.log('getProjectsFromDb: No published projects found.');
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
      console.log(`Mapping Project: ${row.slug} | Images Found: ${parsedImages.length} | First Image: ${parsedImages[0] || 'NONE'}`);
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
  console.log('PortfolioSection: dbProjects count:', dbProjects?.length);
  if (dbProjects) {
    dbProjects.forEach(p => console.log(`Project ${p.id}: images: ${p.images.length}, imageUrl raw: ${p.images[0]}`));
  }

  const fallbackProjects: PortfolioProjectItem[] = projectMeta.map((project) => {
    let content: { title: string; description: string; features: string[] };

    try {
      content = t.raw(`items.${project.id}`) as {
        title: string;
        description: string;
        features: string[];
      };
    } catch {
      content = {
        title: project.id,
        description: '',
        features: [],
      };
    }

    const imagesBySlug: Record<string, string[]> = {
      dashboardia: ['/projects/dashboardia.png'],
      invoiceapp: ['/projects/invoiceapp.png'],
      house: ['/projects/house.png'],
      jafernandez: ['/projects/jafernandez.png'],
      lumic: ['/projects/lumic.png'],
      portfolio: ['/projects/portfolio.png'],
      solucionesintegrales: ['/projects/solucionesintegrales.png'],
      pcm: ['/projects/pcm.png'],
    };

    return {
      id: project.id,
      title: content.title,
      description: content.description,
      features: content.features,
      tech: project.tech,
      github: project.github,
      live: project.live,
      size: project.size,
      color: project.color,
      images: imagesBySlug[project.id] ?? [],
    };
  });

  return (
    <PortfolioGrid
      projects={dbProjects ?? fallbackProjects}
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
