<template>
  <div class="smart-notify-demo">
    <div class="demo-header">
      <h2>🔔 Smart Notification Manager</h2>
      <p>AI-powered notification system with intelligent timing, grouping, and attention detection</p>
    </div>

    <!-- Notification Center -->
    <NotificationCenter :show-stats="true" />

    <!-- Demo Controls -->
    <div class="demo-grid">
      <!-- Send Notifications -->
      <div class="demo-card">
        <h3>📤 Send Notifications</h3>
        <div class="form-group">
          <label>Title</label>
          <input v-model="newNotif.title" type="text" placeholder="Notification title" />
        </div>
        <div class="form-group">
          <label>Message</label>
          <textarea v-model="newNotif.message" placeholder="Notification message" rows="3"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select v-model="newNotif.category">
              <option value="message">💬 Message</option>
              <option value="alert">⚠️ Alert</option>
              <option value="reminder">⏰ Reminder</option>
              <option value="update">🔄 Update</option>
              <option value="social">👥 Social</option>
              <option value="system">⚙️ System</option>
            </select>
          </div>
          <div class="form-group">
            <label>Priority</label>
            <select v-model="newNotif.priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <button @click="sendNotification" class="btn-primary">Send Notification</button>
        <button @click="sendBulkNotifications" class="btn-secondary">Send 5 Random</button>
      </div>

      <!-- Quick Actions -->
      <div class="demo-card">
        <h3>⚡ Quick Actions</h3>
        <div class="quick-actions">
          <button @click="sendCritical" class="btn-danger">🚨 Critical Alert</button>
          <button @click="sendMessage" class="btn-info">💬 New Message</button>
          <button @click="sendReminder" class="btn-warning">⏰ Reminder</button>
          <button @click="sendUpdate" class="btn-success">🔄 Update</button>
          <button @click="toggleDND" :class="{ active: isDND }" class="btn-dnd">
            🌙 {{ isDND ? 'Disable DND' : 'Enable DND' }}
          </button>
          <button @click="clearAllNotifications" class="btn-danger">🗑️ Clear All</button>
        </div>
      </div>

      <!-- User Attention State -->
      <div class="demo-card">
        <h3>👁️ Attention Monitoring</h3>
        <div class="attention-display">
          <div class="attention-state" :class="`state-${userAttention?.state}`">
            <span class="state-icon">{{ getStateIcon(userAttention?.state) }}</span>
            <span class="state-label">{{ getStateText(userAttention?.state) }}</span>
          </div>
          <div class="attention-metrics">
            <div class="metric">
              <span class="metric-label">Idle Time:</span>
              <span class="metric-value">{{ formatDuration(userAttention?.idleTime || 0) }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Focus Duration:</span>
              <span class="metric-value">{{ formatDuration(userAttention?.focusDuration || 0) }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Is Typing:</span>
              <span class="metric-value">{{ userAttention?.isTyping ? 'Yes' : 'No' }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Page Visible:</span>
              <span class="metric-value">{{ userAttention?.isPageVisible ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="demo-card">
        <h3>📊 Statistics</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.delivered }}</div>
            <div class="stat-label">Delivered</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.read }}</div>
            <div class="stat-label">Read</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.dismissed }}</div>
            <div class="stat-label">Dismissed</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ (stats.interactionRate * 100).toFixed(0) }}%</div>
            <div class="stat-label">Read Rate</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ (stats.dismissalRate * 100).toFixed(0) }}%</div>
            <div class="stat-label">Dismiss Rate</div>
          </div>
        </div>
        <div class="optimal-hours">
          <strong>Optimal Hours:</strong> {{ stats.optimalHours.join(', ') || 'Learning...' }}
        </div>
      </div>

      <!-- AI Models Info -->
      <div class="demo-card">
        <h3>🧠 AI Models</h3>
        <div class="ai-info">
          <div class="ai-feature">
            <span class="feature-icon">🎯</span>
            <div class="feature-content">
              <strong>Urgency Detection</strong>
              <p>Analyzes keywords, sentiment, and context to determine notification urgency</p>
            </div>
          </div>
          <div class="ai-feature">
            <span class="feature-icon">⏰</span>
            <div class="feature-content">
              <strong>Timing Prediction</strong>
              <p>Learns optimal delivery times based on your interaction patterns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NotificationCenter, useSmartNotify } from '@aivue/smart-notify';
