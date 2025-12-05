<template>
  <div :class="['voice-actions', `theme-${theme}`, { 'is-listening': isListening, 'is-processing': isProcessing }]">
    <!-- Main Control Button -->
    <div class="voice-control">
      <button
        @click="toggleListening"
        :class="['voice-button', { 'active': isListening, 'processing': isProcessing }]"
        :disabled="!isSupported || isProcessing"
        :title="isListening ? 'Stop listening' : 'Start listening'"
      >
        <span class="voice-icon">
          <svg v-if="!isListening && !isProcessing" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
          <svg v-else-if="isProcessing" class="spinner" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none"/>
          </svg>
          <svg v-else class="pulse" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="8"/>
          </svg>
        </span>
        <span class="voice-label">{{ buttonLabel }}</span>
      </button>

      <!-- Continuous Mode Toggle -->
      <button
        v-if="showContinuousToggle"
        @click="toggleContinuousMode"
        :class="['continuous-toggle', { 'active': continuousMode }]"
        :title="continuousMode ? 'Disable continuous mode' : 'Enable continuous mode'"
      >
        <span>🔄</span>
      </button>
    </div>

    <!-- Transcript Display -->
    <div v-if="showTranscript && (transcript || interimTranscript)" class="transcript-container">
      <div class="transcript-label">{{ transcriptLabel }}</div>
      <div class="transcript-text">
        <span class="final-transcript">{{ transcript }}</span>
        <span v-if="interimTranscript" class="interim-transcript">{{ interimTranscript }}</span>
      </div>
      <div v-if="confidence > 0" class="confidence-bar">
        <div class="confidence-fill" :style="{ width: `${confidence * 100}%` }"></div>
      </div>
    </div>

    <!-- Command Suggestions -->
    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-container">
      <div class="suggestions-label">Try saying:</div>
      <div class="suggestions-list">
        <button
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="executeSuggestion(suggestion)"
          class="suggestion-item"
        >
          <span class="suggestion-icon">{{ suggestion.icon || '💬' }}</span>
          <span class="suggestion-text">{{ suggestion.text }}</span>
        </button>
      </div>
    </div>

    <!-- Command History -->
    <div v-if="showHistory && commandHistory.length > 0" class="history-container">
      <div class="history-header">
        <span class="history-label">Command History</span>
        <button @click="clearHistory" class="clear-history-btn">Clear</button>
      </div>
      <div class="history-list">
        <div
          v-for="(item, index) in commandHistory.slice(0, maxHistoryDisplay)"
          :key="index"
          :class="['history-item', `status-${item.status}`]"
        >
          <span class="history-time">{{ formatTime(item.timestamp) }}</span>
          <span class="history-command">{{ item.command }}</span>
          <span class="history-status">{{ item.status }}</span>
        </div>
      </div>
    </div>

    <!-- Feedback Message -->
    <div v-if="feedbackMessage" :class="['feedback-message', `type-${feedbackType}`]">
      <span class="feedback-icon">{{ feedbackIcon }}</span>
      <span class="feedback-text">{{ feedbackMessage }}</span>
    </div>

    <!-- Error Message -->
    <div v-if="!isSupported" class="error-message">
      <span class="error-icon">⚠️</span>
      <span class="error-text">Speech recognition is not supported in your browser.</span>
    </div>

    <!-- Language Selector -->
    <div v-if="showLanguageSelector" class="language-selector">
      <select v-model="selectedLanguage" @change="onLanguageChange" class="language-select">
        <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
          {{ lang.flag }} {{ lang.name }}
        </option>
      </select>
    </div>

    <!-- Wake Word Indicator -->
    <div v-if="wakeWordEnabled && isListeningForWakeWord" class="wake-word-indicator">
      <span class="wake-word-icon">👂</span>
      <span class="wake-word-text">Listening for "{{ wakeWord }}"...</span>
    </div>

    <!-- Volume Indicator -->
    <div v-if="showVolumeIndicator && isListening" class="volume-indicator">
      <div class="volume-bars">
        <div v-for="i in 5" :key="i" :class="['volume-bar', { 'active': volumeLevel >= i * 20 }]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import type { AIClient } from '@aivue/core';

export interface VoiceCommand {
  pattern: string | RegExp;
  action: (matches?: string[]) => void | Promise<void>;
  description?: string;
  icon?: string;
}

export interface VoiceActionsSuggestion {
  text: string;
  command?: string;
  icon?: string;
}

