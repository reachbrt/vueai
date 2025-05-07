<img src="vueai-logo.svg" alt="VueAI Logo" width="300" height="120" />

# VueAI Monorepo

A modular AI-powered Vue.js component suite including:
- **@vueai/chatbot** – Multi-provider AI chat widget
- **@vueai/autosuggest** – Smart autosuggest with semantic ranking
- **@vueai/smartform** – AI-enhanced forms with dynamic validation

---

## 🏗️ Monorepo Structure
```
vueai-monorepo/
├── packages/
│   ├── chatbot/
│   ├── autosuggest/
│   ├── smartform/
│   └── core/        # Shared AI functionality
│       ├── src/
│       │   ├── ai-client.ts
│       │   └── providers/
│       │       ├── openai.ts
│       │       ├── claude.ts
│       │       ├── gemini.ts
│       │       ├── huggingface.ts
│       │       ├── ollama.ts
│       │       ├── deepseek.ts
│       │       └── fallback.ts
├── .bit/            # Bit config (if using Bit)
└── workspace.json   # Lerna/Bit workspace
```

---

## 📦 Packages

### @vueai/chatbot
- Multi-provider support (OpenAI, Claude, Gemini, HuggingFace, Ollama, DeepSeek)
- Automatic fallback when API keys aren't available
- Streaming responses with Markdown support
- File upload, PDF parsing, history tracking

```vue
<template>
  <div>
    <div class="provider-selector">
      <label>Select Provider:</label>
      <select v-model="provider" @change="resetConversation">
        <option value="openai">OpenAI</option>
        <option value="claude">Claude</option>
        <option value="gemini">Gemini</option>
        <option value="huggingface">HuggingFace</option>
        <option value="ollama">Ollama</option>
        <option value="deepseek">DeepSeek</option>
      </select>
    </div>
    
    <AiChatWindow 
      :apiConfig="{ provider, apiKey, model }" 
      :systemPrompt="'You are a helpful assistant'"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { AiChatWindow } from '@vueai/chatbot';

const provider = ref('openai');
const apiKey = computed(() => import.meta.env[`VITE_${provider.value.toUpperCase()}_API_KEY`] || '');
const model = computed(() => getModelForProvider(provider.value));

function getModelForProvider(provider) {
  switch(provider) {
    case 'openai': return 'gpt-4o';
    case 'claude': return 'claude-3-7-sonnet-20250219';
    case 'gemini': return 'gemini-1.5-pro';
    case 'huggingface': return 'mistralai/Mistral-7B-Instruct-v0.2';
    case 'ollama': return 'llama3';
    case 'deepseek': return 'deepseek-chat';
  }
}

function resetConversation() {
  // Reset chat state when changing providers
}
</script>
```

### @vueai/autosuggest
- AI-powered results with semantic sort
- Multi-provider support with automatic fallback
- Contextual suggestions based on domain

```vue
<template>
  <div>
    <div class="provider-selector">
      <label>Select Provider:</label>
      <select v-model="provider">
        <option value="openai">OpenAI</option>
        <option value="claude">Claude</option>
        <option value="gemini">Gemini</option>
        <option value="huggingface">HuggingFace</option>
        <option value="ollama">Ollama</option>
        <option value="deepseek">DeepSeek</option>
      </select>
      
      <span v-if="provider === 'ollama'">
        Using local Ollama. No API key needed.
      </span>
      <span v-else>
        Works without API keys using fallback provider.
      </span>
    </div>
    
    <input v-model="query" @input="search" placeholder="Search..." />
    
    <ul v-if="suggestions.length > 0">
      <li v-for="item in suggestions" :key="item.text">
        {{ item.text }}
        <span class="score">{{ item.score }}%</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAutosuggest } from '@vueai/autosuggest';

const query = ref('');
const provider = ref('openai');
const model = computed(() => getModelForProvider(provider.value));

const options = computed(() => ({
  provider: provider.value,
  model: model.value,
  context: 'Vue.js components and libraries',
  debounce: 300
}));

const { suggestions, search, isLoading } = useAutosuggest(options);

function getModelForProvider(provider) {
  switch(provider) {
    case 'openai': return 'gpt-4o';
    case 'claude': return 'claude-3-7-sonnet-20250219';
    case 'gemini': return 'gemini-1.5-pro';
    case 'huggingface': return 'mistralai/Mistral-7B-Instruct-v0.2';
    case 'ollama': return 'llama3';
    case 'deepseek': return 'deepseek-chat';
  }
}
</script>
```

