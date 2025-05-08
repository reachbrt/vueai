# @aivue/chatbot

> AI-powered chat components for Vue.js

[![npm version](https://img.shields.io/npm/v/@aivue/chatbot.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/chatbot)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/chatbot.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/chatbot)
[![MIT License](https://img.shields.io/npm/l/@aivue/chatbot.svg?style=flat-square)](https://github.com/reachbrt/vueai/blob/main/LICENSE)

## Overview

`@aivue/chatbot` provides ready-to-use chat components for Vue.js applications, powered by AI. Create engaging conversational interfaces with minimal setup, supporting multiple AI providers.

## Features

- 💬 **Ready-to-use chat UI**: Beautiful, responsive chat interface
- 🔄 **Real-time streaming**: See AI responses as they're generated
- 📱 **Mobile-friendly**: Responsive design works on all devices
- 🎨 **Customizable**: Easily style to match your application
- 🧠 **Multiple AI providers**: Works with OpenAI, Claude, Gemini, and more
- 📝 **Markdown support**: Rich text formatting in messages
- 💾 **Conversation history**: Save and load chat sessions
- 🔧 **Fully typed**: Complete TypeScript support with type definitions

## Installation

```bash
# npm
npm install @aivue/chatbot @aivue/core

# yarn
yarn add @aivue/chatbot @aivue/core

# pnpm
pnpm add @aivue/chatbot @aivue/core
```

## Basic Usage

### 1. Set up the AI Client

First, create an AI client using `@aivue/core`:

```javascript
// ai-client.js
import { AIClient } from '@aivue/core';

export const aiClient = new AIClient({
  provider: 'openai', // or 'anthropic', 'gemini', 'huggingface', 'ollama', 'deepseek'
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Use environment variables for API keys
  model: 'gpt-4o' // Specify the model to use
});
```

### 2. Use the AiChatWindow Component

```vue
<template>
  <div class="chat-container">
    <AiChatWindow
      :client="aiClient"
      title="AI Assistant"
      placeholder="Ask me anything..."
    />
  </div>
</template>

<script setup>
import { AiChatWindow } from '@aivue/chatbot';
import { aiClient } from './ai-client.js';
</script>

<style>
.chat-container {
  height: 600px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
</style>
```

### 3. Register Components Globally (Optional)

If you prefer to register components globally:

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { AiChatWindow } from '@aivue/chatbot';

const app = createApp(App);
app.component('AiChatWindow', AiChatWindow); // Register with PascalCase
app.mount('#app');
```

Then use it in your templates with either PascalCase or kebab-case:

```html
<!-- Both of these work -->
<AiChatWindow :client="aiClient" />
<ai-chat-window :client="aiClient" />
```

## Using the Chat Engine Composable

The `useChatEngine` composable provides a simple way to integrate AI chat functionality into any Vue component:

```vue
<script setup>
import { ref } from 'vue';
import { useChatEngine } from '@aivue/chatbot';
import { aiClient } from './ai-client.js';

const {
  messages,
  isLoading,
  error,
  sendMessage,
  clearMessages
} = useChatEngine({
  client: aiClient,
  initialMessages: [
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ],
  systemPrompt: 'You are a helpful assistant.',
  streaming: true,
  persistenceKey: 'my-chat-history'
});

const userInput = ref('');

function handleSend() {
  if (userInput.value.trim()) {
    sendMessage(userInput.value);
    userInput.value = '';
  }
}
</script>

<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="message.id || index" class="message">
        <strong>{{ message.role }}:</strong> {{ message.content }}
      </div>
    </div>

    <div class="input-area">
      <input v-model="userInput" @keyup.enter="handleSend" :disabled="isLoading" />
      <button @click="handleSend" :disabled="isLoading">Send</button>
      <button @click="clearMessages">Clear</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>
```

Note that all values returned from `useChatEngine` are Vue reactive refs, so you can use them directly in your templates without `.value`.

## Customizing the Chat Window

The `AiChatWindow` component accepts various props for customization:

```vue
<template>
  <AiChatWindow
    :client="aiClient"
    title="AI Assistant"
    placeholder="Ask me anything about Vue..."
    :initial-messages="initialMessages"
    system-prompt="You are a Vue.js expert who provides clear, concise answers."
    :streaming="true"
    :show-avatars="true"
    :user-avatar="userAvatar"
    :assistant-avatar="assistantAvatar"
    theme="dark"
    height="700px"
    width="100%"
    max-width="800px"
    :show-timestamps="true"
    :show-copy-button="true"
    persistence-key="vue-chat-history"
    @message-sent="handleMessageSent"
    @response-received="handleResponseReceived"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue';
import { AiChatWindow } from '@aivue/chatbot';
import { aiClient } from './ai-client.js';

const userAvatar = ref('/path/to/user-avatar.png');
const assistantAvatar = ref('/path/to/assistant-avatar.png');
const initialMessages = ref([
  { role: 'assistant', content: 'Hello! I can help you with Vue.js questions.' }
]);

function handleMessageSent(event) {
  console.log('Message sent:', event.message);
}

function handleResponseReceived(event) {
  console.log('Response received:', event.message);
}

function handleError(event) {
  console.error('Error:', event.error);
}
</script>
```

## Advanced Usage: Custom Styling

You can customize the appearance of the chat window using CSS variables:

```css
:root {
  --aivue-chat-bg: #ffffff;
  --aivue-chat-border: #e0e0e0;
  --aivue-chat-text: #333333;
  --aivue-chat-user-bg: #e1f5fe;
  --aivue-chat-assistant-bg: #f5f5f5;
  --aivue-chat-input-bg: #ffffff;
  --aivue-chat-input-border: #e0e0e0;
  --aivue-chat-button-bg: #2196f3;
  --aivue-chat-button-text: #ffffff;
  --aivue-chat-error: #f44336;
  --aivue-chat-loading: #9e9e9e;
  --aivue-chat-border-radius: 8px;
  --aivue-chat-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Dark theme example */
.dark-theme {
  --aivue-chat-bg: #1e1e1e;
  --aivue-chat-border: #444444;
  --aivue-chat-text: #f0f0f0;
  --aivue-chat-user-bg: #2b5278;
  --aivue-chat-assistant-bg: #383838;
  --aivue-chat-input-bg: #2d2d2d;
  --aivue-chat-input-border: #555555;
  --aivue-chat-button-bg: #4a6da7;
  --aivue-chat-button-text: #ffffff;
}
```

## API Reference

### AiChatWindow Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `client` | `AIClient` | **Required** | The AIClient instance to use for generating responses |
| `title` | `String` | `'Chat'` | The title displayed in the chat window header |
| `placeholder` | `String` | `'Type a message...'` | Placeholder text for the input field |
| `initialMessages` | `Array` | `[]` | Initial messages to populate the chat |
| `systemPrompt` | `String` | `'You are a helpful assistant.'` | System prompt to guide the AI's behavior |
| `streaming` | `Boolean` | `true` | Whether to stream responses token by token |
| `loadingText` | `String` | `'Thinking...'` | Text to display while waiting for a response |
| `errorText` | `String` | `'An error occurred. Please try again.'` | Text to display when an error occurs |
| `showTimestamps` | `Boolean` | `false` | Whether to show timestamps on messages |
| `showCopyButton` | `Boolean` | `true` | Whether to show a button to copy message content |
| `showAvatars` | `Boolean` | `true` | Whether to show avatars for the user and assistant |
| `userAvatar` | `String` | `null` | URL for the user avatar image |
| `assistantAvatar` | `String` | `null` | URL for the assistant avatar image |
| `theme` | `String` | `'light'` | Theme for the chat window ('light' or 'dark') |
| `height` | `String` | `'500px'` | Height of the chat window |
| `width` | `String` | `'100%'` | Width of the chat window |
| `maxWidth` | `String` | `'800px'` | Maximum width of the chat window |
| `persistenceKey` | `String` | `null` | Key for persisting chat history in localStorage |

### AiChatWindow Events

| Event | Payload | Description |
|-------|---------|-------------|
| `message-sent` | `{ message }` | Emitted when a user message is sent |
| `response-received` | `{ message }` | Emitted when an AI response is received |
| `error` | `{ error }` | Emitted when an error occurs |
| `clear` | - | Emitted when the chat history is cleared |

### AiChatWindow Slots

| Slot | Props | Description |
|------|-------|-------------|
| `header` | - | Custom header content |
| `message` | `{ message, index }` | Custom message rendering |
| `user-message` | `{ message, index }` | Custom user message rendering |
| `assistant-message` | `{ message, index }` | Custom assistant message rendering |
| `input` | `{ input, sendMessage }` | Custom input area |
| `footer` | - | Custom footer content |

### useChatEngine Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | `AIClient` | **Required** | The AIClient instance to use |
| `initialMessages` | `Array` | `[]` | Initial messages to populate the chat |
| `systemPrompt` | `String` | `'You are a helpful assistant.'` | System prompt to guide the AI's behavior |
| `streaming` | `Boolean` | `true` | Whether to stream responses token by token |
| `persistenceKey` | `String` | `null` | Key for persisting chat history in localStorage |
| `maxMessages` | `Number` | `100` | Maximum number of messages to keep in history |
| `onError` | `Function` | `null` | Callback function when an error occurs |

### useChatEngine Return Values

| Value | Type | Description |
|-------|------|-------------|
| `messages` | `Ref<Array>` | Reactive array of chat messages |
| `isLoading` | `Ref<Boolean>` | Whether a response is being generated |
| `error` | `Ref<String>` | Error message, if any |
| `sendMessage` | `Function` | Function to send a user message |
| `clearMessages` | `Function` | Function to clear the chat history |
| `setMessages` | `Function` | Function to set the messages array |
| `addMessage` | `Function` | Function to add a single message |

## Troubleshooting

### Component Registration Issues

If you encounter issues with component registration, make sure you're using the correct import and registration method:

```javascript
// Correct import
import { AiChatWindow } from '@aivue/chatbot';

// For local registration in a component
export default {
  components: {
    AiChatWindow
  }
}

// Or with script setup
import { AiChatWindow } from '@aivue/chatbot';
```

When using the component in templates, you can use either PascalCase or kebab-case:

```html
<!-- Both of these work -->
<AiChatWindow :client="aiClient" />
<ai-chat-window :client="aiClient" />
```

### TypeScript Support

The package includes full TypeScript support. You can import types directly:

```typescript
import { Message, ChatOptions } from '@aivue/chatbot';

// Use types in your code
const messages: Message[] = [];
const options: ChatOptions = {
  client: aiClient,
  systemPrompt: 'You are a helpful assistant.'
};
```

For detailed TypeScript usage examples, see the [TypeScript Usage Guide](./TYPESCRIPT.md).

### API Key Handling

For security reasons, never hardcode API keys in your code. Use environment variables instead:

```javascript
// .env file
VITE_OPENAI_API_KEY=your-api-key

// In your code
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
```

### Error Handling

If you're not seeing any error messages, you can listen for the `error` event:

```vue
<template>
  <AiChatWindow
    :client="aiClient"
    @error="handleError"
  />
</template>

<script setup>
function handleError(error) {
  console.error('Chat error:', error);
  // Show a notification or handle the error
}
</script>
```

### Webpack Configuration

If you're using webpack, make sure your configuration properly handles Vue components:

```javascript
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // ...
    ]
  },
  // ...
}
```

## Related Packages

- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Core AI functionality for Vue.js components
- [@aivue/autosuggest](https://www.npmjs.com/package/@aivue/autosuggest) - AI-powered suggestion components for Vue.js
- [@aivue/smartform](https://www.npmjs.com/package/@aivue/smartform) - AI-powered form validation for Vue.js

## License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)
