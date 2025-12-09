<template>
  <div class="smart-datatable" :class="{ 'dark-theme': theme === 'dark' }">
    <!-- Header Section -->
    <div class="datatable-header">
      <div class="header-left">
        <h3 v-if="title" class="datatable-title">{{ title }}</h3>
        <span class="datatable-count">{{ filteredData.length }} {{ filteredData.length === 1 ? 'item' : 'items' }}</span>
      </div>
      <div class="header-right">
        <!-- Actions -->
        <div class="datatable-actions">
          <button
            v-if="aiInsightsEnabled"
            @click="getAIInsights"
            class="action-btn"
            title="AI Insights"
            :disabled="loading"
          >
            <span>💡</span>
          </button>
          <button
            v-if="props.showChat && props.aiClient"
            @click="showAiChatPanel = !showAiChatPanel"
            class="action-btn"
            title="Chat with Table"
          >
            <span>💬</span>
          </button>
          <button @click="toggleColumnVisibility" class="action-btn" title="Column Visibility">
            <span>⚙️</span>
          </button>
          <button @click="exportData('csv')" class="action-btn" title="Export CSV">
            <span>📥</span>
          </button>
        </div>
      </div>
    </div>

    <!-- AI Search Bar (Full Width) -->
    <div v-if="props.aiSearch" class="ai-search-container">
      <div class="search-box ai-mode">
        <span class="search-icon">🤖</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Ask AI: e.g., show products where price > 100"
          class="search-input"
          @input="handleSearch"
          @keyup.enter="props.aiClient ? handleAiSearch(searchQuery) : null"
          :disabled="aiSearchLoading"
        />
        <button
          v-if="searchQuery && props.aiClient && !aiSearchLoading"
          @click="handleAiSearch(searchQuery)"
          class="ai-search-btn"
          title="Search with AI"
        >
          🔍 Search
        </button>
        <button
          v-if="aiSearchLoading"
          class="ai-search-btn loading"
          disabled
        >
          ⏳ Processing...
        </button>
        <button
          v-if="aiFilterActive && !aiSearchLoading"
          @click="clearAiFilter"
          class="clear-filter-btn"
          title="Clear AI Filter"
        >
          ✕ Clear
        </button>
        <div v-if="!props.aiClient" class="ai-warning">
          ⚠️ AI Client not configured. Please provide an aiClient prop to enable AI search.
        </div>
        <div v-if="aiFilterActive && currentAiFilter" class="ai-filter-info">
          🤖 AI Filter Active: {{ aiFilterExplanation || 'Filtering data...' }}
        </div>
      </div>
    </div>

    <!-- AI Insights Panel -->
    <div v-if="showAiInsightsPanel && aiInsightsComposable" class="insights-panel">
      <div class="insights-header">
        <h4>💡 AI Insights</h4>
        <button @click="showAiInsightsPanel = false" class="close-btn">×</button>
      </div>
      <div class="insights-content">
        <div v-if="aiInsightsComposable.loading.value" class="insights-loading">
          Analyzing data...
        </div>
        <div v-else-if="aiInsightsComposable.insights.value.length > 0" class="insights-list">
          <div
            v-for="insight in aiInsightsComposable.insights.value"
            :key="insight.id"
            class="insight-item"
            :class="`insight-${insight.category}`"
          >
            <div class="insight-header">
              <span class="insight-category">{{ insight.category }}</span>
              <span class="insight-confidence">{{ Math.round(insight.confidence * 100) }}%</span>
            </div>
            <h5 class="insight-title">{{ insight.title }}</h5>
            <p class="insight-description">{{ insight.description }}</p>
          </div>
        </div>
        <div v-else class="insights-empty">
          No insights available. Click "AI Insights" to generate.
        </div>
      </div>
    </div>

    <!-- AI Filter Active Indicator -->
    <div v-if="aiFilterActive && currentAiFilter" class="ai-filter-indicator">
      <span class="filter-icon">🤖</span>
      <span class="filter-text">AI Filter Active</span>
      <button @click="clearAiFilter" class="clear-btn">Clear</button>
    </div>

    <!-- AI Chat Panel -->
    <div v-if="showAiChatPanel" class="chat-panel">
      <div class="chat-header">
        <h4>💬 Chat with Table</h4>
        <button @click="showAiChatPanel = false" class="close-btn">×</button>
      </div>
      <div class="chat-content">
        <div class="chat-messages" ref="chatMessages">
          <div v-for="(message, index) in chatHistory" :key="index" :class="['chat-message', message.role]">
            <div class="message-content">
              <strong v-if="message.role === 'user'">You:</strong>
              <strong v-else>AI:</strong>
              <p>{{ message.content }}</p>
            </div>
          </div>
          <div v-if="chatLoading" class="chat-message assistant">
            <div class="message-content">
              <strong>AI:</strong>
              <p class="typing-indicator">Thinking...</p>
            </div>
          </div>
        </div>
        <div class="chat-input-container">
          <input
            v-model="chatInput"
            type="text"
            placeholder="Ask about the data... e.g., 'What is the average order value?'"
            class="chat-input"
            @keyup.enter="sendChatMessage"
          />
          <button @click="sendChatMessage" :disabled="!chatInput.trim() || chatLoading" class="chat-send-btn">
            Send
          </button>
        </div>
      </div>
    </div>

    <!-- Column Visibility Panel -->
    <div v-if="showColumnPanel" class="column-panel">
      <div class="panel-header">
        <h4>Column Visibility</h4>
        <button @click="showColumnPanel = false" class="close-btn">×</button>
      </div>
      <div class="panel-content">
        <label v-for="col in allColumns" :key="col.key" class="column-checkbox">
          <input type="checkbox" v-model="col.visible" />
          <span>{{ col.label }}</span>
        </label>
      </div>
    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th v-if="selectable" class="select-column">
              <input type="checkbox" @change="toggleSelectAll" :checked="allSelected" />
            </th>
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              @click="handleSort(column.key)"
              :class="{ sortable: column.sortable !== false, sorted: sortKey === column.key }"
            >
              <div class="th-content">
                <span>{{ column.label }}</span>
                <span v-if="sortKey === column.key" class="sort-icon">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th v-if="rowAgents && rowAgents.length > 0" class="ai-agents-column">AI</th>
            <th v-if="actions && actions.length > 0" class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td :colspan="columnCount + (rowAgents?.length ? 1 : 0)" class="loading-cell">
              <div class="loading-spinner"></div>
              <span>Loading...</span>
            </td>
          </tr>
          <tr v-else-if="paginatedData.length === 0" class="empty-row">
            <td :colspan="columnCount" class="empty-cell">
              <span>{{ emptyMessage }}</span>
            </td>
          </tr>
          <tr
            v-else
            v-for="(row, index) in paginatedData"
            :key="getRowKey(row, index)"
            :class="{ selected: selectedRows.includes(row) }"
            @click="handleRowClick(row)"
          >
            <td v-if="selectable" class="select-column">
              <input type="checkbox" :checked="selectedRows.includes(row)" @change="toggleRowSelection(row)" />
            </td>
            <td v-for="column in visibleColumns" :key="column.key">
              <slot :name="`cell-${column.key}`" :row="row" :value="getCellValue(row, column.key)">
                {{ formatCellValue(row, column) }}
              </slot>
            </td>
            <td v-if="rowAgents && rowAgents.length > 0" class="ai-agents-column">
              <div class="ai-agents-menu">
                <button class="ai-menu-trigger" @click.stop="toggleAgentMenu(row)">
                  🤖
                </button>
                <div v-if="activeAgentMenu === row" class="ai-agents-dropdown">
                  <button
                    v-for="agent in rowAgents"
                    :key="agent.id"
                    @click.stop="executeRowAgent(agent, row); activeAgentMenu = null"
                    class="agent-option"
                  >
                    <span v-if="agent.icon">{{ agent.icon }}</span>
                    {{ agent.label }}
                  </button>
                </div>
              </div>
            </td>
            <td v-if="actions && actions.length > 0" class="actions-column">
              <div class="row-actions">
                <button
                  v-for="action in actions"
                  :key="action.label"
                  @click.stop="action.handler(row)"
                  class="action-btn-small"
                  :title="action.label"
                >
                  {{ action.icon || action.label }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && filteredData.length > 0" class="datatable-footer">
      <div class="footer-left">
        <span class="page-info">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredData.length) }} of {{ filteredData.length }}
        </span>
        <select v-model.number="pageSize" class="page-size-select">
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }} per page</option>
        </select>
      </div>
      <div class="footer-right">
        <button @click="previousPage" :disabled="currentPage === 1" class="page-btn">Previous</button>
        <span class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="{ active: currentPage === page }"
            class="page-number"
          >
            {{ page }}
          </button>
        </span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { AIClient } from '@aivue/core';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  visible?: boolean;
  formatter?: (value: any, row: any) => string;
  type?: 'string' | 'number' | 'date' | 'boolean';
}

