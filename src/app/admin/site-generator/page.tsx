'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { AVAILABLE_MODELS } from '@/lib/aiModelsConfig';

type SupportedProvider = 'groq' | 'gemini' | 'openai' | 'openrouter' | 'nvidia';
type DesignVariant = 'neo-grid' | 'editorial-split' | 'glass-flow' | 'auto';

const PROVIDER_LABELS: Record<SupportedProvider, string> = {
  groq: 'Groq',
  gemini: 'Gemini',
  openai: 'OpenAI',
  openrouter: 'OpenRouter',
  nvidia: 'NVIDIA',
};

const DESIGN_LABELS: Record<Exclude<DesignVariant, 'auto'>, string> = {
  'neo-grid': 'Neo Grid',
  'editorial-split': 'Editorial Split',
  'glass-flow': 'Glass Flow',
};

const PROVIDER_COST_HINTS: Record<SupportedProvider, { input: string; output: string; tier: 'Bajo' | 'Medio' | 'Alto' }> = {
  groq: { input: '$0.20-$1.50 / 1M tok', output: '$0.40-$3.00 / 1M tok', tier: 'Bajo' },
  gemini: { input: '$0.35-$3.50 / 1M tok', output: '$0.70-$10.00 / 1M tok', tier: 'Medio' },
  openai: { input: '$0.15-$5.00 / 1M tok', output: '$0.60-$15.00 / 1M tok', tier: 'Medio' },
  openrouter: { input: 'Varia por modelo', output: 'Varia por modelo', tier: 'Medio' },
  nvidia: { input: 'Varia por endpoint', output: 'Varia por endpoint', tier: 'Medio' },
};

const MODEL_COST_HINTS: Record<string, { input: string; output: string; tier: 'Bajo' | 'Medio' | 'Alto' }> = {
  'llama-3.3-70b-versatile': { input: '$0.59 / 1M tok', output: '$0.79 / 1M tok', tier: 'Bajo' },
  'llama-3.1-8b-instant': { input: '$0.05 / 1M tok', output: '$0.08 / 1M tok', tier: 'Bajo' },
  'gemini-2.5-flash': { input: '$0.35 / 1M tok', output: '$1.05 / 1M tok', tier: 'Bajo' },
  'gemini-2.5-pro': { input: '$3.50 / 1M tok', output: '$10.50 / 1M tok', tier: 'Alto' },
  'gpt-4o-mini': { input: '$0.15 / 1M tok', output: '$0.60 / 1M tok', tier: 'Bajo' },
  'gpt-4o': { input: '$5.00 / 1M tok', output: '$15.00 / 1M tok', tier: 'Alto' },
};

const CHAT_MODEL_OPTIONS = AVAILABLE_MODELS.chat.filter(
  (m) => m.available && ['groq', 'gemini', 'openai', 'openrouter', 'nvidia'].includes(m.provider)
);

type GenerateResponse = {
  ok: boolean;
  outputUrl: string;
  ai: {
    provider: 'groq' | 'openai' | 'gemini' | 'openrouter' | 'nvidia' | 'fallback';
    model: string;
    source: 'request' | 'persisted' | 'default' | 'fallback';
  };
  selected: {
    provider: SupportedProvider;
    model: string;
    source: 'request' | 'persisted' | 'default';
  };
  design: {
    variant: Exclude<DesignVariant, 'auto'>;
    source: 'request' | 'persisted' | 'default';
  };
  spec: {
    clientId: string;
    projectName: string;
    industry: string;
    tone: string;
    primaryCTA: string;
    sections: string[];
  };
  usage: {
    month: string;
    generations: number;
    estimatedInputTokens: number;
    estimatedOutputTokens: number;
    limits: {
      maxGenerationsPerMonth: number;
      maxInputTokensPerMonth: number;
      maxOutputTokensPerMonth: number;
    };
  };
};

