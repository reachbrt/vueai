// Core AI functionality for Vue.js components
import vueCompat from './utils/vue-compat';

// Export Vue compatibility utilities
export const vueVersion = vueCompat.vueVersion;
export const isOlderVue3 = vueCompat.isOlderVue3;
export const createNode = vueCompat.createNode;
export const compatCreateElementBlock = vueCompat.compatCreateElementBlock;
export const compatCreateElementVNode = vueCompat.compatCreateElementVNode;
export const compatNormalizeClass = vueCompat.compatNormalizeClass;
export const createCompatComponent = vueCompat.createCompatComponent;
export const registerCompatComponent = vueCompat.registerCompatComponent;
export const createCompatPlugin = vueCompat.createCompatPlugin;
export const installCompatPlugin = vueCompat.installCompatPlugin;
export const createReactiveState = vueCompat.createReactiveState;
export const createCompatRef = vueCompat.createCompatRef;

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
    if (!this.apiKey && this.provider !== 'ollama') {
      console.warn(`No API key provided for ${this.provider}. Using fallback response.`);
      return this.getFallbackResponse(messages);
    }

    try {
      switch (this.provider) {
        case 'openai':
          return await this.callOpenAI(messages, options);
        case 'claude':
          return await this.callClaude(messages, options);
        case 'gemini':
          return await this.callGemini(messages, options);
        case 'ollama':
          return await this.callOllama(messages, options);
        default:
          return this.getFallbackResponse(messages);
      }
    } catch (error) {
      console.error(`Error calling ${this.provider} API:`, error);
      throw error;
    }
  }

  // Completion functionality for autosuggest
  async complete(prompt: string, options?: ChatOptions): Promise<{ text: string }> {
    // Convert prompt to a message
    const messages: Message[] = [
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.chat(messages, options);
      return { text: response };
    } catch (error) {
      console.error('Error in complete method:', error);
      return { text: '' };
    }
  }

  // Streaming chat functionality
  async chatStream(messages: Message[], callbacks: StreamCallbacks, options?: ChatOptions): Promise<void> {
    callbacks.onStart?.();

    if (!this.apiKey && this.provider !== 'ollama') {
      console.warn(`No API key provided for ${this.provider}. Using fallback response.`);
      return this.streamFallbackResponse(callbacks);
    }

    try {
      switch (this.provider) {
        case 'openai':
          await this.streamOpenAI(messages, callbacks, options);
          break;
        case 'claude':
          await this.streamClaude(messages, callbacks, options);
          break;
        case 'gemini':
          await this.streamGemini(messages, callbacks, options);
          break;
        case 'ollama':
          await this.streamOllama(messages, callbacks, options);
          break;
        default:
          await this.streamFallbackResponse(callbacks);
      }
    } catch (error) {
      console.error(`Error streaming from ${this.provider} API:`, error);
      callbacks.onError?.(error as Error);
    }
  }

  // OpenAI implementation
  private async callOpenAI(messages: Message[], options?: ChatOptions): Promise<string> {
    const url = this.baseUrl || 'https://api.openai.com/v1/chat/completions';
    const model = this.model || 'gpt-3.5-turbo';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.organizationId ? { 'OpenAI-Organization': this.organizationId } : {})
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens,
        top_p: options?.topP || 1,
        frequency_penalty: options?.frequencyPenalty || 0,
        presence_penalty: options?.presencePenalty || 0,
        stop: options?.stopSequences,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async streamOpenAI(messages: Message[], callbacks: StreamCallbacks, options?: ChatOptions): Promise<void> {
    const url = this.baseUrl || 'https://api.openai.com/v1/chat/completions';
    const model = this.model || 'gpt-3.5-turbo';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...(this.organizationId ? { 'OpenAI-Organization': this.organizationId } : {})
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens,
        top_p: options?.topP || 1,
        frequency_penalty: options?.frequencyPenalty || 0,
        presence_penalty: options?.presencePenalty || 0,
        stop: options?.stopSequences,
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let completeText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                callbacks.onToken?.(content);
                completeText += content;
              }
            } catch (e) {
              console.warn('Error parsing SSE message:', e);
            }
          }
        }
      }
    } finally {
      callbacks.onComplete?.(completeText);
    }
  }

  // Claude implementation
  private async callClaude(messages: Message[], options?: ChatOptions): Promise<string> {
    // Implement Claude API call
    return this.getFallbackResponse(messages);
  }

  private async streamClaude(messages: Message[], callbacks: StreamCallbacks, options?: ChatOptions): Promise<void> {
    // Implement Claude streaming
    await this.streamFallbackResponse(callbacks);
  }

  // Gemini implementation
  private async callGemini(messages: Message[], options?: ChatOptions): Promise<string> {
    // Implement Gemini API call
    return this.getFallbackResponse(messages);
  }

  private async streamGemini(messages: Message[], callbacks: StreamCallbacks, options?: ChatOptions): Promise<void> {
    // Implement Gemini streaming
    await this.streamFallbackResponse(callbacks);
  }

  // Ollama implementation
  private async callOllama(messages: Message[], options?: ChatOptions): Promise<string> {
    const url = `${this.baseUrl || 'http://localhost:11434'}/api/chat`;
    const model = this.model || 'llama3';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          options: {
            temperature: options?.temperature || 0.7,
            top_p: options?.topP || 1,
            frequency_penalty: options?.frequencyPenalty || 0,
            presence_penalty: options?.presencePenalty || 0,
            stop: options?.stopSequences || [],
            num_predict: options?.maxTokens || 1024
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data.message?.content || '';
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      throw error;
    }
  }

  private async streamOllama(messages: Message[], callbacks: StreamCallbacks, options?: ChatOptions): Promise<void> {
    const url = `${this.baseUrl || 'http://localhost:11434'}/api/chat`;
    const model = this.model || 'llama3';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: true,
          options: {
            temperature: options?.temperature || 0.7,
            top_p: options?.topP || 1,
            frequency_penalty: options?.frequencyPenalty || 0,
            presence_penalty: options?.presencePenalty || 0,
            stop: options?.stopSequences || [],
            num_predict: options?.maxTokens || 1024
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let completeText = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              const content = parsed.message?.content || '';
              if (content) {
                callbacks.onToken?.(content);
                completeText += content;
              }
            } catch (e) {
              console.warn('Error parsing Ollama stream message:', e);
            }
          }
        }
      } finally {
        callbacks.onComplete?.(completeText);
      }
    } catch (error) {
      console.error('Error streaming from Ollama API:', error);
      callbacks.onError?.(error as Error);
    }
  }

  // Fallback implementations
  private getFallbackResponse(messages: Message[]): string {
    const userMessage = messages[messages.length - 1].content.toLowerCase();

    if (userMessage.includes('hello') || userMessage.includes('hi')) {
      return "Hello! I'm an AI assistant. How can I help you today?";
    } else if (userMessage.includes('help')) {
      return "I'm here to help! You can ask me questions, request information, or just chat.";
    } else {
      return "I'm an AI assistant powered by the @aivue library. To get real responses, please provide a valid API key for your chosen provider.";
    }
  }

  private async streamFallbackResponse(callbacks: StreamCallbacks): Promise<void> {
    const response = "I'm an AI assistant powered by the @aivue library. To get real responses, please provide a valid API key for your chosen provider.";

    // Simulate streaming tokens
    for (const char of response) {
      callbacks.onToken?.(char);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 30));
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
