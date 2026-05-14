'use client';

import { useEffect, useState } from 'react';
import { Zap, Star, Sparkles, Loader2 } from 'lucide-react';

type Locale = 'es' | 'en';

const ICON_MAP: Record<string, typeof Zap> = {
  zap: Zap,
  star: Star,
  sparkles: Sparkles,
};

interface Offer {
  id: string;
  icon: string;
  nameEs: string;
  nameEn: string;
  price: string;
  descriptionEs: string;
  descriptionEn: string;
  itemsEs: string[];
  itemsEn: string[];
  ctaEs: string;
  ctaEn: string;
  forWhoEs: string;
  forWhoEn: string;
  order: number;
}

const HEADINGS: Record<Locale, string> = {
  es: '4 Capas de Crecimiento',
  en: '4 Growth Layers',
};

export default function LayersSection({ locale = 'es' }: { locale?: Locale }) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/offers/published')
      .then((r) => r.json())
      .then((data) => {
        setOffers(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="servicios" className="scroll-mt-28 relative py-24 md:py-32 bg-linear-to-b from-[#0D0D0D] via-[#10151A] to-[#0D0D0D] overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center h-64">
          <Loader2 size={24} className="text-[#00D4FF] animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section id="servicios" className="scroll-mt-28 relative py-24 md:py-32 bg-linear-to-b from-[#0D0D0D] via-[#10151A] to-[#0D0D0D] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-14">
          {HEADINGS[locale]}
        </h2>
        <div className={`grid gap-8 ${offers.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
          {offers.slice(0, 4).map((offer) => {
            const Icon = ICON_MAP[offer.icon] || Zap;
            const name = locale === 'es' ? offer.nameEs : offer.nameEn;
            const description = locale === 'es' ? offer.descriptionEs : offer.descriptionEn;
            const items = locale === 'es' ? offer.itemsEs : offer.itemsEn;
            const cta = locale === 'es' ? offer.ctaEs : offer.ctaEn;

            return (
              <div
                key={offer.id}
                className="rounded-3xl border border-white/10 bg-[#16181A]/80 p-10 flex flex-col items-center text-center shadow-lg hover:border-[#00D4FF]/40 transition-all duration-200"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-linear-to-br from-[#00D4FF]/20 to-[#10B981]/20 mb-5">
                  <Icon size={28} className="text-[#00D4FF]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{name}</h3>
                <p className="text-[#A1A1AA] text-sm mb-6">{description}</p>
                <ul className="text-[#A1A1AA] text-sm mb-6 space-y-2 text-left max-w-xs mx-auto">
                  {items.slice(0, 4).map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#00D4FF] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contacto"
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 text-white px-5 py-3 text-sm font-medium transition-all duration-200 hover:border-[#00D4FF]/55 hover:bg-[#00D4FF]/10"
                >
                  {cta}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
