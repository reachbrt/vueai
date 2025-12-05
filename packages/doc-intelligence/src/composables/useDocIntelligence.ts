import { ref, computed } from 'vue';
import { extractTextFromImage, extractTextFromPDF, initializeOCR, terminateOCR } from '../utils/ocr';
import { detectDocumentType, detectDocumentTypeWithAI } from '../utils/documentTypeDetection';
import { extractAllEntities, extractEntitiesWithAI } from '../utils/entityExtraction';
import type { OCRResult } from '../utils/ocr';
import type { DocumentTypeResult } from '../utils/documentTypeDetection';
import type { ExtractedData } from '../utils/entityExtraction';

export interface ProcessedDocument {
  id: string;
  file: File;
  url: string;
  ocrResult?: OCRResult | OCRResult[];
  documentType?: DocumentTypeResult;
  extractedData?: ExtractedData;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  progress: number;
}

export interface DocIntelligenceOptions {
  useAI?: boolean;
  aiClient?: any;
  ocrLanguage?: string;
  autoProcess?: boolean;
}

export function useDocIntelligence(options: DocIntelligenceOptions = {}) {
  const documents = ref<ProcessedDocument[]>([]);
  const isProcessing = ref(false);
  const currentDocument = ref<ProcessedDocument | null>(null);

  const totalDocuments = computed(() => documents.value.length);
  const completedDocuments = computed(() => 
    documents.value.filter(doc => doc.status === 'completed').length
  );
  const failedDocuments = computed(() => 
    documents.value.filter(doc => doc.status === 'error').length
  );

  /**
   * Add documents to the processing queue
   */
  const addDocuments = async (files: File[]) => {
    const newDocs: ProcessedDocument[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0
    }));

    documents.value.push(...newDocs);

    if (options.autoProcess) {
      await processAllDocuments();
    }

    return newDocs;
  };

  /**
   * Process a single document
   */
  const processDocument = async (documentId: string): Promise<ProcessedDocument | null> => {
    const doc = documents.value.find(d => d.id === documentId);
    if (!doc) return null;

    doc.status = 'processing';
    doc.progress = 0;
    currentDocument.value = doc;
    isProcessing.value = true;

    try {
      // Step 1: Initialize OCR (10%)
      await initializeOCR({ language: options.ocrLanguage || 'eng' });
      doc.progress = 10;

      // Step 2: Extract text using OCR (40%)
      let extractedText = '';
      if (doc.file.type.includes('pdf')) {
        const results = await extractTextFromPDF(doc.file);
        doc.ocrResult = results;
        extractedText = results.map(r => r.text).join('\n');
      } else if (doc.file.type.includes('image')) {
        const result = await extractTextFromImage(doc.file);
        doc.ocrResult = result;
        extractedText = result.text;
      }
      doc.progress = 50;

      // Step 3: Detect document type (20%)
      if (options.useAI && options.aiClient) {
        doc.documentType = await detectDocumentTypeWithAI(extractedText, options.aiClient);
      } else {
        doc.documentType = detectDocumentType(extractedText);
      }
      doc.progress = 70;

      // Step 4: Extract entities (30%)
      if (options.useAI && options.aiClient) {
        doc.extractedData = await extractEntitiesWithAI(extractedText, options.aiClient);
      } else {
        doc.extractedData = extractAllEntities(extractedText);
      }
      doc.progress = 100;

      doc.status = 'completed';
      return doc;
    } catch (error) {
      doc.status = 'error';
      doc.error = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Document processing failed:', error);
      return doc;
    } finally {
      isProcessing.value = false;
      currentDocument.value = null;
    }
  };

  /**
   * Process all pending documents
   */
  const processAllDocuments = async () => {
    const pendingDocs = documents.value.filter(doc => doc.status === 'pending');
    
    for (const doc of pendingDocs) {
      await processDocument(doc.id);
    }
  };

  /**
   * Remove a document
   */
  const removeDocument = (documentId: string) => {
    const index = documents.value.findIndex(d => d.id === documentId);
    if (index !== -1) {
      const doc = documents.value[index];
      URL.revokeObjectURL(doc.url);
      documents.value.splice(index, 1);
    }
  };

  /**
   * Clear all documents
   */
  const clearAllDocuments = () => {
    documents.value.forEach(doc => URL.revokeObjectURL(doc.url));
    documents.value = [];
  };

  /**
   * Get document by ID
   */
  const getDocument = (documentId: string): ProcessedDocument | undefined => {
    return documents.value.find(d => d.id === documentId);
  };

  /**
   * Cleanup resources
   */
  const cleanup = async () => {
    clearAllDocuments();
    await terminateOCR();
  };

  return {
    // State
    documents,
    isProcessing,
    currentDocument,
    totalDocuments,
    completedDocuments,
    failedDocuments,

    // Methods
    addDocuments,
    processDocument,
    processAllDocuments,
    removeDocument,
    clearAllDocuments,
    getDocument,
    cleanup
  };
}

