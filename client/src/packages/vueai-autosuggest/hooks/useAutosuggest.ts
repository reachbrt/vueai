import { useState, useEffect, useCallback, useRef } from 'react';
import { AIClient } from '@/packages/vueai-core';
import { AutosuggestOptions, SuggestionItem, UseAutosuggestResult } from '../index';

export function useAutosuggest({
  provider,
  apiKey,
  model,
  context = '',
  debounce = 300,
  maxSuggestions = 5
}: AutosuggestOptions): UseAutosuggestResult {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize AI client
  const aiClient = new AIClient({
    provider,
    apiKey,
    model
  });
  
  // Cache previous searches
  const searchCache = useRef<Map<string, SuggestionItem[]>>(new Map());
  
  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);
  
  // Search function with debounce
  const search = useCallback(async (query: string) => {
    // Clear any pending search
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Don't search if query is too short
    if (!query || query.length < 2) {
      clearSuggestions();
      return;
    }
    
    // Check cache first
    const cacheKey = `${query}:${context}`;
    if (searchCache.current.has(cacheKey)) {
      setSuggestions(searchCache.current.get(cacheKey) || []);
      return;
    }
    
    // Debounce the search
    timerRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Generate suggestions using AI
        const results = await aiClient.generateSuggestions(query, {
          count: maxSuggestions,
          context
        });
        
        // Update state with suggestions
        setSuggestions(results);
        
        // Update cache
        searchCache.current.set(cacheKey, results);
        
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setSuggestions([]);
        setIsLoading(false);
      }
    }, debounce);
  }, [aiClient, context, debounce, maxSuggestions, clearSuggestions]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  return {
    suggestions,
    isLoading,
    error,
    search,
    clearSuggestions
  };
}
