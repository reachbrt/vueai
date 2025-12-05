// useRAG composable - Knowledge base management for RAG
import { ref, computed, watch, Ref } from 'vue';
import {
  RAGDocument,
  DocumentChunk,
  RetrievalResult,
  chunkText,
  retrieveRelevantChunks,
  buildRAGContext,
  fetchUrlContent,
  extractTextFromFile,
  generateDocumentId,
  validateDocumentSize,
  ChunkingOptions
} from '../utils/rag';

export interface UseRAGOptions {
  chunkSize?: number;
  overlap?: number;
  topK?: number;
  storageKey?: string;
  maxDocumentTokens?: number;
  autoSave?: boolean;
}

export interface UseRAGReturn {
  // State
  knowledgeBase: Ref<RAGDocument[]>;
  isProcessing: Ref<boolean>;
  error: Ref<Error | null>;
  
  // Methods
  addDocument: (file: File) => Promise<RAGDocument>;
  addUrl: (url: string, name?: string) => Promise<RAGDocument>;
  addText: (text: string, name: string) => Promise<RAGDocument>;
  removeDocument: (documentId: string) => void;
  clearKnowledgeBase: () => void;
  retrieveContext: (query: string, topK?: number) => RetrievalResult;
  getDocument: (documentId: string) => RAGDocument | undefined;
  
  // Computed
  totalDocuments: Ref<number>;
  totalChunks: Ref<number>;
}

/**
 * Composable for RAG (Retrieval-Augmented Generation) functionality
 * Manages knowledge base, document processing, and context retrieval
 */
export function useRAG(options: UseRAGOptions = {}): UseRAGReturn {
  const {
    chunkSize = 500,
    overlap = 50,
    topK = 3,
    storageKey = 'aivue-rag-knowledge-base',
    maxDocumentTokens = 100000,
    autoSave = true
  } = options;
  
  // State
  const knowledgeBase = ref<RAGDocument[]>([]);
  const isProcessing = ref(false);
  const error = ref<Error | null>(null);
  
  // Load from storage on initialization
  if (storageKey && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        knowledgeBase.value = parsed.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt)
        }));
      }
    } catch (err) {
      console.error('Failed to load knowledge base from storage:', err);
    }
  }
  
  // Auto-save to storage when knowledge base changes
  if (autoSave && storageKey && typeof window !== 'undefined') {
    watch(knowledgeBase, (newValue) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newValue));
      } catch (err) {
        console.error('Failed to save knowledge base to storage:', err);
      }
    }, { deep: true });
  }
  
  // Computed properties
  const totalDocuments = computed(() => knowledgeBase.value.length);
  const totalChunks = computed(() => 
    knowledgeBase.value.reduce((sum, doc) => sum + doc.chunks.length, 0)
  );
  
  /**
   * Process document and add to knowledge base
   */
  async function processDocument(
    content: string,
    name: string,
    type: 'pdf' | 'url' | 'text',
    url?: string
  ): Promise<RAGDocument> {
    // Validate document size
    if (!validateDocumentSize(content, maxDocumentTokens)) {
      throw new Error(`Document is too large. Maximum ${maxDocumentTokens} tokens allowed.`);
    }
    
    const documentId = generateDocumentId();
    
    // Chunk the document
    const chunks = chunkText(content, documentId, name, {
      chunkSize,
      overlap,
      preserveParagraphs: true
    });
    
    const document: RAGDocument = {
      id: documentId,
      name,
      type,
      url,
      content,
      chunks,
      createdAt: new Date()
    };
    
    knowledgeBase.value.push(document);
    
    return document;
  }
  
  /**
   * Add document from file
   */
  async function addDocument(file: File): Promise<RAGDocument> {
    isProcessing.value = true;
    error.value = null;
    
    try {
      let content: string;
      
      if (file.type === 'application/pdf') {
        // For PDF files, we'll need to use @aivue/doc-intelligence
        // For now, throw an error with instructions
        throw new Error(
          'PDF processing requires @aivue/doc-intelligence. ' +
          'Please install it: npm install @aivue/doc-intelligence'
        );
      } else if (file.type.startsWith('text/') || 
                 file.name.endsWith('.txt') || 
                 file.name.endsWith('.md')) {
        // Text files
        content = await extractTextFromFile(file);
      } else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }
      
      const document = await processDocument(content, file.name, 'text');
      
      return document;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to process document');
      throw error.value;
    } finally {
      isProcessing.value = false;
    }
  }

  /**
   * Add document from URL
   */
  async function addUrl(url: string, name?: string): Promise<RAGDocument> {
    isProcessing.value = true;
    error.value = null;

    try {
      const content = await fetchUrlContent(url);
      const documentName = name || new URL(url).hostname;

      const document = await processDocument(content, documentName, 'url', url);

      return document;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch URL');
      throw error.value;
    } finally {
      isProcessing.value = false;
    }
  }

  /**
   * Add document from text
   */
  async function addText(text: string, name: string): Promise<RAGDocument> {
    isProcessing.value = true;
    error.value = null;

    try {
      const document = await processDocument(text, name, 'text');

      return document;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to process text');
      throw error.value;
    } finally {
      isProcessing.value = false;
    }
  }

  /**
   * Remove document from knowledge base
   */
  function removeDocument(documentId: string): void {
    const index = knowledgeBase.value.findIndex(doc => doc.id === documentId);
    if (index !== -1) {
      knowledgeBase.value.splice(index, 1);
    }
  }

  /**
   * Clear all documents from knowledge base
   */
  function clearKnowledgeBase(): void {
    knowledgeBase.value = [];
    if (storageKey && typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }

  /**
   * Retrieve relevant context for a query
   */
  function retrieveContext(query: string, customTopK?: number): RetrievalResult {
    const k = customTopK || topK;
    return retrieveRelevantChunks(query, knowledgeBase.value, k);
  }

  /**
   * Get document by ID
   */
  function getDocument(documentId: string): RAGDocument | undefined {
    return knowledgeBase.value.find(doc => doc.id === documentId);
  }

  return {
    // State
    knowledgeBase,
    isProcessing,
    error,

    // Methods
    addDocument,
    addUrl,
    addText,
    removeDocument,
    clearKnowledgeBase,
    retrieveContext,
    getDocument,

    // Computed
    totalDocuments,
    totalChunks
  };
}

