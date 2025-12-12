<template>
  <div class="ai-360-generator">
    <!-- API Key Input (if not provided) -->
    <div v-if="!hasApiKey" class="ai-360-generator__api-key">
      <label for="api-key-input">{{ providerLabel }} API Key:</label>
      <input
        id="api-key-input"
        v-model="apiKeyInput"
        type="password"
        :placeholder="`Enter your ${providerLabel} API key`"
        class="ai-360-generator__input"
      />
      <button @click="saveApiKey" class="ai-360-generator__button">
        Save API Key
      </button>
    </div>

    <!-- Upload Section -->
    <div v-if="hasApiKey && !isGenerating && generatedFrames.length === 0" class="ai-360-generator__upload">
      <div
        class="ai-360-generator__dropzone"
        :class="{ 'ai-360-generator__dropzone--dragging': isDragging }"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          style="display: none"
          @change="handleFileSelect"
        />
        
        <div v-if="!uploadedImage" class="ai-360-generator__dropzone-content">
          <svg class="ai-360-generator__upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="ai-360-generator__dropzone-text">
            Drop an image here or click to upload
          </p>
          <p class="ai-360-generator__dropzone-hint">
            Upload a product image to generate 360° views
          </p>
        </div>

        <div v-else class="ai-360-generator__preview">
          <img :src="uploadedImage" alt="Uploaded product" class="ai-360-generator__preview-image" />
          <button @click.stop="clearUpload" class="ai-360-generator__clear-button">
            ✕
          </button>
        </div>
      </div>

      <!-- Generation Options -->
      <div v-if="uploadedImage" class="ai-360-generator__options">
        <div class="ai-360-generator__option">
          <label>Frame Count:</label>
          <select v-model.number="frameCount" class="ai-360-generator__select">
            <option :value="12">12 frames (Fast)</option>
            <option :value="24">24 frames (Balanced)</option>
            <option :value="36">36 frames (Smooth)</option>
            <option :value="72">72 frames (Ultra Smooth)</option>
          </select>
        </div>

        <div class="ai-360-generator__option">
          <label>Background:</label>
          <select v-model="backgroundColor" class="ai-360-generator__select">
            <option value="white">White</option>
            <option value="transparent">Transparent</option>
            <option value="black">Black</option>
          </select>
        </div>

        <div class="ai-360-generator__option">
          <label>Quality:</label>
          <select v-model.number="quality" class="ai-360-generator__select">
            <option :value="60">Standard</option>
            <option :value="80">High</option>
            <option :value="100">Ultra</option>
          </select>
        </div>

        <button @click="startGeneration" class="ai-360-generator__generate-button">
          🤖 Generate 360° View
        </button>
      </div>
    </div>

    <!-- Progress Section -->
    <div v-if="isGenerating" class="ai-360-generator__progress">
      <div class="ai-360-generator__progress-bar">
        <div 
          class="ai-360-generator__progress-fill" 
          :style="{ width: progress.percentage + '%' }"
        ></div>
      </div>
      <p class="ai-360-generator__progress-text">
        {{ progress.status }}
      </p>
      <p class="ai-360-generator__progress-detail">
        Frame {{ progress.currentFrame }} / {{ progress.totalFrames }} ({{ Math.round(progress.percentage) }}%)
      </p>
    </div>

    <!-- Result Section -->
    <div v-if="generatedFrames.length > 0 && !isGenerating" class="ai-360-generator__result">
      <h3 class="ai-360-generator__result-title">✅ 360° View Generated!</h3>
      
      <!-- 360 Viewer -->
      <div class="ai-360-generator__viewer">
        <Ai360Spin
          :static-image="generatedFrames[0]"
          :animated-image="generatedFrames"
          mode="frames"
          trigger="hover"
          :enable-drag-spin="true"
          :frame-rate="30"
        />
      </div>

      <!-- Actions -->
      <div class="ai-360-generator__actions">
        <button @click="downloadFrames" class="ai-360-generator__button">
          📥 Download Frames
        </button>
        <button @click="reset" class="ai-360-generator__button ai-360-generator__button--secondary">
          🔄 Generate Another
        </button>
        <button @click="emitFrames" class="ai-360-generator__button ai-360-generator__button--primary">
          ✓ Use These Frames
        </button>
      </div>

      <!-- Frame Preview Grid -->
      <div v-if="showFramePreview" class="ai-360-generator__frame-grid">
        <img
          v-for="(frame, index) in generatedFrames.slice(0, 12)"
          :key="index"
          :src="frame"
          :alt="`Frame ${index + 1}`"
          class="ai-360-generator__frame-thumbnail"
        />
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="ai-360-generator__error">
      <p>❌ {{ error }}</p>
      <button @click="clearError" class="ai-360-generator__button">
        Dismiss
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { AI360Generator } from '../utils/ai-generator';
import type { AIProvider, BackgroundColor, AI360GenerationProgress } from '../types';
import Ai360Spin from './Ai360Spin.vue';

