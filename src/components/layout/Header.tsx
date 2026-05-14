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
  const [activeSection, setActiveSection] = useState<string>('servicios');
  const currentLocale = locale || 'en';
  const localizedHome = `/${currentLocale}`;
  const sectionIds = ['servicios', 'ofertas', 'proceso', 'tech', 'portafolio', 'contacto'];

  const navLinks = [
    { name: t.services, href: `${localizedHome}#servicios`, sectionId: 'servicios' },
    { name: t.offers, href: `${localizedHome}#ofertas`, sectionId: 'ofertas' },
    { name: t.process, href: `${localizedHome}#proceso`, sectionId: 'proceso' },
    { name: t.technologies, href: `${localizedHome}#tech`, sectionId: 'tech' },
    { name: t.portfolio, href: `${localizedHome}#portafolio`, sectionId: 'portafolio' },
    { name: t.contact, href: `${localizedHome}#contacto`, sectionId: 'contacto' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const isHome = window.location.pathname === localizedHome;
    if (!isHome) return;

    const updateFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: null,
        threshold: [0.15, 0.35, 0.6],
        rootMargin: '-30% 0px -50% 0px',
      }
    );

    const observedIds = new Set<string>();

    const observeAvailableSections = () => {
      sectionIds.forEach((id) => {
        if (observedIds.has(id)) return;
        const section = document.getElementById(id);
        if (!section) return;
        observer.observe(section);
        observedIds.add(id);
      });
    };

    observeAvailableSections();

    const mutationObserver = new MutationObserver(() => {
      observeAvailableSections();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      window.removeEventListener('hashchange', updateFromHash);
    };
  }, [localizedHome]);

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
                className={`relative transition-colors duration-300 text-sm font-medium link-underline ${activeSection === link.sectionId ? 'text-white' : 'text-[#A1A1AA] hover:text-white'}`}
                aria-current={activeSection === link.sectionId ? 'page' : undefined}
                onClick={() => setActiveSection(link.sectionId)}
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
                    onClick={() => {
                      setActiveSection(link.sectionId);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-3xl font-semibold transition-all duration-300 ${activeSection === link.sectionId ? 'gradient-text' : 'text-white hover:gradient-text'}`}
                    aria-current={activeSection === link.sectionId ? 'page' : undefined}
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
