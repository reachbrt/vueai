<template>
  <div class="ai-chat-rag" :class="{ 'ai-chat-rag--dark': theme === 'dark' }">
    <!-- Knowledge Base Section -->
    <div v-if="showKnowledgeBase" class="ai-chat-rag__knowledge-base">
      <div class="ai-chat-rag__kb-header">
        <h3 class="ai-chat-rag__kb-title">
          📚 Knowledge Base
          <span class="ai-chat-rag__kb-count">({{ totalDocuments }} docs, {{ totalChunks }} chunks)</span>
        </h3>
        <button 
          v-if="knowledgeBase.length > 0"
          @click="clearKnowledgeBase" 
          class="ai-chat-rag__kb-clear"
          title="Clear all documents"
        >
          Clear All
        </button>
      </div>

      <!-- Upload Controls -->
      <div class="ai-chat-rag__kb-upload">
        <div class="ai-chat-rag__kb-upload-row">
          <input
            ref="fileInput"
            type="file"
            @change="handleFileUpload"
            accept=".txt,.md,.doc,.docx"
            multiple
            style="display: none"
          />
          <button 
            @click="$refs.fileInput?.click()" 
            class="ai-chat-rag__kb-button"
            :disabled="isProcessing"
          >
            📄 Upload Files
          </button>
          
          <div class="ai-chat-rag__kb-url-input">
            <input
              v-model="urlInput"
              type="url"
              placeholder="Add URL..."
              @keyup.enter="handleAddUrl"
              class="ai-chat-rag__kb-input"
              :disabled="isProcessing"
            />
            <button 
              @click="handleAddUrl" 
              class="ai-chat-rag__kb-button"
              :disabled="isProcessing || !urlInput.trim()"
            >
              🔗 Add URL
            </button>
          </div>
        </div>

        <div v-if="isProcessing" class="ai-chat-rag__kb-processing">
          Processing document...
        </div>

        <div v-if="error" class="ai-chat-rag__kb-error">
          {{ error.message }}
        </div>
      </div>

      <!-- Document List -->
      <div v-if="knowledgeBase.length > 0" class="ai-chat-rag__kb-documents">
        <div 
          v-for="doc in knowledgeBase" 
          :key="doc.id"
          class="ai-chat-rag__kb-document"
        >
          <div class="ai-chat-rag__kb-doc-icon">
            {{ doc.type === 'url' ? '🔗' : '📄' }}
          </div>
          <div class="ai-chat-rag__kb-doc-info">
            <div class="ai-chat-rag__kb-doc-name">{{ doc.name }}</div>
            <div class="ai-chat-rag__kb-doc-meta">
              {{ doc.chunks.length }} chunks • {{ formatDate(doc.createdAt) }}
            </div>
          </div>
          <button 
            @click="removeDocument(doc.id)" 
            class="ai-chat-rag__kb-doc-remove"
            title="Remove document"
          >
            ✕
          </button>
        </div>
      </div>

      <div v-else class="ai-chat-rag__kb-empty">
        No documents in knowledge base. Upload files or add URLs to get started.
      </div>
    </div>

    <!-- Chat Window -->
    <div class="ai-chat-rag__chat">
      <AiChatWindow
        v-bind="chatProps"
        :system-prompt="enhancedSystemPrompt"
        @message-sent="handleMessageSent"
        @response-received="handleResponseReceived"
        @error="handleError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue';
import { AIClient, AIProvider } from '@aivue/core';
import AiChatWindow from './AiChatWindow.vue';
import { useRAG } from '../composables/useRAG';
import { Message } from '../composables/useChatEngine';

// Define props
const props = defineProps({
  // Provider configuration
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
  baseUrl: {
    type: String,
    default: null
  },
  organizationId: {
    type: String,
    default: null
  },

  // RAG configuration
  ragConfig: {
    type: Object as PropType<{
      chunkSize?: number;
      overlap?: number;
      topK?: number;
      storageKey?: string;
      contextTemplate?: string;
    }>,
    default: () => ({})
  },

  // UI configuration
  showKnowledgeBase: {
    type: Boolean,
    default: true
  },
  theme: {
    type: String as PropType<'light' | 'dark'>,
    default: 'light'
  },

  // Chat configuration (pass through to AiChatWindow)
  title: {
    type: String,
    default: 'AI Chat with RAG'
  },
  placeholder: {
    type: String,
    default: 'Ask a question about your documents...'
  },
  systemPrompt: {
    type: String,
    default: 'You are a helpful assistant with access to a knowledge base. Use the provided context to answer questions accurately.'
  },
  streaming: {
    type: Boolean,
    default: true
  },
  height: {
    type: String,
    default: '600px'
  },
  width: {
    type: String,
    default: '100%'
  },
  persistenceKey: {
    type: String,
    default: null
  }
});

// Define emits
const emit = defineEmits(['message-sent', 'response-received', 'error', 'document-added', 'document-removed']);

// Local state
const urlInput = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

// Initialize RAG composable
const {
  knowledgeBase,
  isProcessing,
  error,
  addDocument,
  addUrl,
  removeDocument,
  clearKnowledgeBase,
  retrieveContext,
  totalDocuments,
  totalChunks
} = useRAG({
  chunkSize: props.ragConfig.chunkSize || 500,
  overlap: props.ragConfig.overlap || 50,
  topK: props.ragConfig.topK || 3,
  storageKey: props.ragConfig.storageKey || 'aivue-rag-kb',
  autoSave: true
});

