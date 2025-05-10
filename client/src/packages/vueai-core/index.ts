import { AIClient } from "./ai-client";

// Export core functionality
export { AIClient };

// Export provider types
export type AIProvider = 'openai' | 'claude' | 'local';

// Export message types
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Export options types
export interface AIClientOptions {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  organizationId?: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
}

export interface StreamCallbacks {
  onStart?: () => void;
  onToken?: (token: string) => void;
  onComplete?: (completeText: string) => void;
  onError?: (error: Error) => void;
}

// Register providers function
export type ProviderConfig = {
  [key: string]: {
    apiKey?: string;
    defaultModel?: string;
    baseUrl?: string;
    organizationId?: string;
  }
};

export function registerProviders(providers: ProviderConfig): void {
  // Store provider configurations
  for (const [providerName, config] of Object.entries(providers)) {
    providerRegistry.set(providerName, config);
  }
}

// Provider registry to store configurations
export const providerRegistry = new Map<string, any>();

// Default export
export default {
  AIClient,
  registerProviders
};
