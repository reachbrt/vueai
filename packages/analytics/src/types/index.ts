// Analytics types for @aivue/analytics

export interface AnalyticsEvent {
  id: string;
  type: 'interaction' | 'ai_request' | 'ai_response' | 'error' | 'performance';
  timestamp: Date;
  userId?: string;
  sessionId: string;
  component: string;
  data: Record<string, any>;
}

export interface InteractionEvent extends AnalyticsEvent {
  type: 'interaction';
  data: {
    action: string;
    element: string;
    value?: any;
    duration?: number;
  };
}

export interface AIRequestEvent extends AnalyticsEvent {
  type: 'ai_request';
  data: {
    provider: string;
    model: string;
    prompt: string;
    tokens?: number;
    requestId: string;
  };
}

export interface AIResponseEvent extends AnalyticsEvent {
  type: 'ai_response';
  data: {
    provider: string;
    model: string;
    response: string;
    tokens?: number;
    responseTime: number;
    requestId: string;
    quality?: number; // 1-5 rating
  };
}

export interface ErrorEvent extends AnalyticsEvent {
  type: 'error';
  data: {
    error: string;
    stack?: string;
    context?: Record<string, any>;
  };
}

export interface PerformanceEvent extends AnalyticsEvent {
  type: 'performance';
  data: {
    metric: string;
    value: number;
    unit: string;
  };
}

export interface AnalyticsMetrics {
  totalInteractions: number;
  totalAIRequests: number;
  averageResponseTime: number;
  errorRate: number;
  topComponents: Array<{ component: string; count: number }>;
  topProviders: Array<{ provider: string; count: number }>;
  userSatisfaction: number;
  tokenUsage: {
    total: number;
    byProvider: Record<string, number>;
  };
}

export interface ConversationAnalytics {
  totalConversations: number;
  averageLength: number;
  topTopics: Array<{ topic: string; count: number }>;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  responseQuality: {
    average: number;
    distribution: Record<number, number>;
  };
}

export interface UsageInsights {
  peakHours: Array<{ hour: number; count: number }>;
  dailyTrends: Array<{ date: string; count: number }>;
  componentPopularity: Array<{ component: string; usage: number }>;
  userEngagement: {
    newUsers: number;
    returningUsers: number;
    averageSessionDuration: number;
  };
}

export interface AnalyticsConfig {
  enabled: boolean;
  trackInteractions: boolean;
  trackAIRequests: boolean;
  trackPerformance: boolean;
  trackErrors: boolean;
  sampleRate: number; // 0-1, percentage of events to track
  storage: 'localStorage' | 'sessionStorage' | 'memory' | 'custom';
  customStorage?: {
    save: (events: AnalyticsEvent[]) => Promise<void>;
    load: () => Promise<AnalyticsEvent[]>;
    clear: () => Promise<void>;
  };
  onEvent?: (event: AnalyticsEvent) => void;
  batchSize: number;
  flushInterval: number; // milliseconds
}

export interface AnalyticsFilter {
  dateRange?: {
    start: Date;
    end: Date;
  };
  component?: string;
  eventType?: AnalyticsEvent['type'];
  userId?: string;
  sessionId?: string;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'custom';
  size: 'small' | 'medium' | 'large';
  data: any;
  config?: Record<string, any>;
}
