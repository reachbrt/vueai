# @aivue/core

> Core AI functionality for Vue.js components

[![npm version](https://img.shields.io/npm/v/@aivue/core.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/core)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/core.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/core)
[![MIT License](https://img.shields.io/npm/l/@aivue/core.svg?style=flat-square)](https://github.com/reachbrt/vueai/blob/main/LICENSE)

## Overview

`@aivue/core` provides a unified interface for working with multiple AI providers in Vue.js applications. It serves as the foundation for all VueAI components, offering a consistent API for interacting with various AI services.

## Features

- 🔌 **Multi-provider support**: Works with OpenAI, Claude, Gemini, HuggingFace, Ollama, and more
- 🌐 **Fallback mechanism**: Continues to work even without API keys during development
- 🔄 **Streaming support**: Real-time streaming of AI responses
- 🛡️ **Type safety**: Full TypeScript support
- 🧩 **Modular design**: Use only what you need
- 🔧 **Customizable**: Configure providers, models, and parameters

## Installation

```bash
# npm
npm install @aivue/core

# yarn
yarn add @aivue/core

# pnpm
pnpm add @aivue/core
```

## Basic Usage

```javascript
import { AIClient } from '@aivue/core';

// Create a client with your preferred provider
const client = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Use environment variables for API keys
  model: 'gpt-4o' // Optional - uses provider's default if missing
});

// Chat functionality
async function getResponse() {
  const response = await client.chat([
    { role: 'user', content: 'Hello, can you help me with Vue.js?' }
  ]);

  console.log(response);
}
```

## Streaming Responses

```javascript
import { AIClient } from '@aivue/core';

const client = new AIClient({
  provider: 'claude',
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  model: 'claude-3-7-sonnet-20250219'
});

// Streaming chat functionality
client.chatStream(
  [{ role: 'user', content: 'Write a short poem about Vue.js' }],
  {
    onStart: () => console.log('Stream started'),
    onToken: (token) => console.log(token), // Process each token as it arrives
    onComplete: (fullText) => console.log('Complete response:', fullText),
    onError: (error) => console.error('Error:', error)
  }
);
```

## Using with Vue Composition API

```javascript
import { ref, onMounted } from 'vue';
import { AIClient } from '@aivue/core';

export default {
  setup() {
    const response = ref('');
    const loading = ref(false);
    const client = new AIClient({
      provider: 'openai',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY
    });

    async function askQuestion(question) {
      loading.value = true;
      try {
        response.value = await client.chat([
          { role: 'user', content: question }
        ]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        loading.value = false;
      }
    }

    return {
      response,
      loading,
      askQuestion
    };
  }
};
```

## Configuring Multiple Providers

```javascript
import { registerProviders } from '@aivue/core';

// Register multiple providers at once
registerProviders({
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    defaultModel: 'gpt-4o'
  },
  claude: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    defaultModel: 'claude-3-7-sonnet-20250219'
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
  }
});
```

## API Reference

### AIClient

```typescript
new AIClient(options: AIClientOptions)
```

#### AIClientOptions

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| provider | string | AI provider to use ('openai', 'claude', 'gemini', etc.) | Yes |
| apiKey | string | API key for the provider | No |
| model | string | Model to use (e.g., 'gpt-4o', 'claude-3-7-sonnet') | No |
| baseUrl | string | Custom base URL for the API | No |
| organizationId | string | Organization ID (for OpenAI) | No |

#### Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| chat | Send a chat request | messages: Message[], options?: ChatOptions | Promise<string> |
| chatStream | Stream a chat response | messages: Message[], callbacks: StreamCallbacks, options?: ChatOptions | Promise<void> |

### Message Interface

```typescript
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
```

### ChatOptions Interface

```typescript
interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
}
```

### StreamCallbacks Interface

```typescript
interface StreamCallbacks {
  onStart?: () => void;
  onToken?: (token: string) => void;
  onComplete?: (completeText: string) => void;
  onError?: (error: Error) => void;
}
```

## Related Packages

- [@aivue/chatbot](https://www.npmjs.com/package/@aivue/chatbot) - AI-powered chat components for Vue.js
- [@aivue/autosuggest](https://www.npmjs.com/package/@aivue/autosuggest) - AI-powered suggestion components for Vue.js
- [@aivue/smartform](https://www.npmjs.com/package/@aivue/smartform) - AI-powered form validation for Vue.js

## License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)
