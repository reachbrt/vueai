<template>
  <div class="ti-question-history">
    <div class="ti-history-header">
      <h3>Question History</h3>
      <button v-if="questions.length > 0" class="ti-clear-btn" @click="$emit('clear')">
        Clear History
      </button>
    </div>

    <div v-if="questions.length === 0" class="ti-empty-state">
      <div class="ti-empty-icon">💬</div>
      <p>No questions asked yet</p>
      <p class="ti-empty-hint">Ask a question about your data to get started</p>
    </div>

    <div v-else class="ti-history-list">
      <div
        v-for="(question, index) in reversedQuestions"
        :key="question.id"
        class="ti-history-item"
        @click="$emit('select', question)"
      >
        <div class="ti-question-header">
          <span class="ti-question-number">#{{ questions.length - index }}</span>
          <span class="ti-question-time">{{ formatTime(question.timestamp) }}</span>
        </div>
        <div class="ti-question-text">{{ question.text }}</div>
        <div v-if="question.context" class="ti-question-context">
          {{ question.context.rowCount }} rows
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Question } from '../types';

interface Props {
  questions: Question[];
}

interface Emits {
  (e: 'clear'): void;
  (e: 'select', question: Question): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const reversedQuestions = computed(() => {
  return [...props.questions].reverse();
});

function formatTime(timestamp: Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
</script>

<style scoped>
.ti-question-history {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.ti-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.ti-history-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.ti-clear-btn {
  padding: 0.375rem 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.ti-clear-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}

.ti-empty-state {
  padding: 3rem 1.5rem;
  text-align: center;
  color: #94a3b8;
}

.ti-empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.ti-empty-state p {
  margin: 0.5rem 0;
}

.ti-empty-hint {
  font-size: 0.875rem;
  color: #cbd5e1;
}

.ti-history-list {
  max-height: 400px;
  overflow-y: auto;
}

.ti-history-item {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
}

.ti-history-item:hover {
  background: #f8fafc;
}

.ti-history-item:last-child {
  border-bottom: none;
}

.ti-question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ti-question-number {
  font-size: 0.75rem;
  font-weight: 600;
  color: #3b82f6;
  background: #eff6ff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.ti-question-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.ti-question-text {
  font-size: 0.9rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.ti-question-context {
  font-size: 0.75rem;
  color: #64748b;
}
</style>

