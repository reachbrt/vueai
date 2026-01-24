# @aivue/guided-form

> 🎯 Transform form schemas into AI-assisted, one-question-at-a-time conversational experiences

[![npm version](https://img.shields.io/npm/v/@aivue/guided-form.svg)](https://www.npmjs.com/package/@aivue/guided-form)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/guided-form.svg)](https://www.npmjs.com/package/@aivue/guided-form)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🎨 **Core Capabilities**
- **📝 One-Question-at-a-Time Flow** - Guided conversational form experience
- **🤖 AI-Powered Assistance** - Hints, explanations, examples, and validation
- **⌨️ Smart Keyboard Navigation** - Enter to advance, numeric shortcuts, Tab navigation
- **📱 Mobile-First Design** - Large tap targets, sticky buttons, responsive layout
- **💾 Save & Resume** - Multiple persistence adapters (localStorage, sessionStorage, custom)
- **🔄 Conditional Logic** - Dynamic form flow based on user answers
- **✅ Advanced Validation** - Field-level and step-level validation with friendly messages
- **🎯 Progress Tracking** - Visual progress indicators and step completion
- **🌐 Vue 2 & 3 Compatible** - Works seamlessly with Vue 2.6+ and Vue 3.x

### 🎨 **Rich Input Types**
- Text, Textarea, Number, Email, Tel, URL
- Date, Time, DateTime
- Select, Multi-Select, Radio, Checkbox
- Rating, File Upload, Yes/No Chips
- Slider, Color Picker

### 🤖 **AI Integration**
- **OpenAI** - GPT-3.5, GPT-4
- **Anthropic** - Claude models
- **Custom Providers** - Bring your own AI endpoint

## 📦 Installation

```bash
npm install @aivue/guided-form @aivue/core
```

## 🚀 Quick Start

### Vue 3

```vue
<template>
  <div>
    <GuidedFormContainer
      :currentStep="currentStep"
      :currentStepIndex="currentStepIndex"
      :totalSteps="totalSteps"
      :progress="progress"
      :canGoBack="canGoBack"
      :canGoNext="canGoNext"
      :isComplete="isComplete"
      :isLoading="isLoading"
      :validationErrors="validationErrors"
      :aiEnabled="true"
      :showProgress="true"
      @next="goToNext"
      @previous="goToPrevious"
      @change="setAnswer"
      @getHint="handleGetHint"
    />
  </div>
</template>

<script setup>
import { useGuidedForm } from '@aivue/guided-form';

const schema = {
  id: 'contact-form',
  name: 'Contact Information',
  version: '1.0.0',
  status: 'published',
  steps: [
    {
      id: 'step-1',
      type: 'question',
      field: {
        fieldId: 'name',
        fieldType: 'text',
        required: true,
      },
      ui: {
        title: "What's your name?",
        subtitle: 'We\'d love to know who we\'re talking to',
        helpText: 'Enter your full name',
      },
    },
    {
      id: 'step-2',
      type: 'question',
      field: {
        fieldId: 'email',
        fieldType: 'email',
        required: true,
        validationRules: [
          { type: 'email', message: 'Please enter a valid email address' }
        ],
      },
      ui: {
        title: "What's your email address?",
        subtitle: 'We\'ll use this to get in touch',
      },
    },
  ],
  settings: {
    aiFlags: {
      enabled: true,
      provider: 'openai',
      apiKey: 'your-api-key',
      model: 'gpt-3.5-turbo',
    },
    keyboard: {
      enterToNext: true,
      numericShortcuts: true,
      tabNavigation: true,
    },
  },
};

const {
  currentStep,
  currentStepIndex,
  totalSteps,
  progress,
  canGoBack,
  canGoNext,
  isComplete,
  isLoading,
  validationErrors,
  goToNext,
  goToPrevious,
  setAnswer,
  getAIHint,
} = useGuidedForm({ schema });

const handleGetHint = async (type) => {
  const hints = await getAIHint(type);
  console.log('AI Hints:', hints);
};
</script>
```

### Vue 2

```vue
<template>
  <div>
    <GuidedFormContainer
      :currentStep="currentStep"
      :currentStepIndex="currentStepIndex"
      :totalSteps="totalSteps"
      :progress="progress"
      :canGoBack="canGoBack"
      :canGoNext="canGoNext"
      :isComplete="isComplete"
      :isLoading="isLoading"
      :validationErrors="validationErrors"
      @next="goToNext"
      @previous="goToPrevious"
      @change="setAnswer"
    />
  </div>
</template>

<script>
import { useGuidedForm } from '@aivue/guided-form';

export default {
  setup() {
    const schema = { /* same as above */ };
    
    return useGuidedForm({ schema });
  },
};
</script>
```

## 📚 Documentation

### Schema Definition

The form schema is a JSON object that defines the entire form structure:

```typescript
interface FormSchema {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  steps: Step[];
  settings?: FormSettings;
}
```

### Step Types

Each step can be one of four types:

- **question** - A form field that collects user input
- **info** - Informational content (no input required)
- **group** - A group of related questions
- **end** - Final step with completion message

### Field Types

All supported input types:

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single-line text input | Name, title |
| `textarea` | Multi-line text input | Comments, description |
| `number` | Numeric input | Age, quantity |
| `email` | Email address | user@example.com |
| `tel` | Phone number | +1-555-0100 |
| `url` | Website URL | https://example.com |
| `date` | Date picker | 2024-01-24 |
| `time` | Time picker | 14:30 |
| `datetime` | Date and time | 2024-01-24 14:30 |
| `select` | Dropdown selection | Country, category |
| `multiselect` | Multiple selections | Tags, interests |
| `radio` | Single choice from options | Gender, size |
| `checkbox` | Multiple choices | Preferences |
| `rating` | Star rating | 1-5 stars |
| `file` | File upload | Documents, images |
| `yesno` | Yes/No chips | Boolean questions |
| `slider` | Range slider | Volume, price range |
| `color` | Color picker | Theme color |

### Conditional Logic

Create dynamic forms that adapt based on user answers:

```typescript
{
  id: 'step-3',
  type: 'question',
  field: {
    fieldId: 'company',
    fieldType: 'text',
  },
  ui: {
    title: "What company do you work for?",
  },
  logic: {
    visibilityConditions: [
      {
        fieldId: 'employment',
        operator: 'equals',
        value: 'employed',
      }
    ],
    conditionalJumps: [
      {
        conditions: [
          {
            fieldId: 'company',
            operator: 'isEmpty',
          }
        ],
        logic: 'and',
        nextStepId: 'step-5', // Skip step 4
      }
    ],
  },
}
```

### AI Assistance

Enable AI-powered help for your forms:

```typescript
settings: {
  aiFlags: {
    enabled: true,
    provider: 'openai', // or 'anthropic' or 'custom'
    apiKey: process.env.VITE_OPENAI_API_KEY,
    model: 'gpt-3.5-turbo',
    // For custom providers:
    customEndpoint: 'https://your-api.com/chat',
  },
}
```

AI assistance types:
- **explain** - Get a simple explanation of the question
- **rewrite** - Rewrite the question in simpler language
- **example** - Get example answers
- **validate** - Get AI feedback on user's answer

### Keyboard Navigation

Built-in keyboard shortcuts for power users:

```typescript
settings: {
  keyboard: {
    enterToNext: true,        // Press Enter to go to next step
    numericShortcuts: true,   // Press 1-9 to select options
    tabNavigation: true,      // Tab/Shift+Tab to navigate
  },
}
```

### Save & Resume

Multiple persistence options:

```typescript
import {
  LocalStoragePersistenceAdapter,
  SessionStoragePersistenceAdapter,
  MemoryPersistenceAdapter,
  CustomPersistenceAdapter,
} from '@aivue/guided-form';

// LocalStorage (persists across sessions)
const persistence = new LocalStoragePersistenceAdapter('my-form');

// SessionStorage (cleared when tab closes)
const persistence = new SessionStoragePersistenceAdapter('my-form');

// Memory (lost on page refresh)
const persistence = new MemoryPersistenceAdapter();

// Custom (your own implementation)
const persistence = new CustomPersistenceAdapter(
  async (sessionId, state) => { /* save */ },
  async (sessionId) => { /* load */ },
  async (sessionId) => { /* delete */ }
);

// Use with composable
const form = useGuidedForm({
  schema,
  persistenceAdapter: persistence,
  sessionId: 'user-123',
});

// Save progress
await form.saveProgress();

// Resume session
await form.resumeSession('resume-token');
```

### Validation

Comprehensive validation rules:

```typescript
field: {
  fieldId: 'password',
  fieldType: 'text',
  required: true,
  validationRules: [
    { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
    { type: 'pattern', value: '^(?=.*[A-Z])(?=.*[0-9])', message: 'Must contain uppercase and number' },
  ],
}
```

Available validation types:
- `required` - Field must have a value
- `minLength` - Minimum string length
- `maxLength` - Maximum string length
- `min` - Minimum numeric value
- `max` - Maximum numeric value
- `pattern` - Regex pattern match
- `email` - Valid email format
- `url` - Valid URL format

## 🎨 Styling

The package includes Tailwind CSS styles. You can customize the theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... your colors
          900: '#0c4a6e',
        },
      },
    },
  },
};
```

## 🔧 API Reference

### useGuidedForm(options)

Main composable for form functionality.

**Options:**
- `schema` - Form schema object (required)
- `hooks` - Event hooks (optional)
- `persistenceAdapter` - Storage adapter (optional)
- `sessionId` - Session identifier (optional)
- `resumeToken` - Token to resume session (optional)
- `initialState` - Initial form state (optional)

**Returns:**
- `currentStep` - Current step object
- `currentStepIndex` - Current step index (0-based)
- `totalSteps` - Total number of steps
- `answers` - All user answers
- `isComplete` - Whether form is complete
- `isLoading` - Loading state
- `validationErrors` - Current validation errors
- `formState` - Complete form state
- `schema` - Form schema
- `progress` - Progress percentage (0-100)
- `canGoBack` - Whether user can go back
- `canGoNext` - Whether user can go forward
- `goToNext()` - Navigate to next step
- `goToPrevious()` - Navigate to previous step
- `goToStep(stepId)` - Navigate to specific step
- `setAnswer(fieldId, value)` - Set field answer
- `getAnswer(fieldId)` - Get field answer
- `clearAnswer(fieldId)` - Clear field answer
- `validateCurrentStep()` - Validate current step
- `validateField(fieldId, value)` - Validate specific field
- `getAIHint(type)` - Get AI assistance
- `saveProgress()` - Save current progress
- `resumeSession(token)` - Resume from token
- `resetForm()` - Reset form to initial state

## 📄 License

MIT © [reachbrt](https://github.com/reachbrt)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Credits

Created by [Bharat Kumar Subramanian](https://www.linkedin.com/in/bharatkumarsubramanian/)

Special thanks to:
- **Manoj** - Main guidance and mentorship
- **Thiru** - AI sessions and teaching

---

Part of the [@aivue](https://github.com/reachbrt/vueai) ecosystem - AI-powered Vue.js components


