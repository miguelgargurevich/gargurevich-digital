'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { QuoteData } from '@/types/quote';
import { ArrowLeft, FileText, CheckCircle, Printer, Copy } from 'lucide-react';

export default function QuoteGeneratorPage() {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'es';

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = () => {
    const text = `
${exampleQuoteData.projectTitle}

Cliente: ${exampleQuoteData.clientCompany}
Email: ${exampleQuoteData.clientEmail}

${exampleQuoteData.projectDescription}

CARACTERÍSTICAS:
${exampleQuoteData.features.map(f => `
${f.icon} ${f.title}
${f.description}
${f.items?.map(item => `  • ${item}`).join('\n')}
`).join('\n')}

INVERSIÓN: S/ ${exampleQuoteData.price.toLocaleString('es-PE')}
Pago único - Sin costos ocultos

INCLUYE:
${exampleQuoteData.includes.map(i => `✓ ${i}`).join('\n')}

BENEFICIOS:
${exampleQuoteData.notes?.map(n => `• ${n}`).join('\n')}
    `;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Datos de ejemplo basados en tu estructura
  const exampleQuoteData: QuoteData = {
    clientName: 'Soluciones Integrales JS',
    clientEmail: 'contacto@solucionesjs.com',
    clientCompany: 'Soluciones Integrales JS',
    projectTitle: '🚀 Propuesta Web Corporativa Moderna',
    projectDescription: 'Hola 👋 Te comparto la propuesta para la web corporativa moderna y autoadministrable que estuvimos conversando.\n\nLa idea no es solo tener una "landing bonita", sino una plataforma profesional que te permita mostrar tus proyectos, actualizar contenido tú mismo y proyectar una imagen sólida y moderna de la empresa.',
    features: [
      {
        icon: '🎨',
        title: 'Diseño moderno y profesional',
        description: 'Una experiencia visual impecable que genera confianza',
        items: [
          'Diseño premium, alineado al rubro industrial',
          'Web rápida, moderna y responsive (se ve perfecta en celular, tablet y PC)',
          'Modo oscuro / claro',
          'Animaciones suaves que dan sensación de calidad y tecnología',
          'Imagen corporativa sólida que genera confianza en clientes',
        ],
      },
      {
        icon: '📂',
        title: 'Gestión de Proyectos (CMS incluido)',
        description: 'Tendrás un panel privado de administración, donde podrás:',
        items: [
          '➕ Crear nuevos proyectos',
          '✏️ Editar proyectos existentes',
          '🗑️ Eliminar proyectos fácilmente',
          '📸 Subir múltiples imágenes por proyecto',
          '🎬 Agregar videos (YouTube / Vimeo)',
          '⭐ Marcar proyectos destacados',
          '👁️ Mostrar u ocultar proyectos cuando quieras',
          '👉 No dependes de nadie para actualizar tu web',
        ],
      },
      {
        icon: '📧',
        title: 'Contacto y comunicación',
        description: 'Sistema de contacto completo y funcional',
        items: [
          'Formulario de contacto funcional',
          'Los mensajes llegan directo a tu correo',
          'Validaciones para evitar errores o spam',
        ],
      },
      {
        icon: '⚡',
        title: 'Rendimiento y posicionamiento',
        description: 'Tu web optimizada para el éxito',
        items: [
          'Web ultra rápida',
          'Optimizada para Google (SEO básico incluido)',
          'Buen puntaje en velocidad y experiencia de usuario',
          'Preparada para crecer en el futuro',
        ],
      },
      {
        icon: '🚀',
        title: 'Entrega y soporte inicial',
        description: 'Acompañamiento completo',
        items: [
          'Configuración completa',
          'Deploy en producción',
          'Guía básica de uso del panel',
          'Acompañamiento en la entrega',
        ],
      },
    ],
    price: 3000,
    currency: 'PEN',
    deliveryTime: '3-4 semanas',
    includes: [
      'Diseño',
      'Desarrollo',
      'CMS',
      'Configuración',
      'Publicación',
    ],
    notes: [
      '💰 Pago único - Incluye todo lo mencionado',
      '👉 Es una inversión pensada para que tengas una web profesional de largo plazo, sin costos ocultos',
      '🤝 No es una web genérica - Diseñada específicamente para tu negocio',
      '✅ No dependes de terceros para actualizar - Control total',
      '🎯 Refuerza tu imagen profesional',
      '📈 Base sólida para seguir creciendo (más secciones, funcionalidades, etc.)',
      '💪 La idea es que este proyecto sea el inicio de más trabajos juntos',
    ],
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#14213D] to-[#0A1628] py-12 px-4 print:bg-white print:py-0">
      <div className="max-w-6xl mx-auto">
        {/* Back Button - Hidden on print */}
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors print:hidden"
        >
          <ArrowLeft size={20} />
          <span>Volver al inicio</span>
        </Link>

        {/* Header - Hidden on print */}
        <div className="text-center mb-12 print:hidden">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📄 Generador de Cotizaciones
          </h1>
          <p className="text-gray-300 text-lg">
            Genera cotizaciones profesionales para tus clientes
          </p>
        </div>

        {/* Print Header - Only visible on print */}
        <div className="hidden print:block mb-8 border-b-4 border-[#FCA311] pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#00D4FF] to-[#8B5CF6] flex items-center justify-center">
                <span className="text-[#14213D] font-bold text-2xl">G</span>
                <span className="text-[#14213D] font-bold text-2xl">D</span>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  <span className="text-[#14213D]">Gargurevich</span>
                  <span className="bg-linear-to-r from-[#00D4FF] to-[#8B5CF6] bg-clip-text text-transparent">Digital</span>
                </div>
                <p className="text-sm text-gray-600">Desarrollo Web Premium</p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>contacto@gargurevich.dev</p>
              <p>Lima, Perú</p>
              <p className="font-semibold mt-1">
                {new Date().toLocaleDateString('es-PE', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <button
              onClick={handlePrint}
              className="flex items-center gap-3 px-8 py-4 bg-[#FCA311] text-white rounded-lg hover:bg-[#e89200] transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Printer size={24} />
              <span>Imprimir / Guardar como PDF</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-3 px-8 py-4 bg-[#14213D] text-white rounded-lg hover:bg-[#1a2a4a] transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Copy size={24} />
              <span>{copied ? '✓ Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-6 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg print:hidden">
            <h3 className="font-semibold text-[#14213D] mb-3 flex items-center gap-2">
              <FileText size={20} />
              Cómo usar esta cotización:
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                <span><strong>Imprimir:</strong> Usa el botón Imprimir / Guardar como PDF y selecciona Guardar como PDF en tu navegador</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                <span><strong>Copiar:</strong> Usa el botón Copiar Texto para copiar la cotización completa al portapapeles</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                <span><strong>Personalizar:</strong> Edita los datos en el código para crear cotizaciones diferentes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quote Header - Print Visible */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8 print:shadow-none">
          <div className="text-center mb-8 print:mb-6">
            <h2 className="text-3xl font-bold text-[#14213D] mb-2 print:text-4xl">
              {exampleQuoteData.projectTitle}
            </h2>
            <div className="text-gray-600 print:text-base">
              <p><strong>Cliente:</strong> {exampleQuoteData.clientCompany}</p>
              <p><strong>Email:</strong> {exampleQuoteData.clientEmail}</p>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-line print:text-base">{exampleQuoteData.projectDescription}</p>
          </div>
        </div>

        {/* Preview of Quote Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 print:grid-cols-1 print:gap-4">
          {/* Features Card */}
          <div className="bg-white rounded-lg shadow-xl p-6 print:shadow-none print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-[#14213D] mb-4 flex items-center gap-2 print:text-xl">
              ✨ Características Incluidas
            </h2>
            <div className="space-y-4 print:space-y-3">
              {exampleQuoteData.features.map((feature, index) => (
                <div key={index} className="border-l-4 border-[#FCA311] pl-4 print:break-inside-avoid">
                  <h3 className="font-semibold text-[#14213D] text-lg mb-1 print:text-base">
                    {feature.icon} {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 print:text-xs">{feature.description}</p>
                  <ul className="text-xs text-gray-500 space-y-1 print:text-xs">
                    {feature.items?.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Details Card */}
          <div className="bg-white rounded-lg shadow-xl p-6 print:shadow-none print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-[#14213D] mb-4 print:text-xl">
              💰 Inversión y Detalles
            </h2>
            
            <div className="bg-linear-to-br from-[#FCA311] to-[#e89200] text-white rounded-lg p-6 mb-6 print:bg-[#FCA311] print:p-4">
              <div className="text-sm mb-2">Inversión Total</div>
              <div className="text-4xl font-bold mb-2 print:text-3xl">
                S/ {exampleQuoteData.price.toLocaleString('es-PE')}
              </div>
              <div className="text-sm opacity-90">Pago único - Sin costos ocultos</div>
            </div>

            <div className="mb-6 print:mb-4">
              <h3 className="font-semibold text-[#14213D] mb-3 print:text-base">📦 Incluye:</h3>
              <div className="flex flex-wrap gap-2">
                {exampleQuoteData.includes.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm print:text-xs"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="print:break-inside-avoid">
              <h3 className="font-semibold text-[#14213D] mb-3 print:text-base">🎯 Beneficios Clave:</h3>
              <ul className="text-sm text-gray-700 space-y-2 print:text-xs">
                {exampleQuoteData.notes?.map((note, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#FCA311] shrink-0">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* PDF Preview Removed */}
        {/* La vista previa del PDF ha sido removida por compatibilidad. El PDF se descarga directamente. */}
      </div>
    </div>
  );
}
