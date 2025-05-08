# @aivue/core

The `@aivue/core` package provides a unified interface for working with multiple AI providers in Vue.js applications. It serves as the foundation for all AIVue components, offering a consistent API for interacting with various AI services.

[![npm version](https://img.shields.io/npm/v/@aivue/core.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/core)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/core.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/core)

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
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});

// Generate a completion
const response = await client.complete('Tell me a joke about programming');
console.log(response.text);
```

## AIClient Configuration

The `AIClient` constructor accepts a configuration object with the following properties:

```javascript
const client = new AIClient({
  // Required
  provider: 'openai', // 'openai', 'anthropic', 'gemini', 'huggingface', 'ollama', 'deepseek'
  apiKey: 'your-api-key', // API key for the provider
  
  // Optional
  model: 'gpt-4o', // Default model to use
  baseURL: 'https://api.openai.com/v1', // Custom API endpoint
  options: {
    // Provider-specific options
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  },
  headers: {
    // Custom headers to include in API requests
    'Custom-Header': 'value'
  },
  fetch: customFetchFunction, // Custom fetch implementation
  debug: false // Enable debug logging
});
```

## Methods

### complete(prompt, options)

Generates a completion for the given prompt.

```javascript
const response = await client.complete('Tell me a joke', {
  temperature: 0.8,
  maxTokens: 500
});

console.log(response.text); // The generated text
console.log(response.usage); // Token usage information
```

### chat(messages, options)

Sends a conversation to the AI and gets a response.

```javascript
const response = await client.chat([
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'What is the capital of France?' }
], {
  temperature: 0.7
});

console.log(response.text); // The assistant's response
console.log(response.message); // The full message object
```

### streamChat(messages, options, callbacks)

Streams a chat response, calling the provided callbacks as chunks arrive.

```javascript
await client.streamChat(
  [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Write a short story about a robot.' }
  ],
  { temperature: 0.8 },
  {
    onStart: () => console.log('Stream started'),
    onToken: (token) => console.log('Token received:', token),
    onComplete: (fullResponse) => console.log('Full response:', fullResponse),
    onError: (error) => console.error('Error:', error)
  }
);
```

### embed(text, options)

Generates embeddings for the given text.

```javascript
const embeddings = await client.embed('This is a sample text');
console.log(embeddings); // Vector representation of the text
```

## Supported Providers

### OpenAI

```javascript
const client = new AIClient({
  provider: 'openai',
  apiKey: 'your-openai-api-key',
  model: 'gpt-4o', // or 'gpt-3.5-turbo', etc.
  options: {
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

### Anthropic (Claude)

```javascript
const client = new AIClient({
  provider: 'anthropic',
  apiKey: 'your-anthropic-api-key',
  model: 'claude-3-opus-20240229', // or 'claude-3-sonnet', 'claude-3-haiku', etc.
  options: {
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

### Google (Gemini)

```javascript
const client = new AIClient({
  provider: 'gemini',
  apiKey: 'your-google-api-key',
  model: 'gemini-pro', // or 'gemini-pro-vision', etc.
  options: {
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

### HuggingFace

```javascript
const client = new AIClient({
  provider: 'huggingface',
  apiKey: 'your-huggingface-api-key',
  model: 'mistralai/Mistral-7B-Instruct-v0.2', // or any other model on HuggingFace
  options: {
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

### Ollama (Local Models)

```javascript
const client = new AIClient({
  provider: 'ollama',
  baseURL: 'http://localhost:11434', // Default Ollama endpoint
  model: 'llama3', // or any other model you have pulled in Ollama
  options: {
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

### DeepSeek

```javascript
const client = new AIClient({
  provider: 'deepseek',
  apiKey: 'your-deepseek-api-key',
  model: 'deepseek-chat', // or other DeepSeek models
  options: {
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

## Custom Providers

You can register custom providers to support additional AI services:

```javascript
import { registerProviders } from '@aivue/core';

registerProviders({
  myCustomProvider: {
    baseURL: 'https://api.custom-provider.com',
    models: {
      default: 'custom-model-1',
      available: ['custom-model-1', 'custom-model-2']
    },
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    completeRequest: (prompt, options) => ({
      // Format the request for completion
      url: '/v1/completions',
      method: 'POST',
      body: {
        model: options.model,
        prompt: prompt,
        max_tokens: options.maxTokens,
        temperature: options.temperature
      }
    }),
    completeResponse: (response) => ({
      // Parse the completion response
      text: response.choices[0].text,
      usage: response.usage
    }),
    // Implement other methods as needed
  }
});

// Use your custom provider
const client = new AIClient({
  provider: 'myCustomProvider',
  apiKey: 'your-api-key',
  model: 'custom-model-1'
});
```

## Error Handling

```javascript
try {
  const response = await client.complete('Tell me a joke');
  console.log(response.text);
} catch (error) {
  if (error.name === 'AIProviderError') {
    console.error('Provider error:', error.message);
    console.error('Status code:', error.statusCode);
    console.error('Provider response:', error.providerResponse);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Related Packages

- [@aivue/chatbot](https://github.com/reachbrt/vueai/wiki/Chatbot) - AI-powered chat components for Vue.js
- [@aivue/autosuggest](https://github.com/reachbrt/vueai/wiki/Autosuggest) - AI-powered suggestion components for Vue.js
- [@aivue/smartform](https://github.com/reachbrt/vueai/wiki/Smartform) - AI-powered form validation for Vue.js
