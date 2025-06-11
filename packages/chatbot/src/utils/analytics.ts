// Optional analytics utilities for enhanced chatbot features
// These are only used if analytics options are provided in ChatOptions

import { Message, Conversation } from '../composables/useChatEngine';

export interface AnalyticsConfig {
  enabled?: boolean;
  trackUserSentiment?: boolean;
  trackUsageMetrics?: boolean;
  exportReports?: boolean;
  apiKey?: string;
  endpoint?: string;
}

export interface AnalyticsEvent {
  type: 'message_sent' | 'message_received' | 'conversation_started' | 'conversation_ended' | 'error_occurred';
  timestamp: Date;
  userId?: string;
  conversationId?: string;
  messageId?: string;
  data: Record<string, any>;
}

export interface UsageMetrics {
  totalMessages: number;
  totalConversations: number;
  averageResponseTime: number;
  userSatisfactionScore: number;
  mostUsedFeatures: Array<{ feature: string; count: number }>;
  errorRate: number;
  peakUsageHours: Array<{ hour: number; count: number }>;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: Array<{ emotion: string; score: number }>;
}

export interface ConversationInsights {
  duration: number; // in minutes
  messageCount: number;
  userEngagement: number; // 0-1 score
  topicsDiscussed: string[];
  sentimentTrend: Array<{ timestamp: Date; sentiment: number }>;
  satisfactionScore?: number;
}

// Analytics provider interface
export interface AnalyticsProvider {
  trackEvent(event: AnalyticsEvent): Promise<void>;
  analyzeSentiment(text: string): Promise<SentimentAnalysis>;
  getUsageMetrics(userId: string, timeRange?: TimeRange): Promise<UsageMetrics>;
  getConversationInsights(conversationId: string): Promise<ConversationInsights>;
  exportReport(userId: string, format: 'json' | 'csv' | 'pdf'): Promise<Blob>;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

// Simple analytics provider using localStorage and basic sentiment analysis
export class SimpleAnalyticsProvider implements AnalyticsProvider {
  private config: AnalyticsConfig;
  private events: AnalyticsEvent[] = [];

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.loadEvents();
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem('aivue_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading analytics events:', error);
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem('aivue_analytics_events', JSON.stringify(this.events));
    } catch (error) {
      console.error('Error saving analytics events:', error);
    }
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.config.enabled) return;

    this.events.push(event);
    this.saveEvents();

    // Keep only last 1000 events to prevent storage bloat
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
      this.saveEvents();
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    if (!this.config.trackUserSentiment) {
      return {
        sentiment: 'neutral',
        confidence: 0,
        emotions: []
      };
    }

    // Simple rule-based sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'pleased', 'satisfied', 'thank'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'sad', 'upset', 'problem'];

    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });

    let sentiment: 'positive' | 'negative' | 'neutral';
    let confidence: number;

    if (positiveScore > negativeScore) {
      sentiment = 'positive';
      confidence = Math.min(positiveScore / words.length * 10, 1);
    } else if (negativeScore > positiveScore) {
      sentiment = 'negative';
      confidence = Math.min(negativeScore / words.length * 10, 1);
    } else {
      sentiment = 'neutral';
      confidence = 0.5;
    }

    return {
      sentiment,
      confidence,
      emotions: [
        { emotion: 'joy', score: positiveScore / words.length },
        { emotion: 'anger', score: negativeScore / words.length }
      ]
    };
  }

  async getUsageMetrics(userId: string, timeRange?: TimeRange): Promise<UsageMetrics> {
    const userEvents = this.events.filter(event => 
      event.userId === userId &&
      (!timeRange || (event.timestamp >= timeRange.start && event.timestamp <= timeRange.end))
    );

    const messageEvents = userEvents.filter(e => e.type === 'message_sent' || e.type === 'message_received');
    const conversationEvents = userEvents.filter(e => e.type === 'conversation_started');
    const errorEvents = userEvents.filter(e => e.type === 'error_occurred');

    // Calculate response times
    const responseTimes: number[] = [];
    for (let i = 0; i < messageEvents.length - 1; i++) {
      const current = messageEvents[i];
      const next = messageEvents[i + 1];
      if (current.type === 'message_sent' && next.type === 'message_received') {
        const responseTime = new Date(next.timestamp).getTime() - new Date(current.timestamp).getTime();
        responseTimes.push(responseTime);
      }
    }

    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000 // Convert to seconds
      : 0;

    // Calculate peak usage hours
    const hourCounts: Record<number, number> = {};
    messageEvents.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakUsageHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalMessages: messageEvents.length,
      totalConversations: conversationEvents.length,
      averageResponseTime,
      userSatisfactionScore: 0.8, // Placeholder
      mostUsedFeatures: [
        { feature: 'text_chat', count: messageEvents.length },
        { feature: 'voice_input', count: 0 }, // Placeholder
        { feature: 'file_upload', count: 0 } // Placeholder
      ],
      errorRate: errorEvents.length / Math.max(messageEvents.length, 1),
      peakUsageHours
    };
  }

  async getConversationInsights(conversationId: string): Promise<ConversationInsights> {
    const conversationEvents = this.events.filter(e => e.conversationId === conversationId);
    
    if (conversationEvents.length === 0) {
      return {
        duration: 0,
        messageCount: 0,
        userEngagement: 0,
        topicsDiscussed: [],
        sentimentTrend: []
      };
    }

    const startTime = new Date(Math.min(...conversationEvents.map(e => new Date(e.timestamp).getTime())));
    const endTime = new Date(Math.max(...conversationEvents.map(e => new Date(e.timestamp).getTime())));
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes

    const messageEvents = conversationEvents.filter(e => e.type === 'message_sent' || e.type === 'message_received');
    
    // Simple engagement calculation based on message frequency
    const userEngagement = Math.min(messageEvents.length / duration * 2, 1); // 2 messages per minute = full engagement

    return {
      duration,
      messageCount: messageEvents.length,
      userEngagement,
      topicsDiscussed: [], // Would need NLP for topic extraction
      sentimentTrend: [], // Would need sentiment analysis of messages
      satisfactionScore: undefined
    };
  }

  async exportReport(userId: string, format: 'json' | 'csv' | 'pdf'): Promise<Blob> {
    const metrics = await this.getUsageMetrics(userId);
    
    if (format === 'json') {
      return new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
    } else if (format === 'csv') {
      const csv = this.convertToCSV(metrics);
      return new Blob([csv], { type: 'text/csv' });
    } else {
      throw new Error('PDF export not implemented in simple provider');
    }
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion
    const headers = Object.keys(data).join(',');
    const values = Object.values(data).map(v => 
      typeof v === 'object' ? JSON.stringify(v) : v
    ).join(',');
    return `${headers}\n${values}`;
  }
}

