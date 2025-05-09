# @aivue/chatbot

The `@aivue/chatbot` package provides ready-to-use chat components for Vue.js applications, powered by AI. Create engaging conversational interfaces with minimal setup, supporting multiple AI providers.

[![npm version](https://img.shields.io/npm/v/@aivue/chatbot.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/chatbot)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/chatbot.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/chatbot)

## Installation

```bash
# npm
npm install @aivue/chatbot @aivue/core

# yarn
yarn add @aivue/chatbot @aivue/core

# pnpm
pnpm add @aivue/chatbot @aivue/core
```

## Components

### AiChatWindow

A complete chat interface with message history, user input, and streaming responses.

```vue
<script setup>
import { AiChatWindow } from '@aivue/chatbot';
import { AIClient } from '@aivue/core';

const client = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});
</script>

<template>
  <AiChatWindow 
    :client="client"
    title="AI Assistant"
    placeholder="Ask me anything..."
    :initial-messages="[
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'assistant', content: 'Hello! How can I help you today?' }
    ]"
  />
</template>
```

#### Props

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

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `message-sent` | `{ message }` | Emitted when a user message is sent |
| `response-received` | `{ message }` | Emitted when an AI response is received |
| `error` | `{ error }` | Emitted when an error occurs |
| `clear` | - | Emitted when the chat history is cleared |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `header` | - | Custom header content |
| `message` | `{ message, index }` | Custom message rendering |
| `user-message` | `{ message, index }` | Custom user message rendering |
| `assistant-message` | `{ message, index }` | Custom assistant message rendering |
| `input` | `{ input, sendMessage }` | Custom input area |
| `footer` | - | Custom footer content |

### AiChatMessage

A component for rendering a single chat message.

```vue
<script setup>
import { AiChatMessage } from '@aivue/chatbot';
</script>

<template>
  <AiChatMessage
    :message="{ role: 'assistant', content: 'Hello! How can I help you?' }"
    :show-avatar="true"
    :show-timestamp="true"
  />
</template>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `Object` | **Required** | The message object to render |
| `showAvatar` | `Boolean` | `true` | Whether to show an avatar |
| `avatar` | `String` | `null` | URL for the avatar image |
| `showTimestamp` | `Boolean` | `false` | Whether to show a timestamp |
| `showCopyButton` | `Boolean` | `true` | Whether to show a copy button |
| `theme` | `String` | `'light'` | Theme for the message ('light' or 'dark') |

### AiChatInput

A component for user input in a chat interface.

```vue
<script setup>
import { AiChatInput } from '@aivue/chatbot';

function handleSend(message) {
  console.log('Message sent:', message);
}
</script>

<template>
  <AiChatInput
    placeholder="Type a message..."
    :loading="false"
    @send="handleSend"
  />
</template>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `String` | `'Type a message...'` | Placeholder text for the input field |
| `loading` | `Boolean` | `false` | Whether the chat is in a loading state |
| `disabled` | `Boolean` | `false` | Whether the input is disabled |
| `theme` | `String` | `'light'` | Theme for the input ('light' or 'dark') |
| `autofocus` | `Boolean` | `true` | Whether to autofocus the input |
| `submitOnEnter` | `Boolean` | `true` | Whether to submit on Enter key press |
| `submitOnShiftEnter` | `Boolean` | `false` | Whether to submit on Shift+Enter key press |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `send` | `message` | Emitted when a message is sent |
| `input` | `value` | Emitted when the input value changes |

## Composables

### useChatEngine

A composable for managing chat state and interactions with AI.

```vue
<script setup>
import { useChatEngine } from '@aivue/chatbot';
import { AIClient } from '@aivue/core';
import { ref } from 'vue';

const client = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});

const { 
  messages, 
  isLoading, 
  error, 
  sendMessage, 
  clearMessages 
} = useChatEngine({
  client,
  initialMessages: [
    { role: 'system', content: 'You are a helpful assistant.' },
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
      <div v-for="(message, index) in messages" :key="index" class="message">
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

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | `AIClient` | **Required** | The AIClient instance to use |
| `initialMessages` | `Array` | `[]` | Initial messages to populate the chat |
| `systemPrompt` | `String` | `'You are a helpful assistant.'` | System prompt to guide the AI's behavior |
| `streaming` | `Boolean` | `true` | Whether to stream responses token by token |
| `persistenceKey` | `String` | `null` | Key for persisting chat history in localStorage |
| `maxMessages` | `Number` | `100` | Maximum number of messages to keep in history |
| `onError` | `Function` | `null` | Callback function when an error occurs |

#### Return Values

| Value | Type | Description |
|-------|------|-------------|
| `messages` | `Ref<Array>` | Reactive array of chat messages |
| `isLoading` | `Ref<Boolean>` | Whether a response is being generated |
| `error` | `Ref<String>` | Error message, if any |
| `sendMessage` | `Function` | Function to send a user message |
| `clearMessages` | `Function` | Function to clear the chat history |
| `setMessages` | `Function` | Function to set the messages array |
| `addMessage` | `Function` | Function to add a single message |

## Styling

The components come with default styling but can be customized using CSS variables:

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
```

## Related Packages

- [@aivue/core](https://github.com/reachbrt/vueai/wiki/Core) - Core AI functionality for Vue.js components
- [@aivue/autosuggest](https://github.com/reachbrt/vueai/wiki/Autosuggest) - AI-powered suggestion components for Vue.js
- [@aivue/smartform](https://github.com/reachbrt/vueai/wiki/Smartform) - AI-powered form validation for Vue.js
