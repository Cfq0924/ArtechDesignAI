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
    baseUrl: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: '', // 从环境变量或用户输入获取
    model: 'deepseek-chat',
    enabled: true,
    systemPrompt: '你是一位专业的建筑渲染专家，擅长生成高质量的建筑渲染 Prompt。请直接输出 Prompt 内容，不要额外的解释说明。',
    temperature: 0.7,
    maxTokens: 1000,
  },
  nanoBanana: {
    baseUrl: 'https://api.nanobanana.io/v2/render',
    apiKey: '', // 从环境变量或用户输入获取
    enabled: true,
    imageParam: 'image',
    promptParam: 'prompt',
  },
};

export function updateApiKey(provider: 'deepseek' | 'nanoBanana', key: string): void {
  config[provider].apiKey = key;
}

export function getApiConfig(provider: 'deepseek' | 'nanoBanana'): ApiProviderConfig {
  return config[provider];
}
