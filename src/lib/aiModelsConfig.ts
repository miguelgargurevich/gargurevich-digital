/**
 * Configuración centralizada de modelos de IA
 * Gestiona todos los modelos utilizados en la aplicación
 */

export type AIProvider = 'gemini' | 'groq' | 'openai' | 'anthropic' | 'nvidia' | 'openrouter';

export interface AIModelConfig {
  service: 'chat' | 'vision' | 'video' | 'audio';
  modelId: string;
  modelName: string;
  provider: AIProvider;
  description?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  provider: AIProvider;
  available: boolean;
  category?: 'text' | 'reasoning' | 'vision' | 'summary' | 'audio' | 'fast' | 'balanced' | 'advanced';
  tags?: string[];
}

// Modelos disponibles por servicio
export const AVAILABLE_MODELS: Record<AIModelConfig['service'], ModelOption[]> = {
  chat: [
    {
      id: 'llama-3.3-70b-versatile',
      name: 'LLaMA 3.3 70B Versatile',
      description: 'GROQ - Modelo por defecto para chat en toda la app',
      provider: 'groq',
      available: true,
      category: 'reasoning',
      tags: ['groq', 'llama', 'default', 'chat', 'razonamiento']
    },
    {
      id: 'meta/llama-3.3-70b-instruct',
      name: 'LLaMA 3.3 70B (NVIDIA)',
      description: 'NVIDIA NIM - Alternativa estable para chat avanzado',
      provider: 'nvidia',
      available: true,
      category: 'reasoning',
      tags: ['nvidia', 'llama', 'chat']
    },
    {
      id: 'openrouter/openai/gpt-4o-mini',
      name: 'OpenRouter · GPT-4o Mini',
      description: 'OpenRouter - Rápido, económico y estable para chat diario',
      provider: 'openrouter',
      available: true,
      category: 'fast',
      tags: ['openrouter', 'openai', 'rápido']
    },
    {
      id: 'openrouter/anthropic/claude-3.5-sonnet',
      name: 'OpenRouter · Claude 3.5 Sonnet',
      description: 'OpenRouter - Excelente calidad para razonamiento y redacción',
      provider: 'openrouter',
      available: true,
      category: 'reasoning',
      tags: ['openrouter', 'anthropic', 'razonamiento']
    },
    {
      id: 'openrouter/meta-llama/llama-3.3-70b-instruct',
      name: 'OpenRouter · Llama 3.3 70B',
      description: 'OpenRouter - Balance de velocidad y capacidad',
      provider: 'openrouter',
      available: true,
      category: 'balanced',
      tags: ['openrouter', 'llama', 'balanceado']
    },
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro',
      description: 'Última generación avanzada, razonamiento superior (Recomendado)',
      provider: 'gemini',
      available: true,
      category: 'reasoning',
      tags: ['razonamiento avanzado', 'análisis profundo', 'nueva generación', 'recomendado']
    },
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: 'Última generación estable, muy rápido',
      provider: 'gemini',
      available: true,
      category: 'fast',
      tags: ['rápido', 'eficiente', 'nueva generación']
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      description: 'Rápido y eficiente',
      provider: 'gemini',
      available: true,
      category: 'balanced',
      tags: ['rápido', 'estable']
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      description: 'Análisis complejos y detallados',
      provider: 'gemini',
      available: true,
      category: 'reasoning',
      tags: ['razonamiento', 'análisis profundo', 'preciso']
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      description: 'OpenAI GPT-4o - El más capaz, multimodal, razonamiento avanzado',
      provider: 'openai',
      available: true,
      category: 'reasoning',
      tags: ['OpenAI', 'GPT-4o', 'multimodal', 'razonamiento']
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      description: 'OpenAI GPT-4o Mini - Rápido y económico',
      provider: 'openai',
      available: true,
      category: 'fast',
      tags: ['OpenAI', 'GPT-4o', 'rápido']
    },
    {
      id: 'o1-mini',
      name: 'o1-mini',
      description: 'OpenAI o1-mini - Razonamiento rápido paso a paso',
      provider: 'openai',
      available: true,
      category: 'reasoning',
      tags: ['OpenAI', 'razonamiento', 'o1']
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'OpenAI GPT-4',
      provider: 'openai',
      available: false,
      category: 'reasoning',
      tags: ['razonamiento', 'multimodal']
    },
    // GROQ Models - Ultra fast inference
    {
      id: 'llama-3.1-8b-instant',
      name: 'LLaMA 3.1 8B Instant',
      description: 'GROQ - Ultra rápido, respuestas instantáneas',
      provider: 'groq',
      available: true,
      category: 'fast',
      tags: ['instantáneo', 'eficiente', 'GROQ', 'LLaMA']
    },
    {
      id: 'mixtral-8x7b-32768',
      name: 'Mixtral 8x7B',
      description: 'GROQ - Mezcla de expertos, buen balance',
      provider: 'groq',
      available: true,
      category: 'balanced',
      tags: ['MoE', 'balance', 'GROQ', 'Mixtral']
    },
    {
      id: 'gemma2-9b-it',
      name: 'Gemma 2 9B',
      description: 'GROQ - Modelo de Google, compacto y eficiente',
      provider: 'groq',
      available: true,
      category: 'fast',
      tags: ['compacto', 'eficiente', 'GROQ', 'Gemma']
    }
  ],
  vision: [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: 'Última generación estable (Recomendado)',
      provider: 'gemini',
      available: true,
      category: 'vision',
      tags: ['imágenes', 'rápido', 'análisis visual', 'nueva generación']
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      description: 'Versión anterior estable',
      provider: 'gemini',
      available: true,
      category: 'vision',
      tags: ['imágenes', 'rápido', 'estable']
    },
    {
      id: 'gemini-1.5-flash-8b',
      name: 'Gemini 1.5 Flash 8B',
      description: 'Ligero, ideal para análisis rápidos',
      provider: 'gemini',
      available: true,
      category: 'vision',
      tags: ['imágenes', 'ligero', 'rápido']
    },
    {
      id: 'gemini-pro-vision',
      name: 'Gemini Pro Vision',
      description: 'Modelo anterior (por compatibilidad)',
      provider: 'gemini',
      available: true,
      category: 'vision',
      tags: ['imágenes', 'legacy']
    }
  ],
  video: [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      description: 'Última generación estable',
      provider: 'gemini',
      available: true,
      category: 'summary',
      tags: ['video', 'resumen', 'rápido', 'nueva generación']
    },
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      description: 'Para generación de resúmenes (estable)',
      provider: 'gemini',
      available: true,
      category: 'summary',
      tags: ['video', 'resumen', 'rápido']
    },
    {
      id: 'gemini-1.5-pro',
      name: 'Gemini 1.5 Pro',
      description: 'Análisis profundo',
      provider: 'gemini',
      available: true,
      category: 'reasoning',
      tags: ['video', 'análisis profundo', 'detallado']
    }
  ],
  audio: [
    {
      id: 'whisper-1',
      name: 'Whisper Large V3',
      description: 'Transcripción de audio/video',
      provider: 'openai',
      available: true,
      category: 'audio',
      tags: ['audio', 'transcripción', 'preciso']
    }
  ]
};

