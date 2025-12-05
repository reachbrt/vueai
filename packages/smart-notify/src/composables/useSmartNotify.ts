import { ref, computed, onMounted, onUnmounted, readonly } from 'vue';
import type {
  Notification,
  NotificationGroup,
  NotificationBatch,
  SmartNotifyConfig,
  NotificationStats,
  NotificationEvent,
  UserAttention
} from '../types';
import { UrgencyDetector } from '../ai/urgencyDetector';
import { TimingPredictor } from '../ai/timingPredictor';
import { GroupingEngine } from '../ai/groupingEngine';
import { AttentionMonitor } from '../ai/attentionMonitor';
import { BatchingSystem } from '../utils/batchingSystem';
import { storage } from '../utils/storage';

const defaultConfig: SmartNotifyConfig = {
  enableAI: true,
  enableGrouping: true,
  enableBatching: true,
  enableAttentionDetection: true,
  enableOptimalTiming: true,
  batchInterval: 5 * 60 * 1000, // 5 minutes
  maxBatchSize: 10,
  attentionCheckInterval: 1000,
  idleThreshold: 60000,
  learningEnabled: true,
  respectDoNotDisturb: true,
  defaultPriority: 'medium',
  soundEnabled: true,
  vibrationEnabled: false,
  persistNotifications: true,
  maxNotifications: 100,
  autoExpire: true,
  expirationTime: 24 * 60 * 60 * 1000 // 24 hours
};

// Singleton state - shared across all instances
let sharedState: {
  config: any;
  notifications: any;
  groups: any;
  batches: any;
  events: any;
  urgencyDetector: UrgencyDetector;
  timingPredictor: TimingPredictor;
  groupingEngine: GroupingEngine;
  attentionMonitor: AttentionMonitor;
  batchingSystem: BatchingSystem;
  isInitialized: boolean;
} | null = null;

