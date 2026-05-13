import { NextResponse } from 'next/server';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getAdminSession } from '@/lib/auth';
import { AVAILABLE_MODELS } from '@/lib/aiModelsConfig';

type UsageLimits = {
  maxGenerationsPerMonth: number;
  maxInputTokensPerMonth: number;
  maxOutputTokensPerMonth: number;
};

type SiteSpec = {
  clientId: string;
  projectName: string;
  industry: string;
  audience: string;
  tone: string;
  primaryCTA: string;
  sections: string[];
  colorDirection: string;
  constraints: {
    language: 'es' | 'en';
    maxWordsPerSection: number;
  };
  limits: { ai: UsageLimits };
  disclaimer: {
    enabled: boolean;
    text: string;
  };
};

type AiMeta = {
  provider: 'groq' | 'openai' | 'gemini' | 'openrouter' | 'nvidia' | 'fallback';
  model: string;
  source: 'request' | 'persisted' | 'default' | 'fallback';
};

type SupportedProvider = 'groq' | 'openai' | 'gemini' | 'openrouter' | 'nvidia';
type DesignVariant = 'neo-grid' | 'editorial-split' | 'glass-flow';

type ClientPreferenceState = {
  clients: Record<string, { provider: SupportedProvider; model: string; designVariant: DesignVariant; updatedAt: string }>;
};

type UsageState = {
  clients: Record<
    string,
    {
      month: string;
      generations: number;
      estimatedInputTokens: number;
      estimatedOutputTokens: number;
      lastGenerationAt: string | null;
      limits: UsageLimits;
    }
  >;
};

const DEFAULT_LIMITS: UsageLimits = {
  maxGenerationsPerMonth: 100,
  maxInputTokensPerMonth: 250000,
  maxOutputTokensPerMonth: 400000,
};

const SUPPORTED_PROVIDERS: SupportedProvider[] = ['groq', 'gemini', 'openai', 'openrouter', 'nvidia'];
const DEFAULT_PROVIDER: SupportedProvider = 'groq';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const DESIGN_VARIANTS: DesignVariant[] = ['neo-grid', 'editorial-split', 'glass-flow'];
const DEFAULT_DESIGN_VARIANT: DesignVariant = 'neo-grid';
const DEFAULT_WHATSAPP_PHONE = '51999999999';

const SYSTEM_PROMPT_TEMPLATE = `
Actua como disenador UX/UI senior, desarrollador frontend experto y especialista en conversion digital.

Tu objetivo es construir un brief de landing moderna, premium y orientada a conversion a partir del mensaje del cliente.

Reglas obligatorias de solucion objetivo:
- Stack final esperado: HTML + CSS + JavaScript Vanilla.
- No frameworks (sin React, Angular, Vue, Bootstrap o Tailwind).
- Codigo portable para despliegue estatico (Vercel, Netlify o hosting estatico).
- Diseno responsive mobile-first.
- Jerarquia visual clara, carga rapida, microinteracciones suaves.
- SEO basico: meta title, meta description, HTML semantico, headings correctos.
- Accesibilidad basica.

Direccion visual requerida:
- Moderna, tecnologica, elegante, minimalista y dinamica.
- Inspiracion: Stripe, Linear, Vercel, Framer, Apple, Notion, Arc Browser.
- Layout limpio, tipografia moderna, buen aire visual, bordes suaves, sombras sutiles, gradientes modernos.

Componentes posibles (elige segun contexto y conversion):
- Navbar (logo + menu + CTA), Hero potente, beneficios/problemas, servicios en cards,
  como funciona (pasos), prueba social, pricing, FAQs, CTA final y footer.
- Para SaaS/IA suma segun aplique: animaciones suaves, comparativas, dashboard mockup,
  metricas, integracion WhatsApp y bloque antes/despues.

Requisitos de conversion:
- Captar atencion rapido, transmitir confianza, comunicar valor con claridad,
  reducir friccion y empujar accion medible.

Proceso obligatorio antes de responder (interno):
1) Analiza objetivo de negocio.
2) Define cliente ideal.
3) Define tono visual/comercial.
4) Ordena estructura UX por conversion.
5) Prioriza claridad y accion.

Salida esperada de este endpoint:
- Devuelve SOLO JSON valido.
- Resume la estrategia en campos concretos y ejecutables para renderizar la landing.
- Nunca devuelvas markdown ni texto fuera del JSON.
`;

const MANDATORY_SECTIONS = ['benefits', 'services', 'process', 'social_proof', 'pricing', 'faq', 'final_cta'] as const;
const OPTIONAL_SECTIONS = ['metrics', 'comparisons', 'dashboard_mockup', 'before_after', 'whatsapp'] as const;
const ALLOWED_SECTIONS = [
  ...MANDATORY_SECTIONS,
  ...OPTIONAL_SECTIONS,
  // Backwards compatibility for older AI outputs.
  'hero',
  'testimonials',
  'logos',
  'footer',
] as const;

const CHAT_MODEL_OPTIONS = AVAILABLE_MODELS.chat.filter(
  (m) => m.available && SUPPORTED_PROVIDERS.includes(m.provider as SupportedProvider)
);

function estimateTokens(text: string): number {
  return Math.ceil((text || '').length / 4);
}

function monthKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

function normalizeProvider(value: unknown): SupportedProvider | null {
  const v = String(value || '').trim().toLowerCase();
  return SUPPORTED_PROVIDERS.includes(v as SupportedProvider) ? (v as SupportedProvider) : null;
}

