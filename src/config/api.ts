export interface ApiProviderConfig {
  baseUrl: string;
  apiKey: string;
  model?: string;
  enabled: boolean;
}

export interface DeepSeekConfig extends ApiProviderConfig {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
}

export interface NanoBananaConfig extends ApiProviderConfig {
  imageParam: string;
  promptParam: string;
}

export interface AppConfig {
  deepseek: DeepSeekConfig;
  nanoBanana: NanoBananaConfig;
}

export const config: AppConfig = {
  deepseek: {
    baseUrl: import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1/chat/completions',
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    model: import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat',
    enabled: true,
    systemPrompt: '你是一位专业的建筑渲染专家，擅长生成高质量的建筑渲染 Prompt。请直接输出 Prompt 内容，不要额外的解释说明。',
    temperature: 0.7,
    maxTokens: 1000,
  },
  nanoBanana: {
    baseUrl: import.meta.env.VITE_NANO_BANANA_BASE_URL || 'https://api.nanobanana.io/v2/render',
    apiKey: import.meta.env.VITE_NANO_BANANA_API_KEY || '',
    enabled: true,
    imageParam: 'image',
    promptParam: 'prompt',
  },
};

export function getApiConfig(provider: 'deepseek' | 'nanoBanana'): ApiProviderConfig {
  return config[provider];
}
