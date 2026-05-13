import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const DEFAULT_LIMITS = {
  maxGenerationsPerMonth: 100,
  maxInputTokensPerMonth: 250000,
  maxOutputTokensPerMonth: 400000,
};

function estimateTokens(text) {
  return Math.ceil((text || '').length / 4);
}

function currentMonthKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
}

function normalizeUsageRecord(record, month) {
  if (!record || record.month !== month) {
    return {
      month,
      generations: 0,
      estimatedInputTokens: 0,
      estimatedOutputTokens: 0,
      lastGenerationAt: null,
      limits: null,
    };
  }

  return {
    month,
    generations: Number(record.generations || 0),
    estimatedInputTokens: Number(record.estimatedInputTokens || 0),
    estimatedOutputTokens: Number(record.estimatedOutputTokens || 0),
    lastGenerationAt: record.lastGenerationAt || null,
    limits: record.limits || null,
  };
}

async function loadUsageState(usagePath) {
  try {
    const raw = await readFile(usagePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { clients: {} };
  }
}

function buildHtml(spec, disclaimerText) {
  const sections = Array.isArray(spec.sections) ? spec.sections : [];
  const sectionMarkup = sections
    .map(
      (section) => `
      <section class="section">
        <h2>${section.toUpperCase()}</h2>
        <p>Contenido generado para ${spec.projectName} (${spec.industry}).</p>
      </section>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${spec.projectName} - Landing MVP</title>
    <style>
      :root {
        --bg: #0d1117;
        --surface: #111827;
        --text: #e5e7eb;
        --muted: #9ca3af;
        --accent: #22d3ee;
        --warning-bg: #1f2937;
        --warning-border: #f59e0b;
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans;
        background: linear-gradient(180deg, var(--bg), #0b0f14 50%, var(--bg));
        color: var(--text);
        line-height: 1.6;
      }

      .container { max-width: 1000px; margin: 0 auto; padding: 40px 20px 80px; }
      .hero {
        background: radial-gradient(circle at top right, rgba(34, 211, 238, 0.2), transparent 45%), var(--surface);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        padding: 28px;
      }

      .hero h1 { margin: 0 0 8px; font-size: clamp(1.8rem, 5vw, 3rem); }
      .hero p { margin: 0; color: var(--muted); }

      .meta { margin-top: 12px; color: var(--muted); font-size: 0.92rem; }

      .section {
        margin-top: 18px;
        padding: 20px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
      }

      .section h2 { margin: 0 0 8px; color: var(--accent); letter-spacing: 0.04em; }
      .section p { margin: 0; color: var(--text); }

      .cta {
        margin-top: 26px;
        display: inline-block;
        padding: 12px 20px;
        border-radius: 12px;
        color: #001018;
        background: var(--accent);
        text-decoration: none;
        font-weight: 600;
      }

      .disclaimer {
        margin-top: 22px;
        padding: 14px 16px;
        border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--warning-border) 70%, transparent);
        background: var(--warning-bg);
        color: #fcd34d;
        font-size: 0.9rem;
      }
    </style>
  </head>
  <body>
    <main class="container">
      <header class="hero">
        <h1>${spec.projectName}</h1>
        <p>${spec.tone} para ${spec.audience}</p>
        <p class="meta">Industria: ${spec.industry} | Idioma: ${spec?.constraints?.language || 'es'}</p>
      </header>

      ${sectionMarkup}

      <a class="cta" href="#final-cta">${spec.primaryCTA}</a>

      ${disclaimerText ? `<aside class="disclaimer"><strong>Disclaimer IA:</strong> ${disclaimerText}</aside>` : ''}
    </main>
  </body>
</html>`;
}

async function main() {
  const [, , specArg, outputArg] = process.argv;

  if (!specArg || !outputArg) {
    console.error('Uso: node mvp/site-generator/generate-site.mjs <spec.json> <output.html>');
    process.exit(1);
  }

  const specPath = resolve(specArg);
  const outputPath = resolve(outputArg);
  const usagePath = resolve('mvp/site-generator/output/usage-state.json');

  const rawSpec = await readFile(specPath, 'utf8');
  const spec = JSON.parse(rawSpec);

  const clientId = String(spec.clientId || 'unknown-client');
  const limits = {
    ...DEFAULT_LIMITS,
    ...(spec?.limits?.ai || {}),
  };

  const estimatedInputTokens = estimateTokens(rawSpec);
  if (estimatedInputTokens > limits.maxInputTokensPerMonth) {
    throw new Error('Brief demasiado grande para el limite mensual de input tokens. Reduce el input o aumenta el plan.');
  }

  const month = currentMonthKey();
  const usageState = await loadUsageState(usagePath);
  const current = normalizeUsageRecord(usageState.clients[clientId], month);

  if (current.generations + 1 > limits.maxGenerationsPerMonth) {
    throw new Error('Limite mensual de generaciones alcanzado para este cliente.');
  }

  if (current.estimatedInputTokens + estimatedInputTokens > limits.maxInputTokensPerMonth) {
    throw new Error('Limite mensual de input tokens alcanzado para este cliente.');
  }

  const disclaimerEnabled = spec?.disclaimer?.enabled !== false;
  const disclaimerText = disclaimerEnabled
    ? String(
        spec?.disclaimer?.text ||
          'Esta pagina puede incluir texto generado con IA y requiere revision humana. Prohibido su uso para fraude, suplantacion, spam o actividades ilegales.'
      )
    : '';

  const html = buildHtml(spec, disclaimerText);
  const estimatedOutputTokens = estimateTokens(html);

  if (current.estimatedOutputTokens + estimatedOutputTokens > limits.maxOutputTokensPerMonth) {
    throw new Error('Limite mensual de output tokens alcanzado para este cliente.');
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');

  usageState.clients[clientId] = {
    month,
    generations: current.generations + 1,
    estimatedInputTokens: current.estimatedInputTokens + estimatedInputTokens,
    estimatedOutputTokens: current.estimatedOutputTokens + estimatedOutputTokens,
    lastGenerationAt: new Date().toISOString(),
    limits: {
      maxGenerationsPerMonth: limits.maxGenerationsPerMonth,
      maxInputTokensPerMonth: limits.maxInputTokensPerMonth,
      maxOutputTokensPerMonth: limits.maxOutputTokensPerMonth,
    },
  };

  await mkdir(dirname(usagePath), { recursive: true });
  await writeFile(usagePath, JSON.stringify(usageState, null, 2), 'utf8');

  console.log('OK: pagina generada');
  console.log(`- Cliente: ${clientId}`);
  console.log(`- Output: ${outputPath}`);
  console.log(`- Mes: ${month}`);
  console.log(`- Generaciones usadas: ${usageState.clients[clientId].generations}/${limits.maxGenerationsPerMonth}`);
  console.log(
    `- Input tokens estimados: ${usageState.clients[clientId].estimatedInputTokens}/${limits.maxInputTokensPerMonth}`
  );
  console.log(
    `- Output tokens estimados: ${usageState.clients[clientId].estimatedOutputTokens}/${limits.maxOutputTokensPerMonth}`
  );
}

main().catch((error) => {
  console.error('ERROR:', error.message);
  process.exit(1);
});
