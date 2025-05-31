// AI-powered analytics for Vue.js applications
import { App } from 'vue';
import { AIClient } from '@aivue/core';

// Import Vue compatibility utilities from core
import {
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin
} from '@aivue/core';

// Export types
export * from './types';

// Export composables
export { useAnalytics } from './composables/useAnalytics';
export { useConversationAnalytics } from './composables/useConversationAnalytics';

// Import composables for default export
import { useAnalytics as useAnalyticsComposable } from './composables/useAnalytics';
import { useConversationAnalytics as useConversationAnalyticsComposable } from './composables/useConversationAnalytics';

// Import components
import AnalyticsDashboardComponent from './components/AnalyticsDashboard.vue';
import UsageChartComponent from './components/UsageChart.vue';
import ConversationInsightsComponent from './components/ConversationInsights.vue';

// Create compatible components
export const AnalyticsDashboard = createCompatComponent(AnalyticsDashboardComponent);
export const UsageChart = createCompatComponent(UsageChartComponent);
export const ConversationInsights = createCompatComponent(ConversationInsightsComponent);

// Export with the Ai prefix for consistency
export const AiAnalyticsDashboard = AnalyticsDashboard;
export const AiUsageChart = UsageChart;
export const AiConversationInsights = ConversationInsights;

// Analytics Plugin with compatibility layer
export const AnalyticsPlugin = createCompatPlugin({
  install(app: App, options: { aiClient?: AIClient } = {}) {
    // Register components globally using the compatibility helper
    registerCompatComponent(app, 'AnalyticsDashboard', AnalyticsDashboard);
    registerCompatComponent(app, 'AiAnalyticsDashboard', AnalyticsDashboard);
    registerCompatComponent(app, 'UsageChart', UsageChart);
    registerCompatComponent(app, 'AiUsageChart', UsageChart);
    registerCompatComponent(app, 'ConversationInsights', ConversationInsights);
    registerCompatComponent(app, 'AiConversationInsights', ConversationInsights);

    // Provide global analytics configuration
    if (options.aiClient) {
      app.provide('aiClient', options.aiClient);
    }
  }
});

// Analytics utilities
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private aiClient?: AIClient;
  private config: any = {};

  private constructor() {}

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  configure(config: { aiClient?: AIClient; [key: string]: any }): void {
    this.config = { ...this.config, ...config };
    if (config.aiClient) {
      this.aiClient = config.aiClient;
    }
  }

  getAIClient(): AIClient | undefined {
    return this.aiClient;
  }

  getConfig(): any {
    return this.config;
  }

  // Helper method to create analytics-enabled AI client wrapper
  wrapAIClient(client: AIClient): AIClient {
    const originalChat = client.chat.bind(client);
    const originalComplete = client.complete.bind(client);

    // Override chat method to track analytics
    client.chat = async (messages: any[], options: any = {}) => {
      const startTime = Date.now();
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      try {
        // Track request
        if (typeof window !== 'undefined' && (window as any).analyticsTracker) {
          (window as any).analyticsTracker.trackAIRequest(
            'unknown', // provider info not accessible
            'unknown', // model info not accessible
            JSON.stringify(messages),
            requestId
          );
        }

        const response = await originalChat(messages, options);
        const responseTime = Date.now() - startTime;

        // Track response
        if (typeof window !== 'undefined' && (window as any).analyticsTracker) {
          (window as any).analyticsTracker.trackAIResponse(
            'unknown', // provider info not accessible
            'unknown', // model info not accessible
            response,
            responseTime,
            requestId
          );
        }

        return response;
      } catch (error) {
        // Track error
        if (typeof window !== 'undefined' && (window as any).analyticsTracker) {
          (window as any).analyticsTracker.trackError(error as Error, {
            component: 'ai_client',
            requestId
          });
        }
        throw error;
      }
    };

    // Override complete method to track analytics
    client.complete = async (prompt: string, options: any = {}) => {
      const startTime = Date.now();
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      try {
        // Track request
        if (typeof window !== 'undefined' && (window as any).analyticsTracker) {
          (window as any).analyticsTracker.trackAIRequest(
            'unknown', // provider info not accessible
            'unknown', // model info not accessible
            prompt,
            requestId
          );
        }

        const response = await originalComplete(prompt, options);
        const responseTime = Date.now() - startTime;

        // Track response
        if (typeof window !== 'undefined' && (window as any).analyticsTracker) {
          (window as any).analyticsTracker.trackAIResponse(
            'unknown', // provider info not accessible
            'unknown', // model info not accessible
            response,
            responseTime,
            requestId
          );
        }

        return response;
      } catch (error) {
        // Track error
        if (typeof window !== 'undefined' && (window as any).analyticsTracker) {
          (window as any).analyticsTracker.trackError(error as Error, {
            component: 'ai_client',
            requestId
          });
        }
        throw error;
      }
    };

    return client;
  }
}

// Global analytics instance
export const analytics = AnalyticsManager.getInstance();

// Vue directive for automatic interaction tracking
export const vAnalytics = {
  mounted(el: HTMLElement, binding: any) {
    const { value } = binding;
    const component = value?.component || 'unknown';
    const action = value?.action || 'click';

    const handleEvent = (event: Event) => {
      if (typeof window !== 'undefined' && (window as any).analyticsTracker) {
        (window as any).analyticsTracker.trackInteraction(
          component,
          action,
          {
            element: el.tagName.toLowerCase(),
            value: value?.value,
            target: event.target
          }
        );
      }
    };

    el.addEventListener(action, handleEvent);

    // Store the handler for cleanup
    (el as any)._analyticsHandler = handleEvent;
    (el as any)._analyticsAction = action;
  },

  unmounted(el: HTMLElement) {
    if ((el as any)._analyticsHandler && (el as any)._analyticsAction) {
      el.removeEventListener((el as any)._analyticsAction, (el as any)._analyticsHandler);
    }
  }
};

// Default export
export default {
  useAnalytics: useAnalyticsComposable,
  useConversationAnalytics: useConversationAnalyticsComposable,
  AnalyticsDashboard,
  AiAnalyticsDashboard,
  UsageChart,
  AiUsageChart,
  ConversationInsights,
  AiConversationInsights,
  AnalyticsPlugin,
  AnalyticsManager,
  analytics,
  vAnalytics
};
