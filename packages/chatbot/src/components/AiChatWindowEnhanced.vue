<template>
  <div class="ai-chat-window-enhanced" :class="{ 'dark-theme': theme === 'dark' }">
    <!-- Enhanced Header with Features -->
    <div class="chat-header">
      <div class="header-left">
        <h3 class="chat-title">{{ title }}</h3>
        <div v-if="currentModel" class="model-indicator">
          <span class="model-badge">{{ currentModel }}</span>
        </div>
      </div>
      
      <div class="header-right">
        <!-- Voice Controls -->
        <button 
          v-if="voiceEnabled" 
          @click="toggleListening"
          :class="['voice-btn', { active: isListening }]"
          :title="isListening ? 'Stop Listening' : 'Start Voice Input'"
        >
          🎤
        </button>
        
        <!-- Model Selector -->
        <select 
          v-if="multiModelEnabled && availableModels.length > 1"
          v-model="selectedModel"
          @change="switchModel"
          class="model-selector"
        >
          <option v-for="model in availableModels" :key="model.name" :value="model.name">
            {{ model.name }} ({{ model.specialty || 'general' }})
          </option>
        </select>
        
        <!-- Settings Menu -->
        <button @click="showSettings = !showSettings" class="settings-btn" title="Settings">
          ⚙️
        </button>
      </div>
    </div>

    <!-- Settings Panel -->
    <div v-if="showSettings" class="settings-panel">
      <div class="setting-group">
        <label>
          <input type="checkbox" v-model="autoSave" @change="updateAutoSave"> 
          Auto-save conversations
        </label>
      </div>
      
      <div class="setting-group">
        <label>
          <input type="checkbox" v-model="voiceResponse" @change="updateVoiceResponse"> 
          Voice responses
        </label>
      </div>
      
      <div class="setting-group">
        <label>
          <input type="checkbox" v-model="analyticsEnabled" @change="updateAnalytics"> 
          Usage analytics
        </label>
      </div>
      
      <div class="setting-group">
        <button @click="exportChat" class="export-btn">Export Chat</button>
        <button @click="clearHistory" class="clear-btn">Clear History</button>
      </div>
    </div>

    <!-- Conversation List (if storage enabled) -->
    <div v-if="storageEnabled && showConversations" class="conversation-list">
      <div class="conversation-header">
        <h4>Conversations</h4>
        <button @click="showConversations = false" class="close-btn">×</button>
      </div>
      
      <div class="conversation-search">
        <input 
          v-model="searchQuery" 
          @input="searchConversations"
          placeholder="Search conversations..."
          class="search-input"
        >
      </div>
      
      <div class="conversation-items">
        <div 
          v-for="conversation in filteredConversations" 
          :key="conversation.id"
          @click="loadConversation(conversation.id)"
          :class="['conversation-item', { active: conversation.id === currentConversationId }]"
        >
          <div class="conversation-title">{{ conversation.title }}</div>
          <div class="conversation-meta">
            {{ formatDate(conversation.updatedAt) }} • {{ conversation.messageCount }} messages
          </div>
          <button 
            @click.stop="deleteConversation(conversation.id)"
            class="delete-conversation-btn"
            title="Delete conversation"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <h3>Start a conversation</h3>
        <p>{{ placeholder }}</p>
        
        <!-- Quick Actions -->
        <div v-if="quickActions.length > 0" class="quick-actions">
          <button 
            v-for="action in quickActions" 
            :key="action.name"
            @click="sendQuickAction(action)"
            class="quick-action-btn"
          >
            <span class="action-icon">{{ action.icon }}</span>
            {{ action.name }}
          </button>
        </div>
      </div>

      <div v-for="message in messages" :key="message.id" :class="['message', message.role]">
        <div v-if="showAvatars" class="message-avatar">
          <img 
            v-if="message.role === 'user' && userAvatar" 
            :src="userAvatar" 
            :alt="userName || 'User'"
            class="avatar-img"
          >
          <img 
            v-else-if="message.role === 'assistant' && assistantAvatar" 
            :src="assistantAvatar" 
            alt="Assistant"
            class="avatar-img"
          >
          <div v-else class="avatar-placeholder">
            {{ message.role === 'user' ? '👤' : '🤖' }}
          </div>
        </div>

        <div class="message-content">
          <div class="message-header" v-if="showTimestamps || message.modelUsed">
            <span v-if="showTimestamps" class="message-time">
              {{ formatTime(message.timestamp) }}
            </span>
            <span v-if="message.modelUsed" class="message-model">
              {{ message.modelUsed }}
            </span>
            <span v-if="message.processingTime" class="processing-time">
              {{ message.processingTime }}ms
            </span>
          </div>

          <div class="message-text" v-html="formatMessage(message.content)"></div>
          
          <!-- Message Actions -->
          <div class="message-actions">
            <button 
              v-if="showCopyButton" 
              @click="copyMessage(message.content)"
              class="action-btn copy-btn"
              title="Copy message"
            >
              📋
            </button>
            
            <button 
              v-if="voiceEnabled && message.role === 'assistant'" 
              @click="speakMessage(message.content)"
              class="action-btn speak-btn"
              title="Read aloud"
            >
              🔊
            </button>
            
            <button 
              v-if="message.role === 'assistant'"
              @click="addReaction(message, '👍')"
              class="action-btn reaction-btn"
              title="Good response"
            >
              👍
            </button>
            
            <button 
              v-if="message.role === 'assistant'"
              @click="addReaction(message, '👎')"
              class="action-btn reaction-btn"
              title="Poor response"
            >
              👎
            </button>
          </div>

          <!-- Reactions -->
          <div v-if="message.reactions && message.reactions.length > 0" class="message-reactions">
            <span 
              v-for="reaction in message.reactions" 
              :key="reaction.emoji + reaction.userId"
              class="reaction"
            >
              {{ reaction.emoji }}
            </span>
          </div>

          <!-- Attachments -->
          <div v-if="message.attachments && message.attachments.length > 0" class="message-attachments">
            <div 
              v-for="attachment in message.attachments" 
              :key="attachment.url"
              class="attachment"
            >
              <span class="attachment-icon">📎</span>
              <span class="attachment-name">{{ attachment.name }}</span>
              <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="loading-message">
        <div class="loading-avatar">🤖</div>
        <div class="loading-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="loading-text">{{ loadingText }}</div>
        </div>
      </div>
    </div>

    <!-- Enhanced Input Area -->
    <div class="chat-input-area">
      <!-- File Upload Area -->
      <div 
        v-if="fileUploadEnabled"
        @drop="handleFileDrop"
        @dragover.prevent
        @dragenter.prevent
        :class="['file-drop-zone', { 'drag-over': isDragOver }]"
      >
        <input 
          ref="fileInput"
          type="file"
          multiple
          @change="handleFileSelect"
          :accept="allowedFileTypes.join(',')"
          style="display: none"
        >
        
        <div v-if="selectedFiles.length === 0" class="drop-message">
          Drop files here or 
          <button @click="$refs.fileInput.click()" class="file-select-btn">browse</button>
        </div>
        
        <div v-else class="selected-files">
          <div 
            v-for="(file, index) in selectedFiles" 
            :key="index"
            class="selected-file"
          >
            <span class="file-name">{{ file.name }}</span>
            <button @click="removeFile(index)" class="remove-file-btn">×</button>
          </div>
        </div>
      </div>

      <!-- Input Controls -->
      <div class="input-controls">
        <div class="input-wrapper">
          <textarea
            ref="messageInput"
            v-model="currentMessage"
            @keydown="handleKeyDown"
            @input="handleInput"
            :placeholder="placeholder"
            :disabled="isLoading"
            class="message-input"
            rows="1"
          ></textarea>
          
          <!-- Voice Recording Indicator -->
          <div v-if="isListening" class="voice-recording">
            <div class="recording-indicator"></div>
            <span>Listening...</span>
          </div>
        </div>

        <div class="input-actions">
          <!-- File Upload Button -->
          <button 
            v-if="fileUploadEnabled"
            @click="$refs.fileInput.click()"
            class="action-btn file-btn"
            title="Attach files"
          >
            📎
          </button>
          
          <!-- Voice Input Button -->
          <button 
            v-if="voiceEnabled"
            @click="toggleListening"
            :class="['action-btn', 'voice-btn', { active: isListening }]"
            :title="isListening ? 'Stop listening' : 'Voice input'"
          >
            🎤
          </button>
          
          <!-- Send Button -->
          <button 
            @click="sendMessage"
            :disabled="!canSend"
            class="send-btn"
            title="Send message"
          >
            <span v-if="!isLoading">➤</span>
            <div v-else class="loading-spinner"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-message">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ error.message }}</span>
      <button @click="resetError" class="error-close">×</button>
    </div>

    <!-- Analytics Panel -->
    <div v-if="showAnalytics && analyticsData" class="analytics-panel">
      <div class="analytics-header">
        <h4>Usage Analytics</h4>
        <button @click="showAnalytics = false" class="close-btn">×</button>
      </div>
      
      <div class="analytics-content">
        <div class="metric">
          <span class="metric-label">Total Messages:</span>
          <span class="metric-value">{{ analyticsData.totalMessages }}</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">Avg Response Time:</span>
          <span class="metric-value">{{ analyticsData.averageResponseTime.toFixed(2) }}s</span>
        </div>
        
        <div class="metric">
          <span class="metric-label">Conversations:</span>
          <span class="metric-value">{{ analyticsData.totalConversations }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useChatEngine, type ChatOptions, type Message } from '../composables/useChatEngine';

