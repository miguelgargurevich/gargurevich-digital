import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

const content = {
  es: {
    metaTitle: 'Política de Privacidad | Gargurevich Digital',
    metaDescription: 'Conoce cómo Gargurevich Digital recopila, utiliza, protege y conserva la información personal de sus clientes y visitantes.',
    badge: 'Privacidad y Confianza',
    title: 'Protegemos tus datos con el mismo rigor con el que construimos productos digitales.',
    intro:
      'Esta política explica qué información recopilamos, por qué la usamos y qué control tienes sobre tus datos cuando interactúas con Gargurevich Digital.',
    updatedLabel: 'Última actualización',
    updatedValue: '6 de mayo de 2026',
    highlights: [
      {
        icon: ShieldCheck,
        title: 'Uso responsable',
        description: 'Solo solicitamos la información necesaria para responder consultas, preparar propuestas y operar nuestros servicios.'
      },
      {
        icon: Lock,
        title: 'Protección activa',
        description: 'Aplicamos controles razonables de acceso, almacenamiento y transmisión para reducir riesgos sobre la información.'
      },
      {
        icon: Mail,
        title: 'Control del usuario',
        description: 'Puedes solicitar acceso, corrección o eliminación de tus datos escribiendo a contacto@gargurevich.dev.'
      }
    ],
    sections: [
      {
        title: '1. Información que recopilamos',
        paragraphs: [
          'Podemos recopilar datos de contacto como nombre, correo electrónico, empresa, número de WhatsApp y cualquier información que decidas incluir en formularios, correos o mensajes directos.',
          'También podemos registrar información técnica básica, como tipo de navegador, páginas visitadas, idioma y métricas agregadas de uso, con fines analíticos, de seguridad y mejora continua.'
        ]
      },
      {
        title: '2. Cómo utilizamos la información',
        paragraphs: [
          'Utilizamos tus datos para responder solicitudes, elaborar cotizaciones, coordinar reuniones, ejecutar proyectos, enviar comunicaciones relacionadas con servicios y mejorar la experiencia del sitio.',
          'No utilizamos tu información para vender bases de datos, hacer spam ni cederla a terceros para fines publicitarios ajenos a la relación comercial.'
        ]
      },
      {
        title: '3. Base de tratamiento y conservación',
        paragraphs: [
          'Tratamos la información sobre la base de tu consentimiento, la necesidad de ejecutar una relación precontractual o contractual, y nuestro interés legítimo en mantener la seguridad y operatividad del negocio.',
          'Conservamos los datos durante el tiempo necesario para atender la finalidad para la que fueron recopilados, cumplir obligaciones legales y mantener respaldo razonable de la relación comercial.'
        ]
      },
      {
        title: '4. Compartición con terceros',
        paragraphs: [
          'Podemos apoyarnos en proveedores tecnológicos para hosting, analítica, mensajería, almacenamiento o procesamiento operativo. Estos terceros solo acceden a la información necesaria para prestar el servicio correspondiente.',
          'Cuando aplica, exigimos estándares razonables de confidencialidad y seguridad acordes al tipo de información tratada.'
        ]
      },
      {
        title: '5. Seguridad de la información',
        paragraphs: [
          'Aplicamos medidas técnicas y organizativas razonables para proteger la información contra accesos no autorizados, alteración, divulgación o destrucción indebida.',
          'Aun así, ningún sistema conectado a internet puede garantizar seguridad absoluta, por lo que te recomendamos no compartir información sensible innecesaria por canales abiertos.'
        ]
      },
      {
        title: '6. Tus derechos',
        paragraphs: [
          'Puedes solicitar acceso, actualización, corrección, oposición o eliminación de tus datos personales, sujeto a las limitaciones legales aplicables.',
          'Para ejercer cualquiera de estos derechos, escríbenos a contacto@gargurevich.dev e indica claramente tu solicitud y un medio de contacto para responderte.'
        ]
      }
    ],
    contactTitle: '¿Necesitas una aclaración puntual?',
    contactBody:
      'Si tu equipo legal, de compras o compliance necesita una versión específica para un proyecto o contrato, podemos revisarla durante la etapa comercial.',
    contactCta: 'Escríbenos',
    backHome: 'Volver al inicio'
  },
  en: {
    metaTitle: 'Privacy Policy | Gargurevich Digital',
    metaDescription: 'Learn how Gargurevich Digital collects, uses, protects and stores personal information from clients and site visitors.',
    badge: 'Privacy and Trust',
    title: 'We protect your data with the same rigor we use to build digital products.',
    intro:
      'This policy explains what information we collect, why we use it, and what control you have over your data when interacting with Gargurevich Digital.',
    updatedLabel: 'Last updated',
    updatedValue: 'May 6, 2026',
    highlights: [
      {
        icon: ShieldCheck,
        title: 'Responsible use',
        description: 'We only request the information needed to answer inquiries, prepare proposals and operate our services.'
      },
      {
        icon: Lock,
        title: 'Active protection',
        description: 'We apply reasonable access, storage and transmission controls to reduce risks affecting information.'
      },
      {
        icon: Mail,
        title: 'User control',
        description: 'You can request access, correction or deletion of your data by writing to contacto@gargurevich.dev.'
      }
    ],
    sections: [
      {
        title: '1. Information we collect',
        paragraphs: [
          'We may collect contact details such as name, email address, company, WhatsApp number and any information you choose to include in forms, emails or direct messages.',
          'We may also record basic technical information such as browser type, visited pages, language and aggregated usage metrics for analytics, security and continuous improvement purposes.'
        ]
      },
      {
        title: '2. How we use information',
        paragraphs: [
          'We use your data to respond to requests, prepare quotes, coordinate meetings, execute projects, send service-related communications and improve the site experience.',
          'We do not use your information to sell databases, send spam or disclose it to third parties for advertising purposes unrelated to our business relationship.'
        ]
      },
      {
        title: '3. Legal basis and retention',
        paragraphs: [
          'We process information based on your consent, the need to carry out a pre-contractual or contractual relationship, and our legitimate interest in maintaining business security and operability.',
          'We retain data only for as long as necessary to fulfill the purpose for which it was collected, comply with legal obligations and maintain reasonable records of the business relationship.'
        ]
      },
      {
        title: '4. Sharing with third parties',
        paragraphs: [
          'We may rely on technology providers for hosting, analytics, messaging, storage or operational processing. These third parties only access the information required to deliver the relevant service.',
          'Where applicable, we require reasonable confidentiality and security standards appropriate to the type of information being processed.'
        ]
      },
      {
        title: '5. Information security',
        paragraphs: [
          'We apply reasonable technical and organizational measures to protect information from unauthorized access, alteration, disclosure or improper destruction.',
          'However, no internet-connected system can guarantee absolute security, so we recommend avoiding the sharing of unnecessary sensitive information through open channels.'
        ]
      },
      {
        title: '6. Your rights',
        paragraphs: [
          'You may request access to, updating, correction of, objection to or deletion of your personal data, subject to applicable legal limitations.',
          'To exercise any of these rights, write to contacto@gargurevich.dev and clearly indicate your request together with a contact method for our reply.'
        ]
      }
    ],
    contactTitle: 'Need a more specific clarification?',
    contactBody:
      'If your legal, procurement or compliance team needs a project-specific version, we can review it during the commercial process.',
    contactCta: 'Contact us',
    backHome: 'Back to home'
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

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const page = content[locale as 'es' | 'en'] ?? content.en;
  setRequestLocale(locale);

  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.16),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.14),transparent_28%),linear-gradient(180deg,#090909_0%,#101010_100%)]" />
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
          {page.highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#00D4FF]/20 to-[#8B5CF6]/20 border border-white/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#D9F4FF]" />
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

        <div className="mt-12 rounded-4xl border border-[#00D4FF]/20 bg-linear-to-br from-[#00D4FF]/10 via-white/3 to-[#8B5CF6]/10 p-8 md:p-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">{page.contactTitle}</h2>
            <p className="text-[#C7C7CC] leading-8">{page.contactBody}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-white hover:bg-white/5 transition-colors"
            >
              {page.backHome}
            </Link>
            <Link
              href="mailto:contacto@gargurevich.dev"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-background px-5 py-3 font-medium hover:bg-[#EAEAEA] transition-colors"
            >
              {page.contactCta}
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
