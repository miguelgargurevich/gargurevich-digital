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
      ? "Gargurevich Digital | Premium Web Development"
      : "Gargurevich Digital | Desarrollo Web Premium",
    description: isEnglish
      ? "We transform ideas into high-impact digital solutions. Modern web development with React, Next.js, AI and the latest technologies. Landing pages, web apps, e-commerce and more."
      : "Transformamos ideas en soluciones digitales de alto impacto. Desarrollo web moderno con React, Next.js, IA y las últimas tecnologías. Landing pages, apps web, e-commerce y más.",
    keywords: isEnglish
      ? ["web development", "next.js", "react", "typescript", "landing page", "e-commerce", "web app", "AI", "Lima", "Peru"]
      : ["desarrollo web", "next.js", "react", "typescript", "landing page", "e-commerce", "app web", "IA", "Lima", "Perú"],
    authors: [{ name: "Miguel Gargurevich" }],
    creator: "Gargurevich Digital",
    openGraph: {
      type: "website",
      locale: isEnglish ? "en_US" : "es_PE",
      url: "https://gargurevich.digital",
      siteName: "Gargurevich Digital",
      title: isEnglish 
        ? "Gargurevich Digital | Premium Web Development"
        : "Gargurevich Digital | Desarrollo Web Premium",
      description: isEnglish
        ? "We transform ideas into high-impact digital solutions. Modern web development with React, Next.js, AI and the latest technologies."
        : "Transformamos ideas en soluciones digitales de alto impacto. Desarrollo web moderno con React, Next.js, IA y las últimas tecnologías.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isEnglish 
            ? "Gargurevich Digital - Premium Web Development"
            : "Gargurevich Digital - Desarrollo Web Premium",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isEnglish 
        ? "Gargurevich Digital | Premium Web Development"
        : "Gargurevich Digital | Desarrollo Web Premium",
      description: isEnglish
        ? "We transform ideas into high-impact digital solutions."
        : "Transformamos ideas en soluciones digitales de alto impacto.",
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
      </div>
    </NextIntlClientProvider>
  );
}
