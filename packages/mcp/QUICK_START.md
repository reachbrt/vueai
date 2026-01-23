# @aivue/mcp Quick Start Guide

Get started with @aivue/mcp in 5 minutes!

## Installation

```bash
npm install @aivue/mcp
```

## Basic Usage

### 1. Simple Connection

```vue
<template>
  <div>
    <button @click="connect" v-if="!connected">Connect</button>
    <p v-else>Connected to {{ serverInfo?.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { useMCP } from '@aivue/mcp';
import '@aivue/mcp/dist/mcp.css';

const { connected, serverInfo, connect } = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});
</script>
```

### 2. Execute a Tool

```vue
<template>
  <div>
    <button @click="calculate">Calculate 2 + 2</button>
    <p v-if="result">Result: {{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMCP } from '@aivue/mcp';

const result = ref('');

const { connect, callTool } = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});

// Connect on mount
await connect();

const calculate = async () => {
  const toolResult = await callTool({
    name: 'calculator',
    arguments: { operation: 'add', a: 2, b: 2 },
  });
  result.value = toolResult.content[0].text || '';
};
</script>
```

### 3. Use the Component

```vue
<template>
  <MCPToolExecutor
    :tools="tools"
    :connected="connected"
    @connect="connect"
    @execute="callTool"
  />
</template>

<script setup lang="ts">
import { MCPToolExecutor, useMCP } from '@aivue/mcp';
import '@aivue/mcp/dist/mcp.css';

const { connected, tools, connect, callTool } = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});
</script>
```

## Configuration

### Environment Variables

```env
VITE_MCP_SERVER_URL=http://localhost:3000/mcp
VITE_MCP_API_KEY=your-api-key
```

```typescript
const { connect } = useMCP({
  transport: {
    type: 'http',
    url: import.meta.env.VITE_MCP_SERVER_URL,
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_MCP_API_KEY}`,
    },
  },
});
```

### Custom Timeout

```typescript
const { connect } = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
  timeout: 60000, // 60 seconds
});
```

## Common Patterns

### Auto-Connect on Mount

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useMCP } from '@aivue/mcp';

const mcp = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});

onMounted(() => mcp.connect());
</script>
```

### Error Handling

```vue
<script setup lang="ts">
import { watch } from 'vue';
import { useMCP } from '@aivue/mcp';

const { error, connect } = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});

watch(error, (err) => {
  if (err) {
    console.error('MCP Error:', err.message);
  }
});
</script>
```

### List and Execute Tools

```vue
<script setup lang="ts">
import { useMCP } from '@aivue/mcp';

const { tools, connect, callTool } = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});

await connect();

// List all tools
console.log('Available tools:', tools.value);

// Execute first tool
if (tools.value.length > 0) {
  const result = await callTool({
    name: tools.value[0].name,
    arguments: {},
  });
  console.log('Result:', result);
}
</script>
```

## Framework-Agnostic Usage

```typescript
import { MCPClient } from '@aivue/mcp';

const client = new MCPClient({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});

// Connect
await client.connect();

// List tools
const tools = await client.listTools();

// Execute tool
const result = await client.callTool({
  name: 'my-tool',
  arguments: { param: 'value' },
});

// Disconnect
await client.disconnect();
```

## Next Steps

- 📖 Read the [Full Documentation](./README.md)
- 🔧 Check the [API Reference](./API.md)
- 💡 Explore [Usage Examples](./USAGE_EXAMPLES.md)
- 🚀 Follow the [Integration Guide](./INTEGRATION_GUIDE.md)

## Need Help?

- [GitHub Issues](https://github.com/reachbrt/vueai/issues)
- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP Specification](https://spec.modelcontextprotocol.io)

