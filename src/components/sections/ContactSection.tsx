'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';
import { LineReveal } from '../ui/TextReveal';

interface ContactOverrides {
  email?: string;
  whatsapp?: string;
  location?: string;
}

interface ContactOfferOption {
  planKey: string;
  nameEs: string;
  nameEn: string;
  price: string;
  descriptionEs: string;
  descriptionEn: string;
}

function normalizePlanKey(plan: string): string {
  const value = plan.trim().toLowerCase();

  const aliases: Record<string, string> = {
    'presencia-digital-ia': 'capa-1-presencia-digital',
    'asistente-ia-experto': 'capa-2-agente-ia',
    'automatizacion-inteligente': 'capa-3-automatizacion',
    'sueno-digital-completo': 'capa-4-memoria-empresarial',
  };

  return aliases[value] ?? value;
}

function getTierLabel(planKey: string, locale: string, fallback: string): string {
  const labels: Record<string, { es: string; en: string }> = {
    'capa-1-presencia-digital': {
      es: 'Starter — Presencia Digital',
      en: 'Starter — Digital Presence',
    },
    'capa-2-agente-ia': {
      es: 'Growth — Agente IA',
      en: 'Growth — AI Agent',
    },
    'capa-3-automatizacion': {
      es: 'Scale — Automatizacion Inteligente',
      en: 'Scale — Smart Automation',
    },
    'capa-4-memoria-empresarial': {
      es: 'Signature — Memoria Empresarial',
      en: 'Signature — Enterprise Memory',
    },
  };

  const lang = locale === 'es' ? 'es' : 'en';
  return labels[planKey]?.[lang] ?? fallback;
}

function splitTierLabel(label: string): { tier: string; name: string } {
  const [tier, name] = label.split('—').map((part) => part.trim());
  return {
    tier: tier ?? label,
    name: name ?? '',
  };
}

