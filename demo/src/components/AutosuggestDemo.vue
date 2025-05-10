<template>
  <div class="autosuggest-demo">
    <h3>Basic Autosuggest</h3>
    <div class="input-container">
      <AiAutosuggest
        :client="aiClient"
        placeholder="Start typing to get suggestions..."
        v-model="inputValue"
        @suggestion-selected="onSuggestionSelected"
      />
    </div>

    <h3>Autosuggest with Options</h3>
    <div class="input-container">
      <AiAutosuggest
        :client="aiClient"
        placeholder="Type here with custom options..."
        v-model="customValue"
        :trigger-chars="3"
        :max-tokens="50"
        :show-loading="true"
        theme="light"
      />
    </div>

    <h3>Custom Styled Autosuggest</h3>
    <div class="input-container custom-style">
      <AiAutosuggest
        :client="aiClient"
        placeholder="Custom styled input..."
        v-model="styledValue"
        class="custom-autosuggest"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AiAutosuggest } from '@aivue/autosuggest';
import { aiClient } from '../ai-client';

export default defineComponent({
  name: 'AutosuggestDemo',
  components: {
    AiAutosuggest,
  },
  setup() {
    const inputValue = ref('');
    const customValue = ref('');
    const styledValue = ref('');

    // Log the AI client for debugging
    console.log('AutosuggestDemo - AI Client:', aiClient);

    // Add event handlers for debugging
    const onSuggestionSelected = (suggestion: any) => {
      console.log('Suggestion selected:', suggestion);
    };

    return {
      aiClient,
      inputValue,
      customValue,
      styledValue,
      onSuggestionSelected
    };
  }
});
</script>

<style scoped>
.autosuggest-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-container {
  max-width: 600px;
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 10px;
  color: #334155;
}

.custom-style :deep(.custom-autosuggest) {
  border-radius: 8px;
  border: 2px solid #4f46e5;
  padding: 12px;
  font-size: 16px;
}

.custom-style :deep(.custom-autosuggest:focus) {
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}
</style>