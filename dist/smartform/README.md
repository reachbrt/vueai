# @aivue/smartform

[![npm version](https://img.shields.io/npm/v/@aivue/smartform.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/smartform)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/smartform.svg?style=flat-square)](https://www.npmjs.com/package/@aivue/smartform)
[![GitHub license](https://img.shields.io/github/license/reachbrt/vueai.svg?style=flat-square)](https://github.com/reachbrt/vueai/blob/main/LICENSE)

AI-powered smart forms with validation for Vue.js. This package provides intelligent form validation and enhancement using AI.

## Features

- 🧠 **AI-Powered Validation**: Validate form fields using AI
- 🎨 **Color-Coded Feedback**: Green for valid, yellow for suggestions, red for errors
- 🔄 **Real-Time Validation**: Validate as you type
- 📝 **Form Enhancement**: AI analysis of submitted data
- 🔌 **Multiple AI Providers**: Support for OpenAI, Anthropic, Google AI, and Azure OpenAI
- 🎯 **Schema-Based Forms**: Define forms using a simple schema

## Installation

```bash
npm install @aivue/smartform @aivue/core
```

## Usage

### Basic Usage

```vue
<template>
  <AiSmartForm
    :client="aiClient"
    :schema="formSchema"
    @submit="handleSubmit"
  />
</template>

<script>
import { defineComponent } from 'vue';
import { AiSmartForm } from '@aivue/smartform';
import { AIClient } from '@aivue/core';

export default defineComponent({
  components: {
    AiSmartForm
  },
  setup() {
    const aiClient = new AIClient({
      provider: 'openai',
      apiKey: 'your-api-key', // Replace with your API key
    });

    const formSchema = {
      title: 'Contact Form',
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          required: true
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          validation: {
            pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
            message: 'Please enter a valid email address'
          }
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea'
        }
      ]
    };

    const handleSubmit = (data) => {
      console.log('Form submitted:', data);
      // data._aiAnalysis contains AI analysis of the form data
    };

    return {
      aiClient,
      formSchema,
      handleSubmit
    };
  }
});
</script>
```

### AI Validation

To enable AI-powered validation, set the `validation` prop to `"ai"`:

```vue
<AiSmartForm
  :client="aiClient"
  :schema="formSchema"
  validation="ai"
  @submit="handleSubmit"
/>
```

This will enable:
- Real-time validation as you type
- Color-coded feedback (green, yellow, red)
- Helpful validation messages

### Form Schema

The form schema is a simple object that defines the form fields:

```javascript
const formSchema = {
  title: 'Registration Form',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      validation: {
        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
        message: 'Please enter a valid email address'
      }
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      type: 'date'
    },
    {
      name: 'interests',
      label: 'Interests',
      type: 'select',
      multiple: true,
      options: [
        { value: 'tech', label: 'Technology' },
        { value: 'music', label: 'Music' },
        { value: 'sports', label: 'Sports' },
        { value: 'reading', label: 'Reading' }
      ]
    },
    {
      name: 'subscribe',
      label: 'Subscribe to newsletter',
      type: 'checkbox'
    }
  ]
};
```

### Supported Field Types

- `text`: Text input
- `email`: Email input
- `password`: Password input
- `number`: Number input
- `date`: Date input
- `textarea`: Multiline text input
- `select`: Dropdown select (with `options` array)
- `checkbox`: Checkbox input

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `client` | `Object` | - | AI client instance from `@aivue/core` |
| `schema` | `Object` | - | Form schema object |
| `validation` | `Boolean\|String` | `false` | Enable validation. Set to `"ai"` for AI validation |
| `theme` | `String` | - | Theme for the form (`"light"` or `"dark"`) |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `Object` | Emitted when the form is submitted. Contains form data and AI analysis |

## License

[MIT](https://github.com/reachbrt/vueai/blob/main/LICENSE)

## Author

[reachbrt](https://github.com/reachbrt)
