// Utilidades para integración con Gemini IA (frontend)
// Funciones centralizadas para llamadas a la API de Google Gemini

import { aiModelsManager } from './aiModelsConfig';

export const GeminiConfigs = {
  creative: {
    temperature: 0.9,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 4096,
  },
  balanced: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 4096,
  },
  precise: {
    temperature: 0.3,
    topK: 20,
    topP: 0.8,
    maxOutputTokens: 2048,
  },
  analysis: {
    temperature: 0.2,
    topK: 10,
    topP: 0.8,
    maxOutputTokens: 1024,
  }
};

export async function callGeminiAPI(prompt: string, config = GeminiConfigs.balanced, model?: string) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('No se encontró la API key de Gemini en las variables de entorno');
  }
  
  // Si no se proporciona modelo, usar el configurado para chat
  const modelToUse = model || aiModelsManager.getModel('chat');
  
  // Elimina el prefijo 'models/' si está presente
  const modelName = modelToUse.startsWith('models/') ? modelToUse.replace('models/', '') : modelToUse;
  
  // Lista de modelos a intentar (fallback si hay rate limit)
  const modelsToTry = [modelName];
  
  // Agregar fallback models si el modelo principal falla
  if (!modelName.includes('flash')) {
    modelsToTry.push('gemini-1.5-flash'); // Flash suele tener más cuota disponible
  }
  if (modelName !== 'gemini-1.5-pro') {
    modelsToTry.push('gemini-1.5-pro');
  }
  
  let lastError = '';
  
  for (const currentModel of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
    const body: { contents: { parts: { text: string }[] }[]; generationConfig: typeof config } = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: config
    };
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!res.ok) {
        if (res.status === 429) {
          console.log(`[Gemini] Rate limit en ${currentModel}, intentando siguiente modelo...`);
          lastError = 'La API de Gemini está sobrecargada. ';
          // Pequeña pausa antes de intentar el siguiente modelo
          await new Promise(resolve => setTimeout(resolve, 500));
          continue; // Intentar siguiente modelo
        }
        if (res.status === 404) {
          console.log(`[Gemini] Modelo ${currentModel} no encontrado (404), intentando siguiente modelo...`);
          lastError = `Modelo ${currentModel} no disponible. `;
          continue; // Intentar siguiente modelo
        }
        if (res.status === 400) {
          // Intentar parsear el error para ver si es un problema del modelo
          try {
            const errorData = await res.json();
            if (errorData?.error?.message?.includes('not found') || 
                errorData?.error?.message?.includes('is not supported')) {
              console.log(`[Gemini] Modelo ${currentModel} no soportado, intentando siguiente...`);
              lastError = `Modelo ${currentModel} no soportado. `;
              continue;
            }
          } catch {}
          return 'La petición a Gemini es inválida. Revisa los datos enviados.';
        }
        if (res.status === 503) {
          lastError = 'El servicio de Gemini no está disponible temporalmente. ';
          continue; // Intentar siguiente modelo
        }
        // Para otros errores, intentar siguiente modelo también
        console.log(`[Gemini] Error ${res.status} en ${currentModel}, intentando siguiente modelo...`);
        lastError = `Error ${res.status} con modelo ${currentModel}. `;
        continue;
      }
      
      const data = await res.json();
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        // Si usamos un modelo de fallback, indicarlo sutilmente
        if (currentModel !== modelName) {
          console.log(`[Gemini] ✅ Respuesta obtenida con modelo alternativo: ${currentModel}`);
        }
        return data.candidates[0].content.parts[0].text;
      }
      if (data?.error?.message) {
        return `Error Gemini: ${data.error.message}`;
      }
      return `Respuesta sin texto: ${JSON.stringify(data, null, 2)}`;
      
    } catch (err) {
      console.log(`[Gemini] Error de conexión con ${currentModel}:`, err);
      lastError = 'No se pudo conectar con la API de Gemini. ';
      continue; // Intentar siguiente modelo
    }
  }
  
  // Si todos los modelos fallaron
  return `${lastError}Todos los modelos están ocupados. Por favor, intenta nuevamente en unos segundos.`;
}

export function cleanAIGeneratedText(text: string) {
  if (!text) return "";
  return text
    .trim()
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/\n?```$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function createSystemPrompt(role: string, task: string, context: string, instructions: string[], outputFormat?: string) {
  let prompt = `Eres ${role}. Tu tarea es ${task}.\n\n**CONTEXTO:**\n${context}\n\n**INSTRUCCIONES:**`;
  instructions.forEach((instruction, index) => {
    prompt += `\n${index + 1}. ${instruction}`;
  });
  if (outputFormat) {
    prompt += `\n\n**FORMATO DE SALIDA:**\n${outputFormat}`;
  }
  return prompt;
}
