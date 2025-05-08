<template>
  <div class="ai-chat-toggle" :class="{ 'ai-chat-toggle--open': isOpen, 'ai-chat-toggle--bottom': position === 'bottom', 'ai-chat-toggle--top': position === 'top' }">
    <!-- Toggle Button -->
    <button 
      class="ai-chat-toggle__button" 
      @click="toggleChat"
      :aria-label="isOpen ? 'Close chat' : 'Open chat'"
      :title="isOpen ? 'Close chat' : 'Open chat'"
    >
      <span v-if="!isOpen" class="ai-chat-toggle__icon ai-chat-toggle__icon--open">
        <slot name="toggle-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </slot>
      </span>
      <span v-else class="ai-chat-toggle__icon ai-chat-toggle__icon--close">
        <slot name="close-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </slot>
      </span>
    </button>
    
    <!-- Chat Window Container -->
    <div v-show="isOpen" class="ai-chat-toggle__window">
      <div class="ai-chat-toggle__header" v-if="title">
        <h3 class="ai-chat-toggle__title">{{ title }}</h3>
        <button 
          class="ai-chat-toggle__close" 
          @click="toggleChat"
          aria-label="Close chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- Actual Chat Window Component -->
      <div class="ai-chat-toggle__content">
        <AiChatWindow
          v-if="useDefaultChat"
          v-bind="chatProps"
          @message-sent="$emit('message-sent', $event)"
          @response-received="$emit('response-received', $event)"
          @error="$emit('error', $event)"
        />
        <slot v-else></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType, watch } from 'vue';
import { AIClient, AIProvider } from '@aivue/core';
import AiChatWindow from './AiChatWindow.vue';
import { Message } from '../composables/useChatEngine';

export default defineComponent({
  name: 'AiChatToggle',
  components: {
    AiChatWindow
  },
  props: {
    // Toggle behavior
    position: {
      type: String as PropType<'bottom' | 'top'>,
      default: 'bottom',
      validator: (value: string) => ['bottom', 'top'].includes(value)
    },
    defaultOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Chat with AI'
    },
    
    // Provider configuration (either client or provider is required)
    client: {
      type: Object as PropType<AIClient>,
      default: null
    },
    provider: {
      type: String as PropType<AIProvider>,
      default: null
    },
    apiKey: {
      type: String,
      default: null
    },
    model: {
      type: String,
      default: null
    },
    
    // Pass all AiChatWindow props
    placeholder: {
      type: String,
      default: 'Type a message...'
    },
    initialMessages: {
      type: Array as PropType<Message[]>,
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
    theme: {
      type: String as PropType<'light' | 'dark'>,
      default: 'light'
    },
    showAvatars: {
      type: Boolean,
      default: true
    },
    persistenceKey: {
      type: String,
      default: null
    }
  },
  emits: ['toggle', 'message-sent', 'response-received', 'error'],
  setup(props, { emit, slots }) {
    const isOpen = ref(props.defaultOpen);
    
    // Check if we should use the default chat window or a custom one via slot
    const useDefaultChat = computed(() => !slots.default);
    
    // Prepare props to pass to AiChatWindow
    const chatProps = computed(() => {
      const result: Record<string, any> = {
        placeholder: props.placeholder,
        initialMessages: props.initialMessages,
        systemPrompt: props.systemPrompt,
        streaming: props.streaming,
        theme: props.theme,
        showAvatars: props.showAvatars,
        persistenceKey: props.persistenceKey
      };
      
      // Add provider configuration
      if (props.client) {
        result.client = props.client;
      } else if (props.provider) {
        result.provider = props.provider;
        if (props.apiKey) result.apiKey = props.apiKey;
        if (props.model) result.model = props.model;
      }
      
      return result;
    });
    
    // Toggle chat window
    const toggleChat = () => {
      isOpen.value = !isOpen.value;
      emit('toggle', isOpen.value);
    };
    
    // Watch for changes to defaultOpen prop
    watch(() => props.defaultOpen, (newValue) => {
      isOpen.value = newValue;
    });
    
    return {
      isOpen,
      toggleChat,
      useDefaultChat,
      chatProps
    };
  }
});
</script>

<style>
.ai-chat-toggle {
  position: fixed;
  z-index: 9999;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ai-chat-toggle--bottom {
  right: 20px;
  bottom: 20px;
}

.ai-chat-toggle--top {
  right: 20px;
  top: 20px;
}

.ai-chat-toggle__button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #2563eb;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.ai-chat-toggle__button:hover {
  transform: scale(1.05);
  background-color: #1d4ed8;
}

.ai-chat-toggle__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-chat-toggle__window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ai-chat-toggle--top .ai-chat-toggle__window {
  bottom: auto;
  top: 80px;
}

.ai-chat-toggle__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.ai-chat-toggle__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.ai-chat-toggle__close {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
}

.ai-chat-toggle__close:hover {
  background-color: #e2e8f0;
}

.ai-chat-toggle__content {
  flex: 1;
  overflow: hidden;
}

/* Dark theme */
.ai-chat-toggle[data-theme="dark"] .ai-chat-toggle__button {
  background-color: #3b82f6;
}

.ai-chat-toggle[data-theme="dark"] .ai-chat-toggle__button:hover {
  background-color: #2563eb;
}

.ai-chat-toggle[data-theme="dark"] .ai-chat-toggle__window {
  background-color: #1e293b;
}

.ai-chat-toggle[data-theme="dark"] .ai-chat-toggle__header {
  background-color: #0f172a;
  border-bottom-color: #334155;
}

.ai-chat-toggle[data-theme="dark"] .ai-chat-toggle__title {
  color: #f8fafc;
}

.ai-chat-toggle[data-theme="dark"] .ai-chat-toggle__close {
  color: #94a3b8;
}

.ai-chat-toggle[data-theme="dark"] .ai-chat-toggle__close:hover {
  background-color: #334155;
}
</style>
