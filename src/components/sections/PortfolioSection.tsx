import { getLocale, getTranslations } from 'next-intl/server';
import { db } from '@/lib/db';
import PortfolioGrid, { type PortfolioProjectItem } from './PortfolioGrid';

type ProjectId = 'dashboardia' | 'invoiceapp' | 'house' | 'jafernandez' | 'lumic' | 'portfolio';

const projectMeta: Array<{
  id: ProjectId;
  image: string;
  tech: string[];
  github: string;
  live: string;
  size: 'default' | 'wide' | 'tall' | 'large';
  color: string;
}> = [
  {
    id: 'dashboardia',
    image: '/projects/dashboardia.png',
    tech: ['Next.js 14', 'React 18', 'Node.js', 'Prisma', 'PostgreSQL', 'Supabase', 'Gemini API'],
    github: 'https://github.com/miguelgargurevich/dashboardia-llm',
    live: '#',
    size: 'large',
    color: '#00D4FF',
  },
  {
    id: 'invoiceapp',
    image: '/projects/invoiceapp.png',
    tech: ['Next.js 14', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase', 'Resend'],
    github: 'https://github.com/miguelgargurevich/invoiceapp',
    live: 'https://invoiceapp.vercel.app',
    size: 'wide',
    color: '#8B5CF6',
  },
  {
    id: 'house',
    image: '/projects/house.png',
    tech: ['React 18', 'Vite', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'Gemini API'],
    github: 'https://github.com/miguelgargurevich/house',
    live: '#',
    size: 'tall',
    color: '#10B981',
  },
  {
    id: 'jafernandez',
    image: '/projects/jafernandez.png',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zod'],
    github: 'https://github.com/miguelgargurevich/jafernandezelectric',
    live: '#',
    size: 'default',
    color: '#F59E0B',
  },
  {
    id: 'lumic',
    image: '/projects/lumic.png',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', '.NET 9', 'JWT'],
    github: 'https://github.com/miguelgargurevich/lumic',
    live: '#',
    size: 'default',
    color: '#EC4899',
  },
  {
    id: 'portfolio',
    image: '/projects/portfolio.png',
    tech: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'next-intl', 'Gemini AI'],
    github: 'https://github.com/miguelgargurevich/miguel-gargurevich-portfolio',
    live: '#',
    size: 'wide',
    color: '#EF4444',
  },
] as const;

type DbProjectRow = Awaited<
  ReturnType<typeof db.portfolioProject.findMany>
>[number];

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
    };

    return rows.map((row: DbProjectRow) => ({
      id: row.slug,
      title: locale === 'es' ? row.titleEs : row.titleEn,
      description: locale === 'es' ? row.descriptionEs : row.descriptionEn,
      features: locale === 'es' ? row.featuresEs : row.featuresEn,
      tech: row.tech,
      github: row.github,
      live: row.live,
      color: row.color,
      size: sizeBySlug[row.slug] ?? 'default',
      image: row.imageUrl || `/projects/${row.slug}.png`,
    }));
  } catch {
    return null;
  }
}

export default async function PortfolioSection() {
  const locale = await getLocale();
  const t = await getTranslations('portfolio');

  const dbProjects = await getProjectsFromDb(locale);

  const fallbackProjects: PortfolioProjectItem[] = projectMeta.map((project) => {
    const content = t.raw(`items.${project.id}`) as {
      title: string;
      description: string;
      features: string[];
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
      image: project.image,
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
