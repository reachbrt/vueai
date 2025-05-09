// Type definitions for @aivue/chatbot
import { Component } from 'vue';
import { AIClient, Message } from '@aivue/core';

export const AiChatWindow: Component;
export const AiChatToggle: Component;

export interface ChatOptions {
  client: AIClient;
  initialMessages?: Message[];
  systemPrompt?: string;
  streaming?: boolean;
}

export function useChatEngine(options: ChatOptions): {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: string) => Promise<Message>;
};

export const utils: {
  formatMarkdown: (text: string) => string;
};
