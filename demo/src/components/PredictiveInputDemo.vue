<template>
  <div class="predictive-input-demo">
    <div class="demo-header">
      <h1 class="demo-title">
        <span class="icon">🧠</span>
        Predictive Input Demo
      </h1>
      <p class="demo-description">
        AI-powered text predictions that provide intelligent completions as you type.
        Powered by advanced AI models - just start typing to see smart suggestions!
      </p>
    </div>

    <div class="demo-content">
      <!-- Input Examples Section -->
      <section class="demo-section">
        <h2 class="section-title">
          <span class="icon">✍️</span>
          Try Predictive Input
        </h2>
        <p class="section-description">
          Start typing and watch AI suggest intelligent completions.
          Use ↑↓ to navigate suggestions, Enter to accept, Escape to close.
        </p>

        <div class="examples-grid">
          <!-- Email Composition -->
          <div class="example-card">
            <h3 class="example-title">📧 Email Composition</h3>
            <PredictiveInput
              v-model="emailText"
              :client="aiClient"
              placeholder="Type your email message..."
              :max-predictions="5"
              :min-length="2"
              :debounce="300"
              context="Professional email writing"
              @prediction-selected="handlePredictionSelected"
              @predictions-updated="handlePredictionsUpdated"
            />
            <div v-if="emailText" class="input-preview">
              <strong>Current text:</strong> {{ emailText }}
            </div>
          </div>

          <!-- Creative Writing -->
          <div class="example-card">
            <h3 class="example-title">✍️ Creative Writing</h3>
            <PredictiveInput
              v-model="creativeText"
              :client="aiClient"
              placeholder="Start writing a story..."
              :max-predictions="5"
              :min-length="3"
              context="Creative storytelling and narrative writing"
              theme="light"
              @prediction-selected="handlePredictionSelected"
            />
            <div v-if="creativeText" class="input-preview">
              <strong>Word count:</strong> {{ creativeText.split(/\s+/).filter(w => w).length }}
            </div>
          </div>

          <!-- Code Comments -->
          <div class="example-card">
            <h3 class="example-title">💻 Code Comments</h3>
            <PredictiveInput
              v-model="codeCommentText"
              :client="aiClient"
              placeholder="Write a code comment..."
              :max-predictions="4"
              context="Technical documentation and code comments"
              @prediction-selected="handlePredictionSelected"
            />
            <div v-if="codeCommentText" class="input-preview">
              <strong>Current text:</strong> {{ codeCommentText }}
            </div>
          </div>

          <!-- Social Media -->
          <div class="example-card">
            <h3 class="example-title">📱 Social Media Post</h3>
            <PredictiveInput
              v-model="socialText"
              :client="aiClient"
              placeholder="What's on your mind?"
              :max-predictions="5"
              :min-length="2"
              context="Casual social media posts and updates"
              @prediction-selected="handlePredictionSelected"
            />
            <div v-if="socialText" class="input-preview">
              <strong>Characters:</strong> {{ socialText.length }}
            </div>
          </div>
        </div>
      </section>

      <!-- Statistics Section -->
      <section class="demo-section">
        <h2 class="section-title">
          <span class="icon">📊</span>
          Usage Statistics
        </h2>

        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-value">{{ selectedCount }}</div>
              <div class="stat-label">Predictions Selected</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalPredictions }}</div>
              <div class="stat-label">Total Predictions</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalWords }}</div>
              <div class="stat-label">Words Typed</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-content">
              <div class="stat-value">{{ avgConfidence }}%</div>
              <div class="stat-label">Avg Confidence</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Predictions -->
      <section v-if="recentPredictions.length > 0" class="demo-section">
        <h2 class="section-title">
          <span class="icon">🎯</span>
          Recent Predictions
        </h2>
        
        <div class="predictions-list">
          <div
            v-for="(pred, index) in recentPredictions.slice(0, 10)"
            :key="index"
            class="prediction-item"
          >
            <span class="prediction-text">{{ pred.text }}</span>
            <span class="prediction-meta">
              <span class="prediction-type">{{ pred.type }}</span>
              <span class="prediction-confidence">{{ Math.round(pred.confidence * 100) }}%</span>
            </span>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="demo-section">
        <h2 class="section-title">
          <span class="icon">✨</span>
          Key Features
        </h2>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3 class="feature-title">AI-Powered</h3>
            <p class="feature-description">
              Uses advanced AI models to generate intelligent text predictions
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">Context-Aware</h3>
            <p class="feature-description">
              Understands context to provide relevant and accurate predictions
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3 class="feature-title">Real-Time</h3>
            <p class="feature-description">
              Get instant predictions as you type with smart debouncing
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">⌨️</div>
            <h3 class="feature-title">Keyboard Navigation</h3>
            <p class="feature-description">
              Full keyboard support with arrow keys, Enter, and Escape
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">Customizable</h3>
            <p class="feature-description">
              Supports themes, custom contexts, and configurable behavior
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🔌</div>
            <h3 class="feature-title">Flexible Integration</h3>
            <p class="feature-description">
              Works with any AI provider - OpenAI, Claude, Gemini, and more
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { PredictiveInput } from '@aivue/predictive-input';
import type { Prediction } from '@aivue/predictive-input';

// Props
const props = defineProps<{
  aiClient: any;
}>();

// State
const emailText = ref('');
const creativeText = ref('');
const codeCommentText = ref('');
const socialText = ref('');
const recentPredictions = ref<Prediction[]>([]);
const selectedCount = ref(0);
const totalPredictions = ref(0);

// Computed stats
const totalWords = computed(() => {
  const allText = [emailText.value, creativeText.value, codeCommentText.value, socialText.value].join(' ');
  return allText.split(/\s+/).filter(w => w).length;
});

const avgConfidence = computed(() => {
  if (recentPredictions.value.length === 0) return 0;
  const sum = recentPredictions.value.reduce((acc, pred) => acc + pred.confidence, 0);
  return Math.round((sum / recentPredictions.value.length) * 100);
});

// Handlers
const handlePredictionSelected = (prediction: Prediction) => {
  console.log('Prediction selected:', prediction);
  recentPredictions.value.unshift(prediction);
  if (recentPredictions.value.length > 10) {
    recentPredictions.value = recentPredictions.value.slice(0, 10);
  }
  selectedCount.value++;
};

const handlePredictionsUpdated = (predictions: Prediction[]) => {
  totalPredictions.value += predictions.length;
};
</script>

<style scoped>
.predictive-input-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-title {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.demo-description {
  font-size: 18px;
  color: #64748b;
  margin: 0;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-description {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 20px 0;
}

.icon {
  font-size: 24px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.example-card {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
}

.example-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.input-preview {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #475569;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

.predictions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prediction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.prediction-text {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.prediction-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

.prediction-type {
  font-size: 11px;
  padding: 3px 8px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.prediction-confidence {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-card {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.feature-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>


