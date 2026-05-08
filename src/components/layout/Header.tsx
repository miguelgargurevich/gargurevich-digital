'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Settings } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';
import LanguageSwitcher from '../ui/LanguageSwitcher';

interface HeaderProps {
  translations?: {
    services: string;
    portfolio: string;
    technologies: string;
    process: string;
    contact: string;
    offers: string;
    startProject: string;
  };
  locale?: string;
}

export default function Header({ translations, locale }: HeaderProps) {
  const t = translations || {
    services: 'Services',
    portfolio: 'Portfolio',
    technologies: 'Technologies',
    process: 'Process',
    contact: 'Contact',
    offers: 'Offers',
    startProject: 'Start Project',
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentLocale = locale || 'en';
  const localizedHome = `/${currentLocale}`;

  const navLinks = [
    { name: t.services, href: `${localizedHome}#servicios` },
    { name: t.portfolio, href: `${localizedHome}#portafolio` },
    { name: t.technologies, href: `${localizedHome}#tech` },
    { name: t.process, href: `${localizedHome}#proceso` },
    { name: t.offers, href: `${localizedHome}/ofertas` },
    { name: t.contact, href: `${localizedHome}#contacto` },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'py-6'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-350 mx-auto px-8 sm:px-10 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <Link href={localizedHome} className="relative z-10">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#00D4FF] to-[#8B5CF6] flex items-center justify-center">
                <span className="text-white">G</span>
                <span className="text-white">D</span>
              </div>
              <span className="text-xl font-semibold hidden sm:block">
                <span className="text-white">Gargurevich</span>
                <span className="gradient-text">Digital</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-[#A1A1AA] hover:text-white transition-colors duration-300 text-sm font-medium link-underline"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className="text-[#71717A] hover:text-white transition-colors duration-300"
              aria-label="CMS"
              title="CMS"
            >
              <Settings size={16} />
            </Link>
          </nav>

          {/* CTA Button & Language Switcher */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher locale={locale} />
            <MagneticButton
              href={`${localizedHome}#contacto`}
              variant="primary"
              size="sm"
              icon={<ArrowUpRight size={16} />}
            >
              {t.startProject}
            </MagneticButton>
          </div>

          {/* Mobile Menu Button & Language Switcher */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher locale={locale} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-10 p-2"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <X className="text-white" size={24} />
                ) : (
                  <Menu className="text-white" size={24} />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              className="relative h-full flex flex-col items-center justify-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-semibold text-white hover:gradient-text transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-8"
              >
                <MagneticButton
                  href={`${localizedHome}#contacto`}
                  variant="primary"
                  size="lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.startProject}
                </MagneticButton>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
