<template>
  <div class="ti-question-input">
    <div class="ti-input-wrapper">
      <textarea
        v-model="questionText"
        :placeholder="placeholder"
        :disabled="disabled"
        class="ti-textarea"
        rows="1"
        @keydown.enter.exact.prevent="handleSubmit"
        @keydown.shift.enter="handleNewLine"
      />
      <button
        :disabled="disabled || !questionText.trim()"
        class="ti-submit-btn"
        @click="handleSubmit"
      >
        <span v-if="!loading">{{ submitLabel }}</span>
        <span v-else class="ti-loading">{{ loadingLabel }}</span>
      </button>
    </div>
    <div v-if="showHint" class="ti-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  placeholder?: string;
  submitLabel?: string;
  loadingLabel?: string;
  hint?: string;
  showHint?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

interface Emits {
  (e: 'submit', question: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Ask a question about this data...',
  submitLabel: 'Ask',
  loadingLabel: 'Processing...',
  hint: 'Press Enter to submit, Shift+Enter for new line',
  showHint: true,
  disabled: false,
  loading: false,
});

const emit = defineEmits<Emits>();

const questionText = ref('');

function handleSubmit() {
  if (questionText.value.trim() && !props.disabled && !props.loading) {
    emit('submit', questionText.value.trim());
    questionText.value = '';
  }
}

function handleNewLine(event: KeyboardEvent) {
  // Allow default behavior for Shift+Enter
}
</script>

<style scoped>
.ti-question-input {
  width: 100%;
}

.ti-input-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ti-textarea {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  min-height: 38px;
  max-height: 120px;
  transition: border-color 0.2s;
  line-height: 1.5;
  background: white;
}

.ti-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.ti-textarea:disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
  opacity: 0.6;
}

.ti-submit-btn {
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
  font-size: 14px;
  height: 38px;
}

.ti-submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.ti-submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.ti-loading {
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.ti-hint {
  margin-top: 4px;
  font-size: 12px;
  color: #94a3b8;
}
</style>

