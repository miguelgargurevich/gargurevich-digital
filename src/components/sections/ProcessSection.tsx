'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Cpu, PlayCircle } from 'lucide-react';



export default function ProcessSection() {
  return (
    <section id="proceso" className="relative py-24 md:py-30 overflow-hidden">
      <div className="absolute inset-0 bg-[#0D0D0D]">
        <div className="absolute top-0 left-0 w-88 h-88 bg-[#00D4FF]/7 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-88 h-88 bg-[#10B981]/8 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Puedes agregar aquí contenido visual, testimonios, logos, etc. */}
      </div>
    </section>
  );
}
