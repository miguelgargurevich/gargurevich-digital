'use client';

import { motion } from 'framer-motion';
import { Code2, Zap, Cpu } from 'lucide-react';

export default function AuthoritySection() {
  const skills = [
    { icon: Code2, label: 'Backend + Frontend', description: '+5 años en código real' },
    { icon: Cpu, label: 'Bases de Datos', description: 'PostgreSQL, Prisma, arquitectura' },
    { icon: Zap, label: 'Cloud & DevOps', description: 'Vercel, Azure, Docker' },
  ];

  return (
    <section className="relative py-20 md:py-32 px-6 sm:px-8 md:px-12 lg:px-16 bg-gradient-to-b from-background to-[#0A0A0A]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-sm text-[#00D4FF] font-semibold uppercase tracking-wider mb-4">
            Acerca de mí
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            No soy un freelancer con plantillas
          </h2>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#00D4FF]/10 to-[#8B5CF6]/10 border border-[#00D4FF]/20 rounded-lg p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          <p className="text-lg md:text-xl text-[#E4E4E7] leading-relaxed">
            Soy <span className="text-[#00D4FF] font-semibold">desarrollador con +5 años</span> en sistemas reales: <span className="text-[#8B5CF6]">backend, frontend, bases de datos y despliegue en la nube</span>. 
            <br className="hidden md:block" />
            <br />
            Tu web no será un template de WordPress. Será una{" "}
            <span className="text-[#10B981] font-semibold">herramienta hecha para vender</span>, construida con tecnología moderna y optimizada para conversión.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.label}
              className="p-6 rounded-lg border border-white/10 hover:border-[#00D4FF]/50 transition-colors bg-white/5 hover:bg-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <skill.icon className="w-8 h-8 text-[#00D4FF] mb-4" />
              <h3 className="font-semibold text-white mb-2">{skill.label}</h3>
              <p className="text-sm text-[#A1A1AA]">{skill.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
