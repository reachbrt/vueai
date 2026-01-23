/**
 * Tests for MCP Client
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MCPClient } from '../utils/mcpClient';
import type { MCPClientConfig } from '../types';

describe('MCPClient', () => {
  let client: MCPClient;
  let config: MCPClientConfig;

  beforeEach(() => {
    config = {
      transport: {
        type: 'http',
        url: 'http://localhost:3000/mcp',
      },
    };
    client = new MCPClient(config);
  });

  describe('initialization', () => {
    it('should create a client instance', () => {
      expect(client).toBeInstanceOf(MCPClient);
    });

    it('should not be connected initially', () => {
      expect(client.isConnected()).toBe(false);
    });

    it('should have null server info initially', () => {
      expect(client.getServerInfo()).toBeNull();
    });
  });

  describe('event handling', () => {
    it('should add event listeners', () => {
      const handler = vi.fn();
      client.on('connected', handler);
      expect(handler).not.toHaveBeenCalled();
    });

    it('should remove event listeners', () => {
      const handler = vi.fn();
      client.on('connected', handler);
      client.off('connected', handler);
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('connection', () => {
    it('should throw error when calling methods before connect', async () => {
      await expect(client.listTools()).rejects.toThrow(
        'Not connected to MCP server'
      );
    });

    it('should throw error when connecting with stdio transport', async () => {
      const stdioClient = new MCPClient({
        transport: {
          type: 'stdio',
          command: 'node',
          args: ['server.js'],
        },
      });

      await expect(stdioClient.connect()).rejects.toThrow(
        'stdio transport is not supported in browser environments'
      );
    });
  });

  describe('configuration', () => {
    it('should accept custom timeout', () => {
      const customClient = new MCPClient({
        transport: {
          type: 'http',
          url: 'http://localhost:3000/mcp',
        },
        timeout: 60000,
      });

      expect(customClient).toBeInstanceOf(MCPClient);
    });

    it('should accept custom headers', () => {
      const customClient = new MCPClient({
        transport: {
          type: 'http',
          url: 'http://localhost:3000/mcp',
          headers: {
            'Authorization': 'Bearer token',
            'X-Custom': 'value',
          },
        },
      });

      expect(customClient).toBeInstanceOf(MCPClient);
    });

    it('should accept server info', () => {
      const customClient = new MCPClient({
        serverInfo: {
          name: 'test-client',
          version: '1.0.0',
        },
        transport: {
          type: 'http',
          url: 'http://localhost:3000/mcp',
        },
      });

      expect(customClient).toBeInstanceOf(MCPClient);
    });
  });

  describe('transport validation', () => {
    it('should require URL for HTTP transport', async () => {
      const invalidClient = new MCPClient({
        transport: {
          type: 'http',
        } as any,
      });

      await expect(invalidClient.connect()).rejects.toThrow(
        'URL is required for HTTP/SSE transport'
      );
    });

    it('should require URL for SSE transport', async () => {
      const invalidClient = new MCPClient({
        transport: {
          type: 'sse',
        } as any,
      });

      await expect(invalidClient.connect()).rejects.toThrow(
        'URL is required for HTTP/SSE transport'
      );
    });
  });
});

