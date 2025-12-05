<template>
  <div class="doc-viewer">
    <div class="viewer-header">
      <h3>{{ documentName }}</h3>
      <div class="viewer-actions">
        <button
          v-if="showExtractedData"
          @click="toggleDataOverlay"
          class="toggle-btn"
          :class="{ active: showOverlay }"
        >
          {{ showOverlay ? 'Hide' : 'Show' }} Extracted Data
        </button>
        <button @click="downloadDocument" class="download-btn">
          Download
        </button>
      </div>
    </div>

    <div class="viewer-content">
      <div class="document-preview" :class="{ 'with-overlay': showOverlay }">
        <!-- Image preview -->
        <img
          v-if="isImage"
          :src="documentUrl"
          :alt="documentName"
          class="preview-image"
        />

        <!-- PDF preview -->
        <iframe
          v-else-if="isPDF"
          :src="documentUrl"
          class="preview-pdf"
          frameborder="0"
        ></iframe>

        <!-- Unsupported format -->
        <div v-else class="unsupported-format">
          <div class="unsupported-icon">📄</div>
          <p>Preview not available for this file type</p>
          <p class="file-name">{{ documentName }}</p>
        </div>

        <!-- Data overlay -->
        <div v-if="showOverlay && extractedData" class="data-overlay">
          <div
            v-for="(entity, index) in allEntities"
            :key="index"
            class="entity-highlight"
            :class="`entity-${entity.type}`"
            :title="`${entity.type}: ${entity.value} (${Math.round(entity.confidence * 100)}% confidence)`"
          >
            <span class="entity-label">{{ entity.type }}</span>
            <span class="entity-value">{{ entity.value }}</span>
          </div>
        </div>
      </div>

      <!-- Extracted data panel -->
      <div v-if="showExtractedData && extractedData" class="data-panel">
        <h4>Extracted Information</h4>

        <div class="data-section" v-if="documentType">
          <div class="section-header">
            <span class="section-icon">📋</span>
            <span class="section-title">Document Type</span>
          </div>
          <div class="data-item">
            <span class="data-label">Type:</span>
            <span class="data-value">{{ formatDocumentType(documentType.type) }}</span>
            <span class="confidence-badge" :class="getConfidenceClass(documentType.confidence)">
              {{ Math.round(documentType.confidence * 100) }}%
            </span>
          </div>
        </div>

        <div class="data-section" v-if="extractedData.dates.length > 0">
          <div class="section-header">
            <span class="section-icon">📅</span>
            <span class="section-title">Dates</span>
          </div>
          <div
            v-for="(date, index) in extractedData.dates"
            :key="index"
            class="data-item"
          >
            <span class="data-value">{{ date.value }}</span>
            <span class="confidence-badge" :class="getConfidenceClass(date.confidence)">
              {{ Math.round(date.confidence * 100) }}%
            </span>
          </div>
        </div>

        <div class="data-section" v-if="extractedData.amounts.length > 0">
          <div class="section-header">
            <span class="section-icon">💰</span>
            <span class="section-title">Amounts</span>
          </div>
          <div
            v-for="(amount, index) in extractedData.amounts"
            :key="index"
            class="data-item"
          >
            <span class="data-value">{{ amount.value }}</span>
            <span class="confidence-badge" :class="getConfidenceClass(amount.confidence)">
              {{ Math.round(amount.confidence * 100) }}%
            </span>
          </div>
        </div>

        <div class="data-section" v-if="extractedData.names.length > 0">
          <div class="section-header">
            <span class="section-icon">👤</span>
            <span class="section-title">Names</span>
          </div>
          <div
            v-for="(name, index) in extractedData.names"
            :key="index"
            class="data-item"
          >
            <span class="data-value">{{ name.value }}</span>
            <span class="confidence-badge" :class="getConfidenceClass(name.confidence)">
              {{ Math.round(name.confidence * 100) }}%
            </span>
          </div>
        </div>

        <div class="data-section" v-if="extractedData.emails.length > 0">
          <div class="section-header">
            <span class="section-icon">📧</span>
            <span class="section-title">Emails</span>
          </div>
          <div
            v-for="(email, index) in extractedData.emails"
            :key="index"
            class="data-item"
          >
            <span class="data-value">{{ email.value }}</span>
            <span class="confidence-badge" :class="getConfidenceClass(email.confidence)">
              {{ Math.round(email.confidence * 100) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ExtractedData } from '../utils/entityExtraction';
import type { DocumentTypeResult } from '../utils/documentTypeDetection';

interface Props {
  documentUrl: string;
  documentName: string;
  documentType?: DocumentTypeResult;
  extractedData?: ExtractedData;
  showExtractedData?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showExtractedData: true
});

