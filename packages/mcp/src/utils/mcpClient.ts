/**
 * MCP Client Implementation
 *
 * Framework-agnostic client for Model Context Protocol (MCP)
 *
 * Architecture:
 * ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
 * │  Host App   │ ───> │ MCP Client  │ ───> │ MCP Server  │
 * │  (Vue.js)   │ <─── │ (This file) │ <─── │             │
 * └─────────────┘      └─────────────┘      └─────────────┘
 *
 * This client implements the official MCP specification:
 * - JSON-RPC 2.0 protocol
 * - tools/list - List available tools
 * - tools/call - Execute tools with parameters
 * - resources/list - List available resources
 * - resources/read - Read resource contents
 * - prompts/list - List available prompts
 * - prompts/get - Retrieve prompt templates
 *
 * @see https://modelcontextprotocol.io/
 */

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
  MCPEvent,
  MCPEventHandler,
  JSONRPCRequest,
  JSONRPCResponse,
} from '../types';

export class MCPClient {
  private config: MCPClientConfig;
  private serverInfo: MCPServerInfo | null = null;
  private requestId = 0;
  private eventHandlers: Map<string, Set<MCPEventHandler>> = new Map();
  private pendingRequests: Map<number, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }> = new Map();
  private connected = false;
  private transport: any = null;

  constructor(config: MCPClientConfig) {
    this.config = config;
  }

  /**
   * Connect to the MCP server
   */
  async connect(): Promise<MCPServerInfo> {
    if (this.connected) {
      throw new Error('Already connected to MCP server');
    }

    try {
      // Initialize transport based on config
      await this.initializeTransport();

      // Send initialize request
      const response = await this.sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
          resources: { subscribe: true },
          prompts: {},
        },
        clientInfo: this.config.serverInfo || {
          name: '@aivue/mcp-client',
          version: '1.0.0',
        },
      });

      this.serverInfo = response;
      this.connected = true;
      this.emit({ type: 'connected', data: response });

      return response;
    } catch (error) {
      this.emit({ type: 'error', error: error as Error });
      throw error;
    }
  }

  /**
   * Disconnect from the MCP server
   */
  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    try {
      await this.closeTransport();
      this.connected = false;
      this.serverInfo = null;
      this.emit({ type: 'disconnected' });
    } catch (error) {
      this.emit({ type: 'error', error: error as Error });
      throw error;
    }
  }

  /**
   * List available tools
   */
  async listTools(): Promise<MCPTool[]> {
    this.ensureConnected();
    const response = await this.sendRequest('tools/list', {});
    return response.tools || [];
  }

  /**
   * Call a tool
   */
  async callTool(toolCall: MCPToolCall): Promise<MCPToolResult> {
    this.ensureConnected();
    const response = await this.sendRequest('tools/call', {
      name: toolCall.name,
      arguments: toolCall.arguments || {},
    });
    return response;
  }

  /**
   * List available resources
   */
  async listResources(): Promise<MCPResource[]> {
    this.ensureConnected();
    const response = await this.sendRequest('resources/list', {});
    return response.resources || [];
  }

  /**
   * Read a resource
   */
  async readResource(uri: string): Promise<MCPResourceContents> {
    this.ensureConnected();
    const response = await this.sendRequest('resources/read', { uri });
    return response.contents[0];
  }

  /**
   * Subscribe to resource updates
   */
  async subscribeResource(uri: string): Promise<void> {
    this.ensureConnected();
    await this.sendRequest('resources/subscribe', { uri });
  }

  /**
   * Unsubscribe from resource updates
   */
  async unsubscribeResource(uri: string): Promise<void> {
    this.ensureConnected();
    await this.sendRequest('resources/unsubscribe', { uri });
  }

  /**
   * List available prompts
   */
  async listPrompts(): Promise<MCPPrompt[]> {
    this.ensureConnected();
    const response = await this.sendRequest('prompts/list', {});
    return response.prompts || [];
  }

  /**
   * Get a prompt
   */
  async getPrompt(name: string, args?: Record<string, string>): Promise<MCPPromptMessage[]> {
    this.ensureConnected();
    const response = await this.sendRequest('prompts/get', {
      name,
      arguments: args || {},
    });
    return response.messages || [];
  }

  /**
   * Add event listener
   */
  on(event: string, handler: MCPEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  /**
   * Remove event listener
   */
  off(event: string, handler: MCPEventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Get server info
   */
  getServerInfo(): MCPServerInfo | null {
    return this.serverInfo;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  // Private methods

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Not connected to MCP server. Call connect() first.');
    }
  }

  private async initializeTransport(): Promise<void> {
    const { type, url, headers } = this.config.transport;

    if (type === 'http' || type === 'sse') {
      if (!url) {
        throw new Error('URL is required for HTTP/SSE transport');
      }
      this.transport = {
        type,
        url,
        headers: headers || {},
      };
    } else if (type === 'stdio') {
      throw new Error('stdio transport is not supported in browser environments');
    } else {
      throw new Error(`Unsupported transport type: ${type}`);
    }
  }

  private async closeTransport(): Promise<void> {
    this.transport = null;
  }

  private async sendRequest(method: string, params: any): Promise<any> {
    const id = ++this.requestId;
    const request: JSONRPCRequest = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });

      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }, this.config.timeout || 30000);

      this.sendJSONRPC(request)
        .then((response: JSONRPCResponse) => {
          clearTimeout(timeout);
          this.pendingRequests.delete(id);

          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        })
        .catch((error) => {
          clearTimeout(timeout);
          this.pendingRequests.delete(id);
          reject(error);
        });
    });
  }

  private async sendJSONRPC(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    if (!this.transport) {
      throw new Error('Transport not initialized');
    }

    const { url, headers } = this.transport;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to send JSON-RPC request: ${error}`);
    }
  }

  private emit(event: MCPEvent): void {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => handler(event));
    }

    // Also emit to wildcard listeners
    const wildcardHandlers = this.eventHandlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => handler(event));
    }
  }
}

