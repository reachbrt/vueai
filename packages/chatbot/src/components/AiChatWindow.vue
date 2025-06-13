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
                {{ texts.copyButton }}
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
          <div class="ai-chat-window__loading-text">{{ texts.typing || loadingText }}</div>
        </slot>
      </div>

      <div v-if="error" class="ai-chat-window__error">
        <slot name="error" :error="error">
          <div class="ai-chat-window__error-text">{{ texts.error || errorText }}</div>
        </slot>
      </div>

      <!-- Processing attachments indicator -->
      <div v-if="isProcessingAttachments" class="ai-chat-window__processing">
        <div class="ai-chat-window__processing-text">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="ai-chat-window__loading-spinner">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.3"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none"/>
          </svg>
          Processing attachments...
        </div>
      </div>
    </div>

    <div class="ai-chat-window__input-container">
      <slot name="input" :input="userInput" :send-message="handleSendMessage">
        <div class="ai-chat-window__input-wrapper">
          <!-- Attachment button -->
          <button
            class="ai-chat-window__attachment-button"
            @click="handleAttachmentClick"
            :disabled="isLoading"
            :title="texts.attachButton"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
            </svg>
          </button>

          <!-- Voice button -->
          <button
            class="ai-chat-window__voice-button"
            @click="handleVoiceClick"
            :disabled="isLoading"
            :class="{ 'ai-chat-window__voice-button--recording': isRecording }"
            :title="isRecording ? texts.listeningText : texts.voiceButton"
          >
            <svg v-if="!isRecording" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h12v12H6z"/>
            </svg>
          </button>

          <textarea
            v-model="userInput"
            class="ai-chat-window__input"
            :placeholder="texts.placeholder || placeholder"
            :disabled="isLoading"
            @keydown.enter.prevent="handleKeyDown"
            ref="inputElement"
          ></textarea>

          <!-- Send button with improved design -->
          <button
            class="ai-chat-window__send-button"
            @click="handleSendMessage"
            :disabled="isLoading || isProcessingAttachments || (!userInput.trim() && attachments.length === 0)"
            :title="texts.sendButton"
          >
            <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="ai-chat-window__loading-spinner">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none"/>
            </svg>
          </button>
        </div>

        <!-- File input (hidden) -->
        <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          accept="image/*,.pdf,.doc,.docx,.txt"
          style="display: none"
          multiple
        />

        <!-- Attachment preview -->
        <div v-if="attachments.length > 0" class="ai-chat-window__attachments">
          <div
            v-for="(attachment, index) in attachments"
            :key="index"
            class="ai-chat-window__attachment-item"
          >
            <div class="ai-chat-window__attachment-preview">
              <!-- Image preview -->
              <div v-if="attachment.type.startsWith('image/')" class="ai-chat-window__image-preview">
                <img :src="getFilePreviewUrl(attachment)" alt="Image preview" />
                <div class="ai-chat-window__attachment-overlay">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19M19,19H5V5H19V19M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z"/>
                  </svg>
                </div>
              </div>

              <!-- Audio preview -->
              <div v-else-if="attachment.type.startsWith('audio/')" class="ai-chat-window__audio-preview">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,3V12.26C11.5,12.09 11,12 10.5,12C8.01,12 6,14.01 6,16.5C6,18.99 8.01,21 10.5,21C12.99,21 15,18.99 15,16.5V7H19V3H12Z"/>
                </svg>
                <span class="ai-chat-window__audio-duration">🎤 Voice Message</span>
              </div>

              <!-- File preview -->
              <div v-else class="ai-chat-window__file-preview">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
            </div>

            <div class="ai-chat-window__attachment-info">
              <span class="ai-chat-window__attachment-name">{{ attachment.name }}</span>
              <span class="ai-chat-window__attachment-size">({{ formatFileSize(attachment.size) }})</span>
              <span v-if="attachment.type.startsWith('image/')" class="ai-chat-window__attachment-type">📸 Will be analyzed</span>
              <span v-else-if="attachment.type.startsWith('audio/')" class="ai-chat-window__attachment-type">🎤 Will be transcribed</span>
            </div>

            <button
              class="ai-chat-window__attachment-remove"
              @click="removeAttachment(index)"
              title="Remove attachment"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </button>
          </div>
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
          {{ texts.clearButton }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, PropType } from 'vue';
