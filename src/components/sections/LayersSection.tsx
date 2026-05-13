import { Bot, Workflow, Globe2 } from 'lucide-react';

const LEVELS = [
  {
    badge: 'Desde S/29/mes',
    title: 'Nivel 1 — Presencia Digital IA',
    features: [
      'Landing/ecommerce/CMS generado con IA',
      'Textos, estructura, SEO básico, branding inicial',
      'Hosting + SSL + dominio + panel simple',
      'Deploy automático en cliente.gargurevich.dev',
      'Setup único: S/300–1,500 | Mensual: S/29',
    ],
    button: 'Empezar Nivel 1',
    icon: Globe2,
    ctaLink: '#contacto',
  },
  {
    badge: 'S/80–120/mes',
    title: 'Nivel 2 — Asistente IA 24/7',
    features: [
      'Entrenado en documentos, catálogo y tono del cliente',
      'Responde FAQs, precios, horarios, deriva a WhatsApp',
      'Widget de chat inyectado en el site',
      'Evoluciona: citas, stock, recomendaciones',
      'Entrenamiento inicial: S/100–150 | Mensual: S/80–120',
    ],
    button: 'Probar asistente demo',
    icon: Bot,
    ctaLink: '#contacto',
  },
  {
    badge: 'S/150–400/mes',
    title: 'Nivel 3 — Automatización del Negocio',
    features: [
      'Workflows n8n: sincronización, reportes, ETL',
      'Transcripción automática (Whisper en reuniones/llamadas)',
      'BI ligero: agente consulta BD y genera insights',
      'Agentes operativos ejecutan scripts',
      'Edge agent local conecta con BD del cliente',
    ],
    button: 'Consultar automatización',
    icon: Workflow,
    ctaLink: '#contacto',
  },
];

export default function LayersSection() {
  return (
    <section id="servicios" className="scroll-mt-28 relative py-24 md:py-32 bg-linear-to-b from-[#0D0D0D] via-[#10151A] to-[#0D0D0D] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-14">
          3 Niveles Comerciales IA
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {LEVELS.map((layer) => (
            <div key={layer.title} className="rounded-3xl border border-white/10 bg-[#16181A]/80 p-10 flex flex-col items-center text-center shadow-lg hover:border-[#00D4FF]/40 transition-all duration-200">
              <span className="mb-4 inline-block px-4 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] text-xs font-semibold border border-[#00D4FF]/30">
                {layer.badge}
              </span>
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-linear-to-br from-[#00D4FF]/20 to-[#10B981]/20 mb-5">
                <layer.icon size={28} className="text-[#00D4FF]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{layer.title}</h3>
              <ul className="text-[#A1A1AA] text-base mb-6 space-y-2 text-left max-w-xs mx-auto">
                {layer.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00D4FF] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={layer.ctaLink}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 text-white px-5 py-3 text-sm font-medium transition-all duration-200 hover:border-[#00D4FF]/55 hover:bg-[#00D4FF]/10"
              >
                {layer.button}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
