import { AIClient } from '@aivue/core';

// Create an AI client with environment variable for API key
// In production, you should use environment variables or a secure vault
export const aiClient = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '', // Use environment variable
  options: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000
  }
});

// Fallback configuration when no API key is available
if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.warn('No OpenAI API key found. Using fallback provider.');
  // Use fallback provider that doesn't require an API key
  Object.assign(aiClient, new AIClient({
    provider: 'fallback',
    options: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7
    }
  }));
}