// Props with enhanced options
interface Props {
  // Core props (backward compatible)
  provider?: string;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  title?: string;
  placeholder?: string;
  theme?: 'light' | 'dark';
  height?: string;
  width?: string;
  maxWidth?: string;

  // Enhanced props (optional)
  user?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };

  storage?: {
    provider?: 'localStorage' | 'supabase' | 'firebase';
    apiKey?: string;
    userId?: string;
    autoSave?: boolean;
  };

  voice?: {
    speechToText?: boolean;
    textToSpeech?: boolean;
    language?: string;
  };

  analytics?: {
    enabled?: boolean;
    trackUserSentiment?: boolean;
    trackUsageMetrics?: boolean;
  };

  multiModel?: {
    enabled?: boolean;
    models?: Array<{
      name: string;
      provider: string;
      apiKey?: string;
      specialty?: string;
    }>;
    autoSwitch?: boolean;
  };

  // UI props
  showAvatars?: boolean;
  showTimestamps?: boolean;
  showCopyButton?: boolean;
  userAvatar?: string;
  assistantAvatar?: string;
  userName?: string;

  // File upload props
  fileUploadEnabled?: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: string;

  // Quick actions
  quickActions?: Array<{
    name: string;
    icon: string;
    prompt: string;
  }>;

  // Demo mode
  demoMode?: boolean;
  demoResponses?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  provider: 'openai',
  title: 'AI Chat',
  placeholder: 'Type your message...',
  theme: 'light',
  height: '600px',
  width: '100%',
  maxWidth: '800px',
  showAvatars: true,
  showTimestamps: false,
  showCopyButton: true,
  fileUploadEnabled: true,
  allowedFileTypes: () => ['.pdf', '.txt', '.doc', '.docx', '.jpg', '.png', '.mp3', '.wav'],
  quickActions: () => [],
  demoMode: false,
  demoResponses: () => ({})
});

