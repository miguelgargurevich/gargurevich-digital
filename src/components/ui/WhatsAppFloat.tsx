'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Suspense } from 'react';

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
      : 'Hola, vengo de la web. ¿Cómo puedo ayudarte?';
  } else {
    message = planName
      ? `Hi, I came from the website. I want information about the plan ${planName}`
      : 'Hi, I came from the website. How can I help you?';
  }

  const encodedMessage = encodeURIComponent(message);
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return (
    <Link
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 hover:scale-110"
      aria-label="WhatsApp"
      title={message}
    >
      {/* WhatsApp Icon */}
      <svg
        className="w-7 h-7"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.364a9.864 9.864 0 001.512 5.514c.33.531.659 1.013 1.003 1.437l.396.45 3.702.914-.239-.376a9.9 9.9 0 005.1-5.098c.344-.649.641-1.35.868-2.087.059-.183.122-.371.19-.565l.101-.303-.618-.118A9.88 9.88 0 0011.89 6.977M20.5 3.139a10 10 0 00-14.147-1.595 10.002 10.002 0 1014.147 14.147A9.975 9.975 0 0020.5 3.139"/>
      </svg>
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