import { AIClient, AIProvider } from '@aivue/core';
import { useChatEngine, Message } from '../composables/useChatEngine';
import { formatMarkdown } from '../utils/markdown';

// Define props with TypeScript
const props = defineProps({
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
  baseUrl: {
    type: String,
    default: null
  },
  organizationId: {
    type: String,
    default: null
  },

  // API security options
  useProxy: {
    type: Boolean,
    default: false
  },
  proxyUrl: {
    type: String,
    default: '/api/chat'
  },

  // Language/Internationalization options
  language: {
    type: String,
    default: 'en'
  },
  texts: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({})
  },

  // Demo mode
  demoMode: {
    type: Boolean,
    default: false
  },
  demoResponses: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({
      'hello': 'Hello! I\'m a demo AI assistant. How can I help you today?',
      'help': 'I can help you with various tasks. Just ask me a question!',
      'features': 'This chatbot component supports markdown, code highlighting, streaming responses, and more!'
    })
  },

  // Chat configuration
  title: {
    type: String,
    default: 'Chat'
  },
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
  loadingText: {
    type: String,
    default: 'Thinking...'
  },
  errorText: {
    type: String,
    default: 'An error occurred. Please try again.'
  },

  // UI configuration
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
    type: String as PropType<'light' | 'dark'>,
    default: 'light',
    validator: (value: string) => ['light', 'dark'].includes(value)
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
});

// Define emits
const emit = defineEmits(['message-sent', 'response-received', 'error', 'attachments-sent']);

// Local state
const userInput = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const inputElement = ref<HTMLTextAreaElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Attachment and voice state
const attachments = ref<File[]>([]);
const isRecording = ref(false);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const isProcessingAttachments = ref(false);

// Validate that either client or provider is provided
if (!props.client && !props.provider) {
  console.error('Either client or provider must be specified in AiChatWindow props');
}

// Default language texts
const defaultTexts = {
  title: 'Chat',
  placeholder: 'Type a message...',
  sendButton: 'Send',
  copyButton: 'Copy',
  retryButton: 'Retry',
  clearButton: 'Clear',
  attachButton: 'Attach file',
  voiceButton: 'Voice input',
  typing: 'Thinking...',
  error: 'An error occurred. Please try again.',
  noMessages: 'No messages yet',
  dragDropText: 'Drop files here or browse',
  fileUploadError: 'File upload failed',
  fileSizeError: 'File size too large',
  fileTypeError: 'File type not supported',
  listeningText: 'Listening...',
  speakingText: 'Speaking...',
  voiceError: 'Voice feature unavailable'
};