export interface Action {
  label: string;
  icon?: string;
  handler: (row: any) => void;
}

import type {
  AISearchConfig,
  AIInsightsConfig,
  RowAgent,
  AITransformation,
  OpenAPIConfig
} from '../types/ai';

interface Props {
  data: any[];
  columns?: Column[]; // Now optional if using AI inference
  title?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  selectable?: boolean;
  actions?: Action[];
  theme?: 'light' | 'dark';
  rowKey?: string;

  // AI Configuration
  aiClient?: AIClient;
  aiSearch?: boolean | AISearchConfig;
  aiInsights?: boolean | AIInsightsConfig;
  aiInferColumns?: boolean;
  rowAgents?: RowAgent[];
  aiTransformations?: AITransformation[];
  openApiConfig?: OpenAPIConfig;

  // Chat integration
  showChat?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Search with AI...',
  emptyMessage: 'No data available',
  pagination: true,
  pageSize: 10,
  pageSizeOptions: () => [5, 10, 25, 50, 100],
  selectable: false,
  theme: 'light',
  rowKey: 'id',
  aiSearch: false,
  aiInsights: false,
  aiInferColumns: false,
  showChat: false
});

const emit = defineEmits<{
  rowClick: [row: any];
  selectionChange: [rows: any[]];
  export: [data: any[], format: string];
  aiQuery: [result: any];
  aiInsight: [insights: any[]];
  aiTransform: [result: any];
}>();

