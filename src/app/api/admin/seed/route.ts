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
    serviceTier: 'Starter',
    recurringAmount: 299,
    currency: 'PEN',
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
    serviceTier: 'Growth',
    recurringAmount: 300,
    currency: 'PEN',
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
    serviceTier: 'Pro',
    recurringAmount: 599,
    currency: 'PEN',
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
    serviceTier: 'Business',
    recurringAmount: 999,
    currency: 'PEN',
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
    serviceTier: 'Pro',
    recurringAmount: 799,
    currency: 'PEN',
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
    serviceTier: 'Enterprise',
    recurringAmount: 999,
    currency: 'PEN',
  },
];

const OFFERS_SEED = [
  {
    planKey: 'capa-1-presencia-digital',
    icon: 'zap',
    order: 0,
    popular: false,
    nameEs: 'Nivel 1 Starter - Presencia Digital IA',
    nameEn: 'Level 1 Starter - AI Digital Presence',
        price: 'Monthly: S/29 (hosting + SSL + domain + backups + panel) | One-time setup: S/300-1,500',
    renewalPrice: '29',
    priceNoteEs: 'Presencia profesional lista para vender',
    priceNoteEn: 'Professional presence ready to convert',
    descriptionEs: 'Lanza una presencia profesional en dias para que te encuentren, te escriban y te compren sin friccion.',
    descriptionEn: 'Launch a professional presence in days so customers can find you, message you, and buy with less friction.',
    itemsEs: [
      'Landing o web corporativa enfocada en conversion',
      'Dominio propio, SSL y hosting administrado',
      'Formulario y CTA listos para captar leads',
      'SEO local base para aparecer en busquedas clave',
      'Edicion de contenido simple para tu equipo',
    ],
    itemsEn: [
      'Conversion-focused landing page or corporate site',
      'Custom domain, SSL, and managed hosting',
      'Lead capture form and CTAs ready to perform',
      'Baseline local SEO for high-intent searches',
      'Simple content editing for your internal team',
    ],
    ctaEs: 'Quiero mi Presencia IA',
    ctaEn: 'Build my AI Presence',
    forWhoEs: 'Para negocios que necesitan verse serios y captar oportunidades desde esta semana.',
    forWhoEn: 'For businesses that need to look professional and capture opportunities this week.',
  },
  {
    planKey: 'capa-2-agente-ia',
    icon: 'star',
    order: 1,
    popular: true,
    nameEs: 'Nivel 2 Growth - Agente IA Experto',
    nameEn: 'Level 2 Growth - Expert AI Agent',
    price: 'Setup: S/150-300 | Agente: S/180-350/mes',
    renewalPrice: '350',
    priceNoteEs: 'Atencion automatica en WhatsApp y web',
    priceNoteEn: 'Automated support on WhatsApp and web',
    descriptionEs: 'Activa un agente IA que responde 24/7 con el contexto de tu negocio para atender mejor y vender mas.',
    descriptionEn: 'Activate an AI agent that responds 24/7 with your business context to improve service and increase sales.',
    itemsEs: [
      'Respuestas instantaneas en WhatsApp y web 24/7',
      'Entrenado con tus productos, servicios y politicas',
      'Resuelve FAQs, precios, horarios y dudas frecuentes',
      'Escalable a citas, cotizaciones y seguimiento comercial',
      'Derivacion inteligente cuando se requiere un humano',
    ],
    itemsEn: [
      'Instant 24/7 responses on WhatsApp and web',
      'Trained with your products, services, and policies',
      'Handles FAQs, pricing, hours, and common questions',
      'Scales to bookings, quotes, and sales follow-up',
      'Smart handoff to a human when needed',
    ],
    ctaEs: 'Activar Agente 24/7',
    ctaEn: 'Activate 24/7 Agent',
    forWhoEs: 'Para negocios con alta demanda de consultas que quieren escalar atencion sin crecer planilla.',
    forWhoEn: 'For businesses with heavy inbound demand that need to scale support without adding headcount.',
  },
  {
    planKey: 'capa-3-automatizacion',
    icon: 'sparkles',
    order: 2,
    popular: false,
    nameEs: 'Nivel 3 Scale - Automatizacion Inteligente',
    nameEn: 'Level 3 Scale - Smart Automation',
    price: 'Setup: S/300-500 | Operación: S/300-900/mes',
    renewalPrice: '900',
    priceNoteEs: 'Menos tareas manuales, mas foco en crecer',
    priceNoteEn: 'Fewer manual tasks, more focus on growth',
    descriptionEs: 'Automatiza tareas repetitivas y conecta tus canales para operar con velocidad, orden y visibilidad en tiempo real.',
    descriptionEn: 'Automate repetitive work and connect your channels to operate faster, cleaner, and with real-time visibility.',
    itemsEs: [
      'Flujos automáticos para ventas, seguimiento y soporte',
      'Integracion entre formularios, CRM, hojas y correo',
      'Alertas y reportes automaticos para decisiones rapidas',
      'Menos retrabajo y menos errores operativos',
      'Trazabilidad clara de cada paso del proceso',
    ],
    itemsEn: [
      'Automated flows for sales, follow-up, and support',
      'Integration across forms, CRM, spreadsheets, and email',
      'Automatic alerts and reports for faster decisions',
      'Less rework and fewer operational errors',
      'Clear traceability for each process step',
    ],
    ctaEs: 'Automatizar mi operacion',
    ctaEn: 'Automate my operations',
    forWhoEs: 'Para empresas que ya venden y ahora necesitan escalar sin perder control.',
    forWhoEn: 'For companies already selling that need to scale without losing control.',
  },
  {
    planKey: 'capa-4-memoria-empresarial',
    icon: 'sparkles',
    order: 3,
    popular: false,
    nameEs: 'Nivel 4 Signature - Memoria Empresarial',
    nameEn: 'Level 4 Signature - Enterprise Memory',
    price: 'Setup: S/500-1,000 | Acceso: S/500-1,500/mes',
    renewalPrice: '1500',
    priceNoteEs: 'Tu conocimiento trabajando para todo el equipo',
    priceNoteEn: 'Your knowledge working for the entire team',
    descriptionEs: 'Centraliza procesos, respuestas y criterios del negocio para que tu equipo y tus agentes IA operen con consistencia.',
    descriptionEn: 'Centralize business processes, answers, and decision criteria so your team and AI agents can operate consistently.',
    itemsEs: [
      'Base de conocimiento unificada de ventas y operacion',
      'Respuestas consistentes segun tus politicas internas',
      'Onboarding mas rapido para nuevos colaboradores',
      'Menor dependencia de una sola persona clave',
      'Escalable a multiples sedes, equipos y canales',
    ],
    itemsEn: [
      'Unified knowledge base for sales and operations',
      'Consistent answers aligned with internal policies',
      'Faster onboarding for new team members',
      'Less dependency on a single key person',
      'Scales across multiple branches, teams, and channels',
    ],
    ctaEs: 'Implementar Memoria IA',
    ctaEn: 'Deploy AI Memory',
    forWhoEs: 'Para empresas que quieren estandarizar su know-how y convertirlo en ventaja escalable.',
    forWhoEn: 'For companies that want to standardize their know-how and turn it into scalable advantage.',
  },
  {
    planKey: 'mantenimiento-web',
    icon: 'star',
    order: 4,
    popular: false,
    nameEs: 'Paz Mental (mantenimiento 24/7)',
    nameEn: 'Peace of Mind (24/7 maintenance)',
    price: 'Desde S/ 79',
    renewalPrice: '79',
    priceNoteEs: 'Mensual',
    priceNoteEn: 'Monthly',
    descriptionEs: 'Olvídate de tu web. La mantenemos viva, segura y optimizada 24/7 con renovación mensual o anual según lo que necesites.',
    descriptionEn: 'Forget about your website. We keep it alive, secure, and optimized 24/7 with monthly or annual renewal depending on what you need.',
    itemsEs: [
      'Seguridad 24/7 y backups automáticos',
      'Monitoreo de caídas en tiempo real',
      'Hasta 2 cambios gratis al mes',
      'Respuesta garantizada en menos de 4 horas',
      'Actualizaciones de seguridad incluidas',
    ],
    itemsEn: [
      '24/7 security and automatic backups',
      'Real-time downtime monitoring',
      'Up to 2 free changes per month',
      'Guaranteed response under 4 hours',
      'Security updates included',
    ],
    ctaEs: 'Protege tu web ahora',
    ctaEn: 'Protect my website now',
    forWhoEs: 'Para dueños con web existente que quieren protección total sin preocupaciones.',
    forWhoEn: 'For owners with existing websites who want total protection without worries.',
  },
  {
    planKey: 'solo-dominio-correos',
    icon: 'star',
    order: 5,
    popular: false,
    nameEs: 'Solo Marca (dominio + correos)',
    nameEn: 'Just Brand (domain + emails)',
    price: 'S/ 150',
    renewalPrice: '185',
    priceNoteEs: '1 año incluido gratis',
    priceNoteEn: '1 year included free',
    descriptionEs: 'Pago único para proteger tu marca con dominio y correos profesionales durante 1 año. Después decides si renuevas.',
    descriptionEn: 'One-time payment to protect your brand with domain and professional emails for 1 year. After that, you decide whether to renew.',
    itemsEs: [
      'Dominio .pe o .com.pe propio',
      'Correos profesionales @tudominio',
      'Gestión completa del dominio',
      'Renovación anual incluida',
      'Soporte para configuración',
    ],
    itemsEn: [
      'Own .pe or .com.pe domain',
      'Professional emails @yourdomain',
      'Complete domain management',
      'Annual renewal included',
      'Setup support',
    ],
    ctaEs: 'Quiero mi dominio propio',
    ctaEn: 'I want my own domain',
    forWhoEs: 'Para webs en Wix/WordPress que necesitan profesionalismo con dominio y correos propios.',
    forWhoEn: 'For Wix/WordPress sites needing professionalism with own domain and emails.',
  },
];

