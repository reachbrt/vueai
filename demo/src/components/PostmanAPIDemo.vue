<template>
  <div class="postman-api-demo">
    <div class="demo-header">
      <h2>📮 Postman Collection API Integration</h2>
      <p>Import a Postman collection and query API data with natural language</p>
    </div>

    <div class="demo-content">
      <!-- Step 1: Import Postman Collection -->
      <div class="section">
        <h3>1. Import Postman Collection</h3>
        <div class="upload-area">
          <input
            type="file"
            accept=".json"
            @change="handleFileUpload"
            ref="fileInput"
            style="display: none"
          />
          <button @click="$refs.fileInput.click()" class="btn-primary">
            📁 Choose Postman Collection JSON
          </button>
          <span v-if="collectionName" class="collection-name">
            ✅ Loaded: {{ collectionName }}
          </span>
        </div>

        <!-- Show endpoints -->
        <div v-if="endpoints.length > 0" class="endpoints-list">
          <h4>Available Endpoints ({{ endpoints.length }})</h4>
          <div class="endpoint-grid">
            <div
              v-for="endpoint in endpoints"
              :key="endpoint.name"
              class="endpoint-card"
              :class="{ selected: selectedEndpoint === endpoint.name }"
              @click="selectEndpoint(endpoint.name)"
            >
              <span class="method" :class="endpoint.method.toLowerCase()">
                {{ endpoint.method }}
              </span>
              <span class="name">{{ endpoint.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Configure API Key -->
      <div v-if="selectedEndpoint" class="section">
        <h3>2. Configure API Variables</h3>
        <div class="form-group">
          <label>API Key (access_key):</label>
          <input
            v-model="apiKey"
            type="text"
            placeholder="Enter your MarketStack API key"
            class="input-field"
          />
        </div>
        <div class="form-group">
          <label>Additional Variables (JSON):</label>
          <textarea
            v-model="variablesJson"
            placeholder='{"symbol": "AAPL", "limit": "10"}'
            class="input-field"
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- Step 3: Fetch Data -->
      <div v-if="selectedEndpoint && apiKey" class="section">
        <h3>3. Fetch Data from API</h3>
        <button @click="fetchData" :disabled="loading" class="btn-primary">
          {{ loading ? '⏳ Fetching...' : '🚀 Fetch Data' }}
        </button>

        <!-- Show data table -->
        <div v-if="tableData.length > 0" class="data-table">
          <h4>Data Preview ({{ tableData.length }} rows)</h4>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th v-for="col in tableColumns" :key="col">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in tableData.slice(0, 10)" :key="idx">
                  <td v-for="col in tableColumns" :key="col">
                    {{ formatValue(row[col]) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Step 4: Ask Questions -->
      <div v-if="tableData.length > 0" class="section">
        <h3>4. Ask Questions About the Data</h3>

        <!-- Q&A Configuration -->
        <div class="qa-config">
          <div class="form-group">
            <label>AI Provider:</label>
            <select v-model="qaProvider" class="input-field">
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>
          <div class="form-group">
            <label>AI API Key:</label>
            <input
              v-model="qaApiKey"
              type="password"
              placeholder="Enter OpenAI or Anthropic API key"
              class="input-field"
            />
          </div>
          <button @click="initializeQA" :disabled="!qaApiKey" class="btn-secondary">
            Initialize Q&A
          </button>
        </div>

        <!-- Question Input -->
        <div v-if="qaInitialized" class="qa-section">
          <div class="question-examples">
            <p><strong>Example questions:</strong></p>
            <button
              v-for="example in exampleQuestions"
              :key="example"
              @click="askQuestion(example)"
              class="example-btn"
            >
              {{ example }}
            </button>
          </div>

          <div class="question-input">
            <input
              v-model="currentQuestion"
              @keyup.enter="askQuestion(currentQuestion)"
              placeholder="Ask a question about the data..."
              class="input-field"
            />
            <button
              @click="askQuestion(currentQuestion)"
              :disabled="!currentQuestion || askingQuestion"
              class="btn-primary"
            >
              {{ askingQuestion ? '🤔 Thinking...' : '💬 Ask' }}
            </button>
          </div>

          <!-- Answer Display -->
          <div v-if="lastAnswer" class="answer-display">
            <h4>Answer:</h4>
            <p class="answer-text">{{ lastAnswer.text }}</p>
            <div class="answer-meta">
              <span>Confidence: {{ (lastAnswer.confidence * 100).toFixed(0) }}%</span>
              <span>{{ new Date(lastAnswer.timestamp).toLocaleTimeString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  TabularIntelligence,
  parsePostmanCollection,
  type ParsedCollection,
  type ParsedEndpoint,
  type Answer,
} from '@aivue/tabular-intelligence';

// State
const fileInput = ref<HTMLInputElement | null>(null);
const collectionName = ref('');
const endpoints = ref<Array<{ name: string; method: string; description?: string }>>([]);
const selectedEndpoint = ref('');
const apiKey = ref('');
const variablesJson = ref('{}');
const loading = ref(false);
const tableData = ref<any[]>([]);
const tableColumns = ref<string[]>([]);

// Q&A State
const qaProvider = ref('openai');
const qaApiKey = ref('');
const qaInitialized = ref(false);
const currentQuestion = ref('');
const askingQuestion = ref(false);
const lastAnswer = ref<Answer | null>(null);

// Client
let client: TabularIntelligence | null = null;

// Example questions
const exampleQuestions = ref([
  'What is the average price?',
  'Show me the highest values',
  'How many records are there?',
  'What are the trends?',
]);

// Handle file upload
async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    const text = await file.text();
    const collection = JSON.parse(text);

    // Initialize client
    client = new TabularIntelligence({
      provider: 'local',
    });

    // Load collection
    const parsed = client.loadPostmanCollection(collection);

    collectionName.value = parsed.name;
    endpoints.value = client.listEndpoints();

    console.log('Loaded collection:', parsed);
  } catch (error) {
    console.error('Error loading collection:', error);
    alert('Failed to load Postman collection. Please check the file format.');
  }
}

// Select endpoint
function selectEndpoint(name: string) {
  selectedEndpoint.value = name;
}

// Fetch data from API
async function fetchData() {
  if (!client || !selectedEndpoint.value) return;

  loading.value = true;

  try {
    // Parse variables
    const variables = JSON.parse(variablesJson.value || '{}');
    variables.access_key = apiKey.value;

    // Fetch data
    const { data, schema } = await client.fetchDataFromAPI(
      selectedEndpoint.value,
      variables
    );

    tableData.value = data;

    // Extract columns
    if (data.length > 0) {
      tableColumns.value = Object.keys(data[0]);
    }

    console.log('Fetched data:', data);
    console.log('Schema:', schema);
  } catch (error: any) {
    console.error('Error fetching data:', error);
    alert(`Failed to fetch data: ${error.message}`);
  } finally {
    loading.value = false;
  }
}

// Initialize Q&A
function initializeQA() {
  if (!client || !qaApiKey.value) return;

  client.initializeQA({
    provider: qaProvider.value as 'openai' | 'anthropic',
    apiKey: qaApiKey.value,
    model: qaProvider.value === 'openai' ? 'gpt-4-turbo-preview' : 'claude-3-5-sonnet-20241022',
  });

  qaInitialized.value = true;
}

// Ask question
async function askQuestion(question: string) {
  if (!client || !question || !tableData.value.length) return;

  askingQuestion.value = true;
  currentQuestion.value = question;

  try {
    const response = await client.queryAPI({
      question,
      dataSource: {
        type: 'postman',
        endpoint: selectedEndpoint.value,
      },
      variables: {
        access_key: apiKey.value,
        ...JSON.parse(variablesJson.value || '{}'),
      },
    });

    lastAnswer.value = response.answer;
    console.log('Answer:', response);
  } catch (error: any) {
    console.error('Error asking question:', error);
    alert(`Failed to get answer: ${error.message}`);
  } finally {
    askingQuestion.value = false;
  }
}

// Format value for display
function formatValue(value: any): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
}


</script>

<style scoped>
.postman-api-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h2 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.demo-header p {
  font-size: 16px;
  color: #7f8c8d;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h3 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
}

.section h4 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #2c3e50;
}

.upload-area {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.collection-name {
  color: #27ae60;
  font-weight: 600;
}

.endpoints-list {
  margin-top: 20px;
}

.endpoint-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.endpoint-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.endpoint-card:hover {
  border-color: #3498db;
  background: #f8f9fa;
}

.endpoint-card.selected {
  border-color: #3498db;
  background: #ebf5fb;
}

.method {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.method.get {
  background: #27ae60;
  color: white;
}

.method.post {
  background: #f39c12;
  color: white;
}

.method.put {
  background: #3498db;
  color: white;
}

.method.delete {
  background: #e74c3c;
  color: white;
}

.name {
  font-weight: 500;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #34495e;
}

.input-field {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #3498db;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-primary:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #7f8c8d;
}

.data-table {
  margin-top: 20px;
}

.table-container {
  overflow-x: auto;
  margin-top: 12px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: #34495e;
  color: white;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

tbody tr:hover {
  background: #f8f9fa;
}

.qa-config {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 16px;
  margin-bottom: 20px;
  align-items: end;
}

.qa-section {
  margin-top: 20px;
}

.question-examples {
  margin-bottom: 16px;
}

.question-examples p {
  margin-bottom: 8px;
  font-weight: 600;
}

.example-btn {
  padding: 6px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  background: #ecf0f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.example-btn:hover {
  background: #bdc3c7;
}

.question-input {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.answer-display {
  background: #f8f9fa;
  border-left: 4px solid #3498db;
  padding: 16px;
  border-radius: 6px;
}

.answer-text {
  font-size: 16px;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 12px;
}

.answer-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #7f8c8d;
}
</style>