// Import AI composables
import { useAiTableQuery } from '../composables/useAiTableQuery';
import { useAiInsights } from '../composables/useAiInsights';
import { useAiRowAgents } from '../composables/useAiRowAgents';
import { useAiTransformations } from '../composables/useAiTransformations';
import { useOpenApiIntegration } from '../composables/useOpenApiIntegration';
import type { TableSchema, ColumnSchema } from '../types/ai';

// State
const searchQuery = ref('');
const sortKey = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentPage = ref(1);
const pageSize = ref(props.pageSize);
const selectedRows = ref<any[]>([]);
const loading = ref(false);
const showInsights = ref(false);
const insights = ref('');
const showColumnPanel = ref(false);
const allColumns = ref<Column[]>([]);

// AI State
const aiSearchEnabled = computed(() => !!props.aiSearch && !!props.aiClient);
const aiInsightsEnabled = computed(() => !!props.aiInsights && !!props.aiClient);
const showAiInsightsPanel = ref(false);
const showAiChatPanel = ref(false);
const aiFilterActive = ref(false);
const currentAiFilter = ref<any>(null);
const aiFilterExplanation = ref<string>('');
const aiSearchLoading = ref(false);
const activeAgentMenu = ref<any>(null);

// Chat State
const chatHistory = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
const chatInput = ref('');
const chatLoading = ref(false);
const chatMessages = ref<HTMLElement | null>(null);

