// RAG (Retrieval-Augmented Generation) utilities
// Provides document processing, chunking, and retrieval functionality

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  index: number;
  metadata?: Record<string, any>;
}

export interface RAGDocument {
  id: string;
  name: string;
  type: 'pdf' | 'url' | 'text';
  url?: string;
  content: string;
  chunks: DocumentChunk[];
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface RetrievalResult {
  chunks: DocumentChunk[];
  scores: number[];
  context: string;
}

export interface ChunkingOptions {
  chunkSize?: number; // Number of words per chunk
  overlap?: number; // Number of overlapping words between chunks
  preserveParagraphs?: boolean; // Try to keep paragraphs intact
}

/**
 * Split text into chunks for RAG processing
 */
export function chunkText(
  text: string,
  documentId: string,
  documentName: string,
  options: ChunkingOptions = {}
): DocumentChunk[] {
  const {
    chunkSize = 500,
    overlap = 50,
    preserveParagraphs = true
  } = options;

  const chunks: DocumentChunk[] = [];
  
  // Clean and normalize text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  if (preserveParagraphs) {
    // Split by paragraphs first
    const paragraphs = cleanText.split(/\n\n+/);
    let currentChunk = '';
    let chunkIndex = 0;
    
    for (const paragraph of paragraphs) {
      const words = paragraph.split(' ');
      
      if (currentChunk.split(' ').length + words.length > chunkSize) {
        // Save current chunk
        if (currentChunk.trim()) {
          chunks.push({
            id: `${documentId}-chunk-${chunkIndex}`,
            documentId,
            documentName,
            content: currentChunk.trim(),
            index: chunkIndex
          });
          chunkIndex++;
        }
        
        // Start new chunk with overlap
        const overlapWords = currentChunk.split(' ').slice(-overlap);
        currentChunk = overlapWords.join(' ') + ' ' + paragraph;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + paragraph;
      }
    }
    
    // Add final chunk
    if (currentChunk.trim()) {
      chunks.push({
        id: `${documentId}-chunk-${chunkIndex}`,
        documentId,
        documentName,
        content: currentChunk.trim(),
        index: chunkIndex
      });
    }
  } else {
    // Simple word-based chunking
    const words = cleanText.split(' ');
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunkWords = words.slice(i, i + chunkSize);
      const chunkIndex = Math.floor(i / (chunkSize - overlap));
      
      chunks.push({
        id: `${documentId}-chunk-${chunkIndex}`,
        documentId,
        documentName,
        content: chunkWords.join(' '),
        index: chunkIndex
      });
    }
  }
  
  return chunks;
}

/**
 * Calculate TF-IDF score for keyword-based retrieval
 */
function calculateTFIDF(query: string, chunk: string, allChunks: DocumentChunk[]): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const chunkWords = chunk.toLowerCase().split(/\s+/);
  const chunkWordSet = new Set(chunkWords);
  
  let score = 0;
  
  for (const word of queryWords) {
    if (word.length < 3) continue; // Skip very short words
    
    // Term Frequency (TF)
    const tf = chunkWords.filter(w => w === word).length / chunkWords.length;
    
    // Inverse Document Frequency (IDF)
    const docsWithTerm = allChunks.filter(c => 
      c.content.toLowerCase().includes(word)
    ).length;
    const idf = Math.log(allChunks.length / (docsWithTerm + 1));
    
    // TF-IDF score
    score += tf * idf;
    
    // Bonus for exact word match
    if (chunkWordSet.has(word)) {
      score += 0.5;
    }
  }
  
  return score;
}

/**
 * Retrieve relevant chunks based on query
 */
export function retrieveRelevantChunks(
  query: string,
  documents: RAGDocument[],
  topK: number = 3
): RetrievalResult {
  // Collect all chunks
  const allChunks: DocumentChunk[] = [];
  documents.forEach(doc => {
    allChunks.push(...doc.chunks);
  });
  
  if (allChunks.length === 0) {
    return { chunks: [], scores: [], context: '' };
  }

  // Score each chunk
  const scoredChunks = allChunks.map(chunk => ({
    chunk,
    score: calculateTFIDF(query, chunk.content, allChunks)
  }));

  // Sort by score and take top K
  const topChunks = scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Build context string
  const context = topChunks
    .map(({ chunk }) => `[From ${chunk.documentName}]:\n${chunk.content}`)
    .join('\n\n');

  return {
    chunks: topChunks.map(c => c.chunk),
    scores: topChunks.map(c => c.score),
    context
  };
}

/**
 * Build RAG context for AI prompt
 */
export function buildRAGContext(retrievalResult: RetrievalResult): string {
  if (retrievalResult.chunks.length === 0) {
    return '';
  }

  return `Context from knowledge base:\n\n${retrievalResult.context}\n\nPlease use the above context to answer the following question. If the context doesn't contain relevant information, you can use your general knowledge but mention that the information is not from the provided documents.`;
}

/**
 * Fetch content from URL
 */
export async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Simple HTML to text conversion
    // Remove script and style tags
    let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Remove HTML tags
    text = text.replace(/<[^>]+>/g, ' ');

    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');

    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  } catch (error) {
    throw new Error(`Failed to fetch URL content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text from text file
 */
export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Generate unique document ID
 */
export function generateDocumentId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokenCount(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Validate document size
 */
export function validateDocumentSize(text: string, maxTokens: number = 100000): boolean {
  const tokens = estimateTokenCount(text);
  return tokens <= maxTokens;
}

