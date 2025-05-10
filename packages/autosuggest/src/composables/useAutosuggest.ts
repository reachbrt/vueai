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
          const prompt = `Generate ${maxSuggestions} search suggestions for the query: "${query}"
          ${context ? `\nContext: ${context}` : ''}

          Format the response as a JSON array of objects with "text" and "score" properties.
          Example: [{"text": "suggestion 1", "score": 0.95}, {"text": "suggestion 2", "score": 0.85}]

          The score should be between 0 and 1, representing the relevance of the suggestion.
          `;

          console.log('Autosuggest - Generating suggestions for query:', query);
          console.log('Autosuggest - Using client:', client);

          // Call the AI client to generate suggestions
          const response = await client.chat([
            { role: 'system', content: 'You are a helpful assistant generating search suggestions.' },
            { role: 'user', content: prompt }
          ]);

          console.log('Autosuggest - Received response:', response);

          // Parse the response as JSON
          let parsedResponse: SuggestionItem[] = [];

          try {
            // Extract JSON array from the response if needed
            const jsonMatch = response.match(/\[.*\]/s);
            const jsonString = jsonMatch ? jsonMatch[0] : response;
            parsedResponse = JSON.parse(jsonString);

            // Validate the response format
            parsedResponse = parsedResponse
              .filter(item => typeof item.text === 'string' && typeof item.score === 'number')
              .map(item => ({
                text: item.text,
                score: Math.max(0, Math.min(1, item.score)) // Ensure score is between 0 and 1
              }));
          } catch (parseError) {
            // If parsing fails, create suggestions from the raw response
            const lines = response.split('\n').filter(line => line.trim());
            parsedResponse = lines.map((line, index) => ({
              text: line.replace(/^\d+\.\s*/, '').trim(),
              score: 1 - (index * 0.1)
            }));
          }

          suggestions.value = parsedResponse.slice(0, maxSuggestions);
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
