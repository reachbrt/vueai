<template>
  <div class="smart-datatable-chat" :class="{ 'dark-theme': theme === 'dark' }">
    <div class="chat-header">
      <h4>💬 Chat with Table</h4>
      <button @click="$emit('close')" class="close-btn">×</button>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="chat-message"
        :class="`message-${message.role}`"
      >
        <div class="message-content">
          <div class="message-text">{{ message.content }}</div>
          <div v-if="message.data" class="message-data">
            <pre>{{ JSON.stringify(message.data, null, 2) }}</pre>
          </div>
        </div>
      </div>
      <div v-if="loading" class="chat-message message-assistant">
        <div class="message-content">
          <div class="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="userInput"
        type="text"
        placeholder="Ask about the data... e.g., 'What is the average order value?'"
        @keyup.enter="sendMessage"
        :disabled="loading"
      />
      <button @click="sendMessage" :disabled="loading || !userInput.trim()">
        Send
      </button>
    </div>

    <div class="chat-suggestions">
      <button 
        v-for="suggestion in suggestions" 
        :key="suggestion"
        @click="userInput = suggestion; sendMessage()"
        class="suggestion-btn"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, type Ref } from 'vue';
import type { AIClient } from '@aivue/core';
import type { TableSchema } from '../types/ai';

interface Props {
  aiClient: AIClient;
  schema: TableSchema;
  data: any[];
  theme?: 'light' | 'dark';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  data?: any;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light'
});

const emit = defineEmits<{
  close: [];
}>();

const messages = ref<ChatMessage[]>([]);
const userInput = ref('');
const loading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const suggestions = computed(() => {
  if (messages.value.length > 0) return [];
  
  return [
    'What is the average value?',
    'Show me the top 5 items',
    'What trends do you see?',
    'Summarize this data'
  ];
});

onMounted(() => {
  // Welcome message
  messages.value.push({
    role: 'assistant',
    content: `Hi! I can help you analyze this table with ${props.data.length} rows. What would you like to know?`
  });
});

async function sendMessage() {
  if (!userInput.value.trim() || loading.value) return;

  const query = userInput.value.trim();
  messages.value.push({
    role: 'user',
    content: query
  });

  userInput.value = '';
  loading.value = true;

  try {
    const systemPrompt = buildSystemPrompt();
    const response = await props.aiClient.chat([
      { role: 'system', content: systemPrompt },
      ...messages.value.slice(-5).map(m => ({ role: m.role, content: m.content }))
    ], {
      temperature: 0.7,
      maxTokens: 1000
    });

    messages.value.push({
      role: 'assistant',
      content: response.trim()
    });

    scrollToBottom();
  } catch (err: any) {
    messages.value.push({
      role: 'assistant',
      content: `Sorry, I encountered an error: ${err.message}`
    });
  } finally {
    loading.value = false;
  }
}

function buildSystemPrompt(): string {
  return `You are a helpful data analyst assistant. You are analyzing a table with the following structure:

Columns:
${props.schema.columns.map(c => `- ${c.key} (${c.type}): ${c.label}`).join('\n')}

Total rows: ${props.data.length}

Sample data (first 3 rows):
${JSON.stringify(props.data.slice(0, 3), null, 2)}

Answer questions about this data in a clear, concise way. When appropriate, provide specific numbers and insights.`;
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

watch(messages, () => {
  scrollToBottom();
});
</script>

<style scoped>
/* Chat styles will be added in the main CSS file */
</style>

