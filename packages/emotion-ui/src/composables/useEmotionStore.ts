import { ref } from 'vue';
import type { SentimentResult } from '../utils/sentimentAnalysis';
import type { VoiceAnalysisResult } from '../utils/voiceAnalysis';
import type { TypingPattern, ClickPattern } from '../utils/interactionAnalysis';
import type { FacialExpression } from '../utils/facialAnalysis';

/**
 * Emotion state interface
 */
export interface EmotionState {
  primary: 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited' | 'confused';
  confidence: number;
  intensity: number;
  sources: {
    text?: SentimentResult;
    voice?: VoiceAnalysisResult;
    typing?: TypingPattern;
    clicks?: ClickPattern;
    facial?: FacialExpression;
  };
  timestamp: number;
}

/**
 * Emotion event interface
 */
export interface EmotionEvent {
  type: 'frustration' | 'excitement' | 'confusion' | 'satisfaction';
  trigger: string;
  emotion: EmotionState;
  timestamp: number;
}

// Global emotion store
const currentEmotion = ref<EmotionState>({
  primary: 'neutral',
  confidence: 1,
  intensity: 0,
  sources: {},
  timestamp: Date.now()
});

const emotionHistory = ref<EmotionState[]>([]);
const emotionEvents = ref<EmotionEvent[]>([]);
const interventionCallbacks = ref<Array<(event: EmotionEvent) => void>>([]);

/**
 * Emotion store composable
 */
