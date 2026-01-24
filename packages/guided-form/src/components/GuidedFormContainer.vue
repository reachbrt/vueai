<template>
  <div class="guided-form">
    <!-- Progress Bar -->
    <div v-if="showProgress" class="guided-form-progress">
      <div class="guided-form-progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>

    <!-- Main Content -->
    <div class="guided-form-step fade-in">
      <div v-if="currentStep" class="max-w-2xl mx-auto">
        <!-- Question Title -->
        <h1 class="guided-form-question">
          {{ currentStep.ui.title }}
        </h1>

        <!-- Subtitle -->
        <p v-if="currentStep.ui.subtitle" class="guided-form-subtitle">
          {{ currentStep.ui.subtitle }}
        </p>

        <!-- Help Text -->
        <p v-if="currentStep.ui.helpText" class="guided-form-help">
          {{ currentStep.ui.helpText }}
        </p>

        <!-- AI Hints -->
        <div v-if="aiHints.length > 0" class="space-y-2 mb-4">
          <div v-for="(hint, index) in aiHints" :key="index" class="guided-form-ai-hint">
            <div class="guided-form-ai-hint-title">
              {{ hint.type === 'explanation' ? '💡 Explanation' : hint.type === 'example' ? '📝 Example' : '✨ Suggestion' }}
            </div>
            <div class="guided-form-ai-hint-content">{{ hint.content }}</div>
          </div>
        </div>

        <!-- Input Field -->
        <div class="mb-6">
          <slot name="input" :step="currentStep" :value="currentValue" :onChange="handleChange">
            <component
              :is="getInputComponent(currentStep.field?.fieldType)"
              v-if="currentStep.field"
              :field="currentStep.field"
              :value="currentValue"
              :error="validationError"
              @change="handleChange"
            />
          </slot>
        </div>

        <!-- Validation Error -->
        <div v-if="validationError" class="guided-form-error">
          <svg class="guided-form-error-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span>{{ validationError }}</span>
        </div>

        <!-- AI Assistance Buttons -->
        <div v-if="aiEnabled" class="flex gap-4 mt-4">
          <button @click="getHint('explain')" class="guided-form-ai-button">
            💡 Explain this question
          </button>
          <button @click="getHint('example')" class="guided-form-ai-button">
            📝 Show examples
          </button>
        </div>
      </div>

      <!-- Completion Message -->
      <div v-else-if="isComplete" class="text-center">
        <h1 class="text-3xl font-bold text-green-600 mb-4">✓ Complete!</h1>
        <p class="text-lg text-gray-600">Thank you for completing the form.</p>
      </div>
    </div>

    <!-- Navigation -->
    <div class="guided-form-nav">
      <button
        v-if="canGoBack"
        @click="handlePrevious"
        class="guided-form-button-secondary"
        :disabled="isLoading"
      >
        ← Back
      </button>
      <div v-else></div>

      <div class="text-sm text-gray-500">
        Step {{ currentStepIndex + 1 }} of {{ totalSteps }}
      </div>

      <button
        v-if="!isComplete"
        @click="handleNext"
        class="guided-form-button-primary"
        :disabled="isLoading"
        :class="{ 'guided-form-button-disabled': isLoading }"
      >
        {{ canGoNext ? 'Next →' : 'Finish' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue-demi';
import type { Step, AIHint } from '../types';

const props = defineProps<{
  currentStep: Step | null;
  currentStepIndex: number;
  totalSteps: number;
  progress: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isComplete: boolean;
  isLoading: boolean;
  validationErrors: any[];
  aiEnabled?: boolean;
  showProgress?: boolean;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'previous'): void;
  (e: 'change', fieldId: string, value: any): void;
  (e: 'getHint', type: 'explain' | 'example' | 'rewrite'): void;
}>();

const currentValue = ref<any>(null);
const aiHints = ref<AIHint[]>([]);
const validationError = computed(() => {
  return props.validationErrors[0]?.message || null;
});
const validationErrorMessage = ref<string | null>(null);

const handleNext = () => {
  emit('next');
};

const handlePrevious = () => {
  emit('previous');
};

const handleChange = (value: any) => {
  currentValue.value = value;
  if (props.currentStep?.field) {
    emit('change', props.currentStep.field.fieldId, value);
  }
};

const getHint = async (type: 'explain' | 'example' | 'rewrite') => {
  emit('getHint', type);
};

const getInputComponent = (_fieldType?: string) => {
  // Return appropriate input component based on field type
  // For now, return a simple input
  return 'input';
};

watch(() => props.currentStep, () => {
  aiHints.value = [];
  validationErrorMessage.value = null;
});
</script>

