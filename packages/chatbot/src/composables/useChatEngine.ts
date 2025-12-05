import { ref, reactive, toRefs, watch, onMounted, Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { AIClient, Message as CoreMessage, StreamCallbacks, AIProvider } from '@aivue/core';

// Import optional utilities (only used if features are enabled)
import { StorageProvider, createStorageProvider, storageUtils } from '../utils/storage';
import { VoiceProvider, createVoiceProvider, voiceUtils } from '../utils/voice';
import { AnalyticsProvider, createAnalyticsProvider, analyticsUtils } from '../utils/analytics';
import { MultiModelManager, createMultiModelManager, multiModelUtils } from '../utils/multiModel';

// Enhanced Message interface with optional advanced features
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  id?: string;
  timestamp?: Date;

  // OPTIONAL: Advanced features (backward compatible)
  userId?: string;
  conversationId?: string;
  threadId?: string;
  metadata?: Record<string, any>;
  attachments?: Array<{
    type: string;
    name: string;
    url: string;
    size?: number;
  }>;
  reactions?: Array<{
    emoji: string;
    userId: string;
    timestamp: Date;
  }>;
  edited?: boolean;
  editedAt?: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  processingTime?: number;
  modelUsed?: string;
}

// OPTIONAL: Advanced interfaces (only used if features are enabled)
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  threadId?: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  isArchived: boolean;
  isShared: boolean;
  sharedWith?: string[];
}

export interface Thread {
  id: string;
  title: string;
  conversationIds: string[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface ChatOptions {
  // Required options
  provider: AIProvider;
  apiKey?: string;
  model?: string;

  // Optional client configuration
  client?: AIClient;
  baseUrl?: string;
  organizationId?: string;

  // Chat behavior options
  initialMessages?: Message[];
  systemPrompt?: string;
  streaming?: boolean;
  persistenceKey?: string | null;
  maxMessages?: number;

  // Demo mode
  demoMode?: boolean;
  demoResponses?: Record<string, string>;

  // Proxy options for security
  useProxy?: boolean;
  proxyUrl?: string;

  // OPTIONAL: Advanced Features (backward compatible)
  // Database Storage (optional)
  storage?: {
    provider?: 'supabase' | 'firebase' | 'mongodb' | 'postgresql' | 'localStorage';
    connectionString?: string;
    apiKey?: string;
    projectId?: string;
    userId?: string;
    autoSave?: boolean;
  };

  // User Authentication (optional)
  user?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
    preferences?: Record<string, any>;
  };

  // Conversation Threading (optional)
  threading?: {
    enabled?: boolean;
    autoCreateThreads?: boolean;
    threadNaming?: 'ai-generated' | 'manual' | 'timestamp';
    maxThreads?: number;
  };

  // Voice Integration (optional)
  voice?: {
    speechToText?: boolean;
    textToSpeech?: boolean;
    language?: string;
    voiceId?: string;
  };

  // Analytics (optional)
  analytics?: {
    enabled?: boolean;
    trackUserSentiment?: boolean;
    trackUsageMetrics?: boolean;
    exportReports?: boolean;
  };

  // Multi-Model Support (optional)
  multiModel?: {
    enabled?: boolean;
    models?: Array<{
      name: string;
      provider: AIProvider;
      apiKey?: string;
      specialty?: string;
    }>;
    autoSwitch?: boolean;
  };

  // File Processing (optional)
  fileProcessing?: {
    enabled?: boolean;
    maxSize?: string;
    allowedTypes?: string[];
    ocrEnabled?: boolean;
    batchProcessing?: boolean;
  };

  // RAG (Retrieval-Augmented Generation) (optional)
  rag?: {
    enabled?: boolean;
    knowledgeBase?: any[]; // RAGDocument[] from useRAG
    chunkSize?: number;
    topK?: number;
    retrieveContext?: (query: string) => any; // Function to retrieve context
    contextTemplate?: string; // Custom template for context injection
  };

  // Callbacks
  onError?: ((error: Error) => void) | null;
  onMessageSent?: ((message: Message) => void) | null;
  onResponseReceived?: ((message: Message) => void) | null;
  onConversationSaved?: ((conversationId: string) => void) | null;
  onThreadCreated?: ((threadId: string) => void) | null;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
}

export interface ChatEngineReturn {
  // Reactive refs
  messages: Ref<Message[]>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;

  // Core methods
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  resetError: () => void;
  updateConfig: (config: Partial<ChatOptions>) => void;

