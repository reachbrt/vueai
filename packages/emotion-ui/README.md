# @aivue/emotion-ui

[![npm version](https://img.shields.io/npm/v/@aivue/emotion-ui.svg)](https://www.npmjs.com/package/@aivue/emotion-ui)
[![npm downloads](https://img.shields.io/badge/downloads-274%2Fmonth-CB3837?style=flat-square&logo=npm)](https://www.npmjs.com/package/@aivue/emotion-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Netlify Status](https://api.netlify.com/api/v1/badges/9f08866c-e889-408a-959e-32d8e3f3ab49/deploy-status)](https://aivue.netlify.app/)

> Emotion-aware UI components for Vue 3 that adapt based on user sentiment detected from text, voice, and interaction patterns

## ✨ Features

### 🎭 Multi-Modal Emotion Detection
- **Text Sentiment Analysis** - Detect positive, negative, neutral, frustrated, excited, or confused emotions from text input
- **Voice Tone Analysis** - Analyze pitch, speed, and energy from voice input
- **Typing Pattern Analysis** - Track typing speed, corrections, and pauses to detect frustration
- **Click/Interaction Patterns** - Identify rage clicks, hesitation, and user confidence
- **Facial Expression Detection** - Optional webcam-based emotion detection (with user permission)

### 🎨 Adaptive UI Components
- **EmotionAwareInput** - Input fields that change validation messages and styling based on user mood
- **EmotionAwareButton** - Buttons that adjust appearance and text based on emotional context
- **EmotionAwareNotification** - Notifications with empathetic messages adapted to user state
- **Smart Validation** - Context-aware error messages that are gentler when users are frustrated
- **Dynamic Placeholders** - Encouraging placeholders that adapt to emotional state

### 🧠 Real-Time Emotion State Management
- **Global Emotion Store** - Centralized emotion state management via composable
- **Emotion History Tracking** - Track emotional journey over time
- **Emotion Events** - Trigger interventions based on emotional state changes
- **Confidence Scores** - Know how certain the emotion detection is
- **Privacy-First** - All processing happens locally, no data sent to servers

### 🚨 Smart Intervention System
- **Frustration Detection** - Automatically detect when users are struggling
- **Contextual Help** - Offer assistance when confusion is detected
- **Positive Reinforcement** - Celebrate successes and positive moments
- **Adaptive Error Messages** - Gentler, more helpful messages when users are frustrated
- **UI Simplification** - Reduce complexity when stress is detected

### 📊 Analytics & Insights
- **Emotion Journey Visualization** - See how emotions change over time
- **Friction Point Identification** - Identify where users get frustrated
- **Confidence Tracking** - Monitor emotion detection accuracy
- **Privacy-Compliant** - All analytics processed locally

## 📦 Installation

```bash
npm install @aivue/emotion-ui @aivue/core
```

## 🚀 Quick Start

### 1. Import and Use Components

```vue
<template>
  <div>
    <EmotionAwareInput
      v-model="username"
      label="Username"
      placeholder="Enter your username"
      :validation-message="usernameError"
      validation-state="error"
      help-text="Username must be at least 3 characters"
    />

    <EmotionAwareButton
      text="Submit"
      variant="primary"
      encouraging-text="You've got this! Submit"
      calming-text="Take your time, then submit"
      @click="handleSubmit"
    />

    <EmotionAwareNotification
      v-if="showNotification"
      title="Form submitted successfully!"
      type="success"
      @close="showNotification = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  EmotionAwareInput, 
  EmotionAwareButton, 
  EmotionAwareNotification 
} from '@aivue/emotion-ui';
import '@aivue/emotion-ui/style.css';

const username = ref('');
const usernameError = ref('');
const showNotification = ref(false);

const handleSubmit = () => {
  if (username.value.length < 3) {
    usernameError.value = 'Username is too short';
  } else {
    showNotification.value = true;
  }
};
</script>
```

### 2. Use Emotion Store

```vue
<script setup>
import { useEmotionStore } from '@aivue/emotion-ui';

const emotionStore = useEmotionStore();

// Access current emotion
console.log(emotionStore.currentEmotion.value);

// Listen for emotion events
emotionStore.onEmotionEvent((event) => {
  if (event.type === 'frustration') {
    console.log('User is frustrated!', event);
    // Show help dialog, simplify UI, etc.
  }
});

// Get emotion history
const recentEmotions = emotionStore.getEmotionHistory(5); // Last 5 minutes

// Get dominant emotion
const dominant = emotionStore.getDominantEmotion(10); // Last 10 minutes
</script>
```

### 3. Manual Emotion Detection

```javascript
import { 
  analyzeSentiment,
  analyzeVoiceTone,
  TypingAnalyzer,
  ClickAnalyzer
} from '@aivue/emotion-ui';

// Analyze text sentiment
const sentiment = analyzeSentiment('This is frustrating!');
console.log(sentiment); // { emotion: 'frustrated', confidence: 0.8, ... }

// Analyze voice (requires MediaStream)
const voiceResult = await analyzeVoiceTone(audioStream);
console.log(voiceResult); // { pitch: 0.7, speed: 0.6, emotion: 'stressed', ... }

// Track typing patterns
const typingAnalyzer = new TypingAnalyzer();
typingAnalyzer.start();
// ... user types ...
const pattern = typingAnalyzer.getPattern();
console.log(pattern); // { speed: 45, corrections: 5, emotion: 'frustrated', ... }
```

## 📚 Components

### EmotionAwareInput

Input field that adapts to user emotional state.

**Props:**
- `modelValue` - Input value (v-model)
- `label` - Input label
- `type` - Input type (default: 'text')
- `placeholder` - Placeholder text (adapts to emotion)
- `validationMessage` - Validation message (adapts to emotion)
- `validationState` - 'success' | 'error' | 'warning'
- `helpText` - Help text (shown when frustrated/confused)
- `showEmotionIndicator` - Show emotion emoji (default: true)
- `adaptToEmotion` - Enable emotion adaptation (default: true)
- `analyzeTyping` - Analyze typing patterns (default: true)

**Events:**
- `update:modelValue` - Emitted when value changes
- `emotion-detected` - Emitted when emotion is detected from text

**Example:**
```vue
<EmotionAwareInput
  v-model="email"
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  validation-message="Please enter a valid email"
  validation-state="error"
  help-text="We'll never share your email"
  :show-emotion-indicator="true"
/>
```

### EmotionAwareButton

Button that adapts text and styling based on emotional context.

**Props:**
- `text` - Button text (default: 'Submit')
- `variant` - 'primary' | 'secondary' | 'success' | 'danger'
- `disabled` - Disable button
- `loading` - Show loading state
- `showEmotionIcon` - Show emotion icon (default: false)
- `adaptToEmotion` - Enable emotion adaptation (default: true)
- `encouragingText` - Text to show when user is positive
- `calmingText` - Text to show when user is frustrated

**Events:**
- `click` - Emitted when button is clicked

### EmotionAwareNotification

Notification that adapts tone based on user emotion.

**Props:**
- `title` - Notification title
- `message` - Notification message
- `type` - 'info' | 'success' | 'warning' | 'error'
- `duration` - Auto-close duration in ms (default: 5000)
- `adaptToEmotion` - Enable emotion adaptation (default: true)

**Events:**
- `close` - Emitted when notification is closed

## 🎯 Emotion Store API

### Methods

- `updateFromText(sentiment)` - Update emotion from text sentiment
- `updateFromVoice(voice)` - Update emotion from voice analysis
- `updateFromTyping(pattern)` - Update emotion from typing pattern
- `updateFromClicks(pattern)` - Update emotion from click pattern
- `updateFromFacial(expression)` - Update emotion from facial expression
- `onEmotionEvent(callback)` - Register callback for emotion events
- `getEmotionHistory(minutes)` - Get emotion history for time period
- `getDominantEmotion(minutes)` - Get dominant emotion over time
- `clearHistory()` - Clear emotion history
- `reset()` - Reset to neutral state

## 🔒 Privacy

All emotion detection happens **locally in the browser**. No data is sent to external servers.

## 📦 Related Packages

Explore the complete @aivue ecosystem:

### 🧠 [@aivue/core](https://www.npmjs.com/package/@aivue/core)
Core AI functionality for Vue.js components

### 💬 [@aivue/chatbot](https://www.npmjs.com/package/@aivue/chatbot)
AI-powered chat components for Vue.js

### ✨ [@aivue/autosuggest](https://www.npmjs.com/package/@aivue/autosuggest)
AI-powered suggestion components for Vue.js

### 📝 [@aivue/smartform](https://www.npmjs.com/package/@aivue/smartform)
AI-powered form validation for Vue.js

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

## 📄 License

MIT © [reachbrt](https://github.com/reachbrt)

## 🔗 Links

- [Documentation](https://github.com/reachbrt/vueai#readme)
- [Demo](https://aivue.netlify.app/)
- [NPM Package](https://www.npmjs.com/package/@aivue/emotion-ui)
- [GitHub](https://github.com/reachbrt/vueai)
- [Issues](https://github.com/reachbrt/vueai/issues)
