<template>
  <div class="ai-datatable-demo">
    <div class="demo-header">
      <h2>🤖 AI-Native SmartDataTable Demo</h2>
      <p class="demo-subtitle">
        Experience the power of AI-driven data tables with natural language querying, 
        auto-insights, row agents, and intelligent transformations.
      </p>
    </div>

    <!-- Tab Navigation -->
    <div class="demo-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- Sales Orders Demo -->
    <div v-if="activeTab === 'sales'" class="demo-section">
      <h3>📊 Sales Orders - AI-Powered Analysis</h3>
      <p class="section-description">
        Try natural language queries like: "show orders from India last 30 days where total > 500"
      </p>

      <SmartDataTable
        :data="salesOrders"
        :columns="salesColumns"
        :ai-client="aiClient"
        :ai-search="true"
        :ai-insights="true"
        :row-agents="salesRowAgents"
        :ai-transformations="salesTransformations"
        :show-chat="true"
        title="Sales Orders"
        :pagination="true"
        :page-size="10"
        :selectable="true"
        :theme="theme"
        @ai-query="handleAiQuery"
        @ai-insight="handleAiInsight"
        @ai-transform="handleAiTransform"
      >
        <!-- Custom cells -->
        <template #cell-total="{ value }">
          <span class="price-cell">${{ value.toLocaleString() }}</span>
        </template>
        <template #cell-status="{ value }">
          <span :class="['status-badge', value]">{{ value }}</span>
        </template>
      </SmartDataTable>
    </div>

    <!-- Support Tickets Demo -->
    <div v-if="activeTab === 'support'" class="demo-section">
      <h3>🎫 Support Tickets - AI-Assisted Management</h3>
      <p class="section-description">
        Use AI to analyze ticket patterns, predict resolution times, and generate responses.
      </p>

      <SmartDataTable
        :data="supportTickets"
        :columns="ticketColumns"
        :ai-client="aiClient"
        :ai-search="true"
        :ai-insights="true"
        :row-agents="ticketRowAgents"
        :show-chat="true"
        title="Support Tickets"
        :pagination="true"
        :page-size="10"
        :selectable="true"
        :theme="theme"
      >
        <template #cell-priority="{ value }">
          <span :class="['priority-badge', value]">{{ value }}</span>
        </template>
        <template #cell-status="{ value }">
          <span :class="['status-badge', value]">{{ value }}</span>
        </template>
      </SmartDataTable>
    </div>

    <!-- Zero-Config Demo -->
    <div v-if="activeTab === 'zero-config'" class="demo-section">
      <h3>⚡ Zero-Config AI Table</h3>
      <p class="section-description">
        Just pass data and enable AI - columns are auto-generated!
      </p>

      <SmartDataTable
        :data="salesOrders.slice(0, 5)"
        :ai-client="aiClient"
        :ai-infer-columns="true"
        :ai-search="true"
        :ai-insights="true"
        title="Auto-Generated Table"
        :theme="theme"
      />
    </div>

    <!-- Event Log -->
    <div class="event-log">
      <h4>📋 Event Log</h4>
      <div class="log-entries">
        <div v-for="(event, index) in eventLog" :key="index" class="log-entry">
          <span class="log-time">{{ event.time }}</span>
          <span class="log-type">{{ event.type }}</span>
          <span class="log-message">{{ event.message }}</span>
        </div>
      </div>
    </div>

    <!-- Theme Toggle -->
    <div class="theme-toggle">
      <button @click="toggleTheme">
        {{ theme === 'light' ? '🌙' : '☀️' }} Toggle Theme
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SmartDataTable } from '@aivue/smart-datatable';
import { AIClient } from '@aivue/core';
import { salesOrders, supportTickets } from '../data/sampleData';
import type { Column } from '@aivue/smart-datatable';
import type { RowAgent, AITransformation } from '@aivue/smart-datatable';

// AI Client setup
const aiClient = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: 'gpt-4'
});

// State
const activeTab = ref('sales');
const theme = ref<'light' | 'dark'>('light');
const eventLog = ref<Array<{ time: string; type: string; message: string }>>([]);

const tabs = [
  { id: 'sales', label: 'Sales Orders', icon: '📊' },
  { id: 'support', label: 'Support Tickets', icon: '🎫' },
  { id: 'zero-config', label: 'Zero-Config', icon: '⚡' }
];

// Sales columns
const salesColumns: Column[] = [
  { key: 'id', label: 'Order ID', sortable: true },
  { key: 'orderDate', label: 'Date', sortable: true, type: 'date' },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'product', label: 'Product', sortable: true },
  { key: 'quantity', label: 'Qty', sortable: true, type: 'number' },
  { key: 'total', label: 'Total', sortable: true, type: 'number' },
  { key: 'status', label: 'Status', sortable: true }
];

