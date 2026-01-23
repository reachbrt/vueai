/**
 * Utility functions for hierarchical memory
 */

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate approximate token count
 * Simple estimation: ~4 characters per token
 */
export function calculateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords = 10): string[] {
  // Simple keyword extraction: most frequent words (excluding common words)
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  const frequency = new Map<string, number>();
  for (const word of words) {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  }

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Chunk text into smaller pieces
 */
export function chunkText(text: string, maxChunkSize = 1000, overlap = 100): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }

  return chunks;
}

/**
 * Parse table from markdown or CSV
 */
export function parseTable(text: string, format: 'markdown' | 'csv' = 'markdown'): string[][] {
  if (format === 'csv') {
    return text.split('\n').map((row) => row.split(',').map((cell) => cell.trim()));
  }

  // Parse markdown table
  const lines = text.split('\n').filter((line) => line.trim());
  const rows: string[][] = [];

  for (const line of lines) {
    if (line.includes('|')) {
      const cells = line
        .split('|')
        .map((cell) => cell.trim())
        .filter((cell) => cell.length > 0);
      
      // Skip separator rows (e.g., |---|---|)
      if (!cells.every((cell) => /^-+$/.test(cell))) {
        rows.push(cells);
      }
    }
  }

  return rows;
}

/**
 * Format table as markdown
 */
export function formatTableAsMarkdown(rows: string[][]): string {
  if (rows.length === 0) return '';

  const colWidths = rows[0].map((_, colIndex) =>
    Math.max(...rows.map((row) => (row[colIndex] || '').length))
  );

  let markdown = '';

  // Header
  markdown += '| ' + rows[0].map((cell, i) => cell.padEnd(colWidths[i])).join(' | ') + ' |\n';

  // Separator
  markdown += '| ' + colWidths.map((width) => '-'.repeat(width)).join(' | ') + ' |\n';

  // Data rows
  for (let i = 1; i < rows.length; i++) {
    markdown += '| ' + rows[i].map((cell, j) => (cell || '').padEnd(colWidths[j])).join(' | ') + ' |\n';
  }

  return markdown;
}

/**
 * Truncate text to max length
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