// Build table schema for AI
const tableSchema = computed<TableSchema>(() => {
  const columns: ColumnSchema[] = visibleColumns.value.map(col => ({
    key: col.key,
    label: col.label,
    type: col.type || inferColumnType(props.data, col.key),
    examples: getColumnExamples(props.data, col.key, 3)
  }));

  return {
    columns,
    rowCount: props.data.length,
    sampleRows: props.data.slice(0, 5)
  };
});

// Initialize AI composables
let aiQuery: ReturnType<typeof useAiTableQuery> | null = null;
let aiInsightsComposable: ReturnType<typeof useAiInsights> | null = null;
let aiRowAgents: ReturnType<typeof useAiRowAgents> | null = null;
let aiTransforms: ReturnType<typeof useAiTransformations> | null = null;
let openApiIntegration: ReturnType<typeof useOpenApiIntegration> | null = null;

// Initialize columns
onMounted(async () => {
  // Handle column initialization
  if (props.columns && props.columns.length > 0) {
    allColumns.value = props.columns.map(col => ({
      ...col,
      visible: col.visible !== false
    }));
  } else if (props.aiInferColumns && props.openApiConfig && props.aiClient) {
    // Infer columns from OpenAPI
    try {
      openApiIntegration = useOpenApiIntegration({
        aiClient: props.aiClient,
        config: props.openApiConfig
      });
      const inferredColumns = await openApiIntegration.inferColumns();
      allColumns.value = inferredColumns.map(col => ({ ...col, visible: true }));
    } catch (err) {
      console.error('Failed to infer columns from OpenAPI:', err);
    }
  } else if (props.data.length > 0) {
    // Auto-generate columns from data
    const firstRow = props.data[0];
    allColumns.value = Object.keys(firstRow).map(key => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
      sortable: true,
      visible: true
    }));
  }

  // Initialize AI composables if AI client is provided
  if (props.aiClient) {
    if (aiSearchEnabled.value) {
      aiQuery = useAiTableQuery({
        aiClient: props.aiClient,
        schema: tableSchema,
        onQueryResult: (result) => {
          currentAiFilter.value = result.filter;
          aiFilterActive.value = true;
          emit('aiQuery', result);
        }
      });
    }

    if (aiInsightsEnabled.value) {
      aiInsightsComposable = useAiInsights({
        aiClient: props.aiClient,
        schema: tableSchema,
        data: computed(() => props.data),
        config: typeof props.aiInsights === 'object' ? props.aiInsights : undefined
      });
    }

    if (props.rowAgents && props.rowAgents.length > 0) {
      aiRowAgents = useAiRowAgents({
        aiClient: props.aiClient,
        schema: tableSchema,
        agents: props.rowAgents
      });
    }

    if (props.aiTransformations && props.aiTransformations.length > 0) {
      aiTransforms = useAiTransformations({
        aiClient: props.aiClient,
        schema: tableSchema,
        data: computed(() => props.data),
        transformations: props.aiTransformations
      });
    }
  }
});

// Computed
const visibleColumns = computed(() => allColumns.value.filter(col => col.visible));

const filteredData = computed(() => {
  let result = [...props.data];

  // AI Filter (takes precedence if active)
  if (aiFilterActive.value && currentAiFilter.value && aiQuery) {
    result = aiQuery.applyFilter(result, currentAiFilter.value);
  }
  // Regular search filter (only if AI filter not active)
  else if (searchQuery.value && !aiFilterActive.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(row => {
      return visibleColumns.value.some(col => {
        const value = getCellValue(row, col.key);
        return String(value).toLowerCase().includes(query);
      });
    });
  }

  // Sort
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = getCellValue(a, sortKey.value);
      const bVal = getCellValue(b, sortKey.value);

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return sortOrder.value === 'asc' ? comparison : -comparison;
    });
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value));

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
const endIndex = computed(() => startIndex.value + pageSize.value);