  // OPTIONAL: Enhanced methods (only available if features are enabled)
  // Storage methods
  saveConversation?: (title: string) => Promise<string>;
  loadConversation?: (id: string) => Promise<void>;
  deleteConversation?: (id: string) => Promise<void>;
  searchConversations?: (query: string) => Promise<any[]>;

  // Voice methods
  startListening?: () => Promise<void>;
  stopListening?: () => void;
  speak?: (text: string) => Promise<void>;
  stopSpeaking?: () => void;

  // Analytics methods
  getUsageMetrics?: () => Promise<any>;
  exportReport?: (format: 'json' | 'csv') => Promise<Blob>;

  // Multi-model methods
  switchModel?: (modelName: string) => void;
  getAvailableModels?: () => any[];
  getModelPerformance?: () => any[];
}

/**
 * Composable for managing chat state and interactions with AI
 *
 * @param options - Configuration options
 * @returns Chat state and methods
 */
export function useChatEngine(options: ChatOptions): ChatEngineReturn {
  // Create or use provided client
  let client: AIClient;

  if (options.client) {
    client = options.client;
  } else if (options.provider) {
    // Create a new client if one wasn't provided
    client = new AIClient({
      provider: options.provider,
      apiKey: options.apiKey,
      model: options.model || getDefaultModelForProvider(options.provider),
      baseUrl: options.baseUrl,
      organizationId: options.organizationId
    });
  } else {
    throw new Error('Either client or provider must be specified in options');
  }

  // OPTIONAL: Initialize advanced features (only if configured)
  let storageProvider: StorageProvider | null = null;
  let voiceProvider: VoiceProvider | null = null;
  let analyticsProvider: AnalyticsProvider | null = null;
  let multiModelManager: MultiModelManager | null = null;
  let currentConversationId: string | null = null;
  let currentThreadId: string | null = null;

  // Initialize storage if configured
  if (options.storage) {
    try {
      storageProvider = createStorageProvider(options.storage);
    } catch (error) {
      console.warn('Failed to initialize storage provider:', error);
    }
  }

  // Initialize voice if configured
  if (options.voice && (options.voice.speechToText || options.voice.textToSpeech)) {
    try {
      voiceProvider = createVoiceProvider(options.voice);
    } catch (error) {
      console.warn('Failed to initialize voice provider:', error);
    }
  }

  // Initialize analytics if configured
  if (options.analytics?.enabled) {
    try {
      analyticsProvider = createAnalyticsProvider(options.analytics);
    } catch (error) {
      console.warn('Failed to initialize analytics provider:', error);
    }
  }

  // Initialize multi-model if configured
  if (options.multiModel?.enabled) {
    try {
      multiModelManager = createMultiModelManager(options.multiModel);
    } catch (error) {
      console.warn('Failed to initialize multi-model manager:', error);
    }
  }

  // Extract other options with defaults
  const {
    initialMessages = [],
    systemPrompt = 'You are a helpful assistant.',
    streaming = true,
    persistenceKey = null,
    maxMessages = 100,
    demoMode = false,
    demoResponses = {},
    useProxy = false,
    proxyUrl = '/api/chat',
    onError = null,
    onMessageSent = null,
    onResponseReceived = null
  } = options;

  // Create reactive state using refs for better Vue 3 compatibility
  const messages = ref<Message[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  // Initialize messages with timestamps and IDs
  const initializeMessages = (msgs: Message[]): Message[] => {
    return msgs.map(msg => ({
      ...msg,
      id: msg.id || uuidv4(),
      timestamp: msg.timestamp || new Date()
    }));
  };

  // Load messages from localStorage if persistenceKey is provided
  onMounted(() => {
    if (persistenceKey) {
      try {
        const savedMessages = localStorage.getItem(persistenceKey);
        if (savedMessages) {
          messages.value = initializeMessages(JSON.parse(savedMessages));
          return;
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    }

    // If no saved messages or error loading, use initialMessages
    messages.value = initializeMessages(initialMessages);
  });

  // Save messages to localStorage when they change
  const saveMessagesToLocalStorage = () => {
    if (persistenceKey) {
      try {
        localStorage.setItem(persistenceKey, JSON.stringify(messages.value));
      } catch (err) {
        console.error('Error saving chat history:', err);
      }
    }
  };

  // Watch for changes to save to localStorage
  watch(messages, () => {
    saveMessagesToLocalStorage();
  }, { deep: true });

  /**
   * Reset error state
   */
  const resetError = (): void => {
    error.value = null;
  };

  /**
   * Update configuration options
   *
   * @param config - New configuration options
   */
  const updateConfig = (config: Partial<ChatOptions>): void => {
    // Update client configuration if needed
    if (config.provider || config.apiKey || config.model || config.baseUrl || config.organizationId) {
      client = new AIClient({
        provider: config.provider || options.provider,
        apiKey: config.apiKey || options.apiKey,
        model: config.model || options.model || getDefaultModelForProvider(config.provider || options.provider),
        baseUrl: config.baseUrl || options.baseUrl,
        organizationId: config.organizationId || options.organizationId
      });
    }

    // Update other options
    Object.assign(options, config);
  };

  /**
   * Send a user message and get AI response
   *
   * @param content - Message content
   * @returns Promise that resolves when the message is sent and response is received
   */
  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    // Reset error state
    error.value = null;

    // Add user message with enhanced metadata
    const userMessage: Message = {
      role: 'user',
      content,
      id: uuidv4(),
      timestamp: new Date(),
      // OPTIONAL: Add enhanced metadata if features are enabled
      userId: options.user?.id,
      conversationId: currentConversationId || undefined,
      threadId: currentThreadId || undefined,
      metadata: {}
    };
    messages.value.push(userMessage);

    // OPTIONAL: Track analytics if enabled
    if (analyticsProvider) {
      try {
        analyticsUtils.trackMessageSent(analyticsProvider, userMessage);
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    }

    // OPTIONAL: Save to database if storage is enabled
    if (storageProvider && currentConversationId) {
      try {
        await storageProvider.saveMessage(currentConversationId, userMessage);
      } catch (error) {
        console.warn('Failed to save message to storage:', error);
      }
    }

    // Call onMessageSent callback if provided
    if (onMessageSent) {
      onMessageSent(userMessage);
    }

    // Start loading
    isLoading.value = true;

    try {
      // OPTIONAL: RAG context injection
      let enhancedSystemPrompt = systemPrompt;
      let enhancedUserMessage = content;

      if (options.rag?.enabled && options.rag.retrieveContext) {
        try {
          const retrievalResult = options.rag.retrieveContext(content);

          if (retrievalResult.chunks && retrievalResult.chunks.length > 0) {
            // Build RAG context
            const contextTemplate = options.rag.contextTemplate ||
              `Context from knowledge base:\n\n{context}\n\nPlease use the above context to answer the following question. If the context doesn't contain relevant information, you can use your general knowledge but mention that the information is not from the provided documents.`;

            const ragContext = contextTemplate.replace('{context}', retrievalResult.context);

            // Inject context into system prompt
            enhancedSystemPrompt = `${systemPrompt}\n\n${ragContext}`;
          }
        } catch (ragError) {
          console.warn('RAG context retrieval failed:', ragError);
          // Continue without RAG context
        }
      }

      // Prepare messages for the AI
      const messagesToSend: CoreMessage[] = [
        { role: 'system', content: enhancedSystemPrompt },
        ...messages.value.filter(msg => msg.role === 'user' || msg.role === 'assistant')
          .map(({ role, content }) => ({ role, content }))
      ];

      // Check if we're in demo mode
      if (demoMode) {
        // Generate a demo response
        let demoResponse = "I'm a demo AI assistant. This is a simulated response.";

        // Check if we have a matching demo response
        const userMessageLower = userMessage.content.toLowerCase();
        for (const [key, response] of Object.entries(demoResponses)) {
          if (userMessageLower.includes(key.toLowerCase())) {
            demoResponse = response;
            break;
          }
        }

        if (streaming) {
          // Simulate streaming for demo mode
          const assistantMessage: Message = {
            role: 'assistant',
            content: '',
            id: uuidv4(),
            timestamp: new Date()
          };
          messages.value.push(assistantMessage);

          let streamedContent = '';
          const streamResponse = async () => {
            for (const char of demoResponse) {
              await new Promise(resolve => setTimeout(resolve, 20));
              streamedContent += char;
              assistantMessage.content = streamedContent;
            }
            isLoading.value = false;
            if (onResponseReceived) {
              onResponseReceived(assistantMessage);
            }
            if (persistenceKey) {
              saveMessagesToLocalStorage();
            }
          };

          streamResponse();
          return;
        } else {
          // Non-streaming demo mode
          const assistantMessage: Message = {
            role: 'assistant',
            content: demoResponse,
            id: uuidv4(),
            timestamp: new Date()
          };
          messages.value.push(assistantMessage);
          isLoading.value = false;
          if (onResponseReceived) {
            onResponseReceived(assistantMessage);
          }
          if (persistenceKey) {
            saveMessagesToLocalStorage();
          }
          return;
        }
      }

      if (streaming) {
        // For streaming responses
        let responseContent = '';

        // Add placeholder for assistant message
        const assistantMessage: Message = {
          role: 'assistant',
          content: '',
          id: uuidv4(),
          timestamp: new Date()
        };
        messages.value.push(assistantMessage);

        const callbacks: StreamCallbacks = {
          onStart: () => {
            // Message already added above
            console.log('Stream started');
          },
          onToken: (token: string) => {
            // Update the last message with the new token
            responseContent += token;
            const lastMessage = messages.value[messages.value.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = responseContent;
            }
          },
          onComplete: (completeText: string) => {
            isLoading.value = false;
            console.log('Stream completed');

            // Call onResponseReceived callback if provided
            if (onResponseReceived) {
              const lastMessage = messages.value[messages.value.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                onResponseReceived(lastMessage);
              }
            }

            // Save to localStorage if persistenceKey is provided
            if (persistenceKey) {
              saveMessagesToLocalStorage();
            }
          },
          onError: (err: Error) => {
            console.error('Stream error:', err);
            error.value = err;
            isLoading.value = false;
            if (onError) onError(err);
          }
        };

        if (useProxy) {
          // Implement proxy handling here
          // This would typically involve making a fetch request to the proxy URL
          // with the messages and streaming the response
          try {
            const response = await fetch(proxyUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messages: messagesToSend,
                model: options.model,
                stream: true
              })
            });

            if (!response.ok) {
              throw new Error(`Proxy request failed with status ${response.status}`);
            }

            if (response.body) {
              const reader = response.body.getReader();
              const decoder = new TextDecoder();

              callbacks.onStart?.();

              while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                callbacks.onToken?.(chunk);
              }

              callbacks.onComplete?.(responseContent);
            }
          } catch (err: any) {
            callbacks.onError?.(err);
          }
        } else {
          // Use the client directly for streaming (multi-model not supported in streaming yet)
          await client.chatStream(messagesToSend, callbacks);
        }
      } else {
        // For non-streaming responses
        let response: string;
        const startTime = Date.now();

        if (useProxy) {
          // Use proxy for non-streaming requests
          try {
            const proxyResponse = await fetch(proxyUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messages: messagesToSend,
                model: options.model,
                stream: false
              })
            });

            if (!proxyResponse.ok) {
              throw new Error(`Proxy request failed with status ${proxyResponse.status}`);
            }

            const data = await proxyResponse.json();
            response = data.content || data.message || data.response || '';
          } catch (err: any) {
            throw new Error(`Proxy request failed: ${err.message}`);
          }
        } else {
          // OPTIONAL: Use multi-model manager if enabled
          if (multiModelManager) {
            try {
              response = await multiModelManager.sendMessage(userMessage);
            } catch (error) {
              console.warn('Multi-model manager failed, falling back to default client:', error);
              response = await client.chat(messagesToSend);
            }
          } else {
            // Use the client directly
            response = await client.chat(messagesToSend);
          }
        }