function normalizeDesignVariant(value: unknown): DesignVariant | null {
  const v = String(value || '').trim().toLowerCase();
  return DESIGN_VARIANTS.includes(v as DesignVariant) ? (v as DesignVariant) : null;
}

function resolveDesignVariant(args: {
  requested?: unknown;
  persisted?: DesignVariant | null;
  clientId: string;
}): { variant: DesignVariant; source: 'request' | 'persisted' | 'default' } {
  const requested = normalizeDesignVariant(args.requested);
  if (requested) return { variant: requested, source: 'request' };
  if (args.persisted) return { variant: args.persisted, source: 'persisted' };

  const hash = args.clientId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const fallback = DESIGN_VARIANTS[hash % DESIGN_VARIANTS.length] || DEFAULT_DESIGN_VARIANT;
  return { variant: fallback, source: 'default' };
}

function getModelsByProvider(provider: SupportedProvider): string[] {
  return CHAT_MODEL_OPTIONS.filter((m) => m.provider === provider).map((m) => m.id);
}

function isValidModelForProvider(provider: SupportedProvider, model: string): boolean {
  return getModelsByProvider(provider).includes(model);
}

function resolveProviderModelSelection(args: {
  requestedProvider?: unknown;
  requestedModel?: unknown;
  persistedProvider?: SupportedProvider | null;
  persistedModel?: string | null;
}): { provider: SupportedProvider; model: string; source: 'request' | 'persisted' | 'default' } {
  const requestedProvider = normalizeProvider(args.requestedProvider);
  const requestedModel = String(args.requestedModel || '').trim();

  if (requestedProvider) {
    if (requestedModel && isValidModelForProvider(requestedProvider, requestedModel)) {
      return { provider: requestedProvider, model: requestedModel, source: 'request' };
    }
    const models = getModelsByProvider(requestedProvider);
    if (models.length > 0) {
      return {
        provider: requestedProvider,
        model: requestedProvider === 'groq' && models.includes(DEFAULT_MODEL) ? DEFAULT_MODEL : models[0],
        source: 'request',
      };
    }
  }

  if (args.persistedProvider && args.persistedModel && isValidModelForProvider(args.persistedProvider, args.persistedModel)) {
    return { provider: args.persistedProvider, model: args.persistedModel, source: 'persisted' };
  }

  return { provider: DEFAULT_PROVIDER, model: DEFAULT_MODEL, source: 'default' };
}

function inferIndustry(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('odont') || m.includes('clinica')) return 'Salud';
  if (m.includes('inmobili') || m.includes('propiedad')) return 'Inmobiliaria';
  if (m.includes('abogado') || m.includes('legal')) return 'Legal';
  if (m.includes('restaurante') || m.includes('cafeter')) return 'Gastronomia';
  if (m.includes('ecommerce') || m.includes('tienda')) return 'Retail';
  return 'Servicios profesionales';
}

function inferTone(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('premium') || m.includes('lujo')) return 'Premium y confiable';
  if (m.includes('agresivo') || m.includes('ventas')) return 'Comercial y directo';
  return 'Claro y profesional';
}

function inferCta(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('whatsapp')) return 'Escribir por WhatsApp';
  if (m.includes('demo')) return 'Ver demo';
  if (m.includes('cita')) return 'Agendar cita';
  return 'Solicitar propuesta';
}

function buildSpecFromMessage(input: {
  message: string;
  clientId?: string;
  projectName?: string;
  language?: 'es' | 'en';
}): SiteSpec {
  const message = input.message.trim();
  const projectName = input.projectName?.trim() || 'Nuevo Proyecto';
  const clientId = input.clientId?.trim() || slugify(projectName) || `cliente-${Date.now()}`;

  return {
    clientId,
    projectName,
    industry: inferIndustry(message),
    audience: 'Clientes potenciales que necesitan una solucion clara y rapida',
    tone: inferTone(message),
    primaryCTA: inferCta(message),
    sections: ['benefits', 'services', 'process', 'social_proof', 'pricing', 'faq', 'final_cta', 'metrics', 'whatsapp'],
    colorDirection: 'moderno, contraste alto, acentos cian y verde',
    constraints: {
      language: input.language || 'es',
      maxWordsPerSection: 120,
    },
    limits: {
      ai: {
        maxGenerationsPerMonth: 120,
        maxInputTokensPerMonth: 300000,
        maxOutputTokensPerMonth: 500000,
      },
    },
    disclaimer: {
      enabled: true,
      text: 'Este contenido puede incluir texto generado con IA. Recomendamos revision humana antes de publicar. Uso prohibido para fraude, suplantacion, spam o actividades ilegales.',
    },
  };
}

function normalizeSections(input: unknown): string[] {
  const fallback = [...MANDATORY_SECTIONS, 'metrics', 'whatsapp'];
  if (!Array.isArray(input)) return fallback;

  const alias: Record<string, string> = {
    testimonials: 'social_proof',
    logos: 'social_proof',
  };

  const sanitized = input
    .map((s) => String(s).trim().toLowerCase())
    .map((s) => alias[s] || s)
    .filter((s): s is (typeof ALLOWED_SECTIONS)[number] => (ALLOWED_SECTIONS as readonly string[]).includes(s));

  const selected = new Set<string>();
  for (const section of MANDATORY_SECTIONS) selected.add(section);
  for (const section of OPTIONAL_SECTIONS) {
    if (sanitized.includes(section)) selected.add(section);
  }

  return [...selected];
}

function extractJsonObject(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return trimmed;

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return null;
}

