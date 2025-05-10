# AIVue Chatbot Demo

This is a demonstration of the `@aivue/chatbot` package with TypeScript support. It showcases various ways to use the package in a Vue 3 application.

## Features

- Basic usage of the `AiChatWindow` component
- Custom chat implementation using the `useChatEngine` composable
- TypeScript integration examples

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up your API keys:
   - Copy `.env.example` to `.env`
   - Add your API keys to the `.env` file:
   ```
   # OpenAI API Key
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173).

> **Note:** The demo will work without API keys using the fallback provider, which simulates AI responses. For the best experience, add your OpenAI API key to the `.env` file.

## Examples

### Basic Chat Window

The simplest way to use the `@aivue/chatbot` package is to import and use the `AiChatWindow` component:

```vue
<template>
  <AiChatWindow
    :client="aiClient"
    title="AI Assistant"
    placeholder="Ask me anything..."
    :show-avatars="true"
    theme="light"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AiChatWindow } from '@aivue/chatbot';
import { aiClient } from './ai-client';

export default defineComponent({
  components: {
    AiChatWindow
  },
  setup() {
    return {
      aiClient
    };
  }
});
</script>
```

### Custom Chat Implementation

You can create a custom chat interface using the `useChatEngine` composable:

```vue
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useChatEngine } from '@aivue/chatbot';
import { aiClient } from './ai-client';

export default defineComponent({
  setup() {
    const userInput = ref('');

    const { messages, isLoading, error, sendMessage } = useChatEngine({
      client: aiClient,
      systemPrompt: 'You are a helpful assistant.',
      streaming: true
    });

    const handleSendMessage = async () => {
      if (!userInput.value.trim() || isLoading.value) return;

      const message = userInput.value;
      userInput.value = '';

      await sendMessage(message);
    };

    return {
      userInput,
      messages,
      isLoading,
      error,
      handleSendMessage
    };
  }
});
</script>
```

### TypeScript Integration

The package includes full TypeScript support:

```typescript
import { Message, ChatOptions } from '@aivue/chatbot';

// Create a typed message array
const messages: Message[] = [
  {
    role: 'user',
    content: 'Hello, AI!',
    id: '123',
    timestamp: new Date()
  }
];

// Create typed chat options
const chatOptions: ChatOptions = {
  client: aiClient,
  initialMessages: messages,
  systemPrompt: 'You are a helpful assistant.',
  streaming: true
};
```

## License

MIT
