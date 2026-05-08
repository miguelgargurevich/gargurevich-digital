const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient({
  datasources: { db: { url: process.env.LOCAL_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/gargurevich_digital_local' } }
});

const OFFERS_SEED = [
  {
    planKey: 'mi-negocio-en-google',
    icon: 'zap',
    order: 0,
    popular: false,
    nameEs: 'Mi Negocio en Google',
    nameEn: 'My Business on Google',
    price: 'S/ 299',
    priceNoteEs: 'Pago único',
    priceNoteEn: 'One-time payment',
    descriptionEs: 'Aparece en Google Maps y online en 48 horas. Ideal si no tienes presencia digital aún.',
    descriptionEn: 'Get found on Google Maps and online in 48 hours. Ideal if you do not have any digital presence yet.',
    itemsEs: ['Ficha de Google Maps', '1 página de sección', 'Dominio incluido', 'Email profesional'],
    itemsEn: ['Google Maps listing', '1-section page', 'Domain included', 'Professional email'],
    ctaEs: 'Habla conmigo por WhatsApp ahora',
    ctaEn: 'Chat with me on WhatsApp now',
    forWhoEs: 'Ideal para: negocios sin presencia digital aún',
    forWhoEn: 'Best for: businesses without digital presence yet',
  },
  {
    planKey: 'landing-whatsapp',
    icon: 'zap',
    order: 1,
    popular: false,
    nameEs: 'Landing que vende por WhatsApp',
    nameEn: 'WhatsApp Sales Landing',
    price: 'S/ 399',
    priceNoteEs: 'Pago único',
    priceNoteEn: 'One-time payment',
    descriptionEs: 'Convierte anuncios de Facebook/Instagram en ventas por WhatsApp',
    descriptionEn: 'Turn your Facebook and Instagram ads into WhatsApp sales',
    itemsEs: ['Botón WhatsApp flotante', 'Pixel de Facebook', 'Formulario simple', 'Dominio incluido'],
    itemsEn: ['Floating WhatsApp button', 'Facebook Pixel', 'Simple form', 'Domain included'],
    ctaEs: 'Quiero mi web lista para vender',
    ctaEn: 'I want my web ready to sell',
    forWhoEs: 'Ideal para: negocios que invierten en publicidad digital',
    forWhoEn: 'Best for: businesses investing in digital ads',
  },
  {
    planKey: 'web-que-yo-edito',
    icon: 'star',
    order: 2,
    popular: false,
    nameEs: 'Web que yo mismo edito',
    nameEn: 'Website I Can Edit',
    price: 'S/ 599',
    priceNoteEs: 'Pago único + S/ 19/mes',
    priceNoteEn: 'One-time + S/ 19/mo',
    descriptionEs: 'Controla tu web sin saber de código. CMS fácil y con hosting incluido.',
    descriptionEn: 'Control your website without coding knowledge. Easy CMS with hosting.',
    itemsEs: ['CMS sin código', 'Control total', 'Blog integrado', 'Hosting ilimitado'],
    itemsEn: ['No-code CMS', 'Full control', 'Built-in blog', 'Unlimited hosting'],
    ctaEs: 'Dame control total',
    ctaEn: 'Give me full control',
    forWhoEs: 'Ideal para: emprendedores que quieren controlar todo',
    forWhoEn: 'Best for: entrepreneurs who want full control',
  },
  {
    planKey: 'sueno-digital-completo',
    icon: 'sparkles',
    order: 3,
    popular: true,
    nameEs: 'Sueño Digital Completo',
    nameEn: 'Complete Digital Dream',
    price: 'S/ 999',
    priceNoteEs: 'Pago único + S/ 39/mes',
    priceNoteEn: 'One-time + S/ 39/mo',
    descriptionEs: 'Todo lo que necesitas: diseño premium, SEO, mantenimiento y soporte.',
    descriptionEn: 'Everything you need: premium design, SEO, maintenance and support.',
    itemsEs: ['Diseño premium', 'SEO optimizado', 'Soporte 24/7', 'Backups automáticos'],
    itemsEn: ['Premium design', 'SEO optimized', '24/7 support', 'Automatic backups'],
    ctaEs: 'Quiero todo resuelto',
    ctaEn: 'I want everything solved',
    forWhoEs: 'Ideal para: negocios serios que quieren dominar',
    forWhoEn: 'Best for: serious businesses wanting to dominate',
  },
  {
    planKey: 'mantenimiento-web',
    icon: 'star',
    order: 4,
    popular: false,
    nameEs: 'Mantenimiento Web Perú',
    nameEn: 'Website Maintenance Peru',
    price: 'S/ 79-149',
    priceNoteEs: 'Mensual',
    priceNoteEn: 'Monthly',
    descriptionEs: 'Cuida tu web existente. Seguridad, backups y soporte incluido.',
    descriptionEn: 'Care for your existing website. Security, backups and support included.',
    itemsEs: ['Seguridad 24/7', 'Backups semanales', 'Actualizaciones', 'Soporte'],
    itemsEn: ['24/7 security', 'Weekly backups', 'Updates', 'Support'],
    ctaEs: 'Protege tu web ahora',
    ctaEn: 'Protect my website now',
    forWhoEs: 'Ideal para: negocios con web que necesitan mantenimiento',
    forWhoEn: 'Best for: businesses needing website maintenance',
  },
  {
    planKey: 'solo-dominio-correos',
    icon: 'star',
    order: 5,
    popular: false,
    nameEs: 'Solo dominio + correos',
    nameEn: 'Domain + Email Only',
    price: 'S/ 150',
    priceNoteEs: 'Por año',
    priceNoteEn: 'Per year',
    descriptionEs: 'Ya tienes web en otra plataforma. Aquí dominio + correos profesionales.',
    descriptionEn: 'You already have a website elsewhere. Get domain + professional email here.',
    itemsEs: ['Dominio .pe o .com.pe', 'Redirección de correos', 'Gestión de dominio', 'Sin hosting adicional'],
    itemsEn: ['.pe or .com.pe domain', 'Email forwarding', 'Domain management', 'No extra hosting'],
    ctaEs: 'Agenda una llamada',
    ctaEn: 'Schedule a call',
    forWhoEs: 'Ideal para: webs en Wix/WordPress que quieren profesionalismo',
    forWhoEn: 'Best for: websites on Wix/WordPress wanting professionalism',
  },
];

(async () => {
  try {
    await db.offer.deleteMany({});
    console.log('Offers deleted');
    const result = await db.offer.createMany({ data: OFFERS_SEED });
    console.log(`✅ Seeded ${result.count} offers successfully`);
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await db.$disconnect();
  }
})();
