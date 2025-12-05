export type NotificationPriority = 'critical' | 'high' | 'medium' | 'low';
export type NotificationStatus = 'pending' | 'scheduled' | 'delivered' | 'read' | 'dismissed' | 'batched';
export type NotificationCategory = 'message' | 'alert' | 'reminder' | 'update' | 'social' | 'system' | 'custom';
export type UserAttentionState = 'focused' | 'idle' | 'away' | 'active' | 'do-not-disturb';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority?: NotificationPriority;
  urgency?: number; // 0-1 score from AI
  timestamp: number;
  scheduledTime?: number;
  expiresAt?: number;
  status: NotificationStatus;
  metadata?: Record<string, any>;
  actions?: NotificationAction[];
  groupId?: string;
  tags?: string[];
  source?: string;
  icon?: string;
  image?: string;
  sound?: string;
  vibrate?: boolean;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  primary?: boolean;
  destructive?: boolean;
}

export interface NotificationGroup {
  id: string;
  title: string;
  notifications: Notification[];
  category: NotificationCategory;
  priority: NotificationPriority;
  createdAt: number;
  updatedAt: number;
  collapsed: boolean;
}

export interface UserAttention {
  state: UserAttentionState;
  lastActivity: number;
  focusStartTime?: number;
  idleTime: number;
  isPageVisible: boolean;
  isUserTyping: boolean;
  mouseActivity: boolean;
  doNotDisturb: boolean;
  doNotDisturbUntil?: number;
}

export interface OptimalTimingData {
  hourOfDay: number;
  dayOfWeek: number;
  interactionRate: number; // 0-1
  dismissalRate: number; // 0-1
  readTime: number; // milliseconds
  sampleCount: number;
}

export interface TimingPrediction {
  recommendedTime: number;
  confidence: number; // 0-1
  reason: string;
  alternativeTimes?: number[];
}

export interface UrgencyAnalysis {
  score: number; // 0-1
  confidence: number; // 0-1
  factors: {
    keywords: string[];
    sentiment: number;
    timeRelevance: number;
    contextualImportance: number;
  };
  suggestedPriority: NotificationPriority;
}

export interface NotificationBatch {
  id: string;
  notifications: Notification[];
  scheduledTime: number;
  category?: NotificationCategory;
  priority: NotificationPriority;
  reason: string;
}

export interface SmartNotifyConfig {
  enableAI: boolean;
  enableGrouping: boolean;
  enableBatching: boolean;
  enableAttentionDetection: boolean;
  enableOptimalTiming: boolean;
  batchInterval: number; // milliseconds
  maxBatchSize: number;
  attentionCheckInterval: number; // milliseconds
  idleThreshold: number; // milliseconds
  learningEnabled: boolean;
  respectDoNotDisturb: boolean;
  defaultPriority: NotificationPriority;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  persistNotifications: boolean;
  maxNotifications: number;
  autoExpire: boolean;
  expirationTime: number; // milliseconds
}

export interface NotificationStats {
  total: number;
  delivered: number;
  read: number;
  dismissed: number;
  batched: number;
  averageReadTime: number;
  interactionRate: number;
  dismissalRate: number;
  optimalHours: number[];
  topCategories: { category: NotificationCategory; count: number }[];
}

export interface AIModel {
  urgencyDetector: UrgencyDetector;
  timingPredictor: TimingPredictor;
  groupingEngine: GroupingEngine;
  attentionMonitor: AttentionMonitor;
}

export interface UrgencyDetector {
  analyze(notification: Notification): UrgencyAnalysis;
  train(notification: Notification, actualUrgency: number): void;
  getModel(): any;
}

export interface TimingPredictor {
  predict(notification: Notification, userAttention: UserAttention): TimingPrediction;
  recordInteraction(notification: Notification, interactionTime: number, wasRead: boolean): void;
  getOptimalTimes(): OptimalTimingData[];
}

export interface GroupingEngine {
  findRelated(notification: Notification, existingNotifications: Notification[]): Notification[];
  createGroup(notifications: Notification[]): NotificationGroup;
  shouldGroup(n1: Notification, n2: Notification): boolean;
  calculateSimilarity(n1: Notification, n2: Notification): number;
}

export interface AttentionMonitor {
  getCurrentState(): UserAttention;
  shouldDelay(notification: Notification, attention: UserAttention): boolean;
  startMonitoring(): void;
  stopMonitoring(): void;
}

export interface NotificationEvent {
  type: 'created' | 'delivered' | 'read' | 'dismissed' | 'batched' | 'grouped' | 'scheduled';
  notification: Notification;
  timestamp: number;
  metadata?: Record<string, any>;
}

