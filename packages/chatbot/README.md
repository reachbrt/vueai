# @reachbrt/vueai-chatbot

> AI-powered chat components for Vue.js

[![npm version](https://img.shields.io/npm/v/@reachbrt/vueai-chatbot.svg?style=flat-square)](https://www.npmjs.com/package/@reachbrt/vueai-chatbot)
[![npm downloads](https://img.shields.io/npm/dm/@reachbrt/vueai-chatbot.svg?style=flat-square)](https://www.npmjs.com/package/@reachbrt/vueai-chatbot)
[![MIT License](https://img.shields.io/npm/l/@reachbrt/vueai-chatbot.svg?style=flat-square)](https://github.com/reachbrt/vueai/blob/main/LICENSE)

## Overview

`@reachbrt/vueai-chatbot` provides ready-to-use chat components for Vue.js applications, powered by AI. Create engaging conversational interfaces with minimal setup, supporting multiple AI providers.

## Features

- 💬 **Ready-to-use chat UI**: Beautiful, responsive chat interface
- 🔄 **Real-time streaming**: See AI responses as they're generated
- 📱 **Mobile-friendly**: Responsive design works on all devices
- 🎨 **Customizable**: Easily style to match your application
- 🧠 **Multiple AI providers**: Works with OpenAI, Claude, Gemini, and more
- 📝 **Markdown support**: Rich text formatting in messages
- 💾 **Conversation history**: Save and load chat sessions
- 🔧 **Fully typed**: Complete TypeScript support

## Installation

```bash
# npm
npm install @reachbrt/vueai-chatbot @reachbrt/vueai-core

# yarn
yarn add @reachbrt/vueai-chatbot @reachbrt/vueai-core

# pnpm
pnpm add @reachbrt/vueai-chatbot @reachbrt/vueai-core
```

## Basic Usage

### Vue 3 Component

```vue
<template>
  <div class="chat-container">
    <AiChatWindow
      :messages="messages"
      :loading="loading"
      @send="sendMessage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AiChatWindow, useChatEngine } from '@reachbrt/vueai-chatbot';

// Use the chat engine composable
const {
  messages,
  isLoading: loading,
  sendMessage,
  resetConversation
} = useChatEngine({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o',
  systemPrompt: 'You are a helpful assistant that specializes in Vue.js.',
  streaming: true
});
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

## Using the Chat Engine Composable

The `useChatEngine` composable provides a simple way to integrate AI chat functionality into any Vue component:

```javascript
import { useChatEngine } from '@reachbrt/vueai-chatbot';

// In your setup function or script setup
const {
  messages,        // Reactive array of chat messages
  isLoading,       // Boolean indicating if a response is being generated
  error,           // Error object if something goes wrong
  sendMessage,     // Function to send a new message
  resetConversation // Function to clear the conversation
} = useChatEngine({
  provider: 'claude',  // AI provider to use
  apiKey: 'your-api-key', // API key
  model: 'claude-3-7-sonnet-20250219', // Model to use
  systemPrompt: 'You are a helpful assistant.', // Initial system prompt
  streaming: true, // Enable streaming responses
  initialMessages: [] // Optional initial messages
});

// Send a message
async function handleSubmit(userInput) {
  await sendMessage(userInput);
}
```

## Customizing the Chat Window

The `AiChatWindow` component accepts various props for customization:

```vue
<template>
  <AiChatWindow
    :messages="messages"
    :loading="loading"
    :user-avatar="userAvatar"
    :assistant-avatar="assistantAvatar"
    :placeholder="'Ask me anything about Vue...'"
    :theme="'dark'"
    :max-height="'700px'"
    @send="sendMessage"
    @reset="resetConversation"
  />
</template>

<script setup>
import { ref } from 'vue';
import { AiChatWindow, useChatEngine } from '@reachbrt/vueai-chatbot';

const userAvatar = ref('/path/to/user-avatar.png');
const assistantAvatar = ref('/path/to/assistant-avatar.png');

// Chat engine setup...
</script>
```

## Advanced Usage: Custom Styling

You can customize the appearance of the chat window using CSS variables:

```css
:root {
  --vueai-chat-bg: #f7f7f7;
  --vueai-chat-user-bubble: #2563eb;
  --vueai-chat-user-text: #ffffff;
  --vueai-chat-assistant-bubble: #ffffff;
  --vueai-chat-assistant-text: #1f2937;
  --vueai-chat-input-bg: #ffffff;
  --vueai-chat-input-text: #1f2937;
  --vueai-chat-input-border: #e5e7eb;
  --vueai-chat-send-button: #2563eb;
  --vueai-chat-send-button-hover: #1d4ed8;
  --vueai-chat-font-family: 'Inter', sans-serif;
}
```

## API Reference

### AiChatWindow Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| messages | Array | Array of chat messages | `[]` |
| loading | Boolean | Whether the AI is generating a response | `false` |
| userAvatar | String | URL for user avatar | `null` |
| assistantAvatar | String | URL for assistant avatar | `null` |
| placeholder | String | Placeholder text for input field | `'Type a message...'` |
| theme | String | Theme ('light' or 'dark') | `'light'` |
| maxHeight | String | Maximum height of chat window | `'500px'` |
| disableInput | Boolean | Disable the input field | `false` |
| showResetButton | Boolean | Show the reset conversation button | `true` |

### AiChatWindow Events

| Event | Description | Payload |
|-------|-------------|---------|
| send | Emitted when user sends a message | `string` (message content) |
| reset | Emitted when user resets the conversation | None |

### useChatEngine Options

| Option | Type | Description | Required |
|--------|------|-------------|----------|
| provider | String | AI provider to use | Yes |
| apiKey | String | API key for the provider | No |
| model | String | Model to use | No |
| systemPrompt | String | Initial system prompt | No |
| streaming | Boolean | Enable streaming responses | No |
| initialMessages | Array | Initial messages to populate the chat | No |

## Related Packages

- [@reachbrt/vueai-core](https://www.npmjs.com/package/@reachbrt/vueai-core) - Core AI functionality for Vue.js components
- [@reachbrt/vueai-autosuggest](https://www.npmjs.com/package/@reachbrt/vueai-autosuggest) - AI-powered suggestion components for Vue.js
- [@reachbrt/vueai-smartform](https://www.npmjs.com/package/@reachbrt/vueai-smartform) - AI-powered form validation for Vue.js

## License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)
