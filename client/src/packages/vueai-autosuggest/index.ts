import { Autosuggest } from './components/Autosuggest';
import { useAutosuggest } from './hooks/useAutosuggest';

// Export types
export interface SuggestionItem {
  text: string;
  score: number;
}

export interface AutosuggestOptions {
  provider: string;
  apiKey?: string;
  model?: string;
  context?: string;
  debounce?: number;
  maxSuggestions?: number;
}

export interface UseAutosuggestResult {
  suggestions: SuggestionItem[];
  isLoading: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}

// Export components and hooks
export { Autosuggest, useAutosuggest };

// Default export
export default {
  Autosuggest,
  useAutosuggest
};
