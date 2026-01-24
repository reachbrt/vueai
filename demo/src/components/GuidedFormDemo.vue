<template>
  <div class="guided-form-demo">
    <div class="demo-header">
      <h2>🎯 Guided Form</h2>
      <p>AI-assisted one-question-at-a-time conversational forms</p>
    </div>

    <div class="demo-content">
      <!-- API Key Setup -->
      <div class="api-setup" v-if="!apiKey">
        <div class="setup-card">
          <h3>🔑 Setup OpenAI API Key</h3>
          <p>Enter your OpenAI API key to enable AI assistance features</p>
          <div class="input-group">
            <input
              v-model="tempApiKey"
              type="password"
              placeholder="sk-..."
              class="api-input"
            />
            <button @click="setApiKey" class="btn-primary">Set API Key</button>
          </div>
          <p class="note">Your API key is stored locally and never sent to our servers</p>
        </div>
      </div>

      <!-- Form Demo -->
      <div v-else class="form-container">
        <div class="form-wrapper">
          <GuidedFormContainer
            :currentStep="currentStep"
            :currentStepIndex="currentStepIndex"
            :totalSteps="totalSteps"
            :progress="progress"
            :canGoBack="canGoBack"
            :canGoNext="canGoNext"
            :isComplete="isComplete"
            :isLoading="isLoading"
            :validationErrors="validationErrors"
            :aiEnabled="true"
            :showProgress="true"
            @next="handleNext"
            @previous="handlePrevious"
            @change="handleChange"
            @getHint="handleGetHint"
          />

          <!-- Completion Message -->
          <div v-if="isComplete" class="completion-message">
            <div class="success-icon">✅</div>
            <h3>Form Completed!</h3>
            <p>Thank you for completing the form.</p>
            <div class="form-data">
              <h4>Your Responses:</h4>
              <pre>{{ JSON.stringify(answers, null, 2) }}</pre>
            </div>
            <button @click="resetForm" class="btn-primary">Start Over</button>
          </div>
        </div>

        <!-- Features Panel -->
        <div class="features-panel">
          <h3>✨ Features</h3>
          <ul class="feature-list">
            <li>
              <span class="feature-icon">🤖</span>
              <div>
                <strong>AI Assistance</strong>
                <p>Get hints, examples, and validation from AI</p>
              </div>
            </li>
            <li>
              <span class="feature-icon">⌨️</span>
              <div>
                <strong>Keyboard Navigation</strong>
                <p>Press Enter to advance, Tab to navigate</p>
              </div>
            </li>
            <li>
              <span class="feature-icon">💾</span>
              <div>
                <strong>Save & Resume</strong>
                <p>Your progress is automatically saved</p>
              </div>
            </li>
            <li>
              <span class="feature-icon">🔄</span>
              <div>
                <strong>Conditional Logic</strong>
                <p>Dynamic form flow based on answers</p>
              </div>
            </li>
            <li>
              <span class="feature-icon">✅</span>
              <div>
                <strong>Smart Validation</strong>
                <p>Real-time validation with friendly messages</p>
              </div>
            </li>
            <li>
              <span class="feature-icon">📱</span>
              <div>
                <strong>Mobile-First</strong>
                <p>Optimized for all screen sizes</p>
              </div>
            </li>
          </ul>

          <div class="install-section">
            <h4>📦 Installation</h4>
            <div class="code-block">
              <code>npm install @aivue/guided-form @aivue/core</code>
            </div>
          </div>

          <div class="links-section">
            <a href="https://www.npmjs.com/package/@aivue/guided-form" target="_blank" class="link-btn">
              📦 npm Package
            </a>
            <a href="https://github.com/reachbrt/vueai/tree/main/packages/guided-form" target="_blank" class="link-btn">
              📚 Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { GuidedFormContainer, useGuidedForm } from '@aivue/guided-form';
import '@aivue/guided-form/dist/guided-form.css';

// API Key Management
const apiKey = ref<string>(localStorage.getItem('openai_api_key') || '');
const tempApiKey = ref<string>('');

const setApiKey = () => {
  if (tempApiKey.value) {
    localStorage.setItem('openai_api_key', tempApiKey.value);
    apiKey.value = tempApiKey.value;
    tempApiKey.value = '';
    initializeForm();
  }
};