        // Add assistant message with enhanced metadata
        const responseTime = Date.now() - startTime;
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          id: uuidv4(),
          timestamp: new Date(),
          // OPTIONAL: Add enhanced metadata if features are enabled
          userId: options.user?.id,
          conversationId: currentConversationId || undefined,
          threadId: currentThreadId || undefined,
          processingTime: responseTime,
          modelUsed: options.model || 'default',
          metadata: {}
        };
        messages.value.push(assistantMessage);

        // OPTIONAL: Track analytics if enabled
        if (analyticsProvider) {
          try {
            analyticsUtils.trackMessageReceived(analyticsProvider, assistantMessage, responseTime);
          } catch (error) {
            console.warn('Analytics tracking failed:', error);
          }
        }

        // OPTIONAL: Save to database if storage is enabled
        if (storageProvider && currentConversationId) {
          try {
            await storageProvider.saveMessage(currentConversationId, assistantMessage);
          } catch (error) {
            console.warn('Failed to save message to storage:', error);
          }
        }

        // Call onResponseReceived callback if provided
        if (onResponseReceived) {
          onResponseReceived(assistantMessage);
        }

        isLoading.value = false;
      }

      // Limit the number of messages
      if (messages.value.length > maxMessages) {
        // Keep system message and the last maxMessages messages
        const systemMessages = messages.value.filter(msg => msg.role === 'system');
        const recentMessages = messages.value.slice(-maxMessages);
        messages.value = [...systemMessages, ...recentMessages];
      }
    } catch (err: any) {
      error.value = new Error(`Failed to send message: ${err.message}`);
      isLoading.value = false;
      if (onError) onError(error.value);
    }
  };

  /**
   * Clear all messages
   */
  const clearMessages = (): void => {
    messages.value = [];
    error.value = null;
  };

  /**
   * Set messages array
   *
   * @param newMessages - New messages array
   */
  const setMessages = (newMessages: Message[]): void => {
    messages.value = initializeMessages(newMessages);
  };

  /**
   * Add a single message
   *
   * @param message - Message to add
   */
  const addMessage = (message: Message): void => {
    messages.value.push({
      ...message,
      id: message.id || uuidv4(),
      timestamp: message.timestamp || new Date()
    });
  };

  // OPTIONAL: Enhanced methods (only included if features are enabled)
  const enhancedMethods: any = {};

  // Storage methods
  if (storageProvider) {
    enhancedMethods.saveConversation = async (title: string): Promise<string> => {
      if (!options.user?.id) throw new Error('User ID required for saving conversations');

      const conversation = storageUtils.createConversation(options.user.id, title, currentThreadId || undefined);
      currentConversationId = await storageProvider!.saveConversation(conversation);

      // Save all current messages to the conversation
      for (const message of messages.value) {
        await storageProvider!.saveMessage(currentConversationId, message);
      }

      if (options.onConversationSaved) {
        options.onConversationSaved(currentConversationId);
      }

      return currentConversationId;
    };

    enhancedMethods.loadConversation = async (id: string): Promise<void> => {
      const conversation = await storageProvider!.getConversation(id);
      if (!conversation) throw new Error('Conversation not found');

      const conversationMessages = await storageProvider!.getMessages(id);
      currentConversationId = id;
      currentThreadId = conversation.threadId || null;

      setMessages(conversationMessages);
    };

    enhancedMethods.deleteConversation = async (id: string): Promise<void> => {
      await storageProvider!.deleteConversation(id);
      if (currentConversationId === id) {
        currentConversationId = null;
        clearMessages();
      }
    };

    enhancedMethods.searchConversations = async (query: string): Promise<any[]> => {
      if (!options.user?.id) throw new Error('User ID required for searching conversations');
      return storageProvider!.searchConversations(options.user.id, query);
    };
  }

  // Voice methods
  if (voiceProvider) {
    enhancedMethods.startListening = async (): Promise<void> => {
      return voiceProvider!.startListening(
        (result) => {
          if (result.isFinal && result.transcript.trim()) {
            sendMessage(result.transcript);
          }
        },
        (error) => {
          console.error('Voice recognition error:', error);
          if (options.onError) options.onError(error);
        }
      );
    };

    enhancedMethods.stopListening = (): void => {
      voiceProvider!.stopListening();
    };

    enhancedMethods.speak = async (text: string): Promise<void> => {
      const formattedText = voiceUtils.formatTextForSpeech(text);
      return voiceProvider!.speak(formattedText);
    };

    enhancedMethods.stopSpeaking = (): void => {
      voiceProvider!.stopSpeaking();
    };
  }

  // Analytics methods
  if (analyticsProvider) {
    enhancedMethods.getUsageMetrics = async (): Promise<any> => {
      if (!options.user?.id) throw new Error('User ID required for analytics');
      return analyticsProvider!.getUsageMetrics(options.user.id);
    };

    enhancedMethods.exportReport = async (format: 'json' | 'csv'): Promise<Blob> => {
      if (!options.user?.id) throw new Error('User ID required for reports');
      return analyticsProvider!.exportReport(options.user.id, format);
    };
  }

  // Multi-model methods
  if (multiModelManager) {
    enhancedMethods.switchModel = (modelName: string): void => {
      // Implementation would update the current model selection
      console.log(`Switching to model: ${modelName}`);
    };

    enhancedMethods.getAvailableModels = (): any[] => {
      return multiModelManager!.getAvailableModels();
    };

    enhancedMethods.getModelPerformance = (): any[] => {
      return multiModelManager!.getPerformanceStats();
    };
  }

  return {
    // Core functionality (always available)
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setMessages,
    addMessage,
    resetError,
    updateConfig,

    // Enhanced functionality (only available if features are enabled)
    ...enhancedMethods
  };
}

/**
 * Helper function to get default model for a provider
 */
function getDefaultModelForProvider(provider: AIProvider): string {
  switch (provider) {
    case 'openai':
      return 'gpt-3.5-turbo';
    case 'claude':
      return 'claude-3-sonnet-20240229';
    case 'gemini':
      return 'gemini-pro';
    case 'huggingface':
      return 'mistralai/Mistral-7B-Instruct-v0.2';
    case 'ollama':
      return 'llama2';
    case 'deepseek':
      return 'deepseek-chat';
    default:
      return 'gpt-3.5-turbo';
  }
}

export default useChatEngine;
