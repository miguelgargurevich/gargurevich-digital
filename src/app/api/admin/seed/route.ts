import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const PORTFOLIO_SEED = [
  {
    slug: 'dashboardia',
    order: 0,
    color: '#00D4FF',
    github: 'https://github.com/miguelgargurevich/dashboardia-llm',
    live: '#',
    tech: ['Next.js 14', 'React 18', 'Node.js', 'Prisma', 'PostgreSQL', 'Supabase', 'Gemini API'],
    titleEs: 'DashboardIA LLM',
    titleEn: 'DashboardIA LLM',
    descriptionEs: 'Hub operativo de soporte técnico que centraliza knowledge base personal, gestión de recursos (PDF, Excel, video), calendario, notas y asistente IA con adjuntos. Todos los datos están aislados por usuario autenticado con Supabase, e incluye un agente Windows para ejecutar scripts PowerShell de forma remota.',
    descriptionEn: 'Operational technical-support hub that centralizes a personal knowledge base, file resources (PDF, Excel, video), calendar, notes, and an AI assistant with file attachments. All data is fully isolated per authenticated Supabase user, and includes a Windows agent for remote PowerShell script execution.',
    featuresEs: ['Aislamiento total por usuario', 'IA con adjuntos PDF/Excel/Video', 'Agente Windows PowerShell'],
    featuresEn: ['Full user-level isolation', 'AI assistant with file attachments', 'Windows PowerShell Agent'],
    imageUrl: '/projects/dashboardia.png',
  },
  {
    slug: 'invoiceapp',
    order: 1,
    color: '#8B5CF6',
    github: 'https://github.com/miguelgargurevich/invoiceapp',
    live: 'https://invoiceapp.vercel.app',
    tech: ['Next.js 14', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'Supabase', 'Resend'],
    titleEs: 'InvoiceApp',
    titleEn: 'InvoiceApp',
    descriptionEs: 'Plataforma de facturación y proformas para contratistas y freelancers con firma digital jurídicamente válida (token único, IP y timestamp). Incluye CRM integrado, catálogo de productos, seguimiento de obra con fotos, multi-moneda, bilingüe y envío de documentos por email vía Resend.',
    descriptionEn: 'Invoicing and proposal platform for contractors and freelancers with legally binding digital signatures (unique token, IP, and timestamp). Includes an integrated CRM, product catalog, job-site photo tracking, multi-currency, bilingual support, and document delivery via Resend.',
    featuresEs: ['Firma Digital con Token Seguro', 'CRM + Catálogo de Productos', 'Multi-moneda y Multi-idioma'],
    featuresEn: ['Legally Binding Token Signatures', 'CRM + Product Catalog', 'Multi-currency & Bilingual'],
    imageUrl: '/projects/invoiceapp.png',
  },
  {
    slug: 'house',
    order: 2,
    color: '#10B981',
    github: 'https://github.com/miguelgargurevich/house',
    live: '#',
    tech: ['React 18', 'Vite', 'Express', 'Prisma', 'PostgreSQL', 'JWT', 'Gemini API'],
    titleEs: 'House SaaS',
    titleEn: 'House SaaS',
    descriptionEs: 'SaaS multi-tenant para administración de propiedades y condominios con 5 roles diferenciados (superadmin, admin, propietario, inquilino, mantenimiento), sidebars responsivos por rol, API REST centralizada documentada con Swagger en /api-docs, copiloto Gemini AI integrado y soporte para Docker Compose en local.',
    descriptionEn: 'Multi-tenant SaaS for property and condominium management with 5 distinct roles (superadmin, admin, owner, tenant, maintenance), responsive role-based sidebars, a centralized REST API documented with Swagger at /api-docs, an integrated Gemini AI copilot, and Docker Compose support for local development.',
    featuresEs: ['5 Roles con RBAC Avanzado', 'REST API + Swagger Docs', 'Copiloto IA Gemini'],
    featuresEn: ['5 Roles with Advanced RBAC', 'REST API + Swagger Docs', 'Gemini AI Copilot'],
    imageUrl: '/projects/house.png',
  },
  {
    slug: 'jafernandez',
    order: 3,
    color: '#F59E0B',
    github: 'https://github.com/miguelgargurevich/jafernandezelectric',
    live: '#',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Zod'],
    titleEs: 'JA Fernandez Electric',
    titleEn: 'JA Fernandez Electric',
    descriptionEs: 'Sitio web profesional bilingüe (ES/EN) para electricista licenciado en Nassau y Suffolk County, Long Island NY. Formulario anti-spam con validación Zod y React Hook Form, sección FAQ, testimonios, animaciones con Framer Motion y SEO local optimizado para búsquedas en Long Island.',
    descriptionEn: 'Bilingual professional website (ES/EN) for a licensed electrician in Nassau and Suffolk County, Long Island NY. Anti-spam contact form with Zod and React Hook Form validation, FAQ section, testimonials, Framer Motion animations, and local SEO optimized for Long Island searches.',
    featuresEs: ['Bilingüe ES/EN con i18n custom', 'Formulario anti-spam con Zod', 'SEO Local Long Island NY'],
    featuresEn: ['Bilingual ES/EN with custom i18n', 'Anti-spam form with Zod', 'Local SEO for Long Island NY'],
    imageUrl: '/projects/jafernandez.png',
  },
  {
    slug: 'lumic',
    order: 4,
    color: '#EC4899',
    github: 'https://github.com/miguelgargurevich/lumic',
    live: '#',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', '.NET 9', 'JWT'],
    titleEs: 'Lumic App',
    titleEn: 'Lumic App',
    descriptionEs: 'E-commerce full-stack en monorepo con frontend Next.js 15 / React 19 y backend ASP.NET Core .NET 9 en arquitectura de capas (Api, Application, Domain, Infrastructure). Autenticación JWT Bearer, OpenAPI en desarrollo y listo para despliegue en Azure Static Web Apps + App Service.',
    descriptionEn: 'Full-stack e-commerce monorepo with a Next.js 15 / React 19 frontend and a layered ASP.NET Core .NET 9 backend (Api, Application, Domain, Infrastructure). JWT Bearer authentication, OpenAPI in development, and ready for deployment on Azure Static Web Apps + App Service.',
    featuresEs: ['Monorepo Next.js + .NET 9', 'Arquitectura Hexagonal Limpia', 'Azure Static Web Apps Ready'],
    featuresEn: ['Next.js + .NET 9 Monorepo', 'Clean Layered Architecture', 'Azure Static Web Apps Ready'],
    imageUrl: '/projects/lumic.png',
  },
  {
    slug: 'portfolio',
    order: 5,
    color: '#EF4444',
    github: 'https://github.com/miguelgargurevich/miguel-gargurevich-portfolio',
    live: '#',
    tech: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'next-intl', 'Gemini AI'],
    titleEs: 'Gargurevich Digital Portfolio',
    titleEn: 'Gargurevich Digital Portfolio',
    descriptionEs: 'Mi portafolio personal construido con las últimas tecnologías web, enfocado en performance, SEO y una experiencia de usuario premium.',
    descriptionEn: 'My personal portfolio built with the latest web technologies, focusing on performance, SEO, and a premium user experience.',
    featuresEs: ['Next.js 15 + Turbopack', 'Internacionalización completa', 'Diseño Noir Premium'],
    featuresEn: ['Next.js 15 + Turbopack', 'Full Internationalization', 'Premium Noir Design'],
    imageUrl: '/projects/portfolio.png',
  },

];