function mergeAiSpec(base: SiteSpec, candidate: unknown): SiteSpec {
  const ai = (candidate || {}) as Partial<SiteSpec>;

  return {
    ...base,
    clientId: ai.clientId ? slugify(String(ai.clientId)) : base.clientId,
    projectName: ai.projectName ? String(ai.projectName) : base.projectName,
    industry: ai.industry ? String(ai.industry) : base.industry,
    audience: ai.audience ? String(ai.audience) : base.audience,
    tone: ai.tone ? String(ai.tone) : base.tone,
    primaryCTA: ai.primaryCTA ? String(ai.primaryCTA) : base.primaryCTA,
    sections: normalizeSections(ai.sections),
    colorDirection: ai.colorDirection ? String(ai.colorDirection) : base.colorDirection,
    constraints: {
      language: ai.constraints?.language === 'en' ? 'en' : 'es',
      maxWordsPerSection:
        typeof ai.constraints?.maxWordsPerSection === 'number' && ai.constraints.maxWordsPerSection > 40
          ? Math.min(220, ai.constraints.maxWordsPerSection)
          : base.constraints.maxWordsPerSection,
    },
    limits: base.limits,
    disclaimer: base.disclaimer,
  };
}

async function generateSpecWithAI(
  message: string,
  base: SiteSpec,
  preferred: { provider: SupportedProvider; model: string; source: 'request' | 'persisted' | 'default' }
): Promise<{ spec: SiteSpec; meta: AiMeta }> {
  const instruction = `${SYSTEM_PROMPT_TEMPLATE}\n\nDevuelve SOLO JSON valido con esta forma:\n{
  "clientId": "string-slug",
  "projectName": "string",
  "industry": "string",
  "audience": "string",
  "tone": "string",
  "primaryCTA": "string",
  "sections": ["benefits","services","process","social_proof","pricing","faq","final_cta","metrics"],
  "colorDirection": "string",
  "constraints": { "language": "es", "maxWordsPerSection": 120 }
}\n\nNo incluyas markdown ni texto extra fuera del JSON.`;

  const userPrompt = `Mensaje del cliente:\n${message}\n\nBase sugerida:\n${JSON.stringify(base, null, 2)}`;

  const providerOrder: SupportedProvider[] = [
    preferred.provider,
    ...SUPPORTED_PROVIDERS.filter((p) => p !== preferred.provider),
  ];

  const modelByProvider = new Map<SupportedProvider, string>();
  modelByProvider.set(preferred.provider, preferred.model);

  const parseChatResponse = (text: unknown): unknown | null => {
    const jsonText = typeof text === 'string' ? extractJsonObject(text) : null;
    if (!jsonText) return null;
    try {
      return JSON.parse(jsonText);
    } catch {
      return null;
    }
  };

  for (const provider of providerOrder) {
    const model = modelByProvider.get(provider) || getModelsByProvider(provider)[0];
    if (!model) continue;

    if (provider === 'groq') {
      const key = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
      if (!key) continue;
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          messages: [
            { role: 'system', content: instruction },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = parseChatResponse(data?.choices?.[0]?.message?.content);
        if (parsed) {
          return {
            spec: mergeAiSpec(base, parsed),
            meta: { provider: 'groq', model, source: provider === preferred.provider ? preferred.source : 'fallback' },
          };
        }
      }
      continue;
    }

    if (provider === 'openai') {
      const key = process.env.OPENAI_API_KEY;
      if (!key) continue;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: instruction },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = parseChatResponse(data?.choices?.[0]?.message?.content);
        if (parsed) {
          return {
            spec: mergeAiSpec(base, parsed),
            meta: { provider: 'openai', model, source: provider === preferred.provider ? preferred.source : 'fallback' },
          };
        }
      }
      continue;
    }

    if (provider === 'gemini') {
      const key = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!key) continue;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${instruction}\n\n${userPrompt}` }] }],
            generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 1800 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const parsed = parseChatResponse(data?.candidates?.[0]?.content?.parts?.[0]?.text);
        if (parsed) {
          return {
            spec: mergeAiSpec(base, parsed),
            meta: { provider: 'gemini', model, source: provider === preferred.provider ? preferred.source : 'fallback' },
          };
        }
      }
      continue;
    }

    if (provider === 'openrouter') {
      const key = process.env.OPENROUTER_API_KEY;
      if (!key) continue;
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          messages: [
            { role: 'system', content: instruction },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = parseChatResponse(data?.choices?.[0]?.message?.content);
        if (parsed) {
          return {
            spec: mergeAiSpec(base, parsed),
            meta: { provider: 'openrouter', model, source: provider === preferred.provider ? preferred.source : 'fallback' },
          };
        }
      }
      continue;
    }

    if (provider === 'nvidia') {
      const key = process.env.NVIDIA_API_KEY || process.env.NEXT_PUBLIC_NVIDIA_API_KEY;
      if (!key) continue;
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          messages: [
            { role: 'system', content: instruction },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = parseChatResponse(data?.choices?.[0]?.message?.content);
        if (parsed) {
          return {
            spec: mergeAiSpec(base, parsed),
            meta: { provider: 'nvidia', model, source: provider === preferred.provider ? preferred.source : 'fallback' },
          };
        }
      }
    }
  }

  return {
    spec: base,
    meta: { provider: 'fallback', model: 'rules-v1', source: 'fallback' },
  };
}

function sectionTitle(key: string): string {
  const map: Record<string, string> = {
    benefits: 'Beneficios clave',
    services: 'Servicios y capacidades',
    process: 'Como funciona',
    social_proof: 'Prueba social',
    pricing: 'Planes y precios',
    faq: 'Preguntas frecuentes',
    final_cta: 'Cierre y accion',
    metrics: 'Metricas de impacto',
    comparisons: 'Comparativa',
    dashboard_mockup: 'Vista tipo dashboard',
    before_after: 'Antes y despues',
    whatsapp: 'Atencion por WhatsApp',
  };
  return map[key] || key;
}

function hasSection(spec: SiteSpec, key: string): boolean {
  return spec.sections.includes(key);
}

function whatsappHref(): string {
  return `https://wa.me/${DEFAULT_WHATSAPP_PHONE}`;
}

