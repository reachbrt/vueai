<template>
  <div class="image-caption-demo">
    <div class="component-hero">
      <div class="component-hero-content">
        <h2 class="component-hero-title">AI Image Caption</h2>
        <p class="component-hero-description">
          Generate intelligent, contextual captions for images using state-of-the-art computer vision models.
          Perfect for accessibility, content management, and AI-powered applications.
        </p>
        <div class="component-hero-features">
          <div class="hero-feature">
            <span class="feature-icon">🖼️</span>
            <span>Image Analysis</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">🤖</span>
            <span>AI-Powered</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">📝</span>
            <span>Smart Captions</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon">⚡</span>
            <span>Real-time</span>
          </div>
        </div>
      </div>
      <div class="component-hero-image">
        <div class="caption-preview">
          <div class="preview-container">
            <div class="preview-image">
              <div class="image-placeholder">
                <span class="placeholder-icon">🖼️</span>
                <span class="placeholder-text">Upload Image</span>
              </div>
            </div>
            <div class="preview-caption">
              <div class="caption-bubble">
                <span class="caption-icon">💬</span>
                <span class="caption-text">AI will generate caption here...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Main Demo Component -->
    <div class="demo-section">
      <div class="demo-container">
        <div class="component-demo-header">
          <h3>Interactive Demo</h3>
          <div class="component-code">
            <code>&lt;AiImageCaption :api-key="apiKey" /&gt;</code>
          </div>
        </div>

        <p class="component-description">
          Upload an image or paste a URL to generate an AI-powered caption. The component supports multiple models
          and provides a beautiful interface for image captioning.
        </p>



        <!-- Image Caption Component -->
        <div class="caption-component-wrapper">
          <AiImageCaption
            :api-key="apiKey"
            :model="selectedModel"
            :auto-caption="autoCaption"
            @caption-generated="onCaptionGenerated"
            @caption-error="onCaptionError"
            @image-uploaded="onImageUploaded"
            @image-removed="onImageRemoved"
          />
        </div>
      </div>
    </div>

    <!-- Demo Controls -->
    <div class="controls-section">
      <div class="controls-container">
        <h3>Demo Controls</h3>
        <div class="controls-grid">
          <div class="control-group">
            <label class="control-label">AI Model</label>
            <select v-model="selectedModel" class="control-select">
              <option value="gpt-4o">GPT-4o (Latest & Most Capable)</option>
              <option value="gpt-4o-mini">GPT-4o Mini (Faster & Cost-Effective)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo (High Intelligence)</option>
            </select>
            <div class="model-note">
              <small>💡 GPT-4o is the latest model, GPT-4o Mini is most cost-effective, GPT-4 Turbo offers high intelligence</small>
            </div>
          </div>
          <div class="control-group">
            <label class="control-label">
              <input
                v-model="autoCaption"
                type="checkbox"
                class="control-checkbox"
              />
              Auto-generate captions
            </label>
          </div>
          <div class="control-group">
            <button @click="loadSampleImage" class="sample-btn">
              <span class="btn-icon">🖼️</span>
              Load Sample Image
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <div class="features-container">
        <h3>Package Features</h3>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h4>OpenAI Vision Models</h4>
            <p>GPT-4o, GPT-4o Mini, and GPT-4 Turbo for advanced image understanding</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h4>Drag & Drop</h4>
            <p>Intuitive file upload with drag and drop support and image preview</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌐</div>
            <h4>URL Support</h4>
            <p>Generate captions for images from URLs without downloading</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h4>Batch Processing</h4>
            <p>Process multiple images at once with comprehensive results</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h4>History Tracking</h4>
            <p>Keep track of generated captions with export functionality</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h4>Beautiful UI</h4>
            <p>Modern, responsive design that works great on all devices</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Code Examples -->
    <div class="examples-section">
      <div class="examples-container">
        <h3>Code Examples</h3>
        <div class="examples-grid">
          <div class="example-card">
            <h4>Basic Usage</h4>
            <pre class="code-block"><code>&lt;template&gt;
  &lt;AiImageCaption
    :api-key="openaiApiKey"
    @caption-generated="onCaption"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { AiImageCaption } from '@aivue/image-caption';