// Form Schema
const formSchema = {
  id: 'contact-form',
  name: 'Contact Information Form',
  version: '1.0.0',
  status: 'published' as const,
  steps: [
    {
      id: 'step-1',
      type: 'question' as const,
      field: {
        fieldId: 'name',
        fieldType: 'text' as const,
        required: true,
        validationRules: [
          { type: 'required' as const, message: 'Name is required' },
          { type: 'minLength' as const, value: 2, message: 'Name must be at least 2 characters' }
        ]
      },
      ui: {
        title: "What's your name?",
        subtitle: "We'd love to know who we're talking to",
        placeholder: 'Enter your full name'
      }
    },
    {
      id: 'step-2',
      type: 'question' as const,
      field: {
        fieldId: 'email',
        fieldType: 'email' as const,
        required: true,
        validationRules: [
          { type: 'required' as const, message: 'Email is required' },
          { type: 'email' as const, message: 'Please enter a valid email address' }
        ]
      },
      ui: {
        title: "What's your email address?",
        subtitle: 'We promise not to spam you',
        placeholder: 'you@example.com'
      }
    },
    {
      id: 'step-3',
      type: 'question' as const,
      field: {
        fieldId: 'interest',
        fieldType: 'radio' as const,
        required: true,
        options: [
          { value: 'chatbot', label: 'AI Chatbot' },
          { value: 'forms', label: 'Smart Forms' },
          { value: 'analytics', label: 'Analytics' },
          { value: 'other', label: 'Other' }
        ]
      },
      ui: {
        title: 'What are you interested in?',
        subtitle: 'Select the area that interests you most'
      }
    },
    {
      id: 'step-4',
      type: 'question' as const,
      field: {
        fieldId: 'message',
        fieldType: 'textarea' as const,
        required: false,
        validationRules: [
          { type: 'maxLength' as const, value: 500, message: 'Message must be less than 500 characters' }
        ]
      },
      ui: {
        title: 'Any additional comments?',
        subtitle: 'Tell us more about your needs (optional)',
        placeholder: 'Type your message here...'
      }
    }
  ],
  settings: {
    aiFlags: {
      enabled: true,
      provider: 'openai' as const,
      apiKey: apiKey.value,
      model: 'gpt-4o-mini'
    },
    persistence: {
      enabled: true,
      adapter: 'localStorage' as const,
      autoSave: true
    },
    keyboard: {
      enabled: true,
      enterToNext: true,
      numericShortcuts: true
    }
  }
};

// Form State
let formInstance: any = null;

const currentStep = ref<any>(null);
const currentStepIndex = ref(0);
const totalSteps = ref(0);
const progress = ref(0);
const canGoBack = ref(false);
const canGoNext = ref(false);
const isComplete = ref(false);
const isLoading = ref(false);
const validationErrors = ref<any[]>([]);
const answers = ref<Record<string, any>>({});

// Initialize Form
const initializeForm = () => {
  if (!apiKey.value) return;

  formInstance = useGuidedForm({
    schema: formSchema,
    onStepChange: (step: any) => {
      currentStep.value = step;
    },
    onAnswerChange: (fieldId: string, value: any) => {
      answers.value[fieldId] = value;
    },
    onComplete: () => {
      isComplete.value = true;
    }
  });

  // Update reactive refs
  currentStep.value = formInstance.currentStep.value;
  currentStepIndex.value = formInstance.currentStepIndex.value;
  totalSteps.value = formInstance.totalSteps.value;
  progress.value = formInstance.progress.value;
  canGoBack.value = formInstance.canGoBack.value;
  canGoNext.value = formInstance.canGoNext.value;
  isComplete.value = formInstance.isComplete.value;
  isLoading.value = formInstance.isLoading.value;
  validationErrors.value = formInstance.validationErrors.value;
  answers.value = formInstance.answers.value;
};

// Event Handlers
const handleNext = async () => {
  if (formInstance) {
    isLoading.value = true;
    await formInstance.goToNext();
    isLoading.value = false;
  }
};

const handlePrevious = () => {
  if (formInstance) {
    formInstance.goToPrevious();
  }
};

const handleChange = (value: any) => {
  if (formInstance && currentStep.value) {
    formInstance.setAnswer(currentStep.value.field.fieldId, value);
  }
};

const handleGetHint = async () => {
  if (formInstance && currentStep.value) {
    isLoading.value = true;
    await formInstance.getAIHint(currentStep.value.field.fieldId, 'explain');
    isLoading.value = false;
  }
};

const resetForm = () => {
  if (formInstance) {
    formInstance.resetForm();
    isComplete.value = false;
    answers.value = {};
  }
};

// Initialize on mount
if (apiKey.value) {
  initializeForm();
}
</script>

<style scoped>
.guided-form-demo {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.demo-header p {
  font-size: 1.2rem;
  color: #666;
}

.api-setup {
  max-width: 600px;
  margin: 0 auto;
}

.setup-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.setup-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.input-group {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.api-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.api-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.note {
  font-size: 0.875rem;
  color: #999;
  margin-top: 1rem;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.form-wrapper {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.completion-message {
  text-align: center;
  padding: 2rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.form-data {
  margin: 2rem 0;
  text-align: left;
}

.form-data pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.features-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.features-panel h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.feature-list li {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.feature-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feature-list strong {
  display: block;
  color: #333;
  margin-bottom: 0.25rem;
}

.feature-list p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

.install-section {
  margin-bottom: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.install-section h4 {
  margin-bottom: 1rem;
  color: #333;
}

.code-block {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.875rem;
  overflow-x: auto;
}

.links-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.link-btn {
  display: block;
  padding: 0.75rem 1rem;
  background: #f5f5f5;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  text-align: center;
  transition: background 0.2s;
}

.link-btn:hover {
  background: #e0e0e0;
}

@media (max-width: 1024px) {
  .form-container {
    grid-template-columns: 1fr;
  }
}
</style>


