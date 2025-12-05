<template>
  <div class="smart-datatable" :class="{ 'dark-theme': theme === 'dark' }">
    <!-- Header Section -->
    <div class="datatable-header">
      <div class="header-left">
        <h3 v-if="title" class="datatable-title">{{ title }}</h3>
        <span class="datatable-count">{{ filteredData.length }} {{ filteredData.length === 1 ? 'item' : 'items' }}</span>
      </div>
      <div class="header-right">
        <!-- AI Search -->
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="search-input"
            @input="handleSearch"
          />
          <span class="search-icon">🔍</span>
        </div>
        
        <!-- Actions -->
        <div class="datatable-actions">
          <button @click="toggleColumnVisibility" class="action-btn" title="Column Visibility">
            <span>⚙️</span>
          </button>
          <button @click="exportData('csv')" class="action-btn" title="Export CSV">
            <span>📥</span>
          </button>
          <button @click="getAIInsights" class="action-btn" title="AI Insights" :disabled="loading">
            <span>🤖</span>
          </button>
        </div>
      </div>
    </div>

    <!-- AI Insights Panel -->
    <div v-if="showInsights && insights" class="insights-panel">
      <div class="insights-header">
        <h4>📊 AI Insights</h4>
        <button @click="showInsights = false" class="close-btn">×</button>
      </div>
      <div class="insights-content">
        <p>{{ insights }}</p>
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
            <th v-if="actions && actions.length > 0" class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td :colspan="columnCount" class="loading-cell">
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

interface Props {
  data: any[];
  columns: Column[];
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
  aiClient?: AIClient;
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Search with AI...',
  emptyMessage: 'No data available',
  pagination: true,
  pageSize: 10,
  pageSizeOptions: () => [5, 10, 25, 50, 100],
  selectable: false,
  theme: 'light',
  rowKey: 'id'
});

const emit = defineEmits<{
  rowClick: [row: any];
  selectionChange: [rows: any[]];
  export: [data: any[], format: string];
}>();

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

// Initialize columns
onMounted(() => {
  allColumns.value = props.columns.map(col => ({
    ...col,
    visible: col.visible !== false
  }));
});

// Computed
const visibleColumns = computed(() => allColumns.value.filter(col => col.visible));

const filteredData = computed(() => {
  let result = [...props.data];

  // Search filter
  if (searchQuery.value) {
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

async function getAIInsights() {
  if (!props.aiClient) {
    insights.value = 'AI Client not configured. Please provide an AIClient instance.';
    showInsights.value = true;
    return;
  }

  loading.value = true;
  try {
    const dataSnapshot = filteredData.value.slice(0, 10);
    const prompt = `Analyze this data and provide key insights:\n${JSON.stringify(dataSnapshot, null, 2)}`;

    const response = await props.aiClient.chat([
      { role: 'user', content: prompt }
    ]);

    insights.value = response.content;
    showInsights.value = true;
  } catch (error) {
    insights.value = 'Failed to generate insights. Please try again.';
    showInsights.value = true;
  } finally {
    loading.value = false;
  }
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

/* Search */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 10px 40px 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  min-width: 250px;
  transition: all 0.2s;
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
  position: absolute;
  right: 12px;
  pointer-events: none;
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
</style>


