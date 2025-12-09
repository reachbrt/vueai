<div align="center">
  <img src="https://raw.githubusercontent.com/reachbrt/vueai/main/demo/src/assets/images/autosuggest-illustration.svg" alt="AI Autosuggest" width="150" height="150" />

  <h1>@aivue/autosuggest</h1>
  <p>AI-powered suggestion components for Vue.js applications</p>

  <p>
    <a href="https://www.npmjs.com/package/@aivue/autosuggest"><img src="https://img.shields.io/npm/v/@aivue/autosuggest.svg?style=flat-square" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@aivue/autosuggest"><img src="https://img.shields.io/badge/downloads-169%2Fmonth-CB3837?style=flat-square&logo=npm" alt="npm downloads"></a>
    <a href="https://www.npmjs.com/package/@aivue/autosuggest"><img src="https://img.shields.io/npm/d18m/%40aivue%2Fautosuggest" alt="NPM Downloads"></a>
    <a href="https://github.com/reachbrt/vueai/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aivue/autosuggest.svg?style=flat-square" alt="MIT License"></a>
    <a href="https://codecov.io/gh/reachbrt/vueai"><img src="https://codecov.io/gh/reachbrt/vueai/graph/badge.svg?token=8LYV3M14ZG" alt="codecov"></a>
    <a href="https://app.netlify.com/sites/aivue/deploys"><img src="https://api.netlify.com/api/v1/badges/5cb37fa7-9ee1-4af6-9ff4-d34ff0322ded/deploy-status" alt="Netlify Status"></a>
  </p>

  <p><a href="https://aivue.netlify.app/" target="_blank">📺 Live Demo</a> • <a href="https://github.com/reachbrt/vueai/wiki" target="_blank">📚 Documentation</a> • <a href="https://github.com/reachbrt/vueai/issues/new" target="_blank">🐛 Report Bug</a></p>
</div>

## Overview

`@aivue/autosuggest` provides intelligent, AI-powered suggestion components for Vue.js applications. Enhance your forms, search boxes, and text inputs with context-aware suggestions powered by AI.

## ✨ Features

- **🔍 Smart suggestions**: Context-aware suggestions powered by AI
- **⚡ Fast and responsive**: Optimized for performance with debouncing
- **🧠 Multiple AI providers**: Works with OpenAI, Claude, Gemini, and more
- **🎯 Relevance scoring**: Suggestions ranked by relevance
- **🔧 Customizable**: Easily style to match your application
- **📱 Mobile-friendly**: Works on all devices
- **🛡️ Type safety**: Full TypeScript support
- **🔄 Debouncing**: Prevents excessive API calls

## Installation

```bash
# npm
npm install @aivue/autosuggest @aivue/core

# yarn
yarn add @aivue/autosuggest @aivue/core

# pnpm
pnpm add @aivue/autosuggest @aivue/core
```

### 🔄 Vue Compatibility

- **✅ Vue 2**: Compatible with Vue 2.6.0 and higher
- **✅ Vue 3**: Compatible with all Vue 3.x versions

> The package automatically detects which version of Vue you're using and provides the appropriate compatibility layer. This means you can use the same package regardless of whether your project is using Vue 2 or Vue 3.

## Basic Usage

### 1. Set up the AI Client

First, create an AI client using `@aivue/core`:

```javascript
// ai-client.js
import { AIClient } from '@aivue/core';

export const aiClient = new AIClient({
  provider: 'openai', // or 'anthropic', 'gemini', 'huggingface', 'ollama', 'deepseek'
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Use environment variables for API keys
  model: 'gpt-4o' // Specify the model to use
});
```

### 2. Use the Autosuggest Component

```vue
<template>
  <div class="search-container">
    <Autosuggest
      v-model="searchQuery"
      :client="aiClient"
      placeholder="Search Vue.js topics..."
      :debounce="300"
      :min-length="2"
      :max-suggestions="5"
      context="Vue.js documentation topics"
      @suggestion-selected="handleSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Autosuggest } from '@aivue/autosuggest';
import { aiClient } from './ai-client.js';

const searchQuery = ref('');

function handleSelect(suggestion) {
  console.log('Selected:', suggestion);
  // Do something with the selected suggestion
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

### 3. Register Components Globally (Optional)

If you prefer to register components globally, you can use the provided Vue plugin:

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { AutosuggestPlugin } from '@aivue/autosuggest';

const app = createApp(App);
app.use(AutosuggestPlugin); // Register all components globally
app.mount('#app');
```

Or register individual components manually:

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { Autosuggest } from '@aivue/autosuggest';

const app = createApp(App);
app.component('Autosuggest', Autosuggest); // Register with PascalCase
app.mount('#app');
```

Then use it in your templates with either PascalCase or kebab-case:

```html
<!-- Both of these work -->
<Autosuggest :client="aiClient" />
<autosuggest :client="aiClient" />
```

#### For Vue 2 Projects

```javascript
// main.js
import Vue from 'vue';
import App from './App.vue';
import { AutosuggestPlugin } from '@aivue/autosuggest';

