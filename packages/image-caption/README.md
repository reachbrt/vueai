# @aivue/image-caption

[![npm version](https://badge.fury.io/js/@aivue%2Fimage-caption.svg)](https://badge.fury.io/js/@aivue%2Fimage-caption)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

🖼️ **AI-powered image captioning for Vue.js applications using OpenAI Vision API**

Generate intelligent, contextual captions for images using GPT-4 Vision, the most advanced computer vision model available. Perfect for accessibility, content management, social media, and AI-powered applications.

## ✨ Features

- 🤖 **GPT-4 Vision** - Most advanced image understanding AI
- 🎯 **Easy Integration** - Drop-in Vue component with minimal setup
- 🔑 **Simple Authentication** - Just add your OpenAI API key
- 📱 **Drag & Drop Upload** - Intuitive file upload with preview
- 🌐 **URL Support** - Caption images from URLs
- 📊 **Batch Processing** - Process multiple images at once
- 📈 **History Tracking** - Keep track of generated captions
- 💾 **Export Data** - Export captions as JSON or CSV
- 🎨 **Beautiful UI** - Modern, responsive design
- 🔧 **TypeScript Support** - Full type definitions included
- 📱 **Mobile Friendly** - Works great on all devices

## 🚀 Quick Start

### Installation

```bash
npm install @aivue/image-caption
```

### Basic Usage

```vue
<template>
  <div>
    <AiImageCaption
      :api-key="openaiApiKey"
      @caption-generated="onCaptionGenerated"
    />
  </div>
</template>

<script setup>
import { AiImageCaption } from '@aivue/image-caption';
import '@aivue/image-caption/dist/image-caption.css';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const onCaptionGenerated = (result) => {
  console.log('Generated caption:', result.caption);
};
</script>
```

### Environment Variables

Set your API key in environment variables:

```bash
# .env
VITE_OPENAI_API_KEY=your-openai-api-key
```

## 📖 API Reference

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiKey` | `string` | `''` | OpenAI API key |
| `model` | `string` | `'gpt-4o'` | AI model to use |
| `autoCaption` | `boolean` | `false` | Auto-generate caption on image upload |
| `maxHistorySize` | `number` | `20` | Maximum number of captions to keep in history |

### Component Events

| Event | Payload | Description |
|-------|---------|-------------|
| `caption-generated` | `ImageCaptionResult` | Fired when caption is successfully generated |
| `caption-error` | `Error` | Fired when caption generation fails |
| `image-uploaded` | `ImageUploadEvent` | Fired when image is uploaded |
| `image-removed` | `void` | Fired when image is removed |

### Composable Usage

```vue
<script setup>
import { useImageCaption } from '@aivue/image-caption';

const {
  generateCaption,
  uploadImage,
  isProcessing,
  result,
  error,
  history
} = useImageCaption({
  config: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: 'gpt-4o'
  }
});

// Generate caption for uploaded file
const handleFileUpload = async (file) => {
  try {
    await uploadImage(file);
    const result = await generateCaption(file);
    console.log('Caption:', result.caption);
  } catch (error) {
    console.error('Failed:', error);
  }
};
</script>
```

## 🎯 Available Models

| Model | ID | Description | Best For |
|-------|----|-----------| ---------|
| **GPT-4o** | `gpt-4o` | Latest and most capable vision model | General use, highest quality |
| **GPT-4o Mini** | `gpt-4o-mini` | Faster and more cost-effective | High volume, cost-sensitive apps |
| **GPT-4 Turbo** | `gpt-4-turbo` | High-intelligence vision model | Detailed analysis, complex scenes |

## 🔧 Configuration Options

```typescript
interface ImageCaptionConfig {
  apiKey?: string;                    // OpenAI API key
  model?: string;                     // Model ID to use ('gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo')
}

interface ImageCaptionOptions {
  model?: string;                     // Override model for this request
  prompt?: string;                    // Custom prompt for caption generation
  detail?: 'low' | 'high' | 'auto';   // Image analysis detail level
  maxTokens?: number;                 // Maximum response tokens (300)
  temperature?: number;               // Creativity level (0.7)
}
```

## 🎨 Styling

The component comes with beautiful default styles, but you can customize them:

```css
/* Override default styles */
.ai-image-caption {
  --primary-color: #your-color;
  --border-radius: 12px;
  --spacing: 16px;
}

/* Custom upload area */
.upload-area {
  border: 2px dashed #your-color;
  background: #your-background;
}

/* Custom button styles */
.generate-btn {
  background: linear-gradient(135deg, #your-gradient);
}
```

## 📊 Advanced Usage

### Batch Processing

```vue
<script setup>
import { useImageCaption } from '@aivue/image-caption';

const { generateBatchCaptions } = useImageCaption();

const processBatch = async (imageFiles) => {
  const result = await generateBatchCaptions({
    images: imageFiles,
    options: {
      model: 'gpt-4o',
      prompt: 'Describe this image in detail for accessibility purposes.',
      detail: 'high'
    }
  });

  console.log(`Processed ${result.successCount} images`);
  console.log('Results:', result.results);
};
</script>
```

### Custom Image Processing

```vue
<script setup>
import { useImageCaption, resizeImageFile } from '@aivue/image-caption';

const { generateCaption } = useImageCaption();

const processLargeImage = async (file) => {
  // Resize large images for faster processing
  const resizedFile = await resizeImageFile(file, {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.8
  });
  
  const result = await generateCaption(resizedFile);
  return result;
};
</script>
```

### Export History

```vue
<script setup>
import { useImageCaption } from '@aivue/image-caption';

const { exportHistory, history } = useImageCaption();

const downloadHistory = () => {
  const jsonData = exportHistory('json');
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'image-captions.json';
  a.click();
  
  URL.revokeObjectURL(url);
};
</script>
```

## 🔑 Getting Your API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up for an account
3. Go to [API Keys](https://platform.openai.com/api-keys)
4. Create a new secret key
5. Copy your key (starts with "sk-") and use it as your API key

**Pricing:**
- **GPT-4o**: $5.00 / 1M input tokens, $15.00 / 1M output tokens
- **GPT-4o Mini**: $0.15 / 1M input tokens, $0.60 / 1M output tokens
- **GPT-4 Turbo**: $10.00 / 1M input tokens, $30.00 / 1M output tokens

## 🌟 Examples

### Accessibility Enhancement

```vue
<template>
  <div>
    <img :src="imageUrl" :alt="altText" />
    <AiImageCaption 
      :api-key="apiKey"
      @caption-generated="updateAltText"
    />
  </div>
</template>

<script setup>
const altText = ref('');

const updateAltText = (result) => {
  altText.value = result.caption;
};
</script>
```

### Social Media Integration

```vue
<template>
  <div class="social-post">
    <AiImageCaption 
      :api-key="apiKey"
      :auto-caption="true"
      @caption-generated="suggestHashtags"
    />
    <textarea v-model="postText" placeholder="Write your post..."></textarea>
  </div>
</template>

<script setup>
const postText = ref('');

const suggestHashtags = (result) => {
  const hashtags = generateHashtags(result.caption);
  postText.value += `\n\n${hashtags}`;
};
</script>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🔗 Links

- [Documentation](https://github.com/reachbrt/vueai/tree/main/packages/image-caption)
- [Live Demo](https://aivue.netlify.app)
- [GitHub Repository](https://github.com/reachbrt/vueai)
- [npm Package](https://www.npmjs.com/package/@aivue/image-caption)
- [Hugging Face Models](https://huggingface.co/models?pipeline_tag=image-to-text)

---

Made with ❤️ by [reachbrt](https://github.com/reachbrt)
