// AI-powered suggestion components for Vue.js
import { App } from 'vue';
import { AIClient } from '@aivue/core';
import AutosuggestComponent from './components/Autosuggest.vue';
import useAutosuggestComposable from './composables/useAutosuggest';

// Export suggestion item type
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

// Import Vue compatibility utilities from core
import {
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin
} from '@aivue/core';

// Export components with compatibility layer
export const Autosuggest = createCompatComponent(AutosuggestComponent);
export const AiAutosuggest = Autosuggest; // Alias for backward compatibility

// Vue Plugin with compatibility layer
export const AutosuggestPlugin = createCompatPlugin({
  install(app: App) {
    // Register components globally using the compatibility helper
    registerCompatComponent(app, 'Autosuggest', AutosuggestComponent);
    registerCompatComponent(app, 'AiAutosuggest', AutosuggestComponent);
  }
});

// Export composables
export const useAutosuggest = useAutosuggestComposable;

// Default export
export default {
  Autosuggest,
  AiAutosuggest,
  useAutosuggest,
  AutosuggestPlugin
};
