<template>
  <div class="tree-node" :class="`level-${node.level}`">
    <div class="node-header" @click="$emit('toggle', node.id)">
      <span class="expand-icon" v-if="hasChildren">
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span class="node-icon">{{ getNodeIcon(node.type) }}</span>
      <span class="node-title">{{ node.metadata.title || node.id }}</span>
      <span class="node-level">L{{ node.level }}</span>
      <span class="node-tokens" v-if="node.metadata.tokenCount">
        {{ node.metadata.tokenCount }} tokens
      </span>
      <div class="node-actions">
        <button @click.stop="$emit('select', node.id)" class="action-btn" title="View">
          👁️
        </button>
        <button @click.stop="$emit('delete', node.id)" class="action-btn" title="Delete">
          🗑️
        </button>
      </div>
    </div>

    <div v-if="node.summary" class="node-summary">
      {{ truncate(node.summary, 100) }}
    </div>

    <div v-if="node.metadata.keywords?.length" class="node-keywords">
      <span v-for="keyword in node.metadata.keywords.slice(0, 5)" :key="keyword" class="keyword">
        {{ keyword }}
      </span>
    </div>

    <div v-if="isExpanded && hasChildren" class="node-children">
      <TreeNode
        v-for="childId in node.children"
        :key="childId"
        :node="nodesMap.get(childId)!"
        :nodes-map="nodesMap"
        :expanded-nodes="expandedNodes"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MemoryNode, NodeType } from '../types';

interface Props {
  node: MemoryNode;
  nodesMap: Map<string, MemoryNode>;
  expandedNodes: Set<string>;
}

const props = defineProps<Props>();

defineEmits<{
  toggle: [nodeId: string];
  select: [nodeId: string];
  delete: [nodeId: string];
}>();

const hasChildren = computed(() => props.node.children.length > 0);
const isExpanded = computed(() => props.expandedNodes.has(props.node.id));

const getNodeIcon = (type: NodeType): string => {
  const icons: Record<NodeType, string> = {
    document: '📄',
    table: '📊',
    chunk: '📝',
    summary: '📋',
    reference: '🔗',
  };
  return icons[type] || '📌';
};

const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
</script>

<style scoped>
.tree-node {
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.node-header:hover {
  background: #f8fafc;
}

.expand-icon {
  font-size: 0.75rem;
  color: #64748b;
  width: 1rem;
}

.node-icon {
  font-size: 1.25rem;
}

.node-title {
  flex: 1;
  font-weight: 500;
  color: #1e293b;
}

.node-level {
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #e0e7ff;
  color: #4338ca;
}

.level-0 .node-level {
  background: #dbeafe;
  color: #1e40af;
}

.level-1 .node-level {
  background: #d1fae5;
  color: #065f46;
}

.level-2 .node-level {
  background: #fef3c7;
  color: #92400e;
}

.level-3 .node-level {
  background: #fce7f3;
  color: #9f1239;
}

.level-4 .node-level {
  background: #e0e7ff;
  color: #4338ca;
}

.node-tokens {
  font-size: 0.75rem;
  color: #94a3b8;
}

.node-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.node-header:hover .node-actions {
  opacity: 1;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: scale(1.2);
}

.node-summary {
  margin-left: 2.5rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  background: #f8fafc;
  border-radius: 4px;
  margin-top: 0.25rem;
}

.node-keywords {
  margin-left: 2.5rem;
  margin-top: 0.25rem;
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.keyword {
  padding: 0.125rem 0.5rem;
  background: #f1f5f9;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #475569;
}

.node-children {
  margin-top: 0.5rem;
}
</style>

