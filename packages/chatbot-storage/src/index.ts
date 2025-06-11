// Database integration and storage solutions for @aivue/chatbot
import { App } from 'vue';
import { Message } from '@aivue/chatbot';

// Storage providers
export * from './providers/supabase';
export * from './providers/firebase';
export * from './providers/mongodb';
export * from './providers/postgresql';
export * from './providers/localStorage';

// Storage interfaces
export interface StorageProvider {
  // Conversation management
  saveConversation(conversation: Conversation): Promise<string>;
  getConversation(id: string): Promise<Conversation | null>;
  listConversations(userId: string, options?: ListOptions): Promise<Conversation[]>;
  deleteConversation(id: string): Promise<void>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<void>;

  // Message management
  saveMessage(conversationId: string, message: Message): Promise<string>;
  getMessages(conversationId: string, options?: MessageOptions): Promise<Message[]>;
  deleteMessage(messageId: string): Promise<void>;
  updateMessage(messageId: string, updates: Partial<Message>): Promise<void>;

  // Search and analytics
  searchConversations(userId: string, query: string): Promise<Conversation[]>;
  getConversationStats(userId: string): Promise<ConversationStats>;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  threadId?: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  isArchived: boolean;
  isShared: boolean;
  sharedWith?: string[];
}

export interface ListOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  includeArchived?: boolean;
  tags?: string[];
}

export interface MessageOptions {
  limit?: number;
  offset?: number;
  fromDate?: Date;
  toDate?: Date;
}

export interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  mostUsedTags: Array<{ tag: string; count: number }>;
  conversationsByDate: Array<{ date: string; count: number }>;
}

// Storage configuration
export interface StorageConfig {
  provider: 'supabase' | 'firebase' | 'mongodb' | 'postgresql' | 'localStorage';
  connectionString?: string;
  apiKey?: string;
  projectId?: string;
  options?: Record<string, any>;
}

// Storage manager class
export class StorageManager {
  private provider: StorageProvider;

  constructor(config: StorageConfig) {
    this.provider = this.createProvider(config);
  }

  private createProvider(config: StorageConfig): StorageProvider {
    switch (config.provider) {
      case 'supabase':
        const { SupabaseProvider } = require('./providers/supabase');
        return new SupabaseProvider(config);
      case 'firebase':
        const { FirebaseProvider } = require('./providers/firebase');
        return new FirebaseProvider(config);
      case 'mongodb':
        const { MongoDBProvider } = require('./providers/mongodb');
        return new MongoDBProvider(config);
      case 'postgresql':
        const { PostgreSQLProvider } = require('./providers/postgresql');
        return new PostgreSQLProvider(config);
      case 'localStorage':
        const { LocalStorageProvider } = require('./providers/localStorage');
        return new LocalStorageProvider(config);
      default:
        throw new Error(`Unsupported storage provider: ${config.provider}`);
    }
  }

  // Delegate all methods to the provider
  async saveConversation(conversation: Conversation): Promise<string> {
    return this.provider.saveConversation(conversation);
  }

  async getConversation(id: string): Promise<Conversation | null> {
    return this.provider.getConversation(id);
  }

  async listConversations(userId: string, options?: ListOptions): Promise<Conversation[]> {
    return this.provider.listConversations(userId, options);
  }

  async deleteConversation(id: string): Promise<void> {
    return this.provider.deleteConversation(id);
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<void> {
    return this.provider.updateConversation(id, updates);
  }

  async saveMessage(conversationId: string, message: Message): Promise<string> {
    return this.provider.saveMessage(conversationId, message);
  }

  async getMessages(conversationId: string, options?: MessageOptions): Promise<Message[]> {
    return this.provider.getMessages(conversationId, options);
  }

  async deleteMessage(messageId: string): Promise<void> {
    return this.provider.deleteMessage(messageId);
  }

  async updateMessage(messageId: string, updates: Partial<Message>): Promise<void> {
    return this.provider.updateMessage(messageId, updates);
  }

  async searchConversations(userId: string, query: string): Promise<Conversation[]> {
    return this.provider.searchConversations(userId, query);
  }

  async getConversationStats(userId: string): Promise<ConversationStats> {
    return this.provider.getConversationStats(userId);
  }
}

// Vue plugin
export const ChatbotStoragePlugin = {
  install(app: App, config: StorageConfig) {
    const storageManager = new StorageManager(config);
    app.provide('chatbotStorage', storageManager);
    app.config.globalProperties.$chatbotStorage = storageManager;
  }
};

// Composable for using storage in components
export function useChatbotStorage(): StorageManager {
  const { inject } = require('vue');
  const storage = inject('chatbotStorage');
  if (!storage) {
    throw new Error('ChatbotStoragePlugin must be installed before using useChatbotStorage');
  }
  return storage;
}

// Export default
export default {
  StorageManager,
  ChatbotStoragePlugin,
  useChatbotStorage
};
