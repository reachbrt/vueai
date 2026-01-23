/**
 * Model Context Protocol (MCP) Types
 * Based on the MCP specification
 */

// JSON-RPC 2.0 Types
export interface JSONRPCRequest {
  jsonrpc: '2.0';
  id?: string | number;
  method: string;
  params?: Record<string, any> | any[];
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: JSONRPCError;
}

export interface JSONRPCError {
  code: number;
  message: string;
  data?: any;
}

// MCP Protocol Types
export interface MCPServerInfo {
  name: string;
  version: string;
  protocolVersion?: string;
  capabilities?: MCPCapabilities;
}

export interface MCPCapabilities {
  tools?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  prompts?: {
    listChanged?: boolean;
  };
  logging?: Record<string, any>;
  experimental?: Record<string, any>;
}

// Tool Types
export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, any>;
    required?: string[];
  };
}

export interface MCPToolCall {
  name: string;
  arguments?: Record<string, any>;
}

export interface MCPToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

// Resource Types
export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPResourceContents {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

// Prompt Types
export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface MCPPromptMessage {
  role: 'user' | 'assistant';
  content: {
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
  };
}

// Transport Types
export type MCPTransportType = 'stdio' | 'http' | 'sse';

export interface MCPTransportConfig {
  type: MCPTransportType;
  url?: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  headers?: Record<string, string>;
}

// Client Configuration
export interface MCPClientConfig {
  serverInfo?: {
    name: string;
    version: string;
  };
  transport: MCPTransportConfig;
  timeout?: number;
  retries?: number;
}

// Event Types
export type MCPEventType = 
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'tool_list_changed'
  | 'resource_list_changed'
  | 'resource_updated'
  | 'prompt_list_changed';

export interface MCPEvent {
  type: MCPEventType;
  data?: any;
  error?: Error;
}

export type MCPEventHandler = (event: MCPEvent) => void;

