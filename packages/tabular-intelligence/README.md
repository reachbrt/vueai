# @aivue/tabular-intelligence

> Tabular Foundation Model (TFM) integration for structured data analysis in Vue.js

[![npm version](https://img.shields.io/npm/v/@aivue/tabular-intelligence.svg)](https://www.npmjs.com/package/@aivue/tabular-intelligence)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Features

- 🔌 **Generic TFM Client** - Connect to any HTTP-based Tabular Foundation Model API
- 💬 **Natural Language Q&A** - Ask questions about your data in plain English
- 📮 **Postman Collection Integration** - Import Postman collections and query API data with AI
- 📊 **Descriptive Statistics** - Mean, median, mode, std dev, percentiles, distributions
- 🚨 **Anomaly Detection** - Statistical and ML-based outlier detection
- 🎯 **Segmentation & Clustering** - K-means, DBSCAN, hierarchical clustering
- 🔮 **Predictions** - Time series forecasting and predictive modeling
- 📈 **Correlation Analysis** - Pearson correlation matrices and significance testing
- 🤖 **AI Summaries** - Generate intelligent summaries of your data
- 🌐 **Table Extraction** - Extract data from HTML tables or Vue data grids
- 🔄 **Local Fallback** - Built-in statistical analysis when API is unavailable
- 🎨 **Vue Integration** - Reactive composables for seamless Vue.js integration
- 📦 **Smart DataTable Ready** - Designed to work with @aivue/smart-datatable

### 💬 Q&A Capabilities

**Ask any question about your Vue tables – AI answers directly from your data.**

- "Which region had the highest revenue last quarter?"
- "How many customers churned with tenure < 6 months?"
- "What is the average order value for India vs US?"
- "Show me products with price > $100 and quantity < 10"

The AI analyzes your table data and provides natural language answers with supporting statistics and data.

### 📮 Postman Collection Integration

**Import Postman collections and query API data with natural language.**

- Import Postman Collection v2.1 JSON files
- Automatically discover all API endpoints
- Execute API requests with variable substitution
- Convert API responses to tabular format
- Ask questions about API data using AI

Perfect for MarketStack, financial APIs, and any REST API with tabular data!

See [POSTMAN-INTEGRATION.md](./POSTMAN-INTEGRATION.md) for detailed documentation.

## 📦 Installation

```bash
npm install @aivue/tabular-intelligence
```

## 🚀 Quick Start

### Basic Usage (Local Mode)

```typescript
import { useTabularIntelligence } from '@aivue/tabular-intelligence';

// Local mode - no API required
const { analyze, getDescriptiveStats, detectAnomalies } = useTabularIntelligence({
  config: {
    provider: 'local',
    baseUrl: '',
  },
  data: ref(yourData),
});

// Get descriptive statistics
const stats = await getDescriptiveStats();

// Detect anomalies
const anomalies = await detectAnomalies(['price', 'quantity'], 0.7);

// Perform clustering
const clusters = await performClustering(['feature1', 'feature2'], 3);
```

### With TabPFN (Prior Labs)

```typescript
import { useTabularIntelligence } from '@aivue/tabular-intelligence';

const { analyze } = useTabularIntelligence({
  config: {
    provider: 'tabpfn',
    baseUrl: 'https://api.priorlabs.ai/v1/predict',
    apiKey: 'your-tabpfn-api-key', // Get from https://priorlabs.ai/
  },
  data: ref(yourData),
  useLocalFallback: true, // Fallback to local if API fails
});
```

### With Custom TFM API

```typescript
import { useTabularIntelligence } from '@aivue/tabular-intelligence';

const { analyze } = useTabularIntelligence({
  config: {
    provider: 'custom',
    baseUrl: 'https://your-tfm-api.com/analyze',
    apiKey: 'your-api-key',
  },
  data: ref(yourData),
  useLocalFallback: true,
});
```

### With Smart DataTable

```vue
<template>
  <div>
    <SmartDataTable :data="tableData" :columns="columns" />
    
    <button @click="analyzeData">Analyze Data</button>
    
    <div v-if="anomalies.length">
      <h3>Anomalies Detected: {{ anomalies.length }}</h3>
      <div v-for="anomaly in anomalies" :key="anomaly.rowIndex">
        Row {{ anomaly.rowIndex }}: {{ anomaly.reasons.join(', ') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { SmartDataTable } from '@aivue/smart-datatable';
import { useTabularIntelligence } from '@aivue/tabular-intelligence';

const tableData = ref([
  { id: 1, name: 'Product A', price: 100, quantity: 50 },
  { id: 2, name: 'Product B', price: 200, quantity: 30 },
  { id: 3, name: 'Product C', price: 9999, quantity: 1 }, // Anomaly!
]);

const { detectAnomalies } = useTabularIntelligence({
  config: {
    provider: 'custom',
    baseUrl: 'https://api.example.com/tfm',
  },
  data: tableData,
  useLocalFallback: true,
});

const anomalies = ref([]);

async function analyzeData() {
  anomalies.value = await detectAnomalies(['price', 'quantity']);
}
</script>
```

## 💬 Q&A Usage

### Setup Q&A

```typescript
import { useTabularIntelligence, QuestionInput, AnswerDisplay, QuestionHistory } from '@aivue/tabular-intelligence';

const {
  askQuestion,
  generateSummary,
  questionHistory,
  lastAnswer,
  clearHistory,
} = useTabularIntelligence({
  config: {
    provider: 'local',
    baseUrl: 'https://api.example.com/tfm',
  },
  data: tableData,
  qaConfig: {
    provider: 'openai',
    apiKey: 'sk-...',
    model: 'gpt-4-turbo-preview',
  },
});

// Ask a question
const answer = await askQuestion('What is the average price by category?');

// Generate AI summary
const summary = await generateSummary();
```

### Q&A Components

```vue
<template>
  <div>
    <!-- Question Input -->
    <QuestionInput
      :loading="loading"
      @submit="handleQuestion"
    />

    <!-- Latest Answer -->
    <AnswerDisplay
      v-if="lastAnswer"
      :answer="lastAnswer"
    />

    <!-- Question History -->
    <QuestionHistory
      :questions="questionHistory"
      @clear="clearHistory"
      @select="handleSelectQuestion"
    />
  </div>
</template>

<script setup>
import { QuestionInput, AnswerDisplay, QuestionHistory, useTabularIntelligence } from '@aivue/tabular-intelligence';

const { askQuestion, questionHistory, lastAnswer, clearHistory } = useTabularIntelligence({
  config: { provider: 'local' },
  data: tableData,
  qaConfig: {
    provider: 'openai',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  },
});

async function handleQuestion(question) {
  await askQuestion(question);
}

function handleSelectQuestion(question) {
  console.log('Selected:', question);
}
</script>
```

### Table Extraction

Extract data from HTML tables or Vue data grids:

```typescript
// Extract from DOM
const extracted = intelligence.extractFromDOM({
  selector: 'table.my-table',
  includeHeaders: true,
  maxRows: 1000,
  inferTypes: true,
});

// Load from Vue data grid
intelligence.loadFromVueGrid(
  gridData,
  [
    { field: 'name', header: 'Product Name' },
    { field: 'price', header: 'Price' },
  ],
  { inferTypes: true }
);
```

## 📖 API Reference

### `useTabularIntelligence(options)`

Main composable for tabular intelligence.

**Options:**
- `config: TFMConfig` - TFM API configuration
- `data?: Ref<any[]>` - Reactive data array
- `schema?: Ref<TableSchema>` - Optional table schema
- `useLocalFallback?: boolean` - Enable local analysis fallback (default: true)
- `qaConfig?: QAEngineConfig` - Q&A engine configuration (optional)
- `maxQuestionHistory?: number` - Maximum questions to keep in history (default: 50)

**Returns:**
- `client: TabularIntelligence` - Core TFM client instance
- `loading: Ref<boolean>` - Loading state
- `error: Ref<Error | null>` - Error state
- `lastResult: Ref<AnalysisResult | null>` - Last analysis result
- `data: Ref<any[]>` - Data array
- `schema: Ref<TableSchema | null>` - Inferred or provided schema
- `questionHistory: Ref<Question[]>` - Q&A question history
- `answerHistory: Ref<Answer[]>` - Q&A answer history
- `lastAnswer: Ref<Answer | null>` - Last Q&A answer
- `analyze(type, options)` - Generic analysis method
- `getDescriptiveStats()` - Get descriptive statistics
- `detectAnomalies(columns?, sensitivity?)` - Detect anomalies
- `performClustering(features, numClusters?)` - Perform clustering
- `predict(targetColumn, options?)` - Make predictions
- `askQuestion(question, options?)` - Ask a question about the data
- `generateSummary()` - Generate AI summary of the data
- `clearHistory()` - Clear Q&A history
- `extractFromDOM(options?)` - Extract table from DOM
- `loadFromVueGrid(data, columns?, options?)` - Load data from Vue grid
- `updateConfig(config)` - Update TFM configuration
- `initializeQA(qaConfig)` - Initialize Q&A engine
- `setData(data, autoInferSchema?)` - Set new data
- `reset()` - Reset state

### Analysis Types

```typescript
type AnalysisType =
  | 'descriptive_stats'    // Mean, median, std dev, percentiles
  | 'anomaly_detection'    // Outlier detection
  | 'segmentation'         // Data segmentation
  | 'clustering'           // K-means, DBSCAN, etc.
  | 'prediction'           // Forecasting
  | 'correlation'          // Correlation analysis
  | 'summary'              // AI-generated summary
  | 'qa'                   // Question answering
  | 'trend_analysis'       // Trend detection
  | 'outlier_detection';   // Statistical outliers
```

### TFM Configuration

```typescript
interface TFMConfig {
  provider: 'local' | 'tabpfn' | 'custom';
  baseUrl: string;              // API endpoint
  apiKey?: string;              // API key
  model?: string;               // Model name
  headers?: Record<string, string>; // Custom headers
  timeout?: number;             // Request timeout (ms)
  useCorsProxy?: boolean;       // Use CORS proxy
  corsProxyUrl?: string;        // CORS proxy URL
}
```

### Available TFM Providers

| Provider | Description | API Required | Best For |
|----------|-------------|--------------|----------|
| **local** | JavaScript-based statistical analysis | ❌ No | Testing, basic stats, offline use |
| **tabpfn** | TabPFN from Prior Labs - state-of-the-art TFM | ✅ Yes | Production, accurate predictions |
| **custom** | Your own TFM API endpoint | ✅ Yes | Custom models, enterprise solutions |

**Note:** OpenAI and Anthropic do NOT offer dedicated TFM APIs. For AI-powered insights, use the Q&A feature with OpenAI/Anthropic instead.

## 🔧 Advanced Usage

### TabPFN Integration

```typescript
// Get API key from https://priorlabs.ai/
const { analyze } = useTabularIntelligence({
  config: {
    provider: 'tabpfn',
    baseUrl: 'https://api.priorlabs.ai/v1/predict',
    apiKey: process.env.TABPFN_API_KEY,
    timeout: 60000,
  },
  useLocalFallback: true, // Fallback to local if API fails
});

// Perform analysis with TabPFN
const result = await analyze('prediction', {
  targetColumn: 'sales',
  features: ['price', 'quantity', 'category'],
});
```

### Custom TFM API Integration

```typescript
const { analyze } = useTabularIntelligence({
  config: {
    provider: 'custom',
    baseUrl: 'https://your-tfm.com/api/v1/analyze',
    apiKey: process.env.TFM_API_KEY,
    headers: {
      'X-Custom-Header': 'value',
    },
    timeout: 60000,
  },
});

// Custom analysis
const result = await analyze('clustering', {
  features: ['age', 'income', 'spending'],
  numClusters: 5,
  algorithm: 'kmeans',
});
```

### Local Analysis (No API Required)

```typescript
const { getDescriptiveStats, detectAnomalies } = useTabularIntelligence({
  config: {
    provider: 'local',
    baseUrl: '', // Not used for local
  },
  data: ref(myData),
  useLocalFallback: true,
});

// These will use built-in statistical methods
const stats = await getDescriptiveStats();
const anomalies = await detectAnomalies();
```

## 🎨 Integration with @aivue/smart-datatable

Perfect companion for SmartDataTable:

```typescript
import { useSmartDataTable } from '@aivue/smart-datatable';
import { useTabularIntelligence } from '@aivue/tabular-intelligence';

const { data, filteredData } = useSmartDataTable({ data: ref(orders) });

const { analyze } = useTabularIntelligence({
  config: tfmConfig,
  data: filteredData, // Analyze filtered data
});
```

## 📊 Example: Complete Analysis Pipeline

```typescript
const pipeline = async () => {
  // 1. Get descriptive statistics
  const stats = await getDescriptiveStats();
  console.log('Statistics:', stats);

  // 2. Detect anomalies
  const anomalies = await detectAnomalies(['price', 'quantity'], 0.8);
  console.log('Anomalies:', anomalies);

  // 3. Perform clustering
  const clusters = await performClustering(['price', 'quantity'], 3);
  console.log('Clusters:', clusters);

  // 4. Make predictions
  const predictions = await predict('sales', {
    predictionHorizon: 30,
    confidenceLevel: 0.95,
  });
  console.log('Predictions:', predictions);
};
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md).

## 📄 License

MIT © [reachbrt](https://github.com/reachbrt)

