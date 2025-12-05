import nlp from 'compromise';
import type { Notification, NotificationGroup, GroupingEngine as IGroupingEngine } from '../types';

// Simple browser-compatible TF-IDF implementation
class SimpleTfIdf {
  private documents: string[] = [];
  private termFrequency: Map<number, Map<string, number>> = new Map();
  private documentFrequency: Map<string, number> = new Map();

  addDocument(text: string): void {
    const docIndex = this.documents.length;
    this.documents.push(text);

    const terms = this.tokenize(text);
    const termFreq = new Map<string, number>();

    terms.forEach(term => {
      termFreq.set(term, (termFreq.get(term) || 0) + 1);
      if (!this.documentFrequency.has(term)) {
        this.documentFrequency.set(term, 0);
      }
    });

    // Update document frequency
    const uniqueTerms = new Set(terms);
    uniqueTerms.forEach(term => {
      this.documentFrequency.set(term, (this.documentFrequency.get(term) || 0) + 1);
    });

    this.termFrequency.set(docIndex, termFreq);
  }

  listTerms(docIndex: number): Array<{ term: string; tfidf: number }> {
    const termFreq = this.termFrequency.get(docIndex);
    if (!termFreq) return [];

    const results: Array<{ term: string; tfidf: number }> = [];
    const numDocs = this.documents.length;

    termFreq.forEach((freq, term) => {
      const tf = freq;
      const df = this.documentFrequency.get(term) || 1;
      const idf = Math.log(numDocs / df);
      const tfidf = tf * idf;
      results.push({ term, tfidf });
    });

    return results.sort((a, b) => b.tfidf - a.tfidf);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
  }
}

export class GroupingEngine implements IGroupingEngine {
  private tfidf: SimpleTfIdf;
  private similarityThreshold = 0.6;

  constructor() {
    this.tfidf = new SimpleTfIdf();
  }

  findRelated(notification: Notification, existingNotifications: Notification[]): Notification[] {
    const related: Notification[] = [];

    for (const existing of existingNotifications) {
      if (this.shouldGroup(notification, existing)) {
        related.push(existing);
      }
    }

    return related.sort((a, b) => {
      const simA = this.calculateSimilarity(notification, a);
      const simB = this.calculateSimilarity(notification, b);
      return simB - simA;
    });
  }

  createGroup(notifications: Notification[]): NotificationGroup {
    if (notifications.length === 0) {
      throw new Error('Cannot create group from empty notifications array');
    }

    // Determine group category (most common)
    const categoryCount = new Map<string, number>();
    notifications.forEach(n => {
      categoryCount.set(n.category, (categoryCount.get(n.category) || 0) + 1);
    });
    const category = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])[0][0] as any;

    // Determine group priority (highest)
    const priorities = ['critical', 'high', 'medium', 'low'];
    const priority = notifications.reduce((highest, n) => {
      const currentIndex = priorities.indexOf(n.priority || 'low');
      const highestIndex = priorities.indexOf(highest);
      return currentIndex < highestIndex ? (n.priority || 'low') : highest;
    }, 'low' as any);

    // Generate group title
    const title = this.generateGroupTitle(notifications);

    return {
      id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      notifications,
      category,
      priority,
      createdAt: Math.min(...notifications.map(n => n.timestamp)),
      updatedAt: Date.now(),
      collapsed: true
    };
  }

  shouldGroup(n1: Notification, n2: Notification): boolean {
    // Don't group critical notifications
    if (n1.priority === 'critical' || n2.priority === 'critical') {
      return false;
    }

    // Same category is a strong indicator
    if (n1.category === n2.category) {
      // Check time proximity (within 30 minutes)
      const timeDiff = Math.abs(n1.timestamp - n2.timestamp);
      if (timeDiff < 30 * 60 * 1000) {
        return true;
      }
    }

    // Same source
    if (n1.source && n2.source && n1.source === n2.source) {
      return true;
    }

    // Check semantic similarity
    const similarity = this.calculateSimilarity(n1, n2);
    return similarity >= this.similarityThreshold;
  }

  calculateSimilarity(n1: Notification, n2: Notification): number {
    // Category match
    const categoryMatch = n1.category === n2.category ? 0.3 : 0;

    // Source match
    const sourceMatch = (n1.source && n2.source && n1.source === n2.source) ? 0.2 : 0;

    // Tag overlap
    const tagMatch = this.calculateTagSimilarity(n1.tags || [], n2.tags || []);

    // Text similarity
    const textSimilarity = this.calculateTextSimilarity(
      `${n1.title} ${n1.message}`,
      `${n2.title} ${n2.message}`
    );

    return categoryMatch + sourceMatch + (tagMatch * 0.2) + (textSimilarity * 0.3);
  }

  private calculateTagSimilarity(tags1: string[], tags2: string[]): number {
    if (tags1.length === 0 || tags2.length === 0) return 0;

    const set1 = new Set(tags1);
    const set2 = new Set(tags2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));

    return intersection.size / Math.max(set1.size, set2.size);
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    // Use TF-IDF for text similarity
    this.tfidf.addDocument(text1.toLowerCase());
    this.tfidf.addDocument(text2.toLowerCase());

    // Get top terms from each document
    const terms1 = new Set<string>();
    const terms2 = new Set<string>();

    this.tfidf.listTerms(0).slice(0, 10).forEach(item => terms1.add(item.term));
    this.tfidf.listTerms(1).slice(0, 10).forEach(item => terms2.add(item.term));

    // Calculate Jaccard similarity
    const intersection = new Set([...terms1].filter(x => terms2.has(x)));
    const union = new Set([...terms1, ...terms2]);

    // Reset TF-IDF for next comparison
    this.tfidf = new SimpleTfIdf();

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private generateGroupTitle(notifications: Notification[]): string {
    if (notifications.length === 0) return 'Notifications';
    if (notifications.length === 1) return notifications[0].title;

    // Try to find common theme
    const category = notifications[0].category;
    const source = notifications[0].source;

    if (source && notifications.every(n => n.source === source)) {
      return `${notifications.length} notifications from ${source}`;
    }

    const categoryNames: Record<string, string> = {
      message: 'Messages',
      alert: 'Alerts',
      reminder: 'Reminders',
      update: 'Updates',
      social: 'Social',
      system: 'System'
    };

    return `${notifications.length} ${categoryNames[category] || 'Notifications'}`;
  }
}

