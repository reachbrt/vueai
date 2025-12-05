<template>
  <div class="voice-actions-demo">
    <div class="demo-section">
      <h3 class="demo-title">Voice Command Controller</h3>
      <p class="demo-description">
        Control your application with voice commands. Try saying commands like "open dashboard", 
        "search for products", "create new item", or ask questions with AI processing enabled.
      </p>

      <VoiceActions
        :ai-client="aiClient"
        :commands="commands"
        :suggestions="suggestions"
        :theme="theme"
        show-transcript
        show-suggestions
        show-history
        show-language-selector
        show-continuous-toggle
        show-volume-indicator
        :voice-feedback="voiceFeedbackEnabled"
        :use-ai-processing="aiProcessingEnabled"
        :max-history-display="10"
        @command="handleCommand"
        @transcript="handleTranscript"
        @error="handleError"
        @listening-start="handleListeningStart"
        @listening-stop="handleListeningStop"
      />
    </div>

    <!-- Demo Controls -->
    <div class="demo-controls">
      <h4>Demo Settings</h4>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="darkMode" @change="toggleTheme" />
          Dark Theme
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="voiceFeedbackEnabled" />
          Voice Feedback
        </label>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="aiProcessingEnabled" />
          AI Processing (for unmatched commands)
        </label>
      </div>

      <div class="control-group">
        <button @click="addCustomCommand" class="control-btn">Add Custom Command</button>
        <button @click="clearCommands" class="control-btn secondary">Clear Commands</button>
      </div>
    </div>

    <!-- Command Examples -->
    <div class="command-examples">
      <h4>Try These Commands</h4>
      <div class="examples-grid">
        <div class="example-card">
          <div class="example-icon">🔗</div>
          <div class="example-title">Navigation</div>
          <div class="example-commands">
            <code>"open dashboard"</code>
            <code>"go to settings"</code>
            <code>"show profile"</code>
          </div>
        </div>

        <div class="example-card">
          <div class="example-icon">🔍</div>
          <div class="example-title">Search</div>
          <div class="example-commands">
            <code>"search for products"</code>
            <code>"find users"</code>
            <code>"lookup orders"</code>
          </div>
        </div>

        <div class="example-card">
          <div class="example-icon">➕</div>
          <div class="example-title">Actions</div>
          <div class="example-commands">
            <code>"create new item"</code>
            <code>"add product"</code>
            <code>"delete selected"</code>
          </div>
        </div>

        <div class="example-card">
          <div class="example-icon">🎨</div>
          <div class="example-title">UI Control</div>
          <div class="example-commands">
            <code>"toggle dark mode"</code>
            <code>"increase font size"</code>
            <code>"show notifications"</code>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Log -->
    <div class="event-log">
      <h4>Event Log</h4>
      <div class="log-entries">
        <div v-for="(event, index) in eventLog" :key="index" :class="['log-entry', `type-${event.type}`]">
          <span class="log-time">{{ event.time }}</span>
          <span class="log-type">{{ event.type }}</span>
          <span class="log-message">{{ event.message }}</span>
        </div>
      </div>
    </div>

    <!-- Features Info -->
    <div class="features-info">
      <h4>Features Demonstrated</h4>
      <div class="features-grid">
        <div class="feature-item">
          <span class="feature-icon">🎤</span>
          <span class="feature-text">Real-time Speech Recognition</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🗣️</span>
          <span class="feature-text">Text-to-Speech Feedback</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🤖</span>
          <span class="feature-text">AI Natural Language Processing</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔄</span>
          <span class="feature-text">Continuous Listening Mode</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🌍</span>
          <span class="feature-text">Multi-language Support</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📊</span>
          <span class="feature-text">Command History & Analytics</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔊</span>
          <span class="feature-text">Volume Level Indicator</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">💡</span>
          <span class="feature-text">Smart Command Suggestions</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { VoiceActions } from '../../../packages/voice-actions/src';

const props = defineProps({
  aiClient: {
    type: Object,
    default: null
  }
});

const darkMode = ref(false);
const voiceFeedbackEnabled = ref(true);
const aiProcessingEnabled = ref(true);
const eventLog = ref([]);
const theme = computed(() => darkMode.value ? 'dark' : 'light');

