import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale} = await params;
  
  const isEnglish = locale === 'en';
  
  return {
    metadataBase: new URL("https://gargurevich.digital"),
    title: isEnglish 
      ? "Gargurevich Digital | AI Automation Platform for SMBs"
      : "Gargurevich Digital | Plataforma de IA y Automatización para Negocios",
    description: isEnglish
      ? "We build intelligent systems that help SMBs sell more, automate customer service, and streamline operations with AI, web infrastructure, and scalable workflows."
      : "Creamos sistemas inteligentes para que negocios vendan más, automaticen su atención y operen mejor con IA, infraestructura web y automatización escalable.",
    keywords: isEnglish
      ? ["AI automation for SMB", "AI agent for WhatsApp", "business process automation", "digital transformation for small business", "sales automation", "customer support automation", "Lima", "Peru"]
      : ["automatización con IA para negocios", "agente IA para WhatsApp", "automatización de procesos empresariales", "transformación digital para pymes", "automatización comercial", "atención al cliente automatizada", "Lima", "Perú"],
    authors: [{ name: "Miguel Gargurevich" }],
    creator: "Gargurevich Digital",
    openGraph: {
      type: "website",
      locale: isEnglish ? "en_US" : "es_PE",
      url: "https://gargurevich.digital",
      siteName: "Gargurevich Digital",
      title: isEnglish 
        ? "Gargurevich Digital | AI Automation Platform for SMBs"
        : "Gargurevich Digital | Plataforma de IA y Automatización para Negocios",
      description: isEnglish
        ? "AI-powered digital systems for sales, customer service, and operations in growing businesses."
        : "Sistemas digitales con IA para ventas, atención al cliente y operación en empresas en crecimiento.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isEnglish 
            ? "Gargurevich Digital - AI Automation Platform"
            : "Gargurevich Digital - Plataforma de IA y Automatización",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isEnglish 
        ? "Gargurevich Digital | AI Automation Platform for SMBs"
        : "Gargurevich Digital | Plataforma de IA y Automatización para Negocios",
      description: isEnglish
        ? "Intelligent systems for sales, support, and business operations."
        : "Sistemas inteligentes para ventas, atención y operación empresarial.",
      images: ["/og-image.png"],
      creator: "@miguelgargurev",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  type Locale = (typeof routing.locales)[number];
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({locale});
  
  // Get translations for server components
  const t = await getTranslations({locale, namespace: 'nav'});
  const navTranslations = {
    services: t('services'),
    portfolio: t('portfolio'),
    technologies: t('technologies'),
    process: t('process'),
    contact: t('contact'),
    offers: t('offers'),
    startProject: t('startProject'),
  };

  // Get footer translations
  const footerT = await getTranslations({locale, namespace: 'footer'});
  const footerMessages = (messages as Record<string, unknown>).footer as Record<string, unknown>;
  const footerLinks = footerMessages.links as Record<string, Array<{ name: string; href: string }>>;
  
  const footerTranslations = {
    description: footerT('description'),
    sections: {
      services: footerT('sections.services'),
      company: footerT('sections.company'),
    },
    newsletter: {
      title: footerT('newsletter.title'),
      description: footerT('newsletter.description'),
      placeholder: footerT('newsletter.placeholder'),
      button: footerT('newsletter.button'),
    },
    copyright: footerT('copyright'),
    madeIn: footerT('madeIn'),
    links: {
      services: footerLinks.services,
      company: footerLinks.company,
      legal: footerLinks.legal,
    },
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-white min-h-screen`}
      >
        <Header translations={navTranslations} locale={locale} />
        <SmoothScrollProvider>
          <main className="relative">{children}</main>
        </SmoothScrollProvider>
        <Footer translations={footerTranslations} locale={locale} />
        <WhatsAppFloat />
      </div>
    </NextIntlClientProvider>
  );
}