Vue.use(AutosuggestPlugin); // Register all components globally

new Vue({
  render: h => h(App)
}).$mount('#app');
```

## Using the Autosuggest Composable

The `useAutosuggest` composable provides a simple way to integrate AI-powered suggestions into any Vue component:

```vue
<script setup>
import { ref } from 'vue';
import { useAutosuggest } from '@aivue/autosuggest';
import { aiClient } from './ai-client.js';

const searchQuery = ref('');

const {
  suggestions,
  isLoading,
  error,
  search,
  clearSuggestions
} = useAutosuggest({
  client: aiClient,
  debounce: 300,
  minLength: 2,
  maxSuggestions: 5,
  context: 'Vue.js documentation topics'
});

function handleInput(event) {
  const query = event.target.value;
  searchQuery.value = query;

  if (query.length >= 2) {
    search(query);
  } else {
    clearSuggestions();
  }
}

function handleSelect(suggestion) {
  searchQuery.value = suggestion.text;
  clearSuggestions();
}
</script>

<template>
  <div class="search-container">
    <input
      :value="searchQuery"
      @input="handleInput"
      placeholder="Search..."
      :disabled="isLoading"
    />

    <div v-if="isLoading">Loading...</div>

    <ul v-else-if="suggestions.length > 0" class="suggestions-list">
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="handleSelect(suggestion)"
        class="suggestion-item"
      >
        {{ suggestion.text }}
        <span class="score">{{ Math.round(suggestion.score * 100) }}%</span>
      </li>
    </ul>
  </div>
</template>
```

Note that all values returned from `useAutosuggest` are Vue reactive refs, so you can use them directly in your templates without `.value`.

## Customizing the Autosuggest Component

The `Autosuggest` component accepts various props for customization:

```vue
<template>
  <Autosuggest
    v-model="searchQuery"
    :client="aiClient"
    placeholder="Search Vue.js topics..."
    :debounce="300"
    :min-length="2"
    :max-suggestions="5"
    context="Vue.js documentation topics"
    theme="dark"
    :disabled="false"
    @update:model-value="handleInput"
    @suggestion-selected="handleSelect"
    @suggestions-updated="handleSuggestionsUpdate"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue';
import { Autosuggest } from '@aivue/autosuggest';
import { aiClient } from './ai-client.js';

const searchQuery = ref('');

function handleInput(value) {
  console.log('Input changed:', value);
}

function handleSelect(suggestion) {
  console.log('Selected:', suggestion);
}

function handleSuggestionsUpdate(suggestions) {
  console.log('Suggestions updated:', suggestions);
}

function handleError(error) {
  console.error('Error:', error);
}
</script>
```

## Advanced Usage: Custom Suggestion Rendering

You can customize how suggestions are rendered using slots:

```vue
<template>
  <Autosuggest
    v-model="searchQuery"
    :client="aiClient"
    placeholder="Search Vue.js topics..."
  >
    <!-- Custom input -->
    <template #input="{ value, loading, disabled }">
      <div class="custom-input-wrapper">
        <input
          :value="value"
          @input="$event => $emit('update:modelValue', $event.target.value)"
          :disabled="disabled || loading"
          class="custom-input"
        />
        <span class="custom-input-icon">🔍</span>
      </div>
    </template>

    <!-- Custom loading indicator -->
    <template #loading>
      <div class="custom-loader">
        <span>Thinking...</span>
        <img src="/spinner.gif" alt="Loading" />
      </div>
    </template>

    <!-- Custom suggestion item -->
    <template #suggestion="{ suggestion, index, selected }">
      <div
        class="custom-suggestion"
        :class="{ 'selected': selected }"
      >
        <span class="suggestion-text">{{ suggestion.text }}</span>
        <span class="suggestion-score">{{ Math.round(suggestion.score * 100) }}%</span>
      </div>
    </template>

    <!-- Custom no suggestions message -->
    <template #no-suggestions>
      <div class="no-results">
        <p>No matching suggestions found</p>
        <p>Try a different search term</p>
      </div>
    </template>

    <!-- Custom error message -->
    <template #error="{ error }">
      <div class="error-message">
        <p>Error: {{ error.message }}</p>
      </div>
    </template>
  </Autosuggest>
