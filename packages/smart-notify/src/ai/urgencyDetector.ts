import nlp from 'compromise';
import type { Notification, UrgencyAnalysis, NotificationPriority, UrgencyDetector as IUrgencyDetector } from '../types';

interface UrgencyKeywords {
  critical: string[];
  high: string[];
  medium: string[];
  low: string[];
}

interface TrainingData {
  text: string;
  urgency: number;
  timestamp: number;
}

export class UrgencyDetector implements IUrgencyDetector {
  private keywords: UrgencyKeywords = {
    critical: [
      'urgent', 'emergency', 'critical', 'asap', 'immediately', 'now',
      'alert', 'warning', 'danger', 'security', 'breach', 'failure',
      'down', 'outage', 'error', 'crash', 'deadline', 'overdue'
    ],
    high: [
      'important', 'priority', 'attention', 'required', 'action needed',
      'please review', 'time-sensitive', 'expiring', 'soon', 'today',
      'approval needed', 'confirm', 'verify', 'respond'
    ],
    medium: [
      'update', 'reminder', 'notification', 'info', 'fyi',
      'scheduled', 'upcoming', 'tomorrow', 'this week', 'meeting'
    ],
    low: [
      'optional', 'suggestion', 'tip', 'newsletter', 'digest',
      'summary', 'weekly', 'monthly', 'promotional'
    ]
  };

  private trainingData: TrainingData[] = [];
  private maxTrainingData = 1000;

  analyze(notification: Notification): UrgencyAnalysis {
    const text = `${notification.title} ${notification.message}`.toLowerCase();
    const doc = nlp(text);

    // Keyword-based scoring
    const keywordScore = this.calculateKeywordScore(text);

    // Sentiment analysis
    const sentiment = this.analyzeSentiment(doc);

    // Time relevance
    const timeRelevance = this.analyzeTimeRelevance(text, notification);

    // Contextual importance
    const contextualImportance = this.analyzeContext(notification);

    // Combined score (weighted average)
    const score = (
      keywordScore * 0.4 +
      sentiment * 0.2 +
      timeRelevance * 0.25 +
      contextualImportance * 0.15
    );

    // Extract important keywords
    const keywords = this.extractKeywords(text);

    // Determine suggested priority
    const suggestedPriority = this.scoreToPriority(score);

    // Calculate confidence based on keyword matches and training data
    const confidence = this.calculateConfidence(text, score);

    return {
      score: Math.max(0, Math.min(1, score)),
      confidence,
      factors: {
        keywords,
        sentiment,
        timeRelevance,
        contextualImportance
      },
      suggestedPriority
    };
  }

  train(notification: Notification, actualUrgency: number): void {
    const text = `${notification.title} ${notification.message}`.toLowerCase();

    this.trainingData.push({
      text,
      urgency: actualUrgency,
      timestamp: Date.now()
    });

    // Keep only recent training data
    if (this.trainingData.length > this.maxTrainingData) {
      this.trainingData = this.trainingData.slice(-this.maxTrainingData);
    }

    // Update keyword weights based on training (simple approach)
    this.updateKeywordWeights(text, actualUrgency);
  }

  getModel(): any {
    return {
      keywords: this.keywords,
      trainingDataCount: this.trainingData.length,
      version: '1.0.0'
    };
  }

  private calculateKeywordScore(text: string): number {
    let score = 0.3; // baseline

    // Check for critical keywords
    const criticalMatches = this.keywords.critical.filter(kw => text.includes(kw)).length;
    score += criticalMatches * 0.15;

    // Check for high priority keywords
    const highMatches = this.keywords.high.filter(kw => text.includes(kw)).length;
    score += highMatches * 0.1;

    // Check for medium priority keywords
    const mediumMatches = this.keywords.medium.filter(kw => text.includes(kw)).length;
    score += mediumMatches * 0.05;

    // Check for low priority keywords (reduces score)
    const lowMatches = this.keywords.low.filter(kw => text.includes(kw)).length;
    score -= lowMatches * 0.1;

    return Math.max(0, Math.min(1, score));
  }

