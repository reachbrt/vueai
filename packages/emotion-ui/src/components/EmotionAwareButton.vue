<template>
  <button
    class="emotion-aware-button"
    :class="[`emotion-${currentEmotion}`, `variant-${variant}`, { disabled }]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span v-if="showEmotionIcon" class="emotion-icon">{{ emotionIcon }}</span>
    <span class="button-text">{{ adaptiveText }}</span>
    <span v-if="loading" class="loading-spinner">⏳</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEmotionStore } from '../composables/useEmotionStore';

export interface EmotionAwareButtonProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  showEmotionIcon?: boolean;
  adaptToEmotion?: boolean;
  encouragingText?: string;
  calmingText?: string;
}

const props = withDefaults(defineProps<EmotionAwareButtonProps>(), {
  text: 'Submit',
  variant: 'primary',
  disabled: false,
  loading: false,
  showEmotionIcon: false,
  adaptToEmotion: true
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const emotionStore = useEmotionStore();
const currentEmotion = computed(() => emotionStore.currentEmotion.value.primary);

const adaptiveText = computed(() => {
  if (!props.adaptToEmotion) return props.text;

  const emotion = currentEmotion.value;
  if (emotion === 'frustrated' && props.calmingText) {
    return props.calmingText;
  } else if (emotion === 'positive' && props.encouragingText) {
    return props.encouragingText;
  } else if (emotion === 'confused') {
    return `${props.text} (We'll help!)`;
  }
  return props.text;
});

const emotionIcon = computed(() => {
  const icons: Record<string, string> = {
    positive: '✨',
    frustrated: '💪',
    confused: '🤝',
    excited: '🚀',
    neutral: ''
  };
  return icons[currentEmotion.value] || '';
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped>
.emotion-aware-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.variant-primary {
  background-color: #3b82f6;
  color: white;
}

.variant-primary:hover:not(.disabled) {
  background-color: #2563eb;
}

.variant-secondary {
  background-color: #6b7280;
  color: white;
}

.variant-success {
  background-color: #10b981;
  color: white;
}

.variant-danger {
  background-color: #ef4444;
  color: white;
}

.emotion-frustrated {
  animation: gentle-pulse 2s ease-in-out infinite;
}

.emotion-positive {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes gentle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

