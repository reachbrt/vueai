// AI-powered chat components for Vue.js
import { AIClient, Message as CoreMessage } from '@reachbrt/vueai-core';

// Export types
export interface Message extends CoreMessage {
  id?: string;
  timestamp?: Date;
}

export interface ChatOptions {
  provider: string;
  apiKey?: string;
  model?: string;
  systemPrompt?: string;
  streaming?: boolean;
  initialMessages?: Message[];
}

export interface UseChatEngineResult {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  resetConversation: () => void;
}

// Placeholder for the useChatEngine composable
export function useChatEngine(options: ChatOptions): UseChatEngineResult {
  // This is a placeholder implementation
  // In a real implementation, this would be a Vue composable
  return {
    messages: options.initialMessages || [],
    isLoading: false,
    error: null,
    sendMessage: async () => {
      console.log('Message sent');
    },
    resetConversation: () => {
      console.log('Conversation reset');
    }
  };
}

// Placeholder for the AiChatWindow component
// In a real implementation, this would be a Vue component
export const AiChatWindow = {
  name: 'AiChatWindow',
  // Component implementation would go here
};

// Default export
export default {
  useChatEngine,
  AiChatWindow
};
