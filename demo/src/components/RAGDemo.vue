<template>
  <div class="rag-demo">
    <div class="demo-header">
      <h2>📚 RAG (Retrieval-Augmented Generation)</h2>
      <p class="demo-description">
        Upload documents or add URLs to create a knowledge base. The chatbot will use this information to answer your questions accurately.
      </p>
    </div>

    <div class="demo-content">
      <!-- RAG Chatbot -->
      <div class="rag-chat-container">
        <AiChatRAG
          :provider="selectedProvider"
          :api-key="getApiKey(selectedProvider)"
          :model="selectedModel"
          title="AI Assistant with Knowledge Base"
          placeholder="Ask a question about your documents..."
          :rag-config="{
            chunkSize: 500,
            overlap: 50,
            topK: 3,
            storageKey: 'aivue-demo-rag-kb'
          }"
          :show-knowledge-base="true"
          theme="light"
          height="600px"
        />
      </div>

      <!-- Info Panel -->
      <div class="rag-info-panel">
        <div class="info-card">
          <h3>🎯 How RAG Works</h3>
          <ol>
            <li><strong>Upload Documents:</strong> Add text files or URLs to your knowledge base</li>
            <li><strong>Automatic Chunking:</strong> Documents are split into manageable chunks</li>
            <li><strong>Smart Retrieval:</strong> When you ask a question, relevant chunks are found</li>
            <li><strong>Context Injection:</strong> Retrieved information is added to the AI prompt</li>
            <li><strong>Accurate Answers:</strong> AI responds using your document context</li>
          </ol>
        </div>

        <div class="info-card">
          <h3>💡 Try These Examples</h3>
          <div class="example-buttons">
            <button @click="addSampleDocument" class="example-btn">
              📄 Add Sample Document
            </button>
            <button @click="addSampleUrl" class="example-btn">
              🔗 Add Sample URL
            </button>
          </div>
          <p class="example-note">
            After adding documents, try asking questions like:
          </p>
          <ul class="example-questions">
            <li>"What is this document about?"</li>
            <li>"Summarize the main points"</li>
            <li>"What are the key features mentioned?"</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>⚙️ Configuration</h3>
          <div class="config-options">
            <div class="config-item">
              <label>AI Provider:</label>
              <select v-model="selectedProvider" @change="updateModel">
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
                <option value="ollama">Ollama (Local)</option>
              </select>
            </div>
            <div class="config-item">
              <label>Model:</label>
              <select v-model="selectedModel">
                <option v-for="model in availableModels" :key="model" :value="model">
                  {{ model }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="info-card">
          <h3>📝 Features</h3>
          <ul class="feature-list">
            <li>✅ Upload text files (.txt, .md)</li>
            <li>✅ Add web pages via URL</li>
            <li>✅ Automatic text chunking</li>
            <li>✅ TF-IDF based retrieval</li>
            <li>✅ Persistent storage (localStorage)</li>
            <li>✅ Configurable chunk size and overlap</li>
            <li>✅ Top-K relevance ranking</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="demo-code">
      <h3>💻 Code Example</h3>
      <pre><code>&lt;template&gt;
  &lt;AiChatRAG
    provider="openai"
    :api-key="apiKey"
    model="gpt-4o"
    :rag-config="{
      chunkSize: 500,
      topK: 3,
      storageKey: 'my-knowledge-base'
    }"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { AiChatRAG } from '@aivue/chatbot';
import '@aivue/chatbot/chatbot.css';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
&lt;/script&gt;</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { AiChatRAG, useRAG } from '@aivue/chatbot';
import '@aivue/chatbot/chatbot.css';

const selectedProvider = ref('openai');
const selectedModel = ref('gpt-4o');

// Get RAG instance for adding sample documents
const { addText, addUrl } = useRAG({ storageKey: 'aivue-demo-rag-kb' });

const modelsByProvider: Record<string, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
  claude: ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
  gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-pro'],
  ollama: ['llama3', 'mistral', 'codellama']
};

const availableModels = computed(() => modelsByProvider[selectedProvider.value] || []);

function updateModel() {
  const models = modelsByProvider[selectedProvider.value];
  if (models && models.length > 0) {
    selectedModel.value = models[0];
  }
}

function getApiKey(provider: string): string {
  switch (provider) {
    case 'openai':
      return import.meta.env.VITE_OPENAI_API_KEY || '';
    case 'claude':
      return import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    case 'gemini':
      return import.meta.env.VITE_GEMINI_API_KEY || '';
    case 'ollama':
      return 'local';
    default:
      return '';
  }
}

async function addSampleDocument() {
  const sampleText = `
# AI-Powered Vue Components

## Overview
The @aivue ecosystem provides a comprehensive suite of AI-powered components for Vue.js applications.

## Key Features
- **Chatbot**: Conversational AI with multiple provider support
- **RAG Support**: Retrieval-Augmented Generation for knowledge-based responses
- **Smart Forms**: AI-powered form validation and suggestions
- **Analytics**: Track user interactions and sentiment
- **Voice Integration**: Speech-to-text and text-to-speech capabilities

## Getting Started
Install the package using npm:
\`\`\`
npm install @aivue/chatbot @aivue/core
\`\`\`

## RAG Features
The RAG (Retrieval-Augmented Generation) feature allows you to:
1. Upload documents to create a knowledge base
2. Add URLs as knowledge sources
3. Automatically retrieve relevant context for user queries
4. Generate accurate responses based on your documents

## Best Practices
- Use chunk sizes between 500-1000 words
- Set overlap to 50-100 words for context continuity
- Retrieve 3-5 chunks for optimal context
- Keep documents well-formatted and clean
  `;

  try {
    await addText(sampleText, 'AI Components Documentation');
    alert('Sample document added! Try asking questions about it.');
  } catch (error) {
    console.error('Failed to add sample document:', error);
    alert('Failed to add sample document. Please try again.');
  }
}

async function addSampleUrl() {
  try {
    await addUrl('https://aivue.netlify.app/', 'AIVue Demo Site');
    alert('Sample URL added! Try asking questions about the AIVue project.');
  } catch (error) {
    console.error('Failed to add sample URL:', error);
    alert('Failed to add sample URL. This may be due to CORS restrictions.');
  }
}
</script>

<style scoped>
.rag-demo {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.demo-header h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.demo-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .demo-content {
    grid-template-columns: 1fr;
  }
}

.rag-chat-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.rag-info-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.info-card ol,
.info-card ul {
  margin: 0;
  padding-left: 1.5rem;
}

.info-card li {
  margin-bottom: 0.5rem;
  color: #555;
  line-height: 1.6;
}

.example-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.example-btn {
  flex: 1;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.example-btn:hover {
  background: #0056b3;
}

.example-note {
  font-size: 0.9rem;
  color: #666;
  margin: 1rem 0 0.5rem 0;
}

.example-questions {
  list-style: none;
  padding: 0;
}

.example-questions li {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-style: italic;
  color: #555;
}

.config-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-item label {
  font-weight: 500;
  color: #555;
  font-size: 0.9rem;
}

.config-item select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.feature-list li:last-child {
  border-bottom: none;
}

.demo-code {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-code h3 {
  color: #fff;
  margin: 0 0 1rem 0;
}

.demo-code pre {
  margin: 0;
  overflow-x: auto;
}

.demo-code code {
  color: #e0e0e0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}
</style>

