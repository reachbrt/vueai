import { ref, reactive, toRefs, watch } from 'vue';

/**
 * Composable for managing autosuggest state and interactions with AI
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.client - AIClient instance
 * @param {Number} [options.debounce=300] - Debounce time in milliseconds
 * @param {Number} [options.minLength=2] - Minimum input length to trigger suggestions
 * @param {Number} [options.maxSuggestions=5] - Maximum number of suggestions to show
 * @param {String} [options.context=''] - Context to help the AI generate relevant suggestions
 * @param {Function} [options.onError=null] - Callback function when an error occurs
 * 
 * @returns {Object} Autosuggest state and methods
 */
export function useAutosuggest(options) {
  const {
    client,
    debounce = 300,
    minLength = 2,
    maxSuggestions = 5,
    context = '',
    onError = null
  } = options;

  // Create reactive state
  const state = reactive({
    suggestions: [],
    isLoading: false,
    error: null,
    query: ''
  });

  // Debounce timer
  let debounceTimer = null;

  /**
   * Search for suggestions based on the query
   * 
   * @param {String} query - Search query
   * @returns {Promise<void>}
   */
  const search = async (query) => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Update query
    state.query = query;

    // Don't search if query is too short
    if (!query || query.length < minLength) {
      state.suggestions = [];
      return;
    }

    // Debounce the search
    debounceTimer = setTimeout(async () => {
      try {
        state.isLoading = true;
        state.error = null;

        // Prepare the prompt for the AI
        const prompt = context 
          ? `Given the context "${context}", suggest completions for: "${query}"`
          : `Suggest completions for: "${query}"`;

        // Get suggestions from the AI
        const response = await client.complete(prompt, {
          maxTokens: 200
        });

        // Parse the response into suggestions
        // This is a simple implementation - in a real-world scenario,
        // you might want to use a more sophisticated parsing logic
        const suggestions = parseResponseToSuggestions(response.text, query);

        // Limit the number of suggestions
        state.suggestions = suggestions.slice(0, maxSuggestions);
      } catch (err) {
        state.error = err;
        if (onError) onError(err);
      } finally {
        state.isLoading = false;
      }
    }, debounce);
  };

  /**
   * Clear all suggestions
   */
  const clearSuggestions = () => {
    state.suggestions = [];
    state.error = null;
  };

  /**
   * Select a suggestion
   * 
   * @param {Object} suggestion - The selected suggestion
   */
  const selectSuggestion = (suggestion) => {
    state.query = suggestion.text;
    clearSuggestions();
  };

  /**
   * Parse the AI response into suggestions
   * 
   * @param {String} responseText - The AI response text
   * @param {String} query - The original query
   * @returns {Array} Array of suggestion objects
   */
  const parseResponseToSuggestions = (responseText, query) => {
    // Simple parsing logic - split by newlines and filter out empty lines
    const lines = responseText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Convert lines to suggestion objects
    return lines.map((line, index) => {
      // Remove any numbering or bullet points
      const cleanLine = line.replace(/^(\d+\.\s*|\*\s*|-\s*)/, '').trim();
      
      // Calculate a simple relevance score based on position
      // First suggestions are considered more relevant
      const positionScore = 1 - (index / Math.max(lines.length, 1));
      
      // Calculate a simple match score based on whether the suggestion starts with the query
      const matchScore = cleanLine.toLowerCase().startsWith(query.toLowerCase()) ? 0.3 : 0;
      
      // Combine scores (position is more important)
      const score = 0.7 * positionScore + matchScore;
      
      return {
        text: cleanLine,
        score: score
      };
    }).sort((a, b) => b.score - a.score); // Sort by score descending
  };

  return {
    ...toRefs(state),
    search,
    clearSuggestions,
    selectSuggestion
  };
}

export default useAutosuggest;
