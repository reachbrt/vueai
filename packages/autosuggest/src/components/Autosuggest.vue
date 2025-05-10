<template>
  <div class="ai-autosuggest" :class="{ 'ai-autosuggest--dark': theme === 'dark' }">
    <slot
      :suggestions="suggestions"
      :loading="isLoading"
      :error="error"
    >
      <div class="ai-autosuggest__input-container">
        <slot name="input" :value="modelValue" :loading="isLoading" :disabled="disabled">
          <input
            :value="modelValue"
            @input="handleInput"
            class="ai-autosuggest__input"
            :placeholder="placeholder"
            :disabled="disabled || isLoading"
            ref="inputElement"
          />
          <div v-if="isLoading" class="ai-autosuggest__loading-indicator">
            <slot name="loading">
              <div class="ai-autosuggest__spinner"></div>
            </slot>
          </div>
        </slot>
      </div>

      <div v-if="showSuggestions && suggestions.length > 0" class="ai-autosuggest__suggestions">
        <ul class="ai-autosuggest__suggestions-list">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="ai-autosuggest__suggestion"
            :class="{ 'ai-autosuggest__suggestion--selected': selectedIndex === index }"
            @click="selectSuggestion(suggestion)"
            @mouseenter="selectedIndex = index"
          >
            <slot name="suggestion" :suggestion="suggestion" :index="index" :selected="selectedIndex === index">
              <div class="ai-autosuggest__suggestion-text">{{ suggestion.text }}</div>
              <div v-if="suggestion.score !== undefined" class="ai-autosuggest__suggestion-score">
                {{ Math.round(suggestion.score * 100) }}%
              </div>
            </slot>
          </li>
        </ul>
      </div>

      <div v-else-if="showSuggestions && modelValue.length >= minLength && !isLoading" class="ai-autosuggest__no-suggestions">
        <slot name="no-suggestions">
          <div class="ai-autosuggest__no-suggestions-text">No suggestions found</div>
        </slot>
      </div>

      <div v-if="error" class="ai-autosuggest__error">
        <slot name="error" :error="error">
          <div class="ai-autosuggest__error-text">{{ error.message }}</div>
        </slot>
      </div>
    </slot>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useAutosuggest } from '../composables/useAutosuggest';

export default {
  name: 'Autosuggest',
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
      default: 'Type to search...'
    },
    debounce: {
      type: Number,
      default: 300
    },
    minLength: {
      type: Number,
      default: 2
    },
    maxSuggestions: {
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
    'suggestion-selected',
    'suggestions-updated',
    'error'
  ],
  setup(props, { emit }) {
    const inputElement = ref(null);
    const showSuggestions = ref(false);
    const selectedIndex = ref(-1);

    const options = computed(() => ({
      client: props.client,
      debounce: props.debounce,
      minLength: props.minLength,
      maxSuggestions: props.maxSuggestions,
      context: props.context,
      onError: (error) => emit('error', error)
    }));

    const {
      suggestions,
      isLoading,
      error,
      search,
      clear
    } = useAutosuggest(options.value);

    const handleInput = (event) => {
      const value = event.target.value;
      emit('update:modelValue', value);

      if (value.length >= props.minLength) {
        search(value);
        showSuggestions.value = true;
      } else {
        clear();
        showSuggestions.value = false;
      }

      selectedIndex.value = -1;
    };

    const selectSuggestion = (suggestion) => {
      emit('update:modelValue', suggestion.text);
      emit('suggestion-selected', suggestion);
      showSuggestions.value = false;
      clear();
    };

    const handleKeyDown = (event) => {
      if (!showSuggestions.value || suggestions.value.length === 0) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          selectedIndex.value = (selectedIndex.value + 1) % suggestions.value.length;
          break;
        case 'ArrowUp':
          event.preventDefault();
          selectedIndex.value = selectedIndex.value <= 0 ? suggestions.value.length - 1 : selectedIndex.value - 1;
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex.value >= 0) {
            selectSuggestion(suggestions.value[selectedIndex.value]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          showSuggestions.value = false;
          break;
      }
    };

    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (inputElement.value && !inputElement.value.contains(event.target)) {
        showSuggestions.value = false;
      }
    };

    // Watch for suggestions changes
    watch(suggestions, (newSuggestions) => {
      emit('suggestions-updated', newSuggestions);
    });

    // Add event listeners
    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown);
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
      suggestions,
      isLoading,
      error,
      showSuggestions,
      selectedIndex,
      handleInput,
      selectSuggestion,
      clear
    };
  }
};
</script>

