# @aivue/autosuggest

> AI-powered suggestion components for Vue.js

[![npm version](https://img.shields.io/npm/v/@aivue/autosuggest.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/autosuggest)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/autosuggest.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/autosuggest)
[![MIT License](https://img.shields.io/npm/l/@aivue/autosuggest.svg?style=flat-square)](https://github.com/reachbrt/vueai/blob/main/LICENSE)

## Overview

`@aivue/autosuggest` provides intelligent, AI-powered suggestion components for Vue.js applications. Enhance your forms, search boxes, and text inputs with context-aware suggestions powered by AI.

## Features

- 🔍 **Smart suggestions**: Context-aware suggestions powered by AI
- ⚡ **Fast and responsive**: Optimized for performance with debouncing
- 🧠 **Multiple AI providers**: Works with OpenAI, Claude, Gemini, and more
- 🎯 **Relevance scoring**: Suggestions ranked by relevance
- 🔧 **Customizable**: Easily style to match your application
- 📱 **Mobile-friendly**: Works on all devices
- 🛡️ **Type safety**: Full TypeScript support
- 🔄 **Debouncing**: Prevents excessive API calls

## Installation

```bash
# npm
npm install @aivue/autosuggest @aivue/core

# yarn
yarn add @aivue/autosuggest @aivue/core

# pnpm
pnpm add @aivue/autosuggest @aivue/core
```

## Basic Usage

### Vue 3 Component

```vue
<template>
  <div class="search-container">
    <Autosuggest
      v-model="searchQuery"
      :suggestions="suggestions"
      :loading="isLoading"
      @input="handleInput"
      @select="handleSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Autosuggest, useAutosuggest } from '@aivue/autosuggest';

const searchQuery = ref('');

// Use the autosuggest composable
const {
  suggestions,
  isLoading,
  error,
  search,
  clearSuggestions
} = useAutosuggest({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o',
  context: 'Vue.js documentation topics',
  debounce: 300,
  maxSuggestions: 5
});

// Handle input changes
async function handleInput(query) {
  if (query.length >= 2) {
    await search(query);
  } else {
    clearSuggestions();
  }
}

// Handle suggestion selection
function handleSelect(suggestion) {
  searchQuery.value = suggestion.text;
  // Do something with the selected suggestion
  console.log('Selected:', suggestion);
}
</script>

<style>
.search-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
</style>
```

## Using the Autosuggest Composable

The `useAutosuggest` composable provides a simple way to integrate AI-powered suggestions into any Vue component:

```javascript
import { useAutosuggest } from '@aivue/autosuggest';

// In your setup function or script setup
const {
  suggestions,       // Reactive array of suggestion items
  isLoading,         // Boolean indicating if suggestions are being generated
  error,             // Error object if something goes wrong
  search,            // Function to search for suggestions
  clearSuggestions   // Function to clear the suggestions
} = useAutosuggest({
  provider: 'openai',  // AI provider to use
  apiKey: 'your-api-key', // API key
  model: 'gpt-4o', // Model to use
  context: 'Provide context for better suggestions', // Optional context
  debounce: 300, // Debounce time in milliseconds
  maxSuggestions: 5 // Maximum number of suggestions to return
});

// Search for suggestions
async function handleInput(query) {
  if (query.length >= 2) {
    await search(query);
  } else {
    clearSuggestions();
  }
}
```

## Customizing the Autosuggest Component

The `Autosuggest` component accepts various props for customization:

```vue
<template>
  <Autosuggest
    v-model="searchQuery"
    :suggestions="suggestions"
    :loading="isLoading"
    :placeholder="'Search Vue.js topics...'"
    :min-chars="2"
    :highlight-matches="true"
    :theme="'dark'"
    :no-results-text="'No suggestions found'"
    @input="handleInput"
    @select="handleSelect"
    @focus="handleFocus"
    @blur="handleBlur"
  />
</template>
```

## Advanced Usage: Custom Suggestion Rendering

You can customize how suggestions are rendered using slots:

```vue
<template>
  <Autosuggest
    v-model="searchQuery"
    :suggestions="suggestions"
    :loading="isLoading"
    @input="handleInput"
    @select="handleSelect"
  >
    <!-- Custom loading indicator -->
    <template #loading>
      <div class="custom-loader">
        <span>Thinking...</span>
        <img src="/spinner.gif" alt="Loading" />
      </div>
    </template>

    <!-- Custom suggestion item -->
    <template #suggestion="{ suggestion, isHighlighted }">
      <div
        class="custom-suggestion"
        :class="{ 'highlighted': isHighlighted }"
      >
        <span class="suggestion-text">{{ suggestion.text }}</span>
        <span class="suggestion-score">{{ suggestion.score.toFixed(2) }}</span>
      </div>
    </template>
  </Autosuggest>
</template>
```

## API Reference

### Autosuggest Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| modelValue | String | v-model binding for input value | `''` |
| suggestions | Array | Array of suggestion items | `[]` |
| loading | Boolean | Whether suggestions are being loaded | `false` |
| placeholder | String | Placeholder text for input field | `'Type to search...'` |
| minChars | Number | Minimum characters before showing suggestions | `1` |
| highlightMatches | Boolean | Highlight matching text in suggestions | `true` |
| theme | String | Theme ('light' or 'dark') | `'light'` |
| noResultsText | String | Text to show when no suggestions are found | `'No results found'` |
| maxHeight | String | Maximum height of suggestions dropdown | `'300px'` |

### Autosuggest Events

| Event | Description | Payload |
|-------|-------------|---------|
| input | Emitted when input value changes | `string` (input value) |
| select | Emitted when a suggestion is selected | `SuggestionItem` (selected suggestion) |
| focus | Emitted when input is focused | `FocusEvent` |
| blur | Emitted when input loses focus | `FocusEvent` |

### useAutosuggest Options

| Option | Type | Description | Required |
|--------|------|-------------|----------|
| provider | String | AI provider to use | Yes |
| apiKey | String | API key for the provider | No |
| model | String | Model to use | No |
| context | String | Context to improve suggestions | No |
| debounce | Number | Debounce time in milliseconds | No |
| maxSuggestions | Number | Maximum number of suggestions to return | No |

### SuggestionItem Interface

```typescript
interface SuggestionItem {
  text: string;   // The suggestion text
  score: number;  // Relevance score (0-1)
}
```

## Related Packages

- [@aivue/core](https://www.npmjs.com/package/@aivue/core) - Core AI functionality for Vue.js components
- [@aivue/chatbot](https://www.npmjs.com/package/@aivue/chatbot) - AI-powered chat components for Vue.js
- [@aivue/smartform](https://www.npmjs.com/package/@aivue/smartform) - AI-powered form validation for Vue.js

## License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)
