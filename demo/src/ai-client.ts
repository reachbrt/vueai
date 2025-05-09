import { AIClient } from '@aivue/core';

// Create an AI client with OpenAI API key
export const aiClient = new AIClient({
  provider: 'openai',
  apiKey: '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',
  options: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000
  }
});

// Fallback configuration if needed
// export const aiClient = new AIClient({
//   provider: 'fallback', // Fallback provider works without any API keys
//   options: {
//     model: 'gpt-3.5-turbo',
//     temperature: 0.7
//   }
// });
