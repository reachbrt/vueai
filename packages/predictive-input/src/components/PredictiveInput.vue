<template>
  <div class="ai-predictive-input" :class="{ 'ai-predictive-input--dark': theme === 'dark' }" ref="componentElement">
    <slot
      :predictions="predictions"
      :loading="isLoading"
      :error="error"
    >
      <div class="ai-predictive-input__input-container">
        <slot name="input" :value="modelValue" :loading="isLoading" :disabled="disabled">
          <input
            :value="modelValue"
            @input="handleInput"
            @keydown="handleKeyDown"
            class="ai-predictive-input__input"
            :placeholder="placeholder"
            :disabled="disabled || isLoading"
            ref="inputElement"
          />
          <div v-if="isLoading" class="ai-predictive-input__loading-indicator">
            <slot name="loading">
              <div class="ai-predictive-input__spinner"></div>
            </slot>
          </div>
        </slot>
      </div>

      <div v-if="showPredictions && predictions.length > 0" class="ai-predictive-input__predictions">
        <ul class="ai-predictive-input__predictions-list">
          <li
            v-for="(prediction, index) in predictions"
            :key="index"
            class="ai-predictive-input__prediction"
            :class="{ 'ai-predictive-input__prediction--selected': selectedIndex === index }"
            @click="selectPrediction(prediction)"
            @mouseenter="selectedIndex = index"
          >
            <slot name="prediction" :prediction="prediction" :index="index" :selected="selectedIndex === index">
              <div class="ai-predictive-input__prediction-text">{{ prediction.text }}</div>
              <div v-if="prediction.confidence !== undefined" class="ai-predictive-input__prediction-confidence">
                {{ Math.round(prediction.confidence * 100) }}%
              </div>
            </slot>
          </li>
        </ul>
      </div>

      <div v-else-if="showPredictions && modelValue.length >= minLength && !isLoading" class="ai-predictive-input__no-predictions">
        <slot name="no-predictions">
          <div class="ai-predictive-input__no-predictions-text">No predictions found</div>
        </slot>
      </div>

      <div v-if="error" class="ai-predictive-input__error">
        <slot name="error" :error="error">
          <div class="ai-predictive-input__error-text">{{ error.message }}</div>
        </slot>
      </div>
    </slot>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { usePredictiveInput } from '../composables/usePredictiveInput';

export default {
  name: 'PredictiveInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    client: {
      type: Object,
      required: true
    },
    placeholder: {
      type: String,
      default: 'Type to get predictions...'
    },
    debounce: {
      type: Number,
      default: 300
    },
    minLength: {
      type: Number,
      default: 2
    },
    maxPredictions: {
      type: Number,
      default: 5
    },
    context: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:modelValue',
    'prediction-selected',
    'predictions-updated',
    'error'
  ],
  setup(props, { emit }) {
    const inputElement = ref(null);
    const componentElement = ref(null);
    const showPredictions = ref(false);
    const selectedIndex = ref(-1);

    const options = computed(() => ({
      client: props.client,
      debounce: props.debounce,
      minLength: props.minLength,
      maxPredictions: props.maxPredictions,
      context: props.context,
      onError: (error) => emit('error', error)
    }));

    const {
      predictions,
      isLoading,
      error,
      predict,
      clear: clearPredictions
    } = usePredictiveInput(options.value);

    const handleInput = (event) => {
      const value = event.target.value;
      emit('update:modelValue', value);

      if (value.length >= props.minLength) {
        predict(value);
        showPredictions.value = true;
      } else {
        clearPredictions();
        showPredictions.value = false;
      }

      selectedIndex.value = -1;
    };

    const selectPrediction = (prediction) => {
      emit('update:modelValue', prediction.text);
      emit('prediction-selected', prediction);
      showPredictions.value = false;
      clearPredictions();

      // Refocus the input after selection
      nextTick(() => {
        if (inputElement.value) {
          inputElement.value.focus();
        }
      });
    };

    const handleKeyDown = (event) => {
      if (!showPredictions.value || predictions.value.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          selectedIndex.value = (selectedIndex.value + 1) % predictions.value.length;
          break;
        case 'ArrowUp':
          event.preventDefault();
          selectedIndex.value = selectedIndex.value <= 0 ? predictions.value.length - 1 : selectedIndex.value - 1;
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex.value >= 0) {
            selectPrediction(predictions.value[selectedIndex.value]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          showPredictions.value = false;
          break;
      }
    };

    // Close predictions when clicking outside the component
    const handleClickOutside = (event) => {
      if (componentElement.value && !componentElement.value.contains(event.target)) {
        showPredictions.value = false;
      }
    };

    // Watch for predictions changes
    watch(predictions, (newPredictions) => {
      emit('predictions-updated', newPredictions);
    });

    // Add event listeners
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);

      // Focus input on mount if autofocus is enabled
      nextTick(() => {
        if (inputElement.value && props.autofocus) {
          inputElement.value.focus();
        }
      });
    });

    return {
      inputElement,
      componentElement,
      predictions,
      isLoading,
      error,
      showPredictions,
      selectedIndex,
      handleInput,
      selectPrediction,
      handleKeyDown,
      clearPredictions
    };
  }
};
</script>

