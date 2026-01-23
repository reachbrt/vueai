/**
 * Hierarchical Memory Tree Implementation
 * Multi-level tree of summaries and references for LLM context management
 */

import type {
  MemoryNode,
  NodeLevel,
  NodeType,
  HMemConfig,
  InsertOptions,
  PromotionOptions,
  RetrievalConfig,
  QueryResult,
  TreeStats,
  ExportOptions,
  MemoryEvent,
  MemoryEventType,
} from '../types';
import { NodeLevel as Level } from '../types';
import { generateId, calculateTokens, cosineSimilarity } from '../utils/helpers';

export class HierarchicalMemory {
  private nodes: Map<string, MemoryNode> = new Map();
  private rootId: string | null = null;
  private config: Required<HMemConfig>;
  private eventListeners: Map<MemoryEventType, Set<(event: MemoryEvent) => void>> = new Map();

  constructor(config: HMemConfig = {}) {
    this.config = {
      maxDepth: config.maxDepth ?? 4,
      maxChildrenPerNode: config.maxChildrenPerNode ?? 10,
      autoPromote: config.autoPromote ?? false,
      autoSummarize: config.autoSummarize ?? true,
      summarization: config.summarization ?? {
        provider: 'openai',
        model: 'gpt-4-turbo-preview',
        maxTokens: 500,
        temperature: 0.3,
      },
      retrieval: config.retrieval ?? {
        topK: 5,
        minScore: 0.5,
        useEmbeddings: false,
        expandContext: true,
      },
      enableEmbeddings: config.enableEmbeddings ?? false,
      embeddingProvider: config.embeddingProvider ?? 'openai',
      customEmbedder: config.customEmbedder ?? (async () => []),
    };

    // Initialize root node
    this.initializeRoot();
  }

  /**
   * Initialize the root node
   */
  private initializeRoot(): void {
    const root: MemoryNode = {
      id: generateId(),
      level: Level.ROOT,
      type: 'summary' as NodeType,
      content: 'Root of hierarchical memory tree',
      summary: 'Root node',
      metadata: {
        title: 'Root',
        importance: 1,
      },
      children: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.nodes.set(root.id, root);
    this.rootId = root.id;
  }

  /**
   * Insert a new node into the tree
   */
  async insert(content: string, options: InsertOptions): Promise<string> {
    const nodeId = generateId();
    const level = options.level ?? Level.LEAF;
    const parentId = options.parentId ?? this.rootId!;

    const node: MemoryNode = {
      id: nodeId,
      level,
      type: options.type,
      content,
      metadata: {
        tokenCount: calculateTokens(content),
        ...options.metadata,
      },
      children: [],
      parent: parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Generate summary if auto-summarize is enabled
    if (this.config.autoSummarize && options.autoSummarize !== false) {
      node.summary = await this.summarizeContent(content);
    }

    // Generate embedding if enabled
    if (this.config.enableEmbeddings) {
      node.embedding = await this.generateEmbedding(content);
    }

    // Add to tree
    this.nodes.set(nodeId, node);

    // Update parent
    const parent = this.nodes.get(parentId);
    if (parent) {
      parent.children.push(nodeId);
      parent.updatedAt = new Date();
    }

    this.emit('node:inserted', nodeId, { node });

    return nodeId;
  }

  /**
   * Get a node by ID
   */
  get(nodeId: string): MemoryNode | undefined {
    return this.nodes.get(nodeId);
  }

  /**
   * Update a node
   */
  async update(nodeId: string, content: string, updateSummary = true): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    node.content = content;
    node.metadata.tokenCount = calculateTokens(content);
    node.updatedAt = new Date();

    if (updateSummary && this.config.autoSummarize) {
      node.summary = await this.summarizeContent(content);
    }

    if (this.config.enableEmbeddings) {
      node.embedding = await this.generateEmbedding(content);
    }

    this.emit('node:updated', nodeId, { node });
  }

  /**
   * Delete a node and optionally its children
   */
  delete(nodeId: string, deleteChildren = false): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    // Delete children if requested
    if (deleteChildren) {
      for (const childId of node.children) {
        this.delete(childId, true);
      }
    }

    // Remove from parent's children
    if (node.parent) {
      const parent = this.nodes.get(node.parent);
      if (parent) {
        parent.children = parent.children.filter((id) => id !== nodeId);
      }
    }

    this.nodes.delete(nodeId);
    this.emit('node:deleted', nodeId);
  }

  /**
   * Promote a node to a higher level
   */
  async promote(nodeId: string, options: PromotionOptions): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    if (options.targetLevel <= node.level) {
      throw new Error('Target level must be higher than current level');
    }

    node.level = options.targetLevel;
    node.updatedAt = new Date();

