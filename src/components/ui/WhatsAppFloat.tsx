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
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110"
      aria-label="WhatsApp"
      title={message}
    >
          {/* WhatsApp Icon - Official Logo */}
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2.05 22l6.03-1.92C10.05 21.61 10.98 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-.87 0-1.72-.17-2.5-.48l-.18-.08-1.86.59.61-1.8-.1-.19c-.31-.71-.48-1.49-.48-2.3 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.64-12.03c-.25-.12-1.47-.73-1.69-.81-.23-.09-.39-.09-.56.09-.17.19-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-.62-.74-.41-1.23-.91-1.37-1.15-.13-.25-.01-.38.1-.5.1-.1.23-.26.35-.39.1-.13.13-.22.2-.36.07-.14.04-.27-.02-.38-.07-.11-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43-.15 0-.31 0-.48 0-.16 0-.43.06-.65.3-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.82 2.78 4.41 3.9.62.27 1.1.43 1.48.55.63.2 1.2.17 1.65.1.5-.07 1.54-.63 1.76-1.23.22-.6.22-1.12.15-1.23-.06-.12-.23-.19-.48-.31z" />
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
