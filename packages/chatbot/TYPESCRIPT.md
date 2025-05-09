# TypeScript Usage Guide for @aivue/chatbot

This guide provides detailed examples of how to use the `@aivue/chatbot` package with TypeScript.

## Table of Contents

- [Type Definitions](#type-definitions)
- [Using the AiChatWindow Component](#using-the-aichatwindow-component)
- [Using the useChatEngine Composable](#using-the-usechatengine-composable)
- [Working with Message Objects](#working-with-message-objects)
- [Advanced TypeScript Patterns](#advanced-typescript-patterns)

## Type Definitions

The `@aivue/chatbot` package exports the following TypeScript types:

```typescript
// Message type extends the core Message type with additional properties
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  id?: string;
  timestamp?: Date;
}

// Options for the useChatEngine composable
interface ChatOptions {
  client: AIClient;
  initialMessages?: Message[];
  systemPrompt?: string;
  streaming?: boolean;
  persistenceKey?: string | null;
  maxMessages?: number;
  onError?: ((error: Error) => void) | null;
}

// State returned by the useChatEngine composable
interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
}
```

## Using the AiChatWindow Component

### Basic Usage with TypeScript

```vue
<template>
  <AiChatWindow
    :client="aiClient"
    title="AI Assistant"
    placeholder="Ask me anything..."
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AiChatWindow } from '@aivue/chatbot';
import { AIClient } from '@aivue/core';

export default defineComponent({
  components: {
    AiChatWindow
  },
  setup() {
    const aiClient = new AIClient({
      provider: 'openai',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY
    });

    return {
      aiClient
    };
  }
});
</script>
```

### With Props Type Checking

```vue
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { AiChatWindow, Message } from '@aivue/chatbot';
import { AIClient } from '@aivue/core';

export default defineComponent({
  components: {
    AiChatWindow
  },
  props: {
    initialMessages: {
      type: Array as PropType<Message[]>,
      default: () => []
    },
    theme: {
      type: String as PropType<'light' | 'dark'>,
      default: 'light',
      validator: (value: string) => ['light', 'dark'].includes(value)
    }
  },
  setup(props) {
    const aiClient = new AIClient({
      provider: 'openai',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY
    });

    return {
      aiClient
    };
  }
});
</script>
```

## Using the useChatEngine Composable

### Basic Usage

```typescript
import { ref } from 'vue';
import { useChatEngine, Message } from '@aivue/chatbot';
import { AIClient } from '@aivue/core';

const aiClient = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

const { messages, isLoading, error, sendMessage, clearMessages } = useChatEngine({
  client: aiClient,
  systemPrompt: 'You are a helpful assistant.',
  streaming: true
});

// Send a message
const userInput = ref('');
const handleSendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;
  
  const message = userInput.value;
  userInput.value = '';
  
  await sendMessage(message);
};
```

### With Custom Message Handling

```typescript
import { ref, watch } from 'vue';
import { useChatEngine, Message, ChatOptions } from '@aivue/chatbot';
import { AIClient } from '@aivue/core';

// Create a typed chat options object
const chatOptions: ChatOptions = {
  client: new AIClient({
    provider: 'openai',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
  }),
  systemPrompt: 'You are a helpful assistant.',
  streaming: true,
  maxMessages: 50,
  onError: (error: Error) => {
    console.error('Chat error:', error);
  }
};

const { messages, isLoading, error, sendMessage } = useChatEngine(chatOptions);

// Watch for new messages
watch(messages, (newMessages: Message[]) => {
  const lastMessage = newMessages[newMessages.length - 1];
  if (lastMessage && lastMessage.role === 'assistant') {
    console.log('New assistant message:', lastMessage.content);
  }
}, { deep: true });
```

## Working with Message Objects

### Creating and Manipulating Messages

```typescript
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@aivue/chatbot';

// Create a new message with TypeScript
const createMessage = (role: 'system' | 'user' | 'assistant', content: string): Message => {
  return {
    role,
    content,
    id: uuidv4(),
    timestamp: new Date()
  };
};

// Create a user message
const userMessage: Message = createMessage('user', 'Hello, AI!');

// Create an assistant message
const assistantMessage: Message = createMessage('assistant', 'Hello! How can I help you today?');

// Create a system message
const systemMessage: Message = createMessage('system', 'You are a helpful assistant.');

// Create a message array
const messages: Message[] = [systemMessage, userMessage, assistantMessage];

// Filter messages by role
const userMessages = messages.filter(msg => msg.role === 'user');
const assistantMessages = messages.filter(msg => msg.role === 'assistant');
```

## Advanced TypeScript Patterns

### Using Generics with Chat Functions

```typescript
import { Message } from '@aivue/chatbot';

// Generic function to process messages
function processMessages<T extends Message>(messages: T[], processor: (msg: T) => any): any[] {
  return messages.map(processor);
}

// Example usage
const messages: Message[] = [
  { role: 'user', content: 'Hello', id: '1', timestamp: new Date() },
  { role: 'assistant', content: 'Hi there!', id: '2', timestamp: new Date() }
];

const contents = processMessages(messages, (msg) => msg.content);
// Result: ['Hello', 'Hi there!']

const timestamps = processMessages(messages, (msg) => msg.timestamp?.toISOString());
// Result: ['2023-05-08T12:00:00.000Z', '2023-05-08T12:01:00.000Z']
```

### Type Guards for Message Validation

```typescript
import { Message } from '@aivue/chatbot';

// Type guard to check if an object is a valid Message
function isValidMessage(obj: any): obj is Message {
  return (
    obj &&
    typeof obj === 'object' &&
    (obj.role === 'system' || obj.role === 'user' || obj.role === 'assistant') &&
    typeof obj.content === 'string'
  );
}

// Example usage
function processInput(input: any): Message | null {
  if (isValidMessage(input)) {
    // TypeScript knows input is a Message here
    return {
      ...input,
      id: input.id || uuidv4(),
      timestamp: input.timestamp || new Date()
    };
  }
  return null;
}
```

For more information, refer to the [API documentation](./README.md) and the [demo application](./demo).
