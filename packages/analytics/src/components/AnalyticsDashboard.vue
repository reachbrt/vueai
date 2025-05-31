<template>
  <div class="analytics-dashboard">
    <div class="dashboard-header">
      <h2 class="dashboard-title">
        <span class="title-icon">📊</span>
        Analytics Dashboard
      </h2>
      <div class="dashboard-controls">
        <button
          @click="refreshData"
          :disabled="isLoading"
          class="refresh-btn"
        >
          <span class="btn-icon">🔄</span>
          {{ isLoading ? 'Loading...' : 'Refresh' }}
        </button>
        <button @click="exportData" class="export-btn">
          <span class="btn-icon">📥</span>
          Export
        </button>
        <button @click="generateInsights" class="insights-btn">
          <span class="btn-icon">🧠</span>
          AI Insights
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">💬</div>
        <div class="metric-content">
          <div class="metric-value">{{ metrics.totalInteractions.toLocaleString() }}</div>
          <div class="metric-label">Total Interactions</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">🤖</div>
        <div class="metric-content">
          <div class="metric-value">{{ metrics.totalAIRequests.toLocaleString() }}</div>
          <div class="metric-label">AI Requests</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">⚡</div>
        <div class="metric-content">
          <div class="metric-value">{{ Math.round(metrics.averageResponseTime) }}ms</div>
          <div class="metric-label">Avg Response Time</div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon">❌</div>
        <div class="metric-content">
          <div class="metric-value">{{ (metrics.errorRate * 100).toFixed(1) }}%</div>
          <div class="metric-label">Error Rate</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container">
        <h3 class="chart-title">Usage Over Time</h3>
        <UsageChart :data="usageChartData" />
      </div>

      <div class="chart-container">
        <h3 class="chart-title">Component Popularity</h3>
        <div class="component-list">
          <div
            v-for="component in metrics.topComponents"
            :key="component.component"
            class="component-item"
          >
            <div class="component-name">{{ component.component }}</div>
            <div class="component-bar">
              <div
                class="component-bar-fill"
                :style="{ width: `${(component.count / maxComponentCount) * 100}%` }"
              ></div>
            </div>
            <div class="component-count">{{ component.count }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conversation Analytics -->
    <div v-if="showConversationAnalytics" class="conversation-section">
      <ConversationInsights :analytics="conversationAnalytics" />
    </div>

    <!-- AI Insights Modal -->
    <div v-if="showInsightsModal" class="insights-modal-overlay" @click="closeInsightsModal">
      <div class="insights-modal" @click.stop>
        <div class="insights-header">
          <h3>AI-Generated Insights</h3>
          <button @click="closeInsightsModal" class="close-btn">×</button>
        </div>
        <div class="insights-content">
          <div v-if="isGeneratingInsights" class="insights-loading">
            <div class="loading-spinner"></div>
            <p>Generating insights...</p>
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

    <!-- Filters -->
    <div class="filters-section">
      <h3>Filters</h3>
      <div class="filter-controls">
        <div class="filter-group">
          <label>Date Range:</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="filter-input"
          />
          <span>to</span>
          <input
            v-model="filters.endDate"
            type="date"
            class="filter-input"
          />
        </div>

        <div class="filter-group">
          <label>Component:</label>
          <select v-model="filters.component" class="filter-select">
            <option value="">All Components</option>
            <option
              v-for="component in availableComponents"
              :key="component"
              :value="component"
            >
              {{ component }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Event Type:</label>
          <select v-model="filters.eventType" class="filter-select">
            <option value="">All Events</option>
            <option value="interaction">Interactions</option>
            <option value="ai_request">AI Requests</option>
            <option value="ai_response">AI Responses</option>
            <option value="error">Errors</option>
            <option value="performance">Performance</option>
          </select>
        </div>

        <button @click="applyFilters" class="apply-filters-btn">
          Apply Filters
        </button>
        <button @click="clearFilters" class="clear-filters-btn">
          Clear
        </button>
      </div>
    </div>

    <!-- Events Table -->
    <div class="events-section">
      <h3>Recent Events</h3>
      <div class="events-table-container">
        <table class="events-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Component</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in recentEvents" :key="event.id" class="event-row">
              <td class="event-time">
                {{ formatTime(event.timestamp) }}
              </td>
              <td class="event-type">
                <span :class="`event-type-badge event-type-${event.type}`">
                  {{ event.type }}
                </span>
              </td>
              <td class="event-component">{{ event.component }}</td>
              <td class="event-details">
                <div class="event-details-content">
                  {{ formatEventDetails(event) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useAnalytics } from '../composables/useAnalytics';
import { useConversationAnalytics } from '../composables/useConversationAnalytics';
import UsageChart from './UsageChart.vue';
import ConversationInsights from './ConversationInsights.vue';
import type { AnalyticsEvent, AnalyticsFilter } from '../types';

export default defineComponent({
  name: 'AnalyticsDashboard',
  components: {
    UsageChart,
    ConversationInsights
  },
  props: {
    aiClient: {
      type: Object,
      default: null
    },
    showConversationAnalytics: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const analytics = useAnalytics({ aiClient: props.aiClient });
    const conversationAnalytics = useConversationAnalytics({
      aiClient: props.aiClient
    });

    const isLoading = ref(false);
    const showInsightsModal = ref(false);
    const isGeneratingInsights = ref(false);
    const aiInsights = ref('');

    const filters = ref({
      startDate: '',
      endDate: '',
      component: '',
      eventType: ''
    });

    // Computed properties
    const metrics = computed(() => analytics.metrics.value);

    const maxComponentCount = computed(() => {
      return Math.max(...metrics.value.topComponents.map(c => c.count), 1);
    });

    const availableComponents = computed(() => {
      return [...new Set(analytics.events.value.map(e => e.component))];
    });

    const recentEvents = computed(() => {
      return analytics.events.value
        .slice(-50)
        .reverse();
    });

    const usageChartData = computed(() => {
      // Group events by hour for the last 24 hours
      const now = new Date();
      const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now);
        hour.setHours(hour.getHours() - (23 - i));
        return hour;
      });

      const data = hours.map(hour => {
        const hourStart = new Date(hour);
        hourStart.setMinutes(0, 0, 0);
        const hourEnd = new Date(hourStart);
        hourEnd.setHours(hourEnd.getHours() + 1);

        const count = analytics.events.value.filter(event => {
          const eventTime = new Date(event.timestamp);
          return eventTime >= hourStart && eventTime < hourEnd;
        }).length;

        return {
          label: hourStart.getHours().toString().padStart(2, '0') + ':00',
          value: count
        };
      });

      return {
        labels: data.map(d => d.label),
        datasets: [{
          label: 'Events',
          data: data.map(d => d.value),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2
        }]
      };
    });

    // Methods
    const refreshData = async () => {
      isLoading.value = true;
      try {
        // Simulate data refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        isLoading.value = false;
      }
    };

    const exportData = () => {
      const data = analytics.exportData('json');
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
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
      } finally {
        isGeneratingInsights.value = false;
      }
    };

    const closeInsightsModal = () => {
      showInsightsModal.value = false;
    };

    const applyFilters = () => {
      const filter: AnalyticsFilter = {};

      if (filters.value.startDate && filters.value.endDate) {
        filter.dateRange = {
          start: new Date(filters.value.startDate),
          end: new Date(filters.value.endDate)
        };
      }

      if (filters.value.component) {
        filter.component = filters.value.component;
      }

      if (filters.value.eventType) {
        filter.eventType = filters.value.eventType as any;
      }

      // Apply filters (this would update the displayed data)
      console.log('Applying filters:', filter);
    };

    const clearFilters = () => {
      filters.value = {
        startDate: '',
        endDate: '',
        component: '',
        eventType: ''
      };
    };

    const formatTime = (timestamp: Date): string => {
      return new Date(timestamp).toLocaleTimeString();
    };

    const formatEventDetails = (event: AnalyticsEvent): string => {
      switch (event.type) {
        case 'interaction':
          return `${event.data.action} on ${event.data.element}`;
        case 'ai_request':
          return `${event.data.provider} - ${event.data.model}`;
        case 'ai_response':
          return `Response in ${event.data.responseTime}ms`;
        case 'error':
          return event.data.error;
        case 'performance':
          return `${event.data.metric}: ${event.data.value}${event.data.unit}`;
        default:
          return JSON.stringify(event.data);
      }
    };

    onMounted(() => {
      // Set default date range to last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      filters.value.startDate = startDate.toISOString().split('T')[0];
      filters.value.endDate = endDate.toISOString().split('T')[0];
    });

    return {
      // Analytics
      metrics,
      analytics,
      conversationAnalytics: conversationAnalytics.analytics,

      // UI State
      isLoading,
      showInsightsModal,
      isGeneratingInsights,
      aiInsights,
      filters,

      // Computed
      maxComponentCount,
      availableComponents,
      recentEvents,
      usageChartData,

      // Methods
      refreshData,
      exportData,
      generateInsights,
      closeInsightsModal,
      applyFilters,
      clearFilters,
      formatTime,
      formatEventDetails
    };
  }
});
</script>

