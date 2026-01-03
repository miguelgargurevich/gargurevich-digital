import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
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
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A0A0A] text-white`}
      >
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <Header />
            <main className="relative">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
