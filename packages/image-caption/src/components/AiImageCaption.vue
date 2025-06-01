<template>
  <div class="ai-image-caption">
    <div class="image-caption-container">
      <!-- Header -->
      <div class="caption-header">
        <h3 class="caption-title">
          <span class="title-icon">🖼️</span>
          AI Image Caption
        </h3>
        <div class="caption-controls">
          <select
            v-model="selectedModel"
            @change="updateModel"
            class="model-select"
            :disabled="isProcessing"
          >
            <option v-for="model in availableModels" :key="model.id" :value="model.id">
              {{ model.name }}
            </option>
          </select>
          <button
            @click="clearAll"
            class="clear-btn"
            :disabled="isProcessing"
          >
            <span class="btn-icon">🗑️</span>
            Clear
          </button>
        </div>
      </div>

      <!-- Image Upload Area -->
      <div class="upload-section">
        <div
          class="upload-area"
          :class="{
            'upload-active': isDragOver,
            'upload-disabled': isProcessing,
            'has-image': currentImage
          }"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="file-input"
            :disabled="isProcessing"
          />

          <div v-if="!currentImage" class="upload-placeholder">
            <div class="upload-icon">📸</div>
            <div class="upload-text">
              <p class="upload-primary">Drop an image here or click to upload</p>
              <p class="upload-secondary">Supports JPG, PNG, WebP up to 10MB</p>
            </div>
          </div>

          <div v-else class="image-preview">
            <img :src="currentImage" alt="Uploaded image" class="preview-image" />
            <div class="image-overlay">
              <button @click.stop="removeImage" class="remove-btn">
                <span>✕</span>
              </button>
            </div>
          </div>
        </div>

        <!-- URL Input -->
        <div class="url-input-section">
          <div class="url-input-group">
            <input
              v-model="imageUrl"
              type="url"
              placeholder="Or paste an image URL..."
              class="url-input"
              :disabled="isProcessing"
              @keyup.enter="loadImageFromUrl"
            />
            <button
              @click="loadImageFromUrl"
              class="url-load-btn"
              :disabled="isProcessing || !imageUrl.trim()"
            >
              Load
            </button>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="generate-section">
        <button
          @click="generateCaption"
          class="generate-btn"
          :disabled="!currentImage || isProcessing"
          :class="{ 'btn-loading': isProcessing }"
        >
          <span v-if="isProcessing" class="btn-spinner">⏳</span>
          <span v-else class="btn-icon">✨</span>
          {{ isProcessing ? 'Generating...' : 'Generate Caption' }}
        </button>
      </div>

      <!-- Results Section -->
      <div v-if="result || error" class="results-section">
        <!-- Error Display -->
        <div v-if="error" class="error-message">
          <div class="error-icon">❌</div>
          <div class="error-content">
            <h4>Caption Generation Failed</h4>
            <p>{{ error }}</p>
            <button @click="clearError" class="error-dismiss">Dismiss</button>
          </div>
        </div>

        <!-- Success Result -->
        <div v-if="result" class="result-card">
          <div class="result-header">
            <h4>Generated Caption</h4>
            <div class="result-meta">
              <span class="model-badge">{{ result.model.split('/').pop() }}</span>
              <span class="time-badge">{{ result.processingTime }}ms</span>
            </div>
          </div>
          <div class="result-content">
            <p class="caption-text">{{ result.caption }}</p>
            <div class="result-actions">
              <button @click="copyCaption" class="action-btn copy-btn">
                <span class="btn-icon">📋</span>
                Copy
              </button>
              <button @click="shareCaption" class="action-btn share-btn">
                <span class="btn-icon">🔗</span>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- History Section -->
      <div v-if="history.length > 0" class="history-section">
        <div class="history-header">
          <h4>Caption History</h4>
          <div class="history-controls">
            <button @click="exportHistory('json')" class="export-btn">
              <span class="btn-icon">📥</span>
              Export JSON
            </button>
            <button @click="clearHistory" class="clear-history-btn">
              <span class="btn-icon">🗑️</span>
              Clear History
            </button>
          </div>
        </div>
        <div class="history-list">
          <div
            v-for="item in history.slice(0, 5)"
            :key="item.id"
            class="history-item"
            @click="loadHistoryItem(item)"
          >
            <div class="history-image">
              <img :src="item.image" alt="Historical image" />
            </div>
            <div class="history-content">
              <p class="history-caption">{{ item.caption }}</p>
              <div class="history-meta">
                <span class="history-time">{{ formatTime(item.timestamp) }}</span>
                <span class="history-model">{{ item.model.split('/').pop() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useImageCaption } from '../composables/useImageCaption';
import { AVAILABLE_MODELS } from '../types';

export default {
  name: 'AiImageCaption',
  props: {
    apiKey: {
      type: String,
      default: ''
    },
    model: {
      type: String,
      default: 'gpt-4o'
    },
    autoCaption: {
      type: Boolean,
      default: false
    },
    maxHistorySize: {
      type: Number,
      default: 20
    }
  },
  emits: [
    'caption-generated',
    'caption-error',
    'image-uploaded',
    'image-removed'
  ],
  setup(props, { emit }) {
    const fileInput = ref(null);
    const imageUrl = ref('');
    const selectedModel = ref(props.model);
    const isDragOver = ref(false);

    // Initialize image caption composable
    const imageCaption = useImageCaption({
      config: {
        apiKey: props.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
        model: props.model
      },
      autoCaption: props.autoCaption,
      maxHistorySize: props.maxHistorySize
    });

    const {
      state,
      config,
      isProcessing,
      error,
      result,
      history,
      currentImage,
      generateCaption: generateCaptionFn,
      uploadImage,
      processImageUrl,
      clearHistory: clearHistoryFn,
      clearError: clearErrorFn,
      clearResult,
      setConfig,
      exportHistory: exportHistoryFn
    } = imageCaption;

    const availableModels = computed(() => AVAILABLE_MODELS);

    // File handling
    const triggerFileInput = () => {
      if (!isProcessing.value && fileInput.value) {
        fileInput.value.click();
      }
    };

    const handleFileSelect = async (event) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          const uploadEvent = await uploadImage(file);
          emit('image-uploaded', uploadEvent);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    };

    const handleDrop = async (event) => {
      event.preventDefault();
      isDragOver.value = false;

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        try {
          const uploadEvent = await uploadImage(files[0]);
          emit('image-uploaded', uploadEvent);
        } catch (error) {
          console.error('Drop upload failed:', error);
        }
      }
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      isDragOver.value = true;
    };

    const handleDragLeave = () => {
      isDragOver.value = false;
    };

    const loadImageFromUrl = async () => {
      if (!imageUrl.value.trim()) return;

      try {
        await processImageUrl(imageUrl.value);
        imageUrl.value = '';
        emit('image-uploaded', { url: imageUrl.value });
      } catch (error) {
        console.error('URL load failed:', error);
      }
    };

    const removeImage = () => {
      state.value.currentImage = null;
      clearResult();
      clearErrorFn();
      emit('image-removed');
    };

    // Caption generation
    const generateCaption = async () => {
      if (!currentImage.value) return;

      try {
        // Use the base64 data directly since currentImage contains the data URL
        const result = await generateCaptionFn(currentImage.value, {
          model: selectedModel.value
        });
        emit('caption-generated', result);
      } catch (error) {
        console.error('Caption generation error:', error);
        emit('caption-error', error);
      }
    };

    // Model management
    const updateModel = () => {
      setConfig({ model: selectedModel.value });
    };

    // Actions
    const copyCaption = async () => {
      if (result.value?.caption) {
        try {
          await navigator.clipboard.writeText(result.value.caption);
          // Could show a toast notification here
        } catch (error) {
          console.error('Copy failed:', error);
        }
      }
    };

    const shareCaption = () => {
      if (result.value?.caption && navigator.share) {
        navigator.share({
          title: 'AI Generated Caption',
          text: result.value.caption
        });
      }
    };

    const clearAll = () => {
      removeImage();
      clearHistoryFn();
    };

    const clearError = () => {
      clearErrorFn();
    };

    const clearHistory = () => {
      clearHistoryFn();
    };

    const exportHistory = (format) => {
      const data = exportHistoryFn(format);
      const blob = new Blob([data], {
        type: format === 'json' ? 'application/json' : 'text/csv'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-captions-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const loadHistoryItem = (item) => {
      state.value.currentImage = item.image;
      state.value.result = {
        caption: item.caption,
        model: item.model,
        processingTime: item.processingTime,
        timestamp: item.timestamp
      };
    };

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleString();
    };

    // Update config when props change
    onMounted(() => {
      if (props.apiKey) {
        setConfig({ apiKey: props.apiKey });
      }
    });

    // Watch for API key changes
    watch(() => props.apiKey, (newApiKey) => {
      if (newApiKey) {
        setConfig({ apiKey: newApiKey });
      }
    });

    // Watch for model changes
    watch(() => props.model, (newModel) => {
      if (newModel) {
        selectedModel.value = newModel;
        setConfig({ model: newModel });
      }
    });

    return {
      // Refs
      fileInput,
      imageUrl,
      selectedModel,
      isDragOver,

      // Computed
      availableModels,
      isProcessing,
      error,
      result,
      history,
      currentImage,

      // Methods
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      handleDragLeave,
      loadImageFromUrl,
      removeImage,
      generateCaption,
      updateModel,
      copyCaption,
      shareCaption,
      clearAll,
      clearError,
      clearHistory,
      exportHistory,
      loadHistoryItem,
      formatTime
    };
  }
};
</script>