// Emits
const emit = defineEmits<{
  messageSent: [message: Message];
  responseReceived: [message: Message];
  error: [error: Error];
  conversationSaved: [conversationId: string];
  fileUploaded: [files: File[]];
}>();

// Reactive state
const currentMessage = ref('');
const selectedFiles = ref<File[]>([]);
const isDragOver = ref(false);
const isListening = ref(false);
const showSettings = ref(false);
const showConversations = ref(false);
const showAnalytics = ref(false);
const searchQuery = ref('');
const filteredConversations = ref<any[]>([]);
const analyticsData = ref<any>(null);
const currentConversationId = ref<string | null>(null);

// Settings
const autoSave = ref(props.storage?.autoSave ?? false);
const voiceResponse = ref(props.voice?.textToSpeech ?? false);
const analyticsEnabled = ref(props.analytics?.enabled ?? false);
const selectedModel = ref(props.model || 'gpt-3.5-turbo');

// Computed properties
const voiceEnabled = computed(() => props.voice?.speechToText || props.voice?.textToSpeech);
const storageEnabled = computed(() => !!props.storage);
const multiModelEnabled = computed(() => props.multiModel?.enabled);
const availableModels = computed(() => props.multiModel?.models || []);
const currentModel = computed(() => selectedModel.value);

