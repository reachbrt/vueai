import type {
  Notification,
  UserAttention,
  TimingPrediction,
  OptimalTimingData,
  TimingPredictor as ITimingPredictor
} from '../types';

interface InteractionRecord {
  hourOfDay: number;
  dayOfWeek: number;
  wasRead: boolean;
  responseTime: number; // milliseconds
  timestamp: number;
  category: string;
}

export class TimingPredictor implements ITimingPredictor {
  private interactions: InteractionRecord[] = [];
  private timingData: Map<string, OptimalTimingData> = new Map();
  private maxInteractions = 1000;

  predict(notification: Notification, userAttention: UserAttention): TimingPrediction {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    // If user is in do-not-disturb mode, delay significantly
    if (userAttention.doNotDisturb && userAttention.doNotDisturbUntil) {
      return {
        recommendedTime: userAttention.doNotDisturbUntil,
        confidence: 0.95,
        reason: 'User is in Do Not Disturb mode',
        alternativeTimes: []
      };
    }

    // If user is focused on something, delay slightly
    if (userAttention.state === 'focused' && userAttention.isUserTyping) {
      const delayMinutes = 5;
      return {
        recommendedTime: Date.now() + (delayMinutes * 60 * 1000),
        confidence: 0.8,
        reason: 'User is currently focused on a task',
        alternativeTimes: this.getAlternativeTimes(currentHour, currentDay)
      };
    }

    // If user is idle or away, delay until they return
    if (userAttention.state === 'away' || userAttention.state === 'idle') {
      const delayMinutes = 15;
      return {
        recommendedTime: Date.now() + (delayMinutes * 60 * 1000),
        confidence: 0.7,
        reason: 'User is currently away or idle',
        alternativeTimes: this.getAlternativeTimes(currentHour, currentDay)
      };
    }

    // Get optimal time based on historical data
    const optimalTime = this.findOptimalTime(currentHour, currentDay, notification.category);

    if (optimalTime) {
      return optimalTime;
    }

    // Default: deliver now if user is active
    if (userAttention.state === 'active' && userAttention.isPageVisible) {
      return {
        recommendedTime: Date.now(),
        confidence: 0.6,
        reason: 'User is currently active',
        alternativeTimes: this.getAlternativeTimes(currentHour, currentDay)
      };
    }

    // Fallback: delay by 5 minutes
    return {
      recommendedTime: Date.now() + (5 * 60 * 1000),
      confidence: 0.5,
      reason: 'Default delay for better timing',
      alternativeTimes: this.getAlternativeTimes(currentHour, currentDay)
    };
  }

  recordInteraction(notification: Notification, interactionTime: number, wasRead: boolean): void {
    const date = new Date(interactionTime);
    const hourOfDay = date.getHours();
    const dayOfWeek = date.getDay();
    const responseTime = interactionTime - notification.timestamp;

    const record: InteractionRecord = {
      hourOfDay,
      dayOfWeek,
      wasRead,
      responseTime,
      timestamp: interactionTime,
      category: notification.category
    };

    this.interactions.push(record);

    // Keep only recent interactions
    if (this.interactions.length > this.maxInteractions) {
      this.interactions = this.interactions.slice(-this.maxInteractions);
    }

    // Update timing data
    this.updateTimingData(record);
  }

  getOptimalTimes(): OptimalTimingData[] {
    return Array.from(this.timingData.values())
      .sort((a, b) => b.interactionRate - a.interactionRate);
  }

  private findOptimalTime(currentHour: number, currentDay: number, category: string): TimingPrediction | null {
    // Look for similar time slots with high interaction rates
    const similarSlots = Array.from(this.timingData.values())
      .filter(data => {
        const hourDiff = Math.abs(data.hourOfDay - currentHour);
        const dayMatch = data.dayOfWeek === currentDay;
        return hourDiff <= 2 && dayMatch && data.sampleCount >= 5;
      })
      .sort((a, b) => b.interactionRate - a.interactionRate);

    if (similarSlots.length === 0) {
      return null;
    }

    const bestSlot = similarSlots[0];

    // If current time is already optimal, deliver now
    if (bestSlot.interactionRate > 0.7 && bestSlot.hourOfDay === currentHour) {
      return {
        recommendedTime: Date.now(),
        confidence: Math.min(0.9, bestSlot.interactionRate),
        reason: `Optimal time based on ${bestSlot.sampleCount} past interactions`,
        alternativeTimes: similarSlots.slice(1, 4).map(slot => {
          const targetDate = new Date();
          targetDate.setHours(slot.hourOfDay, 0, 0, 0);
          return targetDate.getTime();
        })
      };
    }

    // Calculate time until optimal slot
    const targetDate = new Date();
    targetDate.setHours(bestSlot.hourOfDay, 0, 0, 0);

    // If optimal time has passed today, schedule for tomorrow
    if (targetDate.getTime() < Date.now()) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    return {
      recommendedTime: targetDate.getTime(),
      confidence: Math.min(0.85, bestSlot.interactionRate),
      reason: `Scheduled for optimal time (${bestSlot.hourOfDay}:00) based on past behavior`,
      alternativeTimes: similarSlots.slice(1, 4).map(slot => {
        const targetDate = new Date();
        targetDate.setHours(slot.hourOfDay, 0, 0, 0);
        return targetDate.getTime();
      })
    };
  }

