// Optional storage utilities for enhanced chatbot features
// These are only used if storage options are provided in ChatOptions

import { Message, Conversation, Thread } from '../composables/useChatEngine';

// Storage interface - can be implemented by different providers
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

// Simple localStorage implementation (default fallback)
export class LocalStorageProvider implements StorageProvider {
  private prefix: string;

  constructor(prefix = 'aivue_chat_') {
    this.prefix = prefix;
  }

  async saveConversation(conversation: Conversation): Promise<string> {
    const key = `${this.prefix}conversation_${conversation.id}`;
    localStorage.setItem(key, JSON.stringify(conversation));
    return conversation.id;
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const key = `${this.prefix}conversation_${id}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async listConversations(userId: string, options: ListOptions = {}): Promise<Conversation[]> {
    const conversations: Conversation[] = [];
    const prefix = `${this.prefix}conversation_`;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        const data = localStorage.getItem(key);
        if (data) {
          const conversation: Conversation = JSON.parse(data);
          if (conversation.userId === userId) {
            conversations.push(conversation);
          }
        }
      }
    }

    // Apply sorting and filtering
    let filtered = conversations;
    if (!options.includeArchived) {
      filtered = filtered.filter(c => !c.isArchived);
    }
    if (options.tags?.length) {
      filtered = filtered.filter(c => 
        options.tags!.some(tag => c.tags.includes(tag))
      );
    }

    // Sort
    const sortBy = options.sortBy || 'updatedAt';
    const sortOrder = options.sortOrder || 'desc';
    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    return filtered.slice(offset, offset + limit);
  }

  async deleteConversation(id: string): Promise<void> {
    const key = `${this.prefix}conversation_${id}`;
    localStorage.removeItem(key);
    
    // Also delete associated messages
    const messagePrefix = `${this.prefix}message_${id}_`;
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(messagePrefix)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => localStorage.removeItem(key));
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<void> {
    const conversation = await this.getConversation(id);
    if (conversation) {
      Object.assign(conversation, updates);
      conversation.updatedAt = new Date();
      await this.saveConversation(conversation);
    }
  }

  async saveMessage(conversationId: string, message: Message): Promise<string> {
    const messageId = message.id || `msg_${Date.now()}_${Math.random()}`;
    const key = `${this.prefix}message_${conversationId}_${messageId}`;
    const messageWithId = { ...message, id: messageId, conversationId };
    localStorage.setItem(key, JSON.stringify(messageWithId));
    return messageId;
  }

  async getMessages(conversationId: string, options: MessageOptions = {}): Promise<Message[]> {
    const messages: Message[] = [];
    const prefix = `${this.prefix}message_${conversationId}_`;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        const data = localStorage.getItem(key);
        if (data) {
          const message: Message = JSON.parse(data);
          messages.push(message);
        }
      }
    }

    // Sort by timestamp
    messages.sort((a, b) => {
      const aTime = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const bTime = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return aTime - bTime;
    });

    // Apply date filtering
    let filtered = messages;
    if (options.fromDate) {
      filtered = filtered.filter(m => 
        m.timestamp && new Date(m.timestamp) >= options.fromDate!
      );
    }
    if (options.toDate) {
      filtered = filtered.filter(m => 
        m.timestamp && new Date(m.timestamp) <= options.toDate!
      );
    }

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 100;
    return filtered.slice(offset, offset + limit);
  }

  async deleteMessage(messageId: string): Promise<void> {
    // Find and delete the message
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes(`_${messageId}`)) {
        localStorage.removeItem(key);
        break;
      }
    }
  }

  async updateMessage(messageId: string, updates: Partial<Message>): Promise<void> {
    // Find the message and update it
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.includes(`_${messageId}`)) {
        const data = localStorage.getItem(key);
        if (data) {
          const message = JSON.parse(data);
          Object.assign(message, updates);
          message.edited = true;
          message.editedAt = new Date();
          localStorage.setItem(key, JSON.stringify(message));
        }
        break;
      }
    }
  }

  async searchConversations(userId: string, query: string): Promise<Conversation[]> {
    const conversations = await this.listConversations(userId);
    const lowerQuery = query.toLowerCase();
    
    return conversations.filter(conversation => 
      conversation.title.toLowerCase().includes(lowerQuery) ||
      conversation.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getConversationStats(userId: string): Promise<ConversationStats> {
    const conversations = await this.listConversations(userId, { includeArchived: true });
    
    let totalMessages = 0;
    const tagCounts: Record<string, number> = {};
    const dateGroups: Record<string, number> = {};

    for (const conversation of conversations) {
      totalMessages += conversation.messageCount;
      
      // Count tags
      conversation.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
      
      // Group by date
      const dateKey = conversation.createdAt.toISOString().split('T')[0];
      dateGroups[dateKey] = (dateGroups[dateKey] || 0) + 1;
    }

    const mostUsedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const conversationsByDate = Object.entries(dateGroups)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalConversations: conversations.length,
      totalMessages,
      averageMessagesPerConversation: conversations.length > 0 ? totalMessages / conversations.length : 0,
      mostUsedTags,
      conversationsByDate
    };
  }
}

// Factory function to create storage provider
export function createStorageProvider(config: any): StorageProvider {
  // For now, we'll just use localStorage
  // In the future, we can add Supabase, Firebase, etc.
  return new LocalStorageProvider();
}

// Utility functions for storage operations
export const storageUtils = {
  generateConversationId: () => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  generateThreadId: () => `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  generateMessageId: () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  createConversation: (userId: string, title: string, threadId?: string): Conversation => ({
    id: storageUtils.generateConversationId(),
    userId,
    title,
    threadId,
    tags: [],
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    messageCount: 0,
    isArchived: false,
    isShared: false
  }),
  
  createThread: (title: string): Thread => ({
    id: storageUtils.generateThreadId(),
    title,
    conversationIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: []
  })
};
