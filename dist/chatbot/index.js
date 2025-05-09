// Chatbot package implementation
import { h, ref, defineComponent } from 'vue';

export const AiChatWindow = defineComponent({
  name: 'AiChatWindow',
  props: {
    client: Object,
    title: String,
    placeholder: String,
    showAvatars: Boolean,
    theme: String
  },
  setup(props) {
    const messages = ref([
      { role: 'assistant', content: 'Hello! How can I help you today?', id: '1', timestamp: new Date() }
    ]);
    const inputValue = ref('');
    const isLoading = ref(false);

    const sendMessage = () => {
      if (!inputValue.value.trim()) return;

      // Add user message
      messages.value.push({
        role: 'user',
        content: inputValue.value,
        id: String(Date.now()),
        timestamp: new Date()
      });

      // Clear input
      const userMessage = inputValue.value;
      inputValue.value = '';

      // Use the AI client to get a real response
      isLoading.value = true;

      try {
        // Prepare the messages array for the AI
        const systemPrompt = 'You are a helpful assistant.';
        const aiMessages = [
          { role: 'system', content: systemPrompt },
          ...messages.value.map(m => ({ role: m.role, content: m.content }))
        ];

        // If client is available, use it to get a response
        if (props.client && typeof props.client.chat === 'function') {
          props.client.chat(aiMessages)
            .then(response => {
              if (response && response.content) {
                messages.value.push({
                  role: 'assistant',
                  content: response.content,
                  id: String(Date.now() + 1),
                  timestamp: new Date()
                });
              } else {
                throw new Error('Invalid response from AI client');
              }
            })
            .catch(error => {
              console.error('Error getting AI response:', error);
              // Fallback to error message
              messages.value.push({
                role: 'assistant',
                content: `I'm sorry, I couldn't process your request. ${error.message || 'Please try again later.'}`,
                id: String(Date.now() + 1),
                timestamp: new Date()
              });
            })
            .finally(() => {
              isLoading.value = false;
            });
        } else {
          // Fallback for demo purposes when no client is provided
          console.warn('No AI client provided or chat method not available');
          setTimeout(() => {
            messages.value.push({
              role: 'assistant',
              content: `I notice you said: "${userMessage}". This is a simulated response because no AI client was provided or it's not properly configured.`,
              id: String(Date.now() + 1),
              timestamp: new Date()
            });
            isLoading.value = false;
          }, 1000);
        }
      } catch (error) {
        console.error('Error in chat processing:', error);
        messages.value.push({
          role: 'assistant',
          content: 'I apologize, but I encountered an unexpected error. Please try again.',
          id: String(Date.now() + 1),
          timestamp: new Date()
        });
        isLoading.value = false;
      }
    };

    return () => h('div', { class: 'ai-chat-window' }, [
      h('div', { class: 'ai-chat-header' }, props.title || 'AI Assistant'),
      h('div', { class: 'ai-chat-messages' }, [
        ...messages.value.map(msg =>
          h('div', {
            class: `ai-message ${msg.role}`,
            key: msg.id
          }, [
            props.showAvatars ? h('div', { class: 'ai-avatar' }, msg.role === 'user' ? '👤' : '🤖') : null,
            h('div', { class: 'ai-message-content' }, msg.content)
          ])
        ),
        isLoading.value ? h('div', { class: 'ai-message assistant loading' }, [
          props.showAvatars ? h('div', { class: 'ai-avatar' }, '🤖') : null,
          h('div', { class: 'ai-message-content' }, 'Thinking...')
        ]) : null
      ]),
      h('div', { class: 'ai-chat-input' }, [
        h('input', {
          value: inputValue.value,
          placeholder: props.placeholder || 'Type a message...',
          onInput: (e) => { inputValue.value = e.target.value; },
          onKeyup: (e) => { if (e.key === 'Enter') sendMessage(); }
        }),
        h('button', {
          onClick: sendMessage,
          disabled: isLoading.value
        }, 'Send')
      ])
    ]);
  }
});