const SITE_SETTINGS_SEED = [
  { key: 'hero.badgeEs', value: 'Plataforma IA para SMB LATAM' },
  { key: 'hero.badgeEn', value: 'AI Platform for LATAM SMBs' },
  { key: 'hero.titleEs', value: 'Creamos sistemas inteligentes para vender, atender y operar mejor' },
  { key: 'hero.titleEn', value: 'We build intelligent systems to sell, serve, and operate better' },
  { key: 'hero.subtitleEs', value: 'Integramos presencia digital, agentes IA y automatizacion para que tu empresa responda mas rapido, ahorre tiempo y crezca con orden.' },
  { key: 'hero.subtitleEn', value: 'We combine digital presence, AI agents, and automation so your company can respond faster, save time, and scale with structure.' },
  { key: 'contact.email', value: 'contacto@gargurevichdigital.com' },
  { key: 'contact.whatsapp', value: '+51 966 918 363' },
  { key: 'contact.location', value: 'Lima, Peru' },
  { key: 'stats.projects', value: '50+' },
  { key: 'stats.clients', value: '100%' },
  { key: 'stats.experience', value: '3+' },
];

function sanitizeForDb<T>(value: T): T {
  if (typeof value === 'string') {
    const cleaned = value
      .replace(/\0/g, '')
      .replace(/\\u0000/gi, '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

    // Defensive byte-level cleanup in case malformed input reaches runtime.
    const safe = Buffer.from(
      Buffer.from(cleaned, 'utf8').filter((byte) => byte !== 0),
    ).toString('utf8');

    return safe as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForDb(item)) as T;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
      key,
      sanitizeForDb(nested),
    ]);
    return Object.fromEntries(entries) as T;
  }

  return value;
}

