// Optional voice integration utilities for enhanced chatbot features
// These are only used if voice options are provided in ChatOptions

export interface VoiceConfig {
  speechToText?: boolean;
  textToSpeech?: boolean;
  language?: string;
  voiceId?: string;
  apiKey?: string;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface VoiceProvider {
  // Speech to Text
  startListening(onResult: (result: SpeechRecognitionResult) => void, onError?: (error: Error) => void): Promise<void>;
  stopListening(): void;
  isListening(): boolean;

  // Text to Speech
  speak(text: string, options?: SpeechOptions): Promise<void>;
  stopSpeaking(): void;
  isSpeaking(): boolean;

  // Voice management
  getAvailableVoices(): Promise<SpeechSynthesisVoice[]>;
  setVoice(voiceId: string): void;
}

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
}

// Browser-based voice provider using Web Speech API
export class BrowserVoiceProvider implements VoiceProvider {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private config: VoiceConfig;

  constructor(config: VoiceConfig = {}) {
    this.config = config;
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.config.language || 'en-US';
      }
    }
  }

  async startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported in this browser');
    }

    return new Promise((resolve, reject) => {
      this.recognition.onstart = () => {
        console.log('Speech recognition started');
        resolve();
      };

      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence;
          const isFinal = result.isFinal;

          onResult({
            transcript,
            confidence,
            isFinal
          });
        }
      };

      this.recognition.onerror = (event: any) => {
        const error = new Error(`Speech recognition error: ${event.error}`);
        if (onError) {
          onError(error);
        } else {
          reject(error);
        }
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
      };

      try {
        this.recognition.start();
      } catch (error) {
        reject(error);
      }
    });
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  isListening(): boolean {
    return this.recognition && this.recognition.started;
  }

  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    if (!this.synthesis) {
      throw new Error('Speech synthesis not supported in this browser');
    }

    return new Promise((resolve, reject) => {
      // Stop any current speech
      this.stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice options
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      // Set voice if available
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      } else if (options.voice) {
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.name === options.voice || v.voiceURI === options.voice);
        if (voice) {
          utterance.voice = voice;
        }
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  async getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
    if (!this.synthesis) {
      return [];
    }

    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices();
      
      if (voices.length > 0) {
        resolve(voices);
      } else {
        // Some browsers load voices asynchronously
        this.synthesis.onvoiceschanged = () => {
          voices = this.synthesis.getVoices();
          resolve(voices);
        };
      }
    });
  }

  setVoice(voiceId: string): void {
    this.synthesis.getVoices().forEach(voice => {
      if (voice.name === voiceId || voice.voiceURI === voiceId) {
        this.selectedVoice = voice;
      }
    });
  }
}

// OpenAI Whisper provider for more accurate speech recognition
export class OpenAIVoiceProvider implements VoiceProvider {
  private apiKey: string;
  private isRecording = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(config: VoiceConfig) {
    if (!config.apiKey) {
      throw new Error('OpenAI API key is required for OpenAIVoiceProvider');
    }
    this.apiKey = config.apiKey;
    this.synthesis = window.speechSynthesis;
  }

  async startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        try {
          const transcript = await this.transcribeAudio(audioBlob);
          onResult({
            transcript,
            confidence: 1.0, // OpenAI doesn't provide confidence scores
            isFinal: true
          });
        } catch (error) {
          if (onError) {
            onError(error as Error);
          }
        }
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
      throw error;
    }
  }

  private async transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`OpenAI Whisper API error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || '';
  }

  stopListening(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  isListening(): boolean {
    return this.isRecording;
  }

  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    // Use browser TTS for now, could integrate OpenAI TTS in the future
    const browserProvider = new BrowserVoiceProvider();
    return browserProvider.speak(text, options);
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  async getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
    const browserProvider = new BrowserVoiceProvider();
    return browserProvider.getAvailableVoices();
  }

  setVoice(voiceId: string): void {
    // Implementation for voice selection
  }
}

// Factory function to create voice provider
export function createVoiceProvider(config: VoiceConfig): VoiceProvider {
  if (config.apiKey) {
    // Use OpenAI provider if API key is provided
    return new OpenAIVoiceProvider(config);
  } else {
    // Use browser provider as fallback
    return new BrowserVoiceProvider(config);
  }
}

// Voice utilities
export const voiceUtils = {
  // Check if speech recognition is supported
  isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && 
           ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  },

  // Check if speech synthesis is supported
  isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  },

  // Get user's preferred language
  getUserLanguage(): string {
    if (typeof navigator !== 'undefined') {
      return navigator.language || 'en-US';
    }
    return 'en-US';
  },

  // Format speech for better TTS
  formatTextForSpeech(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`(.*?)`/g, '$1') // Remove code markdown
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\n+/g, '. ') // Replace newlines with periods
      .trim();
  }
};
