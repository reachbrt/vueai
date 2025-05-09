<template>
  <div class="typescript-example">
    <h3>TypeScript Integration Example</h3>

    <div class="code-example">
      <pre><code>// Import types from @aivue/chatbot
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
};</code></pre>
    </div>

    <div class="example-output">
      <h4>Live Example</h4>
      <div class="message-list">
        <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
          <div class="message-header">
            <span class="role">{{ message.role }}</span>
            <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
          </div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>

      <div class="controls">
        <button @click="addMessage" :disabled="isLoading">Add Message</button>
        <button @click="clearMessages" :disabled="isLoading">Clear Messages</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

// Define types
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
  timestamp?: Date;
}

// Simple UUID generator
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default defineComponent({
  name: 'TypeScriptExample',
  setup() {
    // Create a typed reactive array of messages
    const messages = ref<Message[]>([
      {
        role: 'user',
        content: 'Hello, AI!',
        id: uuidv4(),
        timestamp: new Date()
      },
      {
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        id: uuidv4(),
        timestamp: new Date()
      }
    ]);

    const isLoading = ref(false);

    // Format timestamp
    const formatTimestamp = (timestamp?: Date): string => {
      if (!timestamp) return '';
      return timestamp.toLocaleTimeString();
    };

    // Add a new message
    const addMessage = (): void => {
      isLoading.value = true;

      // Add user message
      const userMessage: Message = {
        role: 'user',
        content: 'Tell me something interesting about TypeScript.',
        id: uuidv4(),
        timestamp: new Date()
      };
      messages.value.push(userMessage);

      // Simulate AI response
      setTimeout(() => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: 'TypeScript is a strongly typed programming language that builds on JavaScript. It was developed by Microsoft and is designed for large-scale applications. One interesting feature is its structural type system, which is different from nominal typing used in languages like Java or C#.',
          id: uuidv4(),
          timestamp: new Date()
        };
        messages.value.push(assistantMessage);
        isLoading.value = false;
      }, 1000);
    };

    // Clear all messages
    const clearMessages = (): void => {
      messages.value = [];
    };

    return {
      messages,
      isLoading,
      formatTimestamp,
      addMessage,
      clearMessages
    };
  }
});
</script>

<style scoped>
.typescript-example {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.code-example {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
}

.example-output {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.example-output h4 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #334155;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.message {
  padding: 12px;
  border-radius: 8px;
}

.message.user {
  background-color: #dbeafe;
  align-self: flex-end;
  max-width: 80%;
}

.message.assistant {
  background-color: #f1f5f9;
  align-self: flex-start;
  max-width: 80%;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.75rem;
}

.role {
  font-weight: bold;
  color: #64748b;
}

.timestamp {
  color: #94a3b8;
}

.content {
  white-space: pre-wrap;
  word-break: break-word;
}

.controls {
  display: flex;
  gap: 8px;
}

.controls button {
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}
</style>
