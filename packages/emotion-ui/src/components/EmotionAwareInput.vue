<template>
  <div class="emotion-aware-input" :class="`emotion-${currentEmotion}`">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    
    <div class="input-wrapper">
      <input
        :id="inputId"
        ref="inputRef"
        v-model="localValue"
        :type="type"
        :placeholder="adaptivePlaceholder"
        :disabled="disabled"
        :required="required"
        class="input-field"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <div v-if="showEmotionIndicator" class="emotion-indicator" :title="emotionTooltip">
        {{ emotionIcon }}
      </div>
    </div>

    <div v-if="validationMessage" class="validation-message" :class="`validation-${validationState}`">
      {{ adaptiveValidationMessage }}
    </div>

    <div v-if="showHelp && helpText" class="help-text">
      {{ adaptiveHelpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useEmotionStore } from '../composables/useEmotionStore';
import { analyzeSentiment } from '../utils/sentimentAnalysis';
import { TypingAnalyzer } from '../utils/interactionAnalysis';

export interface EmotionAwareInputProps {
  modelValue?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  validationMessage?: string;
  validationState?: 'success' | 'error' | 'warning';
  helpText?: string;
  showEmotionIndicator?: boolean;
  adaptToEmotion?: boolean;
  analyzeTyping?: boolean;
}

const props = withDefaults(defineProps<EmotionAwareInputProps>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  required: false,
  showEmotionIndicator: true,
  adaptToEmotion: true,
  analyzeTyping: true
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'emotion-detected': [emotion: string];
}>();

const inputRef = ref<HTMLInputElement>();
const localValue = ref(props.modelValue || '');
const inputId = `emotion-input-${Math.random().toString(36).substr(2, 9)}`;
const typingAnalyzer = new TypingAnalyzer();
const emotionStore = useEmotionStore();

const currentEmotion = computed(() => emotionStore.currentEmotion.value.primary);
const showHelp = ref(false);

// Adaptive placeholder based on emotion
const adaptivePlaceholder = computed(() => {
  if (!props.adaptToEmotion) return props.placeholder;

  const emotion = currentEmotion.value;
  if (emotion === 'frustrated') {
    return props.placeholder || 'Take your time...';
  } else if (emotion === 'confused') {
    return props.placeholder || 'Need help? Just ask...';
  } else if (emotion === 'positive') {
    return props.placeholder || 'You\'re doing great!';
  }
  return props.placeholder;
});

// Adaptive validation message based on emotion
const adaptiveValidationMessage = computed(() => {
  if (!props.validationMessage || !props.adaptToEmotion) {
    return props.validationMessage;
  }

  const emotion = currentEmotion.value;
  const state = props.validationState;

  if (state === 'error') {
    if (emotion === 'frustrated') {
      return `No worries! ${props.validationMessage}`;
    } else if (emotion === 'confused') {
      return `Let me help: ${props.validationMessage}`;
    }
  }

  return props.validationMessage;
});

// Adaptive help text
const adaptiveHelpText = computed(() => {
  if (!props.helpText) return '';

  const emotion = currentEmotion.value;
  if (emotion === 'frustrated') {
    return `💡 Tip: ${props.helpText}`;
  } else if (emotion === 'confused') {
    return `ℹ️ ${props.helpText}`;
  }

  return props.helpText;
});

// Emotion indicator
const emotionIcon = computed(() => {
  const icons: Record<string, string> = {
    positive: '😊',
    negative: '😔',
    frustrated: '😤',
    excited: '🎉',
    confused: '🤔',
    neutral: '😐'
  };
  return icons[currentEmotion.value] || '😐';
});

const emotionTooltip = computed(() => {
  return `Current mood: ${currentEmotion.value}`;
});

// Handle input
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  localValue.value = target.value;
  emit('update:modelValue', localValue.value);

  // Analyze sentiment
  if (localValue.value.length > 3) {
    const sentiment = analyzeSentiment(localValue.value);
    emotionStore.updateFromText(sentiment);
    emit('emotion-detected', sentiment.emotion);
  }
};

// Handle keydown for typing analysis
const handleKeydown = (event: KeyboardEvent) => {
  if (!props.analyzeTyping) return;

  const isBackspace = event.key === 'Backspace';
  typingAnalyzer.recordKeystroke(isBackspace);
};

// Handle focus
const handleFocus = () => {
  if (props.analyzeTyping) {
    typingAnalyzer.start();
  }
};

// Handle blur
const handleBlur = () => {
  if (props.analyzeTyping) {
    const pattern = typingAnalyzer.getPattern();
    emotionStore.updateFromTyping(pattern);

    // Show help if frustrated
    if (pattern.emotion === 'frustrated') {
      showHelp.value = true;
    }
  }
};

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue || '';
  }
});

// Watch for emotion changes
watch(currentEmotion, (newEmotion) => {
  if (newEmotion === 'frustrated' || newEmotion === 'confused') {
    showHelp.value = true;
  } else {
    showHelp.value = false;
  }
});

onMounted(() => {
  // Initialize
});

onUnmounted(() => {
  // Cleanup
});
</script>

<style scoped>
.emotion-aware-input {
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.emotion-indicator {
  position: absolute;
  right: 1rem;
  font-size: 1.25rem;
  cursor: help;
}

/* Emotion-based styling */
.emotion-frustrated .input-field {
  border-color: #f59e0b;
  background-color: #fffbeb;
}

.emotion-frustrated .input-field:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.emotion-confused .input-field {
  border-color: #8b5cf6;
  background-color: #faf5ff;
}

.emotion-positive .input-field {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.emotion-excited .input-field {
  border-color: #ec4899;
  background-color: #fdf2f8;
}

.validation-message {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.validation-success {
  color: #059669;
  background-color: #d1fae5;
}

.validation-error {
  color: #dc2626;
  background-color: #fee2e2;
}

.validation-warning {
  color: #d97706;
  background-color: #fef3c7;
}

.help-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
  border-left: 3px solid #3b82f6;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .input-label {
    color: #e5e7eb;
  }

  .input-field {
    background-color: #1f2937;
    border-color: #4b5563;
    color: #f3f4f6;
  }

  .input-field:focus {
    border-color: #60a5fa;
  }

  .help-text {
    background-color: #374151;
    color: #d1d5db;
  }
}
</style>

