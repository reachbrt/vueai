<template>
  <div class="hierarchical-memory-demo">
    <div class="demo-header">
      <h1>🧠 Hierarchical Memory</h1>
      <p>Multi-level memory trees for LLM context management</p>
    </div>

    <!-- Configuration Section -->
    <div class="config-section">
      <h2>⚙️ Configuration</h2>
      <div class="config-grid">
        <div class="config-item">
          <label>AI Provider</label>
          <select v-model="aiProvider" class="input">
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>
        </div>
        <div class="config-item">
          <label>API Key</label>
          <input
            v-model="apiKey"
            type="password"
            placeholder="Enter API key"
            class="input"
          />
        </div>
        <div class="config-item">
          <label>Auto Summarize</label>
          <input v-model="autoSummarize" type="checkbox" />
        </div>
        <div class="config-item">
          <label>Enable Embeddings</label>
          <input v-model="enableEmbeddings" type="checkbox" />
        </div>
      </div>
      <div style="display: flex; gap: 1rem;">
        <button @click="initializeMemory" class="btn btn-primary">
          Initialize Memory Tree
        </button>
        <button v-if="memory" @click="loadSampleData" class="btn btn-primary">
          Load Sample Data
        </button>
      </div>
    </div>

    <!-- Stats Section -->
    <div v-if="memory" class="stats-section">
      <h2>📊 Statistics</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalNodes }}</div>
          <div class="stat-label">Total Nodes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.depth }}</div>
          <div class="stat-label">Tree Depth</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalTokens }}</div>
          <div class="stat-label">Total Tokens</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ nodes.length }}</div>
          <div class="stat-label">Nodes</div>
        </div>
      </div>
    </div>

    <!-- Insert Section -->
    <div v-if="memory" class="insert-section">
      <h2>➕ Insert Content</h2>
      <div class="insert-form">
        <div class="form-group">
          <label>Content Type</label>
          <select v-model="insertType" class="input">
            <option value="document">Document</option>
            <option value="table">Table</option>
            <option value="chunk">Chunk</option>
            <option value="summary">Summary</option>
          </select>
        </div>
        <div class="form-group">
          <label>Title</label>
          <input v-model="insertTitle" type="text" placeholder="Enter title" class="input" />
        </div>
        <div class="form-group">
          <label>Content</label>
          <textarea
            v-model="insertContent"
            placeholder="Enter content..."
            class="textarea"
            rows="6"
          ></textarea>
        </div>
        <button @click="handleInsert" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Inserting...' : 'Insert Content' }}
        </button>
      </div>
    </div>

    <!-- Retrieve Section -->
    <div v-if="memory" class="retrieve-section">
      <h2>🔍 Retrieve Context</h2>
      <div class="retrieve-form">
        <div class="form-group">
          <label>Query</label>
          <input
            v-model="query"
            type="text"
            placeholder="Enter search query..."
            class="input"
            @keyup.enter="handleRetrieve"
          />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Top K Results</label>
            <input v-model.number="topK" type="number" min="1" max="20" class="input" />
          </div>
          <div class="form-group">
            <label>Min Score</label>
            <input v-model.number="minScore" type="number" min="0" max="1" step="0.1" class="input" />
          </div>
        </div>
        <button @click="handleRetrieve" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Searching...' : 'Retrieve' }}
        </button>
      </div>

      <!-- Results -->
      <div v-if="retrieveResult" class="results">
        <h3>Results ({{ retrieveResult.metadata.totalNodes }} nodes, avg score: {{ retrieveResult.metadata.avgScore.toFixed(2) }})</h3>
        <div class="result-nodes">
          <div v-for="node in retrieveResult.nodes" :key="node.id" class="result-node">
            <div class="node-header">
              <span class="node-icon">{{ getNodeIcon(node.type) }}</span>
              <span class="node-title">{{ node.metadata.title || node.id }}</span>
              <span class="node-level">L{{ node.level }}</span>
              <span class="node-score">{{ (node.score || 0).toFixed(2) }}</span>
            </div>
            <div class="node-content">{{ node.summary || node.content }}</div>
          </div>
        </div>
        <div class="llm-context">
          <h4>LLM Context (Ready to use)</h4>
          <pre>{{ retrieveResult.context }}</pre>
        </div>
      </div>
    </div>

    <!-- Tree Visualization -->
    <div v-if="memory" class="tree-section">
      <h2>🌳 Memory Tree</h2>
      <MemoryTreeViewer
        :nodes="nodes"
        :stats="stats"
        @select="handleSelectNode"
        @delete="handleDeleteNode"
        @refresh="refresh"
      />
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-message">
      {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  useHierarchicalMemory,
  MemoryTreeViewer,
  NodeType,
  type QueryResult,
  type MemoryNode,
} from '@aivue/hierarchical-memory';
import '@aivue/hierarchical-memory/dist/hierarchical-memory.css';

// Configuration
const aiProvider = ref<'openai' | 'anthropic'>('openai');
const apiKey = ref('');
const autoSummarize = ref(true);
const enableEmbeddings = ref(false);