function sanitizeAsciiForDb<T>(value: T): T {
  if (typeof value === 'string') {
    return value
      .replace(/\0/g, '')
      .normalize('NFKD')
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeAsciiForDb(item)) as T;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
      key,
      sanitizeAsciiForDb(nested),
    ]);
    return Object.fromEntries(entries) as T;
  }

  return value;
}

function toSqlLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function toSqlTextArray(values: string[]): string {
  return `ARRAY[${values.map((item) => toSqlLiteral(item)).join(', ')}]`;
}

function isUtf8SequenceError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    message.includes('22021')
    || lower.includes('invalid byte sequence for encoding')
    || (lower.includes('utf8') && lower.includes('0x00'))
  );
}

async function upsertOfferViaSql(rawOffer: (typeof OFFERS_SEED)[number]) {
  const offer = sanitizeAsciiForDb(sanitizeForDb(rawOffer));
  const idValue = `${offer.planKey}-${Date.now()}`;
  const renewalPrice = offer.renewalPrice ? toSqlLiteral(String(offer.renewalPrice)) : 'NULL';

  const sql = `
    INSERT INTO "Offer" (
      id, "planKey", icon, "nameEs", "nameEn", price, "renewalPrice", "priceNoteEs", "priceNoteEn",
      "descriptionEs", "descriptionEn", "itemsEs", "itemsEn", "ctaEs", "ctaEn", "forWhoEs", "forWhoEn",
      popular, "order", published, "createdAt", "updatedAt"
    ) VALUES (
      ${toSqlLiteral(idValue)},
      ${toSqlLiteral(offer.planKey)},
      ${toSqlLiteral(offer.icon)},
      ${toSqlLiteral(offer.nameEs)},
      ${toSqlLiteral(offer.nameEn)},
      ${toSqlLiteral(offer.price)},
      ${renewalPrice},
      ${toSqlLiteral(offer.priceNoteEs)},
      ${toSqlLiteral(offer.priceNoteEn)},
      ${toSqlLiteral(offer.descriptionEs)},
      ${toSqlLiteral(offer.descriptionEn)},
      ${toSqlTextArray(offer.itemsEs)},
      ${toSqlTextArray(offer.itemsEn)},
      ${toSqlLiteral(offer.ctaEs)},
      ${toSqlLiteral(offer.ctaEn)},
      ${toSqlLiteral(offer.forWhoEs)},
      ${toSqlLiteral(offer.forWhoEn)},
      ${offer.popular ? 'true' : 'false'},
      ${offer.order},
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT ("planKey") DO UPDATE SET
      icon = EXCLUDED.icon,
      "nameEs" = EXCLUDED."nameEs",
      "nameEn" = EXCLUDED."nameEn",
      price = EXCLUDED.price,
      "renewalPrice" = EXCLUDED."renewalPrice",
      "priceNoteEs" = EXCLUDED."priceNoteEs",
      "priceNoteEn" = EXCLUDED."priceNoteEn",
      "descriptionEs" = EXCLUDED."descriptionEs",
      "descriptionEn" = EXCLUDED."descriptionEn",
      "itemsEs" = EXCLUDED."itemsEs",
      "itemsEn" = EXCLUDED."itemsEn",
      "ctaEs" = EXCLUDED."ctaEs",
      "ctaEn" = EXCLUDED."ctaEn",
      "forWhoEs" = EXCLUDED."forWhoEs",
      "forWhoEn" = EXCLUDED."forWhoEn",
      popular = EXCLUDED.popular,
      "order" = EXCLUDED."order",
      published = EXCLUDED.published,
      "updatedAt" = NOW();
  `;

  await db.$executeRawUnsafe(sql);
}