export interface CommandHistoryItem {
  command: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
  result?: any;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

const props = defineProps<{
  aiClient?: AIClient;
  commands?: VoiceCommand[];
  suggestions?: VoiceActionsSuggestion[];
  theme?: 'light' | 'dark';
  language?: string;
  showTranscript?: boolean;
  showSuggestions?: boolean;
  showHistory?: boolean;
  showLanguageSelector?: boolean;
  showContinuousToggle?: boolean;
  showVolumeIndicator?: boolean;
  continuousMode?: boolean;
  wakeWord?: string;
  wakeWordEnabled?: boolean;
  voiceFeedback?: boolean;
  maxHistoryDisplay?: number;
  transcriptLabel?: string;
  useAiProcessing?: boolean;
}>();

const emit = defineEmits<{
  (e: 'command', command: string, result?: any): void;
  (e: 'transcript', transcript: string): void;
  (e: 'error', error: Error): void;
  (e: 'listening-start'): void;
  (e: 'listening-stop'): void;
  (e: 'wake-word-detected'): void;
}>();

// State
const isListening = ref(false);
const isProcessing = ref(false);
const transcript = ref('');
const interimTranscript = ref('');
const confidence = ref(0);
const feedbackMessage = ref('');
const feedbackType = ref<'success' | 'error' | 'info'>('info');
const commandHistory = ref<CommandHistoryItem[]>([]);
const selectedLanguage = ref(props.language || 'en-US');
const continuousModeActive = ref(props.continuousMode || false);
const isListeningForWakeWord = ref(false);
const volumeLevel = ref(0);
const isSupported = ref(false);

// Speech Recognition
let recognition: any = null;
let speechSynthesis: SpeechSynthesis | null = null;
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let microphone: MediaStreamAudioSourceNode | null = null;

// Available languages
const availableLanguages: Language[] = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' }
];

// Computed
const buttonLabel = computed(() => {
  if (isProcessing.value) return 'Processing...';
  if (isListening.value) return 'Listening...';
  return 'Start Voice Command';
});

const feedbackIcon = computed(() => {
  if (feedbackType.value === 'success') return '✅';
  if (feedbackType.value === 'error') return '❌';
  return 'ℹ️';
});

// Initialize
onMounted(() => {
  initializeSpeechRecognition();
  initializeSpeechSynthesis();

  if (props.wakeWordEnabled) {
    startWakeWordDetection();
  }
});

onBeforeUnmount(() => {
  cleanup();
});

// Watch for continuous mode changes
watch(() => props.continuousMode, (newValue) => {
  continuousModeActive.value = newValue || false;
});

function initializeSpeechRecognition() {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    isSupported.value = false;
    return;
  }

  isSupported.value = true;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = selectedLanguage.value;

  recognition.onstart = () => {
    isListening.value = true;
    emit('listening-start');
    if (props.showVolumeIndicator) {
      startVolumeMonitoring();
    }
  };

  recognition.onresult = (event: any) => {
    let interimText = '';
    let finalText = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalText += result[0].transcript;
        confidence.value = result[0].confidence;
      } else {
        interimText += result[0].transcript;
      }
    }

    if (finalText) {
      transcript.value = finalText;
      interimTranscript.value = '';
      emit('transcript', finalText);
      processCommand(finalText);
    } else {
      interimTranscript.value = interimText;
    }
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    const error = new Error(`Speech recognition error: ${event.error}`);
    emit('error', error);
    showFeedback(`Error: ${event.error}`, 'error');

    if (event.error === 'no-speech' && continuousModeActive.value) {
      // Restart in continuous mode
      setTimeout(() => {
        if (continuousModeActive.value) {
          startListening();
        }
      }, 1000);
    }
  };

  recognition.onend = () => {
    isListening.value = false;
    emit('listening-stop');
    stopVolumeMonitoring();

    if (continuousModeActive.value && !isProcessing.value) {
      // Restart in continuous mode
      setTimeout(() => {
        if (continuousModeActive.value) {
          startListening();
        }
      }, 500);
    }
  };
}

function initializeSpeechSynthesis() {
  if ('speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;
  }
}

function toggleListening() {
  if (isListening.value) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  if (!recognition || !isSupported.value) return;

  try {
    transcript.value = '';
    interimTranscript.value = '';
    confidence.value = 0;
    recognition.start();
  } catch (error) {
    console.error('Error starting recognition:', error);
  }
}

function stopListening() {
  if (!recognition) return;

  try {
    recognition.stop();
    isListening.value = false;
  } catch (error) {
    console.error('Error stopping recognition:', error);
  }
}

