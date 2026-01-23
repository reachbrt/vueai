<template>
  <div class="tabular-intelligence-demo">
    <div class="demo-header">
      <h1>🧠 Tabular Intelligence</h1>
      <p>Tabular Foundation Model (TFM) integration for structured data analysis</p>
    </div>

    <!-- Configuration -->
    <section class="config-section">
      <h2>⚙️ Configuration</h2>
      <p class="section-description" v-if="config.provider === 'local'">
        Uses local JavaScript-based statistical analysis. No API required - perfect for testing and basic analysis.
      </p>
      <p class="section-description" v-if="config.provider === 'tabpfn'">
        TabPFN (Tabular Prior-data Fitted Network) is a state-of-the-art tabular foundation model from Prior Labs. Requires API key from <a href="https://priorlabs.ai/" target="_blank" style="color: #007ac8; text-decoration: underline;">priorlabs.ai</a>.
      </p>
      <p class="section-description" v-if="config.provider === 'custom'">
        Configure how to connect to your custom TFM API endpoint. You can specify whether the API key should be sent as a query parameter or header.
      </p>
      <div class="config-grid">
        <div class="config-item">
          <label>TFM Provider</label>
          <select v-model="config.provider" class="input">
            <option value="local">Local (JavaScript-based)</option>
            <option value="tabpfn">TabPFN (Prior Labs)</option>
            <option value="custom">Custom TFM API</option>
          </select>
          <small class="help-text">Choose your Tabular Foundation Model provider</small>
        </div>

        <div class="config-item" v-if="config.provider !== 'local'">
          <label>API Base URL</label>
          <input v-model="config.baseUrl" type="text" class="input" placeholder="https://api.example.com/tfm" />
        </div>

        <div class="config-item" v-if="config.provider !== 'local'">
          <label>API Key (Optional)</label>
          <input v-model="apiKeyValue" type="password" class="input" placeholder="your-api-key" />
          <small class="help-text" v-if="config.provider === 'tabpfn'">Get your API key from <a href="https://priorlabs.ai/" target="_blank" style="color: #007ac8; text-decoration: underline;">priorlabs.ai</a></small>
        </div>
      </div>

      <!-- Custom API Key Configuration -->
      <h3 style="margin-top: 1.5rem;" v-if="config.provider === 'custom'">🔑 API Key Configuration</h3>
      <p class="section-description" v-if="config.provider === 'custom'">
        Configure how the API key should be sent to your TFM API endpoint.
      </p>
      <div class="config-grid" v-if="config.provider === 'custom'">
        <div class="config-item">
          <label>API Key Location</label>
          <select v-model="apiKeyLocation" class="input">
            <option value="query">Query Parameter</option>
            <option value="header">Header</option>
          </select>
          <small class="help-text">Choose how to send the API key to the server</small>
        </div>

        <div class="config-item" v-if="config.provider === 'custom' && apiKeyLocation === 'query'">
          <label>Query Parameter Name</label>
          <input v-model="apiKeyQueryParam" type="text" class="input" placeholder="api_key" />
          <small class="help-text">The parameter name for the API key (e.g., "api_key", "access_key", "key")</small>
        </div>

        <div class="config-item" v-if="config.provider === 'custom' && apiKeyLocation === 'header'">
          <label>Header Name</label>
          <input v-model="apiKeyHeaderName" type="text" class="input" placeholder="Authorization" />
          <small class="help-text">e.g., "Authorization", "X-API-Key", "Api-Key"</small>
        </div>

        <div class="config-item" v-if="config.provider === 'custom' && apiKeyLocation === 'header'">
          <label>Header Value Format</label>
          <select v-model="apiKeyHeaderFormat" class="input">
            <option value="direct">Direct (api-key-value)</option>
            <option value="bearer">Bearer (Bearer api-key-value)</option>
            <option value="apikey">API Key (ApiKey api-key-value)</option>
          </select>
          <small class="help-text">How to format the header value</small>
        </div>
      </div>

      <!-- General Settings -->
      <h3 style="margin-top: 1.5rem;">⚙️ General Settings</h3>
      <div class="config-grid">
        <div class="config-item">
          <label>Use Local Fallback</label>
          <input v-model="useLocalFallback" type="checkbox" />
          <small class="help-text">If API fails, fallback to local JavaScript-based analysis</small>
        </div>
      </div>

      <h3 style="margin-top: 1.5rem;" v-if="config.provider === 'custom'">📋 Postman Collection (Optional)</h3>
      <p class="section-description" v-if="config.provider === 'custom'">
        Upload a Postman Collection JSON file to automatically discover API endpoints and their configurations.
      </p>
      <div v-if="config.provider === 'custom'" style="margin-bottom: 1.5rem;">
        <div class="postman-upload-section">
          <input
            type="file"
            ref="postmanFileInput"
            accept=".json,application/json"
            @change="handlePostmanUpload"
            style="display: none;"
          />
          <button @click="$refs.postmanFileInput.click()" class="btn btn-secondary">
            📤 Upload Postman Collection
          </button>
          <span v-if="postmanCollection" style="margin-left: 1rem; color: #10b981;">
            ✅ {{ postmanCollection.name }} ({{ postmanEndpoints.length }} endpoints)
          </span>
          <button
            v-if="postmanCollection"
            @click="clearPostmanCollection"
            class="btn btn-danger"
            style="margin-left: 0.5rem;"
          >
            🗑️ Clear
          </button>
        </div>

        <div v-if="postmanEndpoints.length > 0" class="postman-endpoints">
          <h4 style="margin-top: 1rem; margin-bottom: 0.5rem;">📡 Available Endpoints:</h4>
          <div class="endpoints-list">
            <div
              v-for="(endpoint, idx) in postmanEndpoints"
              :key="idx"
              class="endpoint-item"
              :class="{ selected: selectedEndpoint === endpoint }"
              @click="selectEndpoint(endpoint)"
            >
              <div class="endpoint-method" :class="endpoint.method.toLowerCase()">{{ endpoint.method }}</div>
              <div class="endpoint-details">
                <div class="endpoint-name">{{ endpoint.name }}</div>
                <div class="endpoint-url">{{ endpoint.url }}</div>
                <div v-if="endpoint.description" class="endpoint-description">{{ endpoint.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 style="margin-top: 1.5rem;" v-if="config.provider === 'custom'">🔗 API Data Endpoint (Optional)</h3>
      <p class="section-description" v-if="config.provider === 'custom'">
        Configure an endpoint to fetch tabular data from your API. This data will be used for Q&A and analysis.
      </p>
      <div class="config-grid" v-if="config.provider === 'custom'">
        <div class="config-item">
          <label>Data Endpoint URL</label>
          <input v-model="dataEndpoint" type="text" class="input" placeholder="https://api.example.com/data" />
          <small class="help-text">Full URL to fetch data (leave empty to use manual data loading)</small>
        </div>

        <div class="config-item">
          <label>HTTP Method</label>
          <select v-model="dataEndpointMethod" class="input">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>

        <div class="config-item">
          <label>Response Data Path</label>
          <input v-model="dataResponsePath" type="text" class="input" placeholder="data" />
          <small class="help-text">JSON path to the array (e.g., "data", "results", "data.items")</small>
        </div>

        <div class="config-item">
          <label>Use CORS Proxy</label>
          <input v-model="useCorsProxy" type="checkbox" />
          <small class="help-text">✅ Enabled by default to avoid CORS errors when fetching from external APIs</small>
        </div>

        <div class="config-item" v-if="useCorsProxy">
          <label>CORS Proxy URL</label>
          <input v-model="corsProxyUrl" type="text" class="input" placeholder="https://corsproxy.io/?" />
          <small class="help-text">CORS proxy server URL (default: corsproxy.io - free and reliable)</small>
        </div>

        <div class="config-item">
          <label>Enable Pagination</label>
          <input v-model="paginationEnabled" type="checkbox" />
          <small class="help-text">Enable if the API returns paginated data</small>
        </div>

        <div class="config-item" v-if="paginationEnabled">
          <label>Pagination Type</label>
          <select v-model="paginationType" class="input">
            <option value="offset">Offset-based (limit/offset)</option>
            <option value="page">Page-based (page/per_page)</option>
            <option value="cursor">Cursor-based (next_cursor)</option>
          </select>
          <small class="help-text">How the API handles pagination</small>
        </div>

        <div class="config-item" v-if="paginationEnabled && paginationType !== 'cursor'">
          <label>Items Per Page</label>
          <input v-model.number="itemsPerPage" type="number" class="input" placeholder="20" min="1" />
          <small class="help-text">Number of items to fetch per page</small>
        </div>

        <div class="config-item" v-if="paginationEnabled">
          <label>Total Count Path</label>
          <input v-model="totalCountPath" type="text" class="input" placeholder="total" />
          <small class="help-text">JSON path to total count (e.g., "total", "meta.total")</small>
        </div>

        <div class="config-item" v-if="paginationEnabled && paginationType === 'cursor'">
          <label>Next Cursor Path</label>
          <input v-model="nextCursorPath" type="text" class="input" placeholder="next_cursor" />
          <small class="help-text">JSON path to next cursor (e.g., "next_cursor", "pagination.next")</small>
        </div>
      </div>

      <h3 style="margin-top: 1.5rem;">💬 AI Chatbot Configuration</h3>
      <p class="section-description">
        <strong>🤖 Natural Language Q&A:</strong> Ask questions about your data in plain English!
        The AI chatbot will analyze your data and provide intelligent answers.
        <br/>
        <strong>Note:</strong> Q&A uses OpenAI or Anthropic for conversational insights, separate from TFM statistical analysis.
      </p>
      <div class="config-grid">
        <div class="config-item">
          <label>AI Provider</label>
          <select v-model="qaConfig.provider" class="input">
            <option value="openai">OpenAI (GPT-4)</option>
            <option value="anthropic">Anthropic (Claude)</option>
          </select>
          <small class="help-text">Choose your AI model for natural language questions</small>
        </div>

        <div class="config-item">
          <label>API Key</label>
          <input v-model="qaConfig.apiKey" type="password" class="input" placeholder="sk-..." />
          <small class="help-text">
            <span v-if="qaConfig.provider === 'openai'">Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" style="color: #007ac8; text-decoration: underline;">OpenAI</a></span>
            <span v-else>Get your key from <a href="https://console.anthropic.com/" target="_blank" style="color: #007ac8; text-decoration: underline;">Anthropic</a></span>
          </small>
        </div>

        <div class="config-item" v-if="qaConfig.provider === 'openai'">
          <label>Model (Optional)</label>
          <input v-model="qaConfig.model" type="text" class="input" placeholder="gpt-4-turbo-preview" />
          <small class="help-text">Default: gpt-4-turbo-preview</small>
        </div>

        <div class="config-item" v-if="qaConfig.provider === 'anthropic'">
          <label>Model (Optional)</label>
          <input v-model="qaConfig.model" type="text" class="input" placeholder="claude-3-5-sonnet-20241022" />
          <small class="help-text">Default: claude-3-5-sonnet-20241022</small>
        </div>
      </div>

      <button @click="initializeClient" class="btn btn-primary">
        Initialize Client
      </button>

      <div v-if="intelligence" class="success-message" style="margin-top: 1rem;">
        ✅ Client initialized successfully! Provider: <strong>{{ config.provider }}</strong>
        <span v-if="config.provider === 'custom' && apiKeyValue">
          | API Key: <strong>{{ apiKeyLocation === 'header' ? 'Header' : 'Query Parameter' }}</strong>
        </span>
      </div>
    </section>

    <!-- Sample Data -->
    <section class="data-section">
      <h2>📊 Data</h2>
      <div class="data-controls">
        <button @click="loadSampleData" class="btn btn-primary">Load Sample Data</button>
        <button @click="generateRandomData" class="btn">Generate Random Data</button>
        <button
          v-if="config.provider === 'custom' && dataEndpoint"
          @click="fetchDataFromAPI"
          :disabled="fetchingData"
          class="btn btn-success"
        >
          {{ fetchingData ? 'Fetching...' : 'Fetch Data from API' }}
        </button>
      </div>

      <div v-if="tableData.length > 0" class="data-preview">
        <div class="data-loaded-banner" v-if="qaEnabled">
          <div class="banner-icon">🤖</div>
          <div class="banner-content">
            <h4>Data Loaded Successfully!</h4>
            <p>
              You can now ask questions about your data using the <strong>AI Chatbot</strong> below.
              Try asking: "What are the key insights?" or "Show me the top values"
            </p>
          </div>
          <a href="#qa-section" class="banner-action">
            💬 Go to Chatbot
          </a>
        </div>

        <div class="data-info-bar">
          <p>
            <strong>{{ tableData.length }}</strong> rows loaded
            <span v-if="paginationInfo.total && paginationInfo.total > tableData.length">
              ({{ paginationInfo.total }} total available)
            </span>
            with <strong>{{ Object.keys(tableData[0]).length }}</strong> columns
          </p>
          <div v-if="paginationInfo.hasMore" class="pagination-controls">
            <button @click="loadMoreData" :disabled="fetchingData" class="btn btn-sm btn-primary">
              {{ fetchingData ? 'Loading...' : '📥 Load More Data' }}
            </button>
            <span v-if="paginationInfo.currentPage" class="page-info">
              Page {{ paginationInfo.currentPage }}
              <span v-if="paginationInfo.totalPages"> of {{ paginationInfo.totalPages }}</span>
            </span>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th v-for="col in Object.keys(tableData[0])" :key="col">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in tableData.slice(0, displayRowCount)" :key="idx">
                <td v-for="col in Object.keys(row)" :key="col">{{ row[col] }}</td>
              </tr>
            </tbody>
          </table>
          <div class="table-footer">
            <p class="table-note">
              Showing {{ Math.min(displayRowCount, tableData.length) }} of {{ tableData.length }} loaded rows
              <span v-if="paginationInfo.total && paginationInfo.total > tableData.length">
                ({{ paginationInfo.total }} total available)
              </span>
            </p>
            <div class="table-actions">
              <button
                v-if="displayRowCount < tableData.length"
                @click="displayRowCount += 10"
                class="btn btn-sm btn-secondary"
              >
                Show More Rows
              </button>
              <button
                v-if="displayRowCount > 10"
                @click="displayRowCount = 10"
                class="btn btn-sm btn-secondary"
              >
                Show Less
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Q&A Section -->
    <section id="qa-section" class="qa-section" v-if="intelligence && qaEnabled">
      <div class="qa-header">
        <div class="qa-header-content">
          <h2>🤖 AI Chatbot - Ask Anything About Your Data</h2>
          <p class="qa-description">
            💬 <strong>Natural Language Q&A:</strong> Ask questions in plain English and get intelligent answers powered by AI.
            <br/>
            🔬 <strong>Advanced Analysis:</strong> Request descriptive statistics, anomaly detection, clustering, correlation analysis, predictions, and insights.
            <br/>
            <span v-if="config.provider === 'custom' && dataEndpoint">
              📡 <strong>Connected to:</strong> {{ dataEndpoint }}
            </span>
          </p>
        </div>
        <div class="qa-stats">
          <div class="qa-stat-item">
            <span class="qa-stat-value">{{ tableData.length }}</span>
            <span class="qa-stat-label">Rows Loaded</span>
          </div>
          <div class="qa-stat-item">
            <span class="qa-stat-value">{{ Object.keys(tableData[0] || {}).length }}</span>
            <span class="qa-stat-label">Columns</span>
          </div>
          <div class="qa-stat-item">
            <span class="qa-stat-value">{{ intelligence?.questionHistory?.value?.length || 0 }}</span>
            <span class="qa-stat-label">Questions Asked</span>
          </div>
        </div>
      </div>

      <div v-if="tableData.length === 0" class="qa-empty-state">
        <div class="empty-state-icon">🤖</div>
        <h3>Ready to Chat!</h3>
        <p>Load data first to start asking questions:</p>
        <ul>
          <li v-if="config.provider === 'custom' && dataEndpoint">
            <strong>📡 Fetch from API:</strong> Click "Fetch Data from API" to load data from {{ dataEndpoint }}
          </li>
          <li v-else>
            <strong>📊 Load Data:</strong> Click "Load Sample Data" or "Generate Random Data" button above
          </li>
        </ul>
        <p style="margin-top: 1rem; color: #64748b;">
          Once data is loaded, you can ask questions like:
          <br/>
          "Calculate descriptive statistics", "Detect anomalies", "Perform clustering", "Show correlation analysis", "Predict future trends"
        </p>
      </div>

      <div v-else class="qa-content">
        <!-- Debug Info (set v-if="true" to enable for troubleshooting) -->
        <div v-if="false" style="background: #f0f0f0; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; font-size: 0.85rem; font-family: monospace;">
          <strong>🐛 Debug Info:</strong><br/>
          <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem; margin-top: 0.5rem;">
            <span>Local Chat Messages:</span> <strong>{{ localChatHistory.length }}</strong><br/>
            <span>Intelligence:</span> <strong>{{ intelligence ? '✅ initialized' : '❌ null' }}</strong><br/>
            <span>QA Enabled:</span> <strong>{{ qaEnabled ? '✅ yes' : '❌ no' }}</strong><br/>
            <span>QA Provider:</span> <strong>{{ qaConfig.provider }}</strong><br/>
            <span>Has API Key:</span> <strong>{{ qaConfig.apiKey ? '✅ yes' : '❌ no' }}</strong><br/>
            <span>Table Data:</span> <strong>{{ tableData.length }} rows</strong>
          </div>
          <div v-if="localChatHistory.length > 0" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ccc;">
            <strong>📝 Local Chat History:</strong><br/>
            <div v-for="(msg, i) in localChatHistory" :key="i" style="margin-top: 0.5rem; padding: 0.5rem; background: white; border-radius: 4px;">
              <div><strong>Q{{ i + 1 }}:</strong> {{ msg.question }}</div>
              <div v-if="msg.isLoading"><em>Loading...</em></div>
              <div v-else-if="msg.answer"><strong>A{{ i + 1 }}:</strong> {{ msg.answer.text }}</div>
            </div>
          </div>
        </div>

        <!-- Sample Questions -->
        <div v-if="localChatHistory.length === 0" class="sample-questions">
          <h3>💡 Try asking:</h3>
          <div class="sample-questions-grid">
            <button
              v-for="(sample, index) in sampleQuestions"
              :key="index"
              class="sample-question-btn"
              @click="handleQuestion(sample)"
              :disabled="loading"
            >
              <span class="sample-q-icon">{{ sample.icon }}</span>
              <span class="sample-q-text">{{ sample.text }}</span>
            </button>
          </div>
        </div>

        <!-- Chat Interface -->
        <div class="qa-chat-container">
          <div class="qa-messages" ref="messagesContainer">
            <!-- Empty state when no messages -->
            <div v-if="localChatHistory.length === 0 && !loading" style="text-align: center; padding: 2rem; color: #64748b;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
              <p>No messages yet. Ask a question to start the conversation!</p>
            </div>

            <!-- Chat messages -->
            <div
              v-for="(message, index) in localChatHistory"
              :key="message.id"
              class="qa-message-group"
            >
              <!-- User Question -->
              <div class="qa-message qa-message-user">
                <div class="qa-message-avatar">👤</div>
                <div class="qa-message-content">
                  <div class="qa-message-text">{{ message.question }}</div>
                  <div class="qa-message-time">{{ formatTime(message.timestamp) }}</div>
                </div>
              </div>

              <!-- AI Answer - Loading State -->
              <div v-if="message.isLoading" class="qa-message qa-message-ai qa-message-loading">
                <div class="qa-message-avatar">🤖</div>
                <div class="qa-message-content">
                  <div class="qa-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>

              <!-- AI Answer - Actual Response -->
              <div v-else-if="message.answer" class="qa-message qa-message-ai" :class="{ 'qa-message-error': message.answer.cannotAnswer }">
                <div class="qa-message-avatar">🤖</div>
                <div class="qa-message-content">
                  <div class="qa-message-header">
                    <span class="qa-confidence-badge" :class="getConfidenceClass(message.answer.confidence)">
                      {{ Math.round(message.answer.confidence * 100) }}% confident
                    </span>
                    <span v-if="message.answer.isApproximate" class="qa-approximate-badge">
                      ~Approximate
                    </span>
                  </div>
                  <div class="qa-message-text">{{ message.answer.text }}</div>
                  <div v-if="message.answer.reason && message.answer.cannotAnswer" class="qa-message-reason">
                    <strong>Reason:</strong> {{ message.answer.reason }}
                  </div>
                  <div class="qa-message-time">{{ formatTime(message.answer.timestamp) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="qa-input-container">
            <QuestionInput
              :loading="loading"
              :disabled="tableData.length === 0"
              @submit="handleQuestion"
              placeholder="Ask anything about your data..."
              submitLabel="Send"
            />
          </div>
        </div>

        <!-- Quick Actions -->
        <div v-if="localChatHistory.length > 0" class="qa-actions">
          <button @click="clearHistory" class="qa-action-btn qa-clear-btn">
            <span>🗑️</span> Clear History
          </button>
          <button @click="exportChat" class="qa-action-btn qa-export-btn">
            <span>📥</span> Export Chat
          </button>
        </div>
      </div>
    </section>

    <!-- Error Display -->
    <div v-if="error" class="error-message">
      <strong>Error:</strong> {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTabularIntelligence, QuestionInput, AnswerDisplay, QuestionHistory, parsePostmanCollection } from '@aivue/tabular-intelligence';
import type { TFMConfig, AnalysisResult, Answer, ParsedEndpoint } from '@aivue/tabular-intelligence';

// Configuration
const config = ref<TFMConfig>({
  provider: 'local',
  baseUrl: '',
  apiKey: '',
  timeout: 30000,
});

const useLocalFallback = ref(true);

// API Key configuration for custom API
const apiKeyValue = ref('');
const apiKeyLocation = ref<'query' | 'header'>('query');
const apiKeyQueryParam = ref('access_key');
const apiKeyHeaderName = ref('Authorization');
const apiKeyHeaderFormat = ref<'direct' | 'bearer' | 'apikey'>('bearer');

// Data endpoint configuration for custom API
const dataEndpoint = ref('');
const dataEndpointMethod = ref<'GET' | 'POST'>('GET');
const dataResponsePath = ref('data');
const fetchingData = ref(false);
const useCorsProxy = ref(true); // Enable by default for better UX
const corsProxyUrl = ref('https://corsproxy.io/?');

// Postman Collection
const postmanFileInput = ref<HTMLInputElement | null>(null);
const postmanCollection = ref<any>(null);
const postmanEndpoints = ref<any[]>([]);
const selectedEndpoint = ref<any>(null);

// Pagination
const paginationEnabled = ref(false);
const paginationType = ref<'offset' | 'page' | 'cursor'>('page');
const itemsPerPage = ref(20);
const totalCountPath = ref('total');
const nextCursorPath = ref('next_cursor');
const displayRowCount = ref(10);

const paginationInfo = ref({
  isPaginated: false,
  hasMore: false,
  currentPage: 1,
  totalPages: 0,
  total: 0,
  nextCursor: null as string | null,
  currentOffset: 0,
});

// LocalStorage key for custom API configuration
const CUSTOM_API_STORAGE_KEY = 'tabular-intelligence-custom-api-config';

// Load custom API field values from localStorage
const loadCustomApiConfig = () => {
  try {
    const stored = localStorage.getItem(CUSTOM_API_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('📂 Loaded custom API config from localStorage:', parsed);
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load custom API config from localStorage:', err);
  }
  return {
    baseUrl: '',
    apiKeyValue: '',
    apiKeyLocation: 'query' as 'query' | 'header',
    apiKeyQueryParam: 'access_key',
    apiKeyHeaderName: 'Authorization',
    apiKeyHeaderFormat: 'bearer' as 'direct' | 'bearer' | 'apikey',
    dataEndpoint: '',
    dataEndpointMethod: 'GET' as 'GET' | 'POST',
    dataResponsePath: 'data',
  };
};

// Store custom API field values to remember them
const customApiFieldValues = ref(loadCustomApiConfig());

// Q&A Configuration
const qaConfig = ref({
  provider: 'openai' as 'openai' | 'anthropic' | 'custom',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: 'gpt-4-turbo-preview',
});

const qaEnabled = ref(false);

// Data
const tableData = ref<any[]>([]);

// Intelligence client
const intelligence = ref<ReturnType<typeof useTabularIntelligence> | null>(null);

// Local chat history - managed directly in the demo
interface ChatMessage {
  id: string;
  question: string;
  answer: Answer | null;
  timestamp: Date;
  isLoading?: boolean;
}

const localChatHistory = ref<ChatMessage[]>([]);

// State
const loading = computed(() => {
  if (!intelligence.value) return false;
  return intelligence.value.loading?.value || false;
});

const error = computed(() => {
  if (!intelligence.value) return null;
  return intelligence.value.error?.value || null;
});

const questionHistory = computed(() => {
  if (!intelligence.value) return [];
  return intelligence.value.questionHistory?.value || [];
});

const lastAnswer = computed(() => {
  if (!intelligence.value) return null;
  return intelligence.value.lastAnswer?.value || null;
});

// Sample questions - dynamically generated based on data
const sampleQuestions = computed(() => {
  const questions = [
    { icon: '📊', text: 'Calculate descriptive statistics for this data' },
    { icon: '🚨', text: 'Detect anomalies and outliers in the data' },
    { icon: '🎯', text: 'Perform clustering analysis on the data' },
    { icon: '📈', text: 'Show correlation analysis between variables' },
    { icon: '🔮', text: 'Predict future trends based on this data' },
    { icon: '💡', text: 'Give me key insights and recommendations' },
  ];

  // Add dynamic questions based on actual column names
  if (tableData.value.length > 0) {
    const columns = Object.keys(tableData.value[0]);
    const numericColumns = columns.filter(col => {
      const firstValue = tableData.value[0][col];
      return typeof firstValue === 'number';
    });

    // Add column-specific questions
    if (numericColumns.length > 0) {
      const firstNumCol = numericColumns[0];
      questions.push({ icon: '🔢', text: `What is the average ${firstNumCol}?` });
    }

    if (columns.length > 1) {
      questions.push({ icon: '🔗', text: `What is the relationship between ${columns[0]} and ${columns[1]}?` });
    }
  }

  return questions;
});

// Use local chat history directly - no computed needed
// This ensures reactivity works properly

// Reference to messages container for auto-scroll
const messagesContainer = ref<HTMLElement | null>(null);

/**
 * Initialize the tabular intelligence client
 */
function initializeClient() {
  try {
    // Build config with API key settings
    const finalConfig: TFMConfig = { ...config.value };

    // Add CORS proxy configuration
    finalConfig.useCorsProxy = useCorsProxy.value;
    finalConfig.corsProxyUrl = corsProxyUrl.value;

    // Handle custom API key configuration
    if (config.value.provider === 'custom' && apiKeyValue.value) {
      if (apiKeyLocation.value === 'header') {
        // Add API key as header
        let headerValue = apiKeyValue.value;

        if (apiKeyHeaderFormat.value === 'bearer') {
          headerValue = `Bearer ${apiKeyValue.value}`;
        } else if (apiKeyHeaderFormat.value === 'apikey') {
          headerValue = `ApiKey ${apiKeyValue.value}`;
        }

        finalConfig.headers = {
          ...finalConfig.headers,
          [apiKeyHeaderName.value]: headerValue,
        };
      } else {
        // Add API key as query parameter by appending to base URL
        if (finalConfig.baseUrl) {
          const separator = finalConfig.baseUrl.includes('?') ? '&' : '?';
          const paramName = apiKeyQueryParam.value || 'api_key';
          finalConfig.baseUrl = `${finalConfig.baseUrl}${separator}${paramName}=${encodeURIComponent(apiKeyValue.value)}`;
        }
      }
    } else if (apiKeyValue.value) {
      // For non-custom providers, use standard apiKey
      finalConfig.apiKey = apiKeyValue.value;
    }

    intelligence.value = useTabularIntelligence({
      config: finalConfig,
      data: tableData,
      useLocalFallback: useLocalFallback.value,
      qaConfig: qaConfig.value.apiKey ? qaConfig.value : undefined,
    });

    // Enable Q&A if API key is provided
    qaEnabled.value = !!qaConfig.value.apiKey;

    console.log('✅ Tabular Intelligence client initialized successfully!', {
      provider: finalConfig.provider,
      hasApiKey: !!apiKeyValue.value,
      apiKeyLocation: config.value.provider === 'custom' && apiKeyValue.value ? apiKeyLocation.value : 'N/A',
      useLocalFallback: useLocalFallback.value,
      qaEnabled: qaEnabled.value,
      useCorsProxy: finalConfig.useCorsProxy,
      corsProxyUrl: finalConfig.corsProxyUrl,
    });
  } catch (error) {
    console.error('❌ Error initializing Tabular Intelligence client:', error);
  }
}

/**
 * Fetch data from custom API endpoint
 */
async function fetchDataFromAPI() {
  if (!dataEndpoint.value) {
    alert('Please enter a data endpoint URL');
    return;
  }

  fetchingData.value = true;

  try {
    // Build URL with API key if needed
    let url = dataEndpoint.value;

    // Add API key as query parameter if configured
    if (apiKeyValue.value && apiKeyLocation.value === 'query') {
      const separator = url.includes('?') ? '&' : '?';
      const paramName = apiKeyQueryParam.value || 'api_key';
      url = `${url}${separator}${paramName}=${encodeURIComponent(apiKeyValue.value)}`;
    }

    // Add CORS proxy if enabled
    if (useCorsProxy.value && corsProxyUrl.value) {
      // Handle different proxy URL formats
      if (corsProxyUrl.value.includes('?')) {
        // Format: https://corsproxy.io/?
        url = corsProxyUrl.value + encodeURIComponent(url);
      } else {
        // Format: https://cors-anywhere.herokuapp.com/
        const proxyUrl = corsProxyUrl.value.endsWith('/')
          ? corsProxyUrl.value
          : corsProxyUrl.value + '/';
        url = proxyUrl + url;
      }
      console.log('Using CORS proxy:', corsProxyUrl.value);
      console.log('Proxied URL:', url);
    }

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API key as header if configured
    if (apiKeyValue.value && apiKeyLocation.value === 'header') {
      let headerValue = apiKeyValue.value;

      if (apiKeyHeaderFormat.value === 'bearer') {
        headerValue = `Bearer ${apiKeyValue.value}`;
      } else if (apiKeyHeaderFormat.value === 'apikey') {
        headerValue = `ApiKey ${apiKeyValue.value}`;
      }

      headers[apiKeyHeaderName.value] = headerValue;
    }

    console.log('Fetching data from:', url);
    console.log('Request headers:', headers);

    let response;
    try {
      response = await fetch(url, {
        method: dataEndpointMethod.value,
        headers,
        mode: 'cors', // Explicitly set CORS mode
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);

      // Check if it's a CORS error
      if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
        const corsMessage = useCorsProxy.value
          ? 'CORS Error: The request failed even with CORS proxy enabled.\n\n' +
            'Possible solutions:\n' +
            '1. Try a different CORS proxy (e.g., https://cors-anywhere.herokuapp.com/)\n' +
            '2. Check if the API endpoint URL is correct\n' +
            '3. Verify your API key is valid\n' +
            '4. Use "Load Sample Data" for testing instead'
          : 'CORS Error: The API does not allow requests from the browser.\n\n' +
            'Solutions:\n' +
            '1. Enable "Use CORS Proxy" checkbox below\n' +
            '2. Or use "Load Sample Data" for testing instead';
        throw new Error(corsMessage);
      }
      throw fetchError;
    }

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Unable to read error response';
      }

      // Provide helpful error messages based on status code
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      if (response.status === 401 || response.status === 403) {
        errorMessage += '\n\nThis is likely an authentication error. Please check:\n' +
          '1. Your API key is correct\n' +
          '2. The API key location (query parameter or header) is correct\n' +
          '3. The parameter/header name matches what the API expects';
      } else if (response.status === 404) {
        errorMessage += '\n\nThe API endpoint was not found. Please check:\n' +
          '1. The endpoint URL is correct\n' +
          '2. The API version (v1, v2, etc.) is correct';
      } else if (response.status === 500) {
        errorMessage += '\n\nThe API server encountered an error. Please check:\n' +
          '1. Your request parameters are valid\n' +
          '2. The API service is operational\n' +
          '3. Try again in a few moments';
      }

      if (errorText) {
        errorMessage += '\n\nDetails: ' + errorText;
      }

      throw new Error(errorMessage);
    }

    const jsonData = await response.json();
    console.log('API Response:', jsonData);

    // Extract data from response using the path
    let extractedData = jsonData;
    if (dataResponsePath.value) {
      const pathParts = dataResponsePath.value.split('.');
      for (const part of pathParts) {
        if (extractedData && typeof extractedData === 'object' && part in extractedData) {
          extractedData = extractedData[part];
        } else {
          throw new Error(`Path "${dataResponsePath.value}" not found in response`);
        }
      }
    }

    // Validate that we got an array
    if (!Array.isArray(extractedData)) {
      throw new Error('Response data is not an array. Please check the Response Data Path.');
    }

    tableData.value = extractedData;
    console.log('✅ Data fetched from API:', tableData.value.length, 'rows');

    // Check for pagination info
    if (paginationEnabled.value) {
      updatePaginationInfo(jsonData);
    }

    if (!intelligence.value) {
      console.log('Initializing client automatically...');
      initializeClient();
    }
  } catch (err) {
    console.error('Failed to fetch data from API:', err);
    alert(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    fetchingData.value = false;
  }
}

/**
 * Update pagination info from API response
 */
function updatePaginationInfo(response: any) {
  try {
    // Extract total count
    if (totalCountPath.value) {
      const pathParts = totalCountPath.value.split('.');
      let total = response;
      for (const part of pathParts) {
        if (total && typeof total === 'object' && part in total) {
          total = total[part];
        }
      }
      if (typeof total === 'number') {
        paginationInfo.value.total = total;
        paginationInfo.value.isPaginated = true;
      }
    }

    // Extract next cursor for cursor-based pagination
    if (paginationType.value === 'cursor' && nextCursorPath.value) {
      const pathParts = nextCursorPath.value.split('.');
      let cursor = response;
      for (const part of pathParts) {
        if (cursor && typeof cursor === 'object' && part in cursor) {
          cursor = cursor[part];
        }
      }
      paginationInfo.value.nextCursor = cursor || null;
      paginationInfo.value.hasMore = !!cursor;
    } else {
      // For offset/page-based pagination
      const loaded = tableData.value.length;
      const total = paginationInfo.value.total;
      paginationInfo.value.hasMore = total > loaded;

      if (paginationType.value === 'page') {
        paginationInfo.value.totalPages = Math.ceil(total / itemsPerPage.value);
      }
    }

    console.log('📄 Pagination info updated:', paginationInfo.value);
  } catch (err) {
    console.error('Failed to parse pagination info:', err);
  }
}

/**
 * Load more data (next page)
 */
async function loadMoreData() {
  if (!dataEndpoint.value || !paginationInfo.value.hasMore) return;

  fetchingData.value = true;

  try {
    let url = dataEndpoint.value;
    const separator = url.includes('?') ? '&' : '?';

    // Add pagination parameters based on type
    if (paginationType.value === 'offset') {
      paginationInfo.value.currentOffset += itemsPerPage.value;
      url += `${separator}limit=${itemsPerPage.value}&offset=${paginationInfo.value.currentOffset}`;
    } else if (paginationType.value === 'page') {
      paginationInfo.value.currentPage += 1;
      url += `${separator}page=${paginationInfo.value.currentPage}&per_page=${itemsPerPage.value}`;
    } else if (paginationType.value === 'cursor' && paginationInfo.value.nextCursor) {
      url += `${separator}cursor=${encodeURIComponent(paginationInfo.value.nextCursor)}`;
    }

    // Add API key if needed
    if (apiKeyValue.value && apiKeyLocation.value === 'query') {
      const paramName = apiKeyQueryParam.value || 'api_key';
      url += `&${paramName}=${encodeURIComponent(apiKeyValue.value)}`;
    }

    // Add CORS proxy if enabled
    if (useCorsProxy.value && corsProxyUrl.value) {
      if (corsProxyUrl.value.includes('?')) {
        url = corsProxyUrl.value + encodeURIComponent(url);
      } else {
        const proxyUrl = corsProxyUrl.value.endsWith('/')
          ? corsProxyUrl.value
          : corsProxyUrl.value + '/';
        url = proxyUrl + url;
      }
    }

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKeyValue.value && apiKeyLocation.value === 'header') {
      let headerValue = apiKeyValue.value;
      if (apiKeyHeaderFormat.value === 'bearer') {
        headerValue = `Bearer ${apiKeyValue.value}`;
      } else if (apiKeyHeaderFormat.value === 'apikey') {
        headerValue = `ApiKey ${apiKeyValue.value}`;
      }
      headers[apiKeyHeaderName.value] = headerValue;
    }

    const response = await fetch(url, {
      method: dataEndpointMethod.value,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const jsonData = await response.json();

    // Extract data from response
    let extractedData = jsonData;
    if (dataResponsePath.value) {
      const pathParts = dataResponsePath.value.split('.');
      for (const part of pathParts) {
        if (extractedData && typeof extractedData === 'object' && part in extractedData) {
          extractedData = extractedData[part];
        }
      }
    }

    if (!Array.isArray(extractedData)) {
      throw new Error('Response data is not an array');
    }

    // Append new data to existing data
    tableData.value = [...tableData.value, ...extractedData];
    console.log('✅ Loaded more data. Total rows:', tableData.value.length);

    // Update pagination info
    updatePaginationInfo(jsonData);
  } catch (err) {
    console.error('Failed to load more data:', err);
    alert(`Failed to load more data: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    fetchingData.value = false;
  }
}

/**
 * Handle Postman collection upload
 */
async function handlePostmanUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    const text = await file.text();
    const json = JSON.parse(text);

    const parsed = parsePostmanCollection(json);
    postmanCollection.value = parsed;
    postmanEndpoints.value = parsed.endpoints;

    console.log('✅ Postman collection loaded:', parsed.name);
    console.log('📡 Found endpoints:', parsed.endpoints.length);

    alert(`Successfully loaded ${parsed.endpoints.length} endpoints from "${parsed.name}"`);
  } catch (err) {
    console.error('Failed to parse Postman collection:', err);
    alert(`Failed to parse Postman collection: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Select an endpoint from Postman collection
 */
function selectEndpoint(endpoint: ParsedEndpoint) {
  selectedEndpoint.value = endpoint;

  // Auto-fill the data endpoint configuration
  dataEndpoint.value = endpoint.url;
  dataEndpointMethod.value = endpoint.method as 'GET' | 'POST';

  // Auto-configure headers if present
  if (endpoint.headers && Object.keys(endpoint.headers).length > 0) {
    const authHeader = endpoint.headers['Authorization'] || endpoint.headers['authorization'];
    if (authHeader) {
      apiKeyLocation.value = 'header';
      apiKeyHeaderName.value = 'Authorization';

      if (authHeader.startsWith('Bearer ')) {
        apiKeyHeaderFormat.value = 'bearer';
      } else if (authHeader.startsWith('ApiKey ')) {
        apiKeyHeaderFormat.value = 'apikey';
      } else {
        apiKeyHeaderFormat.value = 'direct';
      }
    }
  }

  // Auto-configure query params if present
  if (endpoint.queryParams && Object.keys(endpoint.queryParams).length > 0) {
    const apiKeyParam = Object.keys(endpoint.queryParams).find(key =>
      key.toLowerCase().includes('key') || key.toLowerCase().includes('token')
    );
    if (apiKeyParam) {
      apiKeyLocation.value = 'query';
      apiKeyQueryParam.value = apiKeyParam;
    }
  }

  console.log('✅ Selected endpoint:', endpoint.name);
  alert(`Selected endpoint: ${endpoint.method} ${endpoint.name}\n\nURL has been auto-filled. Configure API key if needed.`);
}

/**
 * Clear Postman collection
 */
function clearPostmanCollection() {
  postmanCollection.value = null;
  postmanEndpoints.value = [];
  selectedEndpoint.value = null;
  if (postmanFileInput.value) {
    postmanFileInput.value.value = '';
  }
  console.log('🗑️ Postman collection cleared');
}

/**
 * Load sample sales data
 */
function loadSampleData() {
  tableData.value = [
    { id: 1, product: 'Laptop', category: 'Electronics', price: 1200, quantity: 15, revenue: 18000 },
    { id: 2, product: 'Mouse', category: 'Electronics', price: 25, quantity: 150, revenue: 3750 },
    { id: 3, product: 'Keyboard', category: 'Electronics', price: 75, quantity: 80, revenue: 6000 },
    { id: 4, product: 'Monitor', category: 'Electronics', price: 300, quantity: 45, revenue: 13500 },
    { id: 5, product: 'Desk', category: 'Furniture', price: 450, quantity: 20, revenue: 9000 },
    { id: 6, product: 'Chair', category: 'Furniture', price: 200, quantity: 35, revenue: 7000 },
    { id: 7, product: 'Lamp', category: 'Furniture', price: 50, quantity: 60, revenue: 3000 },
    { id: 8, product: 'Notebook', category: 'Stationery', price: 5, quantity: 500, revenue: 2500 },
    { id: 9, product: 'Pen', category: 'Stationery', price: 2, quantity: 1000, revenue: 2000 },
    { id: 10, product: 'Tablet', category: 'Electronics', price: 600, quantity: 25, revenue: 15000 },
    { id: 11, product: 'Headphones', category: 'Electronics', price: 150, quantity: 70, revenue: 10500 },
    { id: 12, product: 'Webcam', category: 'Electronics', price: 80, quantity: 40, revenue: 3200 },
    { id: 13, product: 'Bookshelf', category: 'Furniture', price: 180, quantity: 15, revenue: 2700 },
    { id: 14, product: 'Printer', category: 'Electronics', price: 250, quantity: 30, revenue: 7500 },
    { id: 15, product: 'Scanner', category: 'Electronics', price: 200, quantity: 20, revenue: 4000 },
    // Add some anomalies
    { id: 16, product: 'Diamond Mouse', category: 'Electronics', price: 9999, quantity: 1, revenue: 9999 },
    { id: 17, product: 'Free Sample', category: 'Stationery', price: 0, quantity: 10000, revenue: 0 },
  ];

  console.log('✅ Sample data loaded:', tableData.value.length, 'rows');

  if (!intelligence.value) {
    console.log('Initializing client automatically...');
    initializeClient();
  }
}

/**
 * Generate random data
 */
function generateRandomData() {
  const categories = ['Electronics', 'Furniture', 'Stationery', 'Accessories'];
  const products = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'];

  tableData.value = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    product: products[Math.floor(Math.random() * products.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    price: Math.round(Math.random() * 1000) + 10,
    quantity: Math.round(Math.random() * 100) + 1,
    revenue: 0,
  })).map(row => ({
    ...row,
    revenue: row.price * row.quantity,
  }));

  console.log('✅ Random data generated:', tableData.value.length, 'rows');

  if (!intelligence.value) {
    console.log('Initializing client automatically...');
    initializeClient();
  }
}

/**
 * Handle question submission - REDESIGNED with local state
 */
async function handleQuestion(question: string | { text: string; icon?: string }) {
  // Handle both string and object input (for sample questions)
  const questionText = typeof question === 'string' ? question : question.text;

  console.log('🎯 handleQuestion called with:', questionText);

  if (!intelligence.value) {
    console.error('❌ Intelligence client not initialized');
    alert('Please initialize the client first by clicking "Initialize Client" button.');
    return;
  }

  if (tableData.value.length === 0) {
    console.error('❌ No data loaded. Please load sample data first.');
    alert('Please load data first using the "Load Sample Data" or "Fetch Data from API" button.');
    return;
  }

  // Note: We allow questions even without QA API key - the system will use fallback logic
  if (!qaEnabled.value) {
    console.warn('⚠️ Q&A API key not configured. Using fallback logic. For better results, add an OpenAI or Anthropic API key.');
  }

  // Create a message ID
  const messageId = `msg_${Date.now()}`;

  // Add the question to local chat history immediately
  const newMessage: ChatMessage = {
    id: messageId,
    question: questionText,
    answer: null,
    timestamp: new Date(),
    isLoading: true,
  };

  localChatHistory.value.push(newMessage);
  console.log('✅ Added question to local chat history. Total messages:', localChatHistory.value.length);

  // Scroll to bottom to show the new question
  setTimeout(() => scrollToBottom(), 100);

  try {
    console.log('🤔 Asking question:', questionText);
    console.log('📊 Data rows:', tableData.value?.length || 0);

    // Ask the question
    const answer = await intelligence.value.askQuestion(questionText);

    console.log('✅ Answer received:', answer);

    // Update the message with the answer
    const messageIndex = localChatHistory.value.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      localChatHistory.value[messageIndex].answer = answer;
      localChatHistory.value[messageIndex].isLoading = false;
      console.log('✅ Updated message with answer. Total messages:', localChatHistory.value.length);
    }

    // Scroll to bottom after answer
    setTimeout(() => scrollToBottom(), 100);
  } catch (err) {
    console.error('❌ Q&A failed:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);

    // Update the message with error answer
    const messageIndex = localChatHistory.value.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      const errorAnswer: Answer = {
        questionId: messageId,
        text: `I encountered an error while processing your question: ${errorMessage}`,
        timestamp: new Date(),
        confidence: 0,
        cannotAnswer: true,
        reason: errorMessage,
      };

      localChatHistory.value[messageIndex].answer = errorAnswer;
      localChatHistory.value[messageIndex].isLoading = false;
      console.log('✅ Updated message with error. Total messages:', localChatHistory.value.length);
    }
  }
}

/**
 * Format timestamp for display
 */
function formatTime(timestamp: Date): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get confidence class for styling
 */
function getConfidenceClass(confidence: number): string {
  if (confidence >= 0.8) return 'confidence-high';
  if (confidence >= 0.5) return 'confidence-medium';
  return 'confidence-low';
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

/**
 * Export chat history
 */
function exportChat() {
  if (localChatHistory.value.length === 0) return;

  let exportText = '# Tabular Intelligence Q&A Session\n\n';
  exportText += `Date: ${new Date().toLocaleString()}\n`;
  exportText += `Total Questions: ${localChatHistory.value.length}\n`;
  exportText += `Data Rows: ${tableData.value.length}\n\n`;
  exportText += '---\n\n';

  for (let i = 0; i < localChatHistory.value.length; i++) {
    const message = localChatHistory.value[i];
    exportText += `## Question ${i + 1}\n`;
    exportText += `**Q:** ${message.question}\n\n`;
    if (message.answer) {
      exportText += `**A:** ${message.answer.text}\n`;
      exportText += `**Confidence:** ${Math.round(message.answer.confidence * 100)}%\n`;
      if (message.answer.isApproximate) {
        exportText += `**Note:** This answer is based on sampled data\n`;
      }
      exportText += `\n`;
    }
    exportText += '---\n\n';
  }

  // Download as file
  const blob = new Blob([exportText], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `qa-session-${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Clear question history
 */
function clearHistory() {
  localChatHistory.value = [];
  if (intelligence.value) {
    intelligence.value.clearHistory();
  }
  console.log('✅ Chat history cleared');
}

/**
 * Handle selecting a question from history
 */
function handleSelectQuestion(question: any) {
  console.log('Selected question:', question);
  // Could re-ask the question or show details
}

/**
 * Save custom API config to localStorage
 */
const saveCustomApiConfig = (config: any) => {
  try {
    localStorage.setItem(CUSTOM_API_STORAGE_KEY, JSON.stringify(config));
    console.log('💾 Saved custom API config to localStorage:', config);
  } catch (err) {
    console.error('Failed to save custom API config to localStorage:', err);
  }
};

/**
 * Watch for provider changes to save/restore custom API field values
 */
watch(() => config.value.provider, (newProvider, oldProvider) => {
  // Save custom API field values when switching away from custom
  if (oldProvider === 'custom') {
    const configToSave = {
      baseUrl: config.value.baseUrl,
      apiKeyValue: apiKeyValue.value,
      apiKeyLocation: apiKeyLocation.value,
      apiKeyQueryParam: apiKeyQueryParam.value,
      apiKeyHeaderName: apiKeyHeaderName.value,
      apiKeyHeaderFormat: apiKeyHeaderFormat.value,
      dataEndpoint: dataEndpoint.value,
      dataEndpointMethod: dataEndpointMethod.value,
      dataResponsePath: dataResponsePath.value,
    };
    customApiFieldValues.value = configToSave;
    saveCustomApiConfig(configToSave);
  }

  // Set default URLs based on provider
  if (newProvider === 'local') {
    config.value.baseUrl = '';
    apiKeyValue.value = '';
  } else if (newProvider === 'tabpfn') {
    config.value.baseUrl = 'https://api.priorlabs.ai/v1/predict';
    // Keep existing API key if any
  } else if (newProvider === 'custom') {
    // Restore custom API field values when switching to custom
    config.value.baseUrl = customApiFieldValues.value.baseUrl;
    apiKeyValue.value = customApiFieldValues.value.apiKeyValue;
    apiKeyLocation.value = customApiFieldValues.value.apiKeyLocation;
    apiKeyQueryParam.value = customApiFieldValues.value.apiKeyQueryParam;
    apiKeyHeaderName.value = customApiFieldValues.value.apiKeyHeaderName;
    apiKeyHeaderFormat.value = customApiFieldValues.value.apiKeyHeaderFormat;
    dataEndpoint.value = customApiFieldValues.value.dataEndpoint;
    dataEndpointMethod.value = customApiFieldValues.value.dataEndpointMethod;
    dataResponsePath.value = customApiFieldValues.value.dataResponsePath;
    console.log('📂 Restored custom API field values from localStorage:', customApiFieldValues.value);
  }
});

/**
 * Watch for changes to custom API fields and save to localStorage
 */
watch([
  () => config.value.baseUrl,
  apiKeyValue,
  apiKeyLocation,
  apiKeyQueryParam,
  apiKeyHeaderName,
  apiKeyHeaderFormat,
  dataEndpoint,
  dataEndpointMethod,
  dataResponsePath,
], () => {
  // Only save if currently on custom provider
  if (config.value.provider === 'custom') {
    const configToSave = {
      baseUrl: config.value.baseUrl,
      apiKeyValue: apiKeyValue.value,
      apiKeyLocation: apiKeyLocation.value,
      apiKeyQueryParam: apiKeyQueryParam.value,
      apiKeyHeaderName: apiKeyHeaderName.value,
      apiKeyHeaderFormat: apiKeyHeaderFormat.value,
      dataEndpoint: dataEndpoint.value,
      dataEndpointMethod: dataEndpointMethod.value,
      dataResponsePath: dataResponsePath.value,
    };
    customApiFieldValues.value = configToSave;
    saveCustomApiConfig(configToSave);
  }
});
</script>

<style scoped>
.tabular-intelligence-demo {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.demo-header p {
  font-size: 1.125rem;
  color: #64748b;
}

.config-section,
.data-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #1e293b;
}

h3 {
  font-size: 1.25rem;
  margin: 1.5rem 0 1rem;
  color: #334155;
}

.section-description {
  color: #64748b;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.config-item {
  display: flex;
  flex-direction: column;
}

.config-item label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
}

.config-item .help-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #e2e8f0;
  color: #1e293b;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.data-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.data-preview {
  margin-top: 1.5rem;
}

/* Postman Collection Upload */
.postman-upload-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px dashed #cbd5e1;
}

.postman-endpoints {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.endpoints-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.endpoint-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.endpoint-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.endpoint-item.selected {
  border-color: #10b981;
  background: #f0fdf4;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
}

.endpoint-method {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  flex-shrink: 0;
}

.endpoint-method.get {
  background: #dbeafe;
  color: #1e40af;
}

.endpoint-method.post {
  background: #dcfce7;
  color: #166534;
}

.endpoint-method.put {
  background: #fef3c7;
  color: #92400e;
}

.endpoint-method.delete {
  background: #fee2e2;
  color: #991b1b;
}

.endpoint-details {
  flex: 1;
}

.endpoint-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.endpoint-url {
  font-size: 0.875rem;
  color: #64748b;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.endpoint-description {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
  font-style: italic;
}

/* Data Info Bar */
.data-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-info {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Table Footer */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

/* Data Loaded Banner */
.data-loaded-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.banner-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.banner-content {
  flex: 1;
}

.banner-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.banner-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.95;
}

.banner-action {
  background: white;
  color: #2563eb;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
  flex-shrink: 0;
}

.banner-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background: #f8fafc;
  font-weight: 600;
  color: #1e293b;
}

.table-note {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid #6ee7b7;
}

.warning-message {
  background: #fef3c7;
  color: #92400e;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fbbf24;
}

/* Q&A Section */
.qa-section {
  background: white;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  width: 100%;
  max-width: 100%;
}

.qa-header {
  background: #3b82f6;
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #2563eb;
}

.qa-header-content h2 {
  margin: 0;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
}

.qa-description {
  color: rgba(255, 255, 255, 0.9);
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
}

.qa-stats {
  display: flex;
  gap: 1.5rem;
}

.qa-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: white;
  min-width: 80px;
  backdrop-filter: blur(10px);
}

.qa-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.qa-stat-label {
  font-size: 0.7rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.qa-empty-state {
  background: #f8fafc;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.qa-empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.qa-empty-state p {
  color: #64748b;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.qa-empty-state ul {
  text-align: left;
  display: inline-block;
  color: #475569;
  font-size: 0.9rem;
}

.qa-content {
  background: #f8fafc;
  padding: 1.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Sample Questions */
.sample-questions {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.sample-questions h3 {
  margin: 0 0 0.75rem 0;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 600;
}

.sample-questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
}

.sample-question-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 0.85rem;
  color: #475569;
}

.sample-question-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.sample-question-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sample-q-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.sample-q-text {
  flex: 1;
  font-weight: 500;
}

/* Chat Container - Messenger Style */
.qa-chat-container {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e4e6eb;
  display: flex;
  flex-direction: column;
  height: 600px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 100%;
}

.qa-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #ffffff;
  scroll-behavior: smooth;
}

.qa-messages::-webkit-scrollbar {
  width: 6px;
}

.qa-messages::-webkit-scrollbar-track {
  background: transparent;
}

.qa-messages::-webkit-scrollbar-thumb {
  background: #bcc0c4;
  border-radius: 3px;
}

.qa-messages::-webkit-scrollbar-thumb:hover {
  background: #8a8d91;
}

.qa-message-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.qa-message {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  animation: messageSlideIn 0.2s ease-out;
  transition: all 0.2s ease;
}

.qa-message:hover .qa-message-content {
  transform: translateY(-1px);
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.qa-message-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  background: #e4e6eb;
  border: none;
  margin-bottom: 4px;
}

.qa-message-user .qa-message-avatar {
  background: linear-gradient(135deg, #0084ff 0%, #0066cc 100%);
  color: white;
  order: 2;
}

.qa-message-ai .qa-message-avatar {
  background: linear-gradient(135deg, #e4e6eb 0%, #d0d3d8 100%);
  color: #050505;
}

.qa-message-error .qa-message-avatar {
  background: linear-gradient(135deg, #ff4458 0%, #d63447 100%);
  color: white;
}

.qa-message-content {
  flex: 1;
  padding: 10px 14px;
  border-radius: 18px;
  max-width: 65%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  position: relative;
  word-break: break-word;
  transition: all 0.2s ease;
}

.qa-message-user .qa-message-content {
  background: linear-gradient(135deg, #0084ff 0%, #0066cc 100%) !important;
  color: #ffffff !important;
  margin-left: auto;
  align-self: flex-end;
  border: none;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 132, 255, 0.2);
}

.qa-message-ai .qa-message-content {
  background: #f0f0f0 !important;
  border: none;
  color: #050505 !important;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.qa-message-error .qa-message-content {
  background: #ffebe9 !important;
  border: none;
  color: #d63447 !important;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(214, 52, 71, 0.15);
}

.qa-message-header {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
  flex-wrap: wrap;
  align-items: center;
}

.qa-confidence-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.confidence-high {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.confidence-medium {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
}

.confidence-low {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

.qa-approximate-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  background: rgba(99, 102, 241, 0.15);
  color: #4f46e5;
}

.qa-message-text {
  font-size: 15px;
  line-height: 1.4;
  color: #050505 !important;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-weight: 400;
}

.qa-message-user .qa-message-text {
  color: #ffffff !important;
  font-weight: 400;
}

.qa-message-ai .qa-message-text {
  color: #050505 !important;
}

.qa-message-reason {
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(255, 68, 88, 0.1);
  border-radius: 12px;
  font-size: 13px;
  color: #d63447;
  font-weight: 400;
}

.qa-message-time {
  margin-top: 2px;
  font-size: 11px;
  color: #65676b;
  font-weight: 400;
  text-align: right;
}

.qa-message-user .qa-message-time {
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
}

/* Loading State - Messenger Style */
.qa-message-loading .qa-message-content {
  padding: 12px 16px;
  background: #f0f2f5;
  border-radius: 18px;
}

.qa-typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 0;
}

.qa-typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8a8d91;
  animation: messengerTyping 1.4s infinite ease-in-out;
}

.qa-typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.qa-typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes messengerTyping {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

/* Input Container - Messenger Style */
.qa-input-container {
  padding: 12px 16px;
  background: #ffffff;
  border-top: 1px solid #e4e6eb;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure QuestionInput component takes full width */
.qa-input-container :deep(.ti-question-input) {
  width: 100%;
  max-width: 100%;
  flex: 1;
}

.qa-input-container :deep(.ti-input-wrapper) {
  width: 100%;
  max-width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Style both input and textarea */
.qa-input-container :deep(input),
.qa-input-container :deep(textarea) {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 20px;
  background: #f0f2f5;
  font-size: 15px;
  color: #050505 !important;
  outline: none;
  transition: background 0.2s;
  -webkit-text-fill-color: #050505 !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  resize: none;
  min-height: 40px;
  max-height: 120px;
}

.qa-input-container :deep(input:focus),
.qa-input-container :deep(textarea:focus) {
  background: #e4e6eb;
  color: #050505 !important;
  -webkit-text-fill-color: #050505 !important;
}

.qa-input-container :deep(input::placeholder),
.qa-input-container :deep(textarea::placeholder) {
  color: #8a8d91 !important;
  -webkit-text-fill-color: #8a8d91 !important;
  opacity: 1;
}

.qa-input-container :deep(input:disabled),
.qa-input-container :deep(textarea:disabled) {
  background: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.qa-input-container :deep(button) {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #0084ff 0%, #0066cc 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0, 132, 255, 0.3);
  min-width: 70px;
  height: 40px;
  flex-shrink: 0;
}

.qa-input-container :deep(button:hover:not(:disabled)) {
  background: linear-gradient(135deg, #0073e6 0%, #0059b3 100%);
  transform: scale(1.05);
  box-shadow: 0 3px 6px rgba(0, 132, 255, 0.4);
}

.qa-input-container :deep(button:active:not(:disabled)) {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0, 132, 255, 0.2);
}

.qa-input-container :deep(button:disabled) {
  background: #e4e6eb;
  color: #bcc0c4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Hide the hint text for cleaner UI */
.qa-input-container :deep(.ti-hint) {
  display: none;
}

/* Responsive design for input container */
@media (max-width: 768px) {
  .qa-input-container {
    padding: 10px 12px;
    gap: 6px;
  }

  .qa-input-container :deep(input),
  .qa-input-container :deep(textarea) {
    font-size: 14px;
    padding: 8px 14px;
    min-height: 36px;
  }

  .qa-input-container :deep(button) {
    padding: 8px 16px;
    font-size: 13px;
    min-width: 60px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .qa-input-container {
    padding: 8px 10px;
    gap: 4px;
  }

  .qa-input-container :deep(input),
  .qa-input-container :deep(textarea) {
    font-size: 13px;
    padding: 6px 12px;
    min-height: 32px;
  }

  .qa-input-container :deep(button) {
    padding: 6px 12px;
    font-size: 12px;
    min-width: 50px;
    height: 32px;
  }
}

/* Actions */
.qa-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  justify-content: center;
  padding: 0 1rem 1rem 1rem;
}

.qa-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.85rem;
  color: #64748b;
}

.qa-action-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.qa-clear-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.qa-export-btn:hover {
  background: #f0f9ff;
  border-color: #bfdbfe;
  color: #2563eb;
}

@media (max-width: 768px) {
  .tabular-intelligence-demo {
    padding: 1rem;
  }

  .config-grid {
    grid-template-columns: 1fr;
  }

  .qa-header {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .qa-stats {
    width: 100%;
    justify-content: space-around;
  }

  .sample-questions-grid {
    grid-template-columns: 1fr;
  }

  .qa-message-user .qa-message-content,
  .qa-message-ai .qa-message-content {
    max-width: 90%;
  }

  .qa-actions {
    flex-direction: column;
  }

  .qa-action-btn {
    width: 100%;
    justify-content: center;
  }

  .data-loaded-banner {
    flex-direction: column;
    text-align: center;
  }

  .banner-action {
    width: 100%;
    text-align: center;
  }
}
</style>

