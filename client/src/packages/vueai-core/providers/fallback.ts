import type { AIClientOptions, ChatOptions, Message, StreamCallbacks } from "../index";

/**
 * Fallback provider that simulates AI responses when no API keys are available
 * This allows the components to work properly in development environments without keys
 */
export class FallbackProvider {
  private providerName: string;
  
  constructor(options: AIClientOptions) {
    this.providerName = options.provider || 'fallback';
  }
  
  async chat(messages: Message[], options?: ChatOptions): Promise<Message> {
    console.log(`${this.providerName} (fallback) chat request:`, { messages, options });
    
    // Get the last user message
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    let responseContent = '';
    
    if (userMessage.includes('chatbot')) {
      responseContent = "The @vueai/chatbot package provides a Vue.js component for creating AI-powered chat interfaces. It supports multiple AI providers, manages conversation history, and offers features like streaming responses.";
    } else if (userMessage.includes('autosuggest')) {
      responseContent = "The @vueai/autosuggest package offers semantic search capabilities with AI-powered suggestions. You can configure it to work with different AI providers and provide domain-specific context.";
    } else if (userMessage.includes('smartform')) {
      responseContent = "The @vueai/smartform package provides AI-powered form validation, self-healing inputs, and dynamic field generation. It helps users submit cleaner data by suggesting corrections.";
    } else if (userMessage.includes('provider')) {
      responseContent = "You can configure different AI providers for your VueAI components. This works even without API keys in development by using simulated responses.";
    } else if (userMessage.includes('json')) {
      responseContent = "```json\n[\n  {\n    \"text\": \"vue.js ai components\",\n    \"score\": 95\n  },\n  {\n    \"text\": \"ai powered vue applications\",\n    \"score\": 92\n  },\n  {\n    \"text\": \"vue ai form validation\",\n    \"score\": 88\n  }\n]\n```";
    } else {
      responseContent = `I'm a simulated AI response (no ${this.providerName} API key). You can ask me about @vueai/chatbot, @vueai/autosuggest, @vueai/smartform, or the core functionality.`;
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      role: 'assistant',
      content: responseContent
    };
  }
  
  async streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void> {
    console.log(`${this.providerName} (fallback) streamChat request:`, { messages });
    
    // Notify start
    callbacks.onStart?.();
    
    // Get mock response
    const response = await this.chat(messages);
    
    // Stream mock response with artificial delay
    const tokens = response.content.split(/(?<=\s)/);
    let completedText = '';
    
    for (const token of tokens) {
      callbacks.onToken?.(token);
      completedText += token;
      
      // Random delay between 30-100ms
      const delay = Math.floor(Math.random() * 70) + 30;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Notify completion
    callbacks.onComplete?.(completedText);
  }
  
  async embeddings(text: string | string[]): Promise<number[][]> {
    console.log(`${this.providerName} (fallback) embeddings request:`, { text });
    
    // Generate mock embeddings (1536 dimensions)
    const texts = Array.isArray(text) ? text : [text];
    const embeddings = texts.map(() => {
      return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return embeddings;
  }
}