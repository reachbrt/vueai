import { ref, reactive, toRefs, watch, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';

/**
 * Composable for managing chat state and interactions with AI
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.client - AIClient instance
 * @param {Array} [options.initialMessages=[]] - Initial messages to populate the chat
 * @param {String} [options.systemPrompt='You are a helpful assistant.'] - System prompt
 * @param {Boolean} [options.streaming=true] - Whether to stream responses
 * @param {String} [options.persistenceKey=null] - Key for persisting chat history in localStorage
 * @param {Number} [options.maxMessages=100] - Maximum number of messages to keep
 * @param {Function} [options.onError=null] - Callback function when an error occurs
 * 
 * @returns {Object} Chat state and methods
 */
export function useChatEngine(options) {
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
  const state = reactive({
    messages: [],
    isLoading: false,
    error: null
  });

  // Initialize messages with timestamps and IDs
  const initializeMessages = (msgs) => {
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
   * @param {String} content - Message content
   * @returns {Promise<void>}
   */
  const sendMessage = async (content) => {
    if (!content.trim()) return;
    
    // Reset error state
    state.error = null;
    
    // Add user message
    const userMessage = {
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
      const messagesToSend = [
        { role: 'system', content: systemPrompt },
        ...state.messages.filter(msg => msg.role === 'user' || msg.role === 'assistant')
      ];
      
      if (streaming) {
        // For streaming responses
        let responseContent = '';
        
        await client.streamChat(
          messagesToSend,
          {},
          {
            onStart: () => {
              // Add placeholder for assistant message
              state.messages.push({
                role: 'assistant',
                content: '',
                id: uuidv4(),
                timestamp: new Date()
              });
            },
            onToken: (token) => {
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
            onError: (err) => {
              state.error = err;
              state.isLoading = false;
              if (onError) onError(err);
            }
          }
        );
      } else {
        // For non-streaming responses
        const response = await client.chat(messagesToSend);
        
        // Add assistant message
        state.messages.push({
          role: 'assistant',
          content: response.text,
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
    } catch (err) {
      state.error = err;
      state.isLoading = false;
      if (onError) onError(err);
    }
  };

  /**
   * Clear all messages
   */
  const clearMessages = () => {
    state.messages = [];
    state.error = null;
  };

  /**
   * Set messages array
   * 
   * @param {Array} messages - New messages array
   */
  const setMessages = (messages) => {
    state.messages = initializeMessages(messages);
  };

  /**
   * Add a single message
   * 
   * @param {Object} message - Message to add
   */
  const addMessage = (message) => {
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
