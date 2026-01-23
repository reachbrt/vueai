<template>
  <div class="mcp-demo">
    <div class="demo-header">
      <h2>🔌 Model Context Protocol (MCP)</h2>
      <p class="demo-description">
        Connect to MCP servers and interact with tools, resources, and prompts using a clean, framework-agnostic API.
      </p>
    </div>

    <div class="demo-content">
      <!-- Connection Section -->
      <div class="demo-section">
        <h3>Server Connection</h3>
        <div class="connection-config">
          <div class="input-group">
            <label for="mcp-url">MCP Server URL</label>
            <input
              id="mcp-url"
              v-model="serverUrl"
              type="text"
              placeholder="http://localhost:3000/mcp"
              class="demo-input"
            />
          </div>

          <div class="input-group">
            <label for="mcp-auth">Authorization Token (Optional)</label>
            <input
              id="mcp-auth"
              v-model="authToken"
              type="password"
              placeholder="Bearer token..."
              class="demo-input"
            />
          </div>

          <div class="connection-actions">
            <button
              @click="handleConnect"
              :disabled="connected || loading"
              class="demo-button primary"
            >
              {{ loading ? 'Connecting...' : 'Connect' }}
            </button>
            <button
              @click="handleDisconnect"
              :disabled="!connected || loading"
              class="demo-button secondary"
            >
              Disconnect
            </button>
          </div>

          <div v-if="connected" class="connection-status success">
            ✅ Connected to {{ serverInfo?.name }} (v{{ serverInfo?.version }})
          </div>
          <div v-else-if="error" class="connection-status error">
            ❌ {{ error.message }}
          </div>
          <div v-else class="connection-status">
            ⚪ Not connected
          </div>
        </div>
      </div>

      <!-- Tools Section -->
      <div v-if="connected" class="demo-section">
        <h3>Available Tools ({{ tools.length }})</h3>
        <div v-if="tools.length === 0" class="empty-state">
          No tools available from this server
        </div>
        <div v-else class="tools-grid">
          <div
            v-for="tool in tools"
            :key="tool.name"
            class="tool-card"
            :class="{ selected: selectedTool?.name === tool.name }"
            @click="selectTool(tool)"
          >
            <h4>{{ tool.name }}</h4>
            <p v-if="tool.description">{{ tool.description }}</p>
            <span class="tool-badge">Tool</span>
          </div>
        </div>
      </div>

      <!-- Tool Execution Section -->
      <div v-if="selectedTool" class="demo-section">
        <h3>Execute: {{ selectedTool.name }}</h3>
        <div class="tool-execution">
          <div class="tool-inputs">
            <div
              v-for="(prop, key) in selectedTool.inputSchema.properties"
              :key="key"
              class="input-group"
            >
              <label :for="`tool-input-${key}`">
                {{ key }}
                <span v-if="isRequired(key)" class="required">*</span>
              </label>
              <input
                :id="`tool-input-${key}`"
                v-model="toolInputs[key]"
                type="text"
                :placeholder="prop.description || `Enter ${key}`"
                class="demo-input"
              />
            </div>
          </div>

          <div class="execution-actions">
            <button
              @click="executeTool"
              :disabled="executing"
              class="demo-button primary"
            >
              {{ executing ? 'Executing...' : 'Execute Tool' }}
            </button>
            <button
              @click="clearSelection"
              class="demo-button secondary"
            >
              Cancel
            </button>
          </div>

          <div v-if="toolResult" class="tool-result">
            <h4>Result:</h4>
            <div v-if="toolResult.isError" class="result-error">
              Error occurred during execution
            </div>
            <div v-else class="result-content">
              <div v-for="(content, idx) in toolResult.content" :key="idx">
                <div v-if="content.type === 'text'" class="text-result">
                  <pre>{{ content.text }}</pre>
                </div>
                <div v-else-if="content.type === 'image'" class="image-result">
                  <img :src="`data:${content.mimeType};base64,${content.data}`" alt="Result" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resources Section -->
      <div v-if="connected" class="demo-section">
        <h3>Available Resources ({{ resources.length }})</h3>
        <div v-if="resources.length === 0" class="empty-state">
          No resources available from this server
        </div>
        <div v-else class="resources-list">
          <div
            v-for="resource in resources"
            :key="resource.uri"
            class="resource-item"
          >
            <div class="resource-info">
              <strong>{{ resource.name }}</strong>
              <span class="resource-uri">{{ resource.uri }}</span>
              <p v-if="resource.description">{{ resource.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Chat Section -->
      <div v-if="connected" class="demo-section">
        <h3>🤖 AI Chat with MCP Tools</h3>
        <p class="section-description">
          Chat with AI that can use MCP tools and access resources to help you.
        </p>

        <!-- AI Provider Selection -->
        <div class="input-group">
          <label for="ai-provider">AI Provider</label>
          <select id="ai-provider" v-model="aiProvider" class="demo-input">
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic (Claude)</option>
          </select>
        </div>

        <div class="input-group">
          <label for="ai-key">API Key</label>
          <input
            id="ai-key"
            v-model="aiApiKey"
            type="password"
            :placeholder="`Enter your ${aiProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API key`"
            class="demo-input"
          />
        </div>

        <!-- Chat Messages -->
        <div class="chat-container">
          <div class="chat-messages" ref="chatMessagesRef">
            <div
              v-for="(message, index) in chatMessages"
              :key="index"
              :class="['chat-message', message.role]"
            >
              <div class="message-header">
                <strong>{{ message.role === 'user' ? '👤 You' : '🤖 AI' }}</strong>
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
              <div v-if="message.toolCalls && message.toolCalls.length > 0" class="tool-calls">
                <div class="tool-call-header">🔧 Tool Calls:</div>
                <div v-for="(call, idx) in message.toolCalls" :key="idx" class="tool-call">
                  <strong>{{ call.name }}</strong>
                  <pre>{{ JSON.stringify(call.arguments, null, 2) }}</pre>
                  <div v-if="call.result" class="tool-result">
                    <strong>Result:</strong>
                    <pre>{{ JSON.stringify(call.result, null, 2) }}</pre>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="aiThinking" class="chat-message assistant thinking">
              <div class="message-header">
                <strong>🤖 AI</strong>
              </div>
              <div class="message-content">
                <span class="thinking-dots">Thinking</span>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <div class="chat-input-container">
            <textarea
              v-model="chatInput"
              @keydown.enter.exact.prevent="handleChatSend"
              placeholder="Ask AI to use MCP tools... (Press Enter to send, Shift+Enter for new line)"
              class="chat-input"
              rows="3"
            ></textarea>
            <button
              @click="handleChatSend"
              :disabled="!chatInput.trim() || aiThinking || !aiApiKey"
              class="demo-button primary"
            >
              {{ aiThinking ? 'Thinking...' : 'Send' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useMCP } from '@aivue/mcp-client';
import type { MCPTool, MCPToolResult } from '@aivue/mcp-client';

const serverUrl = ref('http://localhost:3000/mcp');
const authToken = ref('');
const selectedTool = ref<MCPTool | null>(null);
const toolInputs = ref<Record<string, any>>({});
const executing = ref(false);
const toolResult = ref<MCPToolResult | null>(null);

// Create MCP client instance immediately
const headers: Record<string, string> = {};
const mcp = useMCP({
  transport: {
    type: 'http',
    url: serverUrl.value,
    headers,
  },
  timeout: 30000,
});

// Destructure the reactive refs from the composable
const { connected, serverInfo, tools, resources, loading, error } = mcp;

// AI Chat state
const aiProvider = ref<'openai' | 'anthropic'>('openai');
const aiApiKey = ref('');
const chatInput = ref('');
const aiThinking = ref(false);
const chatMessagesRef = ref<HTMLElement | null>(null);

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: Array<{
    name: string;
    arguments: any;
    result?: any;
  }>;
}

const chatMessages = ref<ChatMessage[]>([]);

const handleConnect = async () => {
  console.log('=== handleConnect called ===');
  console.log('Initial state - connected:', connected.value);
  console.log('Initial state - loading:', loading.value);

  try {
    console.log('Calling mcp.connect()...');
    await mcp.connect();

    console.log('=== After connect() ===');
    console.log('connected.value:', connected.value);
    console.log('serverInfo.value:', serverInfo.value);
    console.log('tools.value:', tools.value);
    console.log('resources.value:', resources.value);
    console.log('loading.value:', loading.value);
    console.log('error.value:', error.value);
  } catch (err: any) {
    console.error('=== Connection failed ===', err);
    console.error('Error details:', err.message, err.stack);
  }
};

const handleDisconnect = async () => {
  await mcp.disconnect();
  selectedTool.value = null;
  toolResult.value = null;
};

const selectTool = (tool: MCPTool) => {
  selectedTool.value = tool;
  toolInputs.value = {};
  toolResult.value = null;
};

const clearSelection = () => {
  selectedTool.value = null;
  toolInputs.value = {};
  toolResult.value = null;
};

const isRequired = (key: string): boolean => {
  return selectedTool.value?.inputSchema.required?.includes(key) || false;
};

const executeTool = async () => {
  if (!selectedTool.value) return;

  executing.value = true;
  toolResult.value = null;

  try {
    toolResult.value = await mcp.callTool({
      name: selectedTool.value.name,
      arguments: toolInputs.value,
    });
  } catch (err) {
    console.error('Tool execution failed:', err);
  } finally {
    executing.value = false;
  }
};

// Chat functions
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
  }
};

