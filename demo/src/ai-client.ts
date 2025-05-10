import { AIClient } from '@aivue/core';

// Log the API key (first few characters only for security)
const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
console.log('API Key available:', apiKey ? `${apiKey.substring(0, 10)}...` : 'No API key');

// Create an AI client with environment variable for API key
// In production, you should use environment variables or a secure vault
export const aiClient = new AIClient({
  provider: 'openai',
  apiKey: apiKey, // Use environment variable
  model: 'gpt-4'
});

// Log the client configuration
console.log('AI Client configuration:', {
  provider: 'openai',
  model: 'gpt-4',
  hasApiKey: !!apiKey
});

// Fallback configuration when no API key is available
if (!apiKey) {
  console.warn('No OpenAI API key found. Using fallback provider.');
  // Use fallback provider that doesn't require an API key
  Object.assign(aiClient, new AIClient({
    provider: 'fallback',
    model: 'gpt-3.5-turbo'
  }));
}