function renderNavLinks(spec: SiteSpec): string {
  const navOrder: Array<{ key: string; label: string }> = [
    { key: 'benefits', label: 'Beneficios' },
    { key: 'services', label: 'Servicios' },
    { key: 'process', label: 'Proceso' },
    { key: 'social_proof', label: 'Resultados' },
    { key: 'pricing', label: 'Planes' },
    { key: 'faq', label: 'FAQ' },
    { key: 'comparisons', label: 'Comparativa' },
    { key: 'before_after', label: 'Antes/Despues' },
    { key: 'metrics', label: 'Metricas' },
    { key: 'dashboard_mockup', label: 'Dashboard' },
    { key: 'whatsapp', label: 'WhatsApp' },
  ];

  const links = navOrder
    .filter((item) => hasSection(spec, item.key))
    .map((item) => `<a href="#${item.key}">${item.label}</a>`)
    .join('');

  return `<div class="nav-links">${links}</div>`;
}

function renderWhatsAppFloat(): string {
  return `<a class="wa-float" href="${whatsappHref()}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WhatsApp</a>`;
}

function sectionBody(key: string, spec: SiteSpec): string {
  switch (key) {
    case 'benefits':
      return `
        <ul>
          <li>Mensaje comercial claro para ${spec.audience.toLowerCase()}.</li>
          <li>Menos friccion en el recorrido y mas conversion en el CTA.</li>
          <li>Entrega visual premium alineada a ${spec.industry.toLowerCase()}.</li>
        </ul>`;
    case 'services':
      return `
        <div class="mini-grid">
          <article><h3>Landing estrategica</h3><p>Arquitectura orientada a conversion con copy accionable.</p></article>
          <article><h3>Implementacion rapida</h3><p>Version publicable en ciclos cortos y mejora continua.</p></article>
          <article><h3>Optimizacion comercial</h3><p>Bloques pensados para captacion, confianza y cierre.</p></article>
        </div>`;
    case 'process':
      return `
        <ol>
          <li>Nos contactas y alineamos objetivo de negocio.</li>
          <li>Construimos estructura, copy y experiencia visual.</li>
          <li>Publicamos, medimos y optimizamos conversion.</li>
        </ol>`;
    case 'social_proof':
      return `
        <div class="mini-grid">
          <article><h3>+37 proyectos</h3><p>Implementaciones para negocios digitales en crecimiento.</p></article>
          <article><h3>4.9/5 satisfaccion</h3><p>Clientes destacan claridad, velocidad y acompanamiento.</p></article>
          <article><h3>-28% tiempo operativo</h3><p>Promedio de mejora reportada tras automatizacion inicial.</p></article>
        </div>`;
    case 'pricing':
      return `
        <div class="mini-grid pricing-grid">
          <article><h3>Base</h3><p>Estructura esencial para publicar rapido.</p><strong>Desde S/ 599</strong></article>
          <article><h3>Growth</h3><p>Optimizada para escalar captacion con IA.</p><strong>Desde S/ 1299</strong></article>
          <article><h3>Pro</h3><p>Operacion avanzada con automatizaciones.</p><strong>Desde S/ 2499</strong></article>
        </div>`;
    case 'faq':
      return `
        <div class="faq-list">
          <details><summary>Cuanto tarda?</summary><p>Entre 3 y 10 dias segun alcance del proyecto.</p></details>
          <details><summary>Incluye soporte?</summary><p>Si, con ventanas de ajuste y seguimiento posterior.</p></details>
          <details><summary>Puedo editar contenido?</summary><p>Si, definimos una estructura facil de mantener.</p></details>
        </div>`;
    case 'final_cta':
      return `<p>Listo para transformar tu presencia digital en resultados concretos? <a href="#contacto">${spec.primaryCTA}</a>.</p>`;
    case 'metrics':
      return `
        <div class="mini-grid">
          <article><h3>+42%</h3><p>Mejora estimada en tasa de contacto inicial.</p></article>
          <article><h3>2.3x</h3><p>Mas velocidad de respuesta con flujos IA basicos.</p></article>
          <article><h3>7 dias</h3><p>Tiempo objetivo para primer release funcional.</p></article>
        </div>`;
    case 'comparisons':
      return `
        <table>
          <thead><tr><th></th><th>Web tradicional</th><th>Landing optimizada</th></tr></thead>
          <tbody>
            <tr><td>Claridad de oferta</td><td>Media</td><td>Alta</td></tr>
            <tr><td>Velocidad de publicacion</td><td>Lenta</td><td>Rapida</td></tr>
            <tr><td>Enfoque en conversion</td><td>Limitado</td><td>Fuerte</td></tr>
          </tbody>
        </table>`;
    case 'dashboard_mockup':
      return `<div class="mockup"><div></div><div></div><div></div></div><p class="muted">Vista de indicadores y pipeline comercial en un panel simplificado.</p>`;
    case 'before_after':
      return `
        <div class="mini-grid">
          <article><h3>Antes</h3><p>Mensaje disperso y poco enfoque comercial.</p></article>
          <article><h3>Despues</h3><p>Propuesta clara, CTA visible y flujo orientado a cierre.</p></article>
        </div>`;
    case 'whatsapp':
      return `<p>Atencion rapida por canal directo. <a href="${whatsappHref()}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>.</p>`;
    default:
      return '<p>Contenido personalizado segun objetivo comercial del cliente.</p>';
  }
}

