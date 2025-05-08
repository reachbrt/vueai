// AI-powered chat components for Vue.js
import { AIClient, Message as CoreMessage } from '@aivue/core';
import AiChatWindowComponent from './components/AiChatWindow.vue';
import { useChatEngine as useChatEngineComposable } from './composables/useChatEngine';
import { formatMarkdown } from './utils/markdown';

// Export types
export interface Message extends CoreMessage {
  id?: string;
  timestamp?: Date;
}

export interface ChatOptions {
  client: AIClient;
  systemPrompt?: string;
  streaming?: boolean;
  initialMessages?: Message[];
  persistenceKey?: string | null;
  maxMessages?: number;
  onError?: ((error: Error) => void) | null;
}

// Export components
export const AiChatWindow = AiChatWindowComponent;

// Export composables
export const useChatEngine = useChatEngineComposable;

// Export utilities
export const utils = {
  formatMarkdown
};

// Default export
export default {
  AiChatWindow,
  useChatEngine,
  utils
};