<style>
.ai-predictive-input {
  position: relative;
  width: 100%;
  font-family: var(--aivue-predictive-input-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
}

.ai-predictive-input--dark {
  --aivue-predictive-input-bg: #1e1e1e;
  --aivue-predictive-input-text: #f0f0f0;
  --aivue-predictive-input-border: #444444;
  --aivue-predictive-input-input-bg: #2d2d2d;
  --aivue-predictive-input-input-text: #f0f0f0;
  --aivue-predictive-input-prediction-bg: #383838;
  --aivue-predictive-input-prediction-hover-bg: #4a4a4a;
  --aivue-predictive-input-prediction-selected-bg: #2b5278;
  --aivue-predictive-input-error: #f44336;
}

.ai-predictive-input__input-container {
  position: relative;
  width: 100%;
}

.ai-predictive-input__input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--aivue-predictive-input-border, #e0e0e0);
  border-radius: var(--aivue-predictive-input-border-radius, 4px);
  background-color: var(--aivue-predictive-input-input-bg, #ffffff);
  color: var(--aivue-predictive-input-input-text, #333333);
  font-size: 14px;
  line-height: 1.5;
  outline: none;
}

.ai-predictive-input__input:focus {
  border-color: var(--aivue-predictive-input-focus-border, #2196f3);
  box-shadow: 0 0 0 2px var(--aivue-predictive-input-focus-shadow, rgba(33, 150, 243, 0.2));
}

.ai-predictive-input__loading-indicator {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.ai-predictive-input__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--aivue-predictive-input-spinner, #e0e0e0);
  border-top-color: var(--aivue-predictive-input-spinner-active, #2196f3);
  border-radius: 50%;
  animation: ai-predictive-input-spin 0.8s linear infinite;
}

@keyframes ai-predictive-input-spin {
  to { transform: rotate(360deg); }
}

.ai-predictive-input__predictions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  margin-top: 4px;
  background-color: var(--aivue-predictive-input-bg, #ffffff);
  border: 1px solid var(--aivue-predictive-input-border, #e0e0e0);
  border-radius: var(--aivue-predictive-input-border-radius, 4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
}

.ai-predictive-input__predictions-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ai-predictive-input__prediction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  background-color: var(--aivue-predictive-input-prediction-bg, #ffffff);
  color: var(--aivue-predictive-input-text, #333333);
}

.ai-predictive-input__prediction:hover,
.ai-predictive-input__prediction--selected {
  background-color: var(--aivue-predictive-input-prediction-hover-bg, #f5f5f5);
}

.ai-predictive-input__prediction--selected {
  background-color: var(--aivue-predictive-input-prediction-selected-bg, #e1f5fe);
}

.ai-predictive-input__prediction-text {
  flex: 1;
}

.ai-predictive-input__prediction-confidence {
  margin-left: 8px;
  font-size: 12px;
  color: var(--aivue-predictive-input-confidence, #757575);
}

.ai-predictive-input__no-predictions,
.ai-predictive-input__error {
  padding: 10px 14px;
  text-align: center;
  color: var(--aivue-predictive-input-text, #333333);
}

.ai-predictive-input__error-text {
  color: var(--aivue-predictive-input-error, #f44336);
}
</style>


