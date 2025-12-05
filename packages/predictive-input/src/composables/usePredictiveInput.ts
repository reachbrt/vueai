/**
 * Main composable for predictive input functionality
 */

import { ref, Ref } from 'vue';
import { AIClient } from '@aivue/core';
import type { Prediction } from '../types';

export interface PredictiveInputOptions {
  client: AIClient;
  debounce?: number;
  minLength?: number;
  maxPredictions?: number;
  context?: string;
}

export interface PredictiveInputReturn {
  predictions: Ref<Prediction[]>;
  isLoading: Ref<boolean>;
  error: Ref<string | null>;
  predict: (query: string) => Promise<void>;
  clear: () => void;
}

/**
 * Composable for AI-powered predictive input
 *
 * @param options Configuration options
 * @returns Predictive input state and methods
 */
export function usePredictiveInput(options: PredictiveInputOptions): PredictiveInputReturn {
  const {
    client,
    debounce = 300,
    minLength = 2,
    maxPredictions = 5,
    context = ''
  } = options;

  const predictions = ref<Prediction[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let debounceTimeout: number | null = null;

  /**
   * Predict text completions
   *
   * @param query Input query
   */
  const predict = async (query: string): Promise<void> => {
    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Reset predictions if query is too short
    if (!query || query.length < minLength) {
      predictions.value = [];
      return;
    }

    // Set debounce timeout
    return new Promise((resolve) => {
      debounceTimeout = window.setTimeout(async () => {
        error.value = null;
        isLoading.value = true;

        try {
          // Create a prompt for the AI to generate predictions
          const prompt = `Generate ${maxPredictions} text completion predictions for the input: "${query}"
          ${context ? `\nContext: ${context}` : ''}

          Format the response as a JSON array of objects with "text", "confidence", and "type" properties.
          Example: [{"text": "prediction 1", "confidence": 0.95, "type": "completion"}, {"text": "prediction 2", "confidence": 0.85, "type": "suggestion"}]

          The confidence should be between 0 and 1, representing the relevance of the prediction.
          The type can be: "completion", "suggestion", "correction", or "pattern".
          `;

          // Call the AI client to generate predictions
          const response = await client.chat([
            { role: 'system', content: 'You are a helpful assistant generating text completion predictions.' },
            { role: 'user', content: prompt }
          ]);

          // Parse the response as JSON
          let parsedResponse: Prediction[] = [];

          try {
            // Extract JSON array from the response if needed
            const jsonMatch = response.match(/\[.*\]/s);
            const jsonString = jsonMatch ? jsonMatch[0] : response;
            parsedResponse = JSON.parse(jsonString);

            // Validate the response format
            parsedResponse = parsedResponse
              .filter(item => typeof item.text === 'string' && typeof item.confidence === 'number')
              .map(item => ({
                text: item.text,
                confidence: Math.max(0, Math.min(1, item.confidence)), // Ensure confidence is between 0 and 1
                type: item.type || 'completion'
              }));
          } catch (parseError) {
            // If parsing fails, create predictions from the raw response
            const lines = response.split('\n').filter(line => line.trim());
            parsedResponse = lines.map((line, index) => ({
              text: line.replace(/^\d+\.\s*/, '').trim(),
              confidence: 1 - (index * 0.1),
              type: 'completion' as const
            }));
          }

          predictions.value = parsedResponse.slice(0, maxPredictions);
          resolve();
        } catch (err: any) {
          error.value = err.message || 'Failed to get predictions';
          predictions.value = [];
          resolve();
        } finally {
          isLoading.value = false;
        }
      }, debounce);
    });
  };

  /**
   * Clear predictions
   */
  const clear = (): void => {
    predictions.value = [];
    error.value = null;
  };

  return {
    predictions,
    isLoading,
    error,
    predict,
    clear
  };
}

export default usePredictiveInput;