function renderSectionCards(spec: SiteSpec): string {
  return spec.sections
    .map(
      (section) => `
      <section class="card" id="${section}">
        <h2>${sectionTitle(section)}</h2>
        ${sectionBody(section, spec)}
      </section>`
    )
    .join('\n');
}

function buildHtmlNeoGrid(spec: SiteSpec): string {
  const sectionsHtml = renderSectionCards(spec);
  const navLinksHtml = renderNavLinks(spec);
  const waFloatHtml = renderWhatsAppFloat();

  const disclaimer = spec.disclaimer.enabled
    ? `<aside class="disclaimer"><strong>Disclaimer IA:</strong> ${spec.disclaimer.text}</aside>`
    : '';

  return `<!doctype html>
<html lang="${spec.constraints.language}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${spec.projectName} - MVP</title>
    <style>
      :root {
        --bg: #0b1016;
        --surface: #101a24;
        --surface-2: #111827;
        --text: #e5e7eb;
        --muted: #a1a1aa;
        --accent: #00d4ff;
        --accent-2: #10b981;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Plus Jakarta Sans', 'Sora', system-ui, sans-serif;
        color: var(--text);
        background: radial-gradient(circle at 15% 10%, rgba(0, 212, 255, 0.2), transparent 35%),
                    radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.15), transparent 25%),
                    linear-gradient(180deg, #090d12 0%, #0b1016 100%);
      }
      .wrap { max-width: 1040px; margin: 0 auto; padding: 32px 20px 72px; }
      .navbar {
        position: sticky;
        top: 10px;
        z-index: 20;
        margin-bottom: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(10,16,22,0.82);
        backdrop-filter: blur(8px);
      }
      .nav-links { display: flex; gap: 12px; flex-wrap: wrap; }
      .nav-links a { color: #d1d5db; text-decoration: none; font-size: 0.9rem; }
      .nav-links a:hover { color: #fff; }
      .hero {
        background: linear-gradient(135deg, rgba(0,212,255,0.14), rgba(16,185,129,0.12));
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 20px;
        padding: 28px;
      }
      .hero small { color: var(--muted); letter-spacing: .08em; text-transform: uppercase; }
      .hero h1 { margin: 10px 0 8px; font-size: clamp(1.8rem, 4.8vw, 3rem); line-height: 1.1; }
      .hero p { margin: 0; color: #d4d4d8; max-width: 70ch; }
      .hero-layout { display: grid; gap: 14px; }
      .hero-media {
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.12);
        min-height: 160px;
        background: linear-gradient(135deg, rgba(0,212,255,0.22), rgba(16,185,129,0.1));
      }
      @media (min-width: 840px) {
        .hero-layout { grid-template-columns: 1.2fr 1fr; align-items: center; }
      }
      .meta { margin-top: 14px; color: var(--muted); font-size: 0.9rem; }
      .grid { margin-top: 20px; display: grid; gap: 14px; grid-template-columns: repeat(1, minmax(0, 1fr)); }
      @media (min-width: 840px) {
        .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      .card {
        background: linear-gradient(180deg, rgba(17,24,39,0.9), rgba(17,24,39,0.7));
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        padding: 18px;
      }
      .card h2 { margin: 0 0 8px; color: var(--accent); font-size: 1.03rem; }
      .card p { margin: 0; color: #d4d4d8; line-height: 1.6; }
      .card ul, .card ol { margin: 0; padding-left: 18px; color: #d4d4d8; }
      .card li { margin: 6px 0; }
      .mini-grid { display: grid; gap: 10px; grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .mini-grid article { border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; background: rgba(255,255,255,0.02); }
      .mini-grid h3 { margin: 0 0 6px; font-size: 0.95rem; color: #fff; }
      .mini-grid p { margin: 0; }
      @media (min-width: 680px) { .mini-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      .pricing-grid article strong { display: inline-block; margin-top: 8px; color: #67e8f9; }
      .faq-list details { border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; }
      .faq-list summary { cursor: pointer; font-weight: 600; }
      table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
      th, td { border: 1px solid rgba(255,255,255,0.14); padding: 8px 10px; text-align: left; }
      .mockup { display: grid; gap: 8px; }
      .mockup div { height: 16px; border-radius: 8px; background: linear-gradient(90deg, rgba(0,212,255,0.65), rgba(16,185,129,0.4)); animation: pulse 3s infinite; }
      .mockup div:nth-child(2) { width: 80%; }
      .mockup div:nth-child(3) { width: 60%; }
      .muted { color: var(--muted); margin-top: 8px; }
      @keyframes pulse { 0%,100% { opacity: 0.8; } 50% { opacity: 0.45; } }
      .cta {
        margin-top: 24px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, var(--accent), #53e6ff);
        color: #00131a;
        text-decoration: none;
        font-weight: 700;
        padding: 12px 18px;
        border-radius: 12px;
      }
      .disclaimer {
        margin-top: 18px;
        border: 1px solid rgba(245, 158, 11, 0.35);
        background: rgba(31, 41, 55, 0.85);
        border-radius: 12px;
        padding: 12px 14px;
        color: #fcd34d;
        font-size: 0.88rem;
        line-height: 1.5;
      }
      .footer {
        margin-top: 24px;
        border-top: 1px solid rgba(255,255,255,0.12);
        padding-top: 14px;
        color: var(--muted);
        font-size: 0.88rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
      }
      .wa-float {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 30;
        background: #22c55e;
        color: #052e16;
        text-decoration: none;
        font-weight: 800;
        padding: 11px 14px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 10px 24px rgba(34,197,94,0.32);
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <nav class="navbar" id="top">
        <strong>${spec.projectName}</strong>
        ${navLinksHtml}
        <a class="cta" href="#final_cta">${spec.primaryCTA}</a>
      </nav>

      <header class="hero">
        <div class="hero-layout">
          <div>
            <small>MVP Site Generator</small>
            <h1>${spec.projectName}</h1>
            <p>${spec.tone}. Diseñado para ${spec.industry.toLowerCase()} con enfoque en conversion y claridad comercial.</p>
            <p class="meta">Prompt base: ${SYSTEM_PROMPT_TEMPLATE.trim().slice(0, 110)}...</p>
          </div>
          <div class="hero-media" aria-hidden="true"></div>
        </div>
      </header>

      <div class="grid">${sectionsHtml}</div>

      <a class="cta" href="#final_cta" id="contacto">${spec.primaryCTA}</a>

      ${disclaimer}

      <footer class="footer" id="footer">
        <span>Contacto: hola@${spec.clientId}.com</span>
        <span>Copyright ${new Date().getFullYear()} ${spec.projectName}</span>
      </footer>
    </main>
    ${waFloatHtml}
  </body>
</html>`;
}