// Props
const props = withDefaults(defineProps<{
  provider?: AIProvider;
  apiKey?: string;
  autoSaveApiKey?: boolean;
  showFramePreview?: boolean;
}>(), {
  provider: 'openai',
  apiKey: '',
  autoSaveApiKey: true,
  showFramePreview: true
});

// Emits
const emit = defineEmits<{
  'frames-generated': [frames: string[]];
  'generation-start': [];
  'generation-complete': [frames: string[]];
  'generation-error': [error: Error];
}>();

// State
const apiKeyInput = ref(props.apiKey || localStorage.getItem(`ai_360_api_key_${props.provider}`) || '');
const uploadedImage = ref<string | null>(null);
const isDragging = ref(false);
const isGenerating = ref(false);
const generatedFrames = ref<string[]>([]);
const error = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// Generation options
const frameCount = ref(36);
const backgroundColor = ref<BackgroundColor>('white');
const quality = ref(80);

// Progress
const progress = ref<AI360GenerationProgress>({
  currentFrame: 0,
  totalFrames: 0,
  percentage: 0,
  status: '',
  generatedFrames: []
});

// Computed
const hasApiKey = computed(() => apiKeyInput.value.length > 0);
const providerLabel = computed(() => props.provider === 'openai' ? 'OpenAI' : 'Stability AI');

// Methods
function saveApiKey() {
  if (props.autoSaveApiKey) {
    localStorage.setItem(`ai_360_api_key_${props.provider}`, apiKeyInput.value);
  }
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    processFile(file);
  }
}

function processFile(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function clearUpload() {
  uploadedImage.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

async function startGeneration() {
  if (!uploadedImage.value || !apiKeyInput.value) return;

  isGenerating.value = true;
  error.value = null;
  generatedFrames.value = [];
  emit('generation-start');

  try {
    const generator = new AI360Generator(
      {
        provider: props.provider,
        apiKey: apiKeyInput.value,
        frameCount: frameCount.value,
        backgroundColor: backgroundColor.value,
        quality: quality.value,
        useVisionAnalysis: true
      },
      (progressData) => {
        progress.value = progressData;
      }
    );

    const result = await generator.generate(uploadedImage.value);
    generatedFrames.value = result.frames;
    emit('generation-complete', result.frames);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Generation failed';
    error.value = errorMessage;
    emit('generation-error', err instanceof Error ? err : new Error(errorMessage));
  } finally {
    isGenerating.value = false;
  }
}

function downloadFrames() {
  generatedFrames.value.forEach((frame, index) => {
    const link = document.createElement('a');
    link.href = frame;
    link.download = `360-frame-${String(index + 1).padStart(3, '0')}.png`;
    link.click();
  });
}

function reset() {
  generatedFrames.value = [];
  uploadedImage.value = null;
  error.value = null;
  progress.value = {
    currentFrame: 0,
    totalFrames: 0,
    percentage: 0,
    status: '',
    generatedFrames: []
  };
}

function emitFrames() {
  emit('frames-generated', generatedFrames.value);
}

function clearError() {
  error.value = null;
}
</script>

<style scoped>
.ai-360-generator {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.ai-360-generator__api-key {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.ai-360-generator__api-key label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.ai-360-generator__input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 10px;
}

.ai-360-generator__dropzone {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.ai-360-generator__dropzone:hover {
  border-color: #4CAF50;
  background: #f0f8f0;
}

.ai-360-generator__dropzone--dragging {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.ai-360-generator__upload-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #666;
}

.ai-360-generator__dropzone-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.ai-360-generator__dropzone-hint {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.ai-360-generator__preview {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.ai-360-generator__preview-image {
  width: 100%;
  border-radius: 8px;
}

.ai-360-generator__clear-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-360-generator__options {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.ai-360-generator__option {
  display: flex;
  flex-direction: column;
}

.ai-360-generator__option label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
  font-size: 14px;
}

.ai-360-generator__select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.ai-360-generator__generate-button {
  grid-column: 1 / -1;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.ai-360-generator__generate-button:hover {
  transform: translateY(-2px);
}

.ai-360-generator__progress {
  padding: 30px;
  text-align: center;
}

.ai-360-generator__progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
}

.ai-360-generator__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.ai-360-generator__progress-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.ai-360-generator__progress-detail {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.ai-360-generator__result {
  text-align: center;
}

.ai-360-generator__result-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #4CAF50;
}

.ai-360-generator__viewer {
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ai-360-generator__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
  flex-wrap: wrap;
}

.ai-360-generator__button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-360-generator__button:hover {
  background: #45a049;
  transform: translateY(-1px);
}

.ai-360-generator__button--secondary {
  background: #757575;
}

.ai-360-generator__button--secondary:hover {
  background: #616161;
}

.ai-360-generator__button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ai-360-generator__frame-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.ai-360-generator__frame-thumbnail {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid #e0e0e0;
  transition: transform 0.2s;
}

.ai-360-generator__frame-thumbnail:hover {
  transform: scale(1.05);
  border-color: #4CAF50;
}

.ai-360-generator__error {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
}

.ai-360-generator__error p {
  margin: 0 0 10px;
  font-weight: 600;
}
</style>

