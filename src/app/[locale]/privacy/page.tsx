import { setRequestLocale } from 'next-intl/server';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
      <p className="text-[#A1A1AA] mb-4">
        Esta es una página de ejemplo para la política de privacidad. 
        Debes actualizar este contenido con la información legal correspondiente.
      </p>
    </div>
  );
}
