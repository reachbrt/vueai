<template>
  <div class="smart-datatable-demo">
    <div class="demo-section">
      <h3 class="demo-title">Product Inventory</h3>
      <p class="demo-description">
        Manage your product inventory with AI-powered search, sorting, and insights. 
        Try searching, sorting columns, selecting rows, or getting AI insights about your data.
      </p>

      <SmartDataTable
        :data="products"
        :columns="columns"
        :ai-client="aiClient"
        title="Products"
        search-placeholder="Search products with AI..."
        :pagination="true"
        :page-size="10"
        :page-size-options="[5, 10, 25, 50]"
        :selectable="true"
        :actions="actions"
        :theme="theme"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange"
        @export="handleExport"
      >
        <!-- Custom cell for price -->
        <template #cell-price="{ value }">
          <span class="price-cell">${{ value.toFixed(2) }}</span>
        </template>
        
        <!-- Custom cell for stock -->
        <template #cell-stock="{ value }">
          <span :class="['stock-cell', value > 20 ? 'in-stock' : value > 10 ? 'low-stock' : 'out-of-stock']">
            {{ value }} units
          </span>
        </template>

        <!-- Custom cell for status -->
        <template #cell-status="{ value }">
          <span :class="['status-badge', value.toLowerCase()]">
            {{ value }}
          </span>
        </template>
      </SmartDataTable>
    </div>

    <!-- Controls -->
    <div class="demo-controls">
      <h4>Demo Controls</h4>
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="darkMode" @change="toggleTheme" />
          Dark Theme
        </label>
      </div>
      <div class="control-group">
        <button @click="addRandomProduct" class="control-btn">Add Random Product</button>
        <button @click="clearSelection" class="control-btn">Clear Selection</button>
      </div>
      <div v-if="selectedRows.length > 0" class="selection-info">
        <strong>Selected:</strong> {{ selectedRows.length }} item(s)
      </div>
    </div>

    <!-- Event Log -->
    <div class="event-log">
      <h4>Event Log</h4>
      <div class="log-entries">
        <div v-for="(event, index) in eventLog" :key="index" class="log-entry">
          <span class="log-time">{{ event.time }}</span>
          <span class="log-message">{{ event.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { SmartDataTable } from '../../../packages/smart-datatable/src';

const props = defineProps({
  aiClient: {
    type: Object,
    default: null
  }
});

const darkMode = ref(false);
const theme = computed(() => darkMode.value ? 'dark' : 'light');
const selectedRows = ref([]);
const eventLog = ref([]);

const products = ref([
  { id: 1, name: 'Laptop Pro 15"', category: 'Electronics', price: 1299.99, stock: 25, status: 'Active', sku: 'LAP-001' },
  { id: 2, name: 'Wireless Mouse', category: 'Accessories', price: 29.99, stock: 150, status: 'Active', sku: 'MOU-002' },
  { id: 3, name: 'Mechanical Keyboard', category: 'Accessories', price: 89.99, stock: 45, status: 'Active', sku: 'KEY-003' },
  { id: 4, name: 'USB-C Hub', category: 'Accessories', price: 49.99, stock: 8, status: 'Active', sku: 'HUB-004' },
  { id: 5, name: '27" Monitor', category: 'Electronics', price: 399.99, stock: 12, status: 'Active', sku: 'MON-005' },
  { id: 6, name: 'Webcam HD', category: 'Electronics', price: 79.99, stock: 30, status: 'Active', sku: 'CAM-006' },
  { id: 7, name: 'Desk Lamp', category: 'Office', price: 34.99, stock: 60, status: 'Active', sku: 'LAM-007' },
  { id: 8, name: 'Ergonomic Chair', category: 'Furniture', price: 299.99, stock: 5, status: 'Low Stock', sku: 'CHR-008' },
  { id: 9, name: 'Standing Desk', category: 'Furniture', price: 499.99, stock: 3, status: 'Low Stock', sku: 'DSK-009' },
  { id: 10, name: 'Headphones', category: 'Audio', price: 149.99, stock: 40, status: 'Active', sku: 'HDP-010' },
  { id: 11, name: 'Microphone', category: 'Audio', price: 99.99, stock: 22, status: 'Active', sku: 'MIC-011' },
  { id: 12, name: 'Cable Organizer', category: 'Accessories', price: 12.99, stock: 200, status: 'Active', sku: 'ORG-012' },
  { id: 13, name: 'Laptop Stand', category: 'Accessories', price: 39.99, stock: 35, status: 'Active', sku: 'STD-013' },
  { id: 14, name: 'External SSD 1TB', category: 'Storage', price: 129.99, stock: 18, status: 'Active', sku: 'SSD-014' },
  { id: 15, name: 'Portable Charger', category: 'Electronics', price: 44.99, stock: 75, status: 'Active', sku: 'CHG-015' }
]);

const columns = ref([
  { key: 'id', label: 'ID', sortable: true, type: 'number' },
  { key: 'name', label: 'Product Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true, type: 'number' },
  { key: 'stock', label: 'Stock', sortable: true, type: 'number' },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'sku', label: 'SKU', sortable: true }
]);

const actions = ref([
  { 
    label: 'Edit', 
    icon: '✏️', 
    handler: (row) => {
      logEvent(`Edit product: ${row.name}`);
    }
  },
  { 
    label: 'Delete', 
    icon: '🗑️', 
    handler: (row) => {
      logEvent(`Delete product: ${row.name}`);
      const index = products.value.findIndex(p => p.id === row.id);
      if (index > -1) {
        products.value.splice(index, 1);
      }
    }
  }
]);

function handleRowClick(row) {
  logEvent(`Row clicked: ${row.name}`);
}

function handleSelectionChange(rows) {
  selectedRows.value = rows;
  logEvent(`Selection changed: ${rows.length} item(s) selected`);
}

function handleExport(data, format) {
  logEvent(`Exported ${data.length} rows as ${format.toUpperCase()}`);
}

function toggleTheme() {
  logEvent(`Theme changed to ${theme.value}`);
}

function addRandomProduct() {
  const categories = ['Electronics', 'Accessories', 'Office', 'Furniture', 'Audio', 'Storage'];
  const statuses = ['Active', 'Low Stock'];
  const newId = Math.max(...products.value.map(p => p.id)) + 1;

  const newProduct = {
    id: newId,
    name: `Product ${newId}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    price: Math.round(Math.random() * 500 * 100) / 100,
    stock: Math.floor(Math.random() * 100),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    sku: `PRD-${String(newId).padStart(3, '0')}`
  };

  products.value.push(newProduct);
  logEvent(`Added new product: ${newProduct.name}`);
}

function clearSelection() {
  selectedRows.value = [];
  logEvent('Selection cleared');
}

function logEvent(message) {
  const time = new Date().toLocaleTimeString();
  eventLog.value.unshift({ time, message });
  if (eventLog.value.length > 10) {
    eventLog.value.pop();
  }
}
</script>

<style scoped>
.smart-datatable-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.demo-description {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.6;
}

/* Custom cell styles */
.price-cell {
  font-weight: 600;
  color: #059669;
}

.stock-cell {
  font-weight: 500;
}

.stock-cell.in-stock {
  color: #059669;
}

.stock-cell.low-stock {
  color: #f59e0b;
}

.stock-cell.out-of-stock {
  color: #dc2626;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.low {
  background: #fef3c7;
  color: #92400e;
}

/* Demo Controls */
.demo-controls {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-controls h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.control-group {
  margin-bottom: 12px;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.control-btn {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  margin-right: 8px;
}

.control-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.selection-info {
  margin-top: 12px;
  padding: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1e40af;
}

/* Event Log */
.event-log {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-log h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.log-entries {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  gap: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.log-time {
  color: #666;
  font-weight: 500;
  min-width: 80px;
}

.log-message {
  color: #1a1a1a;
}

/* Responsive */
@media (max-width: 768px) {
  .demo-section {
    padding: 16px;
  }

  .control-btn {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>

