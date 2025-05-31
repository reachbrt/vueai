import { ref, computed, Ref, ComputedRef } from 'vue';
import { AIClient } from '@aivue/core';
import type { AnalyticsEvent, ConversationAnalytics } from '../types';

export interface ConversationData {
  id: string;
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  topic?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  quality?: number; // 1-5 rating
}

export interface UseConversationAnalyticsOptions {
  aiClient?: AIClient;
  autoAnalyze?: boolean;
  batchSize?: number;
}

export interface UseConversationAnalyticsReturn {
  conversations: Ref<ConversationData[]>;
  analytics: ComputedRef<ConversationAnalytics>;
  isAnalyzing: Ref<boolean>;

  // Methods
  addConversation: (conversation: ConversationData) => void;
  analyzeConversation: (conversationId: string) => Promise<void>;
  analyzeAllConversations: () => Promise<void>;
  getConversationsByTopic: (topic: string) => ConversationData[];
  getConversationsBySentiment: (sentiment: string) => ConversationData[];
  exportConversations: (format: 'json' | 'csv') => string;
  clearConversations: () => void;
}

export function useConversationAnalytics(
  options: UseConversationAnalyticsOptions = {}
): UseConversationAnalyticsReturn {
  const conversations = ref<ConversationData[]>([]);
  const isAnalyzing = ref(false);

  const { aiClient, autoAnalyze = false, batchSize = 10 } = options;

  // Computed analytics
  const analytics = computed((): ConversationAnalytics => {
    const convs = conversations.value;

    if (convs.length === 0) {
      return {
        totalConversations: 0,
        averageLength: 0,
        topTopics: [],
        sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
        responseQuality: { average: 0, distribution: {} }
      };
    }

    // Calculate average conversation length
    const totalMessages = convs.reduce((sum, conv) => sum + conv.messages.length, 0);
    const averageLength = totalMessages / convs.length;

    // Topic analysis
    const topicCounts = convs.reduce((acc, conv) => {
      if (conv.topic) {
        acc[conv.topic] = (acc[conv.topic] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topTopics = Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));

    // Sentiment distribution
    const sentimentCounts = convs.reduce((acc, conv) => {
      if (conv.sentiment) {
        acc[conv.sentiment] = (acc[conv.sentiment] || 0) + 1;
      }
      return acc;
    }, { positive: 0, neutral: 0, negative: 0 });

    const total = convs.length;
    const sentimentDistribution = {
      positive: total > 0 ? sentimentCounts.positive / total : 0,
      neutral: total > 0 ? sentimentCounts.neutral / total : 0,
      negative: total > 0 ? sentimentCounts.negative / total : 0
    };

    // Quality analysis
    const qualityRatings = convs.filter(conv => conv.quality).map(conv => conv.quality!);
    const averageQuality = qualityRatings.length > 0
      ? qualityRatings.reduce((sum, rating) => sum + rating, 0) / qualityRatings.length
      : 0;

    const qualityDistribution = qualityRatings.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalConversations: convs.length,
      averageLength,
      topTopics,
      sentimentDistribution,
      responseQuality: {
        average: averageQuality,
        distribution: qualityDistribution
      }
    };
  });

  // Add conversation
  const addConversation = (conversation: ConversationData): void => {
    conversations.value.push(conversation);

    if (autoAnalyze && aiClient) {
      analyzeConversation(conversation.id);
    }
  };

  // Analyze single conversation
  const analyzeConversation = async (conversationId: string): Promise<void> => {
    if (!aiClient) {
      console.warn('AI client is required for conversation analysis');
      return;
    }

    const conversation = conversations.value.find(conv => conv.id === conversationId);
    if (!conversation) return;

    isAnalyzing.value = true;

    try {
      // Prepare conversation text for analysis
      const conversationText = conversation.messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Analyze topic
      const topicPrompt = `Analyze the following conversation and identify the main topic in 1-3 words:

${conversationText}

Topic:`;

      const topicResponse = await aiClient.complete(topicPrompt, { maxTokens: 10 });
      const topicText = typeof topicResponse === 'string' ? topicResponse : topicResponse.text || '';
      conversation.topic = topicText.trim().toLowerCase();

      // Analyze sentiment
      const sentimentPrompt = `Analyze the overall sentiment of this conversation. Respond with only one word: positive, neutral, or negative.

${conversationText}

Sentiment:`;

      const sentimentResponse = await aiClient.complete(sentimentPrompt, { maxTokens: 5 });
      const sentimentText = typeof sentimentResponse === 'string' ? sentimentResponse : sentimentResponse.text || '';
      const sentiment = sentimentText.trim().toLowerCase();

      if (['positive', 'neutral', 'negative'].includes(sentiment)) {
        conversation.sentiment = sentiment as 'positive' | 'neutral' | 'negative';
      }

      // Analyze quality (1-5 rating)
      const qualityPrompt = `Rate the quality of the AI responses in this conversation on a scale of 1-5, where:
1 = Very poor (unhelpful, incorrect, or irrelevant)
2 = Poor (somewhat unhelpful or partially incorrect)
3 = Average (adequate but could be better)
4 = Good (helpful and mostly accurate)
5 = Excellent (very helpful, accurate, and well-structured)

${conversationText}

Rating (1-5):`;

      const qualityResponse = await aiClient.complete(qualityPrompt, { maxTokens: 5 });
      const qualityText = typeof qualityResponse === 'string' ? qualityResponse : qualityResponse.text || '';
      const quality = parseInt(qualityText.trim());

      if (quality >= 1 && quality <= 5) {
        conversation.quality = quality;
      }

    } catch (error) {
      console.error('Failed to analyze conversation:', error);
    } finally {
      isAnalyzing.value = false;
    }
  };

  // Analyze all conversations
  const analyzeAllConversations = async (): Promise<void> => {
    if (!aiClient) {
      console.warn('AI client is required for conversation analysis');
      return;
    }

    isAnalyzing.value = true;

    try {
      const unanalyzedConversations = conversations.value.filter(
        conv => !conv.topic || !conv.sentiment || !conv.quality
      );

      // Process in batches to avoid overwhelming the API
      for (let i = 0; i < unanalyzedConversations.length; i += batchSize) {
        const batch = unanalyzedConversations.slice(i, i + batchSize);

        await Promise.all(
          batch.map(conv => analyzeConversation(conv.id))
        );

        // Small delay between batches
        if (i + batchSize < unanalyzedConversations.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Failed to analyze conversations:', error);
    } finally {
      isAnalyzing.value = false;
    }
  };

  // Filter conversations by topic
  const getConversationsByTopic = (topic: string): ConversationData[] => {
    return conversations.value.filter(conv =>
      conv.topic?.toLowerCase().includes(topic.toLowerCase())
    );
  };

  // Filter conversations by sentiment
  const getConversationsBySentiment = (sentiment: string): ConversationData[] => {
    return conversations.value.filter(conv => conv.sentiment === sentiment);
  };

  // Export conversations
  const exportConversations = (format: 'json' | 'csv'): string => {
    if (format === 'json') {
      return JSON.stringify(conversations.value, null, 2);
    } else {
      // CSV export
      const headers = [
        'id', 'sessionId', 'startTime', 'endTime', 'duration',
        'messageCount', 'topic', 'sentiment', 'quality'
      ];

      const rows = conversations.value.map(conv => [
        conv.id,
        conv.sessionId,
        conv.startTime.toISOString(),
        conv.endTime?.toISOString() || '',
        conv.duration || '',
        conv.messages.length,
        conv.topic || '',
        conv.sentiment || '',
        conv.quality || ''
      ]);

      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  };

  // Clear conversations
  const clearConversations = (): void => {
    conversations.value = [];
  };

  // Helper function to create conversation from events
  const createConversationFromEvents = (events: AnalyticsEvent[]): ConversationData[] => {
    const conversationMap = new Map<string, ConversationData>();

    events
      .filter(event => event.type === 'ai_request' || event.type === 'ai_response')
      .forEach(event => {
        const sessionId = event.sessionId;

        if (!conversationMap.has(sessionId)) {
          conversationMap.set(sessionId, {
            id: `conv_${sessionId}`,
            sessionId,
            messages: [],
            startTime: event.timestamp
          });
        }

        const conversation = conversationMap.get(sessionId)!;

        if (event.type === 'ai_request') {
          conversation.messages.push({
            role: 'user',
            content: event.data.prompt,
            timestamp: event.timestamp
          });
        } else if (event.type === 'ai_response') {
          conversation.messages.push({
            role: 'assistant',
            content: event.data.response,
            timestamp: event.timestamp
          });
          conversation.endTime = event.timestamp;
        }
      });

    // Calculate durations
    conversationMap.forEach(conversation => {
      if (conversation.endTime) {
        conversation.duration = conversation.endTime.getTime() - conversation.startTime.getTime();
      }
    });

    return Array.from(conversationMap.values());
  };

  return {
    conversations,
    analytics,
    isAnalyzing,
    addConversation,
    analyzeConversation,
    analyzeAllConversations,
    getConversationsByTopic,
    getConversationsBySentiment,
    exportConversations,
    clearConversations
  };
}