const SERVICES_SEED = [
  {
    slug: 'landing',
    icon: 'layout',
    order: 0,
    titleEs: 'Landing Pages',
    titleEn: 'Landing Pages',
    descriptionEs: 'Páginas de alta conversión optimizadas para captar leads y generar ventas.',
    descriptionEn: 'High-conversion pages optimized to capture leads and generate sales.',
    featuresEs: ['Diseño responsive', 'Alta conversión', 'SEO optimizado', 'Hosting incluido'],
    featuresEn: ['Responsive design', 'High conversion', 'SEO optimized', 'Hosting included'],
  },
  {
    slug: 'website',
    icon: 'globe',
    order: 1,
    titleEs: 'Sitios Web',
    titleEn: 'Websites',
    descriptionEs: 'Presencia digital profesional para tu marca o negocio con diseño moderno.',
    descriptionEn: 'Professional digital presence for your brand or business with modern design.',
    featuresEs: ['CMS integrado', 'Multi-idioma', 'Blog incorporado', 'Analytics'],
    featuresEn: ['Integrated CMS', 'Multi-language', 'Built-in blog', 'Analytics'],
  },
  {
    slug: 'ecommerce',
    icon: 'shopping-cart',
    order: 2,
    titleEs: 'E-commerce',
    titleEn: 'E-commerce',
    descriptionEs: 'Tiendas online modernas con gestión completa de productos y pagos.',
    descriptionEn: 'Modern online stores with complete product and payment management.',
    featuresEs: ['Carrito avanzado', 'Pagos seguros', 'Inventario', 'Dashboard'],
    featuresEn: ['Advanced cart', 'Secure payments', 'Inventory', 'Dashboard'],
  },
  {
    slug: 'webapp',
    icon: 'monitor',
    order: 3,
    titleEs: 'Apps Web',
    titleEn: 'Web Apps',
    descriptionEs: 'Aplicaciones web empresariales diseñadas para tu negocio.',
    descriptionEn: 'Enterprise web applications designed for your business.',
    featuresEs: ['PWA ready', 'Tiempo real', 'Multi-plataforma', 'Offline mode'],
    featuresEn: ['PWA ready', 'Real-time', 'Multi-platform', 'Offline mode'],
  },
  {
    slug: 'ai',
    icon: 'cpu',
    order: 4,
    titleEs: 'Integración IA',
    titleEn: 'AI Integration',
    descriptionEs: 'Inteligencia artificial integrada para automatizar procesos.',
    descriptionEn: 'Integrated artificial intelligence to automate processes.',
    featuresEs: ['Chatbots IA', 'Automatización', 'APIs LLM', 'ML Models'],
    featuresEn: ['AI Chatbots', 'Automation', 'LLM APIs', 'ML Models'],
  },
  {
    slug: 'devops',
    icon: 'server',
    order: 5,
    titleEs: 'DevOps & Cloud',
    titleEn: 'DevOps & Cloud',
    descriptionEs: 'Infraestructura escalable y automatización de despliegues.',
    descriptionEn: 'Scalable infrastructure and deployment automation.',
    featuresEs: ['CI/CD', 'Monitoreo 24/7', 'Escalabilidad', 'Backups'],
    featuresEn: ['CI/CD', '24/7 Monitoring', 'Scalability', 'Backups'],
  },
];

export async function POST() {
  try {
    // Upsert portfolio projects
    for (const p of PORTFOLIO_SEED) {
      await db.portfolioProject.upsert({
        where: { slug: p.slug },
        update: {},
        create: p,
      });
    }

    // Upsert services
    for (const s of SERVICES_SEED) {
      await db.service.upsert({
        where: { slug: s.slug },
        update: {},
        create: s,
      });
    }

    return NextResponse.json({ ok: true, message: 'Database seeded successfully' });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: 'Seed failed', detail: String(err) }, { status: 500 });
  }
}
