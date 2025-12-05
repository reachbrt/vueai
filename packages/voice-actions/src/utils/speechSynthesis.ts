/**
 * Speech Synthesis Utility
 * Provides utilities for text-to-speech functionality
 */

export interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

/**
 * Speak text using speech synthesis
 */
export function speak(text: string, options: SpeechOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;
    
    if (options.voice) {
      utterance.voice = options.voice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Get available voices
 */
export function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
}

/**
 * Get voices for a specific language
 */
export async function getVoicesForLanguage(lang: string): Promise<SpeechSynthesisVoice[]> {
  const voices = await getVoices();
  return voices.filter(voice => voice.lang.startsWith(lang));
}

/**
 * Cancel ongoing speech
 */
export function cancel(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Pause ongoing speech
 */
export function pause(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

/**
 * Resume paused speech
 */
export function resume(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

/**
 * Check if speech synthesis is speaking
 */
export function isSpeaking(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

/**
 * Check if speech synthesis is paused
 */
export function isPaused(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.paused;
  }
  return false;
}

/**
 * Speak with SSML (Speech Synthesis Markup Language) support
 * Note: SSML support varies by browser and voice
 */
export function speakSSML(ssml: string, options: SpeechOptions = {}): Promise<void> {
  // Remove SSML tags for browsers that don't support it
  const text = ssml.replace(/<[^>]*>/g, '');
  return speak(text, options);
}

/**
 * Create a speech queue for multiple utterances
 */
export class SpeechQueue {
  private queue: Array<{ text: string; options: SpeechOptions }> = [];
  private isSpeaking = false;

  add(text: string, options: SpeechOptions = {}): void {
    this.queue.push({ text, options });
    if (!this.isSpeaking) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isSpeaking = false;
      return;
    }

    this.isSpeaking = true;
    const item = this.queue.shift();
    
    if (item) {
      try {
        await speak(item.text, item.options);
      } catch (error) {
        console.error('Speech error:', error);
      }
      this.processQueue();
    }
  }

  clear(): void {
    this.queue = [];
    cancel();
    this.isSpeaking = false;
  }
}