export async function seedDatabase(options: { revalidate?: boolean } = {}) {
  const { revalidate = true } = options;

  try {
    // Upsert portfolio projects
    for (const p of PORTFOLIO_SEED) {
      await db.portfolioProject.upsert({
        where: { slug: p.slug },
        update: {},
        create: sanitizeForDb(p),
      });
    }

    // Upsert services
    for (const s of SERVICES_SEED) {
      await db.service.upsert({
        where: { slug: s.slug },
        update: {},
        create: sanitizeForDb(s),
      });
    }

    // Clear and re-seed offers (ensures old plans are replaced)
    await db.offer.deleteMany({});
    for (const o of OFFERS_SEED) {
      try {
        await db.offer.create({ data: sanitizeForDb(o) });
      } catch (offerError) {
        const message = String(offerError);
        const hasUtf8SequenceError = isUtf8SequenceError(message);

        if (!hasUtf8SequenceError) {
          throw new Error(`Offer seed failed for ${o.planKey}: ${message}`);
        }

        // Fallback for environments with strict/fragile text decoding paths.
        try {
          await db.offer.create({ data: sanitizeAsciiForDb(sanitizeForDb(o)) });
        } catch (asciiOfferError) {
          const asciiMessage = String(asciiOfferError);
          const asciiUtf8Error = isUtf8SequenceError(asciiMessage);

          if (!asciiUtf8Error) {
            throw new Error(`Offer seed failed for ${o.planKey} after ASCII fallback: ${asciiMessage}`);
          }

          try {
            await upsertOfferViaSql(o);
          } catch (sqlOfferError) {
            throw new Error(`Offer seed failed for ${o.planKey} after SQL fallback: ${String(sqlOfferError)}`);
          }
        }
      }
    }

    // Upsert site settings
    for (const s of SITE_SETTINGS_SEED) {
      await db.siteSetting.upsert({
        where: { key: s.key },
        update: sanitizeForDb({ value: s.value }),
        create: sanitizeForDb(s),
      });
    }

    if (revalidate) {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({ ok: true, message: 'Database seeded successfully' });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: 'Seed failed', detail: String(err) }, { status: 500 });
  }
}

export async function POST() {
  return seedDatabase({ revalidate: true });
}
