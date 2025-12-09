<template>
  <div
    ref="containerRef"
    :class="['ai-360-spin', containerClass, { 'ai-360-spin--animating': isAnimating, 'ai-360-spin--loading': isLoading }]"
    :style="containerStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Loading State -->
    <div v-if="isLoading && showLoading" class="ai-360-spin__loading">
      <div class="ai-360-spin__spinner"></div>
      <p class="ai-360-spin__loading-text">{{ loadingText }}</p>
    </div>

    <!-- Static Image -->
    <img
      v-show="!isAnimating && !isLoading"
      :src="staticImage"
      :alt="alt"
      :class="['ai-360-spin__image', 'ai-360-spin__image--static', imageClass]"
      @load="handleStaticImageLoad"
      @error="handleImageError"
    />

    <!-- Animated Image (GIF mode) -->
    <img
      v-if="currentMode === 'gif' && !isLoading"
      v-show="isAnimating"
      :src="animatedImageUrl"
      :alt="alt"
      :class="['ai-360-spin__image', 'ai-360-spin__image--animated', imageClass]"
      @load="handleAnimatedImageLoad"
      @error="handleImageError"
    />

    <!-- Frame Sequence Mode -->
    <img
      v-if="currentMode === 'frames' && !isLoading"
      v-show="isAnimating"
      :src="currentFrameUrl"
      :alt="alt"
      :class="['ai-360-spin__image', 'ai-360-spin__image--frame', imageClass]"
    />

    <!-- Hover Hint (optional) -->
    <div v-if="!isAnimating && !isLoading && showHint" class="ai-360-spin__hint">
      <svg class="ai-360-spin__hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
      <span>{{ hintText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Spin360Config } from '../types';
import { use360Spin } from '../composables/use360Spin';

const props = withDefaults(defineProps<Spin360Config>(), {
  mode: 'auto',
  trigger: 'hover',
  width: '100%',
  height: 'auto',
  alt: 'Product 360 view',
  frameRate: 30,
  loop: true,
  reverseOnSecondHover: false,
  direction: 'clockwise',
  preload: true,
  showLoading: true,
  loadingText: 'Loading...',
  enableDragSpin: true,
  dragSensitivity: 10
});

const emit = defineEmits<{
  'animation-start': [];
  'animation-end': [];
  'loaded': [];
  'error': [error: Error];
  'frame-change': [frame: number];
}>();

const containerRef = ref<HTMLElement | null>(null);

const {
  isAnimating,
  isLoading,
  currentMode,
  animatedImageUrl,
  currentFrameUrl,
  startAnimation,
  stopAnimation,
  preloadImages,
  handleDragStart,
  handleDragMove,
  handleDragEnd
} = use360Spin(props, emit);

// Computed styles
const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}));

// Show hint on hover trigger
const showHint = computed(() => props.trigger === 'hover' && !isAnimating.value);
const hintText = computed(() => 'Hover to spin');

// Event handlers
function handleMouseEnter() {
  if (props.trigger === 'hover') {
    startAnimation();
  }
}

function handleMouseLeave() {
  if (props.trigger === 'hover') {
    stopAnimation();
  }
}

function handleClick() {
  if (props.trigger === 'click') {
    if (isAnimating.value) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }
}

function handleTouchStart(event: TouchEvent) {
  if (props.enableDragSpin && currentMode.value === 'frames') {
    handleDragStart(event);
  } else if (props.trigger === 'click') {
    handleClick();
  }
}

function handleTouchMove(event: TouchEvent) {
  if (props.enableDragSpin && currentMode.value === 'frames') {
    handleDragMove(event);
  }
}

function handleTouchEnd(event: TouchEvent) {
  if (props.enableDragSpin && currentMode.value === 'frames') {
    handleDragEnd(event);
  }
}

function handleStaticImageLoad() {
  console.log('[Ai360Spin] Static image loaded, clearing loading state');
  // Static image loaded - clear loading state
  if (isLoading.value) {
    isLoading.value = false;
  }
  console.log('[Ai360Spin] isLoading after static load:', isLoading.value);
}

function handleAnimatedImageLoad() {
  emit('loaded');
}

function handleImageError(event: Event) {
  console.error('Image failed to load:', (event.target as HTMLImageElement)?.src);
  // Clear loading state even on error so component doesn't stay stuck
  if (isLoading.value) {
    isLoading.value = false;
  }
  emit('error', new Error('Failed to load image'));
}

// Preload images on mount
onMounted(async () => {
  console.log('[Ai360Spin] onMounted - preload:', props.preload, 'isLoading:', isLoading.value);

  if (props.preload) {
    try {
      await preloadImages();
    } catch (error) {
      console.error('[Ai360Spin] Preload failed:', error);
      // Clear loading state even if preload fails
      isLoading.value = false;
    }
  } else {
    // If not preloading, clear loading state immediately
    console.log('[Ai360Spin] Preload disabled, clearing loading state');
    isLoading.value = false;
    console.log('[Ai360Spin] isLoading after clear:', isLoading.value);
  }

  // Auto-start animation if trigger is 'auto'
  if (props.trigger === 'auto') {
    startAnimation();
  }
});
</script>

<style scoped>
.ai-360-spin {
  position: relative;
  display: inline-block;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.ai-360-spin__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: opacity 0.3s ease;
}

.ai-360-spin__image--static {
  opacity: 1;
}

.ai-360-spin__image--animated,
.ai-360-spin__image--frame {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
}

.ai-360-spin--animating .ai-360-spin__image--static {
  opacity: 0;
}

.ai-360-spin__loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.ai-360-spin__spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: ai-360-spin-rotate 1s linear infinite;
}

@keyframes ai-360-spin-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ai-360-spin__loading-text {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.ai-360-spin__hint {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.ai-360-spin:hover .ai-360-spin__hint {
  opacity: 1;
}

.ai-360-spin__hint-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .ai-360-spin {
    touch-action: none;
  }

  .ai-360-spin__hint {
    font-size: 11px;
    padding: 6px 12px;
  }
}
</style>