import '@aivue/image-caption/dist/image-caption.css';

const onCaption = (result) => {
  console.log(result.caption);
};
&lt;/script&gt;</code></pre>
          </div>
          <div class="example-card">
            <h4>Composable Usage</h4>
            <pre class="code-block"><code>&lt;script setup&gt;
import { useImageCaption } from '@aivue/image-caption';

const {
  generateCaption,
  uploadImage,
  isProcessing
} = useImageCaption({
  config: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: 'gpt-4o'
  }
});

const handleFile = async (file) => {
  await uploadImage(file);
  const result = await generateCaption(file);
  console.log(result.caption);
};
&lt;/script&gt;</code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Models Section -->
    <div class="models-section">
      <div class="models-container">
        <h3>🤖 OpenAI Vision Models</h3>
        <p class="models-description">
          Choose from the latest OpenAI Vision models for different use cases and performance requirements.
        </p>
        <div class="models-grid">
          <div class="model-card featured">
            <div class="model-header">
              <div class="model-icon">🚀</div>
              <div class="model-info">
                <h4>GPT-4o</h4>
                <span class="model-badge recommended">Recommended</span>
              </div>
            </div>
            <div class="model-description">
              Latest and most capable vision model with advanced multimodal understanding
            </div>
            <div class="model-specs">
              <div class="spec-item">
                <span class="spec-label">Max Tokens:</span>
                <span class="spec-value">4,096</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Cost:</span>
                <span class="spec-value">$0.005 / 1K tokens</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Best For:</span>
                <span class="spec-value">General use, highest quality</span>
              </div>
            </div>
          </div>

          <div class="model-card">
            <div class="model-header">
              <div class="model-icon">⚡</div>
              <div class="model-info">
                <h4>GPT-4o Mini</h4>
                <span class="model-badge cost-effective">Cost-Effective</span>
              </div>
            </div>
            <div class="model-description">
              Faster and more cost-effective while maintaining excellent quality
            </div>
            <div class="model-specs">
              <div class="spec-item">
                <span class="spec-label">Max Tokens:</span>
                <span class="spec-value">16,384</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Cost:</span>
                <span class="spec-value">$0.00015 / 1K tokens</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Best For:</span>
                <span class="spec-value">High volume, cost-sensitive</span>
              </div>
            </div>
          </div>

          <div class="model-card">
            <div class="model-header">
              <div class="model-icon">🧠</div>
              <div class="model-info">
                <h4>GPT-4 Turbo</h4>
                <span class="model-badge premium">Premium</span>
              </div>
            </div>
            <div class="model-description">
              High-intelligence model for detailed analysis and complex scenes
            </div>
            <div class="model-specs">
              <div class="spec-item">
                <span class="spec-label">Max Tokens:</span>
                <span class="spec-value">4,096</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Cost:</span>
                <span class="spec-value">$0.01 / 1K tokens</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Best For:</span>
                <span class="spec-value">Complex analysis, detailed descriptions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Installation -->
    <div class="installation-section">
      <div class="installation-container">
        <h3>Installation</h3>
        <div class="install-steps">
          <div class="install-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Install Package</h4>
              <pre class="install-code"><code>npm install @aivue/image-caption</code></pre>
            </div>
          </div>
          <div class="install-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Import Component</h4>
              <pre class="install-code"><code>import { AiImageCaption } from '@aivue/image-caption';
import '@aivue/image-caption/dist/image-caption.css';</code></pre>
            </div>
          </div>
          <div class="install-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Use Component</h4>
              <pre class="install-code"><code>&lt;AiImageCaption :api-key="your-api-key" /&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { AiImageCaption } from '@aivue/image-caption';
