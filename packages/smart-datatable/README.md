# @aivue/smart-datatable

[![npm version](https://img.shields.io/npm/v/@aivue/smart-datatable.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/smart-datatable)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/smart-datatable.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/smart-datatable)
[![NPM Downloads](https://img.shields.io/npm/d18m/%40aivue%2Fsmart-datatable)](https://www.npmjs.com/package/@aivue/smart-datatable)
[![MIT License](https://img.shields.io/npm/l/@aivue/smart-datatable.svg?style=flat-square)](https://github.com/reachbrt/vueai/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/reachbrt/vueai/graph/badge.svg?token=8LYV3M14ZG)](https://codecov.io/gh/reachbrt/vueai)
[![Netlify Status](https://api.netlify.com/api/v1/badges/5cb37fa7-9ee1-4af6-9ff4-d34ff0322ded/deploy-status)](https://aivue.netlify.app/)

> **AI-Native Data Table for Vue.js** - The world's first truly AI-powered datatable that understands your data, not just displays it.

## 🚀 What Makes This Different?

Unlike traditional datatables that just display data, `@aivue/smart-datatable` is **AI-native** - it talks to LLM APIs and truly understands your table data:

- 🗣️ **Natural Language Querying** - "show orders from India last 30 days where total > 500"
- 🧠 **Auto-Insights** - One-click AI analysis with trends, outliers, and recommendations
- 🤖 **Row Agents** - AI operations on individual rows (explain, predict, generate content)
- ✨ **AI Transformations** - Intelligent data cleaning, enrichment, and standardization
- 💬 **Chat Interface** - Conversational queries about your data
- 📋 **OpenAPI Integration** - Auto-generate columns from API schemas

## ✨ Features

### 🤖 **AI-Native Features**

#### 1. Natural Language Querying
Transform how users interact with data - no more complex filter UIs:
```vue
<SmartDataTable
  :data="orders"
  :ai-client="aiClient"
  :ai-search="true"
/>
```
Users can type: *"show only orders from India last 30 days where total > 500"*

#### 2. Auto-Insights & Summaries
One-click AI analysis of your data:
```vue
<SmartDataTable
  :ai-insights="true"
  :ai-client="aiClient"
/>
```
Get instant insights on trends, outliers, patterns, and actionable recommendations.

#### 3. AI Row Agents
Execute AI operations on individual rows:
```vue
<SmartDataTable
  :row-agents="[
    {
      id: 'explain',
      label: 'Explain Record',
      promptTemplate: 'Explain this order: {{customer}} ordered {{product}} for ${{total}}'
    },
    {
      id: 'predict',
      label: 'Predict Delivery',
      promptTemplate: 'Predict delivery date for order {{id}} to {{country}}'
    }
  ]"
/>
```

#### 4. AI Data Transformations
Intelligent data cleaning and enrichment:
```vue
<SmartDataTable
  :ai-transformations="[
    {
      id: 'standardize',
      label: 'Standardize Country Names',
      scope: 'column',
      targetColumn: 'country'
    }
  ]"
/>
```

#### 5. Chat with Your Table
Conversational data analysis:
```vue
<SmartDataTable
  :show-chat="true"
  :ai-client="aiClient"
/>
```
Ask questions like: *"What is the average order value per country?"*

#### 6. OpenAPI Integration
Auto-generate columns from API schemas:
```vue
<SmartDataTable
  :ai-infer-columns="true"
  :open-api-config="{
    schemaUrl: 'https://api.example.com/openapi.json',
    operationId: 'getOrders'
  }"
/>
```

### 🎯 **Core Features**
- 📊 **Smart Data Display** - Beautiful, responsive table with modern design
- 📈 **Intelligent Sorting** - Multi-column sorting with type detection
- 🎨 **Customizable Columns** - Show/hide columns, custom formatters
- 📱 **Responsive Design** - Works perfectly on all devices
- ✅ **Row Selection** - Single and multi-select with bulk actions
- 📤 **Export Data** - Export to CSV, JSON, or Excel
- 🎯 **Custom Actions** - Add custom row actions
- 🎨 **Themes** - Light and dark theme support
- 📄 **Pagination** - Smart pagination with customizable page sizes

## 📦 Installation

```bash
npm install @aivue/smart-datatable @aivue/core
```

## 🚀 Quick Start

### Three Integration Levels

#### 1️⃣ Zero-Config (Simplest)
Just pass data and enable AI - columns are auto-generated!

```vue
<template>
  <SmartDataTable
    :data="orders"
    :ai-client="aiClient"
    :ai-search="true"
    :ai-insights="true"
  />
</template>

<script setup>
import { SmartDataTable } from '@aivue/smart-datatable';
import { AIClient } from '@aivue/core';

const aiClient = new AIClient({
  provider: 'openai',
  apiKey: 'your-api-key'
});

const orders = [
  { id: 1, customer: 'Acme Corp', total: 5000, country: 'USA' },
  { id: 2, customer: 'Tech Inc', total: 3000, country: 'India' }
];
</script>
```

#### 2️⃣ Config-Driven (Recommended)
Full control with AI features:

```vue
<template>
  <SmartDataTable
    :data="orders"
    :columns="columns"
    :ai-client="aiClient"
    :ai-search="true"
    :ai-insights="true"
    :row-agents="rowAgents"
    :ai-transformations="transformations"
    :show-chat="true"
    title="Sales Orders"
    :pagination="true"
    :selectable="true"
    @ai-query="handleAiQuery"
    @ai-insight="handleAiInsight"
  />
</template>

<script setup>
import { ref } from 'vue';
import { SmartDataTable } from '@aivue/smart-datatable';
import { AIClient } from '@aivue/core';
import '@aivue/smart-datatable/dist/smart-datatable.css';

const aiClient = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4'
});

const orders = ref([
  { id: 'ORD-001', customer: 'Acme Corp', total: 5000, country: 'USA', status: 'delivered' },
  { id: 'ORD-002', customer: 'Tech Inc', total: 3000, country: 'India', status: 'shipped' }
]);

const columns = [
  { key: 'id', label: 'Order ID', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'total', label: 'Total', sortable: true, type: 'number' },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'status', label: 'Status', sortable: true }
];

const rowAgents = [
  {
    id: 'explain',
    label: 'Explain Order',
    icon: '📝',
    promptTemplate: 'Explain this order: {{customer}} ordered for ${{total}}, status: {{status}}'
  },
  {
    id: 'predict',
    label: 'Predict Delivery',
    icon: '📅',
    promptTemplate: 'Predict delivery date for order {{id}} to {{country}}'
  }
];

const transformations = [
  {
    id: 'standardize-countries',
    label: 'Standardize Country Names',
    scope: 'column',
    targetColumn: 'country',
    promptTemplate: 'Standardize these country names to ISO format: {{values}}'
  }
];

function handleAiQuery(result) {
  console.log('AI Query Result:', result);
}

function handleAiInsight(insights) {
  console.log('AI Insights:', insights);
}
</script>
```

#### 3️⃣ Advanced (Full Control)
Custom AI client and interceptors:

```vue
<script setup>
import { useAiTableQuery, useAiInsights } from '@aivue/smart-datatable';

// Create custom AI client
const customAiClient = {
  async chat(messages, options) {
    // Your custom AI implementation
    const response = await fetch('your-ai-endpoint', {
      method: 'POST',
      body: JSON.stringify({ messages, ...options })
    });
    return await response.text();
  }
};

// Use composables directly for full control
const { queryToFilter, applyFilter } = useAiTableQuery({
  aiClient: customAiClient,
  schema: tableSchema,
  onQueryResult: (result) => {
    // Custom handling
  }
});
</script>
```

## 📖 Usage Examples

### With Custom Formatters

```vue
<script setup>
const columns = ref([
  { 
    key: 'createdAt', 
    label: 'Created', 
    formatter: (value) => new Date(value).toLocaleDateString() 
  },
  { 
    key: 'price', 
    label: 'Price', 
    formatter: (value) => `$${value.toFixed(2)}` 
  }
]);
</script>
```

### With Row Actions

```vue
<template>
  <SmartDataTable
    :data="users"
    :columns="columns"
    :actions="actions"
  />
</template>

<script setup>
const actions = ref([
  { 
    label: 'Edit', 
    icon: '✏️', 
    handler: (row) => editUser(row) 
  },
  { 
    label: 'Delete', 
    icon: '🗑️', 
    handler: (row) => deleteUser(row) 
  }
]);
</script>
```

### With Custom Cell Templates

```vue
<template>
  <SmartDataTable :data="users" :columns="columns">
    <template #cell-status="{ value }">
      <span :class="value === 'Active' ? 'badge-success' : 'badge-danger'">
        {{ value }}
      </span>
    </template>
  </SmartDataTable>
</template>
```

### Dark Theme

```vue
<template>
  <SmartDataTable
    :data="users"
    :columns="columns"
    theme="dark"
  />
</template>
```

## 🎯 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array` | `[]` | Array of data objects to display |
| `columns` | `Column[]` | `[]` | Column definitions |
| `title` | `String` | `''` | Table title |
| `searchPlaceholder` | `String` | `'Search with AI...'` | Search input placeholder |
| `emptyMessage` | `String` | `'No data available'` | Message when no data |
| `pagination` | `Boolean` | `true` | Enable pagination |
| `pageSize` | `Number` | `10` | Items per page |
| `pageSizeOptions` | `Number[]` | `[5, 10, 25, 50, 100]` | Page size options |
| `selectable` | `Boolean` | `false` | Enable row selection |
| `actions` | `Action[]` | `[]` | Row action buttons |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme |
| `rowKey` | `String` | `'id'` | Unique row identifier |
| `aiClient` | `AIClient` | `undefined` | AI client for insights |

### Column Interface

```typescript
interface Column {
  key: string;                                    // Data property key
  label: string;                                  // Column header label
  sortable?: boolean;                             // Enable sorting (default: true)
  visible?: boolean;                              // Column visibility (default: true)
  formatter?: (value: any, row: any) => string;  // Custom value formatter
  type?: 'string' | 'number' | 'date' | 'boolean'; // Data type
}
```

### Action Interface

```typescript
interface Action {
  label: string;              // Action label
  icon?: string;              // Action icon (emoji or text)
  handler: (row: any) => void; // Click handler
}
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `row-click` | `row: any` | Emitted when a row is clicked |
| `selection-change` | `rows: any[]` | Emitted when selection changes |
| `export` | `data: any[], format: string` | Emitted when data is exported |

### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `cell-{columnKey}` | `{ row, value }` | Custom cell content for specific column |

## 🎨 Styling

The component comes with beautiful default styles, but you can customize it:

```css
/* Override CSS variables */
.smart-datatable {
  --primary-color: #4f46e5;
  --border-color: #e0e0e0;
  --hover-bg: #f8f9fa;
}
```

## 🤖 Using with AI

### Get Data Insights

```vue
<template>
  <SmartDataTable
    ref="tableRef"
    :data="salesData"
    :columns="columns"
    :ai-client="aiClient"
  />
  <button @click="getInsights">Get AI Insights</button>
</template>

<script setup>
import { ref } from 'vue';

const tableRef = ref();

async function getInsights() {
  // AI insights are automatically generated when clicking the AI button
  // Or you can use the composable for custom logic
}
</script>
```

### Using the Composable

```vue
<script setup>
import { ref } from 'vue';
import { useSmartDataTable } from '@aivue/smart-datatable';
import { AIClient } from '@aivue/core';

const data = ref([...]);
const aiClient = new AIClient({ provider: 'openai', apiKey: '...' });

const {
  filteredData,
  sortedData,
  search,
  searchWithAI,
  getInsights,
  sort,
  reset
} = useSmartDataTable({ data, aiClient });

// Use AI-powered search
await searchWithAI('find all active users from last month');

// Get insights
const insights = await getInsights();
console.log(insights);
</script>
```

## 📤 Export Data

The component supports exporting data in multiple formats:

```vue
<template>
  <SmartDataTable
    :data="users"
    :columns="columns"
    @export="handleExport"
  />
</template>

<script setup>
function handleExport(data, format) {
  console.log(`Exporting ${data.length} rows as ${format}`);
  // Data is automatically downloaded
  // You can also handle it manually here
}
</script>
```

## 🎯 Advanced Examples

### Complete Example with All Features

```vue
<template>
  <div class="app">
    <SmartDataTable
      :data="products"
      :columns="columns"
      :ai-client="aiClient"
      title="Product Inventory"
      search-placeholder="Search products..."
      empty-message="No products found"
      :pagination="true"
      :page-size="25"
      :page-size-options="[10, 25, 50, 100]"
      :selectable="true"
      :actions="actions"
      theme="light"
      row-key="id"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
      @export="handleExport"
    >
      <!-- Custom cell for price -->
      <template #cell-price="{ value }">
        <span class="price">${{ value.toFixed(2) }}</span>
      </template>

      <!-- Custom cell for stock status -->
      <template #cell-stock="{ value }">
        <span :class="value > 10 ? 'in-stock' : 'low-stock'">
          {{ value }} units
        </span>
      </template>
    </SmartDataTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AIClient } from '@aivue/core';
import { SmartDataTable } from '@aivue/smart-datatable';
import '@aivue/smart-datatable/style.css';

const aiClient = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

const products = ref([
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 15 },
  { id: 2, name: 'Mouse', category: 'Accessories', price: 29.99, stock: 50 },
  { id: 3, name: 'Keyboard', category: 'Accessories', price: 79.99, stock: 8 }
]);

const columns = ref([
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Product Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true, type: 'number' },
  { key: 'stock', label: 'Stock', sortable: true, type: 'number' }
]);

const actions = ref([
  { label: 'Edit', icon: '✏️', handler: editProduct },
  { label: 'Delete', icon: '🗑️', handler: deleteProduct },
  { label: 'View', icon: '👁️', handler: viewProduct }
]);

function handleRowClick(row) {
  console.log('Row clicked:', row);
}

function handleSelectionChange(rows) {
  console.log('Selected rows:', rows);
}

function handleExport(data, format) {
  console.log(`Exported ${data.length} rows as ${format}`);
}

function editProduct(product) {
  console.log('Edit:', product);
}

function deleteProduct(product) {
  console.log('Delete:', product);
}

function viewProduct(product) {
  console.log('View:', product);
}
</script>

<style scoped>
.price {
  font-weight: 600;
  color: #059669;
}

.in-stock {
  color: #059669;
}

.low-stock {
  color: #dc2626;
  font-weight: 600;
}
</style>
```

## 🌟 Features in Detail

### Intelligent Sorting
- Automatic type detection (string, number, date)
- Multi-column sorting support
- Custom sort functions
- Visual sort indicators

### Smart Search
- Real-time filtering across all columns
- AI-powered natural language search
- Case-insensitive matching
- Highlights matching results

### AI Insights
- Automatic pattern detection
- Trend analysis
- Anomaly detection
- Actionable recommendations

### Responsive Design
- Mobile-first approach
- Touch-friendly controls
- Horizontal scrolling on small screens
- Adaptive pagination

## 📦 Related Packages

Explore the complete @aivue ecosystem:

### 🧠 [@aivue/core](https://www.npmjs.com/package/@aivue/core)
Core AI functionality for Vue.js components

### 💬 [@aivue/chatbot](https://www.npmjs.com/package/@aivue/chatbot)
AI-powered chat components for Vue.js

### ✨ [@aivue/autosuggest](https://www.npmjs.com/package/@aivue/autosuggest)
AI-powered suggestion components for Vue.js

### 📝 [@aivue/smartform](https://www.npmjs.com/package/@aivue/smartform)
AI-powered form validation for Vue.js

### 🎭 [@aivue/emotion-ui](https://www.npmjs.com/package/@aivue/emotion-ui)
Emotion-aware UI components with sentiment analysis

### 📄 [@aivue/doc-intelligence](https://www.npmjs.com/package/@aivue/doc-intelligence)
Document processing and OCR with AI

### 🧠 [@aivue/predictive-input](https://www.npmjs.com/package/@aivue/predictive-input)
AI-powered predictive text input

### 🔔 [@aivue/smart-notify](https://www.npmjs.com/package/@aivue/smart-notify)
Intelligent notification system

### 🎤 [@aivue/voice-actions](https://www.npmjs.com/package/@aivue/voice-actions)
Voice command integration

### 🖼️ [@aivue/image-caption](https://www.npmjs.com/package/@aivue/image-caption)
AI-powered image captioning with OpenAI Vision models

### 📊 [@aivue/analytics](https://www.npmjs.com/package/@aivue/analytics)
AI-powered analytics and insights

## 📄 License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=reachbrt/vueai&type=Date)](https://star-history.com/#reachbrt/vueai&Date)

