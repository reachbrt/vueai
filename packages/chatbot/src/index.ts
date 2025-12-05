// AI-powered chat components for Vue.js
import { App } from 'vue';
import { AIClient } from '@aivue/core';
import AiChatWindowComponent from './components/AiChatWindow.vue';
import AiChatToggleComponent from './components/AiChatToggle.vue';
import AiChatRAGComponent from './components/AiChatRAG.vue';
import { useChatEngine as useChatEngineComposable, Message, ChatOptions, ChatState } from './composables/useChatEngine';
import { useRAG as useRAGComposable, UseRAGOptions, UseRAGReturn } from './composables/useRAG';
import { formatMarkdown } from './utils/markdown';
import * as ragUtils from './utils/rag';

// Import Vue compatibility utilities from core
import {
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin
} from '@aivue/core';

// Re-export types
export type { Message, ChatOptions, ChatState };
export type { UseRAGOptions, UseRAGReturn };
export type {
  RAGDocument,
  DocumentChunk,
  RetrievalResult,
  ChunkingOptions
} from './utils/rag';

// Export components with compatibility layer
export const AiChatWindow = createCompatComponent(AiChatWindowComponent);
export const AiChatToggle = createCompatComponent(AiChatToggleComponent);
export const AiChatRAG = createCompatComponent(AiChatRAGComponent);

// Export composables
export const useChatEngine = useChatEngineComposable;
export const useRAG = useRAGComposable;

// Export utilities
export const utils = {
  formatMarkdown,
  rag: ragUtils
};

// Vue Plugin with compatibility layer
export const AiChatPlugin = createCompatPlugin({
  install(app: App) {
    // Register components globally using the compatibility helper
    registerCompatComponent(app, 'AiChatWindow', AiChatWindowComponent);
    registerCompatComponent(app, 'AiChatToggle', AiChatToggleComponent);
    registerCompatComponent(app, 'AiChatRAG', AiChatRAGComponent);
  }
});

// No need to re-export Vue compatibility utilities

// Default export
export default {
  AiChatWindow,
  AiChatToggle,
  AiChatRAG,
  useChatEngine,
  useRAG,
  utils,
  AiChatPlugin
};
