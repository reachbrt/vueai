<template>
  <div class="conversation-insights">
    <div class="insights-header">
      <h3 class="insights-title">
        <span class="title-icon">💬</span>
        Conversation Analytics
      </h3>
    </div>

    <div class="insights-grid">
      <!-- Total Conversations -->
      <div class="insight-card">
        <div class="insight-icon">📊</div>
        <div class="insight-content">
          <div class="insight-value">{{ analytics.totalConversations.toLocaleString() }}</div>
          <div class="insight-label">Total Conversations</div>
        </div>
      </div>

      <!-- Average Length -->
      <div class="insight-card">
        <div class="insight-icon">📏</div>
        <div class="insight-content">
          <div class="insight-value">{{ Math.round(analytics.averageLength) }}</div>
          <div class="insight-label">Avg Messages per Conversation</div>
        </div>
      </div>

      <!-- Response Quality -->
      <div class="insight-card">
        <div class="insight-icon">⭐</div>
        <div class="insight-content">
          <div class="insight-value">{{ analytics.responseQuality.average.toFixed(1) }}/5</div>
          <div class="insight-label">Average Quality Rating</div>
        </div>
      </div>
    </div>

    <!-- Sentiment Distribution -->
    <div class="sentiment-section">
      <h4 class="section-title">Sentiment Distribution</h4>
      <div class="sentiment-chart">
        <div class="sentiment-bar">
          <div 
            class="sentiment-segment positive"
            :style="{ width: `${analytics.sentimentDistribution.positive * 100}%` }"
          ></div>
          <div 
            class="sentiment-segment neutral"
            :style="{ width: `${analytics.sentimentDistribution.neutral * 100}%` }"
          ></div>
          <div 
            class="sentiment-segment negative"
            :style="{ width: `${analytics.sentimentDistribution.negative * 100}%` }"
          ></div>
        </div>
        <div class="sentiment-legend">
          <div class="legend-item">
            <div class="legend-color positive"></div>
            <span>Positive ({{ (analytics.sentimentDistribution.positive * 100).toFixed(1) }}%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-color neutral"></div>
            <span>Neutral ({{ (analytics.sentimentDistribution.neutral * 100).toFixed(1) }}%)</span>
          </div>
          <div class="legend-item">
            <div class="legend-color negative"></div>
            <span>Negative ({{ (analytics.sentimentDistribution.negative * 100).toFixed(1) }}%)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Topics -->
    <div class="topics-section">
      <h4 class="section-title">Popular Topics</h4>
      <div class="topics-list">
        <div 
          v-for="(topic, index) in analytics.topTopics.slice(0, 5)" 
          :key="topic.topic"
          class="topic-item"
        >
          <div class="topic-rank">{{ index + 1 }}</div>
          <div class="topic-name">{{ topic.topic }}</div>
          <div class="topic-bar">
            <div 
              class="topic-bar-fill"
              :style="{ width: `${(topic.count / maxTopicCount) * 100}%` }"
            ></div>
          </div>
          <div class="topic-count">{{ topic.count }}</div>
        </div>
      </div>
    </div>

    <!-- Quality Distribution -->
    <div class="quality-section">
      <h4 class="section-title">Quality Rating Distribution</h4>
      <div class="quality-chart">
        <div 
          v-for="rating in [1, 2, 3, 4, 5]" 
          :key="rating"
          class="quality-bar"
        >
          <div class="quality-label">{{ rating }}⭐</div>
          <div class="quality-bar-container">
            <div 
              class="quality-bar-fill"
              :style="{ 
                width: `${getQualityPercentage(rating)}%`,
                backgroundColor: getQualityColor(rating)
              }"
            ></div>
          </div>
          <div class="quality-count">
            {{ analytics.responseQuality.distribution[rating] || 0 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Insights Summary -->
    <div v-if="showSummary" class="summary-section">
      <h4 class="section-title">Key Insights</h4>
      <div class="insights-summary">
        <div class="summary-item">
          <span class="summary-icon">📈</span>
          <span class="summary-text">
            Most conversations are 
            <strong>{{ getMostCommonSentiment() }}</strong> 
            in sentiment
          </span>
        </div>
        <div class="summary-item">
          <span class="summary-icon">🎯</span>
          <span class="summary-text">
            Top discussion topic: 
            <strong>{{ analytics.topTopics[0]?.topic || 'N/A' }}</strong>
          </span>
        </div>
        <div class="summary-item">
          <span class="summary-icon">⚡</span>
          <span class="summary-text">
            Average conversation length is 
            <strong>{{ Math.round(analytics.averageLength) }} messages</strong>
          </span>
        </div>
        <div class="summary-item">
          <span class="summary-icon">🌟</span>
          <span class="summary-text">
            Quality rating trend: 
            <strong>{{ getQualityTrend() }}</strong>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import type { ConversationAnalytics } from '../types';

export default defineComponent({
  name: 'ConversationInsights',
  props: {
    analytics: {
      type: Object as PropType<ConversationAnalytics>,
      required: true
    },
    showSummary: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const maxTopicCount = computed(() => {
      return Math.max(...props.analytics.topTopics.map(t => t.count), 1);
    });

    const totalQualityRatings = computed(() => {
      return Object.values(props.analytics.responseQuality.distribution)
        .reduce((sum, count) => sum + count, 0);
    });

    const getQualityPercentage = (rating: number): number => {
      const count = props.analytics.responseQuality.distribution[rating] || 0;
      return totalQualityRatings.value > 0 ? (count / totalQualityRatings.value) * 100 : 0;
    };

    const getQualityColor = (rating: number): string => {
      const colors = {
        1: '#ef4444', // red
        2: '#f97316', // orange
        3: '#eab308', // yellow
        4: '#22c55e', // green
        5: '#10b981'  // emerald
      };
      return colors[rating as keyof typeof colors] || '#6b7280';
    };

    const getMostCommonSentiment = (): string => {
      const { positive, neutral, negative } = props.analytics.sentimentDistribution;
      if (positive >= neutral && positive >= negative) return 'positive';
      if (neutral >= negative) return 'neutral';
      return 'negative';
    };

    const getQualityTrend = (): string => {
      const avg = props.analytics.responseQuality.average;
      if (avg >= 4.5) return 'Excellent';
      if (avg >= 4.0) return 'Very Good';
      if (avg >= 3.5) return 'Good';
      if (avg >= 3.0) return 'Average';
      if (avg >= 2.0) return 'Below Average';
      return 'Poor';
    };

    return {
      maxTopicCount,
      getQualityPercentage,
      getQualityColor,
      getMostCommonSentiment,
      getQualityTrend
    };
  }
});
</script>

<style scoped>
.conversation-insights {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.insights-header {
  margin-bottom: 24px;
}

.insights-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.title-icon {
  font-size: 24px;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.insight-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.insight-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
}

.insight-content {
  flex: 1;
}

.insight-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
}

.insight-label {
  font-size: 12px;
  color: #64748b;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.sentiment-section {
  margin-bottom: 32px;
}

.sentiment-chart {
  space-y: 12px;
}

.sentiment-bar {
  height: 24px;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  margin-bottom: 12px;
}

.sentiment-segment {
  height: 100%;
  transition: width 0.3s ease;
}

.sentiment-segment.positive {
  background: #10b981;
}

.sentiment-segment.neutral {
  background: #6b7280;
}

.sentiment-segment.negative {
  background: #ef4444;
}

.sentiment-legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.positive {
  background: #10b981;
}

.legend-color.neutral {
  background: #6b7280;
}

.legend-color.negative {
  background: #ef4444;
}

.topics-section {
  margin-bottom: 32px;
}

.topics-list {
  space-y: 8px;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.topic-rank {
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.topic-name {
  min-width: 100px;
  font-size: 14px;
  color: #374151;
  text-transform: capitalize;
}

.topic-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.topic-bar-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.topic-count {
  min-width: 30px;
  text-align: right;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.quality-section {
  margin-bottom: 32px;
}

.quality-chart {
  space-y: 8px;
}

.quality-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 0;
}

.quality-label {
  min-width: 60px;
  font-size: 14px;
  color: #374151;
}

.quality-bar-container {
  flex: 1;
  height: 20px;
  background: #f3f4f6;
  border-radius: 10px;
  overflow: hidden;
}

.quality-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 10px;
}

.quality-count {
  min-width: 30px;
  text-align: right;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.summary-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.insights-summary {
  space-y: 12px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.summary-icon {
  font-size: 20px;
}

.summary-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.summary-text strong {
  color: #1e293b;
  font-weight: 600;
}

@media (max-width: 768px) {
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .sentiment-legend {
    flex-direction: column;
    gap: 8px;
  }
  
  .topic-item {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .topic-name {
    min-width: auto;
    flex: 1;
  }
}
</style>
