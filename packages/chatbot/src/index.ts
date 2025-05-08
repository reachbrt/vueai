// AI-powered chat components for Vue.js
import { AIClient } from '@aivue/core';
import AiChatWindowComponent from './components/AiChatWindow.vue';
import { useChatEngine as useChatEngineComposable, Message, ChatOptions, ChatState } from './composables/useChatEngine';
import { formatMarkdown } from './utils/markdown';

// Re-export types
export type { Message, ChatOptions, ChatState };

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
