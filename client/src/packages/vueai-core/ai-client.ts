import type { AIClientOptions, ChatOptions, Message, StreamCallbacks } from "./index";
import { OpenAIProvider } from "./providers/openai";
import { ClaudeProvider } from "./providers/claude";
import { GeminiProvider } from "./providers/gemini";
import { HuggingFaceProvider } from "./providers/huggingface";
import { OllamaProvider } from "./providers/ollama";
import { DeepSeekProvider } from "./providers/deepseek";
import { FallbackProvider } from "./providers/fallback";

export class AIClient {
  private options: AIClientOptions;
  private provider: any;
  private useFallback: boolean = false;

  constructor(options: AIClientOptions) {
    this.options = {
      ...options,
      apiKey: options.apiKey || this.getProviderApiKey(options.provider)
    };
    
    // Check if we have an API key or if it's a provider that doesn't need one
    const needsApiKey = this._providerNeedsApiKey(options.provider);
    this.useFallback = needsApiKey && !this.options.apiKey;
    
    if (this.useFallback) {
      console.log(`No API key for ${options.provider}, using fallback provider`);
      this.provider = new FallbackProvider(this.options);
    } else {
      this.provider = this._resolveProvider(options.provider);
    }
  }

  private _providerNeedsApiKey(providerName: string): boolean {
    // Ollama runs locally and doesn't require an API key
    return !['ollama'].includes(providerName.toLowerCase());
  }

  private _resolveProvider(providerName: string) {
    switch (providerName.toLowerCase()) {
      case 'openai':
        return new OpenAIProvider(this.options);
      case 'claude':
      case 'anthropic':
        return new ClaudeProvider(this.options);
      case 'gemini':
      case 'google':
        return new GeminiProvider(this.options);
      case 'huggingface':
      case 'hf':
        return new HuggingFaceProvider(this.options);
      case 'ollama':
        return new OllamaProvider(this.options);
      case 'deepseek':
        return new DeepSeekProvider(this.options);
      default:
        console.warn(`Provider ${providerName} not recognized, using fallback`);
        return new FallbackProvider(this.options);
    }
  }

  private getProviderApiKey(provider: string): string {
    // Get API keys from environment
    switch (provider.toLowerCase()) {
      case 'openai':
        return import.meta.env.VITE_OPENAI_API_KEY || '';
      case 'claude':
      case 'anthropic':
        return import.meta.env.VITE_ANTHROPIC_API_KEY || '';
      case 'gemini':
      case 'google':
        return import.meta.env.VITE_GEMINI_API_KEY || '';
      case 'huggingface':
      case 'hf':
        return import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
      case 'deepseek':
        return import.meta.env.VITE_DEEPSEEK_API_KEY || '';
      case 'ollama':
        // Ollama doesn't need an API key, but might need a custom base URL
        return 'local'; // Return non-empty string to indicate provider is available
      default:
        return '';
    }
  }

  async chat(messages: Message[], options?: ChatOptions): Promise<Message> {
    try {
      return await this.provider.chat(messages, options);
    } catch (error: any) {
      console.error('AIClient chat error:', error);
      throw error;
    }
  }
  
  async streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void> {
    try {
      return await this.provider.streamChat(messages, callbacks);
    } catch (error: any) {
      console.error('AIClient streamChat error:', error);
      callbacks.onError?.(error as Error);
      throw error;
    }
  }
  
  async embeddings(text: string | string[]): Promise<number[][]> {
    try {
      return await this.provider.embeddings(text);
    } catch (error: any) {
      console.error('AIClient embeddings error:', error);
      throw error;
    }
  }

  // Utility functions
  async generateSuggestions(query: string, options?: { count?: number; context?: string }): Promise<Array<{ text: string; score: number }>> {
    try {
      const count = options?.count || 5;
      const context = options?.context || '';
      
      const messages: Message[] = [
        { role: 'system', content: `You are a helpful assistant that generates search suggestions. ${context ? `Focus suggestions on: ${context}` : ''}` },
        { role: 'user', content: `Generate ${count} search suggestions related to: "${query}". Return a JSON array of objects with "text" and "score" properties. Scores should be between 50-99 and represent relevance percentage.` }
      ];
      
      const response = await this.chat(messages, {
        temperature: 0.7,
        maxTokens: 150
      });
      
      try {
        // Extract JSON from response
        const content = response.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          const suggestions = JSON.parse(jsonMatch[0]);
          return suggestions.slice(0, count);
        }
        
        return [];
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        return [];
      }
    } catch (error) {
      console.error('AIClient generateSuggestions error:', error);
      return [];
    }
  }

  async validateFormField(fieldName: string, value: string, rules: string[]): Promise<{ isValid: boolean; errorMessage?: string; suggestion?: string }> {
    try {
      const messages: Message[] = [
        { role: 'system', content: 'You are a form validation assistant. Analyze the input for the given field and return a JSON with validation results.' },
        { role: 'user', content: `Validate the following input for field "${fieldName}": "${value}". Rules: ${rules.join(', ')}. Return JSON with "isValid" (boolean), "errorMessage" (string if invalid), and "suggestion" (string with fixed value if possible).` }
      ];
      
      const response = await this.chat(messages, {
        temperature: 0.3,
        maxTokens: 150
      });
      
      try {
        // Extract JSON from response
        const content = response.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        
        return { isValid: false, errorMessage: 'Could not validate field' };
      } catch (error) {
        console.error('Error parsing JSON response:', error);
        return { isValid: false, errorMessage: 'Validation failed' };
      }
    } catch (error) {
      console.error('AIClient validateFormField error:', error);
      return { isValid: false, errorMessage: 'Validation service unavailable' };
    }
  }
}
