// Utilidades para integración con OpenAI (frontend)
// Funciones centralizadas para llamadas a la API de OpenAI (GPT-4o, GPT-4, etc.)

export const OpenAIConfigs = {
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

// Modelos OpenAI disponibles
export const OPENAI_MODELS = {
  'gpt-4o': {
    name: 'GPT-4o',
    contextWindow: 128000,
    maxOutput: 16384,
    description: 'El más capaz de OpenAI - Multimodal, razonamiento avanzado'
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    contextWindow: 128000,
    maxOutput: 16384,
    description: 'Rápido y económico para chat general'
  },
  'gpt-4-turbo': {
    name: 'GPT-4 Turbo',
    contextWindow: 128000,
    maxOutput: 4096,
    description: 'GPT-4 con ventana de contexto extendida'
  },
  'gpt-4': {
    name: 'GPT-4',
    contextWindow: 8192,
    maxOutput: 4096,
    description: 'GPT-4 clásico - Razonamiento preciso'
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    contextWindow: 16385,
    maxOutput: 4096,
    description: 'Rápido y eficiente para tareas cotidianas'
  },
  'o1': {
    name: 'o1',
    contextWindow: 200000,
    maxOutput: 100000,
    description: 'OpenAI o1 - Razonamiento profundo paso a paso'
  },
  'o1-mini': {
    name: 'o1-mini',
    contextWindow: 128000,
    maxOutput: 65536,
    description: 'OpenAI o1-mini - Razonamiento rápido y eficiente'
  },
  'o3-mini': {
    name: 'o3-mini',
    contextWindow: 200000,
    maxOutput: 100000,
    description: 'OpenAI o3-mini - Razonamiento de nueva generación'
  }
};

export type OpenAIModelId = keyof typeof OPENAI_MODELS;

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const OPENAI_PROXY_URL = '/api/openai/chat';

export async function callOpenAIAPI(
  prompt: string,
  config = OpenAIConfigs.balanced,
  model: string = 'gpt-4o-mini',
  systemPrompt?: string
): Promise<string> {
  const messages: OpenAIMessage[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const body = {
    model,
    messages,
    temperature: config.temperature,
    top_p: config.top_p,
    max_tokens: config.max_tokens,
  };

  const res = await fetch(OPENAI_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const detail = data?.error?.message || data?.error || data?.detail || `Error ${res.status}`;
    throw new Error(`OpenAI: ${detail}`);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (typeof text === 'string' && text.length > 0) {
    return text;
  }

  if (data?.error?.message) {
    throw new Error(`OpenAI: ${data.error.message}`);
  }

  return `Respuesta sin texto: ${JSON.stringify(data, null, 2)}`;
}
