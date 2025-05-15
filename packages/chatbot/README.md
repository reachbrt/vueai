<div align="center">
  <img src="https://raw.githubusercontent.com/reachbrt/vueai/main/demo/src/assets/images/chatbot-illustration.svg" alt="AI Chatbot" width="150" height="150" />

  <h1>@aivue/chatbot</h1>
  <p>AI-powered chat components for Vue.js applications</p>

  <p>
    <a href="https://www.npmjs.com/package/@aivue/chatbot"><img src="https://img.shields.io/npm/v/@aivue/chatbot.svg?style=flat-square" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@aivue/chatbot"><img src="https://img.shields.io/npm/dm/@aivue/chatbot.svg?style=flat-square" alt="npm downloads"></a>
    <a href="https://www.npmjs.com/package/@aivue/chatbot"><img src="https://img.shields.io/npm/d18m/%40aivue%2Fchatbot" alt="NPM Downloads"></a>
    <a href="https://github.com/reachbrt/vueai/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aivue/chatbot.svg?style=flat-square" alt="MIT License"></a>
    <a href="https://codecov.io/gh/reachbrt/vueai"><img src="https://codecov.io/gh/reachbrt/vueai/graph/badge.svg?token=8LYV3M14ZG" alt="codecov"></a>
    <a href="https://app.netlify.com/sites/aivue/deploys"><img src="https://api.netlify.com/api/v1/badges/5cb37fa7-9ee1-4af6-9ff4-d34ff0322ded/deploy-status" alt="Netlify Status"></a>
  </p>

  <p><a href="https://aivue.netlify.app/" target="_blank">📺 Live Demo</a> • <a href="https://github.com/reachbrt/vueai/wiki" target="_blank">📚 Documentation</a> • <a href="https://github.com/reachbrt/vueai/issues/new" target="_blank">🐛 Report Bug</a></p>
</div>

## ✨ Overview

`@aivue/chatbot` provides ready-to-use chat components for Vue.js applications, powered by AI. Create engaging conversational interfaces with minimal setup, supporting multiple AI providers.

## ✨ Features

- **💬 Ready-to-use Chat UI**: Beautiful, responsive chat interface with minimal setup
- **🔄 Real-time Streaming**: See AI responses as they're generated, token by token
- **📱 Mobile-friendly**: Responsive design works on all devices and screen sizes
- **🎨 Customizable**: Easily style to match your application with CSS variables
- **🧠 Multiple AI Providers**: Works with OpenAI, Claude, Gemini, HuggingFace, and more
- **📝 Markdown Support**: Rich text formatting in messages with code highlighting
- **💾 Conversation History**: Save and load chat sessions with localStorage integration
- **🔧 Fully Typed**: Complete TypeScript support with comprehensive type definitions
- **🔌 Vue Plugin**: Easy global registration of components with Vue plugin
- **🔒 API Key Security**: Built-in proxy support for secure API key handling
- **🚀 Composition API**: First-class support for Vue 3 Composition API
- **🪄 Dynamic Configuration**: Update models and settings on the fly

## 📦 Installation

<div class="installation-section">
  <div class="installation-tabs">
    <div class="installation-tab">
      <div class="tab-header">npm</div>
      <div class="tab-content">

```bash
npm install @aivue/chatbot @aivue/core
```

      </div>
    </div>

    <div class="installation-tab">
      <div class="tab-header">yarn</div>
      <div class="tab-content">

```bash
yarn add @aivue/chatbot @aivue/core
```

      </div>
    </div>

    <div class="installation-tab">
      <div class="tab-header">pnpm</div>
      <div class="tab-content">

```bash
pnpm add @aivue/chatbot @aivue/core
```

      </div>
    </div>
  </div>

  <div class="installation-note">
    <p>Don't forget to import the CSS:</p>

```javascript
// Import the CSS from the chatbot package
import '@aivue/chatbot/style.css'
```

  </div>
</div>

### 🔄 Vue Compatibility

- **✅ Vue 2**: Compatible with Vue 2.6.0 and higher
- **✅ Vue 3**: Compatible with all Vue 3.x versions

