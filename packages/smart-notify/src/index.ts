// Main composable
export { useSmartNotify } from './composables/useSmartNotify';

// AI Models
export { UrgencyDetector } from './ai/urgencyDetector';
export { TimingPredictor } from './ai/timingPredictor';
export { GroupingEngine } from './ai/groupingEngine';
export { AttentionMonitor } from './ai/attentionMonitor';

// Utilities
export { BatchingSystem } from './utils/batchingSystem';
export { storage, NotificationStorage } from './utils/storage';

// Types
export type {
  Notification,
  NotificationPriority,
  NotificationStatus,
  NotificationCategory,
  UserAttentionState,
  NotificationAction,
  NotificationGroup,
  UserAttention,
  OptimalTimingData,
  TimingPrediction,
  UrgencyAnalysis,
  NotificationBatch,
  SmartNotifyConfig,
  NotificationStats,
  AIModel,
  UrgencyDetector as IUrgencyDetector,
  TimingPredictor as ITimingPredictor,
  GroupingEngine as IGroupingEngine,
  AttentionMonitor as IAttentionMonitor,
  NotificationEvent
} from './types';

// Components
export { default as NotificationCenter } from './components/NotificationCenter.vue';
export { default as NotificationItem } from './components/NotificationItem.vue';

