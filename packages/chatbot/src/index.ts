// AI-powered chat components for Vue.js
import { App } from 'vue';
import {
  AIClient,
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin,
  installCompatPlugin
} from '@aivue/core';
import AiChatWindowComponent from './components/AiChatWindow.vue';
import AiChatToggleComponent from './components/AiChatToggle.vue';
import { useChatEngine as useChatEngineComposable, Message, ChatOptions, ChatState } from './composables/useChatEngine';
import { formatMarkdown } from './utils/markdown';

// Re-export types
export type { Message, ChatOptions, ChatState };

// Export components with compatibility layer
export const AiChatWindow = createCompatComponent(AiChatWindowComponent);
export const AiChatToggle = createCompatComponent(AiChatToggleComponent);

// Export composables
export const useChatEngine = useChatEngineComposable;

// Export utilities
export const utils = {
  formatMarkdown
};

// Vue Plugin with compatibility layer
export const AiChatPlugin = createCompatPlugin({
  install(app: App) {
    // Register components globally using the compatibility helper
    registerCompatComponent(app, 'AiChatWindow', AiChatWindowComponent);
    registerCompatComponent(app, 'AiChatToggle', AiChatToggleComponent);
  }
});

// Re-export Vue compatibility utilities from core
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
} from '@aivue/core';

// Default export
export default {
  AiChatWindow,
  AiChatToggle,
  useChatEngine,
  utils,
  AiChatPlugin
};
