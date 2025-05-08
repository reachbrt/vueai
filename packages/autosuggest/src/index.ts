// AI-powered suggestion components for Vue.js
import { App } from 'vue';
import {
  AIClient,
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin
} from '@aivue/core';
import AutosuggestComponent from './components/Autosuggest.vue';
import { useAutosuggest as useAutosuggestComposable } from './composables/useAutosuggest';

// Export types
export interface SuggestionItem {
  text: string;
  score: number;
}

export interface AutosuggestOptions {
  client: AIClient;
  debounce?: number;
  minLength?: number;
  maxSuggestions?: number;
  context?: string;
  onError?: ((error: Error) => void) | null;
}

// Export components with compatibility layer
export const Autosuggest = createCompatComponent(AutosuggestComponent);

// Vue Plugin with compatibility layer
export const AutosuggestPlugin = createCompatPlugin({
  install(app: App) {
    // Register components globally using the compatibility helper
    registerCompatComponent(app, 'Autosuggest', AutosuggestComponent);
  }
});

// Export composables
export const useAutosuggest = useAutosuggestComposable;

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
  Autosuggest,
  useAutosuggest,
  AutosuggestPlugin
};
