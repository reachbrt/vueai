import { ref, reactive, computed, onMounted, onUnmounted, Ref, ComputedRef } from 'vue';
import { AIClient } from '@aivue/core';
import type {
  AnalyticsEvent,
  AnalyticsConfig,
  AnalyticsMetrics,
  AnalyticsFilter,
  InteractionEvent,
  AIRequestEvent,
  AIResponseEvent,
  ErrorEvent,
  PerformanceEvent
} from '../types';

export interface UseAnalyticsOptions {
  config?: Partial<AnalyticsConfig>;
  aiClient?: AIClient;
}

export interface UseAnalyticsReturn {
  events: Ref<AnalyticsEvent[]>;
  metrics: ComputedRef<AnalyticsMetrics>;
  isTracking: Ref<boolean>;
  config: Ref<AnalyticsConfig>;

  // Event tracking methods
  trackInteraction: (component: string, action: string, data?: any) => void;
  trackAIRequest: (provider: string, model: string, prompt: string, requestId: string) => void;
  trackAIResponse: (provider: string, model: string, response: string, responseTime: number, requestId: string) => void;
  trackError: (error: Error, context?: any) => void;
  trackPerformance: (metric: string, value: number, unit: string) => void;

  // Analytics methods
  getFilteredEvents: (filter: AnalyticsFilter) => AnalyticsEvent[];
  exportData: (format: 'json' | 'csv') => string;
  clearData: () => void;
  generateInsights: () => Promise<string>;

  // Control methods
  startTracking: () => void;
  stopTracking: () => void;
  flush: () => Promise<void>;
}

const defaultConfig: AnalyticsConfig = {
  enabled: true,
  trackInteractions: true,
  trackAIRequests: true,
  trackPerformance: true,
  trackErrors: true,
  sampleRate: 1.0,
  storage: 'localStorage',
  batchSize: 50,
  flushInterval: 30000 // 30 seconds
};