  private updateTimingData(record: InteractionRecord): void {
    const key = `${record.hourOfDay}-${record.dayOfWeek}`;

    const existing = this.timingData.get(key);

    if (existing) {
      // Update existing data
      const totalSamples = existing.sampleCount + 1;
      const newInteractionRate = (existing.interactionRate * existing.sampleCount + (record.wasRead ? 1 : 0)) / totalSamples;
      const newDismissalRate = (existing.dismissalRate * existing.sampleCount + (record.wasRead ? 0 : 1)) / totalSamples;
      const newReadTime = (existing.readTime * existing.sampleCount + record.responseTime) / totalSamples;

      this.timingData.set(key, {
        hourOfDay: record.hourOfDay,
        dayOfWeek: record.dayOfWeek,
        interactionRate: newInteractionRate,
        dismissalRate: newDismissalRate,
        readTime: newReadTime,
        sampleCount: totalSamples
      });
    } else {
      // Create new data point
      this.timingData.set(key, {
        hourOfDay: record.hourOfDay,
        dayOfWeek: record.dayOfWeek,
        interactionRate: record.wasRead ? 1 : 0,
        dismissalRate: record.wasRead ? 0 : 1,
        readTime: record.responseTime,
        sampleCount: 1
      });
    }
  }

  private getAlternativeTimes(currentHour: number, currentDay: number): number[] {
    // Suggest times based on general patterns
    const alternatives: number[] = [];
    const now = new Date();

    // Morning (9 AM)
    if (currentHour < 9 || currentHour > 12) {
      const morning = new Date(now);
      morning.setHours(9, 0, 0, 0);
      if (morning.getTime() < now.getTime()) {
        morning.setDate(morning.getDate() + 1);
      }
      alternatives.push(morning.getTime());
    }

    // Lunch (12 PM)
    if (currentHour < 12 || currentHour > 14) {
      const lunch = new Date(now);
      lunch.setHours(12, 0, 0, 0);
      if (lunch.getTime() < now.getTime()) {
        lunch.setDate(lunch.getDate() + 1);
      }
      alternatives.push(lunch.getTime());
    }

    // Afternoon (3 PM)
    if (currentHour < 15 || currentHour > 17) {
      const afternoon = new Date(now);
      afternoon.setHours(15, 0, 0, 0);
      if (afternoon.getTime() < now.getTime()) {
        afternoon.setDate(afternoon.getDate() + 1);
      }
      alternatives.push(afternoon.getTime());
    }

    // Evening (6 PM)
    if (currentHour < 18 || currentHour > 20) {
      const evening = new Date(now);
      evening.setHours(18, 0, 0, 0);
      if (evening.getTime() < now.getTime()) {
        evening.setDate(evening.getDate() + 1);
      }
      alternatives.push(evening.getTime());
    }

    return alternatives.slice(0, 3);
  }

  exportModel(): string {
    return JSON.stringify({
      interactions: this.interactions.slice(-100),
      timingData: Array.from(this.timingData.entries()),
      version: '1.0.0'
    });
  }

  importModel(modelData: string): void {
    try {
      const data = JSON.parse(modelData);
      if (data.interactions) {
        this.interactions = data.interactions;
      }
      if (data.timingData) {
        this.timingData = new Map(data.timingData);
      }
    } catch (error) {
      console.error('Failed to import timing predictor model:', error);
    }
  }

  getStats(): {
    totalInteractions: number;
    averageResponseTime: number;
    bestHours: number[];
    worstHours: number[];
  } {
    const totalInteractions = this.interactions.length;
    const averageResponseTime = this.interactions.reduce((sum, r) => sum + r.responseTime, 0) / totalInteractions || 0;

    const hourlyData = Array.from(this.timingData.values())
      .sort((a, b) => b.interactionRate - a.interactionRate);

    const bestHours = hourlyData.slice(0, 3).map(d => d.hourOfDay);
    const worstHours = hourlyData.slice(-3).map(d => d.hourOfDay).reverse();

    return {
      totalInteractions,
      averageResponseTime,
      bestHours,
      worstHours
    };
  }
}
