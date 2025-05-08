# Migration Guide

This guide helps you migrate between different versions of AIVue packages.

## Migrating from @reachbrt/vueai-* to @aivue/*

With version 1.0.0, all packages have been renamed from the `@reachbrt/vueai-*` scope to the `@aivue/*` scope. This guide will help you migrate your code to use the new package names.

### Step 1: Uninstall Old Packages

First, uninstall the old packages:

```bash
npm uninstall @reachbrt/vueai-core @reachbrt/vueai-chatbot @reachbrt/vueai-autosuggest @reachbrt/vueai-smartform
```

### Step 2: Install New Packages

Install the new packages:

```bash
npm install @aivue/core @aivue/chatbot @aivue/autosuggest @aivue/smartform
```

### Step 3: Update Import Statements

Update all import statements in your code:

```javascript
// From
import { AIClient } from '@reachbrt/vueai-core';
import { AiChatWindow } from '@reachbrt/vueai-chatbot';
import { Autosuggest } from '@reachbrt/vueai-autosuggest';
import { SmartForm } from '@reachbrt/vueai-smartform';

// To
import { AIClient } from '@aivue/core';
import { AiChatWindow } from '@aivue/chatbot';
import { Autosuggest } from '@aivue/autosuggest';
import { SmartForm } from '@aivue/smartform';
```

### Step 4: Update Configuration

If you have any configuration files that reference the old package names, update them:

```javascript
// From
module.exports = {
  // ...
  externals: ['vue', '@reachbrt/vueai-core'],
  // ...
};

// To
module.exports = {
  // ...
  externals: ['vue', '@aivue/core'],
  // ...
};
```

### Step 5: Update Documentation

If you have any documentation or README files that reference the old package names, update them:

```markdown
<!-- From -->
# My Project

This project uses [@reachbrt/vueai-core](https://www.npmjs.com/package/@reachbrt/vueai-core) for AI functionality.

<!-- To -->
# My Project

This project uses [@aivue/core](https://www.npmjs.com/package/@aivue/core) for AI functionality.
```

## API Changes in Version 1.0.0

### Core Package

#### AIClient

The `AIClient` constructor now accepts a more streamlined configuration object:

```javascript
// Before (v0.x)
const client = new AIClient({
  provider: {
    name: 'openai',
    apiKey: 'your-api-key',
    model: 'gpt-4'
  },
  options: {
    temperature: 0.7
  }
});

// After (v1.x)
const client = new AIClient({
  provider: 'openai',
  apiKey: 'your-api-key',
  model: 'gpt-4o',
  options: {
    temperature: 0.7
  }
});
```

#### Streaming API

The streaming API has been simplified:

```javascript
// Before (v0.x)
client.streamChat(messages, options)
  .on('token', (token) => console.log(token))
  .on('complete', (response) => console.log(response))
  .on('error', (error) => console.error(error));

// After (v1.x)
client.streamChat(
  messages,
  options,
  {
    onToken: (token) => console.log(token),
    onComplete: (response) => console.log(response),
    onError: (error) => console.error(error)
  }
);
```

### Chatbot Package

#### AiChatWindow

The `AiChatWindow` component has new props and improved styling:

```vue
<!-- Before (v0.x) -->
<AiChatWindow
  :client="client"
  title="Chat"
  :messages="messages"
  @send="handleSend"
/>

<!-- After (v1.x) -->
<AiChatWindow
  :client="client"
  title="Chat"
  :initial-messages="initialMessages"
  system-prompt="You are a helpful assistant."
  :streaming="true"
  :show-avatars="true"
  theme="light"
/>
```

#### useChatEngine

The `useChatEngine` composable has new options:

```javascript
// Before (v0.x)
const { messages, sendMessage } = useChatEngine({
  client,
  initialMessages: []
});

// After (v1.x)
const { 
  messages, 
  isLoading, 
  error, 
  sendMessage, 
  clearMessages 
} = useChatEngine({
  client,
  initialMessages: [],
  systemPrompt: 'You are a helpful assistant.',
  streaming: true,
  persistenceKey: 'chat-history'
});
```

### Autosuggest Package

#### Autosuggest

The `Autosuggest` component has new props:

```vue
<!-- Before (v0.x) -->
<Autosuggest
  v-model="input"
  :client="client"
  :options="options"
/>

<!-- After (v1.x) -->
<Autosuggest
  v-model="input"
  :client="client"
  :debounce="300"
  :min-length="2"
  :max-suggestions="5"
  theme="light"
/>
```

### Smartform Package

#### SmartForm

The `SmartForm` component has new props and improved validation:

```vue
<!-- Before (v0.x) -->
<SmartForm
  v-model="formData"
  :client="client"
  :schema="schema"
  @submit="handleSubmit"
/>

<!-- After (v1.x) -->
<SmartForm
  v-model="formData"
  :client="client"
  :validation-mode="'onChange'"
  :auto-correct="true"
  :feedback-delay="500"
  theme="light"
  @submit="handleSubmit"
  @validation-error="handleError"
/>
```

## Breaking Changes

- All packages have been renamed from `@reachbrt/vueai-*` to `@aivue/*`
- The `AIClient` constructor has a new configuration format
- The streaming API uses callbacks instead of event emitters
- Some component props have been renamed or removed
- Default styling has been updated and uses CSS variables for customization

## Deprecated Features

The following features are deprecated in version 1.0.0 and will be removed in a future version:

- The `createAIClient` factory function (use the `AIClient` constructor instead)
- The `on` method for streaming (use the callbacks object instead)
- The `setMessages` prop on `AiChatWindow` (use `initialMessages` instead)
- The `schema` prop on `SmartForm` (use the new validation system instead)

## Future Changes

In upcoming versions, we plan to:

- Add support for more AI providers
- Improve TypeScript types and documentation
- Add more customization options for components
- Enhance performance and reduce bundle size

Stay tuned for updates!