  private analyzeSentiment(doc: any): number {
    // Simple sentiment analysis
    const hasNegative = doc.has('#Negative');
    const hasPositive = doc.has('#Positive');

    if (hasNegative) return 0.7; // Negative sentiment often indicates urgency
    if (hasPositive) return 0.4;
    return 0.5;
  }

  private analyzeTimeRelevance(text: string, notification: Notification): number {
    const timeKeywords = ['now', 'asap', 'immediately', 'today', 'urgent', 'deadline'];
    const hasTimeKeyword = timeKeywords.some(kw => text.includes(kw));

    if (hasTimeKeyword) return 0.8;

    // Check if notification has expiration
    if (notification.expiresAt) {
      const timeUntilExpiry = notification.expiresAt - Date.now();
      const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);

      if (hoursUntilExpiry < 1) return 0.9;
      if (hoursUntilExpiry < 6) return 0.7;
      if (hoursUntilExpiry < 24) return 0.5;
    }

    return 0.3;
  }

  private analyzeContext(notification: Notification): number {
    let score = 0.5;

    // Category-based importance
    if (notification.category === 'alert') score += 0.3;
    if (notification.category === 'message') score += 0.2;
    if (notification.category === 'reminder') score += 0.1;
    if (notification.category === 'social') score -= 0.1;

    // Explicit priority
    if (notification.priority === 'critical') score += 0.4;
    if (notification.priority === 'high') score += 0.2;
    if (notification.priority === 'low') score -= 0.2;

    // Has actions (indicates actionable notification)
    if (notification.actions && notification.actions.length > 0) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  private extractKeywords(text: string): string[] {
    const allKeywords = [
      ...this.keywords.critical,
      ...this.keywords.high,
      ...this.keywords.medium
    ];

    return allKeywords.filter(kw => text.includes(kw));
  }

  private scoreToPriority(score: number): NotificationPriority {
    if (score >= 0.75) return 'critical';
    if (score >= 0.55) return 'high';
    if (score >= 0.35) return 'medium';
    return 'low';
  }

  private calculateConfidence(text: string, score: number): number {
    // Base confidence on keyword matches
    const allKeywords = [
      ...this.keywords.critical,
      ...this.keywords.high,
      ...this.keywords.medium,
      ...this.keywords.low
    ];

    const matchCount = allKeywords.filter(kw => text.includes(kw)).length;
    let confidence = Math.min(0.9, 0.5 + (matchCount * 0.1));

    // Increase confidence if we have training data
    if (this.trainingData.length > 100) {
      confidence += 0.1;
    }

    return Math.max(0.3, Math.min(1, confidence));
  }

  private updateKeywordWeights(text: string, actualUrgency: number): void {
    // Extract words from text
    const words = text.split(/\s+/).filter(w => w.length > 3);

    // If actual urgency is high, add new keywords to high/critical lists
    if (actualUrgency > 0.7) {
      words.forEach(word => {
        if (!this.keywords.critical.includes(word) &&
            !this.keywords.high.includes(word) &&
            word.length > 4) {
          // Add to high keywords if not already present
          if (this.keywords.high.length < 50) {
            this.keywords.high.push(word);
          }
        }
      });
    }
  }

  exportModel(): string {
    return JSON.stringify({
      keywords: this.keywords,
      trainingData: this.trainingData.slice(-100), // Export last 100 samples
      version: '1.0.0'
    });
  }

  importModel(modelData: string): void {
    try {
      const data = JSON.parse(modelData);
      if (data.keywords) {
        this.keywords = data.keywords;
      }
      if (data.trainingData) {
        this.trainingData = data.trainingData;
      }
    } catch (error) {
      console.error('Failed to import urgency detector model:', error);
    }
  }
}