// Enhanced system prompt with knowledge base info
const enhancedSystemPrompt = computed(() => {
  if (knowledgeBase.value.length === 0) {
    return props.systemPrompt;
  }

  const docList = knowledgeBase.value.map(d => d.name).join(', ');
  return `${props.systemPrompt}\n\nYou have access to the following documents: ${docList}`;
});

// Chat props to pass to AiChatWindow
const chatProps = computed(() => {
  const baseProps: any = {
    client: props.client,
    provider: props.provider,
    apiKey: props.apiKey,
    model: props.model,
    baseUrl: props.baseUrl,
    organizationId: props.organizationId,
    title: props.title,
    placeholder: props.placeholder,
    streaming: props.streaming,
    height: props.height,
    width: props.width,
    persistenceKey: props.persistenceKey,
    theme: props.theme
  };

  // Add RAG configuration if knowledge base has documents
  if (knowledgeBase.value.length > 0) {
    baseProps.rag = {
      enabled: true,
      knowledgeBase: knowledgeBase.value,
      topK: props.ragConfig.topK || 3,
      retrieveContext: (query: string) => retrieveContext(query),
      contextTemplate: props.ragConfig.contextTemplate
    };
  }

  return baseProps;
});

// Handle file upload
async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) return;

  for (const file of Array.from(files)) {
    try {
      const doc = await addDocument(file);
      emit('document-added', { document: doc });
    } catch (err) {
      console.error('Failed to add document:', err);
    }
  }

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

// Handle URL addition
async function handleAddUrl() {
  if (!urlInput.value.trim()) return;

  try {
    const doc = await addUrl(urlInput.value);
    emit('document-added', { document: doc });
    urlInput.value = '';
  } catch (err) {
    console.error('Failed to add URL:', err);
  }
}

// Handle message sent
function handleMessageSent(event: { message: Message }) {
  emit('message-sent', event);
}

// Handle response received
function handleResponseReceived(event: { message: Message }) {
  emit('response-received', event);
}

// Handle error
function handleError(event: { error: Error }) {
  emit('error', event);
}

// Format date
function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}
</script>

<style scoped>
.ai-chat-rag {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Knowledge Base Section */
.ai-chat-rag__knowledge-base {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}

.ai-chat-rag--dark .ai-chat-rag__knowledge-base {
  background: #2d2d2d;
  border-color: #404040;
}

.ai-chat-rag__kb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ai-chat-rag__kb-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.ai-chat-rag--dark .ai-chat-rag__kb-title {
  color: #e0e0e0;
}

.ai-chat-rag__kb-count {
  font-size: 0.85rem;
  font-weight: 400;
  color: #666;
  margin-left: 0.5rem;
}

.ai-chat-rag--dark .ai-chat-rag__kb-count {
  color: #999;
}

.ai-chat-rag__kb-clear {
  padding: 0.4rem 0.8rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.ai-chat-rag__kb-clear:hover {
  background: #c82333;
}

/* Upload Controls */
.ai-chat-rag__kb-upload {
  margin-bottom: 1rem;
}

.ai-chat-rag__kb-upload-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ai-chat-rag__kb-url-input {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  min-width: 250px;
}

.ai-chat-rag__kb-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.ai-chat-rag--dark .ai-chat-rag__kb-input {
  background: #3d3d3d;
  border-color: #555;
  color: #e0e0e0;
}

.ai-chat-rag__kb-button {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background 0.2s;
}

.ai-chat-rag__kb-button:hover:not(:disabled) {
  background: #0056b3;
}

.ai-chat-rag__kb-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-chat-rag__kb-processing {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  color: #856404;
  font-size: 0.85rem;
}

.ai-chat-rag__kb-error {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #721c24;
  font-size: 0.85rem;
}

/* Document List */
.ai-chat-rag__kb-documents {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.ai-chat-rag__kb-document {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s;
}

.ai-chat-rag--dark .ai-chat-rag__kb-document {
  background: #3d3d3d;
  border-color: #555;
}

.ai-chat-rag__kb-document:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ai-chat-rag__kb-doc-icon {
  font-size: 1.5rem;
}

.ai-chat-rag__kb-doc-info {
  flex: 1;
  min-width: 0;
}

.ai-chat-rag__kb-doc-name {
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-chat-rag--dark .ai-chat-rag__kb-doc-name {
  color: #e0e0e0;
}

.ai-chat-rag__kb-doc-meta {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.ai-chat-rag--dark .ai-chat-rag__kb-doc-meta {
  color: #999;
}

.ai-chat-rag__kb-doc-remove {
  padding: 0.25rem 0.5rem;
  background: transparent;
  color: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.ai-chat-rag__kb-doc-remove:hover {
  background: #dc3545;
  color: white;
}

.ai-chat-rag__kb-empty {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.ai-chat-rag--dark .ai-chat-rag__kb-empty {
  color: #999;
}

/* Chat Section */
.ai-chat-rag__chat {
  flex: 1;
}
</style>