const canSend = computed(() => {
  return (currentMessage.value.trim() || selectedFiles.value.length > 0) && !isLoading.value;
});

// Chat engine setup with enhanced options
const chatOptions: ChatOptions = {
  provider: props.provider as any,
  apiKey: props.apiKey,
  model: props.model,
  baseUrl: props.baseUrl,
  demoMode: props.demoMode,
  demoResponses: props.demoResponses,

  // Enhanced options (only included if provided)
  ...(props.user && { user: props.user }),
  ...(props.storage && { storage: props.storage }),
  ...(props.voice && { voice: props.voice }),
  ...(props.analytics && { analytics: props.analytics }),
  ...(props.multiModel && { multiModel: props.multiModel }),

  // Callbacks
  onMessageSent: (message: Message) => emit('messageSent', message),
  onResponseReceived: (message: Message) => {
    emit('responseReceived', message);

    // Auto-speak if voice response is enabled
    if (voiceResponse.value && chatEngine.speak) {
      chatEngine.speak(message.content).catch(console.error);
    }
  },
  onError: (error: Error) => emit('error', error),
  onConversationSaved: (id: string) => {
    currentConversationId.value = id;
    emit('conversationSaved', id);
  }
};

const chatEngine = useChatEngine(chatOptions);
const { messages, isLoading, error, sendMessage: sendChatMessage, resetError } = chatEngine;

// Refs
const messagesContainer = ref<HTMLElement>();
const messageInput = ref<HTMLTextAreaElement>();
const fileInput = ref<HTMLInputElement>();

// Methods
const sendMessage = async () => {
  if (!canSend.value) return;

  let messageContent = currentMessage.value.trim();

  // Handle file uploads
  if (selectedFiles.value.length > 0) {
    // In a real implementation, you would upload files and get URLs
    const fileDescriptions = selectedFiles.value.map(f => `[File: ${f.name}]`).join(' ');
    messageContent = `${messageContent} ${fileDescriptions}`.trim();

    emit('fileUploaded', [...selectedFiles.value]);
    selectedFiles.value = [];
  }

  if (messageContent) {
    await sendChatMessage(messageContent);
    currentMessage.value = '';

    // Auto-save conversation if enabled
    if (autoSave.value && chatEngine.saveConversation && !currentConversationId.value) {
      try {
        const title = messageContent.slice(0, 50) + (messageContent.length > 50 ? '...' : '');
        await chatEngine.saveConversation(title);
      } catch (error) {
        console.warn('Failed to auto-save conversation:', error);
      }
    }
  }

  await nextTick();
  scrollToBottom();
  focusInput();
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const handleInput = () => {
  // Auto-resize textarea
  if (messageInput.value) {
    messageInput.value.style.height = 'auto';
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px';
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const focusInput = () => {
  if (messageInput.value) {
    messageInput.value.focus();
  }
};

// File handling
const handleFileDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = Array.from(event.dataTransfer?.files || []);
  addFiles(files);
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  addFiles(files);
  target.value = ''; // Reset input
};

const addFiles = (files: File[]) => {
  const validFiles = files.filter(file => {
    // Check file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    return props.allowedFileTypes.includes(extension);
  });

  selectedFiles.value.push(...validFiles);
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

// Voice methods
const toggleListening = async () => {
  if (!chatEngine.startListening || !chatEngine.stopListening) return;

  if (isListening.value) {
    chatEngine.stopListening();
    isListening.value = false;
  } else {
    try {
      await chatEngine.startListening();
      isListening.value = true;
    } catch (error) {
      console.error('Failed to start listening:', error);
    }
  }
};

const speakMessage = async (text: string) => {
  if (chatEngine.speak) {
    try {
      await chatEngine.speak(text);
    } catch (error) {
      console.error('Failed to speak message:', error);
    }
  }
};

// Utility methods
const formatMessage = (content: string) => {
  // Basic markdown-like formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
};

const formatTime = (timestamp?: Date) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

const formatFileSize = (size?: number) => {
  if (!size) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
};

const copyMessage = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content);
  } catch (error) {
    console.error('Failed to copy message:', error);
  }
};

