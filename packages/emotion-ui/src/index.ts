/**
 * @aivue/emotion-ui
 * Emotion-aware UI components for Vue 3
 */

// Components
export { default as EmotionAwareInput } from './components/EmotionAwareInput.vue';
export { default as EmotionAwareButton } from './components/EmotionAwareButton.vue';
export { default as EmotionAwareNotification } from './components/EmotionAwareNotification.vue';

// Composables
export { useEmotionStore } from './composables/useEmotionStore';
export type { EmotionState, EmotionEvent } from './composables/useEmotionStore';

// Utilities
export { analyzeSentiment, analyzeSentimentWithAI } from './utils/sentimentAnalysis';
export type { SentimentResult } from './utils/sentimentAnalysis';

export { analyzeVoiceTone, VoiceMonitor } from './utils/voiceAnalysis';
export type { VoiceAnalysisResult } from './utils/voiceAnalysis';

export { TypingAnalyzer, ClickAnalyzer } from './utils/interactionAnalysis';
export type { TypingPattern, ClickPattern } from './utils/interactionAnalysis';

export { FacialAnalyzer, isFacialDetectionSupported, requestCameraPermission } from './utils/facialAnalysis';
export type { FacialExpression } from './utils/facialAnalysis';

// Plugin
import type { App } from 'vue';
import EmotionAwareInput from './components/EmotionAwareInput.vue';
import EmotionAwareButton from './components/EmotionAwareButton.vue';
import EmotionAwareNotification from './components/EmotionAwareNotification.vue';

export default {
  install(app: App) {
    app.component('EmotionAwareInput', EmotionAwareInput);
    app.component('EmotionAwareButton', EmotionAwareButton);
    app.component('EmotionAwareNotification', EmotionAwareNotification);
  }
};

