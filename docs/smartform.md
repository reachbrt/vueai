# @aivue/smartform

The `@aivue/smartform` package provides AI-powered form validation for Vue.js applications. It offers intelligent form validation, auto-correction, and suggestions based on context, with support for multiple AI providers.

[![npm version](https://img.shields.io/npm/v/@aivue/smartform.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/smartform)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/smartform.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/smartform)

## Installation

```bash
# npm
npm install @aivue/smartform @aivue/core

# yarn
yarn add @aivue/smartform @aivue/core

# pnpm
pnpm add @aivue/smartform @aivue/core
```

## Basic Usage

```vue
<script setup>
import { SmartForm } from '@aivue/smartform';
import { AIClient } from '@aivue/core';
import { ref } from 'vue';

const client = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});

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
    :client="client"
    @submit="onSubmit"
  >
    <template #default="{ fields, errors }">
      <div>
        <label>Name</label>
        <input v-model="fields.name" />
        <div v-if="errors.name" class="error">{{ errors.name }}</div>
      </div>
      <div>
        <label>Email</label>
        <input v-model="fields.email" type="email" />
        <div v-if="errors.email" class="error">{{ errors.email }}</div>
      </div>
      <div>
        <label>Message</label>
        <textarea v-model="fields.message"></textarea>
        <div v-if="errors.message" class="error">{{ errors.message }}</div>
      </div>
      <button type="submit">Submit</button>
    </template>
  </SmartForm>
</template>
```

## Components

### SmartForm

A component that provides AI-powered form validation and suggestions.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Object` | `{}` | The form data (v-model) |
| `client` | `AIClient` | **Required** | The AIClient instance to use for validation |
| `validationMode` | `String` | `'onChange'` | When to validate ('onChange', 'onBlur', 'onSubmit') |
| `autoCorrect` | `Boolean` | `false` | Whether to auto-correct form values |
| `feedbackDelay` | `Number` | `500` | Delay before showing validation feedback |
| `theme` | `String` | `'light'` | Theme for the component ('light' or 'dark') |
| `disabled` | `Boolean` | `false` | Whether the form is disabled |
| `loading` | `Boolean` | `false` | Whether to show a loading indicator |
| `schema` | `Object` | `null` | Validation schema (optional) |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `value` | Emitted when the form data changes |
| `submit` | `data` | Emitted when the form is submitted |
| `validation-error` | `errors` | Emitted when validation errors occur |
| `validation-success` | `data` | Emitted when validation succeeds |
| `field-change` | `{ field, value }` | Emitted when a field value changes |
| `field-blur` | `{ field, value }` | Emitted when a field is blurred |
| `error` | `error` | Emitted when an error occurs |

#### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `default` | `{ fields, errors, loading, submit }` | Custom rendering for the form |
| `field` | `{ field, value, error, loading }` | Custom field rendering |
| `error` | `{ error }` | Custom error rendering |
| `loading` | - | Content to show when loading |
| `success` | - | Content to show on successful submission |

## Composables

### useSmartForm

A composable for managing form state and AI-powered validation.

```vue
<script setup>
import { useSmartForm } from '@aivue/smartform';
import { AIClient } from '@aivue/core';
import { ref } from 'vue';

const client = new AIClient({
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4o'
});

const initialData = {
  name: '',
  email: '',
  message: ''
};

const options = {
  client,
  validationMode: 'onChange',
  autoCorrect: true,
  feedbackDelay: 500
};

const { 
  formData, 
  errors, 
  isLoading, 
  isValid, 
  validateField, 
  validateForm, 
  submitForm 
} = useSmartForm(initialData, options);

function handleSubmit() {
  submitForm().then(data => {
    console.log('Form submitted:', data);
  }).catch(error => {
    console.error('Validation failed:', error);
  });
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Name</label>
      <input 
        v-model="formData.name" 
        @blur="validateField('name')" 
      />
      <div v-if="errors.name" class="error">{{ errors.name }}</div>
    </div>
    
    <div>
      <label>Email</label>
      <input 
        v-model="formData.email" 
        type="email" 
        @blur="validateField('email')" 
      />
      <div v-if="errors.email" class="error">{{ errors.email }}</div>
    </div>
    
    <div>
      <label>Message</label>
      <textarea 
        v-model="formData.message" 
        @blur="validateField('message')" 
      ></textarea>
      <div v-if="errors.message" class="error">{{ errors.message }}</div>
    </div>
    
    <button type="submit" :disabled="isLoading || !isValid">
      {{ isLoading ? 'Validating...' : 'Submit' }}
    </button>
  </form>
</template>
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `client` | `AIClient` | **Required** | The AIClient instance to use |
| `validationMode` | `String` | `'onChange'` | When to validate |
| `autoCorrect` | `Boolean` | `false` | Whether to auto-correct form values |
| `feedbackDelay` | `Number` | `500` | Delay before showing validation feedback |
| `schema` | `Object` | `null` | Validation schema (optional) |
| `onError` | `Function` | `null` | Callback function when an error occurs |

#### Return Values

| Value | Type | Description |
|-------|------|-------------|
| `formData` | `Ref<Object>` | Reactive form data |
| `errors` | `Ref<Object>` | Validation errors by field |
| `isLoading` | `Ref<Boolean>` | Whether validation is in progress |
| `isValid` | `Ref<Boolean>` | Whether the form is valid |
| `validateField` | `Function` | Function to validate a single field |
| `validateForm` | `Function` | Function to validate the entire form |
| `submitForm` | `Function` | Function to validate and submit the form |
| `resetForm` | `Function` | Function to reset the form to initial values |
| `setFieldValue` | `Function` | Function to set a field value |

## Related Packages

- [@aivue/core](./core.md) - Core AI functionality for Vue.js components
- [@aivue/chatbot](./chatbot.md) - AI-powered chat components for Vue.js
- [@aivue/autosuggest](./autosuggest.md) - AI-powered suggestion components for Vue.js
