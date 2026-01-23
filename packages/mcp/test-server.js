/**
 * Simple MCP Test Server
 *
 * This is a basic HTTP server that implements the Model Context Protocol (MCP)
 * for testing the @aivue/mcp client.
 *
 * Run with: node test-server.js
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Server info
const serverInfo = {
  name: 'Test MCP Server',
  version: '1.0.0',
  protocolVersion: '2024-11-05',
  capabilities: {
    tools: {},
    resources: {},
    prompts: {}
  }
};

// Sample tools
const tools = [
  {
    name: 'echo',
    description: 'Echoes back the input text',
    inputSchema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'The text to echo back'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'add',
    description: 'Adds two numbers together',
    inputSchema: {
      type: 'object',
      properties: {
        a: {
          type: 'number',
          description: 'First number'
        },
        b: {
          type: 'number',
          description: 'Second number'
        }
      },
      required: ['a', 'b']
    }
  },
  {
    name: 'greet',
    description: 'Generates a greeting message',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name to greet'
        },
        language: {
          type: 'string',
          description: 'Language for greeting (en, es, fr)',
          enum: ['en', 'es', 'fr']
        }
      },
      required: ['name']
    }
  }
];

// Sample resources
const resources = [
  {
    uri: 'file:///example.txt',
    name: 'Example Text File',
    description: 'A sample text file resource',
    mimeType: 'text/plain'
  },
  {
    uri: 'https://example.com/data.json',
    name: 'Example JSON Data',
    description: 'A sample JSON data resource',
    mimeType: 'application/json'
  }
];

// Sample prompts
const prompts = [
  {
    name: 'code-review',
    description: 'Prompt for code review',
    arguments: [
      {
        name: 'code',
        description: 'The code to review',
        required: true
      }
    ]
  }
];

// JSON-RPC request handler
function handleJsonRpc(method, params) {
  switch (method) {
    case 'initialize':
      return {
        protocolVersion: serverInfo.protocolVersion,
        capabilities: serverInfo.capabilities,
        serverInfo: {
          name: serverInfo.name,
          version: serverInfo.version
        }
      };

    case 'tools/list':
      return { tools };

    case 'tools/call':
      return handleToolCall(params);

    case 'resources/list':
      return { resources };

    case 'resources/read':
      return handleResourceRead(params);

    case 'prompts/list':
      return { prompts };

    case 'prompts/get':
      return handlePromptGet(params);

    default:
      throw { code: -32601, message: 'Method not found' };
  }
}

// Tool execution handler
function handleToolCall(params) {
  const { name, arguments: args } = params;

  switch (name) {
    case 'echo':
      return {
        content: [
          {
            type: 'text',
            text: args.text
          }
        ]
      };

    case 'add':
      const sum = Number(args.a) + Number(args.b);
      return {
        content: [
          {
            type: 'text',
            text: `${args.a} + ${args.b} = ${sum}`
          }
        ]
      };

    case 'greet':
      const greetings = {
        en: `Hello, ${args.name}!`,
        es: `¡Hola, ${args.name}!`,
        fr: `Bonjour, ${args.name}!`
      };
      const greeting = greetings[args.language || 'en'];
      return {
        content: [
          {
            type: 'text',
            text: greeting
          }
        ]
      };

    default:
      throw { code: -32602, message: 'Unknown tool' };
  }
}

// Resource read handler
function handleResourceRead(params) {
  const { uri } = params;

  if (uri === 'file:///example.txt') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: 'This is a sample text file from the MCP server.'
        }
      ]
    };
  } else if (uri === 'https://example.com/data.json') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({ message: 'Sample JSON data', timestamp: new Date().toISOString() })
        }
      ]
    };
  }

  throw { code: -32602, message: 'Resource not found' };
}

// Prompt get handler
function handlePromptGet(params) {
  const { name, arguments: args } = params;

  if (name === 'code-review') {
    return {
      description: 'Code review prompt',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please review the following code:\n\n${args.code}`
          }
        }
      ]
    };
  }

  throw { code: -32602, message: 'Prompt not found' };
}

// MCP endpoint
app.post('/mcp', async (req, res) => {
  try {
    const { jsonrpc, id, method, params } = req.body;

    if (jsonrpc !== '2.0') {
      return res.status(400).json({
        jsonrpc: '2.0',
        id,
        error: { code: -32600, message: 'Invalid Request' }
      });
    }

    const result = handleJsonRpc(method, params);

    res.json({
      jsonrpc: '2.0',
      id,
      result
    });
  } catch (error) {
    res.json({
      jsonrpc: '2.0',
      id: req.body.id,
      error: error.code ? error : { code: -32603, message: error.message }
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: serverInfo });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🔌 MCP Test Server running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  - POST http://localhost:${PORT}/mcp (MCP JSON-RPC)`);
  console.log(`  - GET  http://localhost:${PORT}/health (Health check)`);
  console.log(`\nAvailable tools: ${tools.map(t => t.name).join(', ')}`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

