import { ref, computed, onUnmounted } from 'vue';
import type { Spin360Config, SpinMode } from '../types';

export function use360Spin(
  props: Spin360Config,
  emit: any
) {
  const isAnimating = ref(false);
  const isLoading = ref(true);
  const currentFrameIndex = ref(0);
  const animationFrameId = ref<number | null>(null);
  const preloadedImages = ref<HTMLImageElement[]>([]);
  
  // Touch/drag state
  const isDragging = ref(false);
  const dragStartX = ref(0);
  const dragStartFrame = ref(0);

  // Determine animation mode
  const currentMode = computed<SpinMode>(() => {
    if (props.mode && props.mode !== 'auto') {
      return props.mode;
    }
    // Auto-detect based on animatedImage type
    return Array.isArray(props.animatedImage) ? 'frames' : 'gif';
  });

  // Get animated image URL (for GIF mode)
  const animatedImageUrl = computed(() => {
    if (currentMode.value === 'gif' && typeof props.animatedImage === 'string') {
      return props.animatedImage;
    }
    return '';
  });

  // Get current frame URL (for frames mode)
  const currentFrameUrl = computed(() => {
    if (currentMode.value === 'frames' && Array.isArray(props.animatedImage)) {
      const frames = props.animatedImage;
      const index = currentFrameIndex.value % frames.length;
      return frames[index];
    }
    return '';
  });

  // Get frame array
  const frameArray = computed(() => {
    if (Array.isArray(props.animatedImage)) {
      return props.animatedImage;
    }
    return [];
  });

  // Total number of frames
  const totalFrames = computed(() => frameArray.value.length);

  // Preload all images
  async function preloadImages() {
    isLoading.value = true;

    try {
      if (currentMode.value === 'gif') {
        // Preload GIF
        await loadImage(animatedImageUrl.value);
      } else if (currentMode.value === 'frames') {
        // Preload all frames
        const loadPromises = frameArray.value.map(url => loadImage(url));
        const images = await Promise.all(loadPromises);
        preloadedImages.value = images;
      }

      // Also preload static image
      await loadImage(props.staticImage);

      isLoading.value = false;
      emit('loaded');
    } catch (error) {
      isLoading.value = false;
      emit('error', error);
    }
  }

  // Load a single image with timeout
  function loadImage(url: string, timeout = 5000): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      // Don't set crossOrigin - it causes CORS issues with many image services
      // If you need CORS support, the image server must explicitly allow it

      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${url}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load image: ${url}`));
      };

      img.src = url;
    });
  }

  // Start animation
  function startAnimation() {
    if (isAnimating.value || isLoading.value) return;

    isAnimating.value = true;
    emit('animation-start');

    if (currentMode.value === 'frames') {
      startFrameAnimation();
    }
  }

  // Stop animation
  function stopAnimation() {
    if (!isAnimating.value) return;

    isAnimating.value = false;
    emit('animation-end');

    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }

    // Reset to first frame
    if (currentMode.value === 'frames') {
      currentFrameIndex.value = 0;
    }
  }

  // Start frame-by-frame animation
  function startFrameAnimation() {
    if (totalFrames.value === 0) return;

    const frameDelay = 1000 / (props.frameRate || 30);
    let lastFrameTime = Date.now();

    function animate() {
      const now = Date.now();
      const elapsed = now - lastFrameTime;

      if (elapsed >= frameDelay) {
        // Update frame
        if (props.direction === 'clockwise') {
          currentFrameIndex.value = (currentFrameIndex.value + 1) % totalFrames.value;
        } else {
          currentFrameIndex.value = currentFrameIndex.value === 0 
            ? totalFrames.value - 1 
            : currentFrameIndex.value - 1;
        }

        emit('frame-change', currentFrameIndex.value);
        lastFrameTime = now;

        // Check if we should loop
        if (!props.loop && currentFrameIndex.value === 0) {
          stopAnimation();
          return;
        }
      }

      if (isAnimating.value) {
        animationFrameId.value = requestAnimationFrame(animate);
      }
    }

    animationFrameId.value = requestAnimationFrame(animate);
  }

  // Handle drag start
  function handleDragStart(event: TouchEvent | MouseEvent) {
    if (currentMode.value !== 'frames' || totalFrames.value === 0) return;

    isDragging.value = true;
    dragStartFrame.value = currentFrameIndex.value;

    if (event instanceof TouchEvent) {
      dragStartX.value = event.touches[0].clientX;
    } else {
      dragStartX.value = event.clientX;
    }

    // Stop auto animation if running
    if (isAnimating.value) {
      stopAnimation();
    }
  }

  // Handle drag move
  function handleDragMove(event: TouchEvent | MouseEvent) {
    if (!isDragging.value || currentMode.value !== 'frames') return;

    event.preventDefault();

    let currentX: number;
    if (event instanceof TouchEvent) {
      currentX = event.touches[0].clientX;
    } else {
      currentX = event.clientX;
    }

    const deltaX = currentX - dragStartX.value;
    const sensitivity = props.dragSensitivity || 10;
    const frameDelta = Math.floor(deltaX / sensitivity);

    let newFrame = dragStartFrame.value + frameDelta;
    
    // Wrap around
    while (newFrame < 0) newFrame += totalFrames.value;
    while (newFrame >= totalFrames.value) newFrame -= totalFrames.value;

    if (newFrame !== currentFrameIndex.value) {
      currentFrameIndex.value = newFrame;
      emit('frame-change', currentFrameIndex.value);
    }
  }

  // Handle drag end
  function handleDragEnd(_event: TouchEvent | MouseEvent) {
    isDragging.value = false;
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value);
    }
  });

  return {
    isAnimating,
    isLoading,
    currentFrameIndex,
    currentMode,
    animatedImageUrl,
    currentFrameUrl,
    totalFrames,
    startAnimation,
    stopAnimation,
    preloadImages,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
}