</template>
```

## API Reference

### Autosuggest Props

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

### Autosuggest Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `value` | Emitted when the input value changes |
| `suggestion-selected` | `suggestion` | Emitted when a suggestion is selected |
| `suggestions-updated` | `suggestions` | Emitted when the suggestions list is updated |
| `error` | `error` | Emitted when an error occurs |

### Autosuggest Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `{ suggestions, loading, error }` | Custom rendering for the entire component |
| `input` | `{ value, loading, disabled }` | Custom input rendering |
| `suggestion` | `{ suggestion, index, selected }` | Custom suggestion rendering |
| `no-suggestions` | - | Content to show when there are no suggestions |
| `loading` | - | Content to show when loading suggestions |
| `error` | `{ error }` | Content to show when an error occurs |

### useAutosuggest Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | `AIClient` | **Required** | The AIClient instance to use |
| `debounce` | `Number` | `300` | Debounce time in milliseconds |
| `minLength` | `Number` | `2` | Minimum input length to trigger suggestions |
| `maxSuggestions` | `Number` | `5` | Maximum number of suggestions to show |
| `context` | `String` | `''` | Context to help the AI generate relevant suggestions |
| `onError` | `Function` | `null` | Callback function when an error occurs |

### useAutosuggest Return Values

| Value | Type | Description |
|-------|------|-------------|
| `suggestions` | `Ref<Array>` | Reactive array of suggestions |
| `isLoading` | `Ref<Boolean>` | Whether suggestions are being generated |
| `error` | `Ref<String>` | Error message, if any |
| `search` | `Function` | Function to trigger a search |
| `clearSuggestions` | `Function` | Function to clear the suggestions |
| `selectSuggestion` | `Function` | Function to select a suggestion |
| `query` | `Ref<String>` | The current search query |

### SuggestionItem Interface

```typescript
interface SuggestionItem {
  text: string;   // The suggestion text
  score: number;  // Relevance score (0-1)
}
```

## Troubleshooting

### Component Registration Issues

If you encounter issues with component registration, make sure you're using the correct import and registration method:

```javascript
// Correct import
import { Autosuggest } from '@aivue/autosuggest';

// For local registration in a component
export default {
  components: {
    Autosuggest
  }
}

// Or with script setup
import { Autosuggest } from '@aivue/autosuggest';
```

When using the component in templates, you can use either PascalCase or kebab-case:

```html
<!-- Both of these work -->
<Autosuggest :client="aiClient" />
<autosuggest :client="aiClient" />
```

### API Key Handling

For security reasons, never hardcode API keys in your code. Use environment variables instead:

```javascript
// .env file
VITE_OPENAI_API_KEY=your-api-key

// In your code
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
```

### Error Handling

If you're not seeing any error messages, you can listen for the `error` event:

```vue
<template>
  <Autosuggest
    :client="aiClient"
    @error="handleError"
  />
</template>

<script setup>
function handleError(error) {
  console.error('Autosuggest error:', error);
  // Show a notification or handle the error
}
</script>
```

### Styling

You can customize the appearance of the autosuggest component using CSS variables:

```css
:root {
  --aivue-autosuggest-bg: #ffffff;
  --aivue-autosuggest-text: #333333;
  --aivue-autosuggest-border: #e0e0e0;
  --aivue-autosuggest-input-bg: #ffffff;
  --aivue-autosuggest-input-text: #333333;
  --aivue-autosuggest-suggestion-bg: #ffffff;
  --aivue-autosuggest-suggestion-hover-bg: #f5f5f5;
  --aivue-autosuggest-suggestion-selected-bg: #e1f5fe;
  --aivue-autosuggest-error: #f44336;
  --aivue-autosuggest-border-radius: 4px;
  --aivue-autosuggest-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

## Demo

Check out our [interactive demo](https://aivue-demo.netlify.app/autosuggest) to see the autosuggest components in action.

## 📦 Related Packages

Explore the complete @aivue ecosystem:

### 🧠 [@aivue/core](https://www.npmjs.com/package/@aivue/core)
Core AI functionality for Vue.js components

### 💬 [@aivue/chatbot](https://www.npmjs.com/package/@aivue/chatbot)
AI-powered chat components for Vue.js

### 📝 [@aivue/smartform](https://www.npmjs.com/package/@aivue/smartform)
AI-powered form validation for Vue.js

### 🎭 [@aivue/emotion-ui](https://www.npmjs.com/package/@aivue/emotion-ui)
Emotion-aware UI components with sentiment analysis

### 📄 [@aivue/doc-intelligence](https://www.npmjs.com/package/@aivue/doc-intelligence)
Document processing and OCR with AI

### 🧠 [@aivue/predictive-input](https://www.npmjs.com/package/@aivue/predictive-input)
AI-powered predictive text input

### 🔔 [@aivue/smart-notify](https://www.npmjs.com/package/@aivue/smart-notify)
Intelligent notification system

### 🎤 [@aivue/voice-actions](https://www.npmjs.com/package/@aivue/voice-actions)
Voice command integration

### 📋 [@aivue/smart-datatable](https://www.npmjs.com/package/@aivue/smart-datatable)
Advanced data table components

### 🖼️ [@aivue/image-caption](https://www.npmjs.com/package/@aivue/image-caption)
AI-powered image captioning with OpenAI Vision models

### 📊 [@aivue/analytics](https://www.npmjs.com/package/@aivue/analytics)
AI-powered analytics and insights

## License

MIT © [Bharatkumar Subramanian](https://github.com/reachbrt)
