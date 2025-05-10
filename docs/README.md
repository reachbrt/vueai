# AIVue Documentation

Welcome to the AIVue documentation! AIVue is a collection of AI-powered components for Vue.js applications, providing a unified interface for working with multiple AI providers and ready-to-use components for common AI use cases.

## 📦 Packages

AIVue is organized as a monorepo with the following packages:

| Package | Description | Version | Links |
|---------|-------------|---------|-------|
| [@aivue/core](https://www.npmjs.com/package/@aivue/core) | Core AI functionality for Vue.js components | [![npm version](https://img.shields.io/npm/v/@aivue/core.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/core) | [Documentation](https://github.com/reachbrt/vueai/wiki/Core) |
| [@aivue/chatbot](https://www.npmjs.com/package/@aivue/chatbot) | AI-powered chat components for Vue.js | [![npm version](https://img.shields.io/npm/v/@aivue/chatbot.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/chatbot) | [Documentation](https://github.com/reachbrt/vueai/wiki/Chatbot) |
| [@aivue/autosuggest](https://www.npmjs.com/package/@aivue/autosuggest) | AI-powered suggestion components for Vue.js | [![npm version](https://img.shields.io/npm/v/@aivue/autosuggest.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/autosuggest) | [Documentation](https://github.com/reachbrt/vueai/wiki/Autosuggest) |
| [@aivue/smartform](https://www.npmjs.com/package/@aivue/smartform) | AI-powered form validation for Vue.js | [![npm version](https://img.shields.io/npm/v/@aivue/smartform.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/smartform) | [Documentation](https://github.com/reachbrt/vueai/wiki/Smartform) |

## 🚀 Quick Start

### Installation

```bash
# Install the core package and any component packages you need
npm install @aivue/core @aivue/chatbot
```

### Basic Usage

```javascript
import { AIClient } from '@aivue/core';
import { AiChatWindow } from '@aivue/chatbot';

// Create a client with your preferred provider
const client = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});
```

## 📚 Documentation

### Package Documentation
- [Getting Started](https://github.com/reachbrt/vueai/wiki/Getting-Started)
- [Core Package](https://github.com/reachbrt/vueai/wiki/Core)
- [Chatbot Package](https://github.com/reachbrt/vueai/wiki/Chatbot)
- [Autosuggest Package](https://github.com/reachbrt/vueai/wiki/Autosuggest)
- [Smartform Package](https://github.com/reachbrt/vueai/wiki/Smartform)
- [Advanced Configuration](https://github.com/reachbrt/vueai/wiki/Advanced-Configuration)
- [Migration Guide](https://github.com/reachbrt/vueai/wiki/Migration-Guide)

### Additional Documentation
- [AI Providers](AI_PROVIDERS.md): Information about supported AI providers
- [Demo Fixes](DEMO_FIXES.md): Common fixes for the demo application
- [Deployment](DEPLOYMENT.md): Guide to deploying VueAI
- [Release Notes](RELEASE_NOTES.md): Release notes for VueAI

## 🧠 Supported AI Providers

AIVue supports multiple AI providers through a unified interface:

- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google (Gemini)
- HuggingFace
- Ollama (local models)
- DeepSeek
- Custom providers

## 🤝 Contributing

We welcome contributions to AIVue! Please see our [Contributing Guide](https://github.com/reachbrt/vueai/wiki/Contributing) for more information.

## 📄 License

AIVue is [MIT licensed](https://github.com/reachbrt/vueai/blob/main/LICENSE).
