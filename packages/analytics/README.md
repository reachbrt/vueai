# @aivue/analytics

[![npm version](https://img.shields.io/npm/v/@aivue/analytics.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/analytics)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/analytics.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/analytics)
[![codecov](https://codecov.io/gh/reachbrt/vueai/branch/main/graph/badge.svg)](https://codecov.io/gh/reachbrt/vueai)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/aivue-demo/deploys)

AI-powered analytics and insights for Vue.js applications. Track user interactions, monitor AI usage, analyze conversations, and gain valuable insights with beautiful dashboard components.

## ✨ Features

- 📊 **Real-time Analytics** - Track user interactions and AI usage in real-time
- 🤖 **AI-Powered Insights** - Generate intelligent insights from your data
- 💬 **Conversation Analytics** - Analyze chat patterns, sentiment, and topics
- 📈 **Beautiful Dashboards** - Pre-built Vue components for data visualization
- 🔍 **Performance Monitoring** - Track response times and error rates
- 📱 **Responsive Design** - Works perfectly on all screen sizes
- 🎨 **Customizable** - Flexible theming and configuration options
- 🔒 **Privacy-First** - Local storage by default, optional server integration

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @aivue/analytics @aivue/core

# yarn
yarn add @aivue/analytics @aivue/core

# pnpm
pnpm add @aivue/analytics @aivue/core
```

### Basic Usage

```vue
<template>
  <div>
    <!-- Analytics Dashboard -->
    <AiAnalyticsDashboard 
      :ai-client="aiClient"
      :show-conversation-analytics="true"
    />
    
    <!-- Track interactions automatically -->
    <button v-analytics="{ component: 'my-app', action: 'click' }">
      Click me
    </button>
  </div>
</template>

<script setup>
import { AiAnalyticsDashboard, useAnalytics, vAnalytics } from '@aivue/analytics';
import { AIClient } from '@aivue/core';

// Create AI client
const aiClient = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

// Set up analytics
const analytics = useAnalytics({
  config: {
    enabled: true,
    trackInteractions: true,
    trackAIRequests: true
  },
  aiClient
});

// Track custom events
analytics.trackInteraction('my-component', 'user-action', { value: 'test' });
</script>
```

## 📦 Components

### AiAnalyticsDashboard

A comprehensive analytics dashboard with metrics, charts, and insights.

```vue
<template>
  <AiAnalyticsDashboard 
    :ai-client="aiClient"
    :show-conversation-analytics="true"
  />
</template>
```

**Props:**
- `aiClient` - AIClient instance for generating insights
- `showConversationAnalytics` - Show conversation analytics section

### AiUsageChart

Interactive charts for visualizing usage data.

```vue
<template>
  <AiUsageChart 
    :data="chartData"
    type="line"
    :height="300"
  />
</template>
```

**Props:**
- `data` - Chart data object
- `type` - Chart type ('line' | 'bar')
- `height` - Chart height in pixels

### AiConversationInsights

Detailed conversation analytics and insights.

```vue
<template>
  <AiConversationInsights 
    :analytics="conversationAnalytics"
    :show-summary="true"
  />
</template>
```

**Props:**
- `analytics` - Conversation analytics data
- `showSummary` - Show insights summary section

## 🔧 Composables

### useAnalytics

Main composable for analytics functionality.

```typescript
import { useAnalytics } from '@aivue/analytics';

const analytics = useAnalytics({
  config: {
    enabled: true,
    trackInteractions: true,
    trackAIRequests: true,
    trackPerformance: true,
    trackErrors: true,
    sampleRate: 1.0,
    storage: 'localStorage',
    batchSize: 50,
    flushInterval: 30000
  },
  aiClient
});

// Track events
analytics.trackInteraction('component', 'action', data);
analytics.trackAIRequest('openai', 'gpt-4', 'prompt', 'req-id');
analytics.trackAIResponse('openai', 'gpt-4', 'response', 1500, 'req-id');
analytics.trackError(error, context);
analytics.trackPerformance('response-time', 1500, 'ms');

// Get metrics
const metrics = analytics.metrics.value;
const filteredEvents = analytics.getFilteredEvents(filter);

// Export data
const jsonData = analytics.exportData('json');
const csvData = analytics.exportData('csv');

// Generate AI insights
const insights = await analytics.generateInsights();
```

### useConversationAnalytics

Specialized composable for conversation analysis.

```typescript
import { useConversationAnalytics } from '@aivue/analytics';

const conversationAnalytics = useConversationAnalytics({
  aiClient,
  autoAnalyze: true,
  batchSize: 10
});

// Add conversations
conversationAnalytics.addConversation(conversationData);

// Analyze conversations
await conversationAnalytics.analyzeConversation('conv-id');
await conversationAnalytics.analyzeAllConversations();

// Filter conversations
const topicConversations = conversationAnalytics.getConversationsByTopic('support');
const positiveConversations = conversationAnalytics.getConversationsBySentiment('positive');

// Export data
const data = conversationAnalytics.exportConversations('json');
```

## 🎯 Event Tracking

### Automatic Tracking

Use the `v-analytics` directive for automatic interaction tracking:

```vue
<template>
  <!-- Track clicks -->
  <button v-analytics="{ component: 'header', action: 'click', value: 'menu' }">
    Menu
  </button>
  
  <!-- Track form submissions -->
  <form v-analytics="{ component: 'contact-form', action: 'submit' }">
    <!-- form content -->
  </form>
  
  <!-- Track custom events -->
  <div v-analytics="{ component: 'gallery', action: 'scroll' }">
    <!-- content -->
  </div>
</template>
```

### Manual Tracking

Track events programmatically:

```typescript
// Track user interactions
analytics.trackInteraction('search-box', 'search', {
  query: 'vue analytics',
  results: 42
});

// Track AI requests/responses
analytics.trackAIRequest('openai', 'gpt-4', 'Hello AI', 'req-123');
analytics.trackAIResponse('openai', 'gpt-4', 'Hello human!', 1200, 'req-123');

// Track errors
try {
  // some operation
} catch (error) {
  analytics.trackError(error, { component: 'data-processor' });
}

// Track performance metrics
analytics.trackPerformance('page-load-time', 2500, 'ms');
analytics.trackPerformance('api-response-time', 800, 'ms');
```

## 📊 Analytics Types

### Event Types

- **Interaction Events** - User clicks, form submissions, navigation
- **AI Request Events** - API calls to AI providers
- **AI Response Events** - AI responses with timing and quality metrics
- **Error Events** - Application errors and exceptions
- **Performance Events** - Timing and performance metrics

### Metrics

- **Usage Metrics** - Total interactions, AI requests, active users
- **Performance Metrics** - Response times, error rates, throughput
- **Quality Metrics** - AI response quality, user satisfaction
- **Engagement Metrics** - Session duration, conversation length

### Conversation Analytics

- **Sentiment Analysis** - Positive, neutral, negative sentiment distribution
- **Topic Analysis** - Popular discussion topics and trends
- **Quality Analysis** - Response quality ratings and distribution
- **Engagement Analysis** - Conversation length and user engagement

## ⚙️ Configuration

### Storage Options

```typescript
// Local storage (default)
const analytics = useAnalytics({
  config: {
    storage: 'localStorage'
  }
});

// Session storage
const analytics = useAnalytics({
  config: {
    storage: 'sessionStorage'
  }
});

// Memory storage (no persistence)
const analytics = useAnalytics({
  config: {
    storage: 'memory'
  }
});

// Custom storage
const analytics = useAnalytics({
  config: {
    storage: 'custom',
    customStorage: {
      save: async (events) => {
        // Save to your backend
        await api.saveAnalytics(events);
      },
      load: async () => {
        // Load from your backend
        return await api.loadAnalytics();
      },
      clear: async () => {
        // Clear from your backend
        await api.clearAnalytics();
      }
    }
  }
});
```

### Sampling and Performance

```typescript
const analytics = useAnalytics({
  config: {
    sampleRate: 0.1, // Track 10% of events
    batchSize: 100, // Batch size for storage
    flushInterval: 60000, // Flush every minute
    enabled: process.env.NODE_ENV === 'production'
  }
});
```

## 🎨 Styling

The components come with beautiful default styles, but you can customize them:

```css
/* Override component styles */
.analytics-dashboard {
  --primary-color: #your-color;
  --background-color: #your-bg;
  --text-color: #your-text;
}

/* Custom chart colors */
.usage-chart {
  --chart-primary: #3b82f6;
  --chart-secondary: #10b981;
}
```

## 🔗 Integration with Other @aivue Packages

Analytics automatically integrates with other @aivue packages:

```typescript
import { AIClient } from '@aivue/core';
import { AiChatWindow } from '@aivue/chatbot';
import { analytics } from '@aivue/analytics';

// Wrap AI client for automatic tracking
const aiClient = analytics.wrapAIClient(new AIClient({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
}));

// All AI requests will be automatically tracked
```

## 📱 Demo

Check out our [interactive demo](https://aivue-demo.netlify.app/analytics) to see all analytics features in action.

## 📦 Related Packages

<div class="related-packages">
  <a href="https://www.npmjs.com/package/@aivue/core" class="package-card" target="_blank">
    <h4><span class="package-icon">🧠</span> @aivue/core</h4>
    <div class="package-content">
      <p>Core AI functionality for Vue.js components</p>
    </div>
  </a>

  <a href="https://www.npmjs.com/package/@aivue/chatbot" class="package-card" target="_blank">
    <h4><span class="package-icon">💬</span> @aivue/chatbot</h4>
    <div class="package-content">
      <p>AI-powered chat components for Vue.js</p>
    </div>
  </a>

  <a href="https://www.npmjs.com/package/@aivue/autosuggest" class="package-card" target="_blank">
    <h4><span class="package-icon">✨</span> @aivue/autosuggest</h4>
    <div class="package-content">
      <p>AI-powered suggestion components for Vue.js</p>
    </div>
  </a>

  <a href="https://www.npmjs.com/package/@aivue/smartform" class="package-card" target="_blank">
    <h4><span class="package-icon">📝</span> @aivue/smartform</h4>
    <div class="package-content">
      <p>AI-powered form validation for Vue.js</p>
    </div>
  </a>
</div>

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/reachbrt/vueai/blob/main/CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](https://github.com/reachbrt/vueai/blob/main/LICENSE) for details.

## 🆘 Support

- 📖 [Documentation](https://github.com/reachbrt/vueai/wiki)
- 💬 [Discussions](https://github.com/reachbrt/vueai/discussions)
- 🐛 [Issues](https://github.com/reachbrt/vueai/issues)
- 📧 [Email Support](mailto:support@aivue.dev)
