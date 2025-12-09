<template>
  <div class="spin360-demo">
    <div class="demo-header">
      <h2>🔄 360° Product Spin</h2>
      <p class="demo-description">
        Interactive 360-degree product view with <strong>real product photography sequences</strong>.
        Hover to see products rotate through 36 frames for a smooth 360° spin.
        Perfect for e-commerce product listings, carousels, and detail pages.
      </p>
    </div>

    <div class="demo-content">
      <!-- Main Demo Section -->
      <div class="demo-main">
        <div class="demo-section">
          <h3>🖼️ Frame Sequence Mode (Hover to Spin)</h3>
          <p class="section-description">Hover over the product to see a true 360° rotation through 36 product photos</p>
          
          <div class="demo-grid">
            <div class="product-card">
              <Ai360Spin
                :static-image="gifDemo.static"
                :animated-image="gifDemo.animated"
                mode="frames"
                trigger="hover"
                :frame-rate="24"
                :preload="false"
                :show-loading="false"
                alt="Watch 360 view"
                container-class="ai-360-spin--card"
                @animation-start="onAnimationStart"
                @animation-end="onAnimationEnd"
              />
              <div class="product-info">
                <h4>Luxury Car</h4>
                <p class="price">$45,999</p>
              </div>
            </div>

            <div class="product-card">
              <Ai360Spin
                :static-image="gifDemo2.static"
                :animated-image="gifDemo2.animated"
                mode="frames"
                trigger="hover"
                :frame-rate="24"
                :preload="false"
                :show-loading="false"
                alt="Nike Sneakers 360 view"
                container-class="ai-360-spin--card"
              />
              <div class="product-info">
                <h4>Nike Sneakers</h4>
                <p class="price">$189.99</p>
              </div>
            </div>
          </div>
        </div>

        <div class="demo-section">
          <h3>🎬 Frame Sequence Mode (Drag to Spin)</h3>
          <p class="section-description">Drag or swipe to manually control the rotation</p>
          
          <div class="demo-large">
            <Ai360Spin
              :static-image="frameDemo.static"
              :animated-image="frameDemo.frames"
              mode="frames"
              trigger="hover"
              :frame-rate="30"
              :preload="false"
              :show-loading="false"
              enable-drag-spin
              :drag-sensitivity="8"
              alt="Product frame sequence"
              width="500px"
              height="500px"
              @frame-change="onFrameChange"
            />
            <div class="frame-info" v-if="currentFrame !== null">
              Frame: {{ currentFrame + 1 }} / {{ frameDemo.frames.length }}
            </div>
          </div>
        </div>

        <div class="demo-section">
          <h3>🛍️ Product Grid Example</h3>
          <p class="section-description">Typical e-commerce product listing layout</p>
          
          <div class="product-grid">
            <div v-for="(product, index) in products" :key="index" class="grid-item">
              <Ai360Spin
                :static-image="product.static"
                :animated-image="product.animated"
                mode="frames"
                :frame-rate="24"
                :alt="product.name"
                :preload="false"
                :show-loading="false"
                container-class="ai-360-spin--grid"
                trigger="hover"
              />
              <div class="grid-item-info">
                <h5>{{ product.name }}</h5>
                <p class="price">{{ product.price }}</p>
                <button class="add-to-cart">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Panel -->
      <div class="info-panel">
        <div class="info-card">
          <h3>✨ Features</h3>
          <ul class="feature-list">
            <li>✅ Static to animated on hover/tap</li>
            <li>✅ GIF and frame sequence support</li>
            <li>✅ Mobile drag-to-spin</li>
            <li>✅ Preloading for smooth UX</li>
            <li>✅ Product card integration</li>
            <li>✅ Carousel compatible</li>
            <li>✅ Customizable triggers</li>
            <li>✅ Responsive design</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>🎯 Use Cases</h3>
          <ul class="use-case-list">
            <li><strong>Product Listings:</strong> Show 360° view on hover</li>
            <li><strong>Product Details:</strong> Interactive spin viewer</li>
            <li><strong>Carousels:</strong> Animated product showcases</li>
            <li><strong>Search Results:</strong> Enhanced product previews</li>
            <li><strong>Mobile Apps:</strong> Touch-enabled rotation</li>
          </ul>
        </div>

        <div class="info-card">
          <h3>⚙️ Configuration</h3>
          <div class="config-options">
            <div class="config-item">
              <label>
                <input type="checkbox" v-model="showAnimationStatus" />
                Show Animation Status
              </label>
            </div>
          </div>
          <div v-if="showAnimationStatus" class="status-display">
            <p><strong>Status:</strong> {{ animationStatus }}</p>
          </div>
        </div>

        <div class="info-card highlight-card">
          <h3>🚀 Quick Start</h3>
          <div class="code-example">
            <pre><code>&lt;Ai360Spin
  static-image="/product.jpg"
  animated-image="/product-360.gif"
  trigger="hover"
  alt="Product 360 view"