// Language texts with built-in translations
const languageTexts = {
  en: {
    title: 'Chat',
    placeholder: 'Type a message...',
    sendButton: 'Send',
    copyButton: 'Copy',
    retryButton: 'Retry',
    clearButton: 'Clear',
    attachButton: 'Attach file',
    voiceButton: 'Voice input',
    typing: 'Thinking...',
    error: 'An error occurred. Please try again.',
    noMessages: 'No messages yet',
    dragDropText: 'Drop files here or browse',
    fileUploadError: 'File upload failed',
    fileSizeError: 'File size too large',
    fileTypeError: 'File type not supported',
    listeningText: 'Listening...',
    speakingText: 'Speaking...',
    voiceError: 'Voice feature unavailable'
  },
  es: {
    title: 'Chat',
    placeholder: 'Escribe un mensaje...',
    sendButton: 'Enviar',
    copyButton: 'Copiar',
    retryButton: 'Reintentar',
    clearButton: 'Limpiar',
    attachButton: 'Adjuntar archivo',
    voiceButton: 'Entrada de voz',
    typing: 'Pensando...',
    error: 'Ocurrió un error. Inténtalo de nuevo.',
    noMessages: 'No hay mensajes aún',
    dragDropText: 'Arrastra archivos aquí o navega',
    fileUploadError: 'Error al subir archivo',
    fileSizeError: 'Archivo demasiado grande',
    fileTypeError: 'Tipo de archivo no soportado',
    listeningText: 'Escuchando...',
    speakingText: 'Hablando...',
    voiceError: 'Función de voz no disponible'
  },
  fr: {
    title: 'Chat',
    placeholder: 'Tapez un message...',
    sendButton: 'Envoyer',
    copyButton: 'Copier',
    retryButton: 'Réessayer',
    clearButton: 'Effacer',
    attachButton: 'Joindre un fichier',
    voiceButton: 'Entrée vocale',
    typing: 'Réflexion...',
    error: 'Une erreur s\'est produite. Veuillez réessayer.',
    noMessages: 'Pas encore de messages',
    dragDropText: 'Déposez les fichiers ici ou parcourez',
    fileUploadError: 'Échec du téléchargement',
    fileSizeError: 'Fichier trop volumineux',
    fileTypeError: 'Type de fichier non pris en charge',
    listeningText: 'Écoute...',
    speakingText: 'Parle...',
    voiceError: 'Fonction vocale indisponible'
  },
  de: {
    title: 'Chat',
    placeholder: 'Nachricht eingeben...',
    sendButton: 'Senden',
    copyButton: 'Kopieren',
    retryButton: 'Wiederholen',
    clearButton: 'Löschen',
    attachButton: 'Datei anhängen',
    voiceButton: 'Spracheingabe',
    typing: 'Denkt nach...',
    error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    noMessages: 'Noch keine Nachrichten',
    dragDropText: 'Dateien hier ablegen oder durchsuchen',
    fileUploadError: 'Datei-Upload fehlgeschlagen',
    fileSizeError: 'Datei zu groß',
    fileTypeError: 'Dateityp nicht unterstützt',
    listeningText: 'Hört zu...',
    speakingText: 'Spricht...',
    voiceError: 'Sprachfunktion nicht verfügbar'
  },
  it: {
    title: 'Chat',
    placeholder: 'Digita un messaggio...',
    sendButton: 'Invia',
    copyButton: 'Copia',
    retryButton: 'Riprova',
    clearButton: 'Cancella',
    attachButton: 'Allega file',
    voiceButton: 'Input vocale',
    typing: 'Pensando...',
    error: 'Si è verificato un errore. Riprova.',
    noMessages: 'Nessun messaggio ancora',
    dragDropText: 'Trascina i file qui o sfoglia',
    fileUploadError: 'Caricamento file fallito',
    fileSizeError: 'File troppo grande',
    fileTypeError: 'Tipo di file non supportato',
    listeningText: 'In ascolto...',
    speakingText: 'Parlando...',
    voiceError: 'Funzione vocale non disponibile'
  }
};

// Computed texts with fallbacks
const texts = computed(() => {
  const baseTexts = languageTexts[props.language as keyof typeof languageTexts] || languageTexts.en;
  return {
    ...baseTexts,
    ...props.texts
  };
});

// Configure chat options
const chatOptions = computed(() => ({
  // Provider configuration
  client: props.client,
  provider: props.provider as AIProvider,
  apiKey: props.apiKey,
  model: props.model,
  baseUrl: props.baseUrl,
  organizationId: props.organizationId,

  // API security
  useProxy: props.useProxy,
  proxyUrl: props.proxyUrl,

  // Chat behavior
  systemPrompt: props.systemPrompt,
  initialMessages: props.initialMessages,
  streaming: props.streaming,
  persistenceKey: props.persistenceKey,
  demoMode: props.demoMode,
  demoResponses: props.demoResponses,

  // Callbacks
  onError: (error: Error) => {
    emit('error', { error });
  },
  onMessageSent: (message: Message) => {
    emit('message-sent', { message });
  },
  onResponseReceived: (message: Message) => {
    emit('response-received', { message });
  }
}));

