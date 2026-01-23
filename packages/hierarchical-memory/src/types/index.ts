/**
 * Hierarchical Memory Types
 * Inspired by H-MEM and HiAgent architectures
 */

/**
 * Node level in the hierarchy
 */
export enum NodeLevel {
  LEAF = 0,      // Raw data (documents, tables, chunks)
  L1 = 1,        // First-level summaries
  L2 = 2,        // Second-level summaries
  L3 = 3,        // Third-level summaries
  ROOT = 4,      // Top-level overview
}

/**
 * Node type classification
 */
export enum NodeType {
  DOCUMENT = 'document',
  TABLE = 'table',
  CHUNK = 'chunk',
  SUMMARY = 'summary',
  REFERENCE = 'reference',
}

/**
 * Memory node in the hierarchical tree
 */
export interface MemoryNode {
  id: string;
  level: NodeLevel;
  type: NodeType;
  content: string;
  summary?: string;
  metadata: NodeMetadata;
  children: string[];  // Child node IDs
  parent?: string;     // Parent node ID
  embedding?: number[]; // Optional semantic embedding
  score?: number;      // Relevance score (for retrieval)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Node metadata
 */
export interface NodeMetadata {
  title?: string;
  source?: string;
  tags?: string[];
  keywords?: string[];
  entities?: string[];
  importance?: number;  // 0-1 scale
  tokenCount?: number;
  language?: string;
  [key: string]: any;  // Extensible metadata
}

/**
 * Summarization configuration
 */
export interface SummarizationConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  customSummarizer?: (content: string, context?: string) => Promise<string>;
}

/**
 * Retrieval configuration
 */
export interface RetrievalConfig {
  topK?: number;           // Number of nodes to retrieve
  minScore?: number;       // Minimum relevance score
  levels?: NodeLevel[];    // Which levels to search
  useEmbeddings?: boolean; // Use semantic search
  expandContext?: boolean; // Include parent/child context
}

/**
 * Insertion options
 */
export interface InsertOptions {
  type: NodeType;
  metadata?: Partial<NodeMetadata>;
  parentId?: string;
  autoSummarize?: boolean;
  level?: NodeLevel;
}

/**
 * Promotion/Demotion options
 */
export interface PromotionOptions {
  targetLevel: NodeLevel;
  preserveChildren?: boolean;
  autoSummarize?: boolean;
}

/**
 * Query result
 */
export interface QueryResult {
  nodes: MemoryNode[];
  context: string;        // Formatted context for LLM
  metadata: {
    totalNodes: number;
    levels: NodeLevel[];
    avgScore: number;
  };
}

/**
 * Tree statistics
 */
export interface TreeStats {
  totalNodes: number;
  nodesByLevel: Record<NodeLevel, number>;
  nodesByType: Record<NodeType, number>;
  totalTokens: number;
  depth: number;
}

/**
 * Hierarchical Memory Tree configuration
 */
export interface HMemConfig {
  maxDepth?: number;              // Maximum tree depth
  maxChildrenPerNode?: number;    // Max children per node
  autoPromote?: boolean;          // Auto-promote important nodes
  autoSummarize?: boolean;        // Auto-summarize on insert
  summarization?: SummarizationConfig;
  retrieval?: RetrievalConfig;
  enableEmbeddings?: boolean;     // Enable semantic embeddings
  embeddingProvider?: 'openai' | 'custom';
  customEmbedder?: (text: string) => Promise<number[]>;
}

/**
 * Export options for LLM prompts
 */
export interface ExportOptions {
  format?: 'text' | 'json' | 'markdown';
  includeMetadata?: boolean;
  maxTokens?: number;
  levels?: NodeLevel[];
  nodeIds?: string[];
}

/**
 * Event types for the memory tree
 */
export type MemoryEventType =
  | 'node:inserted'
  | 'node:updated'
  | 'node:deleted'
  | 'node:promoted'
  | 'node:demoted'
  | 'tree:summarized'
  | 'tree:pruned';

/**
 * Memory event
 */
export interface MemoryEvent {
  type: MemoryEventType;
  nodeId: string;
  timestamp: Date;
  data?: any;
}

