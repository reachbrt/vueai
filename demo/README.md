# Vue AI Components Demo

A demonstration of the @aivue packages for Vue.js, showcasing AI-powered components including:

- **AI Chatbot**: Conversational AI interface with multiple themes and customization options
- **AI Autosuggest**: Smart input suggestions powered by AI
- **AI Smart Form**: Form validation and enhancement with AI

## Live Demo

Check out the live demo at [https://aivue-demo.netlify.app/](https://aivue-demo.netlify.app/)

## Running the Demo

You can run the demo in several ways:

### From the root directory:

```bash
# Using npm script
npm run demo

# Or using the shell script directly
./run-demo.sh
```

### From the demo directory:

```bash
cd demo

# Using npm script
npm run dev

# Or using npm start
npm start

# Or using Vite directly
npx vite --host localhost --port 8080
```

The demo will be available at http://localhost:8080

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
   VITE_OPENAI_API_KEY=your_openai_key_here
   ```

3. Start the development server:

```bash
npm run dev
```

> **Note:** The demo will work without API keys using the fallback provider, which simulates AI responses. For the best experience, add your OpenAI API key to the `.env` file.

## CSS Integration

The @aivue/chatbot package now includes CSS automatically. You can import it in two ways:

### Method 1: Automatic CSS Inclusion (Recommended)

The CSS is automatically included when you import the components:

```js
import { AiChatWindow, AiChatToggle } from '@aivue/chatbot';
```

### Method 2: Explicit CSS Import

If you need to import the CSS separately:

```js
// In your main.js or main.ts file
import '@aivue/chatbot/style.css';
```

This is the recommended way to import the CSS, as it uses the exports field in the package.json to correctly resolve the CSS file path.

## Features

- Multiple themes for the chatbot (Modern, Dark, Soft, Vibrant, Corporate)
- Fullscreen mode (press F key)
- Toggle functionality for the chatbot
- API key configuration for OpenAI
- Responsive design for all screen sizes

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

## Packages Used

- @aivue/chatbot: ^1.4.5
- @aivue/core: ^1.2.7
- @aivue/autosuggest: ^1.2.8
- @aivue/smartform: ^1.2.8
- Vue.js: ^3.5.13

## License

MIT
