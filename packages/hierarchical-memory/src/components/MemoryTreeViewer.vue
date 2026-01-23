<template>
  <div class="memory-tree-viewer">
    <div class="tree-header">
      <h3>Hierarchical Memory Tree</h3>
      <div class="tree-stats">
        <span class="stat">
          <strong>{{ stats.totalNodes }}</strong> nodes
        </span>
        <span class="stat">
          <strong>{{ stats.depth }}</strong> levels
        </span>
        <span class="stat">
          <strong>{{ stats.totalTokens }}</strong> tokens
        </span>
      </div>
    </div>

    <div class="tree-controls">
      <button @click="expandAll" class="btn btn-sm">Expand All</button>
      <button @click="collapseAll" class="btn btn-sm">Collapse All</button>
      <button @click="$emit('refresh')" class="btn btn-sm">Refresh</button>
    </div>

    <div class="tree-container">
      <div v-if="rootNode" class="tree-node-wrapper">
        <TreeNode
          :node="rootNode"
          :nodes-map="nodesMap"
          :expanded-nodes="expandedNodes"
          @toggle="toggleNode"
          @select="selectNode"
          @delete="deleteNode"
        />
      </div>
      <div v-else class="empty-state">
        No memory tree available
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { MemoryNode, TreeStats } from '../types';
import TreeNode from './TreeNode.vue';

interface Props {
  nodes: MemoryNode[];
  stats: TreeStats;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  refresh: [];
  select: [nodeId: string];
  delete: [nodeId: string];
}>();

const expandedNodes = ref<Set<string>>(new Set());

// Create nodes map for quick lookup
const nodesMap = computed(() => {
  const map = new Map<string, MemoryNode>();
  for (const node of props.nodes) {
    map.set(node.id, node);
  }
  return map;
});

// Find root node
const rootNode = computed(() => {
  return props.nodes.find((node) => !node.parent);
});

// Toggle node expansion
const toggleNode = (nodeId: string) => {
  if (expandedNodes.value.has(nodeId)) {
    expandedNodes.value.delete(nodeId);
  } else {
    expandedNodes.value.add(nodeId);
  }
};

// Expand all nodes
const expandAll = () => {
  expandedNodes.value = new Set(props.nodes.map((n) => n.id));
};

// Collapse all nodes
const collapseAll = () => {
  expandedNodes.value.clear();
};

// Select node
const selectNode = (nodeId: string) => {
  emit('select', nodeId);
};

// Delete node
const deleteNode = (nodeId: string) => {
  emit('delete', nodeId);
};

// Auto-expand root on mount
watch(
  () => rootNode.value,
  (node) => {
    if (node) {
      expandedNodes.value.add(node.id);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.memory-tree-viewer {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.tree-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1e293b;
}

.tree-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  font-size: 0.875rem;
  color: #64748b;
}

.stat strong {
  color: #1e293b;
  font-size: 1rem;
}

.tree-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.tree-container {
  max-height: 600px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}
</style>