export const AiChatToggle = defineComponent({
  name: 'AiChatToggle',
  props: {
    client: Object,
    title: String,
    theme: String
  },
  setup(props, { emit }) {
    const isOpen = ref(false);

    const toggleChat = () => {
      isOpen.value = !isOpen.value;
      emit('toggle', isOpen.value);
    };

    return () => h('div', { class: 'ai-chat-toggle-container' }, [
      h('button', {
        class: 'ai-chat-toggle',
        onClick: toggleChat
      }, isOpen.value ? 'Close Chat' : (props.title || 'Chat with AI')),
      isOpen.value ? h(AiChatWindow, {
        client: props.client,
        title: props.title,
        theme: props.theme
      }) : null
    ]);
  }
});

export function useChatEngine(options) {
  const messages = ref(options.initialMessages || []);
  const isLoading = ref(false);
  const error = ref(null);
  const streaming = ref(options.streaming || false);
  const streamedResponse = ref('');

  // Initialize with a welcome message if no initial messages
  if (messages.value.length === 0 && options.welcomeMessage !== false) {
    messages.value.push({
      role: 'assistant',
      content: options.welcomeMessage || 'Hello! How can I help you today?',
      id: String(Date.now()),
      timestamp: new Date()
    });
  }

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Reset streaming state
    streamedResponse.value = '';

    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      id: String(Date.now()),
      timestamp: new Date()
    };
    messages.value.push(userMessage);

    // Prepare for AI response
    isLoading.value = true;
    error.value = null;

    try {
      // Prepare the messages array for the AI
      const systemMessage = options.systemPrompt
        ? { role: 'system', content: options.systemPrompt }
        : { role: 'system', content: 'You are a helpful assistant.' };

      const aiMessages = [
        systemMessage,
        ...messages.value.map(m => ({ role: m.role, content: m.content }))
      ];

      // If client is available, use it to get a response
      if (options.client && typeof options.client.chat === 'function') {
        // Get response from AI
        const response = await options.client.chat(aiMessages);

        if (response && response.content) {
          const aiMessage = {
            role: 'assistant',
            content: response.content,
            id: String(Date.now() + 1),
            timestamp: new Date()
          };

          messages.value.push(aiMessage);
          return aiMessage;
        } else {
          throw new Error('Invalid response from AI client');
        }
      } else {
        // Fallback for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));

        const aiMessage = {
          role: 'assistant',
          content: `I received your message: "${message}". This is a simulated response because no AI client was provided or it's not properly configured.`,
          id: String(Date.now() + 1),
          timestamp: new Date()
        };

        messages.value.push(aiMessage);
        return aiMessage;
      }
    } catch (err) {
      error.value = err;
      console.error('Error in chat processing:', err);

      // Add error message
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${err.message || 'An unknown error occurred'}`,
        id: String(Date.now() + 1),
        timestamp: new Date(),
        isError: true
      };

      messages.value.push(errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Clear all messages
  const clearMessages = () => {
    messages.value = [];
  };

  return {
    messages,
    isLoading,
    error,
    streaming: streaming.value,
    sendMessage,
    clearMessages
  };
}

export const utils = {
  // Simple markdown formatter that handles basic markdown syntax
  formatMarkdown: (text) => {
    if (!text) return '';

    // Handle code blocks with syntax highlighting
    text = text.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, '<pre class="code-block"><code class="language-$1">$2</code></pre>');

    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Handle bold text
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Handle italic text
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Handle headers
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // Handle lists
    text = text.replace(/^\s*\* (.*$)/gm, '<li>$1</li>');
    text = text.replace(/^\s*- (.*$)/gm, '<li>$1</li>');
    text = text.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');

    // Wrap lists in ul/ol tags
    text = text.replace(/<li>.*<\/li>/g, (match) => {
      return '<ul>' + match + '</ul>';
    });

    // Handle links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Handle paragraphs
    text = text.replace(/\n\n/g, '</p><p>');

    // Wrap in paragraph tags if not already wrapped
    if (!text.startsWith('<')) {
      text = '<p>' + text + '</p>';
    }

    return text;
  },

  // Generate a unique ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Format a timestamp
  formatTimestamp: (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};
