/**
 * Pattern learning engine
 * Learns user's writing patterns and common phrases
 */

import type { UserPattern, Language, TrainingProgress } from '../types';
import { detectLanguage } from './languageDetection';

export class PatternLearner {
  private patterns: Map<string, UserPattern> = new Map();
  private maxPatterns: number;

  constructor(maxPatterns: number = 10000) {
    this.maxPatterns = maxPatterns;
  }

  /**
   * Learn patterns from text
   */
  async learn(text: string, onProgress?: (progress: TrainingProgress) => void): Promise<void> {
    const sentences = this.extractSentences(text);
    const totalSentences = sentences.length;

    onProgress?.({
      totalPatterns: totalSentences,
      processedPatterns: 0,
      currentPhase: 'analyzing',
      progress: 0
    });

    // Extract phrases from sentences
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const language = detectLanguage(sentence);
      
      // Extract n-grams (2-5 words)
      const phrases = this.extractPhrases(sentence);
      
      phrases.forEach(phrase => {
        this.addPattern(phrase, sentence, language);
      });

      // Update progress
      if (onProgress && i % 10 === 0) {
        onProgress({
          totalPatterns: totalSentences,
          processedPatterns: i,
          currentPhase: 'building',
          progress: Math.round((i / totalSentences) * 100)
        });
      }
    }

    // Optimize patterns
    onProgress?.({
      totalPatterns: totalSentences,
      processedPatterns: totalSentences,
      currentPhase: 'optimizing',
      progress: 95
    });

    this.optimizePatterns();

    onProgress?.({
      totalPatterns: totalSentences,
      processedPatterns: totalSentences,
      currentPhase: 'complete',
      progress: 100
    });
  }

  /**
   * Add or update a pattern
   */
  private addPattern(phrase: string, context: string, language: Language): void {
    const key = phrase.toLowerCase();
    
    if (this.patterns.has(key)) {
      const pattern = this.patterns.get(key)!;
      pattern.frequency++;
      pattern.lastUsed = Date.now();
      
      // Add context if not already present
      if (!pattern.context.includes(context)) {
        pattern.context.push(context);
        // Keep only last 5 contexts
        if (pattern.context.length > 5) {
          pattern.context.shift();
        }
      }
    } else {
      // Check if we need to remove old patterns
      if (this.patterns.size >= this.maxPatterns) {
        this.removeOldestPattern();
      }

      this.patterns.set(key, {
        phrase,
        frequency: 1,
        context: [context],
        lastUsed: Date.now(),
        language
      });
    }
  }

  /**
   * Extract sentences from text
   */
  private extractSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  /**
   * Extract phrases (n-grams) from sentence
   */
  private extractPhrases(sentence: string): string[] {
    const words = sentence.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const phrases: string[] = [];

    // Extract 2-5 word phrases
    for (let n = 2; n <= 5; n++) {
      for (let i = 0; i <= words.length - n; i++) {
        const phrase = words.slice(i, i + n).join(' ');
        phrases.push(phrase);
      }
    }

    return phrases;
  }

  /**
   * Remove oldest/least used pattern
   */
  private removeOldestPattern(): void {
    let oldestKey: string | null = null;
    let oldestScore = Infinity;

    this.patterns.forEach((pattern, key) => {
      // Score based on frequency and recency
      const recencyScore = Date.now() - pattern.lastUsed;
      const frequencyScore = 1 / pattern.frequency;
      const score = recencyScore * frequencyScore;

      if (score < oldestScore) {
        oldestScore = score;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.patterns.delete(oldestKey);
    }
  }

  /**
   * Optimize patterns by removing low-frequency ones
   */
  private optimizePatterns(): void {
    const minFrequency = 2;
    const keysToRemove: string[] = [];

    this.patterns.forEach((pattern, key) => {
      if (pattern.frequency < minFrequency) {
        keysToRemove.push(key);
      }
    });

    keysToRemove.forEach(key => this.patterns.delete(key));
  }

  /**
   * Get patterns matching a prefix
   */
  getMatchingPatterns(prefix: string, limit: number = 5): UserPattern[] {
    const lowerPrefix = prefix.toLowerCase();
    const matches: UserPattern[] = [];

    this.patterns.forEach(pattern => {
      if (pattern.phrase.toLowerCase().startsWith(lowerPrefix)) {
        matches.push(pattern);
      }
    });

    // Sort by frequency and recency
    return matches
      .sort((a, b) => {
        const scoreA = a.frequency * (1 / (Date.now() - a.lastUsed + 1));
        const scoreB = b.frequency * (1 / (Date.now() - b.lastUsed + 1));
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Get all patterns
   */
  getAllPatterns(): UserPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Export patterns
   */
  exportPatterns(): string {
    return JSON.stringify(Array.from(this.patterns.entries()));
  }

  /**
   * Import patterns
   */
  importPatterns(jsonData: string): void {
    const entries = JSON.parse(jsonData);
    this.patterns = new Map(entries);
  }

  /**
   * Clear all patterns
   */
  clear(): void {
    this.patterns.clear();
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalPatterns: this.patterns.size,
      maxPatterns: this.maxPatterns,
      languages: this.getLanguageDistribution()
    };
  }

  /**
   * Get language distribution
   */
  private getLanguageDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};

    this.patterns.forEach(pattern => {
      distribution[pattern.language] = (distribution[pattern.language] || 0) + 1;
    });

    return distribution;
  }
}

