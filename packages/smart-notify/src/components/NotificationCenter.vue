<template>
  <div class="smart-notify-center" :class="{ 'is-open': isOpen }">
    <!-- Toggle Button -->
    <button class="notify-toggle" @click="toggleCenter" :class="`priority-${highestPriority}`">
      <span class="icon">🔔</span>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>

    <!-- Notification Panel -->
    <transition name="slide-fade">
      <div v-if="isOpen" class="notify-panel">
        <!-- Header -->
        <div class="notify-header">
          <h3>Notifications</h3>
          <div class="header-actions">
            <button @click="$emit('settings')" class="btn-icon" title="Settings">⚙️</button>
            <button @click="dismissAll" class="btn-icon" title="Dismiss All">✓</button>
            <button @click="clearAll" class="btn-icon" title="Clear All">🗑️</button>
          </div>
        </div>

        <!-- Attention State -->
        <div v-if="userAttention" class="attention-state" :class="`state-${userAttention.state}`">
          <span class="state-icon">{{ getStateIcon(userAttention.state) }}</span>
          <span class="state-text">{{ getStateText(userAttention.state) }}</span>
          <button v-if="!userAttention.doNotDisturb" @click="enableDND" class="btn-dnd">🌙 DND</button>
          <button v-else @click="disableDND" class="btn-dnd active">🌙 DND On</button>
        </div>

        <!-- Notifications List -->
        <div class="notify-list">
          <!-- Critical Notifications -->
          <div v-if="criticalNotifications.length > 0" class="notify-section critical">
            <h4>🚨 Critical</h4>
            <notification-item
              v-for="notif in criticalNotifications"
              :key="notif.id"
              :notification="notif"
              @read="markAsRead"
              @dismiss="dismiss"
              @remove="remove"
            />
          </div>

          <!-- Groups -->
          <div v-for="group in groups" :key="group.id" class="notify-group">
            <div class="group-header" @click="toggleGroup(group.id)">
              <span class="group-icon">📁</span>
              <span class="group-title">{{ group.title }}</span>
              <span class="group-count">{{ group.notifications.length }}</span>
              <span class="group-toggle">{{ group.collapsed ? '▼' : '▲' }}</span>
            </div>
            <transition name="expand">
              <div v-if="!group.collapsed" class="group-content">
                <notification-item
                  v-for="notif in group.notifications"
                  :key="notif.id"
                  :notification="notif"
                  @read="markAsRead"
                  @dismiss="dismiss"
                  @remove="remove"
                />
              </div>
            </transition>
          </div>

          <!-- Regular Notifications -->
          <div v-if="regularNotifications.length > 0" class="notify-section">
            <notification-item
              v-for="notif in regularNotifications"
              :key="notif.id"
              :notification="notif"
              @read="markAsRead"
              @dismiss="dismiss"
              @remove="remove"
            />
          </div>

          <!-- Empty State -->
          <div v-if="notifications.length === 0" class="empty-state">
            <span class="empty-icon">🔕</span>
            <p>No notifications</p>
          </div>
        </div>

        <!-- Stats Footer -->
        <div v-if="showStats" class="notify-footer">
          <div class="stat">
            <span class="stat-label">Total:</span>
            <span class="stat-value">{{ stats.total }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Read Rate:</span>
            <span class="stat-value">{{ (stats.interactionRate * 100).toFixed(0) }}%</span>
          </div>
          <div class="stat">
            <span class="stat-label">Optimal Hours:</span>
            <span class="stat-value">{{ stats.optimalHours.join(', ') }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSmartNotify } from '../composables/useSmartNotify';
import type { UserAttentionState } from '../types';
import NotificationItem from './NotificationItem.vue';

withDefaults(defineProps<{
  showStats?: boolean;
}>(), {
  showStats: false
});

defineEmits<{
  settings: [];
}>();

const isOpen = ref(false);

const {
  notifications,
  groups,
  unreadCount,
  criticalNotifications,
  userAttention,
  markAsRead,
  dismiss,
  dismissAll,
  remove,
  clearAll,
  toggleGroup,
  setDoNotDisturb,
  getStats
} = useSmartNotify();

const stats = computed(() => getStats());

const regularNotifications = computed(() =>
  notifications.value.filter(n =>
    n.priority !== 'critical' &&
    n.status === 'delivered' &&
    !n.groupId
  )
);

const highestPriority = computed(() => {
  if (criticalNotifications.value.length > 0) return 'critical';
  const priorities = notifications.value.map(n => n.priority || 'low');
  if (priorities.includes('high')) return 'high';
  if (priorities.includes('medium')) return 'medium';
  return 'low';
});

const toggleCenter = () => {
  isOpen.value = !isOpen.value;
};

const enableDND = () => {
  const until = Date.now() + (60 * 60 * 1000); // 1 hour
  setDoNotDisturb(true, until);
};

const disableDND = () => {
  setDoNotDisturb(false);
};

const getStateIcon = (state: UserAttentionState): string => {
  const icons = {
    focused: '🎯',
    active: '✅',
    idle: '💤',
    away: '🚶',
    'do-not-disturb': '🌙'
  };
  return icons[state] || '❓';
};

const getStateText = (state: UserAttentionState): string => {
  const texts = {
    focused: 'Focused',
    active: 'Active',
    idle: 'Idle',
    away: 'Away',
    'do-not-disturb': 'Do Not Disturb'
  };
  return texts[state] || state;
};
</script>

<style scoped>
.smart-notify-center {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.notify-toggle {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.notify-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.notify-toggle.priority-critical {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
}

.notify-panel {
  position: absolute;
  top: 70px;
  right: 0;
  width: 400px;
  max-height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.notify-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notify-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
}

.attention-state {
  padding: 12px 20px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.state-focused { background: #fff3cd; }
.state-active { background: #d4edda; }
.state-idle { background: #e2e3e5; }
.state-away { background: #f8d7da; }

.btn-dnd {
  margin-left: auto;
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  font-size: 12px;
}

.btn-dnd.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.notify-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.notify-section {
  margin-bottom: 16px;
}

.notify-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
}

.notify-section.critical h4 {
  color: #ff4444;
}

.notify-group {
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.group-header {
  padding: 12px;
  background: #f5f5f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.group-header:hover {
  background: #e0e0e0;
}

.group-count {
  margin-left: auto;
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.group-content {
  padding: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.notify-footer {
  padding: 12px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 16px;
  font-size: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: #666;
}

.stat-value {
  font-weight: bold;
  color: #333;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s;
}

.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.expand-enter-active {
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.expand-leave-active {
  transition: all 0.3s ease-in;
  overflow: hidden;
}

.expand-enter-from {
  max-height: 0;
  opacity: 0;
  transform: scaleY(0);
  transform-origin: top;
}

.expand-enter-to {
  max-height: 1000px;
  opacity: 1;
  transform: scaleY(1);
}

.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
  transform: scaleY(1);
}

.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: scaleY(0);
  transform-origin: top;
}
</style>