<style>
.ai-autosuggest {
  position: relative;
  width: 100%;
  font-family: var(--aivue-autosuggest-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
}

.ai-autosuggest--dark {
  --aivue-autosuggest-bg: #1e1e1e;
  --aivue-autosuggest-text: #f0f0f0;
  --aivue-autosuggest-border: #444444;
  --aivue-autosuggest-input-bg: #2d2d2d;
  --aivue-autosuggest-input-text: #f0f0f0;
  --aivue-autosuggest-suggestion-bg: #383838;
  --aivue-autosuggest-suggestion-hover-bg: #4a4a4a;
  --aivue-autosuggest-suggestion-selected-bg: #2b5278;
  --aivue-autosuggest-error: #f44336;
}

.ai-autosuggest__input-container {
  position: relative;
  width: 100%;
}

.ai-autosuggest__input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--aivue-autosuggest-border, #e0e0e0);
  border-radius: var(--aivue-autosuggest-border-radius, 4px);
  background-color: var(--aivue-autosuggest-input-bg, #ffffff);
  color: var(--aivue-autosuggest-input-text, #333333);
  font-size: 14px;
  line-height: 1.5;
  outline: none;
}

.ai-autosuggest__input:focus {
  border-color: var(--aivue-autosuggest-focus-border, #2196f3);
  box-shadow: 0 0 0 2px var(--aivue-autosuggest-focus-shadow, rgba(33, 150, 243, 0.2));
}

.ai-autosuggest__loading-indicator {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.ai-autosuggest__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--aivue-autosuggest-spinner, #e0e0e0);
  border-top-color: var(--aivue-autosuggest-spinner-active, #2196f3);
  border-radius: 50%;
  animation: ai-autosuggest-spin 0.8s linear infinite;
}

@keyframes ai-autosuggest-spin {
  to { transform: rotate(360deg); }
}

.ai-autosuggest__suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  margin-top: 4px;
  background-color: var(--aivue-autosuggest-bg, #ffffff);
  border: 1px solid var(--aivue-autosuggest-border, #e0e0e0);
  border-radius: var(--aivue-autosuggest-border-radius, 4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
}

.ai-autosuggest__suggestions-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ai-autosuggest__suggestion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  background-color: var(--aivue-autosuggest-suggestion-bg, #ffffff);
  color: var(--aivue-autosuggest-text, #333333);
}

.ai-autosuggest__suggestion:hover,
.ai-autosuggest__suggestion--selected {
  background-color: var(--aivue-autosuggest-suggestion-hover-bg, #f5f5f5);
}

.ai-autosuggest__suggestion--selected {
  background-color: var(--aivue-autosuggest-suggestion-selected-bg, #e1f5fe);
}

.ai-autosuggest__suggestion-text {
  flex: 1;
}

.ai-autosuggest__suggestion-score {
  margin-left: 8px;
  font-size: 12px;
  color: var(--aivue-autosuggest-score, #757575);
}

.ai-autosuggest__no-suggestions,
.ai-autosuggest__error {
  padding: 10px 14px;
  text-align: center;
  color: var(--aivue-autosuggest-text, #333333);
}

.ai-autosuggest__error-text {
  color: var(--aivue-autosuggest-error, #f44336);
}
</style>
