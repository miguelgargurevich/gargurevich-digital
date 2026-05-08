import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Sparkles, Star, Zap } from 'lucide-react';
import { db } from '@/lib/db';

type OfferRow = Awaited<ReturnType<typeof db.offer.findMany>>[number];

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  zap: Zap,
  star: Star,
  sparkles: Sparkles,
};

const UI_LABELS = {
  es: {
    badge: 'Mis Servicios',
    authority: 'Ayudo a negocios a convertir su presencia digital en clientes reales.',
    title: 'Convierte tu presencia digital en clientes reales',
    subtitle: 'No te vendemos "desarrollo web". Te ofrecemos sistemas para generar clientes online. Elige el plan que encaja con tu negocio.',
    packagesTitle: 'Elige tu plan',
    popularBadge: 'Más popular',
    guarantee: 'Garantía de 15 días: si no estás satisfecho, te devolvemos el 100% de tu pago. Sin preguntas incómodas.',
    note: 'El dominio es tuyo desde el día 1. Yo solo te ayudo a registrarlo y renovarlo si lo necesitas.',
    summaryTitle: 'Lo que pagarías después del primer año, por plan',
    summaryOwnerNote: 'El dominio es tuyo desde el día 1. Si en el futuro quieres llevarte tu web a otro proveedor, no hay problema: te entrego todo.',
    summaryColPlan: 'Plan',
    summaryColAnnual: 'Costo anual recurrente',
    summaryColIncludes: 'Qué incluye',
    summaryRows: [
      { plan: 'Startup Digital', annual: 'Dominio: según extensión (.com a .pe)', includes: 'Solo renovación de dominio · desde S/50/año (.com) hasta S/130/año (.pe) · sin mensualidad' },
      { plan: 'Captador de Clientes', annual: 'Dominio: según extensión (.com a .pe)', includes: 'Solo renovación de dominio · desde S/50/año (.com) hasta S/130/año (.pe) · sin mensualidad' },
      { plan: 'Independencia Digital', annual: 'Dominio: según extensión + S/ 19/mes', includes: 'El dominio es tuyo para siempre · desde S/50 a S/130/año según extensión · mensualidad es opcional y puedes cancelar cuando quieras · hosting incluido' },
      { plan: 'Sistema Completo', annual: 'Dominio: según extensión + S/ 39/mes', includes: 'El dominio es tuyo para siempre · desde S/50 a S/130/año según extensión · mensualidad es opcional y puedes cancelar cuando quieras · hosting, soporte y backups incluidos' },
      { plan: 'Blindaje Digital', annual: 'Dominio: según extensión + desde S/ 79/mes', includes: 'Aplica a una web que ya tienes · desde S/50 a S/130/año según extensión · mensualidad es flexible según tus necesidades' },
      { plan: 'Presencia Online Rápida', annual: 'S/ 150/año', includes: 'Dominio .pe o .com.pe · Correos profesionales con tu marca · gestión de dominio incluida · sin mensualidad' },
    ] as const,
    domainTableTitle: 'Referencia: costo de renovación anual según extensión',
    domainColExt: 'Extensión',
    domainColCost: 'Renovación/año',
    domainColUse: 'Uso recomendado',
    domainRows: [
      { ext: '.com', cost: 'S/ 50 – 80', use: 'Negocios globales / tech' },
      { ext: '.pe', cost: 'S/ 110 – 130', use: 'Marca local fuerte' },
      { ext: '.com.pe', cost: 'S/ 90 – 130', use: 'Empresas en Perú' },
    ] as const,
    domainNote: 'El dominio queda registrado a tu nombre. Puedo gestionarte la renovación anual o hacerlo tú directo con cualquier proveedor. Los costos mostrados son rangos reales: .com (S/50–80), .pe (S/110–130), .com.pe (S/90–130).',
  },
  en: {
    badge: 'My Services',
    authority: 'I help businesses convert their digital presence into real clients.',
    title: 'Convert your digital presence into real clients',
    subtitle: 'We don\'t sell you "web development". We offer systems to generate clients online. Pick the plan that fits your business.',
    packagesTitle: 'Choose your plan',
    popularBadge: 'Most popular',
    guarantee: '15-day guarantee: if you\'re not satisfied, we refund 100% of your payment. No awkward questions.',
    note: 'The domain is yours from day one. I only help register and renew it if you need it.',
    summaryTitle: 'What you would pay after year one, per plan',
    summaryOwnerNote: 'The domain is yours from day one. If you ever want to move your site to another provider, no problem: I deliver everything.',
    summaryColPlan: 'Plan',
    summaryColAnnual: 'Annual recurring cost',
    summaryColIncludes: 'What it covers',
    summaryRows: [
      { plan: 'Digital Startup', annual: 'Domain: by extension (.com to .pe)', includes: 'Domain renewal only · from S/50/yr (.com) to S/130/yr (.pe) · no monthly fee' },
      { plan: 'Customer Converter', annual: 'Domain: by extension (.com to .pe)', includes: 'Domain renewal only · from S/50/yr (.com) to S/130/yr (.pe) · no monthly fee' },
      { plan: 'Digital Independence', annual: 'Domain: by extension + S/ 19/mo', includes: 'The domain is yours forever · from S/50 to S/130/yr by extension · monthly fee is optional and you can cancel anytime · hosting included' },
      { plan: 'Complete System', annual: 'Domain: by extension + S/ 39/mo', includes: 'The domain is yours forever · from S/50 to S/130/yr by extension · monthly fee is optional and you can cancel anytime · hosting, support and backups included' },
      { plan: 'Digital Shield', annual: 'Domain: by extension + from S/ 79/mo', includes: 'Applies to a website you already have · from S/50 to S/130/yr by extension · monthly fee is flexible based on your needs' },
      { plan: 'Quick Online Presence', annual: 'S/ 150/yr', includes: 'Domain .pe or .com.pe · Professional emails with your brand · domain management included · no monthly fee' },
    ] as const,
    domainTableTitle: 'Reference: annual renewal cost by extension',
    domainColExt: 'Extension',
    domainColCost: 'Renewal/year',
    domainColUse: 'Recommended use',
    domainRows: [
      { ext: '.com', cost: 'S/ 50 – 80', use: 'Global / tech businesses' },
      { ext: '.pe', cost: 'S/ 110 – 130', use: 'Strong local brand' },
      { ext: '.com.pe', cost: 'S/ 90 – 130', use: 'Companies in Peru' },
    ] as const,
    domainNote: 'The domain is registered in your name. I can manage the yearly renewal for you, or you can do it yourself with any registrar. Real costs shown are ranges: .com (S/50–80), .pe (S/110–130), .com.pe (S/90–130).',
  },
};