<style scoped>
.analytics-dashboard {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.title-icon {
  font-size: 32px;
}

.dashboard-controls {
  display: flex;
  gap: 12px;
}

.refresh-btn, .export-btn, .insights-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn {
  background: #3b82f6;
  color: white;
}

.refresh-btn:hover {
  background: #2563eb;
}

.refresh-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.export-btn {
  background: #10b981;
  color: white;
}

.export-btn:hover {
  background: #059669;
}

.insights-btn {
  background: #8b5cf6;
  color: white;
}

.insights-btn:hover {
  background: #7c3aed;
}

.btn-icon {
  font-size: 16px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 12px;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #64748b;
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.component-list {
  space-y: 12px;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.component-name {
  min-width: 120px;
  font-size: 14px;
  color: #374151;
}

.component-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.component-bar-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.component-count {
  min-width: 40px;
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.conversation-section {
  margin-bottom: 32px;
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
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.insights-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
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

.filters-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.filters-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.filter-input, .filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.filter-input:focus, .filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.apply-filters-btn, .clear-filters-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-filters-btn {
  background: #3b82f6;
  color: white;
}

.apply-filters-btn:hover {
  background: #2563eb;
}

.clear-filters-btn {
  background: #f3f4f6;
  color: #374151;
}

.clear-filters-btn:hover {
  background: #e5e7eb;
}

.events-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.events-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.events-table-container {
  overflow-x: auto;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th {
  text-align: left;
  padding: 12px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.events-table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.event-row:hover {
  background: #f8fafc;
}

.event-time {
  font-family: monospace;
  font-size: 13px;
  color: #6b7280;
}

.event-type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.event-type-interaction {
  background: #dbeafe;
  color: #1e40af;
}

.event-type-ai_request {
  background: #d1fae5;
  color: #065f46;
}

.event-type-ai_response {
  background: #fef3c7;
  color: #92400e;
}

.event-type-error {
  background: #fee2e2;
  color: #991b1b;
}

.event-type-performance {
  background: #e0e7ff;
  color: #3730a3;
}

.event-component {
  font-weight: 500;
  color: #374151;
}

.event-details-content {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6b7280;
  font-size: 14px;
}

@media (max-width: 768px) {
  .analytics-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .dashboard-controls {
    justify-content: center;
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .filter-group label {
    min-width: 80px;
  }
}
</style>
