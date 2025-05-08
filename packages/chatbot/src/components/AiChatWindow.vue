<template>
  <div class="ai-chat-window" :class="{ 'ai-chat-window--dark': theme === 'dark' }">
    <div class="ai-chat-window__header">
      <slot name="header">
        <h3 class="ai-chat-window__title">{{ title }}</h3>
      </slot>
    </div>
    
    <div class="ai-chat-window__messages" ref="messagesContainer">
      <template v-for="(message, index) in messages" :key="message.id || index">
        <slot 
          v-if="message.role === 'user'" 
          name="user-message" 
          :message="message" 
          :index="index"
        >
          <div class="ai-chat-window__message ai-chat-window__message--user">
            <div v-if="showAvatars" class="ai-chat-window__avatar ai-chat-window__avatar--user">
              <img v-if="userAvatar" :src="userAvatar" alt="User" />
              <div v-else class="ai-chat-window__avatar-placeholder">U</div>
            </div>
            <div class="ai-chat-window__message-content">
              <div class="ai-chat-window__message-text">{{ message.content }}</div>
              <div v-if="showTimestamps && message.timestamp" class="ai-chat-window__message-timestamp">
                {{ formatTimestamp(message.timestamp) }}
              </div>
            </div>
          </div>
        </slot>
        
        <slot 
          v-else-if="message.role === 'assistant'" 
          name="assistant-message" 
          :message="message" 
          :index="index"
        >
          <div class="ai-chat-window__message ai-chat-window__message--assistant">
            <div v-if="showAvatars" class="ai-chat-window__avatar ai-chat-window__avatar--assistant">
              <img v-if="assistantAvatar" :src="assistantAvatar" alt="Assistant" />
              <div v-else class="ai-chat-window__avatar-placeholder">A</div>
            </div>
            <div class="ai-chat-window__message-content">
              <div class="ai-chat-window__message-text" v-html="formatMessage(message.content)"></div>
              <div v-if="showTimestamps && message.timestamp" class="ai-chat-window__message-timestamp">
                {{ formatTimestamp(message.timestamp) }}
              </div>
              <button 
                v-if="showCopyButton" 
                class="ai-chat-window__copy-button"
                @click="copyToClipboard(message.content)"
              >
                Copy
              </button>
            </div>
          </div>
        </slot>
        
        <slot 
          v-else 
          name="message" 
          :message="message" 
          :index="index"
        >
          <div class="ai-chat-window__message">
            <div class="ai-chat-window__message-role">{{ message.role }}</div>
            <div class="ai-chat-window__message-content">
              <div class="ai-chat-window__message-text">{{ message.content }}</div>
            </div>
          </div>
        </slot>
      </template>
      
      <div v-if="isLoading" class="ai-chat-window__loading">
        <slot name="loading">
          <div class="ai-chat-window__loading-text">{{ loadingText }}</div>
        </slot>
      </div>
      
      <div v-if="error" class="ai-chat-window__error">
        <slot name="error" :error="error">
          <div class="ai-chat-window__error-text">{{ errorText }}</div>
        </slot>
      </div>
    </div>
    
    <div class="ai-chat-window__input-container">
      <slot name="input" :input="userInput" :send-message="handleSendMessage">
        <div class="ai-chat-window__input-wrapper">
          <textarea
            v-model="userInput"
            class="ai-chat-window__input"
            :placeholder="placeholder"
            :disabled="isLoading"
            @keydown.enter.prevent="handleKeyDown"
            ref="inputElement"
          ></textarea>
          <button 
            class="ai-chat-window__send-button" 
            @click="handleSendMessage"
            :disabled="isLoading || !userInput.trim()"
          >
            Send
          </button>
        </div>
      </slot>
    </div>
    
    <div class="ai-chat-window__footer">
      <slot name="footer">
        <button 
          v-if="messages.length > 0" 
          class="ai-chat-window__clear-button"
          @click="clearMessages"
        >
          Clear Chat
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useChatEngine } from '../composables/useChatEngine';
import { formatMarkdown } from '../utils/markdown';