function buildHtmlEditorialSplit(spec: SiteSpec): string {
  const sectionsHtml = renderSectionCards(spec);
  const navLinksHtml = renderNavLinks(spec);
  const waFloatHtml = renderWhatsAppFloat();
  const disclaimer = spec.disclaimer.enabled
    ? `<aside class="disclaimer"><strong>Disclaimer IA:</strong> ${spec.disclaimer.text}</aside>`
    : '';

  return `<!doctype html>
<html lang="${spec.constraints.language}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${spec.projectName} - MVP</title>
    <style>
      :root {
        --bg: #0a0c10;
        --panel: #10131a;
        --text: #eceff4;
        --muted: #97a0af;
        --accent: #66e3ff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Manrope', 'Sora', system-ui, sans-serif;
        color: var(--text);
        background: linear-gradient(120deg, #080b10 0%, #0c1119 35%, #0a0c10 100%);
      }
      .layout {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1fr;
      }
      @media (min-width: 980px) {
        .layout { grid-template-columns: 0.95fr 1.25fr; }
      }
      .left {
        padding: 42px 24px;
        border-right: 1px solid rgba(255,255,255,0.08);
        background: radial-gradient(circle at 20% 15%, rgba(102,227,255,0.15), transparent 45%);
      }
      .left h1 { margin: 8px 0 10px; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.04; }
      .left p { margin: 0; color: var(--muted); line-height: 1.6; }
      .left small { color: var(--muted); text-transform: uppercase; letter-spacing: 0.14em; }
      .nav-links { margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }
      .nav-links a { color: #c6d0de; text-decoration: none; font-size: 0.9rem; }
      .meta { margin-top: 16px; font-size: 0.9rem; color: #bac3d1; }
      .cta {
        margin-top: 22px;
        display: inline-block;
        padding: 12px 18px;
        background: var(--accent);
        color: #03141d;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 700;
      }
      .right { padding: 42px 24px 60px; }
      .stack { display: grid; gap: 14px; }
      .card {
        padding: 18px;
        border-radius: 14px;
        background: linear-gradient(180deg, rgba(16,19,26,0.95), rgba(11,14,20,0.85));
        border: 1px solid rgba(255,255,255,0.1);
      }
      .card h2 { margin: 0 0 8px; font-size: 1.02rem; color: var(--accent); }
      .card p { margin: 0; color: #d8dee9; line-height: 1.6; }
      .card ul, .card ol { margin: 0; padding-left: 18px; }
      .card li { margin: 6px 0; }
      .mini-grid { display: grid; gap: 10px; grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .mini-grid article { border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; }
      .mini-grid h3 { margin: 0 0 6px; }
      .mini-grid p { margin: 0; }
      @media (min-width: 680px) { .mini-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      .pricing-grid article strong { display: inline-block; margin-top: 8px; color: #7dd3fc; }
      .faq-list details { border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; }
      .faq-list summary { cursor: pointer; font-weight: 600; }
      table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
      th, td { border: 1px solid rgba(255,255,255,0.14); padding: 8px 10px; text-align: left; }
      .mockup { display: grid; gap: 8px; }
      .mockup div { height: 16px; border-radius: 8px; background: linear-gradient(90deg, rgba(102,227,255,0.65), rgba(147,197,253,0.35)); }
      .muted { color: var(--muted); margin-top: 8px; }
      .disclaimer {
        margin-top: 18px;
        padding: 12px 14px;
        border-radius: 12px;
        border: 1px solid rgba(245,158,11,0.4);
        background: rgba(31,41,55,0.8);
        color: #fcd34d;
        font-size: 0.88rem;
      }
      .footer { margin-top: 18px; color: var(--muted); font-size: 0.88rem; display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
      .wa-float {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 30;
        background: #22c55e;
        color: #052e16;
        text-decoration: none;
        font-weight: 800;
        padding: 11px 14px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 10px 24px rgba(34,197,94,0.32);
      }
    </style>
  </head>
  <body>
    <main class="layout">
      <section class="left">
        <small>MVP Site Generator</small>
        <h1>${spec.projectName}</h1>
        <p>${spec.tone}. Construido para ${spec.industry.toLowerCase()} con enfoque en conversion y claridad comercial.</p>
        ${navLinksHtml}
        <p class="meta">Audiencia: ${spec.audience}</p>
        <a class="cta" href="#final_cta">${spec.primaryCTA}</a>
      </section>
      <section class="right">
        <div class="stack">${sectionsHtml}</div>
        ${disclaimer}
        <footer class="footer" id="footer"><span>Contacto: hola@${spec.clientId}.com</span><span>Copyright ${new Date().getFullYear()} ${spec.projectName}</span></footer>
      </section>
    </main>
    ${waFloatHtml}
  </body>
</html>`;
}

