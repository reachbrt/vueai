import { AiChatWindow } from './components/AiChatWindow';
import { useChatEngine } from './hooks/useChatEngine';

// Export types
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ApiConfig {
  provider: string;
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

export interface UseChatEngineOptions {
  provider: string;
  apiKey?: string;
  model?: string;
  systemPrompt?: string;
  streaming?: boolean;
  initialMessages?: Message[];
}

export interface ChatEngineResult {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  resetConversation: () => void;
}

// Export components and hooks
export { AiChatWindow, useChatEngine };

// Default export
export default {
  AiChatWindow,
  useChatEngine
};
