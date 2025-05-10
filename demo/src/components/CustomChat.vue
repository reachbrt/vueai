<template>
  <div class="custom-chat">
    <div class="custom-chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
        <div class="message-header">
          <div class="message-role">{{ message.role === 'user' ? 'You' : 'AI' }}</div>
          <div class="message-time" v-if="message.timestamp">{{ formatTime(message.timestamp) }}</div>
        </div>
        <div class="message-content" v-html="formatMessage(message.content)"></div>
      </div>

      <div v-if="isLoading" class="message loading assistant">
        <div class="message-header">
          <div class="message-role">AI</div>
          <div class="message-time">{{ formatTime(new Date()) }}</div>
        </div>
        <div class="message-content">Thinking...</div>
      </div>
    </div>

    <div class="custom-chat-input">
      <input
        v-model="userInput"
        type="text"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
        :disabled="isLoading"
      />
      <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue';
import { useChatEngine, utils } from '@aivue/chatbot';
import { aiClient } from '../ai-client';

export default defineComponent({
  name: 'CustomChat',
  setup() {
    const userInput = ref('');
    const messagesContainer = ref<HTMLElement | null>(null);

    // Use the chatEngine composable
    const { messages, isLoading, error, sendMessage: sendChatMessage } = useChatEngine({
      client: aiClient,
      systemPrompt: 'You are a helpful assistant that provides concise answers.',
      streaming: true
    });

    // Send a message
    const sendMessage = async () => {
      if (!userInput.value.trim() || isLoading.value) return;

      const message = userInput.value;
      userInput.value = '';

      await sendChatMessage(message);
    };

    // Format message with markdown
    const formatMessage = (content: string): string => {
      return utils.formatMarkdown(content);
    };

    // Format timestamp
    const formatTime = (timestamp?: Date): string => {
      if (!timestamp) return '';
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Auto-scroll to bottom when new messages arrive
    watch(messages, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    }, { deep: true });

    return {
      userInput,
      messages,
      isLoading,
      error,
      messagesContainer,
      sendMessage,
      formatMessage,
      formatTime
    };
  }
});
</script>

<style scoped>
.custom-chat {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.custom-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f8fafc;
}

.message {
  margin-bottom: 16px;
  max-width: 80%;
  padding: 12px;
  border-radius: 8px;
}

.message.user {
  background-color: #dbeafe;
  margin-left: auto;
}

.message.assistant {
  background-color: #f1f5f9;
}

.message.loading {
  background-color: #f1f5f9;
  opacity: 0.7;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.message-role {
  font-weight: bold;
  font-size: 0.875rem;
  color: #64748b;
}

.message-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.custom-chat-input {
  display: flex;
  padding: 12px;
  border-top: 1px solid #e2e8f0;
  background-color: white;
}

.custom-chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-right: 8px;
}

.custom-chat-input button {
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.custom-chat-input button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}
</style>
