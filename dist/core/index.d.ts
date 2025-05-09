// Type definitions for @aivue/core
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
  timestamp?: Date;
}

export class AIClient {
  constructor(options: any);
  chat(messages: Message[]): Promise<Message>;
}

export function initializeAI(options: any): void;