async function processCommand(command: string) {
  isProcessing.value = true;

  try {
    // Check for wake word if enabled
    if (props.wakeWordEnabled && props.wakeWord) {
      const wakeWordRegex = new RegExp(props.wakeWord, 'i');
      if (!wakeWordRegex.test(command)) {
        isProcessing.value = false;
        return;
      }
      emit('wake-word-detected');
      // Remove wake word from command
      command = command.replace(wakeWordRegex, '').trim();
    }

    // Try to match registered commands
    let commandMatched = false;

    if (props.commands && props.commands.length > 0) {
      for (const cmd of props.commands) {
        let matches: string[] | null = null;

        if (cmd.pattern instanceof RegExp) {
          const result = command.match(cmd.pattern);
          if (result) {
            matches = Array.from(result);
            commandMatched = true;
          }
        } else {
          const pattern = new RegExp(cmd.pattern, 'i');
          const result = command.match(pattern);
          if (result) {
            matches = Array.from(result);
            commandMatched = true;
          }
        }

        if (matches) {
          await cmd.action(matches);
          addToHistory(command, 'success');
          showFeedback('Command executed successfully', 'success');
          emit('command', command, matches);

          if (props.voiceFeedback) {
            speak('Command executed');
          }
          break;
        }
      }
    }

    // If no command matched and AI processing is enabled
    if (!commandMatched && props.useAiProcessing && props.aiClient) {
      const result = await processWithAI(command);
      addToHistory(command, 'success', result);
      showFeedback('AI processed command', 'success');
      emit('command', command, result);

      if (props.voiceFeedback && result) {
        speak(result);
      }
    } else if (!commandMatched) {
      addToHistory(command, 'error');
      showFeedback('Command not recognized', 'error');

      if (props.voiceFeedback) {
        speak('Command not recognized');
      }
    }
  } catch (error) {
    console.error('Error processing command:', error);
    addToHistory(command, 'error');
    showFeedback('Error processing command', 'error');
    emit('error', error as Error);
  } finally {
    isProcessing.value = false;
  }
}

async function processWithAI(command: string): Promise<string> {
  if (!props.aiClient) return '';

  try {
    const response = await props.aiClient.chat([
      {
        role: 'system',
        content: 'You are a voice command assistant. Process the user\'s voice command and provide a brief, actionable response.'
      },
      {
        role: 'user',
        content: command
      }
    ]);

    return typeof response === 'string' ? response : response.content || '';
  } catch (error) {
    console.error('AI processing error:', error);
    return '';
  }
}

function speak(text: string) {
  if (!speechSynthesis || !props.voiceFeedback) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = selectedLanguage.value;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  speechSynthesis.speak(utterance);
}

function showFeedback(message: string, type: 'success' | 'error' | 'info' = 'info') {
  feedbackMessage.value = message;
  feedbackType.value = type;

  setTimeout(() => {
    feedbackMessage.value = '';
  }, 3000);
}

function addToHistory(command: string, status: 'success' | 'error' | 'pending', result?: any) {
  commandHistory.value.unshift({
    command,
    timestamp: new Date(),
    status,
    result
  });

  // Keep only last 50 items
  if (commandHistory.value.length > 50) {
    commandHistory.value = commandHistory.value.slice(0, 50);
  }
}

function clearHistory() {
  commandHistory.value = [];
  showFeedback('History cleared', 'info');
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function toggleContinuousMode() {
  continuousModeActive.value = !continuousModeActive.value;

  if (continuousModeActive.value && !isListening.value) {
    startListening();
  } else if (!continuousModeActive.value && isListening.value) {
    stopListening();
  }
}

function onLanguageChange() {
  if (recognition) {
    recognition.lang = selectedLanguage.value;
  }

  if (isListening.value) {
    stopListening();
    setTimeout(() => startListening(), 500);
  }
}

function executeSuggestion(suggestion: VoiceActionsSuggestion) {
  const command = suggestion.command || suggestion.text;
  transcript.value = command;
  processCommand(command);
}

function startWakeWordDetection() {
  isListeningForWakeWord.value = true;
  if (!isListening.value) {
    startListening();
  }
}

async function startVolumeMonitoring() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);

    microphone.connect(analyser);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVolume = () => {
      if (!isListening.value) return;

      analyser!.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      volumeLevel.value = Math.min(100, (average / 255) * 100);

      requestAnimationFrame(updateVolume);
    };

    updateVolume();
  } catch (error) {
    console.error('Error starting volume monitoring:', error);
  }
}

function stopVolumeMonitoring() {
  if (microphone) {
    microphone.disconnect();
    microphone = null;
  }
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  volumeLevel.value = 0;
}

function cleanup() {
  stopListening();
  stopVolumeMonitoring();

  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
}
</script>