export default function ContactSection({
  overrides,
  offers = [],
}: {
  overrides?: ContactOverrides;
  offers?: ContactOfferOption[];
}) {
  const t = useTranslations('contact');
  const locale = useLocale();
  const emailValue = overrides?.email || t('info.email.value');
  const whatsappValue = overrides?.whatsapp || t('info.whatsapp.value');
  const locationValue = overrides?.location || t('info.location.value');

  const projectTypes = useMemo(() => ([
    ...offers
      .filter((offer) => offer.planKey.startsWith('capa-'))
      .map((offer) => ({
        value: offer.planKey,
        label: getTierLabel(offer.planKey, locale, locale === 'es' ? offer.nameEs : offer.nameEn),
        price: offer.price,
        description: locale === 'es' ? offer.descriptionEs : offer.descriptionEn,
      })),
    locale === 'es'
      ? { value: 'otro', label: 'Otro / No lo tengo claro aún', price: null, description: '' }
      : { value: 'other', label: 'Other / Not sure yet', price: null, description: '' },
  ]), [offers, locale]);
  
  const contactInfo = [
    {
      icon: Mail,
      label: t('info.email.label'),
      value: emailValue,
      href: `mailto:${emailValue}`,
    },
    {
      icon: Phone,
      label: t('info.whatsapp.label'),
      value: whatsappValue,
      href: `https://wa.me/${whatsappValue.replace(/\D/g, '')}`,
    },
    {
      icon: MapPin,
      label: t('info.location.label'),
      value: locationValue,
      href: '#',
    },
  ];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const planQuery = searchParams.get('plan');
  const selectedProjectType = projectTypes.find((p) => p.value === formData.projectType);
  const selectedTierParts = selectedProjectType ? splitTierLabel(selectedProjectType.label) : null;

  // Pre-fill plan from URL query param — reactive to URL changes within same page
  useEffect(() => {
    if (!planQuery) return;

    const normalizedPlan = normalizePlanKey(planQuery);
    const exists = projectTypes.some((option) => option.value === normalizedPlan);
    if (!exists) return;

    setFormData((prev) => ({
      ...prev,
      projectType: prev.projectType === normalizedPlan ? prev.projectType : normalizedPlan,
    }));
  }, [planQuery, projectTypes]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelectOption = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, projectType: value }));
    setIsSelectOpen(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      setIsSubmitted(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          projectType: '',
          message: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(
        locale === 'es'
          ? 'Hubo un error al enviar el mensaje. Intenta nuevamente.'
          : 'There was an error sending your message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contacto" className="scroll-mt-28 relative py-20 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        <div className="grid-pattern absolute inset-0" />
        <div className="absolute top-1/3 right-0 w-150 h-150 bg-linear-to-l from-[#00D4FF]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-150 h-150 bg-linear-to-r from-[#8B5CF6]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-350 mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5"
          >
            <MessageSquare className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-sm text-[#A1A1AA]">{t('badge')}</span>
          </motion.div>

          <LineReveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">{t('title')} </span>
              <span className="gradient-text">{t('titleHighlight')}</span>
            </h2>
          </LineReveal>

          <motion.p
            className="text-[#A1A1AA] text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">
                Información de Contacto
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.href}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-[#141414] border border-white/10 hover:border-[#00D4FF]/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-linear-to-r from-[#00D4FF]/20 to-[#8B5CF6]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <info.icon size={20} className="text-[#00D4FF]" />
                    </div>
                    <div>
                      <div className="text-xs text-[#71717A] mb-1">{info.label}</div>
                      <div className="text-white group-hover:text-[#00D4FF] transition-colors duration-300">
                        {info.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick response time */}
            <div className="p-6 rounded-xl bg-linear-to-br from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-sm font-medium text-white">
                  {locale === 'es' ? 'Respuesta rápida por WhatsApp' : 'Fast WhatsApp response'}
                </span>
              </div>
              <p className="text-sm text-[#A1A1AA]">
                {locale === 'es'
                  ? 'Te orientamos sobre el mejor plan para tu negocio en pocos minutos.'
                  : 'We help you choose the best plan for your business in minutes.'}
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitError && (
                <div className="rounded-xl border border-[#EF444440] bg-[#EF444418] px-4 py-3 text-sm text-[#EF4444]">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm text-[#A1A1AA] mb-2">
                    {t('form.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-[#71717A] focus:outline-none focus:border-[#00D4FF]/50 transition-colors duration-300"
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-[#A1A1AA] mb-2">
                    {t('form.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-[#71717A] focus:outline-none focus:border-[#00D4FF]/50 transition-colors duration-300"
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm text-[#A1A1AA] mb-2">
                    {t('form.company')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-[#71717A] focus:outline-none focus:border-[#00D4FF]/50 transition-colors duration-300"
                    placeholder={t('form.companyPlaceholder')}
                  />
                </div>

                {/* Project Type — Custom Dropdown */}
                <div>
                  <label className="block text-sm text-[#A1A1AA] mb-2">
                    {t('form.projectType')} *
                  </label>
                  <div className="relative" ref={selectRef}>
                    {/* Hidden native input for form validation */}
                    <input type="hidden" name="projectType" value={formData.projectType} required />

                    {/* Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsSelectOpen(prev => !prev)}
                      className={`w-full px-4 py-3 rounded-xl bg-[#141414] border text-left flex items-center justify-between gap-2 transition-all duration-200 focus:outline-none ${
                        isSelectOpen
                          ? 'border-[#00D4FF]/60 shadow-[0_0_0_3px_rgba(0,212,255,0.08)]'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {formData.projectType ? (
                        <span className="text-sm text-white">
                          {selectedTierParts?.tier || selectedProjectType?.label}
                        </span>
                      ) : (
                        <span className="text-[#71717A] text-sm">{t('form.projectTypePlaceholder')}</span>
                      )}
                      <motion.span
                        animate={{ rotate: isSelectOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ChevronDown size={16} className="text-[#71717A]" />
                      </motion.span>
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {isSelectOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-30 top-full mt-2 w-full rounded-xl bg-[#1C1C1C] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden max-h-72 overflow-y-auto"
                        >
                          {projectTypes.map((option, i) => {
                            const isSelected = formData.projectType === option.value;
                            const tierParts = splitTierLabel(option.label);
                            return (
                              <li key={option.value}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectOption(option.value)}
                                  className={`w-full px-4 py-3 flex flex-col gap-2 text-left transition-colors duration-150 ${
                                    i !== 0 ? 'border-t border-white/6' : ''
                                  } ${
                                    isSelected
                                      ? 'bg-[#00D4FF]/10'
                                      : 'hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <p className={`text-sm font-medium ${
                                      isSelected ? 'text-[#00D4FF]' : 'text-white'
                                    }`}>
                                      <span className="inline-block px-2 py-0.5 rounded-full border border-[#00D4FF]/35 bg-[#00D4FF]/10 text-[#67E8F9] text-[10px] tracking-[0.12em] uppercase align-middle mr-2">
                                        {tierParts.tier}
                                      </span>
                                      <span className="align-middle">{tierParts.name}</span>
                                    </p>
                                    {isSelected && (
                                      <CheckCircle size={14} className="text-[#00D4FF] shrink-0" />
                                    )}
                                  </div>
                                  {option.price && (
                                    <span className={`text-xs font-semibold ${
                                      isSelected ? 'text-[#00D4FF]' : 'text-[#A1A1AA]'
                                    }`}>
                                      {option.price}
                                    </span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">
                  {t('form.message')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-white/10 text-white placeholder-[#71717A] focus:outline-none focus:border-[#00D4FF]/50 transition-colors duration-300 resize-none"
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  isSubmitted
                    ? 'bg-[#10B981] text-white'
                    : 'bg-linear-to-r from-[#00D4FF] to-[#8B5CF6] text-background hover:shadow-[0_0_40px_rgba(0,212,255,0.3)]'
                }`}
                whileHover={!isSubmitting && !isSubmitted ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting && !isSubmitted ? { scale: 0.98 } : {}}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle size={20} />
                    {t('form.success')}
                  </>
                ) : isSubmitting ? (
                  <motion.div
                    className="w-6 h-6 border-2 border-background border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>
                    {t('form.submit')}
                    <Send size={18} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
