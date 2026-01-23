/**
 * Vue composable for Hierarchical Memory
 */

import { ref, onUnmounted, type Ref } from 'vue';
import { HierarchicalMemory } from '../core/HierarchicalMemory';
import type {
  HMemConfig,
  MemoryNode,
  InsertOptions,
  QueryResult,
  TreeStats,
  NodeLevel,
  PromotionOptions,
  RetrievalConfig,
  ExportOptions,
} from '../types';

export interface UseHierarchicalMemoryReturn {
  // State
  memory: HierarchicalMemory;
  nodes: Ref<MemoryNode[]>;
  stats: Ref<TreeStats>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;

  // Methods
  insert: (content: string, options: InsertOptions) => Promise<string>;
  update: (nodeId: string, content: string) => Promise<void>;
  delete: (nodeId: string, deleteChildren?: boolean) => void;
  retrieve: (query: string, config?: RetrievalConfig) => Promise<QueryResult>;
  promote: (nodeId: string, options: PromotionOptions) => Promise<void>;
  demote: (nodeId: string, targetLevel: NodeLevel) => void;
  exportTree: (options?: ExportOptions) => string;
  clear: () => void;
  refresh: () => void;
}

export function useHierarchicalMemory(config?: HMemConfig): UseHierarchicalMemoryReturn {
  const memory = new HierarchicalMemory(config);
  const nodes = ref<MemoryNode[]>([]);
  const stats = ref<TreeStats>({
    totalNodes: 0,
    nodesByLevel: {} as any,
    nodesByType: {} as any,
    totalTokens: 0,
    depth: 0,
  });
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Refresh nodes and stats
  const refresh = () => {
    nodes.value = memory.getAllNodes();
    stats.value = memory.getStats();
  };

  // Initialize
  refresh();

  // Listen to memory events
  memory.on('node:inserted', refresh);
  memory.on('node:updated', refresh);
  memory.on('node:deleted', refresh);
  memory.on('node:promoted', refresh);
  memory.on('node:demoted', refresh);

  // Cleanup on unmount
  onUnmounted(() => {
    // Remove event listeners if needed
  });

  // Insert node
  const insert = async (content: string, options: InsertOptions): Promise<string> => {
    loading.value = true;
    error.value = null;

    try {
      const nodeId = await memory.insert(content, options);
      refresh();
      return nodeId;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update node
  const update = async (nodeId: string, content: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      await memory.update(nodeId, content);
      refresh();
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete node
  const deleteNode = (nodeId: string, deleteChildren = false): void => {
    try {
      memory.delete(nodeId, deleteChildren);
      refresh();
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  // Retrieve nodes
  const retrieve = async (query: string, config?: RetrievalConfig): Promise<QueryResult> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await memory.retrieve(query, config);
      return result;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Promote node
  const promote = async (nodeId: string, options: PromotionOptions): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      await memory.promote(nodeId, options);
      refresh();
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Demote node
  const demote = (nodeId: string, targetLevel: NodeLevel): void => {
    try {
      memory.demote(nodeId, targetLevel);
      refresh();
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  // Export tree
  const exportTree = (options?: ExportOptions): string => {
    return memory.export(options);
  };

  // Clear tree
  const clear = (): void => {
    memory.clear();
    refresh();
  };

  return {
    memory,
    nodes,
    stats,
    loading,
    error,
    insert,
    update,
    delete: deleteNode,
    retrieve,
    promote,
    demote,
    exportTree,
    clear,
    refresh,
  };
}

