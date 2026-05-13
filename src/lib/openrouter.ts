// Utilidades para integración con OpenRouter (frontend)
// OpenRouter es compatible con API estilo OpenAI Chat Completions.

export const OpenRouterConfigs = {
  creative: {
    temperature: 0.9,
    top_p: 0.95,
    max_tokens: 4096,
  },
  balanced: {
    temperature: 0.7,
    top_p: 0.95,
    max_tokens: 4096,
  },
  precise: {
    temperature: 0.3,
    top_p: 0.8,
    max_tokens: 2048,
  },
  analysis: {
    temperature: 0.2,
    top_p: 0.8,
    max_tokens: 2048,
  },
  fast: {
    temperature: 0.5,
    top_p: 0.9,
    max_tokens: 2048,
  }
};

export const OPENROUTER_MODELS = {
  'openai/gpt-4o-mini': {
    name: 'GPT-4o Mini',
    contextWindow: 128000,
    maxOutput: 16384,
    description: 'Rápido y económico para chat general'
  },
  'anthropic/claude-3.5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    contextWindow: 200000,
    maxOutput: 8192,
    description: 'Excelente calidad para razonamiento y redacción'
  },
  'meta-llama/llama-3.3-70b-instruct': {
    name: 'Llama 3.3 70B Instruct',
    contextWindow: 131072,
    maxOutput: 8192,
    description: 'Buen balance entre capacidad y velocidad'
  },
  'deepseek/deepseek-chat': {
    name: 'DeepSeek Chat',
    contextWindow: 131072,
    maxOutput: 8192,
    description: 'Modelo eficiente para código y análisis técnico'
  }
};

const OPENROUTER_PROXY_URL = '/api/openrouter/chat';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function normalizeOpenRouterModel(model?: string): string {
  if (!model) return 'openai/gpt-4o-mini';
  return model.startsWith('openrouter/') ? model.replace('openrouter/', '') : model;
}

export async function callOpenRouterAPI(
  prompt: string,
  config = OpenRouterConfigs.balanced,
  model?: string,
  systemPrompt?: string
): Promise<string> {
  const modelToUse = normalizeOpenRouterModel(model);

  const messages: OpenRouterMessage[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const body = {
    model: modelToUse,
    messages,
    temperature: config.temperature,
    top_p: config.top_p,
    max_tokens: config.max_tokens,
    stream: false,
  };

  const res = await fetch(OPENROUTER_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = data?.error?.message || data?.error || data?.detail || `Error ${res.status}`;
    throw new Error(`OpenRouter: ${detail}`);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (typeof text === 'string' && text.length > 0) {
    return text;
  }

  if (data?.error?.message) {
    throw new Error(`OpenRouter: ${data.error.message}`);
  }

  return `Respuesta sin texto: ${JSON.stringify(data, null, 2)}`;
}
