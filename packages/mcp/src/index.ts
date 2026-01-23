/**
 * @aivue/mcp - Model Context Protocol Client for Vue.js
 * 
 * A clean, framework-agnostic MCP client that wraps JSON-RPC communication
 * with MCP servers, providing tools, resources, and prompts functionality.
 */

// Import styles
import './styles/mcp.css';

// Export types
export type {
  JSONRPCRequest,
  JSONRPCResponse,
  JSONRPCError,
  MCPServerInfo,
  MCPCapabilities,
  MCPTool,
  MCPToolCall,
  MCPToolResult,
  MCPResource,
  MCPResourceContents,
  MCPPrompt,
  MCPPromptMessage,
  MCPTransportType,
  MCPTransportConfig,
  MCPClientConfig,
  MCPEventType,
  MCPEvent,
  MCPEventHandler,
} from './types';

// Export core client
export { MCPClient } from './utils/mcpClient';

// Export composables
export { useMCP } from './composables/useMCP';
export type { UseMCPReturn } from './composables/useMCP';

// Export components
export { default as MCPToolExecutor } from './components/MCPToolExecutor.vue';

// Vue plugin
import type { App } from 'vue';
import { MCPClient } from './utils/mcpClient';
import { useMCP } from './composables/useMCP';

export interface MCPPluginOptions {
  // Global configuration options can be added here
}

export const MCPPlugin = {
  install(app: App, options?: MCPPluginOptions) {
    // Register components globally if needed
    // app.component('MCPToolExecutor', MCPToolExecutor);

    // You can add global properties or provide/inject here
    if (options) {
      // Handle plugin options
    }
  },
};