// Factory function to create analytics provider
export function createAnalyticsProvider(config: AnalyticsConfig): AnalyticsProvider {
  // For now, we'll use the simple provider
  // In the future, we can add integrations with Google Analytics, Mixpanel, etc.
  return new SimpleAnalyticsProvider(config);
}

// Analytics utilities
export const analyticsUtils = {
  // Track common events
  trackMessageSent: (provider: AnalyticsProvider, message: Message) => {
    provider.trackEvent({
      type: 'message_sent',
      timestamp: new Date(),
      userId: message.userId,
      conversationId: message.conversationId,
      messageId: message.id,
      data: {
        messageLength: message.content.length,
        hasAttachments: message.attachments && message.attachments.length > 0
      }
    });
  },

  trackMessageReceived: (provider: AnalyticsProvider, message: Message, responseTime?: number) => {
    provider.trackEvent({
      type: 'message_received',
      timestamp: new Date(),
      userId: message.userId,
      conversationId: message.conversationId,
      messageId: message.id,
      data: {
        messageLength: message.content.length,
        responseTime,
        modelUsed: message.modelUsed
      }
    });
  },

  trackConversationStarted: (provider: AnalyticsProvider, conversation: Conversation) => {
    provider.trackEvent({
      type: 'conversation_started',
      timestamp: new Date(),
      userId: conversation.userId,
      conversationId: conversation.id,
      data: {
        title: conversation.title,
        tags: conversation.tags
      }
    });
  },

  trackError: (provider: AnalyticsProvider, error: Error, context?: Record<string, any>) => {
    provider.trackEvent({
      type: 'error_occurred',
      timestamp: new Date(),
      data: {
        errorMessage: error.message,
        errorStack: error.stack,
        ...context
      }
    });
  }
};
