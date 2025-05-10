# Getting Started with AIVue

This guide will help you get started with AIVue in your Vue.js project.

## Prerequisites

- Node.js 16.x or higher
- Vue.js 3.x
- npm or yarn

## Installation

You can install AIVue packages using npm or yarn:

```bash
# Using npm
npm install @aivue/core

# Install additional packages as needed
npm install @aivue/chatbot
npm install @aivue/autosuggest
npm install @aivue/smartform

# Or install all packages at once
npm install @aivue/core @aivue/chatbot @aivue/autosuggest @aivue/smartform
```

```bash
# Using yarn
yarn add @aivue/core
yarn add @aivue/chatbot
yarn add @aivue/autosuggest
yarn add @aivue/smartform
```

## Basic Setup

### Setting Up the AI Client

The first step is to set up the AI client with your preferred provider:

```javascript
// main.js or a dedicated setup file
import { createApp } from 'vue';
import { AIClient } from '@aivue/core';
import App from './App.vue';

// Create an AI client
const aiClient = new AIClient({
  provider: 'openai', // 'openai', 'anthropic', 'gemini', 'huggingface', 'ollama', 'deepseek'
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Use environment variables for API keys
  model: 'gpt-4o', // Specify the model to use
  options: {
    // Provider-specific options
    temperature: 0.7,
    maxTokens: 1000
  }
});

// Make the client available to all components
const app = createApp(App);
app.provide('aiClient', aiClient);
app.mount('#app');
```

### Using the AI Client in Components

You can use the AI client in your components:

```vue
<script setup>
import { inject, ref } from 'vue';

// Inject the AI client
const aiClient = inject('aiClient');
const response = ref('');
const isLoading = ref(false);

async function generateResponse(prompt) {
  isLoading.value = true;
  try {
    const result = await aiClient.complete(prompt);
    response.value = result.text;
  } catch (error) {
    console.error('Error generating response:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <button @click="generateResponse('Tell me a joke')">Generate Joke</button>
    <div v-if="isLoading">Loading...</div>
    <div v-else>{{ response }}</div>
  </div>
</template>
```

## Using AIVue Components

### Chat Component

```vue
<script setup>
import { AiChatWindow } from '@aivue/chatbot';
import { inject } from 'vue';

const aiClient = inject('aiClient');
</script>

<template>
  <AiChatWindow 
    :client="aiClient"
    title="AI Assistant"
    placeholder="Ask me anything..."
  />
</template>
```

### Autosuggest Component

```vue
<script setup>
import { Autosuggest } from '@aivue/autosuggest';
import { inject, ref } from 'vue';

const aiClient = inject('aiClient');
const inputValue = ref('');
</script>

<template>
  <Autosuggest
    v-model="inputValue"
    :client="aiClient"
    placeholder="Start typing..."
    :debounce="300"
  />
</template>
```

### SmartForm Component

```vue
<script setup>
import { SmartForm } from '@aivue/smartform';
import { inject, ref } from 'vue';

const aiClient = inject('aiClient');
const formData = ref({
  name: '',
  email: '',
  message: ''
});

function onSubmit(data) {
  console.log('Form submitted:', data);
}
</script>

<template>
  <SmartForm
    v-model="formData"
    :client="aiClient"
    @submit="onSubmit"
  >
    <template #default="{ fields }">
      <div>
        <label>Name</label>
        <input v-model="fields.name" />
      </div>
      <div>
        <label>Email</label>
        <input v-model="fields.email" type="email" />
      </div>
      <div>
        <label>Message</label>
        <textarea v-model="fields.message"></textarea>
      </div>
      <button type="submit">Submit</button>
    </template>
  </SmartForm>
</template>
```

## Next Steps

- Explore the [Core Package](https://github.com/reachbrt/vueai/wiki/Core) documentation
- Learn about the [Chatbot Package](https://github.com/reachbrt/vueai/wiki/Chatbot)
- Check out the [Autosuggest Package](https://github.com/reachbrt/vueai/wiki/Autosuggest)
- Discover the [Smartform Package](https://github.com/reachbrt/vueai/wiki/Smartform)
- Read about [Advanced Configuration](https://github.com/reachbrt/vueai/wiki/Advanced-Configuration)
