import type { Notification, NotificationBatch, NotificationPriority } from '../types';

export class BatchingSystem {
  private batches: Map<string, NotificationBatch> = new Map();
  private batchInterval: number = 5 * 60 * 1000; // 5 minutes default
  private maxBatchSize: number = 10;
  private batchTimers: Map<string, number> = new Map();

  constructor(batchInterval?: number, maxBatchSize?: number) {
    if (batchInterval) this.batchInterval = batchInterval;
    if (maxBatchSize) this.maxBatchSize = maxBatchSize;
  }

  shouldBatch(notification: Notification): boolean {
    // Never batch critical or high priority notifications
    if (notification.priority === 'critical' || notification.priority === 'high') {
      return false;
    }

    // Never batch if notification has expiration soon
    if (notification.expiresAt) {
      const timeUntilExpiry = notification.expiresAt - Date.now();
      if (timeUntilExpiry < this.batchInterval) {
        return false;
      }
    }

    // Only batch low priority notifications (medium should be delivered immediately)
    return notification.priority === 'low';
  }

  addToBatch(notification: Notification): NotificationBatch | null {
    const batchKey = this.getBatchKey(notification);
    let batch = this.batches.get(batchKey);

    if (!batch) {
      // Create new batch
      batch = {
        id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        notifications: [],
        scheduledTime: Date.now() + this.batchInterval,
        category: notification.category,
        priority: notification.priority || 'medium',
        reason: 'Batched to reduce interruptions'
      };
      this.batches.set(batchKey, batch);

      // Schedule batch delivery
      this.scheduleBatchDelivery(batchKey, batch);
    }

    // Add notification to batch
    batch.notifications.push(notification);

    // Update batch priority if needed
    if (this.isPriorityHigher(notification.priority || 'low', batch.priority)) {
      batch.priority = notification.priority || 'medium';
    }

    // If batch is full, deliver immediately
    if (batch.notifications.length >= this.maxBatchSize) {
      return this.deliverBatch(batchKey);
    }

    return null;
  }

  deliverBatch(batchKey: string): NotificationBatch | null {
    const batch = this.batches.get(batchKey);
    if (!batch) return null;

    // Clear timer
    const timerId = this.batchTimers.get(batchKey);
    if (timerId) {
      clearTimeout(timerId);
      this.batchTimers.delete(batchKey);
    }

    // Remove batch
    this.batches.delete(batchKey);

    return batch;
  }

  getPendingBatches(): NotificationBatch[] {
    return Array.from(this.batches.values());
  }

  clearBatch(batchKey: string): void {
    const timerId = this.batchTimers.get(batchKey);
    if (timerId) {
      clearTimeout(timerId);
      this.batchTimers.delete(batchKey);
    }
    this.batches.delete(batchKey);
  }

  clearAllBatches(): void {
    this.batchTimers.forEach(timerId => clearTimeout(timerId));
    this.batchTimers.clear();
    this.batches.clear();
  }

  private getBatchKey(notification: Notification): string {
    // Group by category and priority
    return `${notification.category}-${notification.priority || 'medium'}`;
  }

  private scheduleBatchDelivery(batchKey: string, batch: NotificationBatch): void {
    if (typeof window === 'undefined') return;

    const timerId = window.setTimeout(() => {
      this.deliverBatch(batchKey);
    }, this.batchInterval);

    this.batchTimers.set(batchKey, timerId);
  }

  private isPriorityHigher(p1: NotificationPriority, p2: NotificationPriority): boolean {
    const priorities: NotificationPriority[] = ['critical', 'high', 'medium', 'low'];
    return priorities.indexOf(p1) < priorities.indexOf(p2);
  }
}