function buildHtmlGlassFlow(spec: SiteSpec): string {
  const sectionsHtml = renderSectionCards(spec);
  const navLinksHtml = renderNavLinks(spec);
  const waFloatHtml = renderWhatsAppFloat();
  const disclaimer = spec.disclaimer.enabled
    ? `<aside class="disclaimer"><strong>Disclaimer IA:</strong> ${spec.disclaimer.text}</aside>`
    : '';

  return `<!doctype html>
<html lang="${spec.constraints.language}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${spec.projectName} - MVP</title>
    <style>
      :root {
        --bg: #070b13;
        --text: #edf2f7;
        --muted: #a0aec0;
        --accent: #4fd1ff;
        --accent2: #5eead4;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: 'Inter', 'Sora', system-ui, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at 12% 8%, rgba(79,209,255,0.24), transparent 36%),
          radial-gradient(circle at 88% 12%, rgba(94,234,212,0.18), transparent 28%),
          linear-gradient(180deg, #070b13 0%, #0a1020 100%);
      }
      .wrap { max-width: 1040px; margin: 0 auto; padding: 30px 20px 70px; }
      .hero {
        border-radius: 22px;
        padding: 26px;
        border: 1px solid rgba(255,255,255,0.18);
        background: linear-gradient(145deg, rgba(17,25,40,0.62), rgba(13,19,33,0.55));
        backdrop-filter: blur(10px);
      }
      .hero h1 { margin: 8px 0 10px; font-size: clamp(1.9rem, 5vw, 3.1rem); }
      .hero p { margin: 0; color: #dbe4f0; line-height: 1.65; }
      .nav-links { margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap; }
      .nav-links a { color: #cbd5e1; text-decoration: none; font-size: 0.9rem; }
      .meta { margin-top: 14px; color: var(--muted); font-size: 0.9rem; }
      .grid {
        margin-top: 18px;
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(1, minmax(0, 1fr));
      }
      @media (min-width: 760px) {
        .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      .card {
        border-radius: 16px;
        padding: 18px;
        border: 1px solid rgba(255,255,255,0.14);
        background: linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
        backdrop-filter: blur(6px);
      }
      .card h2 { margin: 0 0 8px; color: var(--accent); font-size: 1.03rem; }
      .card p { margin: 0; color: #dbe4f0; line-height: 1.62; }
      .card ul, .card ol { margin: 0; padding-left: 18px; }
      .card li { margin: 6px 0; }
      .mini-grid { display: grid; gap: 10px; grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .mini-grid article { border: 1px solid rgba(255,255,255,0.13); border-radius: 12px; padding: 12px; }
      .mini-grid h3 { margin: 0 0 6px; }
      .mini-grid p { margin: 0; }
      @media (min-width: 680px) { .mini-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
      .pricing-grid article strong { display: inline-block; margin-top: 8px; color: #67e8f9; }
      .faq-list details { border: 1px solid rgba(255,255,255,0.14); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; }
      .faq-list summary { cursor: pointer; font-weight: 600; }
      table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
      th, td { border: 1px solid rgba(255,255,255,0.14); padding: 8px 10px; text-align: left; }
      .mockup { display: grid; gap: 8px; }
      .mockup div { height: 16px; border-radius: 8px; background: linear-gradient(90deg, rgba(79,209,255,0.65), rgba(94,234,212,0.45)); animation: pulse 3s infinite; }
      .mockup div:nth-child(2) { width: 80%; }
      .mockup div:nth-child(3) { width: 60%; }
      .muted { color: var(--muted); margin-top: 8px; }
      @keyframes pulse { 0%,100% { opacity: 0.8; } 50% { opacity: 0.45; } }
      .cta {
        margin-top: 24px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 18px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 700;
        color: #041018;
        background: linear-gradient(135deg, var(--accent), var(--accent2));
      }
      .disclaimer {
        margin-top: 18px;
        border-radius: 12px;
        padding: 12px 14px;
        border: 1px solid rgba(245,158,11,0.35);
        background: rgba(31,41,55,0.76);
        color: #fcd34d;
        font-size: 0.88rem;
      }
      .footer { margin-top: 18px; color: var(--muted); font-size: 0.88rem; display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
      .wa-float {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 30;
        background: #22c55e;
        color: #052e16;
        text-decoration: none;
        font-weight: 800;
        padding: 11px 14px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.5);
        box-shadow: 0 10px 24px rgba(34,197,94,0.32);
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <header class="hero">
        <small>MVP Site Generator</small>
        <h1>${spec.projectName}</h1>
        <p>${spec.tone}. Solucion para ${spec.audience.toLowerCase()} con narrativa visual moderna y foco comercial.</p>
        ${navLinksHtml}
        <p class="meta">Color direction: ${spec.colorDirection}</p>
      </header>

      <div class="grid">${sectionsHtml}</div>

      <a class="cta" href="#final_cta">${spec.primaryCTA}</a>

      ${disclaimer}

      <footer class="footer" id="footer"><span>Contacto: hola@${spec.clientId}.com</span><span>Copyright ${new Date().getFullYear()} ${spec.projectName}</span></footer>
    </main>
    ${waFloatHtml}
  </body>
</html>`;
}

