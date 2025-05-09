import { ref, reactive, toRefs, watch, onMounted, Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { AIClient, Message as CoreMessage, StreamCallbacks, AIProvider } from '@aivue/core';

// Define types
export interface Message extends CoreMessage {
  id?: string;
  timestamp?: Date;
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

  // Callbacks
  onError?: ((error: Error) => void) | null;
  onMessageSent?: ((message: Message) => void) | null;
  onResponseReceived?: ((message: Message) => void) | null;
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

  // Methods
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  resetError: () => void;
  updateConfig: (config: Partial<ChatOptions>) => void;
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

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      id: uuidv4(),
      timestamp: new Date()
    };
    messages.value.push(userMessage);

    // Call onMessageSent callback if provided
    if (onMessageSent) {
      onMessageSent(userMessage);
    }

    // Start loading
    isLoading.value = true;

    try {
      // Prepare messages for the AI
      const messagesToSend: CoreMessage[] = [
        { role: 'system', content: systemPrompt },
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
          // Use the client directly
          await client.chatStream(messagesToSend, callbacks);
        }
      } else {
        // For non-streaming responses
        let response: string;

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
          // Use the client directly
          response = await client.chat(messagesToSend);
        }

        // Add assistant message
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          id: uuidv4(),
          timestamp: new Date()
        };
        messages.value.push(assistantMessage);

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

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setMessages,
    addMessage,
    resetError,
    updateConfig
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
