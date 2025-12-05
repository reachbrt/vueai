<template>
  <div class="emotion-ui-demo">
    <!-- Hero Section -->
    <div class="hero-section">
      <h1 class="hero-title">🎭 Emotion-Aware UI Components</h1>
      <p class="hero-description">
        UI components that adapt based on user sentiment detected from text, voice, and interaction patterns
      </p>
    </div>

    <!-- Current Emotion Display -->
    <div class="emotion-display">
      <div class="emotion-card">
        <div class="emotion-icon">{{ currentEmotionIcon }}</div>
        <div class="emotion-info">
          <div class="emotion-label">Current Emotion</div>
          <div class="emotion-value">{{ currentEmotion }}</div>
          <div class="emotion-confidence">Confidence: {{ (emotionConfidence * 100).toFixed(0) }}%</div>
        </div>
      </div>
    </div>

    <!-- Demo Controls -->
    <div class="demo-section">
      <h2>📝 Try Emotion-Aware Input</h2>
      <p class="section-description">Type different messages to see how the UI adapts to your sentiment</p>
      
      <div class="demo-grid">
        <div class="demo-card">
          <EmotionAwareInput
            v-model="userInput"
            label="Your Message"
            placeholder="Type something..."
            :validation-message="inputError"
            :validation-state="inputError ? 'error' : undefined"
            help-text="Try typing frustrated, happy, or confused messages"
            @emotion-detected="handleEmotionDetected"
          />

          <div class="suggestion-chips">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="chip"
              @click="userInput = suggestion"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <div class="demo-card">
          <h3>Detected Emotions</h3>
          <div class="emotion-history">
            <div
              v-for="(emotion, index) in emotionHistory"
              :key="index"
              class="emotion-item"
              :class="`emotion-${emotion.type}`"
            >
              <span class="emotion-icon-small">{{ getEmotionIcon(emotion.type) }}</span>
              <span class="emotion-text">{{ emotion.text }}</span>
              <span class="emotion-time">{{ emotion.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Button Demo -->
    <div class="demo-section">
      <h2>🔘 Emotion-Aware Buttons</h2>
      <p class="section-description">Buttons that adapt their text and appearance based on your emotional state</p>
      
      <div class="button-grid">
        <EmotionAwareButton
          text="Submit Form"
          variant="primary"
          encouraging-text="Great! Submit Now 🎉"
          calming-text="Take Your Time, Submit When Ready 💪"
          :show-emotion-icon="true"
          @click="handleButtonClick('submit')"
        />

        <EmotionAwareButton
          text="Continue"
          variant="secondary"
          encouraging-text="You're Doing Great! Continue"
          calming-text="No Rush, Continue When Ready"
          @click="handleButtonClick('continue')"
        />

        <EmotionAwareButton
          text="Save Changes"
          variant="success"
          encouraging-text="Perfect! Save Now"
          calming-text="Almost There, Save When Ready"
          @click="handleButtonClick('save')"
        />
      </div>
    </div>

    <!-- Notifications Demo -->
    <div class="demo-section">
      <h2>🔔 Emotion-Aware Notifications</h2>
      <p class="section-description">Notifications that adjust their tone based on your current emotional state</p>
      
      <div class="notification-controls">
        <button class="control-button" @click="showNotification('success')">Show Success</button>
        <button class="control-button" @click="showNotification('error')">Show Error</button>
        <button class="control-button" @click="showNotification('warning')">Show Warning</button>
        <button class="control-button" @click="showNotification('info')">Show Info</button>
      </div>

      <div class="notification-container">
        <EmotionAwareNotification
          v-for="notification in notifications"
          :key="notification.id"
          :title="notification.title"
          :message="notification.message"
          :type="notification.type"
          :duration="5000"
          @close="removeNotification(notification.id)"
        />
      </div>
    </div>

    <!-- Features Grid -->
    <div class="demo-section">
      <h2>✨ Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📝</div>
          <h3>Text Sentiment</h3>
          <p>Analyzes text input to detect emotions like frustration, confusion, or excitement</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⌨️</div>
          <h3>Typing Patterns</h3>
          <p>Tracks typing speed, corrections, and pauses to understand user state</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>Adaptive UI</h3>
          <p>Components automatically adjust styling and messages based on emotion</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3>Privacy First</h3>
          <p>All emotion detection happens locally in your browser</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">💡</div>
          <h3>Smart Help</h3>
          <p>Automatically offers assistance when frustration is detected</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Emotion Tracking</h3>
          <p>Track emotional journey and identify friction points</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { EmotionAwareInput, EmotionAwareButton, EmotionAwareNotification, useEmotionStore } from '@aivue/emotion-ui';

const emotionStore = useEmotionStore();

const userInput = ref('');
const inputError = ref('');

const currentEmotion = computed(() => emotionStore.currentEmotion.value.primary);
const emotionConfidence = computed(() => emotionStore.currentEmotion.value.confidence);

const currentEmotionIcon = computed(() => {
  const icons: Record<string, string> = {
    positive: '😊',
    negative: '😔',
    frustrated: '😤',
    excited: '🎉',
    confused: '🤔',
    neutral: '😐'
  };
  return icons[currentEmotion.value] || '😐';
});

const suggestions = [
  'This is amazing!',
  'I\'m so frustrated with this',
  'I don\'t understand how this works',
  'This is confusing',
  'Wow, this is great!',
  'Ugh, not working again'
];

interface EmotionHistoryItem {
  type: string;
  text: string;
  time: string;
}

const emotionHistory = ref<EmotionHistoryItem[]>([]);

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const notifications = ref<Notification[]>([]);
let notificationId = 0;

const handleEmotionDetected = (emotion: string) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString();

  emotionHistory.value.unshift({
    type: emotion,
    text: userInput.value.substring(0, 50) + (userInput.value.length > 50 ? '...' : ''),
    time: timeStr
  });

  // Keep only last 10 items
  if (emotionHistory.value.length > 10) {
    emotionHistory.value.pop();
  }
};

const handleButtonClick = (action: string) => {
  showNotification('success', `${action} clicked!`, `You clicked the ${action} button`);
};

const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title?: string, message?: string) => {
  const titles = {
    success: title || 'Success!',
    error: title || 'Error Occurred',
    warning: title || 'Warning',
    info: title || 'Information'
  };

  const messages = {
    success: message || 'Operation completed successfully',
    error: message || 'Something went wrong. Please try again.',
    warning: message || 'Please review your input',
    info: message || 'Here\'s some helpful information'
  };

  const notification: Notification = {
    id: notificationId++,
    title: titles[type],
    message: messages[type],
    type
  };

  notifications.value.push(notification);
};

