# @aivue/mcp-client

> Official Model Context Protocol (MCP) client for Vue.js - Following the standard MCP architecture: **Host App → MCP Client → MCP Server**

[![npm version](https://img.shields.io/npm/v/@aivue/mcp-client.svg)](https://www.npmjs.com/package/@aivue/mcp-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🏗️ Architecture

This package implements the official Model Context Protocol (MCP) client architecture:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Host App   │ ───> │ MCP Client  │ ───> │ MCP Server  │
│  (Vue.js)   │ <─── │ (@aivue/mcp)│ <─── │             │
└─────────────┘      └─────────────┘      └─────────────┘
```

The MCP Client acts as a bridge between your Vue.js application (Host App) and MCP servers, handling:
- JSON-RPC 2.0 protocol communication
- Transport layer (HTTP/SSE)
- Request/response management
- Event handling and subscriptions

## 🎯 Features

### Core MCP Operations (Official Spec)
- ✅ **tools/list** - List available tools from MCP server
- ✅ **tools/call** - Execute tools with parameters
- ✅ **resources/list** - List available resources
- ✅ **resources/read** - Read resource contents
- ✅ **prompts/list** - List available prompts
- ✅ **prompts/get** - Retrieve prompt templates

### Additional Features
- 🔌 **Framework-Agnostic Core** - Clean TypeScript API that works anywhere
- 🎨 **Vue Integration** - Composables and components for seamless Vue.js integration
- 🔄 **JSON-RPC 2.0** - Full JSON-RPC protocol implementation
- 🌐 **HTTP/SSE Transport** - Browser-compatible transport layer
- 📡 **Real-time Updates** - Event-driven architecture for live updates
- 💪 **TypeScript** - Full type safety and IntelliSense support

## 📦 Installation

```bash
npm install @aivue/mcp-client
```

## 🚀 Quick Start

### Using the Composable (Recommended)

```vue
<template>
  <div>
    <button @click="connect" :disabled="connected">Connect</button>
    <button @click="disconnect" :disabled="!connected">Disconnect</button>

    <div v-if="connected">
      <h3>Available Tools ({{ tools.length }})</h3>
      <ul>
        <li v-for="tool in tools" :key="tool.name">
          {{ tool.name }} - {{ tool.description }}
        </li>
      </ul>

      <button @click="executeCalculator">Calculate 2 + 2</button>
      <div v-if="result">Result: {{ result }}</div>
    </div>

    <div v-if="error" class="error">{{ error.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMCP } from '@aivue/mcp-client';

const result = ref(null);

const {
  connected,
  tools,
  error,
  connect,
  disconnect,
  callTool,
} = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});

const executeCalculator = async () => {
  const toolResult = await callTool({
    name: 'calculator',
    arguments: {
      operation: 'add',
      a: 2,
      b: 2,
    },
  });
  
  result.value = toolResult.content[0].text;
};
</script>
```

### Using the Component

```vue
<template>
  <MCPToolExecutor
    :tools="tools"
    :connected="connected"
    :loading="loading"
    :error="error"
    @connect="connect"
    @refresh="refreshTools"
    @execute="callTool"
  />
</template>

<script setup lang="ts">
import { MCPToolExecutor, useMCP } from '@aivue/mcp';

const {
  connected,
  tools,
  loading,
  error,
  connect,
  refreshTools,
  callTool,
} = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});
</script>
```

### Using the Core Client (Framework-Agnostic)

```typescript
import { MCPClient } from '@aivue/mcp';

const client = new MCPClient({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});

// Connect to server
await client.connect();

// List available tools
const tools = await client.listTools();

// Call a tool
const result = await client.callTool({
  name: 'calculator',
  arguments: { operation: 'add', a: 2, b: 2 },
});

// List resources
const resources = await client.listResources();

// Read a resource
const content = await client.readResource('file:///path/to/file.txt');

// Get prompts
const prompts = await client.listPrompts();
const messages = await client.getPrompt('greeting', { name: 'Alice' });

// Disconnect
await client.disconnect();
```

## 📚 API Reference

### `useMCP(config: MCPClientConfig)`

Vue composable for MCP integration.

**Returns:**
- `connected` - Connection status
- `serverInfo` - Server information
- `tools` - Available tools
- `resources` - Available resources
- `prompts` - Available prompts
- `loading` - Loading state
- `error` - Error state
- `connect()` - Connect to server
- `disconnect()` - Disconnect from server
- `callTool(toolCall)` - Execute a tool
- `readResource(uri)` - Read a resource
- `getPrompt(name, args)` - Get a prompt
- `subscribeResource(uri)` - Subscribe to resource updates
- `unsubscribeResource(uri)` - Unsubscribe from resource updates

### `MCPClient`

Core MCP client class.

**Methods:**
- `connect()` - Connect to MCP server
- `disconnect()` - Disconnect from server
- `listTools()` - List available tools
- `callTool(toolCall)` - Execute a tool
- `listResources()` - List available resources
- `readResource(uri)` - Read a resource
- `subscribeResource(uri)` - Subscribe to resource updates
- `unsubscribeResource(uri)` - Unsubscribe from updates
- `listPrompts()` - List available prompts
- `getPrompt(name, args)` - Get a prompt
- `on(event, handler)` - Add event listener
- `off(event, handler)` - Remove event listener

## 🔧 Configuration

```typescript
interface MCPClientConfig {
  serverInfo?: {
    name: string;
    version: string;
  };
  transport: {
    type: 'http' | 'sse';
    url: string;
    headers?: Record<string, string>;
  };
  timeout?: number;  // Request timeout in ms (default: 30000)
  retries?: number;  // Number of retries (default: 0)
}
```

## 🎨 Styling

Import the CSS file in your main file:

```typescript
import '@aivue/mcp/dist/mcp.css';
```

Or customize the styles by overriding CSS variables:

```css
.mcp-tool-executor {
  --mcp-primary-color: #007bff;
  --mcp-border-radius: 8px;
  --mcp-spacing: 1rem;
}
```

## 📖 Examples

Check out the [examples directory](../../examples) for more usage examples.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT © [reachbrt](https://github.com/reachbrt)

## 🔗 Links

- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP Specification](https://spec.modelcontextprotocol.io)
- [GitHub Repository](https://github.com/reachbrt/vueai)
- [npm Package](https://www.npmjs.com/package/@aivue/mcp)