import '../assets/smart-notify.css';

const {
  userAttention,
  setDoNotDisturb,
  notify,
  clearAll,
  getStats,
  exportData,
  importData: importDataFn
} = useSmartNotify();

const newNotif = ref({
  title: 'New Notification',
  message: 'This is a test notification',
  category: 'message' as any,
  priority: 'medium' as any
});

const isDND = ref(false);

const stats = computed(() => getStats());

const sendNotification = async () => {
  console.log('🧪 [Demo] Send Notification clicked', newNotif.value);
  try {
    const result = await notify({
      title: newNotif.value.title,
      message: newNotif.value.message,
      category: newNotif.value.category,
      priority: newNotif.value.priority
    });
    console.log('🧪 [Demo] Notification sent, result:', result);
  } catch (error) {
    console.error('🧪 [Demo] Error sending notification:', error);
  }
};

const sendCritical = async () => {
  await notify({
    title: 'Critical Alert',
    message: 'URGENT: System requires immediate attention! Please check the server status.',
    category: 'alert',
    priority: 'critical'
  });
};

const sendMessage = async () => {
  await notify({
    title: 'New Message from John',
    message: 'Hey! Are you available for a quick call?',
    category: 'message',
    priority: 'high'
  });
};

const sendReminder = async () => {
  await notify({
    title: 'Meeting Reminder',
    message: 'Team standup in 15 minutes',
    category: 'reminder',
    priority: 'medium'
  });
};

const sendUpdate = async () => {
  await notify({
    title: 'System Update',
    message: 'New version 2.0 is now available',
    category: 'update',
    priority: 'low'
  });
};

const sendBulkNotifications = async () => {
  const templates = [
    { title: 'New Comment', message: 'Sarah commented on your post', category: 'social', priority: 'low' },
    { title: 'Task Completed', message: 'Build process finished successfully', category: 'system', priority: 'medium' },
    { title: 'New Follower', message: 'Mike started following you', category: 'social', priority: 'low' },
    { title: 'Payment Received', message: 'You received $50 from Alice', category: 'alert', priority: 'high' },
    { title: 'Backup Complete', message: 'Daily backup completed at 3:00 AM', category: 'system', priority: 'low' }
  ];

  for (const template of templates) {
    await notify(template as any);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

const toggleDND = () => {
  isDND.value = !isDND.value;
  if (isDND.value) {
    const until = Date.now() + (60 * 60 * 1000); // 1 hour
    setDoNotDisturb(true, until);
  } else {
    setDoNotDisturb(false);
  }
};

const clearAllNotifications = () => {
  if (confirm('Are you sure you want to clear all notifications?')) {
    clearAll();
  }
};

const getStateIcon = (state?: string): string => {
  const icons: Record<string, string> = {
    focused: '🎯',
    active: '✅',
    idle: '💤',
    away: '🚶',
    'do-not-disturb': '🌙'
  };
  return icons[state || ''] || '❓';
};

const getStateText = (state?: string): string => {
  const texts: Record<string, string> = {
    focused: 'Focused',
    active: 'Active',
    idle: 'Idle',
    away: 'Away',
    'do-not-disturb': 'Do Not Disturb'
  };
  return texts[state || ''] || 'Unknown';
};

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};


</script>

<style scoped>
.smart-notify-demo {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h2 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #333;
}

.demo-header p {
  font-size: 16px;
  color: #666;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.demo-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-card h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn-primary,
.btn-secondary,
.btn-danger,
.btn-info,
.btn-warning,
.btn-success,
.btn-dnd {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 8px;
  margin-bottom: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #333;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-dnd {
  background: #6c757d;
  color: white;
}

.btn-dnd.active {
  background: #667eea;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.attention-display {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.attention-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
}

.state-focused { background: #fff3cd; }
.state-active { background: #d4edda; }
.state-idle { background: #e2e3e5; }
.state-away { background: #f8d7da; }
.state-do-not-disturb { background: #d1ecf1; }

.state-icon {
  font-size: 32px;
}

.attention-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.metric {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.metric-label {
  color: #666;
  font-size: 14px;
}

.metric-value {
  font-weight: 600;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.optimal-hours {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.ai-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-feature {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.feature-icon {
  font-size: 32px;
}

.feature-content strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.feature-content p {
  margin: 0;
  font-size: 13px;
  color: #666;
}
</style>



