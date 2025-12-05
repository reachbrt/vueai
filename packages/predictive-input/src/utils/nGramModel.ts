/**
 * N-gram language model for text prediction
 * Learns patterns from user's writing to predict next words/phrases
 */

import type { Language } from '../types';

export interface NGramData {
  unigrams: Map<string, number>;
  bigrams: Map<string, Map<string, number>>;
  trigrams: Map<string, Map<string, number>>;
  totalWords: number;
}

// Common words for initial predictions (before training)
const COMMON_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
];

// Common phrases for better predictions
const COMMON_PHRASES = [
  'thank you', 'I am', 'I will', 'I have', 'I think', 'I would', 'I can',
  'you are', 'you can', 'you will', 'you have', 'you should',
  'we are', 'we will', 'we have', 'we can', 'we should',
  'it is', 'it was', 'it will', 'it has', 'it would',
  'this is', 'this was', 'this will', 'that is', 'that was',
  'how are', 'how do', 'how can', 'how to', 'how much',
  'what is', 'what are', 'what do', 'what can', 'what about',
  'when is', 'when are', 'when do', 'when can', 'when will',
  'where is', 'where are', 'where do', 'where can',
  'why is', 'why are', 'why do', 'why would',
  'please let', 'please send', 'please provide', 'please confirm',
  'looking forward', 'best regards', 'kind regards', 'thank you for',
  'I would like', 'I am writing', 'I am looking', 'I am interested',
  'could you', 'would you', 'can you', 'do you', 'have you',
  'let me know', 'feel free', 'as soon as', 'in order to'
];

export class NGramModel {
  private data: NGramData;
  private language: Language;
  private hasTrainingData: boolean = false;

  constructor(language: Language = 'en') {
    this.language = language;
    this.data = {
      unigrams: new Map(),
      bigrams: new Map(),
      trigrams: new Map(),
      totalWords: 0
    };

    // Initialize with common words
    this.initializeDefaults();
  }