function buildHtml(spec: SiteSpec, variant: DesignVariant): string {
  if (variant === 'editorial-split') return buildHtmlEditorialSplit(spec);
  if (variant === 'glass-flow') return buildHtmlGlassFlow(spec);
  return buildHtmlNeoGrid(spec);
}

async function readUsageState(filePath: string): Promise<UsageState> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as UsageState;
  } catch {
    return { clients: {} };
  }
}

async function readPreferenceState(filePath: string): Promise<ClientPreferenceState> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as ClientPreferenceState;
  } catch {
    return { clients: {} };
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      message?: string;
      clientId?: string;
      projectName?: string;
      language?: 'es' | 'en';
      aiProvider?: SupportedProvider;
      aiModel?: string;
      designVariant?: DesignVariant | 'auto';
    };

    const message = (body.message || '').trim();
    if (!message) {
      return NextResponse.json({ error: 'El mensaje es obligatorio' }, { status: 400 });
    }

    const baseSpec = buildSpecFromMessage({
      message,
      clientId: body.clientId,
      projectName: body.projectName,
      language: body.language || 'es',
    });

    const preferencePath = path.join(process.cwd(), 'mvp', 'site-generator', 'output', 'client-model-preferences.json');
    const preferenceState = await readPreferenceState(preferencePath);
    const clientKey = slugify(baseSpec.clientId);
    const persistedPreference = preferenceState.clients[clientKey];

    const preferredSelection = resolveProviderModelSelection({
      requestedProvider: body.aiProvider,
      requestedModel: body.aiModel,
      persistedProvider: persistedPreference?.provider || null,
      persistedModel: persistedPreference?.model || null,
    });

    const selectedDesign = resolveDesignVariant({
      requested: body.designVariant === 'auto' ? null : body.designVariant,
      persisted: persistedPreference?.designVariant || null,
      clientId: clientKey,
    });

    const { spec, meta } = await generateSpecWithAI(message, baseSpec, preferredSelection);

    const limits = {
      ...DEFAULT_LIMITS,
      ...(spec.limits.ai || {}),
    };

    const usageStatePath = path.join(process.cwd(), 'mvp', 'site-generator', 'output', 'usage-state.json');
    const usageState = await readUsageState(usageStatePath);
    const month = monthKey();

    const existing = usageState.clients[spec.clientId];
    const current = !existing || existing.month !== month
      ? {
          month,
          generations: 0,
          estimatedInputTokens: 0,
          estimatedOutputTokens: 0,
          lastGenerationAt: null,
          limits,
        }
      : existing;

    const inputTokens = estimateTokens(JSON.stringify({ message, spec }));
    if (current.generations + 1 > limits.maxGenerationsPerMonth) {
      return NextResponse.json({ error: 'Limite mensual de generaciones alcanzado para este cliente.' }, { status: 429 });
    }
    if (current.estimatedInputTokens + inputTokens > limits.maxInputTokensPerMonth) {
      return NextResponse.json({ error: 'Limite mensual de input tokens alcanzado para este cliente.' }, { status: 429 });
    }

    const html = buildHtml(spec, selectedDesign.variant);
    const outputTokens = estimateTokens(html);
    if (current.estimatedOutputTokens + outputTokens > limits.maxOutputTokensPerMonth) {
      return NextResponse.json({ error: 'Limite mensual de output tokens alcanzado para este cliente.' }, { status: 429 });
    }

    const slug = slugify(`${spec.clientId}-${Date.now()}`);
    const outputDir = path.join(process.cwd(), 'public', 'mvp-output');
    const outputFile = path.join(outputDir, `${slug}.html`);

    const specsDir = path.join(process.cwd(), 'mvp', 'site-generator', 'output', 'specs');
    const specFile = path.join(specsDir, `${slug}.json`);

    await mkdir(outputDir, { recursive: true });
    await mkdir(specsDir, { recursive: true });
    await writeFile(outputFile, html, 'utf8');
    await writeFile(specFile, JSON.stringify(spec, null, 2), 'utf8');

    usageState.clients[spec.clientId] = {
      month,
      generations: current.generations + 1,
      estimatedInputTokens: current.estimatedInputTokens + inputTokens,
      estimatedOutputTokens: current.estimatedOutputTokens + outputTokens,
      lastGenerationAt: new Date().toISOString(),
      limits,
    };

    await mkdir(path.dirname(usageStatePath), { recursive: true });
    await writeFile(usageStatePath, JSON.stringify(usageState, null, 2), 'utf8');

    preferenceState.clients[clientKey] = {
      provider: normalizeProvider(meta.provider) || preferredSelection.provider,
      model: meta.model,
      designVariant: selectedDesign.variant,
      updatedAt: new Date().toISOString(),
    };
    await mkdir(path.dirname(preferencePath), { recursive: true });
    await writeFile(preferencePath, JSON.stringify(preferenceState, null, 2), 'utf8');

    return NextResponse.json({
      ok: true,
      spec,
      ai: meta,
      selected: preferredSelection,
      design: selectedDesign,
      outputUrl: `/mvp-output/${slug}.html`,
      usage: usageState.clients[spec.clientId],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No se pudo generar el sitio' },
      { status: 500 }
    );
  }
}