export function useSmartNotify(userConfig?: Partial<SmartNotifyConfig>) {
  // Initialize shared state only once
  if (!sharedState) {
    console.log('🔔 [SmartNotify] Initializing shared state (singleton)');
    const config = ref<SmartNotifyConfig>({ ...defaultConfig, ...userConfig });

    sharedState = {
      config,
      notifications: ref<Notification[]>([]),
      groups: ref<NotificationGroup[]>([]),
      batches: ref<NotificationBatch[]>([]),
      events: ref<NotificationEvent[]>([]),
      urgencyDetector: new UrgencyDetector(),
      timingPredictor: new TimingPredictor(),
      groupingEngine: new GroupingEngine(),
      attentionMonitor: new AttentionMonitor(config.value.idleThreshold),
      batchingSystem: new BatchingSystem(config.value.batchInterval, config.value.maxBatchSize),
      isInitialized: false
    };
  } else {
    console.log('🔔 [SmartNotify] Reusing existing shared state');
  }

  // Use shared state
  const config = sharedState.config;
  const notifications = sharedState.notifications;
  const groups = sharedState.groups;
  const batches = sharedState.batches;
  const events = sharedState.events;
  const urgencyDetector = sharedState.urgencyDetector;
  const timingPredictor = sharedState.timingPredictor;
  const groupingEngine = sharedState.groupingEngine;
  const attentionMonitor = sharedState.attentionMonitor;
  const batchingSystem = sharedState.batchingSystem;

  // Computed
  const unreadCount = computed(() =>
    notifications.value.filter(n => n.status !== 'read' && n.status !== 'dismissed').length
  );

  const criticalNotifications = computed(() =>
    notifications.value.filter(n => n.priority === 'critical' && n.status === 'delivered')
  );

  const userAttention = computed(() => attentionMonitor.getCurrentState());

  // Methods
  const notify = async (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>): Promise<Notification> => {
    const fullNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      status: 'pending',
      priority: notification.priority || config.value.defaultPriority
    };

    console.log('🔔 [SmartNotify] Creating notification:', fullNotification.title, 'Priority:', fullNotification.priority);

    // AI-powered urgency detection
    if (config.value.enableAI && !fullNotification.urgency) {
      const analysis = urgencyDetector.analyze(fullNotification);
      fullNotification.urgency = analysis.score;
      if (!fullNotification.priority) {
        fullNotification.priority = analysis.suggestedPriority;
      }
      console.log('🔔 [SmartNotify] Urgency analysis:', analysis);
    }

    // Check if should batch
    if (config.value.enableBatching && batchingSystem.shouldBatch(fullNotification)) {
      console.log('🔔 [SmartNotify] Batching notification');
      fullNotification.status = 'batched';
      const deliveredBatch = batchingSystem.addToBatch(fullNotification);

      if (deliveredBatch) {
        // Batch is full, deliver now
        console.log('🔔 [SmartNotify] Batch full, delivering batch');
        deliverBatch(deliveredBatch);
      } else {
        // Added to batch, will be delivered later
        console.log('🔔 [SmartNotify] Added to batch, will deliver later');
        batches.value = batchingSystem.getPendingBatches();
      }
    } else {
      // Determine optimal timing
      if (config.value.enableOptimalTiming && config.value.enableAttentionDetection) {
        const attention = attentionMonitor.getCurrentState();
        const shouldDelay = attentionMonitor.shouldDelay(fullNotification, attention);
        console.log('🔔 [SmartNotify] Attention state:', attention.state, 'Should delay:', shouldDelay);

        if (shouldDelay) {
          const timing = timingPredictor.predict(fullNotification, attention);
          fullNotification.scheduledTime = timing.recommendedTime;
          fullNotification.status = 'scheduled';
          console.log('🔔 [SmartNotify] Scheduling notification for later');
          scheduleNotification(fullNotification);
        } else {
          console.log('🔔 [SmartNotify] Delivering notification immediately');
          deliverNotification(fullNotification);
        }
      } else {
        console.log('🔔 [SmartNotify] Delivering notification (no timing check)');
        deliverNotification(fullNotification);
      }
    }

    notifications.value.push(fullNotification);
    console.log('🔔 [SmartNotify] Notification added. Total:', notifications.value.length, 'Status:', fullNotification.status);
    emitEvent('created', fullNotification);

    // Check for grouping
    if (config.value.enableGrouping) {
      checkForGrouping(fullNotification);
    }

    // Persist if enabled
    if (config.value.persistNotifications) {
      storage.saveNotifications(notifications.value);
    }

    // Cleanup old notifications
    cleanupOldNotifications();

    return fullNotification;
  };

  const deliverNotification = (notification: Notification): void => {
    notification.status = 'delivered';
    emitEvent('delivered', notification);

    // Show browser notification if supported
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon,
        tag: notification.id
      });
    }

    // Play sound if enabled
    if (config.value.soundEnabled && notification.sound) {
      playSound(notification.sound);
    }

    // Vibrate if enabled
    if (config.value.vibrationEnabled && notification.vibrate && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  const deliverBatch = (batch: NotificationBatch): void => {
    batch.notifications.forEach(n => {
      n.status = 'delivered';
      emitEvent('delivered', n);
    });

    // Create a group from the batch
    if (config.value.enableGrouping) {
      const group = groupingEngine.createGroup(batch.notifications);
      groups.value.push(group);
    }
  };

  const scheduleNotification = (notification: Notification): void => {
    if (typeof window === 'undefined') return;

    const delay = (notification.scheduledTime || Date.now()) - Date.now();

    setTimeout(() => {
      if (notification.status === 'scheduled') {
        deliverNotification(notification);
      }
    }, Math.max(0, delay));

    emitEvent('scheduled', notification);
  };

  const checkForGrouping = (notification: Notification): void => {
    const related = groupingEngine.findRelated(notification, notifications.value);

    if (related.length > 0) {
      // Find existing group or create new one
      const existingGroup = groups.value.find(g =>
        g.notifications.some(n => related.includes(n))
      );

      if (existingGroup) {
        existingGroup.notifications.push(notification);
        existingGroup.updatedAt = Date.now();
        notification.groupId = existingGroup.id;
      } else if (related.length >= 2) {
        const group = groupingEngine.createGroup([notification, ...related]);
        groups.value.push(group);
        [notification, ...related].forEach(n => n.groupId = group.id);
        emitEvent('grouped', notification);
      }
    }
  };

  const markAsRead = (notificationId: string): void => {
    const notification = notifications.value.find(n => n.id === notificationId);
    if (!notification) return;

    notification.status = 'read';
    emitEvent('read', notification);

    // Record interaction for learning
    if (config.value.learningEnabled) {
      timingPredictor.recordInteraction(notification, Date.now(), true);
    }

    if (config.value.persistNotifications) {
      storage.saveNotifications(notifications.value);
    }
  };

  const dismiss = (notificationId: string): void => {
    const notification = notifications.value.find(n => n.id === notificationId);
    if (!notification) return;

    notification.status = 'dismissed';
    emitEvent('dismissed', notification);

    // Record interaction for learning
    if (config.value.learningEnabled) {
      timingPredictor.recordInteraction(notification, Date.now(), false);
    }

    if (config.value.persistNotifications) {
      storage.saveNotifications(notifications.value);
    }
  };

  const dismissAll = (): void => {
    notifications.value.forEach(n => {
      if (n.status === 'delivered') {
        n.status = 'dismissed';
      }
    });

    if (config.value.persistNotifications) {
      storage.saveNotifications(notifications.value);
    }
  };

  const remove = (notificationId: string): void => {
    const index = notifications.value.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications.value.splice(index, 1);

      if (config.value.persistNotifications) {
        storage.saveNotifications(notifications.value);
      }
    }
  };

  const clearAll = (): void => {
    notifications.value = [];
    groups.value = [];
    batches.value = [];
    batchingSystem.clearAllBatches();

    if (config.value.persistNotifications) {
      storage.saveNotifications([]);
    }
  };

  const toggleGroup = (groupId: string): void => {
    const groupIndex = groups.value.findIndex((g: NotificationGroup) => g.id === groupId);
    if (groupIndex !== -1) {
      const updatedGroups = [...groups.value];
      updatedGroups[groupIndex] = {
        ...updatedGroups[groupIndex],
        collapsed: !updatedGroups[groupIndex].collapsed
      };
      groups.value = updatedGroups;
      console.log('🔔 [SmartNotify] Toggled group:', groupId, 'Collapsed:', updatedGroups[groupIndex].collapsed);
    }
  };

  const setDoNotDisturb = (enabled: boolean, until?: number): void => {
    attentionMonitor.setDoNotDisturb(enabled, until);
  };

  const getStats = (): NotificationStats => {
    const total = notifications.value.length;
    const delivered = notifications.value.filter(n => n.status === 'delivered').length;
    const read = notifications.value.filter(n => n.status === 'read').length;
    const dismissed = notifications.value.filter(n => n.status === 'dismissed').length;
    const batched = notifications.value.filter(n => n.status === 'batched').length;

    const readNotifications = notifications.value.filter(n => n.status === 'read');
    const averageReadTime = readNotifications.length > 0
      ? readNotifications.reduce((sum, n) => sum + (n.timestamp || 0), 0) / readNotifications.length
      : 0;

    const interactionRate = total > 0 ? read / total : 0;
    const dismissalRate = total > 0 ? dismissed / total : 0;

    const timingStats = timingPredictor.getStats();
    const optimalHours = timingStats.bestHours;

    const categoryCount = new Map<string, number>();
    notifications.value.forEach(n => {
      categoryCount.set(n.category, (categoryCount.get(n.category) || 0) + 1);
    });
    const topCategories = Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category: category as any, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      total,
      delivered,
      read,
      dismissed,
      batched,
      averageReadTime,
      interactionRate,
      dismissalRate,
      optimalHours,
      topCategories
    };
  };

  const exportData = (): string => {
    return storage.exportData();
  };

  const importData = (data: string): void => {
    storage.importData(data);
    notifications.value = storage.loadNotifications();
  };

  const emitEvent = (type: NotificationEvent['type'], notification: Notification): void => {
    const event: NotificationEvent = {
      type,
      notification,
      timestamp: Date.now()
    };
    events.value.push(event);

    // Keep only last 100 events
    if (events.value.length > 100) {
      events.value = events.value.slice(-100);
    }
  };

  const playSound = (soundUrl: string): void => {
    if (typeof Audio !== 'undefined') {
      const audio = new Audio(soundUrl);
      audio.play().catch(err => console.error('Failed to play sound:', err));
    }
  };

  const cleanupOldNotifications = (): void => {
    if (!config.value.autoExpire) return;

    const now = Date.now();
    notifications.value = notifications.value.filter(n => {
      if (n.expiresAt && n.expiresAt < now) return false;
      if (n.status === 'dismissed' && (now - n.timestamp) > config.value.expirationTime) return false;
      return true;
    });

    // Limit total notifications
    if (notifications.value.length > config.value.maxNotifications) {
      notifications.value = notifications.value.slice(-config.value.maxNotifications);
    }
  };

  // Lifecycle - only initialize once
  onMounted(() => {
    if (!sharedState!.isInitialized) {
      sharedState!.isInitialized = true;

      // Load persisted data
      if (config.value.persistNotifications) {
        const loaded = storage.loadNotifications();
        if (loaded.length > 0) {
          notifications.value = loaded;
        }

        const loadedConfig = storage.loadConfig();
        if (loadedConfig) {
          config.value = { ...config.value, ...loadedConfig };
        }
      }

      // Start attention monitoring
      if (config.value.enableAttentionDetection) {
        attentionMonitor.startMonitoring();
      }

      // Request notification permission
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  });

  onUnmounted(() => {
    // Note: We don't stop monitoring on unmount since state is shared
    // Only stop if this is the last component using the composable
    // For now, we'll keep it running
    // attentionMonitor.stopMonitoring();
    // batchingSystem.clearAllBatches();
  });

  return {
    // State
    notifications: readonly(notifications),
    groups: readonly(groups),
    batches: readonly(batches),
    events: readonly(events),
    config: readonly(config),
    userAttention: readonly(userAttention),

    // Computed
    unreadCount,
    criticalNotifications,

    // Methods
    notify,
    markAsRead,
    dismiss,
    dismissAll,
    remove,
    clearAll,
    toggleGroup,
    setDoNotDisturb,
    getStats,
    exportData,
    importData
  };
}