import '@aivue/image-caption/dist/image-caption.css';

export default {
  name: 'ImageCaptionDemo',
  components: {
    AiImageCaption
  },
  props: {
    apiKey: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const selectedModel = ref('gpt-4o');
    const autoCaption = ref(false);

    const loadSampleImage = () => {
      // This would load a sample image URL for demonstration
      const sampleImageUrl = 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80';
      // The component would handle this URL
      console.log('Loading sample image:', sampleImageUrl);
    };

    const onCaptionGenerated = (result) => {
      console.log('Caption generated:', result);
    };

    const onCaptionError = (error) => {
      console.error('Caption error:', error);
    };

    const onImageUploaded = (event) => {
      console.log('Image uploaded:', event);
    };

    const onImageRemoved = () => {
      console.log('Image removed');
    };

    return {
      apiKey: props.apiKey,
      selectedModel,
      autoCaption,
      loadSampleImage,
      onCaptionGenerated,
      onCaptionError,
      onImageUploaded,
      onImageRemoved
    };
  }
};
</script>

<style scoped>
.image-caption-demo {
  padding: 0;
}

.component-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 80px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;
}

.component-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.component-hero-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 20px 0;
  background: linear-gradient(45deg, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.component-hero-description {
  font-size: 20px;
  line-height: 1.6;
  margin: 0 0 30px 0;
  opacity: 0.9;
}

.component-hero-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.hero-feature {
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

.caption-preview {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  color: #1e293b;
}

.preview-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.6;
}

.placeholder-icon {
  font-size: 32px;
}

.placeholder-text {
  font-size: 14px;
  color: #64748b;
}

.preview-caption {
  display: flex;
  justify-content: center;
}

.caption-bubble {
  background: #667eea;
  color: white;
  padding: 12px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  max-width: 80%;
}

.caption-icon {
  font-size: 16px;
}



/* Features Section */
.features-section {
  padding: 80px 40px;
  background: #ffffff;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.features-container h3 {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 60px 0;
  color: #1e293b;
  position: relative;
}

.features-container h3::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.feature-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card .feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
  display: block;
}

.feature-card h4 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1e293b;
}

.feature-card p {
  font-size: 16px;
  line-height: 1.6;
  color: #64748b;
  margin: 0;
}

/* Examples Section */
.examples-section {
  padding: 80px 40px;
  background: #f8fafc;
}

.examples-container {
  max-width: 1200px;
  margin: 0 auto;
}

.examples-container h3 {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 60px 0;
  color: #1e293b;
  position: relative;
}

.examples-container h3::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 32px;
}

.example-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.example-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.example-card h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
}

.code-block {
  margin: 0;
  padding: 24px;
  background: #1e293b;
  color: #e2e8f0;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow-x: auto;
}

/* Installation Section */
.installation-section {
  padding: 80px 40px;
  background: #ffffff;
}

.installation-container {
  max-width: 800px;
  margin: 0 auto;
}

.installation-container h3 {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 60px 0;
  color: #1e293b;
  position: relative;
}

.installation-container h3::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.install-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.install-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #1e293b;
}

.install-code {
  margin: 0;
  padding: 16px 20px;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.4;
  overflow-x: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .component-hero {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 60px 20px;
  }

  .component-hero-title {
    font-size: 36px;
  }

  .features-section,
  .examples-section,
  .installation-section {
    padding: 60px 20px;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .install-step {
    flex-direction: column;
    gap: 12px;
  }

  .step-number {
    align-self: flex-start;
  }
}

/* Models Section */
.models-section {
  padding: 80px 40px;
  background: #f8fafc;
}

.models-container {
  max-width: 1200px;
  margin: 0 auto;
}

.models-container h3 {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 20px 0;
  color: #1e293b;
  position: relative;
}

.models-container h3::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.models-description {
  text-align: center;
  font-size: 18px;
  color: #64748b;
  margin: 0 0 60px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.model-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.model-card.featured {
  border-color: #667eea;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
}

.model-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.model-card.featured:hover {
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25);
}

.model-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.model-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.model-info h4 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1e293b;
}

