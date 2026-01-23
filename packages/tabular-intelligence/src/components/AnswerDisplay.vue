<template>
  <div class="ti-answer-display" :class="{ 'ti-cannot-answer': answer.cannotAnswer }">
    <div class="ti-answer-header">
      <div class="ti-answer-icon">
        <span v-if="!answer.cannotAnswer">💡</span>
        <span v-else>⚠️</span>
      </div>
      <div class="ti-answer-meta">
        <div class="ti-confidence">
          Confidence: {{ Math.round(answer.confidence * 100) }}%
        </div>
        <div class="ti-timestamp">
          {{ formatTimestamp(answer.timestamp) }}
        </div>
      </div>
    </div>

    <div class="ti-answer-text">
      {{ answer.text }}
    </div>

    <div v-if="answer.isApproximate" class="ti-approximate-notice">
      ℹ️ This answer is based on sampled data and may be approximate.
    </div>

    <div v-if="answer.reason && answer.cannotAnswer" class="ti-reason">
      <strong>Reason:</strong> {{ answer.reason }}
    </div>

    <div v-if="answer.supportingData" class="ti-supporting-data">
      <button
        class="ti-toggle-btn"
        @click="showSupporting = !showSupporting"
      >
        {{ showSupporting ? '▼' : '▶' }} Supporting Data
      </button>
      
      <div v-if="showSupporting" class="ti-supporting-content">
        <div v-if="answer.supportingData.aggregates" class="ti-aggregates">
          <h4>Aggregates:</h4>
          <pre>{{ JSON.stringify(answer.supportingData.aggregates, null, 2) }}</pre>
        </div>
        
        <div v-if="answer.supportingData.rows && answer.supportingData.rows.length > 0" class="ti-rows">
          <h4>Sample Rows ({{ answer.supportingData.rows.length }}):</h4>
          <div class="ti-table-wrapper">
            <table class="ti-table">
              <thead>
                <tr>
                  <th v-for="(key, index) in Object.keys(answer.supportingData.rows[0])" :key="index">
                    {{ key }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in answer.supportingData.rows.slice(0, 5)" :key="index">
                  <td v-for="(key, keyIndex) in Object.keys(row)" :key="keyIndex">
                    {{ row[key] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Answer } from '../types';

interface Props {
  answer: Answer;
}

const props = defineProps<Props>();

const showSupporting = ref(false);

function formatTimestamp(timestamp: Date): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}
</script>

<style scoped>
.ti-answer-display {
  padding: 1.25rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-left: 4px solid #3b82f6;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.ti-answer-display.ti-cannot-answer {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-left-color: #ef4444;
}

.ti-answer-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.ti-answer-icon {
  font-size: 1.5rem;
}

.ti-answer-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #64748b;
}

.ti-confidence {
  font-weight: 600;
}

.ti-answer-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.ti-approximate-notice {
  padding: 0.5rem 0.75rem;
  background: #fef3c7;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #92400e;
  margin-bottom: 0.75rem;
}

.ti-reason {
  padding: 0.5rem 0.75rem;
  background: #fee2e2;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #991b1b;
  margin-bottom: 0.75rem;
}

.ti-supporting-data {
  margin-top: 1rem;
}

.ti-toggle-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.ti-toggle-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.ti-supporting-content {
  margin-top: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.ti-supporting-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #475569;
}

.ti-supporting-content pre {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-size: 0.85rem;
}

.ti-table-wrapper {
  overflow-x: auto;
}

.ti-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.ti-table th,
.ti-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.ti-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
}

.ti-table tr:hover {
  background: #f8fafc;
}
</style>