// Memory instance
let memoryInstance: ReturnType<typeof useHierarchicalMemory> | null = null;
const memory = ref<any>(null);
const nodes = ref<MemoryNode[]>([]);
const stats = ref({
  totalNodes: 0,
  nodesByLevel: {} as any,
  nodesByType: {} as any,
  totalTokens: 0,
  depth: 0,
});
const loading = ref(false);
const error = ref<Error | null>(null);

// Insert form
const insertType = ref<NodeType>(NodeType.DOCUMENT);
const insertTitle = ref('');
const insertContent = ref('');

// Retrieve form
const query = ref('');
const topK = ref(5);
const minScore = ref(0.3);
const retrieveResult = ref<QueryResult | null>(null);

// Initialize memory
const initializeMemory = () => {
  if (!apiKey.value) {
    alert('Please enter an API key');
    return;
  }

  memoryInstance = useHierarchicalMemory({
    autoSummarize: autoSummarize.value,
    enableEmbeddings: enableEmbeddings.value,
    summarization: {
      provider: aiProvider.value,
      apiKey: apiKey.value,
    },
    embeddingProvider: 'openai',
  });

  memory.value = memoryInstance.memory;
  nodes.value = memoryInstance.nodes.value;
  stats.value = memoryInstance.stats.value;
  error.value = memoryInstance.error.value;
};

// Insert content
const handleInsert = async () => {
  if (!memoryInstance || !insertContent.value) {
    alert('Please initialize memory and enter content');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    await memoryInstance.insert(insertContent.value, {
      type: insertType.value,
      metadata: {
        title: insertTitle.value || undefined,
      },
    });

    // Clear form
    insertContent.value = '';
    insertTitle.value = '';

    // Refresh
    refresh();
  } catch (err) {
    error.value = err as Error;
  } finally {
    loading.value = false;
  }
};

// Retrieve content
const handleRetrieve = async () => {
  if (!memoryInstance || !query.value) {
    alert('Please initialize memory and enter a query');
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const result = await memoryInstance.retrieve(query.value, {
      topK: topK.value,
      minScore: minScore.value,
      expandContext: true,
    });

    retrieveResult.value = result;
  } catch (err) {
    error.value = err as Error;
  } finally {
    loading.value = false;
  }
};

// Select node
const handleSelectNode = (nodeId: string) => {
  const node = memoryInstance?.memory.get(nodeId);
  if (node) {
    alert(`Node: ${node.metadata.title || node.id}\n\nContent: ${node.content}`);
  }
};

// Delete node
const handleDeleteNode = (nodeId: string) => {
  if (!memoryInstance) return;

  if (confirm('Are you sure you want to delete this node?')) {
    memoryInstance.delete(nodeId, false);
    refresh();
  }
};

// Refresh
const refresh = () => {
  if (memoryInstance) {
    memoryInstance.refresh();
    nodes.value = memoryInstance.nodes.value;
    stats.value = memoryInstance.stats.value;
  }
};

// Get node icon
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

// Sample data
const loadSampleData = async () => {
  if (!memoryInstance) {
    alert('Please initialize memory first');
    return;
  }

  const samples = [
    {
      type: NodeType.DOCUMENT,
      title: 'Introduction to AI',
      content: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction. AI has applications in various fields including healthcare, finance, transportation, and entertainment.',
    },
    {
      type: NodeType.DOCUMENT,
      title: 'Machine Learning Basics',
      content: 'Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing computer programs that can access data and use it to learn for themselves.',
    },
    {
      type: NodeType.TABLE,
      title: 'AI Applications',
      content: '| Domain | Application | Impact |\n|--------|-------------|--------|\n| Healthcare | Diagnosis | High |\n| Finance | Fraud Detection | High |\n| Transportation | Self-Driving Cars | Medium |\n| Entertainment | Recommendations | Medium |',
    },
  ];

  for (const sample of samples) {
    await memoryInstance.insert(sample.content, {
      type: sample.type,
      metadata: { title: sample.title },
    });
  }

  refresh();
};

// Expose load sample data
defineExpose({
  loadSampleData,
});


</script>

<style scoped>
.hierarchical-memory-demo {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.demo-header p {
  font-size: 1.125rem;
  color: #64748b;
}

.config-section,
.stats-section,
.insert-section,
.retrieve-section,
.tree-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.config-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.insert-form,
.retrieve-form {
  max-width: 800px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input,
.textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.textarea {
  font-family: inherit;
  resize: vertical;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.results {
  margin-top: 2rem;
}

.results h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #1e293b;
}

.result-nodes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.result-node {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.node-icon {
  font-size: 1.5rem;
}

.node-title {
  flex: 1;
  font-weight: 600;
  color: #1e293b;
}

.node-level {
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.node-score {
  padding: 0.25rem 0.75rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
}

.node-content {
  color: #64748b;
  line-height: 1.6;
}

.llm-context {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

.llm-context h4 {
  color: white;
  margin-bottom: 1rem;
}

.llm-context pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .hierarchical-memory-demo {
    padding: 1rem;
  }

  .config-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>