### @vueai/smartform
- AI-powered validation + dynamic healing
- Multi-provider support with automatic fallback
- Intelligent form field suggestions

```vue
<template>
  <SmartForm 
    :schema="formSchema" 
    :provider="provider"
    @submit="handleSubmit" 
  />
</template>

<script setup>
import { ref } from 'vue';
import { SmartForm } from '@vueai/smartform';

const provider = ref('openai'); // Supports all AI providers with fallback

const formSchema = ref({
  email: { 
    type: 'email', 
    aiValidation: true, 
    selfHeal: true,
    suggestions: true
  },
  description: {
    type: 'textarea',
    aiValidation: true,
    minLength: 50
  }
});

function handleSubmit(data) {
  console.log('Form submitted:', data);
}
</script>
```

---

## 🧠 @vueai/core Shared AI Engine

Our core package provides a unified interface for working with multiple AI providers, complete with an automatic fallback mechanism that ensures your components work even without API keys.

```ts
import { AIClient } from '@vueai/core';

// Create a client with your preferred provider
const client = new AIClient({
  provider: 'openai', // or 'claude', 'gemini', 'huggingface', 'ollama', 'deepseek'
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Optional - falls back to simulation if missing
  model: 'gpt-4o' // Optional - uses provider's default if missing
});

// Chat functionality
const response = await client.chat([
  { role: 'user', content: 'Hello, can you help me with Vue.js?' }
]);

// Embeddings for semantic search
const embeddings = await client.embeddings('How do I create a component?');

// Form field validation
const validation = await client.validateFormField(
  'email',
  'user@example',
  ['email', 'required']
);
```

---

## 🛡️ Fallback Mechanism

All VueAI components include an intelligent fallback system when API keys aren't available:

- Automatically detects missing API keys
- Provides simulated responses that match the expected shape
- Generates semantically reasonable suggestions 
- Delivers smooth user experience during development
- Works with all supported providers seamlessly

---

## 🧪 Testing Setup
```bash
npm install vitest @vue/test-utils --save-dev
```

```ts
// chatbot/tests/AiChatWindow.spec.ts
test('sends messages', async () => {
  const wrapper = mount(AiChatWindow);
  await wrapper.find('input').setValue('Hi');
  await wrapper.find('input').trigger('keyup.enter');
  expect(wrapper.emitted()).toHaveProperty('send');
});
```

---

## 🚀 Build & Publish
```bash
npm run build
npm publish --access public --workspace @vueai/chatbot
```

---

## 📚 Docs & Demo
- Storybook
- Nuxt/Vite templates
- AI playgrounds with multi-provider support

---

## ✅ Adoption Highlights
- 🔌 Plug-n-play Vue 3 & Nuxt support
- 🛡️ SOC2-ready AI APIs with multiple provider options
- 🌐 Works with or without API keys during development
- 🎬 YouTube + Replit templates

---

## 📄 License
MIT © 2025 Bharatkumar Subramanian

## 👤 Author & Maintainer
**Bharatkumar Subramanian**  
Email: recxahbrt@gmail.com  
GitHub: [github.com/bharatkumarsubramanian](https://github.com/bharatkumarsubramanian)

---

## 🤖 Want to Contribute?
Submit issues, suggest features, or fork the monorepo to build your own AI UI components!