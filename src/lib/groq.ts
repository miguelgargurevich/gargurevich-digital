
// Utilidades para integración con GROQ IA (frontend)
// Funciones centralizadas para llamadas a la API de GROQ
// GROQ ofrece inferencia ultra rápida con modelos LLaMA, Mixtral, Gemma y GPT-OSS


export const GroqConfigs = {
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
  // Config especial para GROQ - ultra rápido
  fast: {
    temperature: 0.5,
    top_p: 0.9,
    max_tokens: 2048,
  }
};

// Modelos GROQ disponibles con sus características (actualizado Dic 2025)
export const GROQ_MODELS = {
  // 🌟 OpenAI GPT-OSS - Modelos destacados
  'openai/gpt-oss-120b': {
    name: 'GPT-OSS 120B',
    contextWindow: 131072,
    maxOutput: 65536,
    description: 'Modelo OpenAI 120B - Razonamiento avanzado, búsqueda web integrada'
  },
  'openai/gpt-oss-20b': {
    name: 'GPT-OSS 20B',
    contextWindow: 131072,
    maxOutput: 65536,
    description: 'Modelo OpenAI 20B - Rápido y eficiente'
  },
  // LLaMA 3.3 - El más capaz de Meta
  'llama-3.3-70b-versatile': {
    name: 'LLaMA 3.3 70B Versatile',
    contextWindow: 131072,
    maxOutput: 32768,
    description: 'Modelo más capaz de Meta, excelente para tareas complejas'
  },
  // LLaMA 3.1 - Rápido
  'llama-3.1-8b-instant': {
    name: 'LLaMA 3.1 8B Instant',
    contextWindow: 131072,
    maxOutput: 131072,
    description: 'Ultra rápido, ideal para respuestas instantáneas'
  },
  // LLaMA 4 - Preview
  'meta-llama/llama-4-maverick-17b-128e-instruct': {
    name: 'LLaMA 4 Maverick 17B',
    contextWindow: 131072,
    maxOutput: 8192,
    description: 'LLaMA 4 Preview - Modelo de última generación'
  },
  'meta-llama/llama-4-scout-17b-16e-instruct': {
    name: 'LLaMA 4 Scout 17B',
    contextWindow: 131072,
    maxOutput: 8192,
    description: 'LLaMA 4 Scout - Rápido y eficiente'
  },
  // Qwen
  'qwen/qwen3-32b': {
    name: 'Qwen 3 32B',
    contextWindow: 131072,
    maxOutput: 40960,
    description: 'Modelo Alibaba Qwen 3 - Multilingüe'
  },
  // Kimi K2
  'moonshotai/kimi-k2-instruct-0905': {
    name: 'Kimi K2',
    contextWindow: 262144,
    maxOutput: 16384,
    description: 'Moonshot AI Kimi K2 - Contexto extralargo'
  }
};

