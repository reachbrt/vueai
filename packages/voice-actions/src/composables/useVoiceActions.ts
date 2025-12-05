import { ref, computed } from 'vue';
import type { AIClient } from '@aivue/core';

export interface VoiceCommand {
  pattern: string | RegExp;
  action: (matches?: string[]) => void | Promise<void>;
  description?: string;
  icon?: string;
}

export interface UseVoiceActionsOptions {
  aiClient?: AIClient;
  commands?: VoiceCommand[];
  language?: string;
  continuousMode?: boolean;
  voiceFeedback?: boolean;
}

export interface VoiceActionsState {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  error: Error | null;
}

export function useVoiceActions(options: UseVoiceActionsOptions = {}) {
  const isListening = ref(false);
  const isProcessing = ref(false);
  const transcript = ref('');
  const confidence = ref(0);
  const error = ref<Error | null>(null);
  const isSupported = ref(false);

  let recognition: any = null;
  let speechSynthesis: SpeechSynthesis | null = null;

  const state = computed<VoiceActionsState>(() => ({
    isListening: isListening.value,
    isProcessing: isProcessing.value,
    transcript: transcript.value,
    confidence: confidence.value,
    error: error.value
  }));

  function initialize() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      isSupported.value = false;
      error.value = new Error('Speech recognition is not supported in this browser');
      return false;
    }

    isSupported.value = true;
    recognition = new SpeechRecognition();
    recognition.continuous = options.continuousMode || false;
    recognition.interimResults = true;
    recognition.lang = options.language || 'en-US';

    recognition.onresult = (event: any) => {
      let finalText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
          confidence.value = result[0].confidence;
        }
      }

      if (finalText) {
        transcript.value = finalText;
        processCommand(finalText);
      }
    };

    recognition.onerror = (event: any) => {
      error.value = new Error(`Speech recognition error: ${event.error}`);
      isListening.value = false;
    };

    recognition.onend = () => {
      isListening.value = false;
    };

    if ('speechSynthesis' in window) {
      speechSynthesis = window.speechSynthesis;
    }

    return true;
  }

  function start() {
    if (!recognition || !isSupported.value) {
      error.value = new Error('Speech recognition not initialized');
      return;
    }

    try {
      transcript.value = '';
      confidence.value = 0;
      error.value = null;
      recognition.start();
      isListening.value = true;
    } catch (err) {
      error.value = err as Error;
    }
  }

  function stop() {
    if (!recognition) return;

    try {
      recognition.stop();
      isListening.value = false;
    } catch (err) {
      error.value = err as Error;
    }
  }

  async function processCommand(command: string) {
    isProcessing.value = true;

    try {
      if (options.commands && options.commands.length > 0) {
        for (const cmd of options.commands) {
          let matches: string[] | null = null;
          
          if (cmd.pattern instanceof RegExp) {
            const result = command.match(cmd.pattern);
            if (result) {
              matches = Array.from(result);
            }
          } else {
            const pattern = new RegExp(cmd.pattern, 'i');
            const result = command.match(pattern);
            if (result) {
              matches = Array.from(result);
            }
          }
          
          if (matches) {
            await cmd.action(matches);
            
            if (options.voiceFeedback) {
              speak('Command executed');
            }
            break;
          }
        }
      }
    } catch (err) {
      error.value = err as Error;
    } finally {
      isProcessing.value = false;
    }
  }

  function speak(text: string) {
    if (!speechSynthesis || !options.voiceFeedback) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language || 'en-US';
    speechSynthesis.speak(utterance);
  }

  function cleanup() {
    stop();
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  }

  return {
    state,
    isListening,
    isProcessing,
    transcript,
    confidence,
    error,
    isSupported,
    initialize,
    start,
    stop,
    speak,
    cleanup
  };
}