export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const events = ref<AnalyticsEvent[]>([]);
  const isTracking = ref(false);
  const config = ref<AnalyticsConfig>({ ...defaultConfig, ...options.config });

  let sessionId = '';
  let flushTimer: NodeJS.Timeout | null = null;
  let eventQueue: AnalyticsEvent[] = [];

  // Generate session ID
  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Generate event ID
  const generateEventId = (): string => {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Storage helpers
  const saveToStorage = async (eventsToSave: AnalyticsEvent[]): Promise<void> => {
    if (config.value.storage === 'custom' && config.value.customStorage) {
      await config.value.customStorage.save(eventsToSave);
    } else if (config.value.storage === 'localStorage') {
      const existing = JSON.parse(localStorage.getItem('aivue_analytics') || '[]');
      localStorage.setItem('aivue_analytics', JSON.stringify([...existing, ...eventsToSave]));
    } else if (config.value.storage === 'sessionStorage') {
      const existing = JSON.parse(sessionStorage.getItem('aivue_analytics') || '[]');
      sessionStorage.setItem('aivue_analytics', JSON.stringify([...existing, ...eventsToSave]));
    }
    // 'memory' storage doesn't persist
  };

  const loadFromStorage = async (): Promise<AnalyticsEvent[]> => {
    if (config.value.storage === 'custom' && config.value.customStorage) {
      return await config.value.customStorage.load();
    } else if (config.value.storage === 'localStorage') {
      return JSON.parse(localStorage.getItem('aivue_analytics') || '[]');
    } else if (config.value.storage === 'sessionStorage') {
      return JSON.parse(sessionStorage.getItem('aivue_analytics') || '[]');
    }
    return [];
  };

  // Add event to queue
  const addEvent = (event: AnalyticsEvent): void => {
    if (!config.value.enabled || !isTracking.value) return;

    // Sample rate check
    if (Math.random() > config.value.sampleRate) return;

    eventQueue.push(event);
    events.value.push(event);

    // Call onEvent callback if provided
    if (config.value.onEvent) {
      config.value.onEvent(event);
    }

    // Auto-flush if batch size reached
    if (eventQueue.length >= config.value.batchSize) {
      flush();
    }
  };

  // Flush events to storage
  const flush = async (): Promise<void> => {
    if (eventQueue.length === 0) return;

    try {
      await saveToStorage([...eventQueue]);
      eventQueue = [];
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
    }
  };

  // Event tracking methods
  const trackInteraction = (component: string, action: string, data: any = {}): void => {
    const event: InteractionEvent = {
      id: generateEventId(),
      type: 'interaction',
      timestamp: new Date(),
      sessionId,
      component,
      data: {
        action,
        element: data.element || 'unknown',
        value: data.value,
        duration: data.duration
      }
    };
    addEvent(event);
  };

  const trackAIRequest = (provider: string, model: string, prompt: string, requestId: string): void => {
    const event: AIRequestEvent = {
      id: generateEventId(),
      type: 'ai_request',
      timestamp: new Date(),
      sessionId,
      component: 'ai_client',
      data: {
        provider,
        model,
        prompt,
        requestId
      }
    };
    addEvent(event);
  };

  const trackAIResponse = (provider: string, model: string, response: string, responseTime: number, requestId: string): void => {
    const event: AIResponseEvent = {
      id: generateEventId(),
      type: 'ai_response',
      timestamp: new Date(),
      sessionId,
      component: 'ai_client',
      data: {
        provider,
        model,
        response,
        responseTime,
        requestId
      }
    };
    addEvent(event);
  };

  const trackError = (error: Error, context: any = {}): void => {
    const event: ErrorEvent = {
      id: generateEventId(),
      type: 'error',
      timestamp: new Date(),
      sessionId,
      component: context.component || 'unknown',
      data: {
        error: error.message,
        stack: error.stack,
        context
      }
    };
    addEvent(event);
  };

  const trackPerformance = (metric: string, value: number, unit: string): void => {
    const event: PerformanceEvent = {
      id: generateEventId(),
      type: 'performance',
      timestamp: new Date(),
      sessionId,
      component: 'performance',
      data: {
        metric,
        value,
        unit
      }
    };
    addEvent(event);
  };

  // Computed metrics
  const metrics = computed((): AnalyticsMetrics => {
    const allEvents = events.value;
    const interactions = allEvents.filter(e => e.type === 'interaction');
    const aiRequests = allEvents.filter(e => e.type === 'ai_request');
    const aiResponses = allEvents.filter(e => e.type === 'ai_response');
    const errors = allEvents.filter(e => e.type === 'error');

    const averageResponseTime = aiResponses.length > 0
      ? aiResponses.reduce((sum, e) => sum + (e.data.responseTime || 0), 0) / aiResponses.length
      : 0;

    const errorRate = allEvents.length > 0 ? errors.length / allEvents.length : 0;

    // Component usage
    const componentCounts = allEvents.reduce((acc, event) => {
      acc[event.component] = (acc[event.component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topComponents = Object.entries(componentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([component, count]) => ({ component, count }));

    // Provider usage
    const providerCounts = aiRequests.reduce((acc, event) => {
      const provider = event.data.provider;
      acc[provider] = (acc[provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topProviders = Object.entries(providerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([provider, count]) => ({ provider, count }));

    return {
      totalInteractions: interactions.length,
      totalAIRequests: aiRequests.length,
      averageResponseTime,
      errorRate,
      topComponents,
      topProviders,
      userSatisfaction: 4.2, // This would be calculated from user feedback
      tokenUsage: {
        total: aiRequests.reduce((sum, e) => sum + (e.data.tokens || 0), 0),
        byProvider: providerCounts
      }
    };
  });

  // Filter events
  const getFilteredEvents = (filter: AnalyticsFilter): AnalyticsEvent[] => {
    return events.value.filter(event => {
      if (filter.dateRange) {
        const eventDate = new Date(event.timestamp);
        if (eventDate < filter.dateRange.start || eventDate > filter.dateRange.end) {
          return false;
        }
      }
      if (filter.component && event.component !== filter.component) return false;
      if (filter.eventType && event.type !== filter.eventType) return false;
      if (filter.userId && event.userId !== filter.userId) return false;
      if (filter.sessionId && event.sessionId !== filter.sessionId) return false;
      return true;
    });
  };

  // Export data
  const exportData = (format: 'json' | 'csv'): string => {
    if (format === 'json') {
      return JSON.stringify(events.value, null, 2);
    } else {
      // CSV export
      const headers = ['id', 'type', 'timestamp', 'sessionId', 'component', 'data'];
      const rows = events.value.map(event => [
        event.id,
        event.type,
        event.timestamp.toISOString(),
        event.sessionId,
        event.component,
        JSON.stringify(event.data)
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  };

  // Clear data
  const clearData = (): void => {
    events.value = [];
    eventQueue = [];
    if (config.value.storage === 'localStorage') {
      localStorage.removeItem('aivue_analytics');
    } else if (config.value.storage === 'sessionStorage') {
      sessionStorage.removeItem('aivue_analytics');
    }
  };

  // Generate AI insights
  const generateInsights = async (): Promise<string> => {
    if (!options.aiClient) {
      throw new Error('AI client is required for generating insights');
    }

    const metricsData = metrics.value;
    const prompt = `Analyze the following analytics data and provide insights:

    Total Interactions: ${metricsData.totalInteractions}
    Total AI Requests: ${metricsData.totalAIRequests}
    Average Response Time: ${metricsData.averageResponseTime}ms
    Error Rate: ${(metricsData.errorRate * 100).toFixed(2)}%
    Top Components: ${metricsData.topComponents.map(c => `${c.component} (${c.count})`).join(', ')}

    Please provide actionable insights and recommendations for improving the user experience.`;

    const response = await options.aiClient.complete(prompt);
    return typeof response === 'string' ? response : response.text || JSON.stringify(response);
  };

  // Control methods
  const startTracking = (): void => {
    isTracking.value = true;
    sessionId = generateSessionId();

    // Set up flush timer
    if (flushTimer) clearInterval(flushTimer);
    flushTimer = setInterval(flush, config.value.flushInterval);
  };

  const stopTracking = (): void => {
    isTracking.value = false;
    if (flushTimer) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
    flush(); // Final flush
  };

  // Load existing data on mount
  onMounted(async () => {
    try {
      const existingEvents = await loadFromStorage();
      events.value = existingEvents;
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }

    if (config.value.enabled) {
      startTracking();
    }
  });

  // Cleanup on unmount
  onUnmounted(() => {
    stopTracking();
  });

  return {
    events,
    metrics,
    isTracking,
    config,
    trackInteraction,
    trackAIRequest,
    trackAIResponse,
    trackError,
    trackPerformance,
    getFilteredEvents,
    exportData,
    clearData,
    generateInsights,
    startTracking,
    stopTracking,
    flush
  };
}
