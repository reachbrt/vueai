# @aivue/autosuggest

The `@aivue/autosuggest` package provides AI-powered suggestion components for Vue.js applications. It offers intelligent, context-aware suggestions as users type, with support for multiple AI providers.

[![npm version](https://img.shields.io/npm/v/@aivue/autosuggest.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/autosuggest)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/autosuggest.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/autosuggest)

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

```vue
<script setup>
import { Autosuggest } from '@aivue/autosuggest';
import { AIClient } from '@aivue/core';
import { ref } from 'vue';

const client = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});

const inputValue = ref('');
</script>

<template>
  <Autosuggest
    v-model="inputValue"
    :client="client"
    placeholder="Start typing..."
    :debounce="300"
  />
</template>
```

## Components

### Autosuggest

A component that provides AI-powered suggestions as the user types.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `String` | `''` | The input value (v-model) |
| `client` | `AIClient` | **Required** | The AIClient instance to use for generating suggestions |
| `placeholder` | `String` | `'Type to search...'` | Placeholder text for the input field |
| `debounce` | `Number` | `300` | Debounce time in milliseconds |
| `minLength` | `Number` | `2` | Minimum input length to trigger suggestions |
| `maxSuggestions` | `Number` | `5` | Maximum number of suggestions to show |
| `context` | `String` | `''` | Context to help the AI generate relevant suggestions |
| `theme` | `String` | `'light'` | Theme for the component ('light' or 'dark') |
| `disabled` | `Boolean` | `false` | Whether the input is disabled |
| `loading` | `Boolean` | `false` | Whether to show a loading indicator |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `value` | Emitted when the input value changes |
| `suggestion-selected` | `suggestion` | Emitted when a suggestion is selected |
| `suggestions-updated` | `suggestions` | Emitted when the suggestions list is updated |
| `error` | `error` | Emitted when an error occurs |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `{ suggestions, loading, error }` | Custom rendering for the entire component |
| `input` | `{ value, loading, disabled }` | Custom input rendering |
| `suggestion` | `{ suggestion, index, selected }` | Custom suggestion rendering |
| `no-suggestions` | - | Content to show when there are no suggestions |
| `loading` | - | Content to show when loading suggestions |
| `error` | `{ error }` | Content to show when an error occurs |

## Composables

### useAutosuggest

A composable for managing autosuggest state and interactions with AI.

```vue
<script setup>
import { useAutosuggest } from '@aivue/autosuggest';
import { AIClient } from '@aivue/core';
import { ref, computed } from 'vue';

const client = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});

const query = ref('');
const options = {
  client,
  debounce: 300,
  minLength: 2,
  maxSuggestions: 5,
  context: 'Vue.js components and libraries'
};

const { 
  suggestions, 
  isLoading, 
  error, 
  search, 
  selectSuggestion 
} = useAutosuggest(options);

function handleInput(event) {
  query.value = event.target.value;
  search(query.value);
}

function handleSelect(suggestion) {
  selectSuggestion(suggestion);
  query.value = suggestion.text;
}
</script>

<template>
  <div>
    <input 
      :value="query" 
      @input="handleInput" 
      placeholder="Search..." 
      :disabled="isLoading" 
    />
    
    <div v-if="isLoading">Loading...</div>
    
    <ul v-else-if="suggestions.length > 0">
      <li 
        v-for="(suggestion, index) in suggestions" 
        :key="index"
        @click="handleSelect(suggestion)"
      >
        {{ suggestion.text }}
        <span v-if="suggestion.score">{{ suggestion.score }}%</span>
      </li>
    </ul>
    
    <div v-else-if="query.length >= 2">No suggestions found</div>
    
    <div v-if="error">{{ error }}</div>
  </div>
</template>
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | `AIClient` | **Required** | The AIClient instance to use |
| `debounce` | `Number` | `300` | Debounce time in milliseconds |
| `minLength` | `Number` | `2` | Minimum input length to trigger suggestions |
| `maxSuggestions` | `Number` | `5` | Maximum number of suggestions to show |
| `context` | `String` | `''` | Context to help the AI generate relevant suggestions |
| `onError` | `Function` | `null` | Callback function when an error occurs |

#### Return Values

| Value | Type | Description |
|-------|------|-------------|
| `suggestions` | `Ref<Array>` | Reactive array of suggestions |
| `isLoading` | `Ref<Boolean>` | Whether suggestions are being generated |
| `error` | `Ref<String>` | Error message, if any |
| `search` | `Function` | Function to trigger a search |
| `selectSuggestion` | `Function` | Function to select a suggestion |
| `clearSuggestions` | `Function` | Function to clear the suggestions |

## Related Packages

- [@aivue/core](./core.md) - Core AI functionality for Vue.js components
- [@aivue/chatbot](./chatbot.md) - AI-powered chat components for Vue.js
- [@aivue/smartform](./smartform.md) - AI-powered form validation for Vue.js
