/**
 * @aivue/hierarchical-memory
 * Hierarchical memory trees (H-MEM style) for LLM tools and agents
 */

// Import styles
import './styles/hierarchical-memory.css';

// Export types
export type {
  MemoryNode,
  NodeMetadata,
  SummarizationConfig,
  RetrievalConfig,
  InsertOptions,
  PromotionOptions,
  QueryResult,
  TreeStats,
  HMemConfig,
  ExportOptions,
  MemoryEventType,
  MemoryEvent,
} from './types';

export { NodeLevel, NodeType } from './types';

// Export core class
export { HierarchicalMemory } from './core/HierarchicalMemory';

// Export composable
export { useHierarchicalMemory } from './composables/useHierarchicalMemory';
export type { UseHierarchicalMemoryReturn } from './composables/useHierarchicalMemory';

// Export components
export { default as MemoryTreeViewer } from './components/MemoryTreeViewer.vue';
export { default as TreeNode } from './components/TreeNode.vue';

// Export utilities
export {
  generateId,
  calculateTokens,
  cosineSimilarity,
  extractKeywords,
  chunkText,
  parseTable,
  formatTableAsMarkdown,
  truncateText,
} from './utils/helpers';

// Vue plugin
import type { App } from 'vue';

export interface HierarchicalMemoryPluginOptions {
  // Global configuration options
}

export const HierarchicalMemoryPlugin = {
  install(app: App, options?: HierarchicalMemoryPluginOptions) {
    // Register components globally if needed
    // app.component('MemoryTreeViewer', MemoryTreeViewer);
    
    if (options) {
      // Handle plugin options
    }
  },
};

