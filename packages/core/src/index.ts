// Core AI functionality for Vue.js components
import {
  vueVersion,
  isOlderVue3,
  createNode,
  compatCreateElementBlock,
  compatCreateElementVNode,
  compatNormalizeClass,
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin,
  installCompatPlugin,
  createReactiveState,
  createCompatRef
} from './utils/vue-compat';

// Export Vue compatibility utilities
export {
  vueVersion,
  isOlderVue3,
  createNode,
  compatCreateElementBlock,
  compatCreateElementVNode,
  compatNormalizeClass,
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin,
  installCompatPlugin,
  createReactiveState,
  createCompatRef
};

// Export message types
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Export provider types
export type AIProvider = 'openai' | 'claude' | 'gemini' | 'huggingface' | 'ollama' | 'deepseek' | 'fallback';

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

// Main AIClient class
export class AIClient {
  private provider: AIProvider;
  private apiKey?: string;
  private model?: string;
  private baseUrl?: string;
  private organizationId?: string;

  constructor(options: AIClientOptions) {
    this.provider = options.provider;
    this.apiKey = options.apiKey;
    this.model = options.model;
    this.baseUrl = options.baseUrl;
    this.organizationId = options.organizationId;
  }

  // Chat functionality
  async chat(messages: Message[], options?: ChatOptions): Promise<string> {
    // This is a placeholder implementation
    // In a real implementation, this would call the appropriate provider API
    console.log(`Using provider: ${this.provider}`);
    console.log(`Messages: ${JSON.stringify(messages)}`);

    // Simulate a response
    return "This is a simulated response from the AI. In a real implementation, this would be a response from the provider API.";
  }

  // Streaming chat functionality
  async chatStream(messages: Message[], callbacks: StreamCallbacks, options?: ChatOptions): Promise<void> {
    // This is a placeholder implementation
    // In a real implementation, this would stream responses from the provider API
    callbacks.onStart?.();

    const response = "This is a simulated streaming response from the AI.";

    // Simulate streaming tokens
    for (const char of response) {
      callbacks.onToken?.(char);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    callbacks.onComplete?.(response);
  }
}

// Provider registry to store configurations
export const providerRegistry = new Map<string, any>();

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

// Default export
export default {
  AIClient,
  registerProviders,
  // Include compatibility utilities in default export
  vueVersion,
  isOlderVue3,
  createNode,
  compatCreateElementBlock,
  compatCreateElementVNode,
  compatNormalizeClass,
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin,
  installCompatPlugin,
  createReactiveState,
  createCompatRef
};
