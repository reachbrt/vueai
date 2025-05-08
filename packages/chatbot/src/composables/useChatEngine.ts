import { ref, reactive, toRefs, watch, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { AIClient, Message as CoreMessage, StreamCallbacks } from '@aivue/core';

// Define types
export interface Message extends CoreMessage {
  id?: string;
  timestamp?: Date;
}

export interface ChatOptions {
  client: AIClient;
  initialMessages?: Message[];
  systemPrompt?: string;
  streaming?: boolean;
  persistenceKey?: string | null;
  maxMessages?: number;
  onError?: ((error: Error) => void) | null;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Composable for managing chat state and interactions with AI
 *
 * @param options - Configuration options
 * @returns Chat state and methods
 */
export function useChatEngine(options: ChatOptions) {
  const {
    client,
    initialMessages = [],
    systemPrompt = 'You are a helpful assistant.',
    streaming = true,
    persistenceKey = null,
    maxMessages = 100,
    onError = null
  } = options;

  // Create reactive state
  const state = reactive<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

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
          state.messages = initializeMessages(JSON.parse(savedMessages));
          return;
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    }

    // If no saved messages or error loading, use initialMessages
    state.messages = initializeMessages(initialMessages);
  });

  // Save messages to localStorage when they change
  watch(() => state.messages, (messages) => {
    if (persistenceKey) {
      try {
        localStorage.setItem(persistenceKey, JSON.stringify(messages));
      } catch (err) {
        console.error('Error saving chat history:', err);
      }
    }
  }, { deep: true });

  /**
   * Send a user message and get AI response
   *
   * @param content - Message content
   * @returns Promise that resolves when the message is sent and response is received
   */
  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    // Reset error state
    state.error = null;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content,
      id: uuidv4(),
      timestamp: new Date()
    };
    state.messages.push(userMessage);

    // Start loading
    state.isLoading = true;

    try {
      // Prepare messages for the AI
      const messagesToSend: CoreMessage[] = [
        { role: 'system', content: systemPrompt },
        ...state.messages.filter(msg => msg.role === 'user' || msg.role === 'assistant')
          .map(({ role, content }) => ({ role, content }))
      ];

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
        state.messages.push(assistantMessage);

        const callbacks: StreamCallbacks = {
          onStart: () => {
            // Message already added above
          },
          onToken: (token: string) => {
            // Update the last message with the new token
            responseContent += token;
            const lastMessage = state.messages[state.messages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = responseContent;
            }
          },
          onComplete: () => {
            state.isLoading = false;
          },
          onError: (err: Error) => {
            state.error = err;
            state.isLoading = false;
            if (onError) onError(err);
          }
        };

        await client.chatStream(messagesToSend, callbacks);
      } else {
        // For non-streaming responses
        const response = await client.chat(messagesToSend);

        // Add assistant message
        state.messages.push({
          role: 'assistant',
          content: response, // response is a string
          id: uuidv4(),
          timestamp: new Date()
        });

        state.isLoading = false;
      }

      // Limit the number of messages
      if (state.messages.length > maxMessages) {
        // Keep system message and the last maxMessages messages
        const systemMessages = state.messages.filter(msg => msg.role === 'system');
        const recentMessages = state.messages.slice(-maxMessages);
        state.messages = [...systemMessages, ...recentMessages];
      }
    } catch (err: any) {
      state.error = err;
      state.isLoading = false;
      if (onError) onError(err);
    }
  };

  /**
   * Clear all messages
   */
  const clearMessages = (): void => {
    state.messages = [];
    state.error = null;
  };

  /**
   * Set messages array
   *
   * @param messages - New messages array
   */
  const setMessages = (messages: Message[]): void => {
    state.messages = initializeMessages(messages);
  };

  /**
   * Add a single message
   *
   * @param message - Message to add
   */
  const addMessage = (message: Message): void => {
    state.messages.push({
      ...message,
      id: message.id || uuidv4(),
      timestamp: message.timestamp || new Date()
    });
  };

  return {
    ...toRefs(state),
    sendMessage,
    clearMessages,
    setMessages,
    addMessage
  };
}

export default useChatEngine;
