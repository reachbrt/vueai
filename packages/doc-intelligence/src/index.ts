// Components
export { default as DocumentUpload } from './components/DocumentUpload.vue';
export { default as DocumentViewer } from './components/DocumentViewer.vue';
export { default as ExtractedDataForm } from './components/ExtractedDataForm.vue';

// Composables
export { useDocIntelligence } from './composables/useDocIntelligence';
export type { ProcessedDocument, DocIntelligenceOptions } from './composables/useDocIntelligence';

// Utilities - OCR
export {
  initializeOCR,
  extractTextFromImage,
  extractTextFromPDF,
  terminateOCR,
  isOCRInitialized
} from './utils/ocr';
export type { OCRResult, OCROptions } from './utils/ocr';

// Utilities - Document Type Detection
export {
  detectDocumentType,
  detectDocumentTypeWithAI
} from './utils/documentTypeDetection';
export type { DocumentType, DocumentTypeResult } from './utils/documentTypeDetection';

// Utilities - Entity Extraction
export {
  extractDates,
  extractAmounts,
  extractEmails,
  extractPhones,
  extractInvoiceNumbers,
  extractTaxIds,
  extractNames,
  extractAddresses,
  extractAllEntities,
  extractEntitiesWithAI
} from './utils/entityExtraction';
export type { ExtractedEntity, ExtractedData } from './utils/entityExtraction';

// Vue plugin
import type { App } from 'vue';
import DocumentUpload from './components/DocumentUpload.vue';
import DocumentViewer from './components/DocumentViewer.vue';
import ExtractedDataForm from './components/ExtractedDataForm.vue';

export default {
  install(app: App) {
    app.component('DocumentUpload', DocumentUpload);
    app.component('DocumentViewer', DocumentViewer);
    app.component('ExtractedDataForm', ExtractedDataForm);
  }
};