// Ticket columns
const ticketColumns: Column[] = [
  { key: 'id', label: 'Ticket ID', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true, type: 'date' },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'subject', label: 'Subject', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'assignedTo', label: 'Assigned To', sortable: true }
];

// Row Agents for Sales
const salesRowAgents: RowAgent[] = [
  {
    id: 'explain-order',
    label: 'Explain Order',
    icon: '📝',
    promptTemplate: 'Explain this sales order in simple terms for a business user: {{customer}} ordered {{quantity}} units of {{product}} for ${{total}}. Status: {{status}}',
    scope: 'single'
  },
  {
    id: 'generate-email',
    label: 'Generate Follow-up Email',
    icon: '✉️',
    promptTemplate: 'Generate a professional follow-up email for this order: Customer {{customer}}, Product {{product}}, Status {{status}}, Total ${{total}}',
    scope: 'single'
  },
  {
    id: 'predict-delivery',
    label: 'Predict Delivery Date',
    icon: '📅',
    promptTemplate: 'Based on this order placed on {{orderDate}} with status {{status}} to {{country}}, predict the delivery date and explain the reasoning.',
    scope: 'single'
  }
];

// Row Agents for Support Tickets
const ticketRowAgents: RowAgent[] = [
  {
    id: 'explain-ticket',
    label: 'Explain Ticket',
    icon: '📝',
    promptTemplate: 'Summarize this support ticket: {{subject}} - Priority: {{priority}}, Status: {{status}}, Category: {{category}}',
    scope: 'single'
  },
  {
    id: 'suggest-response',
    label: 'Suggest Response',
    icon: '💬',
    promptTemplate: 'Generate a helpful response for this support ticket: Subject: {{subject}}, Category: {{category}}, Priority: {{priority}}',
    scope: 'single'
  },
  {
    id: 'predict-resolution',
    label: 'Predict Resolution Time',
    icon: '⏱️',
    promptTemplate: 'Based on this ticket with priority {{priority}}, category {{category}}, and current status {{status}}, predict the resolution time.',
    scope: 'single'
  }
];

// AI Transformations for Sales
const salesTransformations: AITransformation[] = [
  {
    id: 'standardize-countries',
    label: 'Standardize Country Names',
    description: 'Normalize country names to ISO standard format',
    scope: 'column',
    targetColumn: 'country',
    promptTemplate: 'Standardize these country names to their official ISO names: {{values}}',
    preview: true
  },
  {
    id: 'categorize-customers',
    label: 'Categorize Customers',
    description: 'Add customer tier based on order value',
    scope: 'table',
    promptTemplate: 'Categorize customers as VIP (>$5000), Premium ($2000-$5000), or Standard (<$2000) based on total order value',
    preview: true
  }
];

// Event Handlers
function handleAiQuery(result: any) {
  addLog('AI Query', `Filter applied: ${JSON.stringify(result.filter || 'none')}`);
}

function handleAiInsight(insights: any[]) {
  addLog('AI Insights', `Generated ${insights.length} insights`);
}

function handleAiTransform(result: any) {
  addLog('AI Transform', `Transformed ${result.affectedRows} rows`);
}

function addLog(type: string, message: string) {
  const time = new Date().toLocaleTimeString();
  eventLog.value.unshift({ time, type, message });
  if (eventLog.value.length > 10) {
    eventLog.value.pop();
  }
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
</script>

<style scoped>
.ai-datatable-demo {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.demo-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.demo-subtitle {
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}

.demo-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
}

.tab-btn {
  padding: 1rem 2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #667eea;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.demo-section {
  margin-bottom: 3rem;
}

.demo-section h3 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #666;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.price-cell {
  font-weight: 600;
  color: #2ecc71;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.shipped,
.status-badge.in-progress {
  background: #cfe2ff;
  color: #084298;
}

.status-badge.delivered,
.status-badge.resolved,
.status-badge.closed {
  background: #d1e7dd;
  color: #0f5132;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #842029;
}

.status-badge.open {
  background: #fff3cd;
  color: #856404;
}

.priority-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.priority-badge.low {
  background: #e7f3ff;
  color: #0066cc;
}

.priority-badge.medium {
  background: #fff3cd;
  color: #856404;
}

.priority-badge.high {
  background: #ffe5d0;
  color: #cc5500;
}

.priority-badge.urgent {
  background: #f8d7da;
  color: #842029;
}

.event-log {
  margin-top: 3rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.event-log h4 {
  margin-bottom: 1rem;
}

.log-entries {
  max-height: 200px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.9rem;
}

.log-time {
  color: #999;
  min-width: 80px;
}

.log-type {
  font-weight: 600;
  color: #667eea;
  min-width: 120px;
}

.log-message {
  color: #333;
}

.theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
}

.theme-toggle button {
  padding: 1rem 1.5rem;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
}

.theme-toggle button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}
</style>


