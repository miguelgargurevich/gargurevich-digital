'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight, Heart } from 'lucide-react';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterTranslations {
  description: string;
  sections: {
    services: string;
    company: string;
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    button: string;
  };
  copyright: string;
  madeIn: string;
  links: {
    services: FooterLink[];
    company: FooterLink[];
    legal: FooterLink[];
  };
}

interface FooterProps {
  translations: FooterTranslations;
  locale: string;
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/miguelgargurevich' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/miguelgargurevich' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/miguelgargurev' },
  { name: 'Email', icon: Mail, href: 'mailto:contacto@gargurevichdigital.com' },
];

function resolveLocalizedHref(href: string, locale: string) {
  if (!href.startsWith('/')) {
    return href;
  }

  if (href === '/') {
    return `/${locale}`;
  }

  return `/${locale}${href}`;
}

export default function Footer({ translations: t, locale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-white/10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-linear-to-t from-[#00D4FF]/5 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-350 mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Link href={`/${locale}`} className="inline-block mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#00D4FF] to-[#8B5CF6] flex items-center justify-center">
                  <span className="text-white">G</span>
                  <span className="text-white">D</span>
                </div>
                <span className="text-xl font-semibold">
                  <span className="text-white">Gargurevich</span>
                  <span className="gradient-text">Digital</span>
                </span>
              </div>
            </Link>

            <p className="text-[#A1A1AA] text-sm mb-6 max-w-xs">
              {t.description}
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-white/10 hover:border-[#00D4FF]/30 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4">{t.sections.services}</h4>
            <ul className="space-y-3">
              {t.links.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#A1A1AA] hover:text-white text-sm transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4">{t.sections.company}</h4>
            <ul className="space-y-3">
              {t.links.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#A1A1AA] hover:text-white text-sm transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-semibold mb-4">{t.newsletter.title}</h4>
            <p className="text-[#A1A1AA] text-sm mb-4">
              {t.newsletter.description}
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t.newsletter.placeholder}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#71717A] text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-colors duration-300"
              />
              <motion.button
                type="submit"
                className="px-4 py-2 bg-linear-to-r from-[#00D4FF] to-[#8B5CF6] rounded-lg text-background font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={t.newsletter.button}
              >
                <ArrowUpRight size={18} />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-[#71717A] text-sm flex items-center gap-1">
            {t.copyright.replace('{year}', String(currentYear))}
            <Heart size={14} className="text-[#EF4444] fill-current" />
            {t.madeIn}
          </p>

          <div className="flex gap-6">
            {t.links.legal.map((link) => (
              <Link
                key={link.name}
                  href={resolveLocalizedHref(link.href, locale)}
                className="text-[#71717A] hover:text-white text-sm transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
