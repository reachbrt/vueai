import { ref, Ref } from 'vue';
import { AIClient } from '@aivue/core';
import { SuggestionItem } from '../index';

export interface AutosuggestOptions {
  client: AIClient;
  debounce?: number;
  minLength?: number;
  maxSuggestions?: number;
  context?: string;
}

export interface AutosuggestReturn {
  suggestions: Ref<SuggestionItem[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

/**
 * Composable for AI-powered suggestions
 *
 * @param options Configuration options
 * @returns Autosuggest state and methods
 */
export function useAutosuggest(options: AutosuggestOptions): AutosuggestReturn {
  const {
    client,
    debounce = 300,
    minLength = 2,
    maxSuggestions = 5,
    context = ''
  } = options;

  const suggestions = ref<SuggestionItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let debounceTimeout: number | null = null;

  /**
   * Search for suggestions
   *
   * @param query Search query
   */
  const search = async (query: string): Promise<void> => {
    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Reset suggestions if query is too short
    if (!query || query.length < minLength) {
      suggestions.value = [];
      return;
    }

    // Set debounce timeout
    return new Promise((resolve) => {
      debounceTimeout = window.setTimeout(async () => {
        error.value = null;
        isLoading.value = true;

        try {
          // Create a prompt for the AI to generate suggestions
          const prompt = `
            Generate ${maxSuggestions} short, relevant suggestions to complete or continue this input: "${query}"

            Format your response as a numbered list with each suggestion on a new line.
            1. First suggestion
            2. Second suggestion
            etc.

            Keep suggestions concise and relevant to the input.
          `;

          // Call the AI client to get suggestions
          const response = await client.chat([
            { role: 'system', content: 'You are a helpful assistant providing autocomplete suggestions.' },
            { role: 'user', content: prompt }
          ]);

          // Parse the response to extract suggestions
          const lines = response.split('\n');
          const extractedSuggestions = lines
            .filter(line => /^\d+\./.test(line.trim()))
            .map(line => {
              const text = line.replace(/^\d+\.\s*/, '').trim();
              return { text, score: 1.0 - (0.1 * (lines.indexOf(line) || 0)) };
            })
            .filter(Boolean)
            .slice(0, maxSuggestions);

          suggestions.value = extractedSuggestions;
          resolve();
        } catch (err: any) {
          error.value = err.message || 'Failed to get suggestions';
          suggestions.value = [];
          resolve();
        } finally {
          isLoading.value = false;
        }
      }, debounce);
    });
  };

  /**
   * Clear suggestions
   */
  const clear = (): void => {
    suggestions.value = [];
    error.value = null;
  };

  return {
    suggestions,
    isLoading,
    error,
    search,
    clear
  };
}

export default useAutosuggest;