export function useEmotionStore() {
  /**
   * Update emotion from text sentiment
   */
  const updateFromText = (sentiment: SentimentResult) => {
    updateEmotion({
      primary: sentiment.emotion,
      confidence: sentiment.confidence,
      intensity: sentiment.intensity,
      sources: {
        ...currentEmotion.value.sources,
        text: sentiment
      },
      timestamp: Date.now()
    });
  };

  /**
   * Update emotion from voice analysis
   */
  const updateFromVoice = (voice: VoiceAnalysisResult) => {
    const emotionMap: Record<string, EmotionState['primary']> = {
      calm: 'neutral',
      excited: 'excited',
      stressed: 'frustrated',
      neutral: 'neutral'
    };

    updateEmotion({
      primary: emotionMap[voice.emotion] || 'neutral',
      confidence: voice.confidence,
      intensity: voice.energy,
      sources: {
        ...currentEmotion.value.sources,
        voice
      },
      timestamp: Date.now()
    });
  };

  /**
   * Update emotion from typing pattern
   */
  const updateFromTyping = (typing: TypingPattern) => {
    const emotionMap: Record<string, EmotionState['primary']> = {
      focused: 'neutral',
      frustrated: 'frustrated',
      hesitant: 'confused',
      confident: 'positive'
    };

    updateEmotion({
      primary: emotionMap[typing.emotion] || 'neutral',
      confidence: 0.6,
      intensity: typing.corrections / 10,
      sources: {
        ...currentEmotion.value.sources,
        typing
      },
      timestamp: Date.now()
    });
  };

  /**
   * Update emotion from click pattern
   */
  const updateFromClicks = (clicks: ClickPattern) => {
    const emotionMap: Record<string, EmotionState['primary']> = {
      frustrated: 'frustrated',
      uncertain: 'confused',
      confident: 'positive'
    };

    updateEmotion({
      primary: emotionMap[clicks.emotion] || 'neutral',
      confidence: 0.7,
      intensity: clicks.rageClicks / 5,
      sources: {
        ...currentEmotion.value.sources,
        clicks
      },
      timestamp: Date.now()
    });
  };

  /**
   * Update emotion from facial expression
   */
  const updateFromFacial = (facial: FacialExpression) => {
    const emotionMap: Record<string, EmotionState['primary']> = {
      happy: 'positive',
      sad: 'negative',
      angry: 'frustrated',
      surprised: 'excited',
      neutral: 'neutral',
      confused: 'confused'
    };

    updateEmotion({
      primary: emotionMap[facial.emotion] || 'neutral',
      confidence: facial.confidence,
      intensity: facial.features.smiling || facial.features.eyebrowsRaised,
      sources: {
        ...currentEmotion.value.sources,
        facial
      },
      timestamp: Date.now()
    });
  };

  /**
   * Update emotion state
   */
  const updateEmotion = (newEmotion: EmotionState) => {
    // Add to history
    emotionHistory.value.push({ ...currentEmotion.value });
    
    // Keep only last 100 entries
    if (emotionHistory.value.length > 100) {
      emotionHistory.value.shift();
    }

    // Update current emotion
    currentEmotion.value = newEmotion;

    // Check for emotion events
    checkForEvents(newEmotion);
  };

  /**
   * Check for significant emotion events
   */
  const checkForEvents = (emotion: EmotionState) => {
    // Detect frustration
    if (emotion.primary === 'frustrated' && emotion.intensity > 0.6) {
      triggerEvent({
        type: 'frustration',
        trigger: 'High frustration detected',
        emotion,
        timestamp: Date.now()
      });
    }

    // Detect excitement
    if (emotion.primary === 'excited' && emotion.intensity > 0.7) {
      triggerEvent({
        type: 'excitement',
        trigger: 'User excitement detected',
        emotion,
        timestamp: Date.now()
      });
    }

    // Detect confusion
    if (emotion.primary === 'confused' && emotion.confidence > 0.6) {
      triggerEvent({
        type: 'confusion',
        trigger: 'User confusion detected',
        emotion,
        timestamp: Date.now()
      });
    }
  };

  /**
   * Trigger emotion event
   */
  const triggerEvent = (event: EmotionEvent) => {
    emotionEvents.value.push(event);

    // Keep only last 50 events
    if (emotionEvents.value.length > 50) {
      emotionEvents.value.shift();
    }

    // Call intervention callbacks
    interventionCallbacks.value.forEach(callback => callback(event));
  };

  /**
   * Register intervention callback
   */
  const onEmotionEvent = (callback: (event: EmotionEvent) => void) => {
    interventionCallbacks.value.push(callback);

    // Return unsubscribe function
    return () => {
      const index = interventionCallbacks.value.indexOf(callback);
      if (index > -1) {
        interventionCallbacks.value.splice(index, 1);
      }
    };
  };

  /**
   * Get emotion history for a time range
   */
  const getEmotionHistory = (minutes = 5) => {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return emotionHistory.value.filter(e => e.timestamp > cutoff);
  };

  /**
   * Get dominant emotion over time period
   */
  const getDominantEmotion = (minutes = 5) => {
    const history = getEmotionHistory(minutes);
    if (history.length === 0) return 'neutral';

    const counts: Record<string, number> = {};
    history.forEach(e => {
      counts[e.primary] = (counts[e.primary] || 0) + 1;
    });

    let maxCount = 0;
    let dominant = 'neutral';
    Object.entries(counts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominant = emotion;
      }
    });

    return dominant as EmotionState['primary'];
  };

  /**
   * Clear emotion history
   */
  const clearHistory = () => {
    emotionHistory.value = [];
    emotionEvents.value = [];
  };

  /**
   * Reset to neutral
   */
  const reset = () => {
    currentEmotion.value = {
      primary: 'neutral',
      confidence: 1,
      intensity: 0,
      sources: {},
      timestamp: Date.now()
    };
  };

  return {
    // State - return refs directly for proper reactivity
    currentEmotion,
    emotionHistory,
    emotionEvents,

    // Methods
    updateFromText,
    updateFromVoice,
    updateFromTyping,
    updateFromClicks,
    updateFromFacial,
    updateEmotion,
    onEmotionEvent,
    getEmotionHistory,
    getDominantEmotion,
    clearHistory,
    reset
  };
}

