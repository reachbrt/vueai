<template>
  <div class="ai-autosuggest-wrapper">
    <input
      ref="inputElement"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      @keydown="handleKeydown"
      class="ai-autosuggest-input"
      :class="{ 'loading': isLoading }"
    />
    <div v-if="showSuggestions && suggestions.length > 0" class="ai-autosuggest-suggestions">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="index"
        class="ai-autosuggest-suggestion"
        :class="{ 'selected': index === selectedIndex }"
        @mousedown.prevent="selectSuggestion(suggestion)"
        @mouseover="selectedIndex = index"
      >
        {{ suggestion.text }}
      </div>
    </div>
    <div v-if="isLoading" class="ai-autosuggest-loader"></div>
  </div>
</template>

<script>
export default {
  name: 'AiAutosuggest',
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
    }
  },
  data() {
    return {
      suggestions: [],
      isLoading: false,
      showSuggestions: false,
      selectedIndex: -1,
      debounceTimer: null
    };
  },
  methods: {
    handleInput(event) {
      const value = event.target.value;
      this.$emit('update:modelValue', value);

      if (value.length >= this.minLength) {
        this.getSuggestions(value);
      } else {
        this.clearSuggestions();
      }
    },
    async getSuggestions(query) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(async () => {
        try {
          this.isLoading = true;
          
          // Prepare the prompt for the AI
          const prompt = this.context 
            ? `Given the context "${this.context}", suggest completions for: "${query}"`
            : `Suggest completions for: "${query}"`;

          // Get suggestions from the AI
          const response = await this.client.complete(prompt, {
            maxTokens: 200
          });

          // Parse the response into suggestions
          const suggestions = this.parseResponseToSuggestions(response.text, query);
          
          // Limit the number of suggestions
          this.suggestions = suggestions.slice(0, this.maxSuggestions);
          this.showSuggestions = true;
        } catch (err) {
          console.error('Error getting suggestions:', err);
          this.$emit('error', err);
        } finally {
          this.isLoading = false;
        }
      }, this.debounce);
    },
    parseResponseToSuggestions(text, query) {
      // Simple parsing logic - split by newlines and filter empty lines
      const lines = text.split('\n').filter(line => line.trim());
      
      // Convert lines to suggestion objects
      return lines.map(line => {
        // Remove any numbering or bullet points
        const cleanLine = line.replace(/^(\d+\.\s*|\*\s*|-\s*)/, '').trim();
        // Remove quotes if present
        const textWithoutQuotes = cleanLine.replace(/^["'](.*)["']$/, '$1');
        
        return {
          text: textWithoutQuotes,
          originalQuery: query
        };
      });
    },
    clearSuggestions() {
      this.suggestions = [];
      this.showSuggestions = false;
    },
    selectSuggestion(suggestion) {
      this.$emit('update:modelValue', suggestion.text);
      this.$emit('suggestion-selected', suggestion);
      this.clearSuggestions();
    },
    handleBlur() {
      // Delay hiding suggestions to allow clicking on them
      setTimeout(() => {
        this.showSuggestions = false;
      }, 200);
    },
    handleKeydown(event) {
      if (!this.suggestions.length) return;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (this.selectedIndex >= 0) {
            this.selectSuggestion(this.suggestions[this.selectedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          this.clearSuggestions();
          break;
      }
    }
  }
};
</script>

<style scoped>
.ai-autosuggest-wrapper {
  position: relative;
  width: 100%;
}

.ai-autosuggest-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.ai-autosuggest-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.ai-autosuggest-input.loading {
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 20px 20px;
}

.ai-autosuggest-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ai-autosuggest-suggestion {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.ai-autosuggest-suggestion:hover,
.ai-autosuggest-suggestion.selected {
  background-color: #f1f5f9;
}

.ai-autosuggest-loader {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}
</style>
