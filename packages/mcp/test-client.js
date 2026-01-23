// Simple test to verify the MCP client works
const { MCPClient } = require('./dist/index.js');

async function test() {
  console.log('Creating MCP client...');
  
  const client = new MCPClient({
    transport: {
      type: 'http',
      url: 'http://localhost:3000/mcp',
    },
    timeout: 30000,
  });

  // Add event listeners
  client.on('connected', (event) => {
    console.log('✅ Connected event received!');
    console.log('Server info:', event.data);
  });

  client.on('error', (event) => {
    console.error('❌ Error event received:', event.error);
  });

  try {
    console.log('Calling connect()...');
    const result = await client.connect();
    console.log('Connect returned:', result);
    console.log('Client connected state:', client.connected);
    console.log('Client serverInfo:', client.serverInfo);

    console.log('\nListing tools...');
    const tools = await client.listTools();
    console.log('Tools:', tools);

    console.log('\nListing resources...');
    const resources = await client.listResources();
    console.log('Resources:', resources);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();

