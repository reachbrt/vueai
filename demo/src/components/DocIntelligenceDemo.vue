<template>
  <div class="doc-intelligence-demo">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">📄 Document Intelligence</h1>
        <p class="hero-subtitle">
          AI-powered document parser and extractor - Upload PDFs/images, extract structured data from invoices, receipts, forms, and IDs
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <div class="demo-container">
      <!-- Upload Section -->
      <section class="upload-section">
        <h2>Upload Documents</h2>
        <p class="section-description">
          Upload PDF files or images to extract structured data automatically
        </p>

        <DocumentUpload
          title="Drop your documents here"
          description="Drag and drop PDF or image files, or click to browse"
          accepted-formats="Supported: PDF, PNG, JPG, JPEG (max 10MB)"
          :multiple="true"
          :max-file-size="10"
          :max-files="5"
          @files-selected="handleFilesSelected"
          @error="handleUploadError"
        />

        <div v-if="uploadError" class="error-alert">
          {{ uploadError }}
        </div>
      </section>

      <!-- Processing Status -->
      <section v-if="documents.length > 0" class="status-section">
        <h2>Processing Status</h2>
        <div class="status-grid">
          <div class="status-card">
            <div class="status-icon">📊</div>
            <div class="status-value">{{ totalDocuments }}</div>
            <div class="status-label">Total Documents</div>
          </div>
          <div class="status-card">
            <div class="status-icon">✅</div>
            <div class="status-value">{{ completedDocuments }}</div>
            <div class="status-label">Completed</div>
          </div>
          <div class="status-card">
            <div class="status-icon">⏳</div>
            <div class="status-value">{{ processingCount }}</div>
            <div class="status-label">Processing</div>
          </div>
          <div class="status-card">
            <div class="status-icon">❌</div>
            <div class="status-value">{{ failedDocuments }}</div>
            <div class="status-label">Failed</div>
          </div>
        </div>
      </section>

      <!-- Documents List -->
      <section v-if="documents.length > 0" class="documents-section">
        <h2>Your Documents</h2>
        <div class="documents-list">
          <div
            v-for="doc in documents"
            :key="doc.id"
            class="document-card"
            :class="`status-${doc.status}`"
            @click="selectDocument(doc)"
          >
            <div class="doc-icon">
              {{ getDocumentIcon(doc.file.type) }}
            </div>
            <div class="doc-info">
              <div class="doc-name">{{ doc.file.name }}</div>
              <div class="doc-meta">
                <span class="doc-size">{{ formatFileSize(doc.file.size) }}</span>
                <span v-if="doc.documentType" class="doc-type">
                  {{ formatDocumentType(doc.documentType.type) }}
                </span>
              </div>
              <div v-if="doc.status === 'processing'" class="progress-bar">
                <div class="progress-fill" :style="{ width: doc.progress + '%' }"></div>
              </div>
              <div v-if="doc.status === 'error'" class="error-text">
                {{ doc.error }}
              </div>
            </div>
            <div class="doc-status">
              <span v-if="doc.status === 'pending'" class="status-badge pending">Pending</span>
              <span v-else-if="doc.status === 'processing'" class="status-badge processing">Processing</span>
              <span v-else-if="doc.status === 'completed'" class="status-badge completed">✓ Done</span>
              <span v-else-if="doc.status === 'error'" class="status-badge error">Error</span>
            </div>
            <button
              class="remove-btn"
              @click.stop="removeDoc(doc.id)"
              title="Remove document"
            >
              ✕
            </button>
          </div>
        </div>
      </section>

      <!-- Document Viewer -->
      <section v-if="selectedDocument && selectedDocument.status === 'completed'" class="viewer-section">
        <h2>Document Preview & Extracted Data</h2>
        <DocumentViewer
          :document-url="selectedDocument.url"
          :document-name="selectedDocument.file.name"
          :document-type="selectedDocument.documentType"
          :extracted-data="selectedDocument.extractedData"
          :show-extracted-data="true"
        />
      </section>

      <!-- Auto-Generated Form -->
      <section v-if="selectedDocument && selectedDocument.extractedData" class="form-section">
        <h2>Auto-Generated Form</h2>
        <p class="section-description">
          Review and edit the extracted information below
        </p>
        <ExtractedDataForm
          title="Extracted Document Data"
          description="The form below was automatically generated from the extracted data. You can edit any field before submitting."
          :extracted-data="selectedDocument.extractedData"
          :auto-generate-fields="true"
          submit-button-text="Save Data"
          @submit="handleFormSubmit"
          @reset="handleFormReset"
        />
      </section>

      <!-- Features Grid -->
      <section class="features-section">
        <h2>Key Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>OCR Text Extraction</h3>
            <p>Offline OCR using Tesseract.js - extract text from images and PDFs without sending data to servers</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Document Type Detection</h3>
            <p>Automatically identifies invoices, receipts, forms, IDs, passports, and more using pattern matching and AI</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Entity Recognition</h3>
            <p>Extracts dates, amounts, names, emails, phones, addresses, invoice numbers, and tax IDs</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Auto-Generated Forms</h3>
            <p>Automatically creates editable Vue forms from extracted document data with validation</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🌍</div>
            <h3>Multi-Language Support</h3>
            <p>Process documents in 100+ languages with Tesseract.js OCR engine</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Privacy-First</h3>
            <p>All processing happens locally in your browser - your documents never leave your device</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DocumentUpload, DocumentViewer, ExtractedDataForm, useDocIntelligence } from '@aivue/doc-intelligence';