export default function SiteGeneratorPage() {
  const [message, setMessage] = useState('Necesito una landing moderna para una clinica dental en Lima, enfocada en reservas por WhatsApp y confianza familiar.');
  const [clientId, setClientId] = useState('clinica-sonrisa-viva');
  const [projectName, setProjectName] = useState('Clinica Sonrisa Viva');
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [aiProvider, setAiProvider] = useState<SupportedProvider>('groq');
  const [aiModel, setAiModel] = useState('llama-3.3-70b-versatile');
  const [designVariant, setDesignVariant] = useState<DesignVariant>('auto');
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [deployment, setDeployment] = useState<{
    publicURL?: string;
    slug?: string;
    requestId?: string;
    deployApiUrl?: string;
  } | null>(null);

  const previewUrl = useMemo(() => result?.outputUrl ?? null, [result]);
  const providerOptions = useMemo(
    () => Array.from(new Set(CHAT_MODEL_OPTIONS.map((m) => m.provider))) as SupportedProvider[],
    []
  );
  const modelOptions = useMemo(
    () => CHAT_MODEL_OPTIONS.filter((m) => m.provider === aiProvider),
    [aiProvider]
  );
  const selectedModelInfo = useMemo(
    () => modelOptions.find((m) => m.id === aiModel) || null,
    [modelOptions, aiModel]
  );
  const selectedCost = useMemo(
    () => MODEL_COST_HINTS[aiModel] || PROVIDER_COST_HINTS[aiProvider],
    [aiModel, aiProvider]
  );

  useEffect(() => {
    if (modelOptions.length === 0) return;
    if (!modelOptions.some((m) => m.id === aiModel)) {
      setAiModel(modelOptions[0].id);
    }
  }, [aiModel, modelOptions]);

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    setDeployment(null);
    setDeployError(null);

    try {
      const response = await fetch('/api/admin/site-generator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, clientId, projectName, language, aiProvider, aiModel, designVariant }),
      });

      const data = (await response.json()) as GenerateResponse | { error: string };
      if (!response.ok) {
        setError((data as { error: string }).error || 'No se pudo generar el sitio');
        setResult(null);
        return;
      }

      const generated = data as GenerateResponse;
      setResult(generated);
      if (generated.ai.provider !== 'fallback') {
        setAiProvider(generated.ai.provider);
      }
      setAiModel(generated.ai.model);
      if (generated.design?.variant) {
        setDesignVariant(generated.design.variant);
      }
    } catch {
      setError('Error de red al generar el sitio');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const onDeploy = async () => {
    if (!result?.spec) return;

    setDeploying(true);
    setDeployError(null);

    try {
      const response = await fetch('/api/admin/site-generator/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec: result.spec }),
      });

      const data = (await response.json()) as
        | {
            ok: true;
            deployApiUrl: string;
            deployment: {
              requestId?: string;
              slug?: string;
              publicURL?: string;
            };
          }
        | { error?: string; deployApiUrl?: string };

      if (!response.ok) {
        setDeployError((data as { error?: string }).error || 'No se pudo publicar el sitio');
        return;
      }

      const deployData = data as {
        ok: true;
        deployApiUrl: string;
        deployment: {
          requestId?: string;
          slug?: string;
          publicURL?: string;
        };
      };

      setDeployment({
        deployApiUrl: deployData.deployApiUrl,
        requestId: deployData.deployment.requestId,
        slug: deployData.deployment.slug,
        publicURL: deployData.deployment.publicURL,
      });
    } catch {
      setDeployError('Error de red al publicar el sitio');
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">MVP Site Generator</h1>
        <p className="text-[#71717A] text-sm mt-1">
          Flujo tipo chat: escribes el mensaje del cliente y el sistema genera un sitio en orden coherente con estilo moderno.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-xl border border-white/10 bg-[#111111] p-4 space-y-3">
            <label className="block text-xs text-[#A1A1AA]">Mensaje del cliente</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-44 rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#00D4FF]/50"
              placeholder="Describe negocio, publico, objetivo y CTA..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">clientId</label>
                <input
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50"
                />
              </div>
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Idioma</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                  className="w-full rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#0F0F10] p-3 text-xs text-[#A1A1AA] space-y-1">
              <p className="text-white font-medium">{selectedModelInfo?.name || aiModel}</p>
              <p>{selectedModelInfo?.description || 'Modelo seleccionado para generar el brief de la landing.'}</p>
              <p>
                Costo estimado: <span className="text-[#D4D4D8]">IN {selectedCost.input} | OUT {selectedCost.output}</span>
              </p>
              <p>
                Nivel de costo: <span className="text-[#D4D4D8]">{selectedCost.tier}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs text-[#A1A1AA] mb-1">Nombre del proyecto</label>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Proveedor IA</label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value as SupportedProvider)}
                  className="w-full rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50"
                >
                  {providerOptions.map((provider) => (
                    <option key={provider} value={provider}>
                      {PROVIDER_LABELS[provider]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#A1A1AA] mb-1">Modelo</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50"
                >
                  {modelOptions.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#A1A1AA] mb-1">Diseño de landing</label>
              <select
                value={designVariant}
                onChange={(e) => setDesignVariant(e.target.value as DesignVariant)}
                className="w-full rounded-lg border border-white/10 bg-[#0F0F10] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D4FF]/50"
              >
                <option value="auto">Auto (por cliente)</option>
                <option value="neo-grid">Neo Grid</option>
                <option value="editorial-split">Editorial Split</option>
                <option value="glass-flow">Glass Flow</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onGenerate}
                disabled={loading || !message.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#00D4FF]/40 bg-[#00D4FF]/15 px-4 py-2.5 text-sm font-medium text-[#D7F7FF] hover:bg-[#00D4FF]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading ? 'Generando...' : 'Generar sitio'}
              </button>

              <button
                type="button"
                onClick={onDeploy}
                disabled={deploying || loading || !result?.spec}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-400/15 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deploying ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
                {deploying ? 'Publicando...' : 'Deploy 1 click'}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}

            {deployError && (
              <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{deployError}</p>
            )}
          </div>

          {result && (
            <div className="rounded-xl border border-white/10 bg-[#111111] p-4 space-y-3">
              <div className="flex items-center gap-2 text-[#A1A1AA] text-xs uppercase tracking-[0.12em]">
                <Bot size={14} />
                Brief estructurado
              </div>
              <div className="text-sm text-white font-semibold">{result.spec.projectName}</div>
              <ul className="text-xs text-[#A1A1AA] space-y-1">
                <li>Motor IA: {result.ai.provider} ({result.ai.model})</li>
                <li>Fuente seleccion: {result.ai.source === 'persisted' ? 'preferencia por cliente' : result.ai.source}</li>
                <li>Diseño aplicado: {DESIGN_LABELS[result.design.variant]} ({result.design.source})</li>
                <li>Cliente: {result.spec.clientId}</li>
                <li>Industria: {result.spec.industry}</li>
                <li>Tono: {result.spec.tone}</li>
                <li>CTA: {result.spec.primaryCTA}</li>
                <li>Secciones: {result.spec.sections.join(' -> ')}</li>
              </ul>
              <div className="pt-2 border-t border-white/10 text-xs text-[#A1A1AA] space-y-1">
                <p>Uso del mes ({result.usage.month})</p>
                <p>Generaciones: {result.usage.generations}/{result.usage.limits.maxGenerationsPerMonth}</p>
                <p>Input tokens: {result.usage.estimatedInputTokens.toLocaleString('es-PE')}/{result.usage.limits.maxInputTokensPerMonth.toLocaleString('es-PE')}</p>
                <p>Output tokens: {result.usage.estimatedOutputTokens.toLocaleString('es-PE')}/{result.usage.limits.maxOutputTokensPerMonth.toLocaleString('es-PE')}</p>
              </div>
              {deployment && (
                <div className="pt-2 border-t border-emerald-400/20 text-xs text-emerald-100 space-y-1">
                  <p>Deploy listo</p>
                  {deployment.slug && <p>Slug: {deployment.slug}</p>}
                  {deployment.requestId && <p>Request ID: {deployment.requestId}</p>}
                  {deployment.deployApiUrl && <p>API: {deployment.deployApiUrl}</p>}
                  {deployment.publicURL && (
                    <a href={deployment.publicURL} target="_blank" rel="noreferrer" className="text-emerald-300 hover:underline">
                      Abrir sitio publicado
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="xl:col-span-3">
          <div className="rounded-xl border border-white/10 bg-[#111111] p-3">
            <div className="flex items-center justify-between px-2 pb-2">
              <span className="text-xs text-[#A1A1AA]">Preview HTML generado</span>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#00D4FF] hover:underline"
                >
                  Abrir en nueva pestaña
                </a>
              )}
            </div>
            {previewUrl ? (
              <iframe
                src={previewUrl}
                title="MVP Preview"
                className="w-full h-[70vh] rounded-lg border border-white/10 bg-black"
              />
            ) : (
              <div className="h-[70vh] rounded-lg border border-dashed border-white/15 flex items-center justify-center text-sm text-[#71717A]">
                Genera un sitio para ver la previsualizacion aqui.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
