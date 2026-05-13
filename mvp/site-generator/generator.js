#!/usr/bin/env node

/**
 * Generador de Sitios — CLI mínimo para testing local
 * 
 * Uso:
 *   node generator.js input.json output_dir
 * 
 * El script:
 * 1. Lee JSON de entrada (brief)
 * 2. Estructura contenido en componentes
 * 3. Genera HTML renderizado
 * 4. Escribe en directorio de salida
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

// ── Validador ──────────────────────────────────────────────
function validateSpec(spec) {
  const required = ['projectName', 'industry', 'primaryCTA'];
  for (const field of required) {
    if (!spec[field]) {
      throw new Error(`Campo requerido faltante: ${field}`);
    }
  }
  return true;
}

// ── Estructura base de contenido ───────────────────────────
function getDefaultContent(spec) {
  return {
    projectName: spec.projectName,
    tagline: `Soluciones profesionales en ${spec.industry}`,
    hero: {
      title: `${spec.projectName} — Transformando ${spec.industry}`,
      subtitle: spec.audience ? `Para ${spec.audience}` : 'Soluciones a tu medida',
      cta: spec.primaryCTA,
    },
    benefits: [
      {
        title: 'Profesionalismo',
        description: 'Experiencia comprobada en el sector.',
      },
      {
        title: 'Disponibilidad',
        description: 'Atención rápida a tus necesidades.',
      },
      {
        title: 'Resultados',
        description: 'Transformamos ideas en realidad.',
      },
    ],
    cta_final: {
      text: spec.primaryCTA,
      link: '#contact',
    },
  };
}

// ── Template HTML base ─────────────────────────────────────
function generateHTML(spec, content) {
  const year = new Date().getFullYear();
  const colors = {
    primary: '#2563eb',
    secondary: '#1e40af',
    accent: '#f59e0b',
  };

  // Generar cards de beneficios
  const benefitCards = content.benefits.map(b => {
    return `        <div class="benefit-card">
          <h3>${b.title}</h3>
          <p>${b.description}</p>
        </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.projectName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    a {
      color: ${colors.primary};
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    
    /* ── HERO ── */
    .hero {
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
      color: white;
      padding: 6rem 2rem;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .hero .subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .hero .cta-btn {
      display: inline-block;
      background: ${colors.accent};
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1.1rem;
      cursor: pointer;
      border: none;
      transition: opacity 0.3s;
    }
    
    .hero .cta-btn:hover {
      opacity: 0.9;
    }
    
    /* ── BENEFITS ── */
    .benefits {
      padding: 4rem 2rem;
      background: #f9fafb;
    }
    
    .benefits h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2rem;
    }
    
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .benefit-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    
    .benefit-card:hover {
      transform: translateY(-4px);
    }
    
    .benefit-card h3 {
      color: ${colors.primary};
      margin-bottom: 0.5rem;
    }
    
    /* ── FOOTER ── */
    footer {
      background: #1f2937;
      color: white;
      padding: 2rem;
      text-align: center;
    }
    
    footer p {
      margin: 0.5rem 0;
    }
    
    /* ── RESPONSIVE ── */
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }
      
      .hero .subtitle {
        font-size: 1rem;
      }
      
      .benefits-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <!-- HERO -->
  <section class="hero">
    <div class="container">
      <h1>${content.hero.title}</h1>
      <p class="subtitle">${content.hero.subtitle}</p>
      <button class="cta-btn">${content.hero.cta}</button>
    </div>
  </section>
  
  <!-- BENEFITS -->
  <section class="benefits">
    <div class="container">
      <h2>¿Por qué elegirnos?</h2>
      <div class="benefits-grid">
${benefitCards}
      </div>
    </div>
  </section>
  
  <!-- FOOTER -->
  <footer>
    <div class="container">
      <p><strong>${content.projectName}</strong></p>
      <p>&copy; ${year} Todos los derechos reservados.</p>
      <p>Generado automáticamente por Gargurevich Digital Studio</p>
    </div>
  </footer>
</body>
</html>`;
}

// ── Main ───────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Uso: node generator.js <input.json> <output_dir>');
    process.exit(1);
  }
  
  const inputFile = args[0];
  const outputDir = args[1];
  
  try {
    // Leer input
    const specContent = readFileSync(inputFile, 'utf8');
    const spec = JSON.parse(specContent);
    
    // Validar
    validateSpec(spec);
    console.log('✓ Especificación validada');
    
    // Generar contenido
    const content = getDefaultContent(spec);
    console.log('✓ Contenido generado');
    
    // Renderizar HTML
    const html = generateHTML(spec, content);
    console.log('✓ HTML renderizado');
    
    // Crear directorio de salida
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    // Escribir archivos
    writeFileSync(join(outputDir, 'index.html'), html);
    writeFileSync(join(outputDir, 'metadata.json'), JSON.stringify({
      projectName: spec.projectName,
      generatedAt: new Date().toISOString(),
      spec: spec,
    }, null, 2));
    
    console.log('✓ Archivos guardados en ' + outputDir);
    console.log('  - index.html');
    console.log('  - metadata.json');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