const commands = ref([
  {
    pattern: /open (dashboard|settings|profile|home)/i,
    action: (matches) => {
      const page = matches[1];
      logEvent('command', `Opening ${page}`);
      // Simulate navigation
      setTimeout(() => {
        logEvent('success', `Navigated to ${page}`);
      }, 500);
    },
    description: 'Open a page',
    icon: '🔗'
  },
  {
    pattern: /search for (.*)/i,
    action: (matches) => {
      const query = matches[1];
      logEvent('command', `Searching for: ${query}`);
      // Simulate search
      setTimeout(() => {
        logEvent('success', `Found results for "${query}"`);
      }, 500);
    },
    description: 'Search for something',
    icon: '🔍'
  },
  {
    pattern: /create (new )?(item|product|user|order)/i,
    action: (matches) => {
      const type = matches[2];
      logEvent('command', `Creating new ${type}`);
      setTimeout(() => {
        logEvent('success', `Created new ${type}`);
      }, 500);
    },
    description: 'Create new item',
    icon: '➕'
  },
  {
    pattern: /delete (selected|item|product)/i,
    action: (matches) => {
      const target = matches[1];
      logEvent('command', `Deleting ${target}`);
      setTimeout(() => {
        logEvent('success', `Deleted ${target}`);
      }, 500);
    },
    description: 'Delete item',
    icon: '🗑️'
  },
  {
    pattern: /toggle dark mode/i,
    action: () => {
      darkMode.value = !darkMode.value;
      logEvent('command', `Toggled dark mode: ${darkMode.value ? 'ON' : 'OFF'}`);
    },
    description: 'Toggle dark mode',
    icon: '🎨'
  },
  {
    pattern: /increase font size/i,
    action: () => {
      logEvent('command', 'Increasing font size');
      document.body.style.fontSize = '110%';
      setTimeout(() => {
        document.body.style.fontSize = '';
        logEvent('info', 'Font size reset');
      }, 3000);
    },
    description: 'Increase font size',
    icon: '🔤'
  },
  {
    pattern: /show notifications/i,
    action: () => {
      logEvent('command', 'Showing notifications');
      setTimeout(() => {
        logEvent('info', 'You have 3 new notifications');
      }, 500);
    },
    description: 'Show notifications',
    icon: '🔔'
  },
  {
    pattern: /(hello|hi|hey)/i,
    action: () => {
      logEvent('command', 'Greeting received');
      logEvent('success', 'Hello! How can I help you?');
    },
    description: 'Greet the assistant',
    icon: '👋'
  },
  {
    pattern: /help/i,
    action: () => {
      logEvent('command', 'Help requested');
      logEvent('info', 'Try commands like: open dashboard, search for products, create new item');
    },
    description: 'Show help',
    icon: '❓'
  }
]);

const suggestions = ref([
  { text: 'Open dashboard', icon: '📊', command: 'open dashboard' },
  { text: 'Search for products', icon: '🔍', command: 'search for products' },
  { text: 'Create new item', icon: '➕', command: 'create new item' },
  { text: 'Toggle dark mode', icon: '🎨', command: 'toggle dark mode' },
  { text: 'Show help', icon: '❓', command: 'help' }
]);

function handleCommand(command, result) {
  logEvent('command', `Executed: ${command}`);
}

function handleTranscript(transcript) {
  logEvent('transcript', transcript);
}

function handleError(error) {
  logEvent('error', error.message);
}

function handleListeningStart() {
  logEvent('info', 'Started listening...');
}

function handleListeningStop() {
  logEvent('info', 'Stopped listening');
}

function toggleTheme() {
  logEvent('info', `Theme changed to ${theme.value}`);
}

function addCustomCommand() {
  const pattern = prompt('Enter command pattern (e.g., "do something"):');
  if (!pattern) return;

  commands.value.push({
    pattern: new RegExp(pattern, 'i'),
    action: () => {
      logEvent('command', `Custom command executed: ${pattern}`);
      alert(`Custom command "${pattern}" executed!`);
    },
    description: `Custom: ${pattern}`,
    icon: '⚡'
  });

  logEvent('success', `Added custom command: ${pattern}`);
}

function clearCommands() {
  const defaultCount = 9;
  commands.value = commands.value.slice(0, defaultCount);
  logEvent('info', 'Cleared custom commands');
}

function logEvent(type, message) {
  const time = new Date().toLocaleTimeString();
  eventLog.value.unshift({ time, type, message });
  if (eventLog.value.length > 20) {
    eventLog.value.pop();
  }
}
</script>

<style scoped>
.voice-actions-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.demo-description {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.6;
}

/* Demo Controls */
.demo-controls {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-controls h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.control-group {
  margin-bottom: 12px;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.control-btn {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  margin-right: 8px;
}

.control-btn:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.control-btn.secondary {
  background: #6b7280;
}

.control-btn.secondary:hover {
  background: #4b5563;
}

/* Command Examples */
.command-examples {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.command-examples h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.example-card {
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.example-card:hover {
  border-color: #4f46e5;
  transform: translateY(-2px);
}

.example-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.example-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.example-commands {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.example-commands code {
  padding: 6px 10px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 13px;
  color: #4f46e5;
  font-family: 'Monaco', 'Courier New', monospace;
}

/* Event Log */
.event-log {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.event-log h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.log-entries {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  gap: 12px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
  border-left: 3px solid #e5e7eb;
}

.log-entry.type-command {
  border-left-color: #3b82f6;
  background: #eff6ff;
}

.log-entry.type-success {
  border-left-color: #10b981;
  background: #d1fae5;
}

.log-entry.type-error {
  border-left-color: #ef4444;
  background: #fee2e2;
}

.log-entry.type-info {
  border-left-color: #f59e0b;
  background: #fef3c7;
}

.log-entry.type-transcript {
  border-left-color: #8b5cf6;
  background: #f3e8ff;
}

.log-time {
  color: #9ca3af;
  font-size: 12px;
  min-width: 80px;
}

.log-type {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  min-width: 80px;
}

.log-entry.type-command .log-type {
  color: #3b82f6;
}

.log-entry.type-success .log-type {
  color: #10b981;
}

.log-entry.type-error .log-type {
  color: #ef4444;
}

.log-entry.type-info .log-type {
  color: #f59e0b;
}

.log-entry.type-transcript .log-type {
  color: #8b5cf6;
}

.log-message {
  flex: 1;
  color: #1f2937;
}

/* Features Info */
.features-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.features-info h4 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.feature-icon {
  font-size: 24px;
}

.feature-text {
  font-size: 14px;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .demo-section {
    padding: 16px;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .control-btn {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>

