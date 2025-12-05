<template>
  <div class="doc-upload">
    <div
      class="upload-area"
      :class="{ 'drag-over': isDragging, 'has-files': files.length > 0 }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="acceptedTypes"
        :multiple="multiple"
        @change="handleFileSelect"
        style="display: none"
      />

      <div v-if="files.length === 0" class="upload-prompt">
        <div class="upload-icon">📄</div>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
        <p class="upload-hint">{{ acceptedFormats }}</p>
        <button class="browse-btn" @click.stop="triggerFileInput">
          Browse Files
        </button>
      </div>

      <div v-else class="files-preview">
        <h3>{{ files.length }} file(s) selected</h3>
        <div class="file-list">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="file-item"
          >
            <div class="file-icon">
              {{ getFileIcon(file.type) }}
            </div>
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size) }}</div>
            </div>
            <button
              class="remove-btn"
              @click.stop="removeFile(index)"
              :aria-label="`Remove ${file.name}`"
            >
              ✕
            </button>
          </div>
        </div>
        <button class="add-more-btn" @click.stop="triggerFileInput">
          + Add More Files
        </button>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="showProgress && uploadProgress > 0" class="progress-bar">
      <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      <span class="progress-text">{{ uploadProgress }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title?: string;
  description?: string;
  acceptedTypes?: string;
  acceptedFormats?: string;
  multiple?: boolean;
  maxFileSize?: number; // in MB
  maxFiles?: number;
  showProgress?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Upload Documents',
  description: 'Drag and drop your files here or click to browse',
  acceptedTypes: 'image/*,application/pdf',
  acceptedFormats: 'Supported formats: PDF, PNG, JPG, JPEG',
  multiple: true,
  maxFileSize: 10,
  maxFiles: 10,
  showProgress: false
});

const emit = defineEmits<{
  'files-selected': [files: File[]];
  'file-removed': [index: number];
  'error': [error: string];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[]>([]);
const isDragging = ref(false);
const error = ref('');
const uploadProgress = ref(0);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const validateFile = (file: File): boolean => {
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > props.maxFileSize) {
    error.value = `File ${file.name} exceeds maximum size of ${props.maxFileSize}MB`;
    emit('error', error.value);
    return false;
  }

  // Check file type
  const acceptedTypesArray = props.acceptedTypes.split(',');
  const isAccepted = acceptedTypesArray.some(type => {
    if (type.includes('*')) {
      const baseType = type.split('/')[0];
      return file.type.startsWith(baseType);
    }
    return file.type === type;
  });

  if (!isAccepted) {
    error.value = `File ${file.name} is not an accepted format`;
    emit('error', error.value);
    return false;
  }

  return true;
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    addFiles(Array.from(target.files));
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files));
  }
};

const addFiles = (newFiles: File[]) => {
  error.value = '';

  // Check max files limit
  if (files.value.length + newFiles.length > props.maxFiles) {
    error.value = `Maximum ${props.maxFiles} files allowed`;
    emit('error', error.value);
    return;
  }

  // Validate and add files
  const validFiles = newFiles.filter(validateFile);
  files.value.push(...validFiles);

  if (validFiles.length > 0) {
    emit('files-selected', files.value);
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  emit('file-removed', index);
  error.value = '';
};

const getFileIcon = (type: string): string => {
  if (type.includes('pdf')) return '📄';
  if (type.includes('image')) return '🖼️';
  return '📎';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Expose methods for parent component
defineExpose({
  clearFiles: () => {
    files.value = [];
    error.value = '';
  },
  getFiles: () => files.value,
  setProgress: (progress: number) => {
    uploadProgress.value = progress;
  }
});
</script>

<style scoped>
.doc-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f7fafc;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #4299e1;
  background: #ebf8ff;
}

.upload-area.drag-over {
  border-color: #3182ce;
  background: #bee3f8;
  transform: scale(1.02);
}

.upload-area.has-files {
  background: #fff;
  border-style: solid;
}

.upload-prompt {
  width: 100%;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.upload-prompt h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.upload-prompt p {
  color: #718096;
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.875rem;
  color: #a0aec0;
}

.browse-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.browse-btn:hover {
  background: #3182ce;
}

.files-preview {
  width: 100%;
}

.files-preview h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  transition: background 0.2s;
}

.file-item:hover {
  background: #edf2f7;
}

.file-icon {
  font-size: 2rem;
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.file-size {
  font-size: 0.875rem;
  color: #718096;
}

.remove-btn {
  padding: 0.5rem;
  background: #fc8181;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1rem;
  line-height: 1;
}

.remove-btn:hover {
  background: #f56565;
}

.add-more-btn {
  padding: 0.75rem 1.5rem;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-more-btn:hover {
  background: #38a169;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  font-size: 0.875rem;
}

.progress-bar {
  margin-top: 1rem;
  height: 32px;
  background: #edf2f7;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4299e1, #3182ce);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  color: #2d3748;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .upload-area {
    background: #2d3748;
    border-color: #4a5568;
  }

  .upload-area:hover {
    background: #374151;
    border-color: #60a5fa;
  }

  .upload-area.drag-over {
    background: #1e3a5f;
    border-color: #3b82f6;
  }

  .upload-area.has-files {
    background: #1a202c;
  }

  .upload-prompt h3,
  .files-preview h3,
  .file-name {
    color: #f7fafc;
  }

  .upload-prompt p,
  .file-size {
    color: #cbd5e0;
  }

  .file-item {
    background: #2d3748;
  }

  .file-item:hover {
    background: #374151;
  }

  .progress-bar {
    background: #374151;
  }

  .progress-text {
    color: #f7fafc;
  }
}
</style>

