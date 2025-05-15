<div align="center">
  <img src="vueai-logo.svg" alt="VueAI Logo" width="300" height="120" />

  <h1>VueAI - Modern AI Components for Vue.js</h1>

  <p>
    <a href="https://www.npmjs.com/package/@aivue/core"><img src="https://img.shields.io/npm/v/@aivue/core.svg?style=flat-square" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@aivue/core"><img src="https://img.shields.io/npm/dm/@aivue/core.svg?style=flat-square" alt="npm downloads"></a>
    <a href="https://www.npmjs.com/package/@aivue/core"><img src="https://img.shields.io/npm/d18m/%40aivue%2Fcore" alt="NPM Downloads"></a>
    <a href="https://github.com/reachbrt/vueai/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aivue/core.svg?style=flat-square" alt="MIT License"></a>
    <a href="https://codecov.io/gh/reachbrt/vueai"><img src="https://codecov.io/gh/reachbrt/vueai/graph/badge.svg?token=8LYV3M14ZG" alt="codecov"></a>
    <a href="https://app.netlify.com/sites/aivue/deploys"><img src="https://api.netlify.com/api/v1/badges/5cb37fa7-9ee1-4af6-9ff4-d34ff0322ded/deploy-status" alt="Netlify Status"></a>
  </p>

  <p><a href="https://aivue.netlify.app/" target="_blank">📺 Live Demo</a> • <a href="https://github.com/reachbrt/vueai/wiki" target="_blank">📚 Documentation</a> • <a href="https://github.com/reachbrt/vueai/issues/new" target="_blank">🐛 Report Bug</a></p>
</div>

## ✨ Features

A modular AI-powered Vue.js component suite that enhances your applications with intelligent capabilities:

<table>
  <tr>
    <td align="center" width="25%">
      <img src="demo/src/assets/images/chatbot-illustration.svg" width="80" height="80"><br>
      <a href="https://www.npmjs.com/package/@aivue/chatbot"><b>@aivue/chatbot</b></a><br>
      <small>Multi-provider AI chat widget</small>
    </td>
    <td align="center" width="25%">
      <img src="demo/src/assets/images/autosuggest-illustration.svg" width="80" height="80"><br>
      <a href="https://www.npmjs.com/package/@aivue/autosuggest"><b>@aivue/autosuggest</b></a><br>
      <small>Smart autosuggest with semantic ranking</small>
    </td>
    <td align="center" width="25%">
      <img src="demo/src/assets/images/smartform-illustration.svg" width="80" height="80"><br>
      <a href="https://www.npmjs.com/package/@aivue/smartform"><b>@aivue/smartform</b></a><br>
      <small>AI-enhanced forms with dynamic validation</small>
    </td>
    <td align="center" width="25%">
      <img src="demo/src/assets/images/hero-illustration.svg" width="80" height="80"><br>
      <a href="https://www.npmjs.com/package/@aivue/core"><b>@aivue/core</b></a><br>
      <small>Core AI functionality for Vue.js components</small>
    </td>
  </tr>
</table>

## 🚀 Quick Start

### 📦 Installation

<table>
<tr>
<td>

```bash
# Install the core package
npm install @aivue/core

# Install component packages as needed
npm install @aivue/chatbot
npm install @aivue/autosuggest
npm install @aivue/smartform

# Or install all packages at once
npm install @aivue/core @aivue/chatbot @aivue/autosuggest @aivue/smartform
```

</td>
<td>

**Key Benefits:**
- 🔌 Plug-n-play Vue 3 & Nuxt support
- 🛡️ SOC2-ready AI APIs with multiple provider options
- 🌐 Works with or without API keys during development
- 🎬 YouTube + Replit templates

</td>
</tr>
</table>

### 🔑 API Key Setup

<div class="api-key-setup">
  <div class="setup-steps">
    <ol>
      <li>Create a <code>.env</code> file in your project root (this file will be automatically excluded from Git)</li>
      <li>Add your API keys for the providers you want to use:</li>
    </ol>
  </div>

  <div class="code-example">

