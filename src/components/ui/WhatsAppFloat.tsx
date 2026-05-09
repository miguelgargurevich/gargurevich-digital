'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Suspense } from 'react';
import { MessageCircle } from 'lucide-react';

type PlanKeyEs = {
  [key: string]: string;
};

const PLANS_NAMES_ES: PlanKeyEs = {
  'mi-negocio-en-google': 'Mi Negocio en Google',
  'landing-whatsapp': 'Landing que vende por WhatsApp',
  'web-que-yo-edito': 'Web que yo mismo edito',
  'sueno-digital-completo': 'Sueño Digital Completo',
  'mantenimiento-web': 'Mantenimiento Web Perú',
};

const PLANS_NAMES_EN: PlanKeyEs = {
  'mi-negocio-en-google': 'My Business on Google',
  'landing-whatsapp': 'WhatsApp Sales Landing',
  'web-que-yo-edito': 'Website I Can Edit',
  'sueno-digital-completo': 'Complete Digital Dream',
  'mantenimiento-web': 'Website Maintenance Peru',
};

const WHATSAPP_NUMBER = '51966918363'; // WhatsApp number without + or spaces

function WhatsAppFloatContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();

  const planKey = searchParams.get('plan');
  const plansDict = locale === 'es' ? PLANS_NAMES_ES : PLANS_NAMES_EN;
  const planName = planKey ? plansDict[planKey] : null;

  let message = '';
  if (locale === 'es') {
    message = planName
      ? `Hola, vengo de la web. Quiero información del plan ${planName}`
      : 'Hola, vengo de la web. Quiero información';
  } else {
    message = planName
      ? `Hi, I came from the website. I want information about the plan ${planName}`
      : 'Hi, I came from the website. I want information';
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110"
      aria-label="WhatsApp"
      title={message}
    >
      <MessageCircle className="w-7 h-7" strokeWidth={2.2} />
    </Link>
  );
}

export function WhatsAppFloat() {
  return (
    <Suspense fallback={null}>
      <WhatsAppFloatContent />
    </Suspense>
  );
}