.model-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.model-badge.recommended {
  background: #dcfce7;
  color: #166534;
}

.model-badge.cost-effective {
  background: #fef3c7;
  color: #92400e;
}

.model-badge.premium {
  background: #e0e7ff;
  color: #3730a3;
}

.model-description {
  font-size: 16px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 24px;
}

.model-specs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.spec-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 500;
}

.api-note {
  margin-top: 12px;
  padding: 8px 12px;
  background: #dcfce7;
  border: 1px solid #16a34a;
  border-radius: 6px;
  font-size: 13px;
  color: #15803d;
}

.connection-status {
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
}

.connection-status.success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.connection-status.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* Demo Section */
.demo-section {
  padding: 60px 40px;
}

.demo-container {
  max-width: 1000px;
  margin: 0 auto;
}

.component-demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.component-demo-header h3 {
  font-size: 32px;
  margin: 0 0 16px 0;
  color: #1e293b;
}

.component-code {
  background: #1e293b;
  color: #e2e8f0;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  display: inline-block;
}

.component-description {
  font-size: 18px;
  line-height: 1.6;
  color: #64748b;
  text-align: center;
  margin: 0 0 40px 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.caption-component-wrapper {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.caption-component-wrapper:hover {
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

/* Override component padding for demo */
.caption-component-wrapper .ai-image-caption {
  padding: 0;
  max-width: none;
  margin: 0;
}

.caption-component-wrapper .image-caption-container {
  border: none;
  box-shadow: none;
  border-radius: 0;
}

.caption-component-wrapper .image-caption-container:hover {
  box-shadow: none;
}



/* Controls Section */
.controls-section {
  padding: 60px 40px;
  background: #f8fafc;
}

.controls-container {
  max-width: 800px;
  margin: 0 auto;
}

.controls-container h3 {
  font-size: 28px;
  margin: 0 0 32px 0;
  color: #1e293b;
  text-align: center;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  align-items: end;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
}

.control-select:focus {
  outline: none;
  border-color: #667eea;
}

.control-checkbox {
  width: 16px;
  height: 16px;
}

.model-note {
  margin-top: 6px;
}

.model-note small {
  color: #64748b;
  font-size: 12px;
  font-style: italic;
}

.sample-btn {
  padding: 12px 20px;
  border: 2px solid #667eea;
  border-radius: 8px;
  background: transparent;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.sample-btn:hover {
  background: #667eea;
  color: white;
}



/* Responsive Design */
@media (max-width: 768px) {
  .component-hero {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 60px 20px;
  }

  .component-hero-title {
    font-size: 36px;
  }

  .component-hero-features {
    grid-template-columns: 1fr;
  }

  .setup-info {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }

  .api-input-group {
    flex-direction: column;
  }

  .controls-grid {
    grid-template-columns: 1fr;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .models-grid {
    grid-template-columns: 1fr;
  }

  .install-step {
    flex-direction: column;
    gap: 16px;
  }

  .features-section,
  .examples-section,
  .models-section,
  .installation-section {
    padding: 60px 20px;
  }

  .demo-section {
    padding: 60px 20px;
  }

  .controls-section {
    padding: 60px 20px;
  }



  /* Component responsive adjustments */
  .caption-component-wrapper .ai-image-caption {
    font-size: 14px;
  }

  .caption-component-wrapper .caption-header {
    padding: 20px 24px;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .caption-component-wrapper .caption-controls {
    width: 100%;
    justify-content: space-between;
  }

  .caption-component-wrapper .upload-section {
    padding: 24px;
  }

  .caption-component-wrapper .upload-area {
    min-height: 180px;
    padding: 32px 16px;
  }
}
</style>