    if (options.autoSummarize && this.config.autoSummarize) {
      node.summary = await this.summarizeContent(node.content);
    }

    this.emit('node:promoted', nodeId, { oldLevel: node.level, newLevel: options.targetLevel });
  }

  /**
   * Demote a node to a lower level
   */
  demote(nodeId: string, targetLevel: NodeLevel): void {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    if (targetLevel >= node.level) {
      throw new Error('Target level must be lower than current level');
    }

    const oldLevel = node.level;
    node.level = targetLevel;
    node.updatedAt = new Date();

    this.emit('node:demoted', nodeId, { oldLevel, newLevel: targetLevel });
  }

  /**
   * Retrieve relevant nodes based on query
   */
  async retrieve(query: string, config?: RetrievalConfig): Promise<QueryResult> {
    const retrievalConfig = { ...this.config.retrieval, ...config };
    const queryEmbedding = this.config.enableEmbeddings
      ? await this.generateEmbedding(query)
      : undefined;

    let candidates: MemoryNode[] = Array.from(this.nodes.values());

    // Filter by levels if specified
    if (retrievalConfig.levels) {
      candidates = candidates.filter((node) => retrievalConfig.levels!.includes(node.level));
    }

    // Calculate relevance scores
    for (const node of candidates) {
      if (queryEmbedding && node.embedding) {
        node.score = cosineSimilarity(queryEmbedding, node.embedding);
      } else {
        // Simple keyword matching fallback
        node.score = this.calculateKeywordScore(query, node);
      }
    }

    // Filter by minimum score
    candidates = candidates.filter((node) => (node.score ?? 0) >= (retrievalConfig.minScore ?? 0));

    // Sort by score
    candidates.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    // Take top K
    const topNodes = candidates.slice(0, retrievalConfig.topK ?? 5);

    // Expand context if requested
    if (retrievalConfig.expandContext) {
      const expandedNodes = this.expandContext(topNodes);
      return this.buildQueryResult(expandedNodes);
    }

    return this.buildQueryResult(topNodes);
  }

  /**
   * Summarize content using configured provider
   */
  private async summarizeContent(content: string): Promise<string> {
    const { summarization } = this.config;

    if (summarization.customSummarizer) {
      return summarization.customSummarizer(content);
    }

    // Default: use OpenAI or Anthropic
    if (summarization.provider === 'openai') {
      return this.summarizeWithOpenAI(content);
    } else if (summarization.provider === 'anthropic') {
      return this.summarizeWithAnthropic(content);
    }

    // Fallback: simple truncation
    return content.slice(0, 200) + '...';
  }

  /**
   * Summarize with OpenAI
   */
  private async summarizeWithOpenAI(content: string): Promise<string> {
    const { summarization } = this.config;
    if (!summarization.apiKey) {
      throw new Error('OpenAI API key required for summarization');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${summarization.apiKey}`,
      },
      body: JSON.stringify({
        model: summarization.model || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Summarize the following content concisely, preserving key information.',
          },
          { role: 'user', content },
        ],
        max_tokens: summarization.maxTokens || 500,
        temperature: summarization.temperature || 0.3,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Summarize with Anthropic
   */
  private async summarizeWithAnthropic(content: string): Promise<string> {
    const { summarization } = this.config;
    if (!summarization.apiKey) {
      throw new Error('Anthropic API key required for summarization');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': summarization.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: summarization.model || 'claude-3-5-sonnet-20241022',
        max_tokens: summarization.maxTokens || 500,
        messages: [
          {
            role: 'user',
            content: `Summarize the following content concisely:\n\n${content}`,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.content[0].text;
  }

  /**
   * Generate embedding for text
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    if (this.config.customEmbedder) {
      return this.config.customEmbedder(text);
    }

    if (this.config.embeddingProvider === 'openai') {
      return this.generateOpenAIEmbedding(text);
    }

    // Fallback: return empty array
    return [];
  }

  /**
   * Generate OpenAI embedding
   */
  private async generateOpenAIEmbedding(text: string): Promise<number[]> {
    const { summarization } = this.config;
    if (!summarization.apiKey) {
      throw new Error('OpenAI API key required for embeddings');
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${summarization.apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    const data = await response.json();
    return data.data[0].embedding;
  }

  /**
   * Calculate keyword-based relevance score
   */
  private calculateKeywordScore(query: string, node: MemoryNode): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentWords = (node.content + ' ' + (node.summary || '')).toLowerCase().split(/\s+/);

    let matches = 0;
    for (const word of queryWords) {
      if (contentWords.some((w) => w.includes(word) || word.includes(w))) {
        matches++;
      }
    }

    return matches / queryWords.length;
  }

  /**
   * Expand context by including parent and children
   */
  private expandContext(nodes: MemoryNode[]): MemoryNode[] {
    const expanded = new Set<string>();
    const result: MemoryNode[] = [];

    for (const node of nodes) {
      // Add the node itself
      if (!expanded.has(node.id)) {
        expanded.add(node.id);
        result.push(node);
      }

      // Add parent
      if (node.parent) {
        const parent = this.nodes.get(node.parent);
        if (parent && !expanded.has(parent.id)) {
          expanded.add(parent.id);
          result.push(parent);
        }
      }

      // Add children
      for (const childId of node.children) {
        const child = this.nodes.get(childId);
        if (child && !expanded.has(child.id)) {
          expanded.add(child.id);
          result.push(child);
        }
      }
    }

    return result;
  }

  /**
   * Build query result from nodes
   */
  private buildQueryResult(nodes: MemoryNode[]): QueryResult {
    const levels = new Set(nodes.map((n) => n.level));
    const avgScore = nodes.reduce((sum, n) => sum + (n.score ?? 0), 0) / nodes.length;

    const context = this.formatNodesForLLM(nodes);

    return {
      nodes,
      context,
      metadata: {
        totalNodes: nodes.length,
        levels: Array.from(levels),
        avgScore,
      },
    };
  }

  /**
   * Format nodes for LLM consumption
   */
  private formatNodesForLLM(nodes: MemoryNode[]): string {
    let formatted = '# Hierarchical Memory Context\n\n';

    // Group by level
    const byLevel = new Map<NodeLevel, MemoryNode[]>();
    for (const node of nodes) {
      if (!byLevel.has(node.level)) {
        byLevel.set(node.level, []);
      }
      byLevel.get(node.level)!.push(node);
    }

    // Format each level
    for (const [level, levelNodes] of byLevel.entries()) {
      formatted += `## Level ${level}\n\n`;
      for (const node of levelNodes) {
        formatted += `### ${node.metadata.title || node.id}\n`;
        formatted += `${node.summary || node.content}\n\n`;
        if (node.metadata.keywords?.length) {
          formatted += `**Keywords:** ${node.metadata.keywords.join(', ')}\n\n`;
        }
      }
    }

    return formatted;
  }

  /**
   * Export tree for LLM prompts
   */
  export(options: ExportOptions = {}): string {
    const format = options.format || 'markdown';

    let nodes: MemoryNode[];
    if (options.nodeIds) {
      nodes = options.nodeIds.map((id) => this.nodes.get(id)).filter(Boolean) as MemoryNode[];
    } else if (options.levels) {
      nodes = Array.from(this.nodes.values()).filter((n) => options.levels!.includes(n.level));
    } else {
      nodes = Array.from(this.nodes.values());
    }

    if (format === 'json') {
      return JSON.stringify(nodes, null, 2);
    } else if (format === 'text') {
      return nodes.map((n) => n.content).join('\n\n');
    } else {
      return this.formatNodesForLLM(nodes);
    }
  }

  /**
   * Get tree statistics
   */
  getStats(): TreeStats {
    const nodes = Array.from(this.nodes.values());
    const nodesByLevel: Record<NodeLevel, number> = {} as any;
    const nodesByType: Record<NodeType, number> = {} as any;
    let totalTokens = 0;
    let maxDepth = 0;

    for (const node of nodes) {
      nodesByLevel[node.level] = (nodesByLevel[node.level] || 0) + 1;
      nodesByType[node.type] = (nodesByType[node.type] || 0) + 1;
      totalTokens += node.metadata.tokenCount || 0;
      maxDepth = Math.max(maxDepth, node.level);
    }

    return {
      totalNodes: nodes.length,
      nodesByLevel,
      nodesByType,
      totalTokens,
      depth: maxDepth,
    };
  }

  /**
   * Emit event
   */
  private emit(type: MemoryEventType, nodeId: string, data?: any): void {
    const event: MemoryEvent = {
      type,
      nodeId,
      timestamp: new Date(),
      data,
    };

    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
  }

  /**
   * Add event listener
   */
  on(type: MemoryEventType, listener: (event: MemoryEvent) => void): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    this.eventListeners.get(type)!.add(listener);
  }

  /**
   * Remove event listener
   */
  off(type: MemoryEventType, listener: (event: MemoryEvent) => void): void {
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * Clear all nodes except root
   */
  clear(): void {
    this.nodes.clear();
    this.initializeRoot();
  }

  /**
   * Get all nodes
   */
  getAllNodes(): MemoryNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get root node
   */
  getRoot(): MemoryNode | undefined {
    return this.rootId ? this.nodes.get(this.rootId) : undefined;
  }
}

