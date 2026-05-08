import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

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
  {
    slug: 'solucionesintegrales',
    order: 6,
    color: '#3B82F6',
    github: 'https://github.com/miguelgargurevich/solucionesintegralesjs',
    live: 'https://solucionesintegralesjs.vercel.app',
    tech: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Cloudflare R2', 'Resend'],
    titleEs: 'Soluciones Integrales JS',
    titleEn: 'Soluciones Integrales JS',
    descriptionEs: 'Landing Page profesional con CMS integrado para una empresa industrial. Construida con Next.js 14, ofrece una gestión completa de servicios y proyectos, optimizada para SEO y conversiones.',
    descriptionEn: 'Professional Landing Page with an integrated CMS for an industrial company. Built with Next.js 14, it offers full service and project management, optimized for SEO and conversions.',
    featuresEs: ['CMS Personalizado', 'Optimización Industrial', 'Gestión de Proyectos R2'],
    featuresEn: ['Custom CMS', 'Industrial Optimization', 'R2 Project Management'],
    imageUrl: '/projects/solucionesintegrales.png',
  },
  {
    slug: 'pcm',
    order: 7,
    color: '#6366F1',
    github: 'https://github.com/miguelgargurevich/pcm',
    live: 'https://pcm-eight.vercel.app',
    tech: ['.NET 9', 'React 19', 'PostgreSQL', 'CQRS', 'MediatR', 'Docker', 'reCAPTCHA'],
    titleEs: 'Plataforma de Cumplimiento (PCM)',
    titleEn: 'Compliance Platform (PCM)',
    descriptionEs: 'Sistema web robusto para la gestión de compromisos y cumplimiento normativo en entidades del Estado. Implementa arquitectura CQRS con MediatR para máxima seguridad y escalabilidad.',
    descriptionEn: 'Robust web system for managing commitments and regulatory compliance in government entities. Implements CQRS architecture with MediatR for maximum security and scalability.',
    featuresEs: ['Arquitectura CQRS con MediatR', 'Gestión Gubernamental', 'Seguridad JWT + reCAPTCHA'],
    featuresEn: ['CQRS Architecture with MediatR', 'Government Management', 'JWT + reCAPTCHA Security'],
    imageUrl: '/projects/pcm.png',
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

const OFFERS_SEED = [
  {
    planKey: 'starter-digital',
    icon: 'zap',
    order: 0,
    popular: false,
    nameEs: 'Starter Digital',
    nameEn: 'Starter Digital',
    price: 'S/ 500',
    priceNoteEs: 'Pago único',
    priceNoteEn: 'One-time payment',
    descriptionEs: 'Para lanzar rápido y empezar a captar leads desde el primer día.',
    descriptionEn: 'Launch fast and start capturing leads from day one.',
    itemsEs: [
      'Landing page profesional y responsive',
      'Estructura optimizada para conversión',
      'Botón de WhatsApp y formulario de contacto',
      'Entrega en 5-7 días hábiles',
    ],
    itemsEn: [
      'Professional responsive landing page',
      'Conversion-optimized structure',
      'WhatsApp button and contact form',
      'Delivered in 5-7 business days',
    ],
    ctaEs: 'Quiero este plan',
    ctaEn: 'I want this plan',
    forWhoEs: 'Ideal para: lanzar un producto o servicio puntual.',
    forWhoEn: 'Best for: launching a specific product or service offer.',
  },
  {
    planKey: 'web-corporativa',
    icon: 'star',
    order: 1,
    popular: false,
    nameEs: 'Web Corporativa',
    nameEn: 'Corporate Website',
    price: 'S/ 700 – 900',
    priceNoteEs: 'Pago único',
    priceNoteEn: 'One-time payment',
    descriptionEs: 'Presencia digital profesional para tu empresa, con diseño y estructura de marca.',
    descriptionEn: 'Professional digital presence for your company, with brand-aligned design and structure.',
    itemsEs: [
      'Sitio completo: Inicio, Nosotros, Servicios, Contacto',
      'Diseño profesional alineado a tu marca',
      'Optimización SEO base',
      'Entrega en 2-3 semanas',
    ],
    itemsEn: [
      'Full site: Home, About, Services, Contact',
      'Professional design aligned to your brand',
      'Baseline SEO optimization',
      'Delivered in 2-3 weeks',
    ],
    ctaEs: 'Quiero este plan',
    ctaEn: 'I want this plan',
    forWhoEs: 'Ideal para: empresas que necesitan una imagen sólida en internet.',
    forWhoEn: 'Best for: companies that need a solid online presence.',
  },
  {
    planKey: 'web-corporativa-pro',
    icon: 'star',
    order: 2,
    popular: true,
    nameEs: 'Web Corporativa PRO + CMS',
    nameEn: 'PRO Corporate + CMS',
    price: 'S/ 900 – 1200',
    priceNoteEs: 'Pago único',
    priceNoteEn: 'One-time payment',
    descriptionEs: 'Todo lo anterior, más un panel para que administres tu web sin depender de nadie.',
    descriptionEn: 'Everything above, plus a panel so you manage your website without depending on anyone.',
    itemsEs: [
      'Todo lo del plan Corporativo',
      'CMS configurado (WordPress u otro)',
      'Puedes editar textos e imágenes tú mismo',
      'Capacitación básica incluida',
      'Base escalable para crecer',
    ],
    itemsEn: [
      'Everything from Corporate plan',
      'Configured CMS (WordPress or other)',
      'Edit text and images yourself',
      'Basic training included',
      'Scalable foundation for growth',
    ],
    ctaEs: 'Quiero este plan',
    ctaEn: 'I want this plan',
    forWhoEs: 'Ideal para: empresas que actualizan contenido con frecuencia.',
    forWhoEn: 'Best for: businesses that update content frequently.',
  },
  {
    planKey: 'negocio-digital-completo',
    icon: 'sparkles',
    order: 3,
    popular: false,
    nameEs: 'Negocio Digital Completo',
    nameEn: 'Complete Digital Business',
    price: 'S/ 1200+',
    priceNoteEs: 'Según alcance',
    priceNoteEn: 'Based on scope',
    descriptionEs: 'Paquete integral para tener todo listo: web, dominio, correos y CMS desde el día 1.',
    descriptionEn: 'All-in-one package: website, domain, emails and CMS ready from day one.',
    itemsEs: [
      'Web corporativa + Landing page',
      'Dominio y correos corporativos',
      'CMS configurado y entregado',
      'Soporte de lanzamiento incluido',
      'Base sólida para escalar con marketing digital',
    ],
    itemsEn: [
      'Corporate website + Landing page',
      'Domain and corporate email setup',
      'Configured and delivered CMS',
      'Launch support included',
      'Solid foundation to scale with digital marketing',
    ],
    ctaEs: 'Solicitar cotización',
    ctaEn: 'Request a quote',
    forWhoEs: 'Ideal para: negocios que quieren lanzar todo junto y bien hecho.',
    forWhoEn: 'Best for: businesses launching everything together, done right.',
  },
];

const SITE_SETTINGS_SEED = [
  { key: 'hero.badgeEs', value: 'Desarrollo Web Premium' },
  { key: 'hero.badgeEn', value: 'Premium Web Development' },
  { key: 'hero.titleEs', value: 'Construyo software que vende y escala' },
  { key: 'hero.titleEn', value: 'I build software that sells and scales' },
  { key: 'hero.subtitleEs', value: 'Landing pages, sitios corporativos y sistemas a medida orientados a conversiones.' },
  { key: 'hero.subtitleEn', value: 'Landing pages, corporate websites, and custom systems focused on conversions.' },
  { key: 'contact.email', value: 'contacto@gargurevich.dev' },
  { key: 'contact.whatsapp', value: '+51 966 918 363' },
  { key: 'contact.location', value: 'Lima, Peru' },
  { key: 'stats.projects', value: '50+' },
  { key: 'stats.clients', value: '100%' },
  { key: 'stats.experience', value: '3+' },
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

    // Upsert offers
    for (const o of OFFERS_SEED) {
      await db.offer.upsert({
        where: { planKey: o.planKey },
        update: {},
        create: o,
      });
    }

    // Upsert site settings
    for (const s of SITE_SETTINGS_SEED) {
      await db.siteSetting.upsert({
        where: { key: s.key },
        update: {},
        create: s,
      });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ ok: true, message: 'Database seeded successfully' });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: 'Seed failed', detail: String(err) }, { status: 500 });
  }
}
