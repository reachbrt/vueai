// Components
export { default as VoiceActions } from './components/VoiceActions.vue';

// Composables
export { useVoiceActions } from './composables/useVoiceActions';
export type {
  VoiceCommand,
  UseVoiceActionsOptions,
  VoiceActionsState
} from './composables/useVoiceActions';

// Utilities
export {
  parseCommand,
  matchCommand,
  calculateSimilarity,
  findBestMatch
} from './utils/commandParser';
export type { ParsedCommand } from './utils/commandParser';

export {
  speak,
  getVoices,
  getVoicesForLanguage,
  cancel,
  pause,
  resume,
  isSpeaking,
  isPaused,
  speakSSML,
  SpeechQueue
} from './utils/speechSynthesis';
export type { SpeechOptions } from './utils/speechSynthesis';

// Types
export type {
  VoiceActionsSuggestion,
  CommandHistoryItem,
  Language
} from './components/VoiceActions.vue';