const showOverlay = ref(false);

const isImage = computed(() => {
  return props.documentUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) !== null ||
         props.documentUrl.startsWith('data:image/');
});

const isPDF = computed(() => {
  return props.documentUrl.match(/\.pdf$/i) !== null ||
         props.documentUrl.startsWith('data:application/pdf');
});

const allEntities = computed(() => {
  if (!props.extractedData) return [];

  const entities = [
    ...props.extractedData.dates,
    ...props.extractedData.amounts,
    ...props.extractedData.names,
    ...props.extractedData.emails,
    ...props.extractedData.phones,
    ...props.extractedData.addresses,
    ...props.extractedData.invoiceNumbers,
    ...props.extractedData.taxIds
  ];

  return entities;
});

const toggleDataOverlay = () => {
  showOverlay.value = !showOverlay.value;
};

const downloadDocument = () => {
  const link = document.createElement('a');
  link.href = props.documentUrl;
  link.download = props.documentName;
  link.click();
};

const formatDocumentType = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getConfidenceClass = (confidence: number): string => {
  if (confidence >= 0.9) return 'high';
  if (confidence >= 0.7) return 'medium';
  return 'low';
};
</script>

<style scoped>
.doc-viewer {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f7fafc;
}

.viewer-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.viewer-actions {
  display: flex;
  gap: 0.75rem;
}

.toggle-btn,
.download-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn {
  background: #edf2f7;
  color: #2d3748;
}

.toggle-btn:hover {
  background: #e2e8f0;
}

.toggle-btn.active {
  background: #4299e1;
  color: white;
}

.download-btn {
  background: #48bb78;
  color: white;
}

.download-btn:hover {
  background: #38a169;
}

.viewer-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 0;
  min-height: 600px;
}

.document-preview {
  position: relative;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: auto;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-pdf {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.unsupported-format {
  text-align: center;
  color: #718096;
}

.unsupported-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.unsupported-format p {
  margin: 0.5rem 0;
}

.file-name {
  font-weight: 600;
  color: #2d3748;
}

.data-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  padding: 2rem;
}

.entity-highlight {
  display: inline-block;
  margin: 0.25rem;
  padding: 0.5rem;
  background: rgba(66, 153, 225, 0.2);
  border: 2px solid #4299e1;
  border-radius: 4px;
  font-size: 0.875rem;
}

.entity-label {
  font-weight: 600;
  margin-right: 0.5rem;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.data-panel {
  background: white;
  border-left: 1px solid #e2e8f0;
  padding: 1.5rem;
  overflow-y: auto;
}

.data-panel h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
}

.data-section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-icon {
  font-size: 1.25rem;
}

.section-title {
  font-weight: 600;
  color: #2d3748;
}

.data-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.data-label {
  font-weight: 500;
  color: #718096;
  margin-right: 0.5rem;
}

.data-value {
  flex: 1;
  color: #2d3748;
  font-weight: 500;
}

.confidence-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.confidence-badge.high {
  background: #c6f6d5;
  color: #22543d;
}

.confidence-badge.medium {
  background: #feebc8;
  color: #7c2d12;
}

.confidence-badge.low {
  background: #fed7d7;
  color: #742a2a;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .doc-viewer {
    background: #1a202c;
  }

  .viewer-header {
    background: #2d3748;
    border-bottom-color: #4a5568;
  }

  .viewer-header h3,
  .section-title,
  .data-value,
  .file-name {
    color: #f7fafc;
  }

  .document-preview {
    background: #2d3748;
  }

  .data-panel {
    background: #1a202c;
    border-left-color: #4a5568;
  }

  .data-panel h4 {
    color: #f7fafc;
  }

  .section-header {
    border-bottom-color: #4a5568;
  }

  .data-item {
    background: #2d3748;
  }

  .data-label {
    color: #cbd5e0;
  }

  .toggle-btn {
    background: #4a5568;
    color: #f7fafc;
  }

  .toggle-btn:hover {
    background: #718096;
  }
}

@media (max-width: 768px) {
  .viewer-content {
    grid-template-columns: 1fr;
  }

  .data-panel {
    border-left: none;
    border-top: 1px solid #e2e8f0;
  }
}
</style>

