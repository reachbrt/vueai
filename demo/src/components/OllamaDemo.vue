<template>
  <div class="ollama-demo">
    <div class="component-hero">
      <div class="component-hero-content">
        <h2 class="component-hero-title">Ollama Integration</h2>
        <p class="component-hero-description">
          Connect to your local or remote Ollama instance to use AI models.
          Supports Bearer token authentication for remote instances!
        </p>
        <div class="component-hero-features">
          <div class="hero-feature">
            <span class="feature-icon">🏠</span>
            <span>Local & Remote</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">🔒</span>
            <span>Bearer Token Auth</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">🚀</span>
            <span>Privacy-focused</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">💬</span>
            <span>Multiple models</span>
          </div>
        </div>
      </div>
      <div class="component-hero-image">
        <img src="https://ollama.com/public/ollama.png" alt="Ollama Logo" />
      </div>
    </div>

    <div class="ollama-settings">
      <h3>Ollama Settings</h3>
      <div class="settings-form">
        <div class="form-group">
          <label for="baseUrl">Base URL:</label>
          <input
            id="baseUrl"
            v-model="baseUrl"
            type="text"
            placeholder="http://localhost:11434"
          />
          <p class="help-text">Local: http://localhost:11434 | Remote: https://your-ollama-server.com</p>
        </div>
        <div class="form-group">
          <label for="apiKey">Bearer Token (Optional):</label>
          <input
            id="apiKey"
            v-model="apiKey"
            type="password"
            placeholder="your-bearer-token"
          />
          <p class="help-text">Required for remote instances with authentication</p>
        </div>
        <div class="form-group">
          <label for="model">Model:</label>
          <input
            id="model"
            v-model="model"
            type="text"
            placeholder="llama3.2"
          />
          <p class="help-text">Available models: llama3.2, gemma3:1b, mistral, etc.</p>
        </div>
        <button @click="testConnection" class="test-button" :disabled="isLoading">
          {{ isLoading ? 'Testing...' : 'Test Connection' }}
        </button>
      </div>
    </div>

    <div class="chat-container">
      <div class="chat-messages" ref="chatMessages">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
          <div class="message-content">{{ message.content }}</div>
        </div>
        <div v-if="isLoading" class="message assistant loading">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <textarea
          v-model="userInput"
          placeholder="Ask Ollama something..."
          @keydown.enter.prevent="sendMessage"
          :disabled="isLoading"
        ></textarea>
        <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">
          Send
        </button>
      </div>
    </div>

    <div v-if="connectionStatus" :class="['connection-status', connectionStatus.type]">
      {{ connectionStatus.message }}
    </div>
  </div>
</template>

<script>
import { AIClient } from '@aivue/core';

export default {
  name: 'OllamaDemo',
  data() {
    return {
      baseUrl: 'http://localhost:11434',
      apiKey: '',
      model: 'llama3.2',
      userInput: '',
      messages: [],
      isLoading: false,
      connectionStatus: null,
      client: null
    };
  },
  methods: {
    createClient() {
      const config = {
        provider: 'ollama',
        baseUrl: this.baseUrl,
        model: this.model
      };

      // Add API key if provided
      if (this.apiKey.trim()) {
        config.apiKey = this.apiKey.trim();
      }

      return new AIClient(config);
    },
    async testConnection() {
      this.isLoading = true;
      this.connectionStatus = null;

      try {
        const client = this.createClient();
        const response = await client.chat([
          { role: 'user', content: 'Hello, are you working?' }
        ]);

        this.connectionStatus = {
          type: 'success',
          message: 'Successfully connected to Ollama!'
        };
        this.client = client;
      } catch (error) {
        console.error('Connection error:', error);
        this.connectionStatus = {
          type: 'error',
          message: `Failed to connect: ${error.message}`
        };
      } finally {
        this.isLoading = false;
      }
    },
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;

      // Add user message
      const userMessage = { role: 'user', content: this.userInput };
      this.messages.push(userMessage);

      // Clear input
      const input = this.userInput;
      this.userInput = '';

      this.isLoading = true;

      try {
        // Create client if not exists
        if (!this.client) {
          this.client = this.createClient();
        }

        // Get response
        const response = await this.client.chat([...this.messages]);

        // Add assistant message
        this.messages.push({ role: 'assistant', content: response });
      } catch (error) {
        console.error('Chat error:', error);
        this.messages.push({
          role: 'assistant',
          content: `Error: ${error.message}. Please check your Ollama settings and try again.`
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.$refs.chatMessages) {
          this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
        }
      });
    }
  }
};
</script>

<style scoped>
.ollama-demo {
  max-width: 1000px;
  margin: 0 auto;
}

.ollama-settings {
  background-color: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.settings-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.settings-form .form-group:nth-child(2) {
  grid-column: span 2;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #334155;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}

.help-text {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.test-button {
  grid-column: span 2;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.test-button:hover {
  background-color: #2563eb;
}

.test-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.chat-container {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8fafc;
}

.message {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  max-width: 80%;
}

.message.user {
  background-color: #3b82f6;
  color: white;
  margin-left: auto;
}

.message.assistant {
  background-color: #e2e8f0;
  color: #1e293b;
}

.loading-dots {
  display: flex;
  gap: 0.25rem;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #64748b;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.chat-input {
  display: flex;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e2e8f0;
}

.chat-input textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  resize: none;
  height: 60px;
  font-family: inherit;
  font-size: 0.95rem;
}

.chat-input button {
  margin-left: 0.5rem;
  padding: 0 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-input button:hover {
  background-color: #2563eb;
}

.chat-input button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.connection-status {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.connection-status.success {
  background-color: #dcfce7;
  color: #166534;
}

.connection-status.error {
  background-color: #fee2e2;
  color: #b91c1c;
}

@media (max-width: 768px) {
  .settings-form {
    grid-template-columns: 1fr;
  }

  .test-button {
    grid-column: span 1;
  }
}
</style>
