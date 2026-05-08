import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, FileCheck2, Scale } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

const content = {
  es: {
    metaTitle: 'Términos de Servicio | Gargurevich Digital',
    metaDescription: 'Revisa los términos generales bajo los que Gargurevich Digital ofrece servicios de desarrollo web, diseño y soluciones digitales.',
    badge: 'Términos de Servicio',
    title: 'Condiciones claras para proyectos serios, entregas de alto nivel y relaciones de trabajo sostenibles.',
    intro:
      'Estos términos describen las reglas generales aplicables al uso del sitio y a la contratación de servicios de diseño, desarrollo e implementación digital con Gargurevich Digital.',
    updatedLabel: 'Última actualización',
    updatedValue: '6 de mayo de 2026',
    principles: [
      {
        icon: BriefcaseBusiness,
        title: 'Alcance definido',
        description: 'Cada proyecto requiere una propuesta o acuerdo que delimite objetivos, entregables, tiempos, revisiones y responsabilidades.'
      },
      {
        icon: FileCheck2,
        title: 'Entregables verificables',
        description: 'Trabajamos con hitos, revisiones y aprobaciones para mantener trazabilidad y reducir ambigüedad durante la ejecución.'
      },
      {
        icon: Scale,
        title: 'Relación equilibrada',
        description: 'Estos términos protegen tanto la calidad del trabajo como la claridad operativa entre proveedor y cliente.'
      }
    ],
    sections: [
      {
        title: '1. Aceptación de los términos',
        paragraphs: [
          'Al navegar este sitio o contratar servicios con Gargurevich Digital, aceptas estos términos generales, además de cualquier propuesta, contrato o anexo específico aplicable a tu proyecto.',
          'Si no estás de acuerdo con estas condiciones, no deberías utilizar el sitio para contratar servicios ni enviar información para iniciar una relación comercial.'
        ]
      },
      {
        title: '2. Alcance de los servicios',
        paragraphs: [
          'Los servicios pueden incluir consultoría, estrategia digital, diseño UI/UX, desarrollo frontend y backend, integración con terceros, automatización, implementación de IA, soporte y mantenimiento.',
          'El alcance exacto de cada proyecto se define en una cotización, propuesta comercial, statement of work o contrato específico. Cualquier funcionalidad no contemplada podrá tratarse como cambio de alcance.'
        ]
      },
      {
        title: '3. Responsabilidades del cliente',
        paragraphs: [
          'El cliente debe proporcionar información, accesos, feedback y aprobaciones en tiempos razonables para no afectar cronograma, costos ni calidad de la ejecución.',
          'Cuando existan demoras prolongadas, cambios reiterados o bloqueo de dependencias externas, el calendario y las condiciones del proyecto pueden requerir ajuste.'
        ]
      },
      {
        title: '4. Pagos, cambios y pausas',
        paragraphs: [
          'Las condiciones económicas, moneda, forma de pago, hitos facturables y cualquier anticipo se establecen en la propuesta o contrato correspondiente.',
          'Cambios de alcance, pausas del proyecto o solicitudes extraordinarias pueden generar reestimación de tiempos y costos. Ningún trabajo adicional se considera incluido salvo confirmación expresa.'
        ]
      },
      {
        title: '5. Propiedad intelectual',
        paragraphs: [
          'Salvo acuerdo distinto por escrito, el cliente obtiene los derechos sobre los entregables finales una vez realizado el pago total del proyecto correspondiente.',
          'Gargurevich Digital conserva know-how, componentes reutilizables, librerías internas, metodologías, herramientas, plantillas y cualquier activo preexistente o de uso general desarrollado durante la prestación del servicio.'
        ]
      },
      {
        title: '6. Garantías y limitación de responsabilidad',
        paragraphs: [
          'Nos comprometemos a ejecutar el trabajo con diligencia profesional y buenas prácticas técnicas, pero no garantizamos resultados comerciales específicos, posicionamiento orgánico, métricas de conversión o disponibilidad absoluta de servicios de terceros.',
          'En la medida permitida por la ley aplicable, la responsabilidad total derivada de la prestación del servicio se limita al monto efectivamente pagado por el cliente por el servicio que originó el reclamo.'
        ]
      },
      {
        title: '7. Suspensión, terminación y contacto',
        paragraphs: [
          'Podemos suspender o terminar una relación comercial ante incumplimientos materiales, uso indebido del trabajo, falta de pago o riesgos legales u operativos relevantes.',
          'Si tienes dudas sobre estos términos o necesitas una versión contractual más específica, puedes escribir a contacto@gargurevichdigital.com.'
        ]
      }
    ],
    ctaTitle: '¿Vas a contratar un proyecto con requisitos especiales?',
    ctaBody:
      'Si tu empresa necesita anexos de confidencialidad, cláusulas de procurement, compliance o cesión específica de derechos, eso debe resolverse en la documentación comercial del proyecto.',
    ctaPrimary: 'Hablar de un proyecto',
    ctaSecondary: 'Volver al inicio'
  },
  en: {
    metaTitle: 'Terms of Service | Gargurevich Digital',
    metaDescription: 'Review the general terms under which Gargurevich Digital provides web development, design and digital solution services.',
    badge: 'Terms of Service',
    title: 'Clear conditions for serious projects, high-end delivery and sustainable working relationships.',
    intro:
      'These terms describe the general rules applicable to the use of the site and to the hiring of design, development and digital implementation services with Gargurevich Digital.',
    updatedLabel: 'Last updated',
    updatedValue: 'May 6, 2026',
    principles: [
      {
        icon: BriefcaseBusiness,
        title: 'Defined scope',
        description: 'Every project requires a proposal or agreement that sets objectives, deliverables, timelines, revisions and responsibilities.'
      },
      {
        icon: FileCheck2,
        title: 'Verifiable deliverables',
        description: 'We work with milestones, reviews and approvals to keep traceability and reduce ambiguity during execution.'
      },
      {
        icon: Scale,
        title: 'Balanced relationship',
        description: 'These terms protect both work quality and operational clarity between provider and client.'
      }
    ],
    sections: [
      {
        title: '1. Acceptance of terms',
        paragraphs: [
          'By browsing this site or hiring services from Gargurevich Digital, you accept these general terms together with any proposal, contract or project-specific addendum that may apply.',
          'If you do not agree with these conditions, you should not use the site to hire services or submit information to start a business relationship.'
        ]
      },
      {
        title: '2. Scope of services',
        paragraphs: [
          'Services may include consulting, digital strategy, UI/UX design, frontend and backend development, third-party integrations, automation, AI implementation, support and maintenance.',
          'The exact scope of each engagement is defined in a quotation, commercial proposal, statement of work or specific contract. Any feature outside that scope may be treated as a scope change.'
        ]
      },
      {
        title: '3. Client responsibilities',
        paragraphs: [
          'The client must provide information, access, feedback and approvals within reasonable timeframes so as not to affect schedule, cost or execution quality.',
          'Where there are prolonged delays, repeated changes or blocked external dependencies, the project timeline and terms may need adjustment.'
        ]
      },
      {
        title: '4. Payments, changes and pauses',
        paragraphs: [
          'Commercial conditions, currency, payment method, billable milestones and any advance payment are established in the relevant proposal or contract.',
          'Scope changes, project pauses or extraordinary requests may result in timeline and cost re-estimation. No additional work is considered included unless expressly confirmed.'
        ]
      },
      {
        title: '5. Intellectual property',
        paragraphs: [
          'Unless otherwise agreed in writing, the client acquires rights over the final deliverables only after full payment of the corresponding project.',
          'Gargurevich Digital retains know-how, reusable components, internal libraries, methodologies, tools, templates and any pre-existing or general-purpose assets developed during service delivery.'
        ]
      },
      {
        title: '6. Warranties and limitation of liability',
        paragraphs: [
          'We commit to performing the work with professional diligence and sound technical practices, but we do not guarantee specific commercial outcomes, organic ranking, conversion metrics or absolute availability of third-party services.',
          'To the extent permitted by applicable law, total liability arising from service delivery is limited to the amount actually paid by the client for the service that gave rise to the claim.'
        ]
      },
      {
        title: '7. Suspension, termination and contact',
        paragraphs: [
          'We may suspend or terminate a business relationship in the event of material breaches, misuse of the work, non-payment or significant legal or operational risk.',
          'If you have questions about these terms or need a more specific contractual version, you can write to contacto@gargurevichdigital.com.'
        ]
      }
    ],
    ctaTitle: 'Planning to hire a project with special requirements?',
    ctaBody:
      'If your company needs NDA addenda, procurement clauses, compliance requirements or specific IP assignment terms, that should be addressed in the project commercial documentation.',
    ctaPrimary: 'Discuss a project',
    ctaSecondary: 'Back to home'
  }
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = content[locale as 'es' | 'en'] ?? content.en;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = content[locale as 'es' | 'en'] ?? content.en;
  setRequestLocale(locale);

  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.14),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(239,68,68,0.12),transparent_24%),linear-gradient(180deg,#090909_0%,#101010_100%)]" />
        <div className="dot-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-4xl mb-14 md:mb-18">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-[#CFCFD2]">
            {page.badge}
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">
            {page.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-[#A1A1AA] leading-8">
            {page.intro}
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-[#D4D4D8]">
            <span className="text-white">{page.updatedLabel}</span>
            <span className="text-[#71717A]">•</span>
            <span>{page.updatedValue}</span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3 mb-12 md:mb-16">
          {page.principles.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#EF4444]/20 to-[#00D4FF]/20 border border-white/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#F4F4F5]" />
                </div>
                <h2 className="text-xl text-white font-medium mb-3">{item.title}</h2>
                <p className="text-[#A1A1AA] leading-7">{item.description}</p>
              </article>
            );
          })}
        </div>

        <div className="grid gap-6">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-4xl border border-white/10 bg-[#111111]/90 p-7 md:p-9 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <h2 className="text-2xl md:text-3xl text-white font-semibold mb-5">{section.title}</h2>
              <div className="grid gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[#A1A1AA] leading-8 text-base md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-4xl border border-white/10 bg-linear-to-br from-white/6 via-[#EF4444]/8 to-[#00D4FF]/8 p-8 md:p-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">{page.ctaTitle}</h2>
            <p className="text-[#C7C7CC] leading-8">{page.ctaBody}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-white hover:bg-white/5 transition-colors"
            >
              {page.ctaSecondary}
            </Link>
            <Link
              href={`/${locale}#contacto`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-background px-5 py-3 font-medium hover:bg-[#EAEAEA] transition-colors"
            >
              {page.ctaPrimary}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