export type GroqModelId = keyof typeof GROQ_MODELS;

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGroqAPI(
  prompt: string, 
  config = GroqConfigs.balanced, 
  model?: string,
  systemPrompt?: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('No se encontró la API key de GROQ en las variables de entorno');
  }
  
  // Si no se proporciona modelo, usar el configurado para chat
  const modelToUse = model || 'llama3-8b-8192';
  
  // Verificar si es un modelo GROQ válido (incluir nuevos formatos openai/, meta-llama/, qwen/, moonshotai/)
  const isGroqModel = modelToUse in GROQ_MODELS || 
    modelToUse.includes('llama') || 
    modelToUse.includes('mixtral') || 
    modelToUse.includes('gemma') ||
    modelToUse.startsWith('openai/') ||
    modelToUse.startsWith('meta-llama/') ||
    modelToUse.startsWith('qwen/') ||
    modelToUse.startsWith('moonshotai/');
  const modelName = isGroqModel ? modelToUse : 'llama-3.3-70b-versatile';
  
  // Lista de modelos a intentar (fallback si hay rate limit o error)
  // Priorizar modelos estables con mayor contexto
  const modelsToTry = [modelName];
  
  // Agregar fallback models (los más estables primero)
  if (modelName !== 'llama-3.3-70b-versatile') {
    modelsToTry.push('llama-3.3-70b-versatile'); // El más estable y capaz
  }
  if (modelName !== 'llama-3.1-8b-instant') {
    modelsToTry.push('llama-3.1-8b-instant'); // Ultra rápido, buen contexto
  }
  
  let lastError = '';
  
  for (const currentModel of modelsToTry) {
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    
    // Construir mensajes en formato OpenAI
    const messages: GroqMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });
    
    // Ajustar max_tokens según el modelo (algunos tienen límites más bajos)
    let maxTokens = config.max_tokens;
    if (currentModel.includes('llama-4') || currentModel.includes('maverick') || currentModel.includes('scout')) {
      maxTokens = Math.min(maxTokens, 4096); // LLaMA 4 preview tiene límite más bajo
    }
    
    const body = {
      model: currentModel,
      messages,
      temperature: config.temperature,
      top_p: config.top_p,
      max_tokens: maxTokens,
      stream: false
    };
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        if (res.status === 429) {
          console.log(`[GROQ] Rate limit en ${currentModel}, intentando siguiente modelo...`);
          lastError = 'La API de GROQ está sobrecargada. ';
          // Pequeña pausa antes de intentar el siguiente modelo
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }
        if (res.status === 413) {
          console.log(`[GROQ] Error 413 en ${currentModel} (mensaje muy largo), intentando siguiente modelo...`);
          lastError = `Mensaje muy largo para ${currentModel}. `;
          continue;
        }
        if (res.status === 404) {
          console.log(`[GROQ] Modelo ${currentModel} no encontrado (404), intentando siguiente modelo...`);
          lastError = `Modelo ${currentModel} no disponible. `;
          continue;
        }
        if (res.status === 400) {
          try {
            const errorData = await res.json();
            if (errorData?.error?.message) {
              console.log(`[GROQ] Error 400: ${errorData.error.message}`);
              // Si es error de longitud, intentar siguiente modelo
              if (errorData.error.message.includes('length') || errorData.error.message.includes('reduce')) {
                lastError = 'Mensaje demasiado largo. ';
                continue;
              }
              lastError = errorData.error.message;
              continue;
            }
          } catch {}
          return 'La petición a GROQ es inválida. Revisa los datos enviados.';
        }
        if (res.status === 401) {
          return 'API key de GROQ inválida o expirada. Verifica tu configuración.';
        }
        if (res.status === 503) {
          lastError = 'El servicio de GROQ no está disponible temporalmente. ';
          continue;
        }
        console.log(`[GROQ] Error ${res.status} en ${currentModel}, intentando siguiente modelo...`);
        lastError = `Error ${res.status} con modelo ${currentModel}. `;
        continue;
      }
      
      const data = await res.json();
      
      if (data?.choices?.[0]?.message?.content) {
        if (currentModel !== modelName) {
          console.log(`[GROQ] ✅ Respuesta obtenida con modelo alternativo: ${currentModel}`);
        }
        return data.choices[0].message.content;
      }
      
      if (data?.error?.message) {
        return `Error GROQ: ${data.error.message}`;
      }
      
      return `Respuesta sin texto: ${JSON.stringify(data, null, 2)}`;
      
    } catch (err) {
      console.log(`[GROQ] Error de conexión con ${currentModel}:`, err);
      lastError = 'No se pudo conectar con la API de GROQ. ';
      continue;
    }
  }
  
  return `${lastError}Todos los modelos están ocupados. Por favor, intenta nuevamente en unos segundos.`;
}

// Función para llamar con historial de conversación completo
export async function callGroqAPIWithHistory(
  messages: GroqMessage[],
  config = GroqConfigs.balanced,
  model?: string
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('No se encontró la API key de GROQ en las variables de entorno');
  }
  
  const modelToUse = model || 'llama-3.3-70b-versatile';
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  
  const body = {
    model: modelToUse,
    messages,
    temperature: config.temperature,
    top_p: config.top_p,
    max_tokens: config.max_tokens,
    stream: false
  };
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Error HTTP ${res.status}`);
    }
    
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || 'Sin respuesta';
    
  } catch (err: unknown) {
    throw new Error(`Error GROQ: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// Función para streaming (respuestas en tiempo real)
export async function* streamGroqAPI(
  prompt: string,
  config = GroqConfigs.balanced,
  model?: string,
  systemPrompt?: string
): AsyncGenerator<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('No se encontró la API key de GROQ en las variables de entorno');
  }
  
  const modelToUse = model || 'llama-3.3-70b-versatile';
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  
  const messages: GroqMessage[] = [];
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
    stream: true
  };
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Error HTTP ${res.status}`);
  }
  
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No se pudo iniciar el stream');
  
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed?.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {}
      }
    }
  }
}

// Utilidades compartidas
export function cleanAIGeneratedText(text: string) {
  if (!text) return "";
  return text
    .trim()
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/\n?```$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function createGroqSystemPrompt(role: string, task: string, context: string, instructions: string[], outputFormat?: string) {
  let prompt = `Eres ${role}. Tu tarea es ${task}.\n\n**CONTEXTO:**\n${context}\n\n**INSTRUCCIONES:**`;
  instructions.forEach((instruction, index) => {
    prompt += `\n${index + 1}. ${instruction}`;
  });
  if (outputFormat) {
    prompt += `\n\n**FORMATO DE SALIDA:**\n${outputFormat}`;
  }
  return prompt;
}
