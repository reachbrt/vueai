<template>
  <div class="training-panel">
    <div class="panel-header">
      <h3 class="panel-title">
        <span class="icon">🧠</span>
        Training Panel
      </h3>
      <p class="panel-description">
        Train the AI with your writing samples to improve predictions
      </p>
    </div>

    <div class="panel-content">
      <!-- Training text area -->
      <div class="training-section">
        <label class="section-label">Training Text</label>
        <textarea
          v-model="trainingText"
          placeholder="Paste your writing samples here (emails, documents, notes, etc.)..."
          rows="8"
          class="training-textarea"
          :disabled="isTraining"
        />
        <div class="text-info">
          {{ trainingText.length }} characters
          <span v-if="trainingText.length < 100" class="warning">
            (minimum 100 characters recommended)
          </span>
        </div>
      </div>

      <!-- Training button -->
      <button
        class="train-button"
        :disabled="isTraining || trainingText.length < 10"
        @click="handleTrain"
      >
        <span v-if="!isTraining" class="button-content">
          <span class="icon">🚀</span>
          Start Training
        </span>
        <span v-else class="button-content">
          <span class="spinner"></span>
          Training...
        </span>
      </button>

      <!-- Progress bar -->
      <div v-if="trainingProgress" class="progress-section">
        <div class="progress-info">
          <span class="progress-phase">{{ trainingProgress.currentPhase }}</span>
          <span class="progress-percent">{{ trainingProgress.progress }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${trainingProgress.progress}%` }"
          />
        </div>
      </div>

      <!-- Statistics -->
      <div v-if="isTrained" class="stats-section">
        <h4 class="stats-title">Training Statistics</h4>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-label">Unique Words</span>
            <span class="stat-value">{{ stats?.ngram?.uniqueWords || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Words</span>
            <span class="stat-value">{{ stats?.ngram?.totalWords || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Patterns</span>
            <span class="stat-value">{{ stats?.patterns?.totalPatterns || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Language</span>
            <span class="stat-value">{{ stats?.language || 'auto' }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-section">
        <button
          class="action-button secondary"
          :disabled="!isTrained"
          @click="handleExport"
        >
          <span class="icon">💾</span>
          Export Data
        </button>
        <button
          class="action-button secondary"
          @click="handleImport"
        >
          <span class="icon">📥</span>
          Import Data
        </button>
        <button
          class="action-button danger"
          :disabled="!isTrained"
          @click="handleClear"
        >
          <span class="icon">🗑️</span>
          Clear Data
        </button>
      </div>

      <!-- Hidden file input -->
      <input
        ref="fileInputRef"
        type="file"
        accept=".json"
        style="display: none"
        @change="handleFileSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePredictiveInput } from '../composables/usePredictiveInput';

interface Props {
  storageKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  storageKey: 'aivue_predictive_input'
});

const emit = defineEmits<{
  'training-complete': [];
  'data-cleared': [];
  'data-imported': [];
}>();

// Composable
const {
  isTraining,
  trainingProgress,
  isTrained,
  train,
  clearData,
  exportData,
  importData,
  getStats
} = usePredictiveInput({
  storageKey: props.storageKey
});

// Local state
const trainingText = ref('');
const fileInputRef = ref<HTMLInputElement | null>(null);
const stats = computed(() => isTrained.value ? getStats() : null);

// Handle train
const handleTrain = async () => {
  if (trainingText.value.length < 10) return;

  try {
    await train(trainingText.value);
    emit('training-complete');
  } catch (error) {
    console.error('Training failed:', error);
  }
};

// Handle export
const handleExport = async () => {
  try {
    await exportData();
  } catch (error) {
    console.error('Export failed:', error);
  }
};

// Handle import
const handleImport = () => {
  fileInputRef.value?.click();
};

// Handle file select
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    await importData(file);
    emit('data-imported');
  } catch (error) {
    console.error('Import failed:', error);
  }

  // Reset file input
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

// Handle clear
const handleClear = async () => {
  if (!confirm('Are you sure you want to clear all training data? This cannot be undone.')) {
    return;
  }

  try {
    await clearData();
    trainingText.value = '';
    emit('data-cleared');
  } catch (error) {
    console.error('Clear failed:', error);
  }
};
</script>

<style scoped>
.training-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.panel-header {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-description {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.panel-content {
  padding: 24px;
}

.training-section {
  margin-bottom: 20px;
}

.section-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.training-textarea {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  resize: vertical;
}

.training-textarea:focus {
  border-color: #667eea;
}

.training-textarea:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
}

.text-info {
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
}

.text-info .warning {
  color: #f59e0b;
  font-weight: 500;
}

.train-button {
  width: 100%;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.train-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.train-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-section {
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.progress-phase {
  color: #1e293b;
  font-weight: 500;
  text-transform: capitalize;
}

.progress-percent {
  color: #667eea;
  font-weight: 600;
}

.progress-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.stats-section {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.stats-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.actions-section {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-button {
  flex: 1;
  min-width: 120px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-button.secondary {
  background: white;
  color: #1e293b;
}

.action-button.secondary:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.action-button.danger {
  background: white;
  color: #ef4444;
  border-color: #fecaca;
}

.action-button.danger:hover:not(:disabled) {
  background-color: #fef2f2;
  border-color: #ef4444;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  font-size: 16px;
}
</style>