export default {
  name: 'AiChatWindow',
  props: {
    client: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      default: 'Chat'
    },
    placeholder: {
      type: String,
      default: 'Type a message...'
    },
    initialMessages: {
      type: Array,
      default: () => []
    },
    systemPrompt: {
      type: String,
      default: 'You are a helpful assistant.'
    },
    streaming: {
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: 'Thinking...'
    },
    errorText: {
      type: String,
      default: 'An error occurred. Please try again.'
    },
    showTimestamps: {
      type: Boolean,
      default: false
    },
    showCopyButton: {
      type: Boolean,
      default: true
    },
    showAvatars: {
      type: Boolean,
      default: true
    },
    userAvatar: {
      type: String,
      default: null
    },
    assistantAvatar: {
      type: String,
      default: null
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark'].includes(value)
    },
    height: {
      type: String,
      default: '500px'
    },
    width: {
      type: String,
      default: '100%'
    },
    maxWidth: {
      type: String,
      default: '800px'
    },
    persistenceKey: {
      type: String,
      default: null
    }
  },
  setup(props, { emit }) {
    const userInput = ref('');
    const messagesContainer = ref(null);
    const inputElement = ref(null);
    
    const chatOptions = computed(() => ({
      client: props.client,
      systemPrompt: props.systemPrompt,
      initialMessages: props.initialMessages,
      streaming: props.streaming,
      persistenceKey: props.persistenceKey
    }));
    
    const { 
      messages, 
      isLoading, 
      error, 
      sendMessage, 
      clearMessages 
    } = useChatEngine(chatOptions.value);
    
    const handleSendMessage = async () => {
      if (!userInput.value.trim() || isLoading.value) return;
      
      const message = userInput.value;
      userInput.value = '';
      
      emit('message-sent', { message });
      
      try {
        await sendMessage(message);
        emit('response-received', { message: messages.value[messages.value.length - 1] });
      } catch (err) {
        emit('error', { error: err });
      }
    };
    
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    };
    
    const formatMessage = (content) => {
      return formatMarkdown(content);
    };
    
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    };
    
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          // Could show a toast notification here
          console.log('Copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    };
    
    // Auto-scroll to bottom when new messages arrive
    watch(messages, () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
      });
    }, { deep: true });
    
    // Focus input on mount
    onMounted(() => {
      if (inputElement.value) {
        inputElement.value.focus();
      }
    });
    
    return {
      userInput,
      messages,
      isLoading,
      error,
      messagesContainer,
      inputElement,
      handleSendMessage,
      handleKeyDown,
      clearMessages,
      formatMessage,
      formatTimestamp,
      copyToClipboard
    };
  }
};
</script>

<style>
.ai-chat-window {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--aivue-chat-border, #e0e0e0);
  border-radius: var(--aivue-chat-border-radius, 8px);
  background-color: var(--aivue-chat-bg, #ffffff);
  color: var(--aivue-chat-text, #333333);
  font-family: var(--aivue-chat-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  height: 500px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
}

.ai-chat-window--dark {
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

.ai-chat-window__header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--aivue-chat-border, #e0e0e0);
}

.ai-chat-window__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.ai-chat-window__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.ai-chat-window__message {
  display: flex;
  margin-bottom: 16px;
}

.ai-chat-window__message--user {
  justify-content: flex-end;
}

.ai-chat-window__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
}

.ai-chat-window__message--user .ai-chat-window__avatar {
  margin-right: 0;
  margin-left: 8px;
  order: 2;
}

.ai-chat-window__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-chat-window__avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  color: #666666;
  font-weight: bold;
}

.ai-chat-window__message-content {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  position: relative;
}

.ai-chat-window__message--user .ai-chat-window__message-content {
  background-color: var(--aivue-chat-user-bg, #e1f5fe);
}

.ai-chat-window__message--assistant .ai-chat-window__message-content {
  background-color: var(--aivue-chat-assistant-bg, #f5f5f5);
}

.ai-chat-window__message-text {
  word-break: break-word;
}

.ai-chat-window__message-timestamp {
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.ai-chat-window__copy-button {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: transparent;
  border: none;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.ai-chat-window__message-content:hover .ai-chat-window__copy-button {
  opacity: 1;
}

.ai-chat-window__loading {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.ai-chat-window__loading-text {
  color: var(--aivue-chat-loading, #9e9e9e);
  font-style: italic;
}

.ai-chat-window__error {
  color: var(--aivue-chat-error, #f44336);
  margin: 16px 0;
  text-align: center;
}

.ai-chat-window__input-container {
  padding: 12px 16px;
  border-top: 1px solid var(--aivue-chat-border, #e0e0e0);
}

.ai-chat-window__input-wrapper {
  display: flex;
  position: relative;
}

.ai-chat-window__input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--aivue-chat-input-border, #e0e0e0);
  border-radius: 20px;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  background-color: var(--aivue-chat-input-bg, #ffffff);
  color: var(--aivue-chat-text, #333333);
  font-family: inherit;
  font-size: 14px;
}

.ai-chat-window__input:focus {
  outline: none;
  border-color: var(--aivue-chat-button-bg, #2196f3);
}

.ai-chat-window__send-button {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background-color: var(--aivue-chat-button-bg, #2196f3);
  color: var(--aivue-chat-button-text, #ffffff);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ai-chat-window__send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-chat-window__footer {
  padding: 8px 16px;
  display: flex;
  justify-content: center;
}

.ai-chat-window__clear-button {
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
}
</style>