const handleChatSend = async () => {
  if (!chatInput.value.trim() || aiThinking.value || !aiApiKey.value) return;

  const userMessage: ChatMessage = {
    role: 'user',
    content: chatInput.value,
    timestamp: new Date(),
  };

  chatMessages.value.push(userMessage);
  const userQuery = chatInput.value;
  chatInput.value = '';
  aiThinking.value = true;
  scrollToBottom();

  try {
    if (aiProvider.value === 'openai') {
      await handleOpenAIChat(userQuery);
    } else {
      await handleAnthropicChat(userQuery);
    }
  } catch (err: any) {
    chatMessages.value.push({
      role: 'assistant',
      content: `Error: ${err.message}`,
      timestamp: new Date(),
    });
  } finally {
    aiThinking.value = false;
    scrollToBottom();
  }
};

const handleOpenAIChat = async (userQuery: string) => {
  // Build tools array for OpenAI function calling
  const openaiTools = tools.value.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));

  const messages = [
    {
      role: 'system',
      content: `You are a helpful assistant with access to MCP tools. Available resources: ${resources.value.map(r => r.name).join(', ')}. Use the tools to help the user.`,
    },
    { role: 'user', content: userQuery },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${aiApiKey.value}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages,
      tools: openaiTools,
      tool_choice: 'auto',
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const assistantMessage = data.choices[0].message;

  // Handle tool calls
  const toolCalls: any[] = [];
  if (assistantMessage.tool_calls) {
    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);

      console.log(`Calling tool: ${toolName}`, toolArgs);
      const result = await mcp.callTool({
        name: toolName,
        arguments: toolArgs,
      });

      toolCalls.push({
        name: toolName,
        arguments: toolArgs,
        result: result.content,
      });
    }

    // Get final response with tool results
    messages.push(assistantMessage);
    messages.push({
      role: 'tool',
      tool_call_id: assistantMessage.tool_calls[0].id,
      content: JSON.stringify(toolCalls[0].result),
    } as any);

    const finalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiApiKey.value}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages,
      }),
    });

    const finalData = await finalResponse.json();
    chatMessages.value.push({
      role: 'assistant',
      content: finalData.choices[0].message.content,
      timestamp: new Date(),
      toolCalls,
    });
  } else {
    chatMessages.value.push({
      role: 'assistant',
      content: assistantMessage.content,
      timestamp: new Date(),
    });
  }
};