// Initialize chat engine
const {
  messages,
  isLoading,
  error,
  sendMessage,
  clearMessages
} = useChatEngine(chatOptions.value);

// Handle sending messages
const handleSendMessage = async () => {
  if ((!userInput.value.trim() && attachments.value.length === 0) || isLoading.value) return;

  const message = userInput.value;
  const messageAttachments = [...attachments.value];

  // Clear input and attachments
  userInput.value = '';
  attachments.value = [];

  try {
    // If there are attachments, process them and create enhanced message
    if (messageAttachments.length > 0) {
      isProcessingAttachments.value = true;
      const processedMessage = await processAttachmentsAndMessage(message, messageAttachments);
      isProcessingAttachments.value = false;
      await sendMessage(processedMessage);

      // Emit attachment event for custom handling
      emit('attachments-sent', { attachments: messageAttachments, message });
    } else {
      await sendMessage(message);
    }
  } catch (err) {
    isProcessingAttachments.value = false;
    // Error is already handled by the onError callback
  }
};

// Process attachments and create enhanced message
const processAttachmentsAndMessage = async (textMessage: string, files: File[]): Promise<string> => {
  let enhancedMessage = textMessage;

  for (const file of files) {
    if (file.type.startsWith('image/')) {
      // Process image
      const imageAnalysis = await analyzeImage(file);
      enhancedMessage += `\n\n📸 Image Analysis:\n${imageAnalysis}`;
    } else if (file.type.startsWith('audio/')) {
      // Process audio
      const audioTranscription = await transcribeAudio(file);
      enhancedMessage += `\n\n🎤 Audio Transcription:\n${audioTranscription}`;
    } else {
      // For other file types, just mention the file
      enhancedMessage += `\n\n📎 File attached: ${file.name} (${formatFileSize(file.size)})`;
    }
  }

  return enhancedMessage;
};

// Analyze image using OpenAI Vision API
const analyzeImage = async (imageFile: File): Promise<string> => {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);

    // Get API key from props or environment
    const apiKey = props.apiKey || (typeof window !== 'undefined' && (window as any).VITE_OPENAI_API_KEY);

    if (!apiKey) {
      return `Image "${imageFile.name}" uploaded but no API key available for analysis.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this image and describe what you see in detail.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image,
                  detail: 'auto'
                }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to analyze image.';
  } catch (error: any) {
    console.error('Image analysis error:', error);
    return `Image "${imageFile.name}" uploaded but analysis failed: ${error?.message || 'Unknown error'}`;
  }
};

// Transcribe audio using OpenAI Whisper API
const transcribeAudio = async (audioFile: File): Promise<string> => {
  try {
    // Get API key from props or environment
    const apiKey = props.apiKey || (typeof window !== 'undefined' && (window as any).VITE_OPENAI_API_KEY);

    if (!apiKey) {
      return `Audio "${audioFile.name}" uploaded but no API key available for transcription.`;
    }

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`OpenAI Whisper API error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || 'Unable to transcribe audio.';
  } catch (error: any) {
    console.error('Audio transcription error:', error);
    return `Audio "${audioFile.name}" uploaded but transcription failed: ${error?.message || 'Unknown error'}`;
  }
};

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Get file preview URL for display
const getFilePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

// Handle keyboard events
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
};

// Handle attachment click
const handleAttachmentClick = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const newFiles = Array.from(target.files);
    attachments.value.push(...newFiles);
    // Reset the input so the same file can be selected again
    target.value = '';
  }
};

// Remove attachment
const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1);
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Handle voice recording
const handleVoiceClick = async () => {
  if (!isRecording.value) {
    await startRecording();
  } else {
    stopRecording();
  }
};

// Start voice recording
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], `voice-message-${Date.now()}.wav`, { type: 'audio/wav' });
      attachments.value.push(audioFile);

      // Stop all tracks to release the microphone
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.value.start();
    isRecording.value = true;
  } catch (error) {
    console.error('Error starting recording:', error);
    emit('error', { error: new Error('Failed to start recording. Please check microphone permissions.') });
  }
};

