/**
 * Main prediction engine
 * Combines n-gram model and pattern learning for intelligent predictions
 */

import type { Prediction, PredictionContext, PredictionOptions, Language } from '../types';
import { NGramModel } from './nGramModel';
import { PatternLearner } from './patternLearning';
import { detectLanguage } from './languageDetection';

export class PredictionEngine {
  private ngramModel: NGramModel;
  private patternLearner: PatternLearner;
  private language: Language;

  constructor(language: Language = 'auto') {
    this.language = language;
    this.ngramModel = new NGramModel(language === 'auto' ? 'en' : language);
    this.patternLearner = new PatternLearner();
  }

  /**
   * Train the engine with text samples
   */
  async train(text: string): Promise<void> {
    // Detect language if auto
    if (this.language === 'auto') {
      const detected = detectLanguage(text);
      this.ngramModel = new NGramModel(detected);
    }

    // Train both models
    this.ngramModel.train(text);
    await this.patternLearner.learn(text);
  }

  /**
   * Get predictions based on context
   */
  predict(context: PredictionContext, options: PredictionOptions = {}): Prediction[] {
    const {
      maxPredictions = 5,
      minConfidence = 0.1,
      contextWindow = 10
    } = options;

    const predictions: Prediction[] = [];

    // Get context text (last N words)
    const contextText = this.getContextText(context.previousText, contextWindow);

    // Get pattern-based predictions
    const patternPredictions = this.getPatternPredictions(
      context.currentWord,
      contextText,
      maxPredictions
    );
    predictions.push(...patternPredictions);

    // Get n-gram predictions
    const ngramPredictions = this.getNGramPredictions(
      contextText,
      maxPredictions
    );
    predictions.push(...ngramPredictions);

    // Merge and rank predictions
    const rankedPredictions = this.rankPredictions(predictions, context);

    // Filter by confidence and limit
    return rankedPredictions
      .filter(p => p.confidence >= minConfidence)
      .slice(0, maxPredictions);
  }

  /**
   * Get pattern-based predictions
   */
  private getPatternPredictions(
    currentWord: string,
    context: string,
    limit: number
  ): Prediction[] {
    const patterns = this.patternLearner.getMatchingPatterns(currentWord, limit);

    return patterns.map(pattern => ({
      text: pattern.phrase,
      confidence: this.calculatePatternConfidence(pattern, context),
      type: this.getPredictionType(pattern.phrase),
      context: pattern.context[0]
    }));
  }

  /**
   * Get n-gram based predictions
   */
  private getNGramPredictions(context: string, limit: number): Prediction[] {
    const ngramResults = this.ngramModel.predict(context, limit);

    return ngramResults.map(result => ({
      text: result.word,
      confidence: result.probability,
      type: 'word' as const,
      context
    }));
  }

  /**
   * Calculate confidence for pattern prediction
   */
  private calculatePatternConfidence(pattern: any, context: string): number {
    // Base confidence from frequency
    let confidence = Math.min(pattern.frequency / 100, 0.9);

    // Boost if context matches
    const contextMatch = pattern.context.some((ctx: string) =>
      ctx.toLowerCase().includes(context.toLowerCase())
    );
    if (contextMatch) {
      confidence *= 1.2;
    }

    // Boost for recency
    const daysSinceUse = (Date.now() - pattern.lastUsed) / (1000 * 60 * 60 * 24);
    if (daysSinceUse < 7) {
      confidence *= 1.1;
    }

    return Math.min(confidence, 1);
  }

  /**
   * Rank and merge predictions
   */
  private rankPredictions(predictions: Prediction[], context: PredictionContext): Prediction[] {
    // Remove duplicates
    const uniquePredictions = new Map<string, Prediction>();

    predictions.forEach(pred => {
      const key = pred.text.toLowerCase();
      if (!uniquePredictions.has(key) || pred.confidence > uniquePredictions.get(key)!.confidence) {
        uniquePredictions.set(key, pred);
      }
    });

    // Sort by confidence
    return Array.from(uniquePredictions.values())
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get context text from previous text
   */
  private getContextText(previousText: string, windowSize: number): string {
    const words = previousText.trim().split(/\s+/);
    return words.slice(-windowSize).join(' ');
  }

  /**
   * Determine prediction type based on text
   */
  private getPredictionType(text: string): 'word' | 'phrase' | 'sentence' {
    const wordCount = text.split(/\s+/).length;
    
    if (wordCount === 1) return 'word';
    if (wordCount <= 4) return 'phrase';
    return 'sentence';
  }

  /**
   * Export engine data
   */
  exportData(): { ngram: string; patterns: string } {
    return {
      ngram: this.ngramModel.exportData(),
      patterns: this.patternLearner.exportPatterns()
    };
  }

  /**
   * Import engine data
   */
  importData(data: { ngram: string; patterns: string }): void {
    this.ngramModel.importData(data.ngram);
    this.patternLearner.importPatterns(data.patterns);
  }

  /**
   * Clear all training data
   */
  clear(): void {
    this.ngramModel.clear();
    this.patternLearner.clear();
  }

  /**
   * Get engine statistics
   */
  getStats() {
    return {
      ngram: this.ngramModel.getStats(),
      patterns: this.patternLearner.getStats(),
      language: this.language
    };
  }
}