```bash
# OpenAI API Key
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Claude API Key (optional)
VITE_CLAUDE_API_KEY=your_claude_api_key_here

# Gemini API Key (optional)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# HuggingFace API Key (optional)
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# DeepSeek API Key (optional)
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

  </div>
</div>

> **Note:** If you don't have API keys, the components will still work using the fallback provider which simulates AI responses.

---

## 🏗️ Structure
```
vueai/
├── packages/
│   ├── core/           # @aivue/core
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── providers/
│   │   │       ├── openai.ts
│   │   │       ├── claude.ts
│   │   │       ├── gemini.ts
│   │   │       ├── huggingface.ts
│   │   │       ├── ollama.ts
│   │   │       ├── deepseek.ts
│   │   │       └── fallback.ts
│   ├── chatbot/        # @aivue/chatbot
│   ├── autosuggest/    # @aivue/autosuggest
│   └── smartform/      # @aivue/smartform
└── package.json        # Root package.json with workspace configuration
```

---

## 📦 Component Packages

<div class="component-cards">
  <div class="component-card">
    <div class="card-header">
      <img src="demo/src/assets/images/chatbot-illustration.svg" width="60" height="60" alt="Chatbot">
      <h3>@aivue/chatbot <a href="https://www.npmjs.com/package/@aivue/chatbot"><img src="https://img.shields.io/npm/v/@aivue/chatbot.svg?style=flat-square" alt="npm version"></a> <a href="https://www.npmjs.com/package/@aivue/chatbot"><img src="https://img.shields.io/npm/d18m/%40aivue%2Fchatbot" alt="NPM Downloads"></a></h3>
    </div>
    <div class="card-features">
      <ul>
        <li>✅ Multi-provider support (OpenAI, Claude, Gemini, HuggingFace, Ollama, DeepSeek)</li>
        <li>✅ Automatic fallback when API keys aren't available</li>
        <li>✅ Streaming responses with Markdown support</li>
        <li>✅ File upload, PDF parsing, history tracking</li>
        <li>✅ "Fix with AI" feature for automatic corrections</li>
      </ul>
    </div>
    <div class="card-code">

```vue
<template>
  <AiChatWindow
    :client="aiClient"
    title="AI Assistant"
    placeholder="Ask me anything..."
    :show-avatars="true"
    theme="light"
    :streaming="true"
    :markdown="true"
    system-prompt="You are a helpful AI assistant."
  />
</template>

<script setup>
import { AIClient } from '@aivue/core';
import { AiChatWindow } from '@aivue/chatbot';
import '@aivue/chatbot/style.css';

const aiClient = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});
</script>
```

  </div>
  </div>

  <div class="component-card">
    <div class="card-header">
      <img src="demo/src/assets/images/autosuggest-illustration.svg" width="60" height="60" alt="Autosuggest">
      <h3>@aivue/autosuggest <a href="https://www.npmjs.com/package/@aivue/autosuggest"><img src="https://img.shields.io/npm/v/@aivue/autosuggest.svg?style=flat-square" alt="npm version"></a> <a href="https://www.npmjs.com/package/@aivue/autosuggest"><img src="https://img.shields.io/npm/d18m/%40aivue%2Fautosuggest" alt="NPM Downloads"></a></h3>
    </div>
    <div class="card-features">
      <ul>
        <li>✅ AI-powered results with semantic sort</li>
        <li>✅ Multi-provider support with automatic fallback</li>
        <li>✅ Contextual suggestions based on domain</li>
        <li>✅ Customizable UI and behavior</li>
      </ul>
    </div>
    <div class="card-code">

```vue
<template>
  <AiAutosuggest
    :client="aiClient"
    v-model="query"
    placeholder="Search..."
    :debounce="300"
    :context="'Vue.js components and libraries'"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue';
import { AIClient } from '@aivue/core';
import { AiAutosuggest } from '@aivue/autosuggest';

const query = ref('');
const aiClient = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});

function handleSelect(suggestion) {
  console.log('Selected:', suggestion);
}
</script>
```

  </div>
  </div>

  <div class="component-card">
    <div class="card-header">
      <img src="demo/src/assets/images/smartform-illustration.svg" width="60" height="60" alt="SmartForm">
      <h3>@aivue/smartform <a href="https://www.npmjs.com/package/@aivue/smartform"><img src="https://img.shields.io/npm/v/@aivue/smartform.svg?style=flat-square" alt="npm version"></a> <a href="https://www.npmjs.com/package/@aivue/smartform"><img src="https://img.shields.io/npm/d18m/%40aivue%2Fsmartform" alt="NPM Downloads"></a></h3>
    </div>
    <div class="card-features">
      <ul>
        <li>✅ AI-powered validation + dynamic healing</li>
        <li>✅ Multi-provider support with automatic fallback</li>
        <li>✅ Intelligent form field suggestions</li>
        <li>✅ "Fix with AI" feature for automatic corrections</li>
      </ul>
    </div>
    <div class="card-code">

```vue
<template>
  <AiSmartForm
    :client="aiClient"
    :schema="formSchema"
    validation="ai"
    @submit="handleSubmit"
  />
</template>

<script setup>
import { ref } from 'vue';
import { AIClient } from '@aivue/core';
import { AiSmartForm } from '@aivue/smartform';

const aiClient = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