> The package automatically detects which version of Vue you're using and provides the appropriate compatibility layer. This means you can use the same package regardless of whether your project is using Vue 2 or Vue 3.

## 🚀 Quick Start

<div class="quick-start-section">
  <div class="step-container">
    <h3><span class="step-number">1</span> Set up the AI Client</h3>
    <div class="step-content">
      <p>First, create an AI client using <code>@aivue/core</code>:</p>

```javascript
// ai-client.js
import { AIClient } from '@aivue/core';

export const aiClient = new AIClient({
  provider: 'openai', // or 'claude', 'gemini', 'huggingface', 'ollama', 'deepseek'
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Use environment variables for API keys
  model: 'gpt-4o' // Specify the model to use
});
```
    </div>
  </div>

  <div class="step-container">
    <h3><span class="step-number">2</span> Use the AiChatWindow Component</h3>
    <div class="step-content">
      <p>Import and use the component in your Vue application:</p>

```vue
<template>
  <div class="chat-container">
    <AiChatWindow
      :client="aiClient"
      title="AI Assistant"
      placeholder="Ask me anything..."
      :show-avatars="true"
      theme="light"
    />
  </div>
</template>

<script setup>
import { AiChatWindow } from '@aivue/chatbot';
import '@aivue/chatbot/style.css'; // Import the CSS
import { aiClient } from './ai-client.js';
</script>

<style>
.chat-container {
  height: 600px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
```
    </div>
  </div>

  <div class="step-container">
    <h3><span class="step-number">3</span> That's it!</h3>
    <div class="step-content">
      <p>You now have a fully functional AI chat interface in your Vue application. The component handles all the complexity of managing the chat state, sending messages to the AI provider, and displaying the responses.</p>

      <div class="demo-link">
        <a href="https://aivue.netlify.app/" target="_blank">See the live demo →</a>
      </div>
    </div>
  </div>
</div>

### 3. Register Components Globally (Optional)

If you prefer to register components globally, you can use the provided Vue plugin:

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { AiChatPlugin } from '@aivue/chatbot';

const app = createApp(App);
app.use(AiChatPlugin); // Register all components globally
app.mount('#app');
```

Or register individual components manually:

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

### Using with an AIClient instance

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
</script>
```

### Direct provider configuration (new)

You can now configure the provider directly without creating an AIClient instance:

```vue
<script setup>
import { ref } from 'vue';
import { useChatEngine } from '@aivue/chatbot';

const {
  messages,
  isLoading,
  error,
  sendMessage,
  clearMessages,
  resetError,
  updateConfig
} = useChatEngine({
  // Provider configuration
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-3.5-turbo',

  // API security
  useProxy: true,
  proxyUrl: '/api/chat',

  // Chat behavior
  initialMessages: [
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ],
  systemPrompt: 'You are a helpful assistant.',
  streaming: true,
  persistenceKey: 'my-chat-history',

  // Callbacks
  onError: (err) => console.error('Chat error:', err),
  onMessageSent: (msg) => console.log('Message sent:', msg),
  onResponseReceived: (msg) => console.log('Response received:', msg)
});

// You can dynamically update the configuration
function switchToGpt4() {
  updateConfig({ model: 'gpt-4o' });
}

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
      <button @click="switchToGpt4">Switch to GPT-4</button>
    </div>

    <div v-if="error" class="error">{{ error.message }}</div>
  </div>
</template>
```

Note that all values returned from `useChatEngine` are Vue reactive refs, so you can use them directly in your templates without `.value`.

## Customizing the Chat Window

### Using with AIClient

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

### Direct Provider Configuration (New)

You can now configure the provider directly without creating an AIClient instance:

```vue
<template>
  <AiChatWindow
    provider="openai"
    :api-key="apiKey"
    model="gpt-3.5-turbo"
    :use-proxy="true"
    proxy-url="/api/chat"
    title="AI Assistant"
    placeholder="Ask me anything about Vue..."
    :initial-messages="initialMessages"
    system-prompt="You are a Vue.js expert who provides clear, concise answers."
    :streaming="true"
    theme="dark"
    :show-timestamps="true"
    @message-sent="handleMessageSent"
    @response-received="handleResponseReceived"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue';
import { AiChatWindow } from '@aivue/chatbot';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
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

## Demo Mode (No API Key Required)

You can use the chatbot in demo mode without an API key:

```vue
<template>
  <AiChatWindow
    provider="openai"
    :demoMode="true"
    :demoResponses="{
      'hello': 'Hello! I\'m a demo AI assistant.',
      'help': 'I can help you with various tasks. Just ask me a question!',
      'features': 'This chatbot supports markdown, code highlighting, and more!'
    }"
  />
</template>

<script setup>
import { AiChatWindow } from '@aivue/chatbot';
</script>
```

This is useful for:
- Showcasing the chatbot functionality without requiring an API key
- Creating demos and examples
- Testing the UI without making actual API calls
- Fallback when API keys are not available

## Using the Intercom-like Chat Toggle

The `AiChatToggle` component provides an Intercom-like floating chat button that expands into a chat window:

```vue
<template>
  <!-- Floating chat button that toggles the chat window -->
  <AiChatToggle
    provider="openai"
    :api-key="apiKey"
    model="gpt-3.5-turbo"
    position="bottom"  <!-- 'bottom' or 'top' -->
    :default-open="false"
    title="Chat with AI"
    theme="light"
  />
</template>

<script setup>
import { AiChatToggle } from '@aivue/chatbot';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
</script>
```

### AiChatToggle with Custom Content

You can also use your own custom chat implementation inside the toggle:

```vue
<template>
  <AiChatToggle position="bottom" title="Custom Chat">
    <!-- Your custom chat implementation goes here -->
    <div class="custom-chat">
      <div class="messages">
        <div v-for="msg in messages" :key="msg.id" class="message">
          {{ msg.content }}
        </div>
      </div>
      <input v-model="input" @keyup.enter="sendMessage" />
      <button @click="sendMessage">Send</button>
    </div>
  </AiChatToggle>
</template>

<script setup>
import { ref } from 'vue';
import { AiChatToggle } from '@aivue/chatbot';

const messages = ref([]);
const input = ref('');