// Enhanced methods
const sendQuickAction = (action: any) => {
  currentMessage.value = action.prompt;
  sendMessage();
};

const addReaction = (message: Message, emoji: string) => {
  if (!message.reactions) {
    message.reactions = [];
  }

  const userId = props.user?.id || 'anonymous';
  const existingReaction = message.reactions.find(r => r.userId === userId && r.emoji === emoji);

  if (existingReaction) {
    // Remove reaction
    message.reactions = message.reactions.filter(r => r !== existingReaction);
  } else {
    // Add reaction
    message.reactions.push({
      emoji,
      userId,
      timestamp: new Date()
    });
  }
};

const switchModel = () => {
  if (chatEngine.switchModel) {
    chatEngine.switchModel(selectedModel.value);
  }
};

const updateAutoSave = () => {
  // Update auto-save setting
};

const updateVoiceResponse = () => {
  // Update voice response setting
};

const updateAnalytics = () => {
  // Update analytics setting
};

const exportChat = async () => {
  if (chatEngine.exportReport) {
    try {
      const blob = await chatEngine.exportReport('json');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export chat:', error);
    }
  }
};

const clearHistory = () => {
  chatEngine.clearMessages();
  currentConversationId.value = null;
};

const loadConversation = async (id: string) => {
  if (chatEngine.loadConversation) {
    try {
      await chatEngine.loadConversation(id);
      currentConversationId.value = id;
      showConversations.value = false;
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  }
};

const deleteConversation = async (id: string) => {
  if (chatEngine.deleteConversation) {
    try {
      await chatEngine.deleteConversation(id);
      // Refresh conversation list
      searchConversations();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  }
};

const searchConversations = async () => {
  if (chatEngine.searchConversations) {
    try {
      const results = await chatEngine.searchConversations(searchQuery.value);
      filteredConversations.value = results;
    } catch (error) {
      console.error('Failed to search conversations:', error);
    }
  }
};

const loadAnalytics = async () => {
  if (chatEngine.getUsageMetrics) {
    try {
      analyticsData.value = await chatEngine.getUsageMetrics();
      showAnalytics.value = true;
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }
};

// Lifecycle
onMounted(() => {
  focusInput();
  scrollToBottom();

  // Load conversations if storage is enabled
  if (storageEnabled.value) {
    searchConversations();
  }
});

// Watch for new messages to scroll
watch(messages, () => {
  nextTick(() => scrollToBottom());
}, { deep: true });

// Watch for loading state changes
watch(isLoading, (newValue) => {
  if (!newValue) {
    nextTick(() => {
      scrollToBottom();
      focusInput();
    });
  }
});
</script>

<style scoped>
.ai-chat-window-enhanced {
  display: flex;
  flex-direction: column;
  height: v-bind(height);
  width: v-bind(width);
  max-width: v-bind(maxWidth);
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.dark-theme {
  background: #1a1a1a;
  border-color: #333;
  color: #ffffff;
}

/* Header Styles */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.model-indicator .model-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.voice-btn, .settings-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.voice-btn:hover, .settings-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.voice-btn.active {
  background: #ff4757;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.model-selector {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 6px 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.model-selector option {
  background: #333;
  color: white;
}

/* Settings Panel */
.settings-panel {
  background: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
  padding: 16px 20px;
}

.dark-theme .settings-panel {
  background: #2a2a2a;
  border-color: #444;
}

.setting-group {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.export-btn, .clear-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.clear-btn {
  background: #dc3545;
}

.export-btn:hover {
  background: #0056b3;
}

.clear-btn:hover {
  background: #c82333;
}

/* Conversation List */
.conversation-list {
  background: #f8f9fa;
  border-bottom: 1px solid #e1e5e9;
  max-height: 300px;
  overflow-y: auto;
}

.dark-theme .conversation-list {
  background: #2a2a2a;
  border-color: #444;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #e1e5e9;
}

.dark-theme .conversation-header {
  border-color: #444;
}

.conversation-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.dark-theme .close-btn {
  color: #ccc;
}

.dark-theme .close-btn:hover {
  color: #fff;
}

.conversation-search {
  padding: 12px 20px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.dark-theme .search-input {
  background: #333;
  border-color: #555;
  color: white;
}

.conversation-items {
  max-height: 200px;
  overflow-y: auto;
}

.conversation-item {
  padding: 12px 20px;
  border-bottom: 1px solid #e1e5e9;
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
}

.conversation-item:hover {
  background: #e9ecef;
}

.conversation-item.active {
  background: #007bff;
  color: white;
}

.dark-theme .conversation-item {
  border-color: #444;
}

.dark-theme .conversation-item:hover {
  background: #333;
}

.conversation-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.conversation-meta {
  font-size: 12px;
  color: #666;
}

.conversation-item.active .conversation-meta {
  color: rgba(255, 255, 255, 0.8);
}

.delete-conversation-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.conversation-item:hover .delete-conversation-btn {
  opacity: 1;
}

/* Messages Area */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #ffffff;
}

.dark-theme .chat-messages {
  background: #1a1a1a;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #666;
}

.dark-theme .empty-state {
  color: #ccc;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
}

.empty-state p {
  margin: 0 0 24px 0;
  font-size: 16px;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.dark-theme .quick-action-btn {
  background: #2a2a2a;
  border-color: #444;
  color: white;
}

.dark-theme .quick-action-btn:hover {
  background: #333;
}

.action-icon {
  font-size: 16px;
}

/* Message Styles */
.message {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.message.user .message-avatar {
  order: 2;
  margin-right: 0;
  margin-left: 12px;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.dark-theme .avatar-placeholder {
  background: #444;
}

.message-content {
  max-width: 70%;
  position: relative;
}

.message.user .message-content {
  order: 1;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 12px;
  color: #666;
}

.dark-theme .message-header {
  color: #ccc;
}

.message-time {
  font-weight: 500;
}

.message-model {
  background: #e1e5e9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
}

.dark-theme .message-model {
  background: #444;
}

.processing-time {
  color: #28a745;
  font-weight: 500;
}

.message-text {
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.user .message-text {
  background: #007bff;
  color: white;
}

.dark-theme .message-text {
  background: #2a2a2a;
  color: white;
}

.dark-theme .message.user .message-text {
  background: #0056b3;
}

.message-actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message:hover .message-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s ease;
}

.action-btn:hover {
  background: #e1e5e9;
}

.dark-theme .action-btn:hover {
  background: #444;
}

.message-reactions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.reaction {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid #e1e5e9;
}

.dark-theme .reaction {
  background: #2a2a2a;
  border-color: #444;
}

.message-attachments {
  margin-top: 8px;
}

.attachment {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 4px;
  font-size: 14px;
}

.dark-theme .attachment {
  background: #2a2a2a;
}

.attachment-icon {
  font-size: 16px;
}

.attachment-name {
  font-weight: 500;
  flex: 1;
}

.attachment-size {
  color: #666;
  font-size: 12px;
}

.dark-theme .attachment-size {
  color: #ccc;
}

/* Loading Message */
.loading-message {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

.loading-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.dark-theme .loading-avatar {
  background: #444;
}

.loading-content {
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
}

.dark-theme .loading-content {
  background: #2a2a2a;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.loading-text {
  font-size: 14px;
  color: #666;
}

.dark-theme .loading-text {
  color: #ccc;
}

/* Input Area */
.chat-input-area {
  border-top: 1px solid #e1e5e9;
  background: #ffffff;
}

.dark-theme .chat-input-area {
  border-color: #444;
  background: #1a1a1a;
}

.file-drop-zone {
  padding: 12px 20px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.file-drop-zone.drag-over {
  background: #e3f2fd;
  border-color: #2196f3;
}

.dark-theme .file-drop-zone {
  background: #2a2a2a;
  border-color: #444;
}

.dark-theme .file-drop-zone.drag-over {
  background: #1e3a5f;
  border-color: #2196f3;
}

.drop-message {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.dark-theme .drop-message {
  color: #ccc;
}

.file-select-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.file-select-btn:hover {
  color: #0056b3;
}

.selected-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 14px;
}

.dark-theme .selected-file {
  background: #333;
  border-color: #555;
  color: white;
}

.file-name {
  font-weight: 500;
}

.remove-file-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  color: #c82333;
}

.input-controls {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 16px 20px;
}

.input-wrapper {
  flex: 1;
  position: relative;
}

.message-input {
  width: 100%;
  min-height: 44px;
  max-height: 120px;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 22px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: border-color 0.2s ease;
  background: #ffffff;
}

.message-input:focus {
  border-color: #007bff;
}

.message-input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.dark-theme .message-input {
  background: #2a2a2a;
  border-color: #444;
  color: white;
}

.dark-theme .message-input:focus {
  border-color: #0056b3;
}

.dark-theme .message-input:disabled {
  background: #333;
}

.voice-recording {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.recording-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: pulse 1s infinite;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-btn, .voice-btn {
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.file-btn:hover, .voice-btn:hover {
  background: #e9ecef;
  transform: scale(1.05);
}

.voice-btn.active {
  background: #ff4757;
  color: white;
  border-color: #ff4757;
}

.dark-theme .file-btn, .dark-theme .voice-btn {
  background: #2a2a2a;
  border-color: #444;
  color: white;
}

.dark-theme .file-btn:hover, .dark-theme .voice-btn:hover {
  background: #333;
}

.send-btn {
  background: #007bff;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  font-size: 18px;
}

.send-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8d7da;
  color: #721c24;
  padding: 12px 20px;
  border-top: 1px solid #f5c6cb;
}

.dark-theme .error-message {
  background: #2d1b1e;
  color: #f8d7da;
  border-color: #5a2a2d;
}

.error-icon {
  font-size: 16px;
}

.error-text {
  flex: 1;
  font-size: 14px;
}

.error-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Analytics Panel */
.analytics-panel {
  position: absolute;
  top: 60px;
  right: 20px;
  width: 300px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dark-theme .analytics-panel {
  background: #2a2a2a;
  border-color: #444;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e1e5e9;
}

.dark-theme .analytics-header {
  border-color: #444;
}

.analytics-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.analytics-content {
  padding: 16px 20px;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.metric-label {
  color: #666;
}

.dark-theme .metric-label {
  color: #ccc;
}

.metric-value {
  font-weight: 600;
  color: #007bff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ai-chat-window-enhanced {
    height: 100vh;
    border-radius: 0;
    max-width: none;
  }

  .chat-header {
    padding: 12px 16px;
  }

  .chat-title {
    font-size: 16px;
  }

  .header-right {
    gap: 4px;
  }

  .model-selector {
    display: none;
  }

  .chat-messages {
    padding: 16px;
  }

  .message-content {
    max-width: 85%;
  }

  .input-controls {
    padding: 12px 16px;
  }

  .quick-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .quick-action-btn {
    justify-content: center;
  }

  .analytics-panel {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: auto;
    border-radius: 0;
    z-index: 2000;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .ai-chat-window-enhanced {
    border-width: 2px;
  }

  .message-text {
    border: 1px solid currentColor;
  }

  .action-btn:focus {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}

/* Print styles */
@media print {
  .chat-header,
  .chat-input-area,
  .settings-panel,
  .conversation-list,
  .analytics-panel {
    display: none !important;
  }

  .ai-chat-window-enhanced {
    height: auto !important;
    border: none !important;
    box-shadow: none !important;
  }

  .chat-messages {
    padding: 0 !important;
  }

  .message-actions {
    display: none !important;
  }
}
</style>
