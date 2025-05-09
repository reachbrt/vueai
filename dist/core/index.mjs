// Simplified implementation for demo purposes
const utils = { formatMarkdown: (text) => text };

// Export components based on package name
if ('core' === 'core') {
  class AIClient {
    constructor(options) {
      this.options = options || {};
    }

    async chat(messages) {
      return {
        role: 'assistant',
        content: 'This is a simulated response from the AI. In a real implementation, this would connect to an AI provider.'
      };
    }
  }

  function initializeAI(options) {
    console.log('AI initialized with options:', options);
  }

  export { AIClient, initializeAI };
} else if ('core' === 'chatbot') {
  const AiChatWindow = {
    name: 'AiChatWindow',
    props: ['client', 'title', 'placeholder', 'showAvatars', 'theme'],
    template: '<div class="ai-chat-window"><div class="ai-chat-header">{{ title }}</div><div class="ai-chat-messages"></div><div class="ai-chat-input"><input :placeholder="placeholder" /></div></div>'
  };

  const AiChatToggle = {
    name: 'AiChatToggle',
    props: ['client', 'title', 'theme'],
    template: '<button class="ai-chat-toggle">Chat</button>'
  };

  function useChatEngine(options) {
    return {
      messages: [],
      isLoading: false,
      error: null,
      sendMessage: async (message) => {
        console.log('Sending message:', message);
        return { role: 'assistant', content: 'Simulated response' };
      }
    };
  }

  export { AiChatWindow, AiChatToggle, useChatEngine, utils };
} else if ('core' === 'autosuggest') {
  const AiAutosuggest = {
    name: 'AiAutosuggest',
    props: ['client', 'placeholder', 'modelValue', 'triggerChars', 'maxTokens', 'showLoading', 'theme'],
    template: '<input class="ai-autosuggest" :placeholder="placeholder" :value="modelValue" @input="(\'update:modelValue\', .target.value)" />'
  };

  export { AiAutosuggest };
} else if ('core' === 'smartform') {
  const AiSmartForm = {
    name: 'AiSmartForm',
    props: ['client', 'schema', 'validation', 'theme'],
    template: '<form class="ai-smart-form" @submit.prevent="(\'submit\', {})"><div v-for="field in schema.fields" :key="field.name" class="ai-form-field"><label>{{ field.label }}</label><input :type="field.type" :name="field.name" /></div><button type="submit">Submit</button></form>'
  };

  export { AiSmartForm };
}