<style scoped>
.voice-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.voice-actions.theme-dark {
  background: #1a1a1a;
  color: #ffffff;
}

/* Voice Control */
.voice-control {
  display: flex;
  gap: 12px;
  align-items: center;
}

.voice-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.voice-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.voice-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.voice-button.active {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation: pulse-glow 2s ease-in-out infinite;
}

.voice-button.processing {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.voice-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-icon svg {
  width: 100%;
  height: 100%;
}

.spinner {
  animation: spin 1s linear infinite;
}

.pulse {
  animation: pulse-scale 1.5s ease-in-out infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-scale {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3); }
  50% { box-shadow: 0 4px 20px rgba(240, 147, 251, 0.6); }
}

.continuous-toggle {
  padding: 12px 16px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continuous-toggle:hover {
  background: #e5e7eb;
}

.continuous-toggle.active {
  background: #dbeafe;
  border-color: #3b82f6;
}

.theme-dark .continuous-toggle {
  background: #374151;
  border-color: #4b5563;
}

.theme-dark .continuous-toggle:hover {
  background: #4b5563;
}

.theme-dark .continuous-toggle.active {
  background: #1e3a8a;
  border-color: #3b82f6;
}

/* Transcript */
.transcript-container {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.theme-dark .transcript-container {
  background: #111827;
  border-color: #374151;
}

.transcript-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.transcript-text {
  font-size: 16px;
  line-height: 1.6;
  color: #1f2937;
}

.theme-dark .transcript-text {
  color: #f3f4f6;
}

.final-transcript {
  font-weight: 500;
}

.interim-transcript {
  color: #9ca3af;
  font-style: italic;
}

.confidence-bar {
  margin-top: 12px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  transition: width 0.3s ease;
}

/* Suggestions */
.suggestions-container {
  padding: 16px;
  background: #eff6ff;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
}

.theme-dark .suggestions-container {
  background: #1e3a8a;
  border-color: #3b82f6;
}

.suggestions-label {
  font-size: 12px;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.theme-dark .suggestions-label {
  color: #93c5fd;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background: #dbeafe;
  transform: translateY(-1px);
}

.theme-dark .suggestion-item {
  background: #1e40af;
  border-color: #3b82f6;
  color: white;
}

.theme-dark .suggestion-item:hover {
  background: #1d4ed8;
}

/* History */
.history-container {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.theme-dark .history-container {
  background: #111827;
  border-color: #374151;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.clear-history-btn {
  padding: 4px 8px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-history-btn:hover {
  background: #f3f4f6;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  gap: 12px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  border-left: 3px solid #e5e7eb;
}

.theme-dark .history-item {
  background: #1f2937;
}

.history-item.status-success {
  border-left-color: #10b981;
}

.history-item.status-error {
  border-left-color: #ef4444;
}

.history-item.status-pending {
  border-left-color: #f59e0b;
}

.history-time {
  color: #9ca3af;
  font-size: 12px;
  min-width: 60px;
}

.history-command {
  flex: 1;
  color: #1f2937;
}

.theme-dark .history-command {
  color: #f3f4f6;
}

.history-status {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.history-item.status-success .history-status {
  color: #10b981;
}

.history-item.status-error .history-status {
  color: #ef4444;
}

.history-item.status-pending .history-status {
  color: #f59e0b;
}

/* Feedback */
.feedback-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feedback-message.type-success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.feedback-message.type-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.feedback-message.type-info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

/* Error */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  font-size: 14px;
}

/* Language Selector */
.language-selector {
  display: flex;
  justify-content: flex-end;
}

.language-select {
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-select:hover {
  border-color: #3b82f6;
}

.theme-dark .language-select {
  background: #374151;
  border-color: #4b5563;
  color: white;
}

/* Wake Word */
.wake-word-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  font-size: 14px;
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Volume Indicator */
.volume-indicator {
  display: flex;
  justify-content: center;
  padding: 8px;
}

.volume-bars {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 30px;
}

.volume-bar {
  width: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  transition: all 0.1s ease;
}

.volume-bar:nth-child(1) { height: 20%; }
.volume-bar:nth-child(2) { height: 40%; }
.volume-bar:nth-child(3) { height: 60%; }
.volume-bar:nth-child(4) { height: 80%; }
.volume-bar:nth-child(5) { height: 100%; }

.volume-bar.active {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .voice-actions {
    padding: 16px;
  }

  .voice-button {
    padding: 14px 20px;
    font-size: 14px;
  }

  .suggestions-list {
    flex-direction: column;
  }

  .suggestion-item {
    width: 100%;
  }
}
</style>

