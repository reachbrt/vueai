# @aivue/hierarchical-memory

> Hierarchical memory trees (H-MEM style) for LLM tools and agents, optimized for tables and documents

[![npm version](https://img.shields.io/npm/v/@aivue/hierarchical-memory.svg)](https://www.npmjs.com/package/@aivue/hierarchical-memory)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Features

- **Multi-Level Memory Tree** - Organize context as a hierarchical tree with automatic summarization
- **Semantic Retrieval** - Find relevant nodes using embeddings or keyword matching
- **LLM Integration** - Built-in support for OpenAI and Anthropic for summarization
- **Flexible Operations** - Insert, update, delete, promote, demote nodes
- **Vue Components** - Beautiful tree visualization with interactive UI
- **TypeScript** - Full type safety and IntelliSense support
- **Table & Document Support** - Optimized for structured and unstructured data

## 📦 Installation

```bash
npm install @aivue/hierarchical-memory
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { HierarchicalMemory, NodeType, NodeLevel } from '@aivue/hierarchical-memory';

// Create memory tree
const memory = new HierarchicalMemory({
  autoSummarize: true,
  summarization: {
    provider: 'openai',
    apiKey: 'your-api-key',
  },
});

// Insert documents
await memory.insert('Long document content...', {
  type: NodeType.DOCUMENT,
  metadata: { title: 'My Document' },
});

// Retrieve relevant context
const result = await memory.retrieve('What is this about?');
console.log(result.context); // Formatted for LLM
```

### Vue Composable

```vue
<script setup>
import { useHierarchicalMemory } from '@aivue/hierarchical-memory';
import { NodeType } from '@aivue/hierarchical-memory';

const { insert, retrieve, nodes, stats } = useHierarchicalMemory({
  autoSummarize: true,
});

// Insert content
const nodeId = await insert('Document content', {
  type: NodeType.DOCUMENT,
  metadata: { title: 'Example' },
});

// Query
const result = await retrieve('search query');
</script>
```

### Vue Component

```vue
<template>
  <MemoryTreeViewer
    :nodes="nodes"
    :stats="stats"
    @select="handleSelect"
    @delete="handleDelete"
  />
</template>

<script setup>
import { MemoryTreeViewer } from '@aivue/hierarchical-memory';
import '@aivue/hierarchical-memory/dist/hierarchical-memory.css';
</script>
```

## 📚 Core Concepts

### Node Levels

- **LEAF (0)** - Raw data chunks, table rows
- **L1 (1)** - First-level summaries
- **L2 (2)** - Second-level summaries
- **L3 (3)** - Third-level summaries
- **ROOT (4)** - Top-level overview

### Node Types

- **DOCUMENT** - Text documents
- **TABLE** - Structured tables
- **CHUNK** - Text chunks
- **SUMMARY** - Generated summaries
- **REFERENCE** - References to other nodes

## 🔧 API Reference

### HierarchicalMemory

```typescript
class HierarchicalMemory {
  constructor(config?: HMemConfig);
  
  // Core operations
  insert(content: string, options: InsertOptions): Promise<string>;
  update(nodeId: string, content: string): Promise<void>;
  delete(nodeId: string, deleteChildren?: boolean): void;
  
  // Hierarchy operations
  promote(nodeId: string, options: PromotionOptions): Promise<void>;
  demote(nodeId: string, targetLevel: NodeLevel): void;
  
  // Retrieval
  retrieve(query: string, config?: RetrievalConfig): Promise<QueryResult>;
  
  // Export
  export(options?: ExportOptions): string;
  
  // Stats
  getStats(): TreeStats;
}
```

### Configuration

```typescript
interface HMemConfig {
  maxDepth?: number;              // Default: 4
  maxChildrenPerNode?: number;    // Default: 10
  autoPromote?: boolean;          // Default: false
  autoSummarize?: boolean;        // Default: true
  summarization?: {
    provider: 'openai' | 'anthropic' | 'custom';
    apiKey?: string;
    model?: string;
    maxTokens?: number;
    customSummarizer?: (content: string) => Promise<string>;
  };
  enableEmbeddings?: boolean;     // Default: false
  embeddingProvider?: 'openai' | 'custom';
  customEmbedder?: (text: string) => Promise<number[]>;
}
```

## 💡 Use Cases

### 1. Document Management

```typescript
// Insert large document
const docId = await memory.insert(largeDocument, {
  type: NodeType.DOCUMENT,
  metadata: { title: 'Research Paper', source: 'arxiv' },
  autoSummarize: true,
});

// Retrieve relevant sections
const result = await memory.retrieve('methodology section');
```

### 2. Table Processing

```typescript
import { parseTable, formatTableAsMarkdown } from '@aivue/hierarchical-memory';

// Parse and insert table
const rows = parseTable(csvContent, 'csv');
const markdown = formatTableAsMarkdown(rows);

await memory.insert(markdown, {
  type: NodeType.TABLE,
  metadata: { title: 'Sales Data' },
});
```

### 3. Multi-Level Summarization

```typescript
// Insert raw chunks
for (const chunk of chunks) {
  await memory.insert(chunk, {
    type: NodeType.CHUNK,
    level: NodeLevel.LEAF,
  });
}

// Promote important nodes
await memory.promote(nodeId, {
  targetLevel: NodeLevel.L2,
  autoSummarize: true,
});
```

## 🎨 Styling

Import the CSS file:

```typescript
import '@aivue/hierarchical-memory/dist/hierarchical-memory.css';
```

Or customize with CSS variables:

```css
.memory-tree-viewer {
  --color-primary: #3b82f6;
  --color-border: #e2e8f0;
  --color-bg: #ffffff;
}
```

## 📖 Examples

See the [demo folder](../../demo) for complete examples.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md).

## 📄 License

MIT © [reachbrt](https://github.com/reachbrt)

## 🔗 Links

- [GitHub](https://github.com/reachbrt/vueai)
- [npm](https://www.npmjs.com/package/@aivue/hierarchical-memory)
- [Documentation](https://aivue.netlify.app)