// Configuración por defecto
export const DEFAULT_MODELS: Record<AIModelConfig['service'], string> = {
  chat: 'llama-3.3-70b-versatile',
  vision: 'gemini-2.5-flash',
  video: 'gemini-2.5-flash',
  audio: 'whisper-1'
};

// Clase para gestionar modelos
class AIModelsManager {
  private static instance: AIModelsManager;
  private readonly STORAGE_KEY = 'ai_models_config';

  private constructor() {}

  static getInstance(): AIModelsManager {
    if (!AIModelsManager.instance) {
      AIModelsManager.instance = new AIModelsManager();
    }
    return AIModelsManager.instance;
  }

  // Obtener configuración actual
  getConfig(): Record<AIModelConfig['service'], string> {
    if (typeof window === 'undefined') {
      return DEFAULT_MODELS;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const config = JSON.parse(stored);
        // Validar que todos los servicios estén presentes
        return {
          ...DEFAULT_MODELS,
          ...config
        };
      }
    } catch (error) {
      console.error('Error loading AI models config:', error);
    }

    return DEFAULT_MODELS;
  }

  // Obtener modelo para un servicio específico
  getModel(service: AIModelConfig['service']): string {
    const config = this.getConfig();
    return config[service] || DEFAULT_MODELS[service];
  }

  // Obtener información completa del modelo
  getModelInfo(service: AIModelConfig['service']): ModelOption | null {
    const modelId = this.getModel(service);
    const available = AVAILABLE_MODELS[service];
    return available.find(m => m.id === modelId) || null;
  }

  // Actualizar modelo para un servicio
  setModel(service: AIModelConfig['service'], modelId: string): boolean {
    try {
      const config = this.getConfig();
      
      // Si el modelId está vacío o es inválido, rechazar
      if (!modelId || typeof modelId !== 'string') {
        console.error(`Invalid model ID for service ${service}`);
        return false;
      }

      // Permitir cualquier modelo (para soportar modelos dinámicos de la API)
      // Solo validar que esté en AVAILABLE_MODELS si es un modelo hardcodeado
      const available = AVAILABLE_MODELS[service];
      const isHardcodedModel = available.some(m => m.id === modelId);
      
      if (isHardcodedModel) {
        // Si es un modelo hardcodeado, verificar que esté disponible
        const modelExists = available.some(m => m.id === modelId && m.available);
        if (!modelExists) {
          console.error(`Model ${modelId} not available for service ${service}`);
          return false;
        }
      }
      // Si no es hardcodeado, asumimos que viene de la API y es válido

      config[service] = modelId;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      }

      // Dispatch evento para notificar cambios
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ai-models-updated', { 
          detail: { service, modelId } 
        }));
      }

      return true;
    } catch (error) {
      console.error('Error saving AI model config:', error);
      return false;
    }
  }

  // Resetear a valores por defecto
  reset(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('ai-models-updated', { 
        detail: { reset: true } 
      }));
    }
  }

  // Obtener resumen de configuración actual
  getSummary(): Array<{
    service: string;
    serviceName: string;
    model: ModelOption | null;
  }> {
    const serviceNames: Record<AIModelConfig['service'], string> = {
      chat: 'Chat IA',
      vision: 'Análisis de Imágenes',
      video: 'Resumen de Videos',
      audio: 'Transcripción de Audio'
    };

    return Object.keys(DEFAULT_MODELS).map(service => ({
      service,
      serviceName: serviceNames[service as AIModelConfig['service']],
      model: this.getModelInfo(service as AIModelConfig['service'])
    }));
  }
}

export const aiModelsManager = AIModelsManager.getInstance();

// Hook de React para usar en componentes
export function useAIModels() {
  const [config, setConfig] = React.useState(aiModelsManager.getConfig());
  const [summary, setSummary] = React.useState(aiModelsManager.getSummary());

  React.useEffect(() => {
    const handleUpdate = () => {
      setConfig(aiModelsManager.getConfig());
      setSummary(aiModelsManager.getSummary());
    };

    window.addEventListener('ai-models-updated', handleUpdate);
    return () => window.removeEventListener('ai-models-updated', handleUpdate);
  }, []);

  return {
    config,
    getModel: (service: AIModelConfig['service']) => aiModelsManager.getModel(service),
    getModelInfo: (service: AIModelConfig['service']) => aiModelsManager.getModelInfo(service),
    setModel: (service: AIModelConfig['service'], modelId: string) => aiModelsManager.setModel(service, modelId),
    reset: () => aiModelsManager.reset(),
    summary
  };
}

// React import para el hook
import React from 'react';
