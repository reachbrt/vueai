<template>
  <transition name="notification">
    <div
      v-if="visible"
      class="emotion-aware-notification"
      :class="[`type-${type}`, `emotion-${currentEmotion}`]"
      role="alert"
    >
      <div class="notification-icon">{{ icon }}</div>
      <div class="notification-content">
        <div class="notification-title">{{ adaptiveTitle }}</div>
        <div v-if="message" class="notification-message">{{ adaptiveMessage }}</div>
      </div>
      <button class="notification-close" @click="close">×</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEmotionStore } from '../composables/useEmotionStore';

export interface EmotionAwareNotificationProps {
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  adaptToEmotion?: boolean;
}

const props = withDefaults(defineProps<EmotionAwareNotificationProps>(), {
  type: 'info',
  duration: 5000,
  adaptToEmotion: true
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(true);
const emotionStore = useEmotionStore();
const currentEmotion = computed(() => emotionStore.currentEmotion.value.primary);

const adaptiveTitle = computed(() => {
  if (!props.adaptToEmotion) return props.title;

  const emotion = currentEmotion.value;
  if (props.type === 'error' && emotion === 'frustrated') {
    return `We understand this is frustrating. ${props.title}`;
  }
  return props.title;
});

const adaptiveMessage = computed(() => {
  if (!props.message || !props.adaptToEmotion) return props.message;

  const emotion = currentEmotion.value;
  if (props.type === 'error' && emotion === 'frustrated') {
    return `${props.message} Need help? We're here for you.`;
  }
  return props.message;
});

const icon = computed(() => {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  return icons[props.type];
});

const close = () => {
  visible.value = false;
  emit('close');
};

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(close, props.duration);
  }
});
</script>

<style scoped>
.emotion-aware-notification {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  max-width: 400px;
}

.type-info {
  background-color: #dbeafe;
  border-left: 4px solid #3b82f6;
}

.type-success {
  background-color: #d1fae5;
  border-left: 4px solid #10b981;
}

.type-warning {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
}

.type-error {
  background-color: #fee2e2;
  border-left: 4px solid #ef4444;
}

.notification-icon {
  font-size: 1.5rem;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.875rem;
  color: #6b7280;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #9ca3af;
  padding: 0;
  line-height: 1;
}

.notification-close:hover {
  color: #4b5563;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>

