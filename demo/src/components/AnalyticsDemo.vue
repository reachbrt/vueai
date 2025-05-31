<template>
  <div class="analytics-demo">
    <div class="component-hero">
      <div class="component-hero-content">
        <h2 class="component-hero-title">Analytics & Insights</h2>
        <p class="component-hero-description">
          Track user interactions, monitor AI usage, and gain valuable insights with AI-powered analytics.
          Real-time dashboards with beautiful visualizations.
        </p>
        <div class="component-hero-features">
          <div class="hero-feature">
            <span class="feature-icon">📊</span>
            <span>Real-time Analytics</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">🤖</span>
            <span>AI-powered Insights</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">💬</span>
            <span>Conversation Analysis</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">📈</span>
            <span>Performance Monitoring</span>
          </div>
        </div>
      </div>
      <div class="component-hero-image">
        <div class="analytics-preview">
          <div class="preview-dashboard">
            <div class="preview-header">
              <div class="preview-title">Analytics Dashboard</div>
              <div class="preview-controls">
                <div class="preview-btn">📊</div>
                <div class="preview-btn">📥</div>
                <div class="preview-btn">🧠</div>
              </div>
            </div>
            <div class="preview-metrics">
              <div class="preview-metric">
                <div class="metric-icon">💬</div>
                <div class="metric-value">1,234</div>
                <div class="metric-label">Interactions</div>
              </div>
              <div class="preview-metric">
                <div class="metric-icon">🤖</div>
                <div class="metric-value">567</div>
                <div class="metric-label">AI Requests</div>
              </div>
              <div class="preview-metric">
                <div class="metric-icon">⚡</div>
                <div class="metric-value">1.2s</div>
                <div class="metric-label">Avg Response</div>
              </div>
            </div>
            <div class="preview-chart">
              <div class="chart-bars">
                <div class="chart-bar" style="height: 60%"></div>
                <div class="chart-bar" style="height: 80%"></div>
                <div class="chart-bar" style="height: 45%"></div>
                <div class="chart-bar" style="height: 90%"></div>
                <div class="chart-bar" style="height: 70%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Controls -->
    <div class="demo-controls">
      <h3>Try Analytics Features</h3>
      <div class="control-buttons">
        <button
          @click="simulateInteraction"
          class="demo-btn interaction-btn"
          v-analytics="{ component: 'analytics-demo', action: 'click', value: 'simulate-interaction' }"
        >
          <span class="btn-icon">👆</span>
          Simulate User Interaction
        </button>

        <button
          @click="simulateAIRequest"
          class="demo-btn ai-btn"
          v-analytics="{ component: 'analytics-demo', action: 'click', value: 'simulate-ai' }"
        >
          <span class="btn-icon">🤖</span>
          Simulate AI Request
        </button>

        <button
          @click="generateInsights"
          class="demo-btn insights-btn"
          v-analytics="{ component: 'analytics-demo', action: 'click', value: 'generate-insights' }"
        >
          <span class="btn-icon">🧠</span>
          Generate AI Insights
        </button>

        <button
          @click="exportData"
          class="demo-btn export-btn"
          v-analytics="{ component: 'analytics-demo', action: 'click', value: 'export-data' }"
        >
          <span class="btn-icon">📥</span>
          Export Analytics Data
        </button>
      </div>
    </div>

    <!-- Analytics Dashboard -->
    <div class="dashboard-section">
      <h3>Live Analytics Dashboard</h3>
      <div class="dashboard-container">
        <!-- Temporarily disabled due to Chart.js registration issue -->
        <div class="dashboard-placeholder">
          <div class="placeholder-content">
            <h4>📊 Analytics Dashboard</h4>
            <p>The full analytics dashboard is temporarily disabled due to a Chart.js registration issue.</p>
            <p>You can still use the demo controls above to see event tracking in action!</p>

            <div class="metrics-preview">
              <div class="metric-item">
                <span class="metric-icon">💬</span>
                <span class="metric-label">Events Tracked:</span>
                <span class="metric-value">{{ analytics.events.value.length }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-icon">📊</span>
                <span class="metric-label">Interactions:</span>
                <span class="metric-value">{{ analytics.metrics.value.totalInteractions }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-icon">🤖</span>
                <span class="metric-label">AI Requests:</span>
                <span class="metric-value">{{ analytics.metrics.value.totalAIRequests }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time Events -->
    <div class="events-section">
      <h3>Real-time Events</h3>
      <div class="events-feed">
        <div
          v-for="event in recentEvents"
          :key="event.id"
          class="event-item"
          :class="`event-${event.type}`"
        >
          <div class="event-icon">
            {{ getEventIcon(event.type) }}
          </div>
          <div class="event-content">
            <div class="event-title">{{ formatEventTitle(event) }}</div>
            <div class="event-time">{{ formatTime(event.timestamp) }}</div>
          </div>
          <div class="event-component">{{ event.component }}</div>
        </div>
      </div>
    </div>

    <!-- Insights Modal -->
    <div v-if="showInsightsModal" class="insights-modal-overlay" @click="closeInsightsModal">
      <div class="insights-modal" @click.stop>
        <div class="insights-header">
          <h3>AI-Generated Insights</h3>
          <button @click="closeInsightsModal" class="close-btn">×</button>
        </div>
        <div class="insights-content">
          <div v-if="isGeneratingInsights" class="insights-loading">
            <div class="loading-spinner"></div>
            <p>Analyzing your analytics data...</p>
          </div>
          <div v-else-if="aiInsights" class="insights-text">
            {{ aiInsights }}
          </div>
          <div v-else class="insights-error">
            Failed to generate insights. Please try again.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { AiAnalyticsDashboard, useAnalytics, vAnalytics } from '@aivue/analytics';
import { AIClient } from '@aivue/core';

export default {
  name: 'AnalyticsDemo',
  components: {
    AiAnalyticsDashboard
  },
  directives: {
    analytics: vAnalytics
  },
  setup() {
    // Create AI client
    const aiClient = new AIClient({
      provider: import.meta.env.VITE_OPENAI_API_KEY ? 'openai' : 'fallback',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      model: 'gpt-4o'
    });

    // Set up analytics
    const analytics = useAnalytics({
      config: {
        enabled: true,
        trackInteractions: true,
        trackAIRequests: true,
        trackPerformance: true,
        trackErrors: true,
        sampleRate: 1.0,
        storage: 'localStorage',
        batchSize: 10,
        flushInterval: 5000 // 5 seconds for demo
      },
      aiClient
    });

    const showInsightsModal = ref(false);
    const isGeneratingInsights = ref(false);
    const aiInsights = ref('');

    // Recent events for display
    const recentEvents = computed(() => {
      return analytics.events.value
        .slice(-10)
        .reverse();
    });

    // Demo methods
    const simulateInteraction = () => {
      analytics.trackInteraction('demo-component', 'button-click', {
        element: 'simulate-button',
        value: 'user-interaction-demo',
        timestamp: new Date()
      });
    };

    const simulateAIRequest = async () => {
      const startTime = Date.now();
      const requestId = `demo_${Date.now()}`;

      analytics.trackAIRequest('openai', 'gpt-4o', 'Demo AI request', requestId);

      try {
        const response = await aiClient.complete('Generate a short demo response about analytics');
        const responseTime = Date.now() - startTime;

        analytics.trackAIResponse('openai', 'gpt-4o', response, responseTime, requestId);
      } catch (error) {
        analytics.trackError(error, { component: 'analytics-demo', action: 'simulate-ai-request' });
      }
    };

    const generateInsights = async () => {
      showInsightsModal.value = true;
      isGeneratingInsights.value = true;
      aiInsights.value = '';

      try {
        const insights = await analytics.generateInsights();
        aiInsights.value = insights;
      } catch (error) {
        console.error('Failed to generate insights:', error);
        analytics.trackError(error, { component: 'analytics-demo', action: 'generate-insights' });
      } finally {
        isGeneratingInsights.value = false;
      }
    };

    const exportData = () => {
      const data = analytics.exportData('json');
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-demo-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      analytics.trackInteraction('analytics-demo', 'export-data', {
        format: 'json',
        eventCount: analytics.events.value.length
      });
    };

    const closeInsightsModal = () => {
      showInsightsModal.value = false;
    };

    // Utility methods
    const getEventIcon = (type) => {
      const icons = {
        interaction: '👆',
        ai_request: '🤖',
        ai_response: '💬',
        error: '❌',
        performance: '⚡'
      };
      return icons[type] || '📊';
    };

    const formatEventTitle = (event) => {
      switch (event.type) {
        case 'interaction':
          return `User ${event.data.action} on ${event.data.element}`;
        case 'ai_request':
          return `AI Request to ${event.data.provider}`;
        case 'ai_response':
          return `AI Response (${event.data.responseTime}ms)`;
        case 'error':
          return `Error: ${event.data.error}`;
        case 'performance':
          return `${event.data.metric}: ${event.data.value}${event.data.unit}`;
        default:
          return event.type;
      }
    };

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString();
    };

    // Track page view on mount
    onMounted(() => {
      analytics.trackInteraction('analytics-demo', 'page-view', {
        page: 'analytics-demo',
        timestamp: new Date()
      });
    });

    return {
      aiClient,
      analytics,
      recentEvents,
      showInsightsModal,
      isGeneratingInsights,
      aiInsights,
      simulateInteraction,
      simulateAIRequest,
      generateInsights,
      exportData,
      closeInsightsModal,
      getEventIcon,
      formatEventTitle,
      formatTime
    };
  }
};
</script>

<style scoped>
.analytics-demo {
  padding: 0;
}

.component-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 80px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 60px;
}

.component-hero-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 20px 0;
  background: linear-gradient(45deg, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.component-hero-description {
  font-size: 20px;
  line-height: 1.6;
  margin: 0 0 30px 0;
  opacity: 0.9;
}

.component-hero-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.hero-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.feature-icon {
  font-size: 24px;
}

.analytics-preview {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  color: #1e293b;
}

.preview-dashboard {
  width: 100%;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.preview-title {
  font-weight: 600;
  font-size: 18px;
}

.preview-controls {
  display: flex;
  gap: 8px;
}

.preview-btn {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.preview-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.preview-metric {
  text-align: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.metric-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 12px;
  color: #64748b;
}

.preview-chart {
  height: 80px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: end;
}

.chart-bars {
  display: flex;
  gap: 8px;
  align-items: end;
  width: 100%;
  height: 100%;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 2px;
  min-height: 20%;
  animation: chartGrow 1s ease-out;
}

@keyframes chartGrow {
  from { height: 0; }
  to { height: var(--height); }
}

.demo-controls {
  max-width: 1200px;
  margin: 0 auto 60px auto;
  padding: 0 40px;
}

.demo-controls h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
  text-align: center;
}

.control-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.demo-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.btn-icon {
  font-size: 20px;
}

.interaction-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.interaction-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.ai-btn {
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
}

.ai-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.insights-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.insights-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

.export-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
}

.dashboard-section, .events-section {
  max-width: 1200px;
  margin: 0 auto 60px auto;
  padding: 0 40px;
}

.dashboard-section h3, .events-section h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
  text-align: center;
}

.dashboard-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.dashboard-placeholder {
  padding: 60px 40px;
  text-align: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.placeholder-content h4 {
  font-size: 24px;
  margin: 0 0 16px 0;
  color: #1e293b;
}

.placeholder-content p {
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.metrics-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  font-size: 20px;
}

.metric-label {
  font-size: 14px;
  color: #64748b;
  flex: 1;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.events-feed {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.event-item:hover {
  background: #f8fafc;
}

.event-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.event-interaction .event-icon {
  background: #dbeafe;
}

.event-ai_request .event-icon {
  background: #d1fae5;
}

.event-ai_response .event-icon {
  background: #fef3c7;
}

.event-error .event-icon {
  background: #fee2e2;
}

.event-performance .event-icon {
  background: #e0e7ff;
}

.event-content {
  flex: 1;
}

.event-title {
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;
}

.event-time {
  font-size: 12px;
  color: #64748b;
}

.event-component {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.insights-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.insights-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.insights-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.close-btn:hover {
  background: #f3f4f6;
}

.insights-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.insights-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.insights-text {
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
}

.insights-error {
  color: #dc2626;
  text-align: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .component-hero {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 60px 20px;
  }

  .component-hero-features {
    grid-template-columns: 1fr;
  }

  .demo-controls, .dashboard-section, .events-section {
    padding: 0 20px;
  }

  .control-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
