// Utilidades para integración con NVIDIA NIM API (frontend)
// Compatible con la API OpenAI: https://integrate.api.nvidia.com/v1

export const NvidiaConfigs = {
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
    max_tokens: 1024,
  },
  fast: {
    temperature: 0.5,
    top_p: 0.9,
    max_tokens: 2048,
  }
};

// Modelos NVIDIA NIM disponibles
export const NVIDIA_MODELS = {
  // Nemotron - Modelos propios de NVIDIA
  'nvidia/llama-3.3-nemotron-super-49b-v1': {
    name: 'Nemotron Super 49B',
    contextWindow: 131072,
    maxOutput: 32768,
    description: 'NVIDIA Nemotron Super - Razonamiento avanzado, multilingüe'
  },
  'nvidia/llama-3.1-nemotron-ultra-253b-v1': {
    name: 'Nemotron Ultra 253B',
    contextWindow: 131072,
    maxOutput: 32768,
    description: 'NVIDIA Nemotron Ultra - El más potente de NVIDIA'
  },
  'nvidia/llama-3.1-nemotron-70b-instruct': {
    name: 'Nemotron 70B Instruct',
    contextWindow: 131072,
    maxOutput: 32768,
    description: 'NVIDIA Nemotron 70B - Instrucciones precisas y análisis'
  },
  // Meta LLaMA via NVIDIA
  'meta/llama-3.3-70b-instruct': {
    name: 'LLaMA 3.3 70B (NVIDIA)',
    contextWindow: 131072,
    maxOutput: 32768,
    description: 'Meta LLaMA 3.3 70B via NVIDIA NIM - Alta capacidad'
  },
  'meta/llama-3.1-8b-instruct': {
    name: 'LLaMA 3.1 8B (NVIDIA)',
    contextWindow: 131072,
    maxOutput: 8192,
    description: 'Meta LLaMA 3.1 8B via NVIDIA NIM - Rápido y eficiente'
  },
  // DeepSeek via NVIDIA
  'deepseek-ai/deepseek-r1': {
    name: 'DeepSeek R1',
    contextWindow: 131072,
    maxOutput: 32768,
    description: 'DeepSeek R1 via NVIDIA NIM - Razonamiento tipo cadena de pensamiento'
  },
  // Mistral via NVIDIA
  'mistralai/mistral-7b-instruct-v0.3': {
    name: 'Mistral 7B Instruct',
    contextWindow: 32768,
    maxOutput: 4096,
    description: 'Mistral 7B via NVIDIA NIM - Ligero y rápido'
  },
  // Qwen via NVIDIA
  'qwen/qwen2.5-72b-instruct': {
    name: 'Qwen 2.5 72B (NVIDIA)',
    contextWindow: 131072,
    maxOutput: 32768,
    description: 'Qwen 2.5 72B via NVIDIA NIM - Multilingüe, excelente en código'
  }
};

export type NvidiaModelId = keyof typeof NVIDIA_MODELS;

export interface NvidiaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Proxy server-side para evitar CORS (Next.js API route)
const NVIDIA_PROXY_URL = '/api/nvidia/chat';

export async function callNvidiaAPI(
  prompt: string,
  config = NvidiaConfigs.balanced,
  model?: string,
  systemPrompt?: string
): Promise<string> {
  const modelToUse = model || 'meta/llama-3.3-70b-instruct';

  // Fallback chain
  const modelsToTry = [modelToUse];
  if (modelToUse !== 'meta/llama-3.1-8b-instruct') {
    modelsToTry.push('meta/llama-3.1-8b-instruct');
  }

  let lastError = '';

  for (const currentModel of modelsToTry) {
    const messages: NvidiaMessage[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const body = {
      model: currentModel,
      messages,
      temperature: config.temperature,
      top_p: config.top_p,
      max_tokens: config.max_tokens,
      stream: false
    };

    try {
      // Llamar al proxy server-side para evitar CORS
      const res = await fetch(NVIDIA_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        if (res.status === 429) {
          console.log(`[NVIDIA] Rate limit en ${currentModel}, intentando siguiente modelo...`);
          lastError = 'La API de NVIDIA está sobrecargada. ';
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }
        if (res.status === 413) {
          console.log(`[NVIDIA] Error 413 en ${currentModel} (mensaje muy largo), intentando siguiente modelo...`);
          lastError = `Mensaje muy largo para ${currentModel}. `;
          continue;
        }
        if (res.status === 404) {
          console.log(`[NVIDIA] Modelo ${currentModel} no encontrado (404), intentando siguiente modelo...`);
          lastError = `Modelo ${currentModel} no disponible. `;
          continue;
        }
        if (res.status === 400) {
          try {
            const errorData = await res.json();
            if (errorData?.detail) {
              lastError = String(errorData.detail);
              continue;
            }
          } catch {}
          return 'La petición a NVIDIA NIM es inválida. Revisa los datos enviados.';
        }
        if (res.status === 401) {
          return 'API key de NVIDIA inválida o expirada. Verifica tu configuración (NEXT_PUBLIC_NVIDIA_API_KEY).';
        }
        if (res.status === 503) {
          lastError = 'El servicio de NVIDIA NIM no está disponible temporalmente. ';
          continue;
        }
        console.log(`[NVIDIA] Error ${res.status} en ${currentModel}, intentando siguiente modelo...`);
        lastError = `Error ${res.status} con modelo ${currentModel}. `;
        continue;
      }

      const data = await res.json();

      if (data?.choices?.[0]?.message?.content) {
        if (currentModel !== modelToUse) {
          console.log(`[NVIDIA] ✅ Respuesta obtenida con modelo alternativo: ${currentModel}`);
        }
        return data.choices[0].message.content;
      }

      if (data?.detail) {
        return `Error NVIDIA: ${data.detail}`;
      }

      return `Respuesta sin texto: ${JSON.stringify(data, null, 2)}`;

    } catch (err) {
      console.log(`[NVIDIA] Error de conexión con ${currentModel}:`, err);
      lastError = 'No se pudo conectar con la API de NVIDIA NIM. ';
      continue;
    }
  }

  return `${lastError}Todos los modelos de NVIDIA están ocupados. Por favor, intenta nuevamente en unos segundos.`;
}