function sendMessage() {
  if (input.value.trim()) {
    messages.value.push({ id: Date.now(), content: input.value });
    input.value = '';
  }
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
| **Provider Configuration** | | | |
| `client` | `AIClient` | `null` | The AIClient instance to use for generating responses |
| `provider` | `String` | `null` | AI provider (e.g., 'openai', 'claude', 'gemini') |
| `apiKey` | `String` | `null` | API key for the provider |
| `model` | `String` | `null` | Model to use (e.g., 'gpt-3.5-turbo') |
| `baseUrl` | `String` | `null` | Custom base URL for API requests |
| `organizationId` | `String` | `null` | Organization ID (for OpenAI) |
| **API Security** | | | |
| `useProxy` | `Boolean` | `false` | Whether to use a proxy for API requests |
| `proxyUrl` | `String` | `'/api/chat'` | URL for the proxy endpoint |
| **Chat Configuration** | | | |
| `title` | `String` | `'Chat'` | The title displayed in the chat window header |
| `placeholder` | `String` | `'Type a message...'` | Placeholder text for the input field |
| `initialMessages` | `Array` | `[]` | Initial messages to populate the chat |
| `systemPrompt` | `String` | `'You are a helpful assistant.'` | System prompt to guide the AI's behavior |
| `streaming` | `Boolean` | `true` | Whether to stream responses token by token |
| `loadingText` | `String` | `'Thinking...'` | Text to display while waiting for a response |
| `errorText` | `String` | `'An error occurred. Please try again.'` | Text to display when an error occurs |
| **UI Configuration** | | | |
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
| **Demo Mode** | | | |
| `demoMode` | `Boolean` | `false` | Whether to use demo mode (no API key required) |
| `demoResponses` | `Object` | `{}` | Map of keywords to predefined responses for demo mode |

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

### AiChatToggle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **Toggle Behavior** | | | |
| `position` | `String` | `'bottom'` | Position of the toggle button ('bottom' or 'top') |
| `defaultOpen` | `Boolean` | `false` | Whether the chat window is open by default |
| `title` | `String` | `'Chat with AI'` | Title displayed in the chat window header |
| **Provider Configuration** | | | |
| `client` | `AIClient` | `null` | The AIClient instance to use for generating responses |
| `provider` | `String` | `null` | AI provider (e.g., 'openai', 'claude', 'gemini') |
| `apiKey` | `String` | `null` | API key for the provider |
| `model` | `String` | `null` | Model to use (e.g., 'gpt-3.5-turbo') |
| **Chat Configuration** | | | |
| `placeholder` | `String` | `'Type a message...'` | Placeholder text for the input field |
| `initialMessages` | `Array` | `[]` | Initial messages to populate the chat |
| `systemPrompt` | `String` | `'You are a helpful assistant.'` | System prompt to guide the AI's behavior |
| `streaming` | `Boolean` | `true` | Whether to stream responses token by token |
| `theme` | `String` | `'light'` | Theme for the chat window ('light' or 'dark') |
| `showAvatars` | `Boolean` | `true` | Whether to show avatars for the user and assistant |
| `persistenceKey` | `String` | `null` | Key for persisting chat history in localStorage |
| **Demo Mode** | | | |
| `demoMode` | `Boolean` | `false` | Whether to use demo mode (no API key required) |
| `demoResponses` | `Object` | `{}` | Map of keywords to predefined responses for demo mode |

### AiChatToggle Events

| Event | Payload | Description |
|-------|---------|-------------|
| `toggle` | `boolean` | Emitted when the chat window is toggled, with the new state |
| `message-sent` | `{ message }` | Emitted when a user message is sent |
| `response-received` | `{ message }` | Emitted when an AI response is received |
| `error` | `{ error }` | Emitted when an error occurs |

### AiChatToggle Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | - | Custom chat implementation (replaces the default AiChatWindow) |
| `toggle-icon` | - | Custom icon for the toggle button when closed |
| `close-icon` | - | Custom icon for the toggle button when open |

### useChatEngine Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| **Provider Configuration** | | | |
| `client` | `AIClient` | `null` | The AIClient instance to use |
| `provider` | `String` | **Required if no client** | AI provider (e.g., 'openai', 'claude', 'gemini') |
| `apiKey` | `String` | `undefined` | API key for the provider |
| `model` | `String` | provider-dependent | Model to use |
| `baseUrl` | `String` | `undefined` | Custom base URL for API requests |
| `organizationId` | `String` | `undefined` | Organization ID (for OpenAI) |
| **API Security** | | | |
| `useProxy` | `Boolean` | `false` | Whether to use a proxy for API requests |
| `proxyUrl` | `String` | `'/api/chat'` | URL for the proxy endpoint |
| **Chat Behavior** | | | |
| `initialMessages` | `Array` | `[]` | Initial messages to populate the chat |
| `systemPrompt` | `String` | `'You are a helpful assistant.'` | System prompt to guide the AI's behavior |
| `streaming` | `Boolean` | `true` | Whether to stream responses token by token |
| `persistenceKey` | `String` | `null` | Key for persisting chat history in localStorage |
| `maxMessages` | `Number` | `100` | Maximum number of messages to keep in history |
| **Demo Mode** | | | |
| `demoMode` | `Boolean` | `false` | Whether to use demo mode (no API key required) |
| `demoResponses` | `Object` | `{}` | Map of keywords to predefined responses for demo mode |
| **Callbacks** | | | |
| `onError` | `Function` | `null` | Callback function when an error occurs |
| `onMessageSent` | `Function` | `null` | Callback when a message is sent |
| `onResponseReceived` | `Function` | `null` | Callback when a response is received |

### useChatEngine Return Values

| Value | Type | Description |
|-------|------|-------------|
| `messages` | `Ref<Array>` | Reactive array of chat messages |
| `isLoading` | `Ref<Boolean>` | Whether a response is being generated |
| `error` | `Ref<Error>` | Error object, if any |
| `sendMessage` | `Function` | Function to send a user message |
| `clearMessages` | `Function` | Function to clear the chat history |
| `setMessages` | `Function` | Function to set the messages array |
| `addMessage` | `Function` | Function to add a single message |
| `resetError` | `Function` | Function to reset the error state |
| `updateConfig` | `Function` | Function to update configuration options |

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
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  systemPrompt: 'You are a helpful assistant.'
};
```

### API Key Security

For security reasons, never hardcode API keys in your code. Use environment variables instead:

```javascript
// .env file
VITE_OPENAI_API_KEY=your-api-key

