/**
 * Language detection utility
 * Detects the language of input text for multi-language support
 */

import type { Language } from '../types';

// Common words for language detection
const languagePatterns: Record<Exclude<Language, 'auto'>, string[]> = {
  en: ['the', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'can', 'could', 'should'],
  es: ['el', 'la', 'los', 'las', 'de', 'que', 'es', 'en', 'por', 'para', 'con', 'una', 'uno'],
  fr: ['le', 'la', 'les', 'de', 'un', 'une', 'est', 'sont', 'dans', 'pour', 'avec', 'que', 'qui'],
  de: ['der', 'die', 'das', 'den', 'dem', 'des', 'ist', 'sind', 'war', 'waren', 'und', 'oder', 'aber'],
  it: ['il', 'lo', 'la', 'i', 'gli', 'le', 'di', 'che', 'è', 'sono', 'per', 'con', 'una', 'uno'],
  pt: ['o', 'a', 'os', 'as', 'de', 'que', 'é', 'são', 'em', 'para', 'com', 'uma', 'um']
};

/**
 * Detect the language of the given text
 */
export function detectLanguage(text: string): Exclude<Language, 'auto'> {
  if (!text || text.trim().length === 0) {
    return 'en'; // Default to English
  }

  const words = text.toLowerCase().split(/\s+/);
  const scores: Record<Exclude<Language, 'auto'>, number> = {
    en: 0,
    es: 0,
    fr: 0,
    de: 0,
    it: 0,
    pt: 0
  };

  // Count matches for each language
  words.forEach(word => {
    Object.entries(languagePatterns).forEach(([lang, patterns]) => {
      if (patterns.includes(word)) {
        scores[lang as Exclude<Language, 'auto'>]++;
      }
    });
  });

  // Find language with highest score
  let maxScore = 0;
  let detectedLang: Exclude<Language, 'auto'> = 'en';

  Object.entries(scores).forEach(([lang, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang as Exclude<Language, 'auto'>;
    }
  });

  return detectedLang;
}

/**
 * Check if text is in a specific language
 */
export function isLanguage(text: string, language: Exclude<Language, 'auto'>): boolean {
  const detected = detectLanguage(text);
  return detected === language;
}

/**
 * Get language confidence score (0-1)
 */
export function getLanguageConfidence(text: string, language: Exclude<Language, 'auto'>): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  const words = text.toLowerCase().split(/\s+/);
  const patterns = languagePatterns[language];
  let matches = 0;

  words.forEach(word => {
    if (patterns.includes(word)) {
      matches++;
    }
  });

  return Math.min(matches / Math.max(words.length, 1), 1);
}

/**
 * Get all language scores for text
 */
export function getAllLanguageScores(text: string): Record<Exclude<Language, 'auto'>, number> {
  const scores: Record<Exclude<Language, 'auto'>, number> = {
    en: 0,
    es: 0,
    fr: 0,
    de: 0,
    it: 0,
    pt: 0
  };

  Object.keys(languagePatterns).forEach(lang => {
    scores[lang as Exclude<Language, 'auto'>] = getLanguageConfidence(text, lang as Exclude<Language, 'auto'>);
  });

  return scores;
}