const formSchema = ref({
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      minLength: 50
    }
  ]
});

function handleSubmit(data) {
  console.log('Form submitted:', data);
}
</script>
```

  </div>
  </div>

---

## 🧠 @aivue/core Shared AI Engine

<div class="component-card core-card">
  <div class="card-header">
    <img src="demo/src/assets/images/hero-illustration.svg" width="60" height="60" alt="Core">
    <h3>@aivue/core <a href="https://www.npmjs.com/package/@aivue/core"><img src="https://img.shields.io/npm/v/@aivue/core.svg?style=flat-square" alt="npm version"></a> <a href="https://www.npmjs.com/package/@aivue/core"><img src="https://img.shields.io/npm/d18m/%40aivue%2Fcore" alt="NPM Downloads"></a></h3>
  </div>
  <div class="card-description">
    <p>Our core package provides a unified interface for working with multiple AI providers, complete with an automatic fallback mechanism that ensures your components work even without API keys.</p>
  </div>
  <div class="card-features">
    <ul>
      <li>✅ Multi-provider support (OpenAI, Claude, Gemini, HuggingFace, Ollama, DeepSeek)</li>
      <li>✅ Automatic fallback when API keys aren't available</li>
      <li>✅ Unified API for chat, embeddings, and validation</li>
      <li>✅ TypeScript support with comprehensive type definitions</li>
    </ul>
  </div>
  <div class="card-code">

```ts
import { AIClient } from '@aivue/core';

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

// Complete text (for autosuggest)
const completion = await client.complete('How do I install Vue', {
  maxTokens: 100
});
```

  </div>
</div>

---

## 🛡️ Fallback Mechanism

<div class="feature-section fallback-section">
  <div class="feature-content">
    <h3>Develop Without API Keys</h3>
    <p>All VueAI components include an intelligent fallback system when API keys aren't available:</p>

    <ul class="feature-list">
      <li>🔍 Automatically detects missing API keys</li>
      <li>🤖 Provides simulated responses that match the expected shape</li>
      <li>💡 Generates semantically reasonable suggestions</li>
      <li>🚀 Delivers smooth user experience during development</li>
      <li>🔄 Works with all supported providers seamlessly</li>
    </ul>
  </div>

  <div class="feature-image">
    <img src="demo/src/assets/images/hero-illustration.svg" width="200" height="150" alt="Fallback Mechanism">
  </div>
</div>

## 🧪 Testing & Development

<div class="code-tabs">
  <div class="tab">
    <div class="tab-header">Testing Setup</div>
    <div class="tab-content">

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

  </div>
  </div>

  <div class="tab">
    <div class="tab-header">Build & Publish</div>
    <div class="tab-content">

```bash
# Build all packages
npm run build:packages

# Publish packages
npm publish --access public --workspace @aivue/core
npm publish --access public --workspace @aivue/chatbot
npm publish --access public --workspace @aivue/autosuggest
npm publish --access public --workspace @aivue/smartform

# Or use the publish script
npm run publish:packages
```

  </div>
  </div>
</div>

## 📚 Resources

<div class="resources-grid">
  <a href="https://aivue.netlify.app/" class="resource-card" target="_blank">
    <div class="resource-icon">📺</div>
    <div class="resource-content">
      <h4>Live Demo</h4>
      <p>Interactive demo of all components</p>
    </div>
  </a>

  <a href="https://github.com/reachbrt/vueai/wiki" class="resource-card" target="_blank">
    <div class="resource-icon">📚</div>
    <div class="resource-content">
      <h4>Documentation Wiki</h4>
      <p>Comprehensive guides and API references</p>
    </div>
  </a>

  <a href="https://github.com/reachbrt/vueai/wiki/Contributing" class="resource-card" target="_blank">
    <div class="resource-icon">🤝</div>
    <div class="resource-content">
      <h4>Contributing Guide</h4>
      <p>Help improve VueAI components</p>
    </div>
  </a>

  <a href="https://github.com/reachbrt/vueai/issues/new" class="resource-card" target="_blank">
    <div class="resource-icon">🐛</div>
    <div class="resource-content">
      <h4>Report Issues</h4>
      <p>Submit bugs or feature requests</p>
    </div>
  </a>
</div>

## 📄 License

<div class="license-section">
  <p>MIT © 2025 Bharatkumar Subramanian</p>

  <div class="author-info">
    <h3>Author & Maintainer</h3>
    <p><strong>Bharatkumar Subramanian</strong></p>
    <p>Email: <a href="mailto:reachbrt@gmail.com">reachbrt@gmail.com</a></p>
    <p>GitHub: <a href="https://github.com/reachbrt" target="_blank">github.com/reachbrt</a></p>
  </div>
</div>