// In your code
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
```

Or better yet, use the proxy feature:

```vue
<script setup>
import { useChatEngine } from '@aivue/chatbot';

const { messages, isLoading, sendMessage } = useChatEngine({
  provider: 'openai',
  useProxy: true,
  proxyUrl: '/api/chat' // Your backend endpoint
});
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

### Vite Configuration

For Vite projects, add the following to your `vite.config.js`:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['@aivue/chatbot', '@aivue/core']
  }
});
```

### Vue Version Compatibility Issues

If you encounter errors related to missing Vue functions like `createElementBlock`, `normalizeClass`, or `createElementVNode`, it means you're using an older version of Vue 3 (pre-3.2.0). Here's how to fix it:

1. **Check your Vue version**:
   ```bash
   npm list vue
   ```

2. **If you're using Vue < 3.2.0**:
   The package includes a compatibility layer that should handle this automatically. If you're still experiencing issues, you can:

   a. **Update to Vue 3.2.0 or higher** (recommended):
   ```bash
   npm install vue@^3.2.0
   ```

   b. **Use the compatibility utilities explicitly**:
   ```javascript
   import {
     compatCreateElementBlock,
     compatCreateElementVNode,
     compatNormalizeClass
   } from '@aivue/chatbot';

   // Use these functions instead of the Vue ones
   ```

3. **For component registration issues**:
   Use the provided compatibility helpers:
   ```javascript
   import { registerCompatComponent } from '@aivue/chatbot';

   // Instead of app.component('MyComponent', Component)
   registerCompatComponent(app, 'MyComponent', Component);
   ```

## 📺 Live Demo

<div class="demo-section">
  <div class="demo-card">
    <div class="demo-image">
      <img src="https://raw.githubusercontent.com/reachbrt/vueai/main/demo/src/assets/images/chatbot-illustration.svg" alt="AI Chatbot Demo" width="200" height="150" />
    </div>
    <div class="demo-content">
      <h3>Interactive Demo</h3>
      <p>See the chatbot components in action with our interactive demo. Try different AI providers, customize the appearance, and test all the features.</p>
      <div class="demo-cta">
        <a href="https://aivue.netlify.app/" target="_blank" class="demo-button">Launch Demo</a>
      </div>
    </div>
  </div>
</div>

## 📦 Related Packages

<div class="related-packages">
  <a href="https://www.npmjs.com/package/@aivue/core" class="package-card" target="_blank">
    <h4><span class="package-icon">🧠</span> @aivue/core</h4>
    <div class="package-content">
      <p>Core AI functionality for Vue.js components</p>
    </div>
  </a>

  <a href="https://www.npmjs.com/package/@aivue/autosuggest" class="package-card" target="_blank">
    <h4><span class="package-icon">✨</span> @aivue/autosuggest</h4>
    <div class="package-content">
      <p>AI-powered suggestion components for Vue.js</p>
    </div>
  </a>

  <a href="https://www.npmjs.com/package/@aivue/smartform" class="package-card" target="_blank">
    <h4><span class="package-icon">📝</span> @aivue/smartform</h4>
    <div class="package-content">
      <p>AI-powered form validation for Vue.js</p>
    </div>
  </a>
</div>

## 📄 License

<div class="license-section">
  <p>MIT © <a href="https://github.com/reachbrt" target="_blank">Bharatkumar Subramanian</a></p>
</div>
