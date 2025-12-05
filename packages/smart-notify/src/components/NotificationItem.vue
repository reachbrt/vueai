<template>
  <div class="notification-item" :class="[`priority-${notification.priority}`, `status-${notification.status}`]">
    <div class="notif-icon">{{ getCategoryIcon(notification.category) }}</div>
    <div class="notif-content">
      <div class="notif-header">
        <h4 class="notif-title">{{ notification.title }}</h4>
        <span class="notif-time">{{ formatTime(notification.timestamp) }}</span>
      </div>
      <p class="notif-message">{{ notification.message }}</p>
      <div v-if="notification.actions && notification.actions.length > 0" class="notif-actions">
        <button
          v-for="action in notification.actions"
          :key="action.id"
          @click="handleAction(action)"
          class="action-btn"
          :class="{ primary: action.primary, destructive: action.destructive }"
        >
          {{ action.label }}
        </button>
      </div>
      <div class="notif-meta">
        <span v-if="notification.urgency" class="urgency-badge">
          Urgency: {{ (notification.urgency * 100).toFixed(0) }}%
        </span>
        <span v-if="notification.scheduledTime" class="scheduled-badge">
          ⏰ Scheduled
        </span>
      </div>
    </div>
    <div class="notif-controls">
      <button @click="$emit('read', notification.id)" class="ctrl-btn" title="Mark as read">✓</button>
      <button @click="$emit('dismiss', notification.id)" class="ctrl-btn" title="Dismiss">✕</button>
      <button @click="$emit('remove', notification.id)" class="ctrl-btn" title="Remove">🗑️</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Notification, NotificationCategory } from '../types';

defineProps<{
  notification: Notification;
}>();

const emit = defineEmits<{
  read: [id: string];
  dismiss: [id: string];
  remove: [id: string];
  action: [actionId: string];
}>();

const getCategoryIcon = (category: NotificationCategory): string => {
  const icons = {
    message: '💬',
    alert: '⚠️',
    reminder: '⏰',
    update: '🔄',
    social: '👥',
    system: '⚙️',
    custom: '📌'
  };
  return icons[category] || '📌';
};

const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString();
};

const handleAction = (action: any) => {
  emit('action', action.id);
};
</script>

<style scoped>
.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #ccc;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.notification-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateX(4px);
}

.notification-item.priority-critical {
  border-left-color: #ff4444;
  background: #fff5f5;
}

.notification-item.priority-high {
  border-left-color: #ff9800;
}

.notification-item.priority-medium {
  border-left-color: #2196f3;
}

.notification-item.priority-low {
  border-left-color: #9e9e9e;
}

.notification-item.status-read {
  opacity: 0.6;
}

.notif-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
  min-width: 0;
}

.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.notif-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.notif-time {
  font-size: 11px;
  color: #999;
  white-space: nowrap;
}

.notif-message {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.notif-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.action-btn {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
}

.action-btn.primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.action-btn.primary:hover {
  background: #5568d3;
}

.action-btn.destructive {
  background: #ff4444;
  color: white;
  border-color: #ff4444;
}

.action-btn.destructive:hover {
  background: #cc0000;
}

.notif-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.urgency-badge,
.scheduled-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #e0e0e0;
  color: #666;
}

.urgency-badge {
  background: #fff3cd;
  color: #856404;
}

.scheduled-badge {
  background: #d1ecf1;
  color: #0c5460;
}

.notif-controls {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ctrl-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.ctrl-btn:hover {
  background: #f0f0f0;
}
</style>