interface Props {
  locale: string;
}

async function getPublishedOffers(): Promise<OfferRow[]> {
  try {
    return await db.offer.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  } catch {
    return [];
  }
}

export default async function OffersSection({ locale }: Props) {
  const offers = await getPublishedOffers();
  if (offers.length === 0) return null;

  const ui = UI_LABELS[locale as 'es' | 'en'] ?? UI_LABELS.en;

  return (
    <section id="ofertas" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,212,255,0.16),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.14),transparent_24%),linear-gradient(180deg,#090909_0%,#101010_100%)]" />
        <div className="dot-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-3xl mb-14 md:mb-18">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-[#CFCFD2]">
            <Sparkles size={14} className="text-[#00D4FF]" />
            {ui.badge}
          </span>
          <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-white">
            {ui.title}
          </h2>
          <p className="mt-3 text-base md:text-lg text-[#00D4FF] font-medium">{ui.authority}</p>
          <p className="mt-5 text-lg text-[#A1A1AA] leading-8">{ui.subtitle}</p>
        </div>

        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 px-6 py-4 mb-14 flex items-center gap-3">
          <span className="text-lg">✅</span>
          <p className="text-sm text-[#A1A1AA]">{ui.guarantee}</p>
        </div>

        <div className="mb-14">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-8">{ui.packagesTitle}</h3>
          <div className="grid gap-5 md:grid-cols-3">
          {offers.map((offer) => {
            const name = locale === 'es' ? offer.nameEs : offer.nameEn;
            const description = locale === 'es' ? offer.descriptionEs : offer.descriptionEn;
            const items = locale === 'es' ? offer.itemsEs : offer.itemsEn;
            const cta = locale === 'es' ? offer.ctaEs : offer.ctaEn;
            const forWho = locale === 'es' ? offer.forWhoEs : offer.forWhoEn;
            const priceNote = locale === 'es' ? offer.priceNoteEs : offer.priceNoteEn;
            const Icon = ICON_MAP[offer.icon] ?? Zap;

            return (
              <article
                key={offer.id}
                className={`relative rounded-3xl p-7 flex flex-col gap-5 transition-all duration-300 ${
                  offer.popular
                    ? 'border border-[#00D4FF]/50 bg-linear-to-br from-[#00D4FF]/8 via-[#8B5CF6]/6 to-[#121212] shadow-[0_0_40px_rgba(0,212,255,0.10)]'
                    : 'border border-white/10 bg-[#121212]/90 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]'
                }`}
              >
                {offer.popular && (
                  <div className="absolute -top-3.5 left-7">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-[#00D4FF] to-[#8B5CF6] text-background text-xs font-semibold shadow-[0_0_16px_rgba(0,212,255,0.5)]">
                      <Star size={11} className="fill-current" />
                      {ui.popularBadge}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                      offer.popular
                        ? 'bg-linear-to-br from-[#00D4FF]/30 to-[#8B5CF6]/30 border border-[#00D4FF]/30'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <Icon size={18} className={offer.popular ? 'text-[#00D4FF]' : 'text-[#A1A1AA]'} />
                    </div>
                    <h4 className="text-xl font-semibold text-white">{name}</h4>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-2xl font-bold ${offer.popular ? 'text-[#00D4FF]' : 'text-white'}`}>
                      {offer.price}
                    </p>
                    <p className="text-xs text-[#71717A] mt-0.5">{priceNote}</p>
                  </div>
                </div>

                <p className="text-[#A1A1AA] leading-7 text-sm">{description}</p>

                <ul className="space-y-2 flex-1">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[#D4D4D8] text-sm">
                      <CheckCircle2
                        size={16}
                        className={`mt-0.5 shrink-0 ${offer.popular ? 'text-[#00D4FF]' : 'text-[#52525B]'}`}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-[#71717A] border-t border-white/6 pt-4">{forWho}</p>

                <Link
                  href={`/${locale}?plan=${offer.planKey}#contacto`}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium text-sm transition-all duration-200 ${
                    offer.popular
                      ? 'bg-linear-to-r from-[#00D4FF] to-[#8B5CF6] text-background hover:shadow-[0_0_24px_rgba(0,212,255,0.35)]'
                      : 'border border-white/10 text-white hover:bg-white/5'
                  }`}
                >
                  {cta}
                  <ArrowUpRight size={15} />
                </Link>
              </article>
            );
          })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/8 bg-white/3 px-6 py-5 text-sm text-[#71717A] mb-10">
          {ui.note}
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#121212]/90 p-6 mb-10 overflow-hidden">
          <div className="max-w-2xl">
            <h3 className="text-xl font-semibold text-white">{ui.summaryTitle}</h3>
            <p className="mt-2 text-sm text-[#A1A1AA]">{ui.summaryOwnerNote}</p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-160 border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#A1A1AA]">{ui.summaryColPlan}</th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#A1A1AA]">{ui.summaryColAnnual}</th>
                  <th className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#A1A1AA]">{ui.summaryColIncludes}</th>
                </tr>
              </thead>
              <tbody>
                {ui.summaryRows.map((row, i) => (
                  <tr key={row.plan} className="align-top">
                    <td className={`${i < ui.summaryRows.length - 1 ? 'border-b border-white/5' : ''} px-4 py-4 text-sm text-white font-medium`}>{row.plan}</td>
                    <td className={`${i < ui.summaryRows.length - 1 ? 'border-b border-white/5' : ''} px-4 py-4 text-sm font-semibold text-[#00D4FF] whitespace-nowrap`}>{row.annual}</td>
                    <td className={`${i < ui.summaryRows.length - 1 ? 'border-b border-white/5' : ''} px-4 py-4 text-sm text-[#A1A1AA]`}>{row.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-6 border-t border-white/8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#71717A] mb-4">{ui.domainTableTitle}</p>
            <div className="overflow-x-auto">
              <table className="min-w-120 border-separate border-spacing-0 text-left">
                <thead>
                  <tr>
                    <th className="border-b border-white/8 px-4 py-2 text-xs font-semibold text-[#52525B]">{ui.domainColExt}</th>
                    <th className="border-b border-white/8 px-4 py-2 text-xs font-semibold text-[#52525B]">{ui.domainColCost}</th>
                    <th className="border-b border-white/8 px-4 py-2 text-xs font-semibold text-[#52525B]">{ui.domainColUse}</th>
                  </tr>
                </thead>
                <tbody>
                  {ui.domainRows.map((row, i) => (
                    <tr key={row.ext} className="align-middle">
                      <td className={`${i < ui.domainRows.length - 1 ? 'border-b border-white/5' : ''} px-4 py-3 text-sm font-mono font-medium text-[#D4D4D8]`}>{row.ext}</td>
                      <td className={`${i < ui.domainRows.length - 1 ? 'border-b border-white/5' : ''} px-4 py-3 text-sm text-white whitespace-nowrap`}>{row.cost}</td>
                      <td className={`${i < ui.domainRows.length - 1 ? 'border-b border-white/5' : ''} px-4 py-3 text-sm text-[#71717A]`}>{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-[#52525B]">{ui.domainNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
