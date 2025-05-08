import { AIClient } from '@aivue/core';

// Create an AI client with the fallback provider (no API key needed)
export const aiClient = new AIClient({
  provider: 'fallback'
});