  /**
   * Initialize with common words and phrases
   */
  private initializeDefaults(): void {
    // Add common words with base frequency
    COMMON_WORDS.forEach((word, index) => {
      const frequency = COMMON_WORDS.length - index; // Higher frequency for earlier words
      this.data.unigrams.set(word, frequency);
      this.data.totalWords += frequency;
    });

    // Add common phrases
    COMMON_PHRASES.forEach(phrase => {
      const words = phrase.split(' ');

      // Add bigrams
      for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i];
        const w2 = words[i + 1];

        if (!this.data.bigrams.has(w1)) {
          this.data.bigrams.set(w1, new Map());
        }
        const bigramMap = this.data.bigrams.get(w1)!;
        bigramMap.set(w2, (bigramMap.get(w2) || 0) + 10); // Higher weight for common phrases
      }

      // Add trigrams
      for (let i = 0; i < words.length - 2; i++) {
        const w1w2 = `${words[i]} ${words[i + 1]}`;
        const w3 = words[i + 2];

        if (!this.data.trigrams.has(w1w2)) {
          this.data.trigrams.set(w1w2, new Map());
        }
        const trigramMap = this.data.trigrams.get(w1w2)!;
        trigramMap.set(w3, (trigramMap.get(w3) || 0) + 10);
      }
    });
  }

  /**
   * Train the model with text samples
   */
  train(text: string): void {
    const words = this.tokenize(text);
    this.hasTrainingData = true;

    // Update unigrams (with higher weight than defaults)
    words.forEach(word => {
      this.data.unigrams.set(word, (this.data.unigrams.get(word) || 0) + 5);
      this.data.totalWords += 5;
    });

    // Update bigrams (with higher weight)
    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];

      if (!this.data.bigrams.has(w1)) {
        this.data.bigrams.set(w1, new Map());
      }
      const bigramMap = this.data.bigrams.get(w1)!;
      bigramMap.set(w2, (bigramMap.get(w2) || 0) + 5);
    }

    // Update trigrams (with higher weight)
    for (let i = 0; i < words.length - 2; i++) {
      const w1w2 = `${words[i]} ${words[i + 1]}`;
      const w3 = words[i + 2];

      if (!this.data.trigrams.has(w1w2)) {
        this.data.trigrams.set(w1w2, new Map());
      }
      const trigramMap = this.data.trigrams.get(w1w2)!;
      trigramMap.set(w3, (trigramMap.get(w3) || 0) + 5);
    }
  }

  /**
   * Predict next words based on context
   */
  predict(context: string, maxPredictions: number = 5): Array<{ word: string; probability: number }> {
    const words = this.tokenize(context);

    if (words.length === 0) {
      // No context - return most common words
      return this.getMostCommonWords(maxPredictions);
    }

    // Try trigram prediction first
    if (words.length >= 2) {
      const lastTwo = `${words[words.length - 2]} ${words[words.length - 1]}`;
      const trigramPredictions = this.getTrigramPredictions(lastTwo);
      if (trigramPredictions.length > 0) {
        return trigramPredictions.slice(0, maxPredictions);
      }
    }

    // Fall back to bigram prediction
    if (words.length >= 1) {
      const lastWord = words[words.length - 1];
      const bigramPredictions = this.getBigramPredictions(lastWord);
      if (bigramPredictions.length > 0) {
        return bigramPredictions.slice(0, maxPredictions);
      }
    }

    // Fall back to most common words
    return this.getMostCommonWords(maxPredictions);
  }

  /**
   * Get trigram-based predictions
   */
  private getTrigramPredictions(context: string): Array<{ word: string; probability: number }> {
    const trigramMap = this.data.trigrams.get(context);
    if (!trigramMap) return [];

    const total = Array.from(trigramMap.values()).reduce((sum, count) => sum + count, 0);
    
    return Array.from(trigramMap.entries())
      .map(([word, count]) => ({
        word,
        probability: count / total
      }))
      .sort((a, b) => b.probability - a.probability);
  }

  /**
   * Get bigram-based predictions
   */
  private getBigramPredictions(context: string): Array<{ word: string; probability: number }> {
    const bigramMap = this.data.bigrams.get(context);
    if (!bigramMap) return [];

    const total = Array.from(bigramMap.values()).reduce((sum, count) => sum + count, 0);
    
    return Array.from(bigramMap.entries())
      .map(([word, count]) => ({
        word,
        probability: count / total
      }))
      .sort((a, b) => b.probability - a.probability);
  }

  /**
   * Get most common words
   */
  private getMostCommonWords(limit: number): Array<{ word: string; probability: number }> {
    return Array.from(this.data.unigrams.entries())
      .map(([word, count]) => ({
        word,
        probability: count / this.data.totalWords
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, limit);
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Export model data
   */
  exportData(): string {
    return JSON.stringify({
      unigrams: Array.from(this.data.unigrams.entries()),
      bigrams: Array.from(this.data.bigrams.entries()).map(([key, map]) => [
        key,
        Array.from(map.entries())
      ]),
      trigrams: Array.from(this.data.trigrams.entries()).map(([key, map]) => [
        key,
        Array.from(map.entries())
      ]),
      totalWords: this.data.totalWords,
      language: this.language
    });
  }

  /**
   * Import model data
   */
  importData(jsonData: string): void {
    const data = JSON.parse(jsonData);

    this.data.unigrams = new Map(data.unigrams);
    this.data.bigrams = new Map(
      data.bigrams.map(([key, entries]: [string, [string, number][]]) => [
        key,
        new Map(entries)
      ])
    );
    this.data.trigrams = new Map(
      data.trigrams.map(([key, entries]: [string, [string, number][]]) => [
        key,
        new Map(entries)
      ])
    );
    this.data.totalWords = data.totalWords;
    this.language = data.language;
  }

  /**
   * Clear all training data
   */
  clear(): void {
    this.data = {
      unigrams: new Map(),
      bigrams: new Map(),
      trigrams: new Map(),
      totalWords: 0
    };
  }

  /**
   * Get model statistics
   */
  getStats() {
    return {
      uniqueWords: this.data.unigrams.size,
      totalWords: this.data.totalWords,
      bigramCount: this.data.bigrams.size,
      trigramCount: this.data.trigrams.size,
      language: this.language
    };
  }
}

