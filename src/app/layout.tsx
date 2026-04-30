import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gargurevich.digital"),
  title: "Gargurevich Digital | Desarrollo Web Premium",
  description: "Transformamos ideas en soluciones digitales de alto impacto. Desarrollo web moderno con React, Next.js, IA y las últimas tecnologías. Landing pages, apps web, e-commerce y más.",
  keywords: ["desarrollo web", "next.js", "react", "typescript", "landing page", "e-commerce", "app web", "IA", "Lima", "Perú"],
  authors: [{ name: "Miguel Gargurevich" }],
  creator: "Gargurevich Digital",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://gargurevich.digital",
    siteName: "Gargurevich Digital",
    title: "Gargurevich Digital | Desarrollo Web Premium",
    description: "Transformamos ideas en soluciones digitales de alto impacto. Desarrollo web moderno con React, Next.js, IA y las últimas tecnologías.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gargurevich Digital - Desarrollo Web Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gargurevich Digital | Desarrollo Web Premium",
    description: "Transformamos ideas en soluciones digitales de alto impacto.",
    images: ["/og-image.png"],
    creator: "@miguelgargurev",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-white`}
      >
        {children}
      </body>
    </html>
  );
}