/&gt;</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Ai360Spin } from '@aivue/360-spin';
import '@aivue/360-spin/360-spin.css';

// Animation status
const animationStatus = ref('Idle');
const showAnimationStatus = ref(true);
const currentFrame = ref<number | null>(null);

// Demo data - Using REAL 360° product spin image sequences from Scaleflex CDN
// These are actual 360-degree product photography sequences, not just two static images!

// Car demo - 36 frames for smooth 360° rotation (iris car)
const carFrames = Array.from({ length: 36 }, (_, i) =>
  `https://scaleflex.cloudimg.io/v7/demo/360-car/iris-${i + 1}.jpeg`
);

const gifDemo = {
  static: carFrames[0], // First frame as static
  animated: carFrames  // All 36 frames for 360° spin
};

// Nike shoe demo - 35 frames for smooth 360° rotation
const nikeFrames = Array.from({ length: 35 }, (_, i) =>
  `https://scaleflex.cloudimg.io/v7/demo/360-nike/nike-${i + 1}.jpg`
);

const gifDemo2 = {
  static: nikeFrames[0], // First frame as static
  animated: nikeFrames  // All 36 frames for 360° spin
};

// Car demo (large) - 36 frames for smooth 360° rotation with drag
const frameDemo = {
  static: carFrames[0], // First frame as static
  frames: carFrames  // All 36 frames for 360° spin
};

// Product grid data - Each with real 360° spin sequences
const products = [
  {
    name: 'Luxury Car',
    price: '$45,999',
    static: carFrames[0],
    animated: carFrames
  },
  {
    name: 'Nike Sneakers',
    price: '$189.99',
    static: nikeFrames[0],
    animated: nikeFrames
  },
  {
    name: 'Sports Car',
    price: '$52,999',
    static: carFrames[0],
    animated: carFrames
  },
  {
    name: 'Running Shoes',
    price: '$159.99',
    static: nikeFrames[0],
    animated: nikeFrames
  }
];

// Event handlers
function onAnimationStart() {
  animationStatus.value = 'Animating...';
}

function onAnimationEnd() {
  animationStatus.value = 'Idle';
}

function onFrameChange(frame: number) {
  currentFrame.value = frame;
}
</script>

<style scoped>
.spin360-demo {
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
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.demo-description {
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.demo-main {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #666;
  margin-bottom: 1.5rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.product-info {
  padding: 1rem;
  text-align: center;
}

.product-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
}

.demo-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.frame-info {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.grid-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.grid-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.grid-item-info {
  padding: 1rem;
}

.grid-item-info h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.add-to-cart {
  width: 100%;
  padding: 0.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 0.5rem;
}

.add-to-cart:hover {
  background: #5568d3;
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.feature-list,
.use-case-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li,
.use-case-list li {
  padding: 0.5rem 0;
  color: #555;
  line-height: 1.5;
}

.use-case-list li {
  margin-bottom: 0.75rem;
}

.use-case-list strong {
  color: #667eea;
}

.config-options {
  margin-bottom: 1rem;
}

.config-item {
  margin-bottom: 0.75rem;
}

.config-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #555;
}

.config-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.status-display {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.status-display p {
  margin: 0;
  color: #555;
}

.highlight-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.highlight-card h3 {
  color: white;
}

.code-example {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
  color: white;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.code-example code {
  color: white;
}

@media (max-width: 1024px) {
  .demo-content {
    grid-template-columns: 1fr;
  }

  .info-panel {
    order: -1;
  }
}

@media (max-width: 768px) {
  .spin360-demo {
    padding: 1rem;
  }

  .demo-header h2 {
    font-size: 2rem;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>

