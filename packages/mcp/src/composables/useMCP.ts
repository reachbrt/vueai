/**
 * Vue Composable for MCP Client
 */

import { ref, onUnmounted, Ref } from 'vue';
import { MCPClient } from '../utils/mcpClient';
import type {
  MCPClientConfig,
  MCPServerInfo,
  MCPTool,
  MCPToolCall,
  MCPToolResult,
  MCPResource,
  MCPResourceContents,
  MCPPrompt,
  MCPPromptMessage,
} from '../types';

export interface UseMCPReturn {
  // State
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

export function useMCP(config: MCPClientConfig): UseMCPReturn {
  const client = new MCPClient(config);

  // Reactive state
  const connected = ref(false);
  const serverInfo = ref<MCPServerInfo | null>(null);
  const tools = ref<MCPTool[]>([]);
  const resources = ref<MCPResource[]>([]);
  const prompts = ref<MCPPrompt[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Event handlers
  client.on('connected', (event) => {
    connected.value = true;
    serverInfo.value = event.data;
    error.value = null;
  });

  client.on('disconnected', () => {
    connected.value = false;
    serverInfo.value = null;
  });

  client.on('error', (event) => {
    error.value = event.error || new Error('Unknown error');
  });

  client.on('tool_list_changed', async () => {
    await refreshTools();
  });

  client.on('resource_list_changed', async () => {
    await refreshResources();
  });

  client.on('prompt_list_changed', async () => {
    await refreshPrompts();
  });

  // Methods
  const connect = async () => {
    loading.value = true;
    error.value = null;

    try {
      await client.connect();
      // Load initial data
      await Promise.all([
        refreshTools(),
        refreshResources(),
        refreshPrompts(),
      ]);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const disconnect = async () => {
    loading.value = true;
    error.value = null;

    try {
      await client.disconnect();
      tools.value = [];
      resources.value = [];
      prompts.value = [];
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const refreshTools = async () => {
    try {
      tools.value = await client.listTools();
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  const refreshResources = async () => {
    try {
      resources.value = await client.listResources();
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  const refreshPrompts = async () => {
    try {
      prompts.value = await client.listPrompts();
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  const callTool = async (toolCall: MCPToolCall): Promise<MCPToolResult> => {
    error.value = null;
    try {
      return await client.callTool(toolCall);
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  const readResource = async (uri: string): Promise<MCPResourceContents> => {
    error.value = null;
    try {
      return await client.readResource(uri);
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  const getPrompt = async (name: string, args?: Record<string, string>): Promise<MCPPromptMessage[]> => {
    error.value = null;
    try {
      return await client.getPrompt(name, args);
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  const subscribeResource = async (uri: string): Promise<void> => {
    error.value = null;
    try {
      await client.subscribeResource(uri);
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  const unsubscribeResource = async (uri: string): Promise<void> => {
    error.value = null;
    try {
      await client.unsubscribeResource(uri);
    } catch (err) {
      error.value = err as Error;
      throw err;
    }
  };

  // Cleanup on unmount
  onUnmounted(() => {
    if (connected.value) {
      client.disconnect().catch(console.error);
    }
  });

  return {
    // State
    connected,
    serverInfo,
    tools,
    resources,
    prompts,
    loading,
    error,

    // Methods
    connect,
    disconnect,
    refreshTools,
    refreshResources,
    refreshPrompts,
    callTool,
    readResource,
    getPrompt,
    subscribeResource,
    unsubscribeResource,
  };
}