// Stop voice recording
const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
  }
};

// Format message content with markdown
const formatMessage = (content: string): string => {
  return formatMarkdown(content);
};

// Format timestamp for display
const formatTimestamp = (timestamp?: Date): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

// Copy message content to clipboard
const copyToClipboard = (text: string): void => {
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

.ai-chat-window__processing {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.ai-chat-window__processing-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--aivue-chat-button-bg, #2196f3);
  font-style: italic;
  font-size: 14px;
}

.ai-chat-window__input-container {
  padding: 12px 16px;
  border-top: 1px solid var(--aivue-chat-border, #e0e0e0);
}

.ai-chat-window__input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  position: relative;
}

.ai-chat-window__attachment-button,
.ai-chat-window__voice-button {
  background-color: var(--aivue-chat-input-bg, #ffffff);
  border: 1px solid var(--aivue-chat-input-border, #e0e0e0);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--aivue-chat-text, #666666);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.ai-chat-window__attachment-button:hover,
.ai-chat-window__voice-button:hover {
  background-color: var(--aivue-chat-button-bg, #2196f3);
  color: var(--aivue-chat-button-text, #ffffff);
  border-color: var(--aivue-chat-button-bg, #2196f3);
}

.ai-chat-window__attachment-button:disabled,
.ai-chat-window__voice-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-chat-window__voice-button--recording {
  background-color: #f44336;
  color: white;
  border-color: #f44336;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.ai-chat-window__input {
  flex: 1;
  padding: 12px 50px 12px 16px;
  border: 1px solid var(--aivue-chat-input-border, #e0e0e0);
  border-radius: 20px;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  background-color: var(--aivue-chat-input-bg, #ffffff);
  color: var(--aivue-chat-text, #333333);
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
}

.ai-chat-window__input:focus {
  outline: none;
  border-color: var(--aivue-chat-button-bg, #2196f3);
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.ai-chat-window__send-button {
  position: absolute;
  right: 4px;
  bottom: 4px;
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
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ai-chat-window__send-button:hover:not(:disabled) {
  background-color: var(--aivue-chat-button-hover, #1976d2);
  transform: scale(1.05);
}

.ai-chat-window__send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.ai-chat-window__loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Attachment styles */
.ai-chat-window__attachments {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ai-chat-window__attachment-item {
  display: flex;
  align-items: flex-start;
  background-color: var(--aivue-chat-assistant-bg, #f5f5f5);
  border: 1px solid var(--aivue-chat-input-border, #e0e0e0);
  border-radius: 12px;
  padding: 12px;
  font-size: 12px;
  max-width: 280px;
  position: relative;
}

.ai-chat-window__attachment-preview {
  margin-right: 12px;
  flex-shrink: 0;
}

.ai-chat-window__image-preview {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--aivue-chat-input-bg, #ffffff);
}

.ai-chat-window__image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ai-chat-window__attachment-overlay {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 4px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-chat-window__audio-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: var(--aivue-chat-button-bg, #2196f3);
  color: white;
  border-radius: 8px;
  text-align: center;
}

.ai-chat-window__audio-duration {
  font-size: 10px;
  margin-top: 4px;
}

.ai-chat-window__file-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: var(--aivue-chat-input-bg, #ffffff);
  border: 2px solid var(--aivue-chat-input-border, #e0e0e0);
  border-radius: 8px;
  color: var(--aivue-chat-text, #666666);
}

.ai-chat-window__attachment-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.ai-chat-window__attachment-name {
  font-weight: 500;
  color: var(--aivue-chat-text, #333333);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.ai-chat-window__attachment-size {
  color: var(--aivue-chat-text, #666666);
  font-size: 11px;
  line-height: 1.2;
}

.ai-chat-window__attachment-type {
  color: var(--aivue-chat-button-bg, #2196f3);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
}

.ai-chat-window__attachment-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: var(--aivue-chat-text, #999999);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 24px;
  height: 24px;
}

.ai-chat-window__attachment-remove:hover {
  background-color: #f44336;
  color: white;
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
