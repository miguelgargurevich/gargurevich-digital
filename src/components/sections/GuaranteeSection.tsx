import { ShieldCheck } from 'lucide-react';

export default function GuaranteeSection() {
  return (
    <section className="relative py-10 md:py-14 px-4 md:px-8 bg-green-50 border-l-4 border-green-500 flex items-center gap-4 rounded-md shadow-sm mt-8 mb-8">
      <div className="flex-shrink-0">
        <ShieldCheck className="text-green-600" size={40} />
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-1">Garantía 30 días</h3>
        <p className="text-gray-800 text-base md:text-lg">30 días para probar tu Agente IA sin riesgo. Si no responde bien, lo reentrenamos gratis. Si aún así no te sirve, cancelas y no pagas el siguiente mes.</p>
      </div>
    </section>
  );
}
