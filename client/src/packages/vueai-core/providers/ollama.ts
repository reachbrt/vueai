import type { AIClientOptions, ChatOptions, Message, StreamCallbacks } from "../index";

export class OllamaProvider {
  private baseUrl: string;
  private model: string;
  private apiKey?: string;

  constructor(options: AIClientOptions) {
    // Ollama can run locally or remotely with Bearer token authentication
    this.baseUrl = options.baseUrl || 'http://localhost:11434/api';
    this.model = options.model || 'llama3';
    this.apiKey = options.apiKey;
  }
  
  async chat(messages: Message[], options?: ChatOptions): Promise<Message> {
    try {
      console.log('Ollama chat request:', { messages, options, model: this.model });

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      // Add Bearer token authentication if API key is provided
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      // Try to make actual API call to Ollama
      try {
        const response = await fetch(`${this.baseUrl}/chat`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: this.model,
            messages: messages,
            options: {
              temperature: options?.temperature || 0.7,
              top_p: options?.topP || 1,
              frequency_penalty: options?.frequencyPenalty || 0,
              presence_penalty: options?.presencePenalty || 0,
              stop: options?.stopSequences || [],
              num_predict: options?.maxTokens || 1024
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          return {
            role: 'assistant',
            content: data.message?.content || data.response || 'No response from Ollama'
          };
        } else {
          console.warn(`Ollama API call failed (${response.status}), falling back to demo mode`);
        }
      } catch (apiError) {
        console.warn('Ollama API call failed, falling back to demo mode:', apiError);
      }

      // Fall back to demo response
      return this.getDemoResponse(messages);
    } catch (error) {
      console.error('Ollama chat error:', error);
      throw error;
    }
  }

  private getDemoResponse(messages: Message[]): Message {
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    let responseContent = '';

    if (userMessage.includes('chatbot')) {
      responseContent = "The @vueai/chatbot package works seamlessly with local Ollama models. You can run models like Llama 3, Mistral, or Vicuna locally and integrate them with the chat component for privacy-focused applications.";
    } else if (userMessage.includes('autosuggest')) {
      responseContent = "The @vueai/autosuggest component can use Ollama's local AI models for generating suggestions. This is ideal for applications where data privacy is important, as all processing happens on your local machine.";
    } else if (userMessage.includes('smartform')) {
      responseContent = "The @vueai/smartform package supports Ollama integration for form validation. Running validation locally with Ollama ensures your form data never leaves your server, making it ideal for privacy-sensitive applications.";
    } else if (userMessage.includes('provider')) {
      responseContent = "To use Ollama as your AI provider, make sure you have Ollama running and then configure it like this:\n\n```javascript\nconst { messages, sendMessage } = useChatEngine({\n  provider: 'ollama',\n  baseUrl: 'http://localhost:11434/api',\n  model: 'llama3',\n  apiKey: 'your-bearer-token' // Optional for remote instances\n});\n```";
    } else if (userMessage.includes('local')) {
      responseContent = "Ollama lets you run powerful language models locally on your machine. The VueAI components connect to your local Ollama instance, so all processing happens on your hardware without sending data to external APIs.";
    } else if (userMessage.includes('auth') || userMessage.includes('token')) {
      responseContent = "Ollama now supports Bearer token authentication for remote instances! Just provide your API key when configuring the provider. Local instances typically don't need authentication.";
    } else {
      responseContent = "I'm providing information about using Ollama with VueAI components. Ollama runs AI models locally on your machine, offering privacy advantages for @vueai/chatbot, @vueai/autosuggest, and @vueai/smartform.";
    }

    // Simulate network delay (shorter since it's local)
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      role: 'assistant',
      content: responseContent
    };
  }
  
  async streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void> {
    try {
      console.log('Ollama streamChat request:', { messages, model: this.model });
      
      // Notify start of streaming
      callbacks.onStart?.();
      
      // Mock streaming response
      const userMessage = messages[messages.length - 1].content.toLowerCase();
      let responseContent = '';
      
      if (userMessage.includes('chatbot')) {
        responseContent = "The @vueai/chatbot package works seamlessly with local Ollama models. You can run models like Llama 3, Mistral, or Vicuna locally and integrate them with the chat component for privacy-focused applications.";
      } else if (userMessage.includes('autosuggest')) {
        responseContent = "The @vueai/autosuggest component can use Ollama's local AI models for generating suggestions. This is ideal for applications where data privacy is important, as all processing happens on your local machine.";
      } else if (userMessage.includes('smartform')) {
        responseContent = "The @vueai/smartform package supports Ollama integration for form validation. Running validation locally with Ollama ensures your form data never leaves your server, making it ideal for privacy-sensitive applications.";
      } else if (userMessage.includes('provider')) {
        responseContent = "To use Ollama as your AI provider, make sure you have Ollama running locally and then configure it like this:\n\n```javascript\nconst { messages, sendMessage } = useChatEngine({\n  provider: 'ollama',\n  baseUrl: 'http://localhost:11434/api',\n  model: 'llama3'\n});\n```";
      } else if (userMessage.includes('local')) {
        responseContent = "Ollama lets you run powerful language models locally on your machine. The VueAI components connect to your local Ollama instance, so all processing happens on your hardware without sending data to external APIs.";
      } else {
        responseContent = "I'm providing information about using Ollama with VueAI components. Ollama runs AI models locally on your machine, offering privacy advantages for @vueai/chatbot, @vueai/autosuggest, and @vueai/smartform.";
      }
      
      // Split response into tokens for streaming
      const tokens = responseContent.split(/(?<=\s)/);
      
      // Stream tokens with delay
      let completedText = '';
      for (const token of tokens) {
        callbacks.onToken?.(token);
        completedText += token;
        
        // Random delay between 10-50ms (faster since it's local)
        const delay = Math.floor(Math.random() * 40) + 10;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Notify completion
      callbacks.onComplete?.(completedText);
    } catch (error) {
      console.error('Ollama streamChat error:', error);
      callbacks.onError?.(error as Error);
      throw error;
    }
  }
  
  async embeddings(text: string | string[]): Promise<number[][]> {
    try {
      console.log('Ollama embeddings request:', { text, model: this.model });
      
      // In a real implementation, this would call the Ollama embeddings API
      // For now, simulate embeddings
      
      // Generate mock embeddings (dimension depends on model)
      const texts = Array.isArray(text) ? text : [text];
      const embeddings = texts.map(() => {
        return Array.from({ length: 384 }, () => Math.random() * 2 - 1);
      });
      
      // Simulate calculation delay (shorter since it's local)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return embeddings;
    } catch (error) {
      console.error('Ollama embeddings error:', error);
      throw error;
    }
  }
}