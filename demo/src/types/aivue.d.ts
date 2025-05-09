declare module '@aivue/core' {
  export interface AIClientOptions {
    provider: string;
    apiKey?: string;
    model?: string;
    baseUrl?: string;
    organizationId?: string;
  }

  export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
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

  export class AIClient {
    constructor(options: AIClientOptions);
    chat(messages: Message[], options?: ChatOptions): Promise<string>;
    chatStream(messages: Message[], callbacks: StreamCallbacks, options?: ChatOptions): Promise<void>;
  }

  export function initializeAI(options?: any): any;
  export function registerProviders(providers: Record<string, any>): void;
  export const providerRegistry: Map<string, any>;
}

declare module '@aivue/chatbot' {
  import { AIClient, Message } from '@aivue/core';
  import { DefineComponent } from 'vue';

  export const AiChatWindow: DefineComponent<any, any, any>;
  export const AiChatToggle: DefineComponent<any, any, any>;

  export interface ChatEngineOptions {
    client: AIClient;
    systemPrompt?: string;
    streaming?: boolean;
    initialMessages?: Message[];
    onError?: (error: Error) => void;
  }

  export interface ChatEngineResult {
    messages: any;
    isLoading: any;
    error: any;
    sendMessage: (message: string) => Promise<void>;
    resetMessages: () => void;
    addSystemMessage: (message: string) => void;
  }

  export function useChatEngine(options: ChatEngineOptions): ChatEngineResult;

  export const utils: {
    formatMarkdown: (text: string) => string;
  };
}

declare module '@aivue/autosuggest' {
  import { AIClient } from '@aivue/core';
  import { DefineComponent } from 'vue';

  export const AiAutosuggest: DefineComponent<any, any, any>;

  export interface SuggestionItem {
    text: string;
    score: number;
    metadata?: Record<string, any>;
  }

  export interface AutosuggestOptions {
    client: AIClient;
    debounce?: number;
    minLength?: number;
    maxSuggestions?: number;
    context?: string;
    onError?: ((error: Error) => void) | null;
  }

  export function useAutosuggest(options: AutosuggestOptions): {
    suggestions: SuggestionItem[];
    loading: boolean;
    error: Error | null;
    getSuggestions: (query: string) => Promise<SuggestionItem[]>;
    reset: () => void;
  };
}

declare module '@aivue/smartform' {
  import { AIClient } from '@aivue/core';
  import { DefineComponent } from 'vue';

  export const AiSmartForm: DefineComponent<any, any, any>;

  export interface SmartFormSchema {
    [field: string]: {
      type: string;
      aiValidation?: boolean;
      selfHeal?: boolean;
      required?: boolean;
      label?: string;
      placeholder?: string;
      options?: Array<{ value: string; label: string }>;
      min?: number;
      max?: number;
    };
  }

  export function useSmartForm(schema: SmartFormSchema): {
    formData: Record<string, any>;
    errors: Record<string, string>;
    handleChange: (field: string, value: any) => void;
    validate: (field?: string) => Promise<boolean>;
    fixWithAI: (field: string) => Promise<void>;
    reset: () => void;
    submitForm: () => Promise<boolean>;
  };
}