const handleAnthropicChat = async (userQuery: string) => {
  // Build tools array for Anthropic
  const anthropicTools = tools.value.map(tool => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema,
  }));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': aiApiKey.value,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      tools: anthropicTools,
      messages: [
        {
          role: 'user',
          content: `You have access to MCP tools and resources: ${resources.value.map(r => r.name).join(', ')}. ${userQuery}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();

  // Handle tool calls
  const toolCalls: any[] = [];
  let finalContent = '';

  for (const content of data.content) {
    if (content.type === 'tool_use') {
      console.log(`Calling tool: ${content.name}`, content.input);
      const result = await mcp.callTool({
        name: content.name,
        arguments: content.input,
      });

      toolCalls.push({
        name: content.name,
        arguments: content.input,
        result: result.content,
      });

      // Get final response with tool results
      const finalResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': aiApiKey.value,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          tools: anthropicTools,
          messages: [
            {
              role: 'user',
              content: userQuery,
            },
            {
              role: 'assistant',
              content: data.content,
            },
            {
              role: 'user',
              content: [
                {
                  type: 'tool_result',
                  tool_use_id: content.id,
                  content: JSON.stringify(result.content),
                },
              ],
            },
          ],
        }),
      });

      const finalData = await finalResponse.json();
      finalContent = finalData.content.find((c: any) => c.type === 'text')?.text || '';
    } else if (content.type === 'text') {
      finalContent = content.text;
    }
  }

  chatMessages.value.push({
    role: 'assistant',
    content: finalContent || 'I processed your request.',
    timestamp: new Date(),
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
  });
};
</script>

<style scoped>
.mcp-demo {
  padding: 2rem;
}

.demo-header {
  margin-bottom: 2rem;
}

.demo-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.demo-description {
  color: #64748b;
  font-size: 1.1rem;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.demo-section h3 {
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.connection-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 500;
  color: #475569;
  font-size: 0.875rem;
}

.demo-input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.demo-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.connection-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.demo-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.demo-button.primary {
  background: #3b82f6;
  color: white;
}

.demo-button.primary:hover:not(:disabled) {
  background: #2563eb;
}

.demo-button.secondary {
  background: #f1f5f9;
  color: #475569;
}

.demo-button.secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.demo-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.connection-status {
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  margin-top: 1rem;
  background: #f8fafc;
  color: #64748b;
}

.connection-status.success {
  background: #ecfdf5;
  color: #065f46;
}

.connection-status.error {
  background: #fef2f2;
  color: #991b1b;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.tool-card {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tool-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
}

.tool-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.tool-card h4 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1rem;
}

.tool-card p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.tool-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

.tool-execution {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tool-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.required {
  color: #ef4444;
}

.execution-actions {
  display: flex;
  gap: 0.75rem;
}

.tool-result {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.tool-result h4 {
  margin: 0 0 1rem 0;
  color: #1e293b;
}

.result-error {
  padding: 1rem;
  background: #fef2f2;
  color: #991b1b;
  border-radius: 6px;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.text-result pre {
  margin: 0;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.image-result img {
  max-width: 100%;
  border-radius: 6px;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-item {
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.resource-info strong {
  display: block;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.resource-uri {
  display: block;
  color: #64748b;
  font-size: 0.875rem;
  font-family: monospace;
  margin-bottom: 0.5rem;
}

.resource-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

/* Chat Styles */
.section-description {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.chat-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.chat-messages {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-message {
  padding: 1rem;
  border-radius: 8px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message.user {
  background: #3b82f6;
  color: white;
  align-self: flex-end;
  max-width: 80%;
}

.chat-message.assistant {
  background: white;
  border: 1px solid #e2e8f0;
  align-self: flex-start;
  max-width: 80%;
}

.chat-message.thinking {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.message-time {
  opacity: 0.7;
  font-size: 0.75rem;
}

.message-content {
  line-height: 1.6;
}

.thinking-dots::after {
  content: '...';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

.tool-calls {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.tool-call-header {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #64748b;
}

.tool-call {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  border: 1px solid #e2e8f0;
}

.tool-call strong {
  color: #3b82f6;
  display: block;
  margin-bottom: 0.5rem;
}

.tool-call pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
  margin: 0.5rem 0;
}

.tool-result {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #cbd5e1;
}

.tool-result strong {
  color: #10b981;
}

.chat-input-container {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  min-height: 60px;
}

.chat-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>

