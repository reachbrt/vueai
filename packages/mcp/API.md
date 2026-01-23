# @aivue/mcp API Documentation

## Table of Contents

- [MCPClient](#mcpclient)
- [useMCP Composable](#usemcp-composable)
- [MCPToolExecutor Component](#mcptoolexecutor-component)
- [Types](#types)
- [Events](#events)

## MCPClient

The core MCP client class for framework-agnostic usage.

### Constructor

```typescript
new MCPClient(config: MCPClientConfig)
```

**Parameters:**
- `config` - Client configuration object

**Example:**
```typescript
const client = new MCPClient({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
  timeout: 30000,
});
```

### Methods

#### `connect(): Promise<MCPServerInfo>`

Connect to the MCP server and initialize the session.

**Returns:** Promise resolving to server information

**Throws:** Error if already connected or connection fails

**Example:**
```typescript
const serverInfo = await client.connect();
console.log(serverInfo.name, serverInfo.version);
```

#### `disconnect(): Promise<void>`

Disconnect from the MCP server.

**Example:**
```typescript
await client.disconnect();
```

#### `listTools(): Promise<MCPTool[]>`

List all available tools from the server.

**Returns:** Promise resolving to array of tools

**Throws:** Error if not connected

**Example:**
```typescript
const tools = await client.listTools();
tools.forEach(tool => {
  console.log(tool.name, tool.description);
});
```

#### `callTool(toolCall: MCPToolCall): Promise<MCPToolResult>`

Execute a tool on the server.

**Parameters:**
- `toolCall.name` - Name of the tool to execute
- `toolCall.arguments` - Arguments to pass to the tool

**Returns:** Promise resolving to tool execution result

**Example:**
```typescript
const result = await client.callTool({
  name: 'calculator',
  arguments: { operation: 'add', a: 2, b: 3 },
});
console.log(result.content[0].text); // "5"
```

#### `listResources(): Promise<MCPResource[]>`

List all available resources from the server.

**Returns:** Promise resolving to array of resources

**Example:**
```typescript
const resources = await client.listResources();
```

#### `readResource(uri: string): Promise<MCPResourceContents>`

Read the contents of a resource.

**Parameters:**
- `uri` - URI of the resource to read

**Returns:** Promise resolving to resource contents

**Example:**
```typescript
const content = await client.readResource('file:///path/to/file.txt');
console.log(content.text);
```

#### `subscribeResource(uri: string): Promise<void>`

Subscribe to updates for a resource.

**Parameters:**
- `uri` - URI of the resource to subscribe to

**Example:**
```typescript
await client.subscribeResource('file:///path/to/file.txt');
client.on('resource_updated', (event) => {
  console.log('Resource updated:', event.data);
});
```

#### `unsubscribeResource(uri: string): Promise<void>`

Unsubscribe from resource updates.

**Parameters:**
- `uri` - URI of the resource to unsubscribe from

**Example:**
```typescript
await client.unsubscribeResource('file:///path/to/file.txt');
```

#### `listPrompts(): Promise<MCPPrompt[]>`

List all available prompts from the server.

**Returns:** Promise resolving to array of prompts

**Example:**
```typescript
const prompts = await client.listPrompts();
```

#### `getPrompt(name: string, args?: Record<string, string>): Promise<MCPPromptMessage[]>`

Get a prompt with optional arguments.

**Parameters:**
- `name` - Name of the prompt
- `args` - Optional arguments for the prompt

**Returns:** Promise resolving to array of prompt messages

**Example:**
```typescript
const messages = await client.getPrompt('greeting', { name: 'Alice' });
```

#### `on(event: string, handler: MCPEventHandler): void`

Add an event listener.

**Parameters:**
- `event` - Event name or '*' for all events
- `handler` - Event handler function

**Example:**
```typescript
client.on('connected', (event) => {
  console.log('Connected!', event.data);
});
```

#### `off(event: string, handler: MCPEventHandler): void`

Remove an event listener.

**Parameters:**
- `event` - Event name
- `handler` - Event handler function to remove

**Example:**
```typescript
const handler = (event) => console.log(event);
client.on('error', handler);
client.off('error', handler);
```

#### `getServerInfo(): MCPServerInfo | null`

Get the current server information.

**Returns:** Server info or null if not connected

**Example:**
```typescript
const info = client.getServerInfo();
if (info) {
  console.log(info.name, info.version);
}
```

#### `isConnected(): boolean`

Check if the client is connected.

**Returns:** True if connected, false otherwise

**Example:**
```typescript
if (client.isConnected()) {
  console.log('Client is connected');
}
```

## useMCP Composable

Vue composable for reactive MCP integration.

### Usage

```typescript
function useMCP(config: MCPClientConfig): UseMCPReturn
```

**Parameters:**
- `config` - Client configuration object

**Returns:** Object with reactive state and methods

### Return Value

```typescript
interface UseMCPReturn {
  // Reactive State
  connected: Ref<boolean>;
  serverInfo: Ref<MCPServerInfo | null>;
  tools: Ref<MCPTool[]>;
  resources: Ref<MCPResource[]>;
  prompts: Ref<MCPPrompt[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;

  // Methods
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshTools: () => Promise<void>;
  refreshResources: () => Promise<void>;
  refreshPrompts: () => Promise<void>;
  callTool: (toolCall: MCPToolCall) => Promise<MCPToolResult>;
  readResource: (uri: string) => Promise<MCPResourceContents>;
  getPrompt: (name: string, args?: Record<string, string>) => Promise<MCPPromptMessage[]>;
  subscribeResource: (uri: string) => Promise<void>;
  unsubscribeResource: (uri: string) => Promise<void>;
}
```

### Example

```vue
<script setup lang="ts">
import { useMCP } from '@aivue/mcp';

const {
  connected,
  tools,
  error,
  connect,
  callTool,
} = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});

// Connect on mount
onMounted(async () => {
  await connect();
});
</script>
```

## MCPToolExecutor Component

Vue component for executing MCP tools with a UI.

### Props

```typescript
interface Props {
  tools: MCPTool[];
  connected: boolean;
  loading?: boolean;
  error?: Error | null;
}
```

### Events

```typescript
interface Emits {
  (e: 'connect'): void;
  (e: 'refresh'): void;
  (e: 'execute', toolCall: { name: string; arguments: Record<string, any> }): Promise<MCPToolResult>;
}
```

### Example

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

const mcp = useMCP({
  transport: {
    type: 'http',
    url: 'http://localhost:3000/mcp',
  },
});
</script>
```

## Types

### MCPClientConfig

```typescript
interface MCPClientConfig {
  serverInfo?: {
    name: string;
    version: string;
  };
  transport: MCPTransportConfig;
  timeout?: number;
  retries?: number;
}
```

### MCPTransportConfig

```typescript
interface MCPTransportConfig {
  type: 'http' | 'sse' | 'stdio';
  url?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  headers?: Record<string, string>;
}
```

### MCPTool

```typescript
interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, any>;
    required?: string[];
  };
}
```

### MCPToolResult

```typescript
interface MCPToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}
```

### MCPResource

```typescript
interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}
```

### MCPPrompt

```typescript
interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}
```

## Events

### Event Types

- `connected` - Fired when connected to server
- `disconnected` - Fired when disconnected from server
- `error` - Fired when an error occurs
- `tool_list_changed` - Fired when the tools list changes
- `resource_list_changed` - Fired when the resources list changes
- `resource_updated` - Fired when a subscribed resource is updated
- `prompt_list_changed` - Fired when the prompts list changes

### Event Object

```typescript
interface MCPEvent {
  type: MCPEventType;
  data?: any;
  error?: Error;
}
```

### Example

```typescript
client.on('connected', (event) => {
  console.log('Server:', event.data.name);
});

client.on('error', (event) => {
  console.error('Error:', event.error?.message);
});

client.on('tool_list_changed', async () => {
  const tools = await client.listTools();
  console.log('Updated tools:', tools);
});
```