const paginatedData = computed(() => {
  if (!props.pagination) return filteredData.value;
  return filteredData.value.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const allSelected = computed(() => {
  return paginatedData.value.length > 0 &&
         paginatedData.value.every(row => selectedRows.value.includes(row));
});

const columnCount = computed(() => {
  let count = visibleColumns.value.length;
  if (props.selectable) count++;
  if (props.actions && props.actions.length > 0) count++;
  return count;
});

// Methods
function getCellValue(row: any, key: string) {
  return key.split('.').reduce((obj, k) => obj?.[k], row);
}

function formatCellValue(row: any, column: Column) {
  const value = getCellValue(row, column.key);
  if (column.formatter) {
    return column.formatter(value, row);
  }
  return value ?? '';
}

function handleSort(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
}

function handleSearch() {
  currentPage.value = 1;
}

function getRowKey(row: any, index: number) {
  return row[props.rowKey] ?? index;
}

function handleRowClick(row: any) {
  emit('rowClick', row);
}

function toggleRowSelection(row: any) {
  const index = selectedRows.value.indexOf(row);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(row);
  }
  emit('selectionChange', selectedRows.value);
}

function toggleSelectAll() {
  if (allSelected.value) {
    selectedRows.value = selectedRows.value.filter(row => !paginatedData.value.includes(row));
  } else {
    const newSelections = paginatedData.value.filter(row => !selectedRows.value.includes(row));
    selectedRows.value.push(...newSelections);
  }
  emit('selectionChange', selectedRows.value);
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(page: number) {
  currentPage.value = page;
}

function toggleColumnVisibility() {
  showColumnPanel.value = !showColumnPanel.value;
}

// AI Methods
async function handleAiSearch(query: string) {
  if (!aiQuery) {
    console.error('AI Query composable not initialized');
    alert('AI search is not available. Please configure an AI client.');
    return;
  }

  if (!query || query.trim().length === 0) {
    return;
  }

  aiSearchLoading.value = true;
  aiFilterExplanation.value = '';

  try {
    console.log('🔍 Processing AI search query:', query);
    const result = await aiQuery.queryToFilter(query);
    console.log('✅ AI Search result:', { query, filter: result.filter, explanation: result.explanation });

    aiFilterExplanation.value = result.explanation || 'Filter applied';

    // Filter will be applied via currentAiFilter reactive ref (set in onQueryResult callback)
    // Show success message
    if (result.filter) {
      console.log('✅ Filter active, table will update automatically');
    } else {
      console.log('⚠️ No filter generated from query');
      aiFilterExplanation.value = 'No filter could be generated from this query';
    }
  } catch (err: any) {
    console.error('❌ AI search failed:', err);
    alert(`AI search failed: ${err.message || 'Unknown error'}. Please check your API key and try again.`);
    aiFilterActive.value = false;
    currentAiFilter.value = null;
  } finally {
    aiSearchLoading.value = false;
  }
}

function clearAiFilter() {
  currentAiFilter.value = null;
  aiFilterActive.value = false;
  aiFilterExplanation.value = '';
  searchQuery.value = '';
  console.log('🧹 AI filter cleared');
}

async function getAIInsights() {
  if (!aiInsightsComposable) {
    insights.value = 'AI Insights not configured. Please enable aiInsights prop.';
    showInsights.value = true;
    return;
  }

  try {
    const generatedInsights = await aiInsightsComposable.generateInsights();
    emit('aiInsight', generatedInsights);
    showAiInsightsPanel.value = true;
  } catch (error) {
    console.error('Failed to generate insights:', error);
  }
}

async function executeRowAgent(agent: RowAgent, row: any) {
  if (!aiRowAgents) return;

  try {
    const result = await aiRowAgents.executeAgent(agent, row);
    // Show result in modal or toast
    alert(`${agent.label}:\n\n${result.result}`);
  } catch (err) {
    console.error('Row agent failed:', err);
  }
}

async function sendChatMessage() {
  if (!chatInput.value.trim() || !props.aiClient) return;

  const userMessage = chatInput.value.trim();
  chatHistory.value.push({ role: 'user', content: userMessage });
  chatInput.value = '';
  chatLoading.value = true;

  try {
    // First, check if this is a filter/search request
    const filterKeywords = ['show', 'filter', 'find', 'search', 'where', 'get', 'display', 'list'];
    const isFilterRequest = filterKeywords.some(keyword =>
      userMessage.toLowerCase().includes(keyword)
    );

    if (isFilterRequest && aiQuery) {
      // This is a filter request - execute it!
      console.log('💬 Chat detected filter request:', userMessage);

      try {
        const result = await aiQuery.queryToFilter(userMessage);

        if (result.filter) {
          // Filter was successfully applied via the onQueryResult callback
          const rowCount = filteredData.value.length;
          const response = `✅ Filter applied: ${result.explanation || 'Showing filtered results'}\n\n📊 Found ${rowCount} matching row${rowCount !== 1 ? 's' : ''}.`;
          chatHistory.value.push({ role: 'assistant', content: response });

          console.log('✅ Chat filter applied successfully');
        } else {
          chatHistory.value.push({
            role: 'assistant',
            content: '❌ I couldn\'t create a filter from that request. Could you rephrase it? For example: "show products where price > 100"'
          });
        }
      } catch (filterErr) {
        console.error('Chat filter failed:', filterErr);
        chatHistory.value.push({
          role: 'assistant',
          content: '❌ Failed to apply filter. Please try rephrasing your request.'
        });
      }
    } else {
      // This is a question - answer it normally
      const systemMessage = `You are a helpful assistant analyzing a data table with ${filteredData.value.length} rows.

Table Schema:
${JSON.stringify(tableSchema.value, null, 2)}

Sample Data (first 3 rows):
${JSON.stringify(filteredData.value.slice(0, 3), null, 2)}

Instructions:
- Provide clear, concise answers (2-3 sentences max)
- Use bullet points for lists
- Don't show SQL queries or technical code
- Be friendly and helpful
- If asked about filtering, suggest using the AI search box above instead`;

      const messages = [
        { role: 'system' as const, content: systemMessage },
        { role: 'user' as const, content: userMessage }
      ];

      const responseContent = await props.aiClient.chat(messages);
      chatHistory.value.push({ role: 'assistant', content: responseContent });
    }

    // Scroll to bottom
    setTimeout(() => {
      if (chatMessages.value) {
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
      }
    }, 100);
  } catch (err) {
    console.error('Chat failed:', err);
    chatHistory.value.push({
      role: 'assistant',
      content: '❌ Sorry, I encountered an error. Please try again.'
    });
  } finally {
    chatLoading.value = false;
  }
}

function toggleAgentMenu(row: any) {
  activeAgentMenu.value = activeAgentMenu.value === row ? null : row;
}

async function executeTransformation(transformation: AITransformation, targetData?: any[]) {
  if (!aiTransforms) return;

  try {
    const result = await aiTransforms.executeTransformation(transformation, targetData);
    emit('aiTransform', result);

    if (transformation.preview && aiTransforms.previewChanges.value.length > 0) {
      // Show preview modal
      const confirmed = confirm(`Preview: ${result.affectedRows} rows will be changed. Apply?`);
      if (confirmed) {
        aiTransforms.applyPreview();
      } else {
        aiTransforms.cancelPreview();
      }
    }
  } catch (err) {
    console.error('Transformation failed:', err);
  }
}

// Helper functions for AI
function inferColumnType(data: any[], key: string): ColumnSchema['type'] {
  if (data.length === 0) return 'string';

  const sample = data.slice(0, 10).map(row => row[key]).filter(v => v != null);
  if (sample.length === 0) return 'string';

  const firstValue = sample[0];
  if (typeof firstValue === 'number') return 'number';
  if (typeof firstValue === 'boolean') return 'boolean';
  if (firstValue instanceof Date) return 'date';
  if (Array.isArray(firstValue)) return 'array';
  if (typeof firstValue === 'object') return 'object';

  // Check if string looks like a date
  if (typeof firstValue === 'string' && !isNaN(Date.parse(firstValue))) {
    return 'date';
  }

  return 'string';
}

function getColumnExamples(data: any[], key: string, count: number = 3): any[] {
  return data
    .slice(0, count * 3)
    .map(row => row[key])
    .filter((v, i, arr) => v != null && arr.indexOf(v) === i)
    .slice(0, count);
}

function exportData(format: 'csv' | 'json') {
  emit('export', filteredData.value, format);

  if (format === 'csv') {
    const csv = convertToCSV(filteredData.value);
    downloadFile(csv, 'data.csv', 'text/csv');
  } else if (format === 'json') {
    const json = JSON.stringify(filteredData.value, null, 2);
    downloadFile(json, 'data.json', 'application/json');
  }
}

function convertToCSV(data: any[]) {
  if (data.length === 0) return '';

  const headers = visibleColumns.value.map(col => col.label).join(',');
  const rows = data.map(row => {
    return visibleColumns.value.map(col => {
      const value = getCellValue(row, col.key);
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Watch for page size changes
watch(pageSize, () => {
  currentPage.value = 1;
});

// Watch for data changes
watch(() => props.data, () => {
  currentPage.value = 1;
  selectedRows.value = [];
});
</script>

<style scoped>
.smart-datatable {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.dark-theme {
  background: #1e1e1e;
  color: #e0e0e0;
}

/* Header */
.datatable-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 16px;
}

.dark-theme .datatable-header {
  border-bottom-color: #333;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.datatable-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.dark-theme .datatable-title {
  color: #ffffff;
}

.datatable-count {
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 13px;
  color: #666;
}

.dark-theme .datatable-count {
  background: #333;
  color: #aaa;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* AI Search Container */
.ai-search-container {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 12px;
  border: 2px solid #667eea30;
}

/* Search */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.search-box.ai-mode {
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark-theme .search-box.ai-mode {
  background: #2a2a2a;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
}

.ai-mode .search-input {
  border: none;
  font-size: 16px;
  padding: 12px 16px;
}

.search-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.dark-theme .search-input {
  background: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}

.search-icon {
  font-size: 1.2rem;
  color: #667eea;
}

.ai-search-btn,
.clear-filter-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.ai-search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.ai-search-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ai-search-btn.loading {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.ai-search-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.clear-filter-btn {
  background: #f44336;
  color: white;
}

.clear-filter-btn:hover {
  background: #d32f2f;
}

.ai-warning {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  color: #856404;
  font-size: 14px;
}

.dark-theme .ai-warning {
  background: #3a3000;
  border-color: #ffc107;
  color: #ffc107;
}

.ai-filter-info {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 1px solid #4caf50;
  border-radius: 8px;
  color: #2e7d32;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dark-theme .ai-filter-info {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  border-color: #4caf50;
  color: #a5d6a7;
}

/* Actions */
.datatable-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 10px 16px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.action-btn:hover:not(:disabled) {
  background: #e9ecef;
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark-theme .action-btn {
  background: #2a2a2a;
  border-color: #444;
}

.dark-theme .action-btn:hover:not(:disabled) {
  background: #333;
}

/* Insights Panel */
.insights-panel {
  margin: 20px;
  padding: 16px;
  background: #f0f7ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
}

.dark-theme .insights-panel {
  background: #1e3a5f;
  border-color: #2563eb;
}

.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.insights-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.close-btn:hover {
  color: #000;
}

.dark-theme .close-btn:hover {
  color: #fff;
}

.insights-content p {
  margin: 0;
  line-height: 1.6;
}

/* Column Panel */
.column-panel {
  margin: 20px;
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.dark-theme .column-panel {
  background: #2a2a2a;
  border-color: #444;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.panel-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.column-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
}

.column-checkbox input {
  cursor: pointer;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
}

.dark-theme .data-table thead {
  background: #2a2a2a;
  border-bottom-color: #444;
}

.data-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #1a1a1a;
  white-space: nowrap;
}

.dark-theme .data-table th {
  color: #e0e0e0;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-table th.sortable:hover {
  background: #e9ecef;
}

.dark-theme .data-table th.sortable:hover {
  background: #333;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-icon {
  font-size: 12px;
  color: #4f46e5;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.dark-theme .data-table td {
  border-bottom-color: #333;
}

.data-table tbody tr {
  transition: background-color 0.2s;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

.dark-theme .data-table tbody tr:hover {
  background: #2a2a2a;
}

.data-table tbody tr.selected {
  background: #eff6ff;
}

.dark-theme .data-table tbody tr.selected {
  background: #1e3a5f;
}

.select-column {
  width: 50px;
  text-align: center;
}

.actions-column {
  width: 120px;
  text-align: center;
}

.row-actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-btn-small {
  padding: 6px 10px;
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn-small:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.dark-theme .action-btn-small {
  background: #2a2a2a;
  border-color: #444;
}

.dark-theme .action-btn-small:hover {
  background: #333;
}

/* Loading & Empty States */
.loading-row,
.empty-row {
  text-align: center;
}

.loading-cell,
.empty-cell {
  padding: 40px;
  color: #666;
}

.loading-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Footer / Pagination */
.datatable-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 16px;
}

.dark-theme .datatable-footer {
  border-top-color: #333;
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.dark-theme .page-info {
  color: #aaa;
}

.page-size-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background: white;
}

.dark-theme .page-size-select {
  background: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}

.page-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #4f46e5;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dark-theme .page-btn {
  background: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}

.dark-theme .page-btn:hover:not(:disabled) {
  background: #333;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  padding: 8px 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 40px;
  transition: all 0.2s;
}

.page-number:hover {
  background: #f8f9fa;
  border-color: #4f46e5;
}

.page-number.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.dark-theme .page-number {
  background: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}

.dark-theme .page-number:hover {
  background: #333;
}

.dark-theme .page-number.active {
  background: #4f46e5;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .datatable-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left,
  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .search-input {
    min-width: 100%;
  }

  .datatable-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .footer-left,
  .footer-right {
    width: 100%;
    justify-content: center;
  }

  .table-container {
    overflow-x: scroll;
  }
}

/* Chat Panel */
.chat-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 400px;
  max-height: 600px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dark-theme .chat-panel {
  background: #1a1a1a;
  border: 1px solid #333;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.chat-header h4 {
  margin: 0;
  font-size: 16px;
}

.chat-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  max-height: 400px;
}

.chat-message {
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message.user .message-content {
  background: #eff6ff;
  border-left: 3px solid #4f46e5;
}

.chat-message.assistant .message-content {
  background: #f8f9fa;
  border-left: 3px solid #10b981;
}

.dark-theme .chat-message.user .message-content {
  background: #1e3a5f;
}

.dark-theme .chat-message.assistant .message-content {
  background: #2a2a2a;
}

.message-content {
  padding: 12px;
  border-radius: 8px;
}

.message-content strong {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.message-content p {
  margin: 0;
  line-height: 1.5;
  color: #333;
}

.dark-theme .message-content p {
  color: #e0e0e0;
}

.typing-indicator {
  font-style: italic;
  color: #666;
}

.chat-input-container {
  display: flex;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

.dark-theme .chat-input-container {
  border-top-color: #333;
}

.chat-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #4f46e5;
}

.dark-theme .chat-input {
  background: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}

.chat-send-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.chat-send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.chat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>