const removeNotification = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

const getEmotionIcon = (emotion: string) => {
  const icons: Record<string, string> = {
    positive: '😊',
    negative: '😔',
    frustrated: '😤',
    excited: '🎉',
    confused: '🤔',
    neutral: '😐'
  };
  return icons[emotion] || '😐';
};
</script>

<style scoped>
.emotion-ui-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.emotion-display {
  margin-bottom: 3rem;
}

.emotion-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.emotion-icon {
  font-size: 4rem;
}

.emotion-info {
  flex: 1;
}

.emotion-label {
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 0.25rem;
}

.emotion-value {
  font-size: 2rem;
  font-weight: 700;
  text-transform: capitalize;
  margin-bottom: 0.25rem;
}

.emotion-confidence {
  font-size: 1rem;
  opacity: 0.9;
}

.demo-section {
  margin-bottom: 3rem;
}

.demo-section h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.section-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.demo-card {
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.demo-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.chip {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.chip:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.emotion-history {
  max-height: 300px;
  overflow-y: auto;
}

.emotion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border-left: 3px solid #d1d5db;
}

.emotion-item.emotion-positive {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.emotion-item.emotion-frustrated {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.emotion-item.emotion-confused {
  border-left-color: #8b5cf6;
  background: #faf5ff;
}

.emotion-item.emotion-excited {
  border-left-color: #ec4899;
  background: #fdf2f8;
}

.emotion-icon-small {
  font-size: 1.25rem;
}

.emotion-text {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
}

.emotion-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.button-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.notification-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.control-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.control-button:hover {
  background: #2563eb;
}

.notification-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  max-width: 400px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.feature-card p {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

@media (prefers-color-scheme: dark) {
  .hero-description,
  .section-description {
    color: #d1d5db;
  }

  .demo-section h2,
  .demo-card h3,
  .feature-card h3 {
    color: #f3f4f6;
  }

  .demo-card,
  .feature-card {
    background: #1f2937;
  }

  .chip {
    background: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }

  .chip:hover {
    background: #4b5563;
  }
}
</style>