// Initialize document intelligence
const {
  documents,
  totalDocuments,
  completedDocuments,
  failedDocuments,
  addDocuments,
  processDocument,
  removeDocument
} = useDocIntelligence({
  autoProcess: true,
  ocrLanguage: 'eng'
});

const selectedDocument = ref<any>(null);
const uploadError = ref('');

const processingCount = computed(() => {
  return documents.value.filter(doc => doc.status === 'processing').length;
});

const handleFilesSelected = async (files: File[]) => {
  uploadError.value = '';
  try {
    const newDocs = await addDocuments(files);
    if (newDocs.length > 0) {
      // Process each document
      for (const doc of newDocs) {
        await processDocument(doc.id);
      }
      // Select the first document
      selectedDocument.value = newDocs[0];
    }
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : 'Failed to process documents';
  }
};

const handleUploadError = (error: string) => {
  uploadError.value = error;
};

const selectDocument = (doc: any) => {
  selectedDocument.value = doc;
};

const removeDoc = (docId: string) => {
  if (selectedDocument.value?.id === docId) {
    selectedDocument.value = null;
  }
  removeDocument(docId);
};

const handleFormSubmit = (data: any) => {
  console.log('Form submitted:', data);
  alert('Form data saved! Check console for details.');
};

const handleFormReset = () => {
  console.log('Form reset');
};

const getDocumentIcon = (type: string): string => {
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

const formatDocumentType = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
</script>

<style scoped>
.doc-intelligence-demo {
  width: 100%;
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  margin: 0;
  line-height: 1.6;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

section {
  margin-bottom: 3rem;
}

section h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #718096;
  margin-bottom: 1.5rem;
}

.upload-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-alert {
  margin-top: 1rem;
  padding: 1rem;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  font-weight: 500;
}

.status-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.status-card {
  text-align: center;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  transition: transform 0.2s;
}

.status-card:hover {
  transform: translateY(-2px);
}

.status-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.status-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.status-label {
  color: #718096;
  font-size: 0.875rem;
}

.documents-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.document-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.document-card:hover {
  background: #edf2f7;
  transform: translateX(4px);
}

.document-card.status-completed {
  border-left: 4px solid #48bb78;
}

.document-card.status-processing {
  border-left: 4px solid #4299e1;
}

.document-card.status-error {
  border-left: 4px solid #f56565;
}

.doc-icon {
  font-size: 2.5rem;
}

.doc-info {
  flex: 1;
}

.doc-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.doc-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #718096;
}

.doc-type {
  padding: 0.125rem 0.5rem;
  background: #bee3f8;
  color: #2c5282;
  border-radius: 4px;
  font-weight: 500;
}

.progress-bar {
  margin-top: 0.5rem;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4299e1, #3182ce);
  transition: width 0.3s ease;
}

.error-text {
  margin-top: 0.5rem;
  color: #c53030;
  font-size: 0.875rem;
}

.doc-status {
  margin-left: auto;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #feebc8;
  color: #7c2d12;
}

.status-badge.processing {
  background: #bee3f8;
  color: #2c5282;
}

.status-badge.completed {
  background: #c6f6d5;
  color: #22543d;
}

.status-badge.error {
  background: #fed7d7;
  color: #742a2a;
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

.viewer-section,
.form-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.features-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #718096;
  line-height: 1.6;
  margin: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  section h2 {
    color: #f7fafc;
  }

  .section-description {
    color: #cbd5e0;
  }

  .upload-section,
  .status-section,
  .documents-section,
  .viewer-section,
  .form-section,
  .features-section {
    background: #1a202c;
  }

  .status-card,
  .document-card,
  .feature-card {
    background: #2d3748;
  }

  .document-card:hover {
    background: #374151;
  }

  .doc-name,
  .status-value,
  .feature-card h3 {
    color: #f7fafc;
  }

  .doc-meta,
  .status-label,
  .feature-card p {
    color: #cbd5e0;
  }

  .progress-bar {
    background: #4a5568;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .demo-container {
    padding: 1rem;
  }

  section h2 {
    font-size: 1.5rem;
  }

  .status-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>

