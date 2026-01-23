<template>
  <div class="mcp-tool-executor">
    <div v-if="!connected" class="mcp-status">
      <p class="mcp-status-message">Not connected to MCP server</p>
      <button @click="$emit('connect')" class="mcp-btn mcp-btn-primary">
        Connect
      </button>
    </div>

    <div v-else class="mcp-tool-container">
      <div class="mcp-tool-header">
        <h3>Available Tools</h3>
        <button @click="$emit('refresh')" class="mcp-btn mcp-btn-secondary" :disabled="loading">
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <div v-if="tools.length === 0" class="mcp-empty">
        <p>No tools available</p>
      </div>

      <div v-else class="mcp-tools-list">
        <div
          v-for="tool in tools"
          :key="tool.name"
          class="mcp-tool-card"
          :class="{ 'mcp-tool-selected': selectedTool?.name === tool.name }"
          @click="selectTool(tool)"
        >
          <h4 class="mcp-tool-name">{{ tool.name }}</h4>
          <p v-if="tool.description" class="mcp-tool-description">
            {{ tool.description }}
          </p>
        </div>
      </div>

      <div v-if="selectedTool" class="mcp-tool-executor-panel">
        <h4>Execute: {{ selectedTool.name }}</h4>
        
        <div class="mcp-tool-inputs">
          <div
            v-for="(prop, key) in selectedTool.inputSchema.properties"
            :key="key"
            class="mcp-input-group"
          >
            <label :for="`input-${key}`" class="mcp-label">
              {{ key }}
              <span v-if="isRequired(key)" class="mcp-required">*</span>
            </label>
            <input
              :id="`input-${key}`"
              v-model="toolInputs[key]"
              type="text"
              class="mcp-input"
              :placeholder="prop.description || `Enter ${key}`"
            />
          </div>
        </div>

        <div class="mcp-tool-actions">
          <button
            @click="executeTool"
            class="mcp-btn mcp-btn-primary"
            :disabled="executing"
          >
            {{ executing ? 'Executing...' : 'Execute' }}
          </button>
          <button
            @click="clearSelection"
            class="mcp-btn mcp-btn-secondary"
          >
            Cancel
          </button>
        </div>

        <div v-if="result" class="mcp-result">
          <h5>Result:</h5>
          <div v-if="result.isError" class="mcp-error">
            <p>Error occurred during execution</p>
          </div>
          <div v-for="(content, idx) in result.content" :key="idx" class="mcp-result-content">
            <div v-if="content.type === 'text'" class="mcp-text-content">
              {{ content.text }}
            </div>
            <div v-else-if="content.type === 'image'" class="mcp-image-content">
              <img :src="`data:${content.mimeType};base64,${content.data}`" alt="Result image" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="mcp-error-banner">
      <p>{{ error.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { MCPTool, MCPToolResult } from '../types';

interface Props {
  tools: MCPTool[];
  connected: boolean;
  loading?: boolean;
  error?: Error | null;
}

interface Emits {
  (e: 'connect'): void;
  (e: 'refresh'): void;
  (e: 'execute', toolCall: { name: string; arguments: Record<string, any> }): Promise<MCPToolResult>;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
});

const emit = defineEmits<Emits>();

const selectedTool = ref<MCPTool | null>(null);
const toolInputs = ref<Record<string, any>>({});
const executing = ref(false);
const result = ref<MCPToolResult | null>(null);

const selectTool = (tool: MCPTool) => {
  selectedTool.value = tool;
  toolInputs.value = {};
  result.value = null;
};

const clearSelection = () => {
  selectedTool.value = null;
  toolInputs.value = {};
  result.value = null;
};

const isRequired = (key: string): boolean => {
  return selectedTool.value?.inputSchema.required?.includes(key) || false;
};

const executeTool = async () => {
  if (!selectedTool.value) return;

  executing.value = true;
  result.value = null;

  try {
    result.value = await emit('execute', {
      name: selectedTool.value.name,
      arguments: toolInputs.value,
    });
  } catch (err) {
    console.error('Tool execution failed:', err);
  } finally {
    executing.value = false;
  }
};
</script>

