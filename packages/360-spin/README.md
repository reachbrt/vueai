# @aivue/360-spin

> Interactive 360-degree product image spin component for Vue.js

[![npm version](https://img.shields.io/npm/v/@aivue/360-spin.svg)](https://www.npmjs.com/package/@aivue/360-spin)
[![npm downloads](https://img.shields.io/npm/dm/@aivue/360-spin.svg)](https://www.npmjs.com/package/@aivue/360-spin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🖼️ **Static to Animated**: Show static product image by default, animate on hover/tap
- 🎬 **Multiple Modes**: Support for GIF animations or frame sequences
- 📱 **Mobile Optimized**: Touch and drag to spin on mobile devices
- 🎯 **Flexible Triggers**: Hover, click, or auto-play animations
- 🛍️ **E-commerce Ready**: Perfect for product cards, carousels, and search results
- ⚡ **Performance**: Preloading and optimized frame rendering
- 🎨 **Customizable**: Full control over styling and behavior
- ♿ **Accessible**: Keyboard navigation and screen reader support

## 📦 Installation

```bash
npm install @aivue/360-spin
```

## 🚀 Quick Start

### Basic Usage (GIF Mode)

```vue
<template>
  <Ai360Spin
    static-image="/images/product-static.jpg"
    animated-image="/images/product-360.gif"
    alt="Product 360 view"
    width="400px"
    height="400px"
  />
</template>

<script setup>
import { Ai360Spin } from '@aivue/360-spin';
import '@aivue/360-spin/360-spin.css';
</script>
```

### Frame Sequence Mode

```vue
<template>
  <Ai360Spin
    static-image="/images/product-static.jpg"
    :animated-image="frameUrls"
    mode="frames"
    :frame-rate="30"
    enable-drag-spin
    alt="Product 360 view"
  />
</template>

<script setup>
import { Ai360Spin } from '@aivue/360-spin';
import '@aivue/360-spin/360-spin.css';

const frameUrls = [
  '/images/frame-001.jpg',
  '/images/frame-002.jpg',
  '/images/frame-003.jpg',
  // ... more frames
];
</script>
```

### Product Card Integration

```vue
<template>
  <div class="product-card">
    <Ai360Spin
      :static-image="product.image"
      :animated-image="product.spin360"
      container-class="ai-360-spin--card"
      :alt="product.name"
      trigger="hover"
    />
    <h3>{{ product.name }}</h3>
    <p>{{ product.price }}</p>
  </div>
</template>
```

## 📖 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `staticImage` | `string` | **required** | URL of the static product image |
| `animatedImage` | `string \| string[]` | **required** | GIF URL or array of frame URLs |
| `mode` | `'gif' \| 'frames' \| 'auto'` | `'auto'` | Animation mode |
| `trigger` | `'hover' \| 'click' \| 'auto'` | `'hover'` | How to start animation |
| `width` | `string \| number` | `'100%'` | Container width |
| `height` | `string \| number` | `'auto'` | Container height |
| `alt` | `string` | `'Product 360 view'` | Alt text for images |
| `frameRate` | `number` | `30` | FPS for frame sequence |
| `loop` | `boolean` | `true` | Whether to loop animation |
| `direction` | `'clockwise' \| 'counterclockwise'` | `'clockwise'` | Spin direction |
| `preload` | `boolean` | `true` | Preload images on mount |
| `showLoading` | `boolean` | `true` | Show loading indicator |
| `loadingText` | `string` | `'Loading...'` | Loading text |
| `enableDragSpin` | `boolean` | `true` | Enable drag to spin on mobile |
| `dragSensitivity` | `number` | `10` | Pixels per frame for drag |
| `containerClass` | `string` | `''` | CSS class for container |
| `imageClass` | `string` | `''` | CSS class for images |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `animation-start` | `void` | Fired when animation starts |
| `animation-end` | `void` | Fired when animation ends |
| `loaded` | `void` | Fired when images are loaded |
| `error` | `Error` | Fired on loading error |
| `frame-change` | `number` | Fired when frame changes (frames mode) |

## 🎨 Styling

The component comes with default styles, but you can customize them:

```css
/* Custom container styles */
.ai-360-spin {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Custom loading spinner */
.ai-360-spin__spinner {
  border-top-color: #your-brand-color;
}

/* Custom hint badge */
.ai-360-spin__hint {
  background: rgba(your-color, 0.9);
}
```

### Pre-built Classes

- `.ai-360-spin--card` - Optimized for product cards (1:1 aspect ratio)
- `.ai-360-spin--grid` - Optimized for grid layouts (4:3 aspect ratio)
- `.ai-360-spin--carousel` - Optimized for carousels (full width/height)

## 💡 Use Cases

### E-commerce Product Listings

```vue
<div class="product-grid">
  <div v-for="product in products" :key="product.id" class="product-item">
    <Ai360Spin
      :static-image="product.thumbnail"
      :animated-image="product.spin360Gif"
      container-class="ai-360-spin--grid"
      :alt="product.name"
    />
  </div>
</div>
```

### Product Detail Page

```vue
<Ai360Spin
  :static-image="product.mainImage"
  :animated-image="product.frames"
  mode="frames"
  :frame-rate="60"
  enable-drag-spin
  width="600px"
  height="600px"
  trigger="click"
/>
```

### Carousel Integration

```vue
<div class="carousel">
  <div v-for="item in carouselItems" :key="item.id" class="carousel-slide">
    <Ai360Spin
      :static-image="item.image"
      :animated-image="item.spin"
      container-class="ai-360-spin--carousel"
      trigger="hover"
    />
  </div>
</div>
```

## 🔧 Advanced Usage

### Using the Composable

```vue
<script setup>
import { use360Spin } from '@aivue/360-spin';

const config = {
  staticImage: '/product.jpg',
  animatedImage: frameUrls,
  mode: 'frames',
  frameRate: 30
};

const {
  isAnimating,
  isLoading,
  currentFrameIndex,
  startAnimation,
  stopAnimation,
  preloadImages
} = use360Spin(config, emit);

// Manually control animation
function handleCustomTrigger() {
  if (isAnimating.value) {
    stopAnimation();
  } else {
    startAnimation();
  }
}
</script>
```

### Programmatic Control

```vue
<template>
  <div>
    <Ai360Spin
      ref="spinRef"
      :static-image="staticImg"
      :animated-image="frames"
      trigger="click"
      @animation-start="onStart"
      @animation-end="onEnd"
      @frame-change="onFrameChange"
    />
    <button @click="toggleSpin">Toggle Spin</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Ai360Spin } from '@aivue/360-spin';

const spinRef = ref(null);

function onStart() {
  console.log('Animation started');
}

function onEnd() {
  console.log('Animation ended');
}

function onFrameChange(frameIndex) {
  console.log('Current frame:', frameIndex);
}
</script>
```

## 📱 Mobile Optimization

The component automatically optimizes for mobile devices:

- **Touch Events**: Drag to spin through frames
- **Performance**: Optimized rendering for mobile browsers
- **Responsive**: Adapts to different screen sizes
- **Touch Feedback**: Visual feedback for touch interactions

## 🎯 Best Practices

### Frame Sequence Tips

1. **Frame Count**: Use 24-36 frames for smooth rotation
2. **Image Size**: Optimize images (WebP format recommended)
3. **Naming**: Use sequential naming (frame-001.jpg, frame-002.jpg, etc.)
4. **Preloading**: Enable preloading for better UX

### Performance Optimization

```vue
<Ai360Spin
  :static-image="product.thumbnail"
  :animated-image="product.frames"
  :preload="true"
  :frame-rate="24"
  loading-image="/placeholder.jpg"
/>
```

### Accessibility

```vue
<Ai360Spin
  :static-image="product.image"
  :animated-image="product.spin"
  :alt="`360-degree view of ${product.name}`"
  role="img"
  aria-label="Interactive product view"
/>
```

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT © [reachbrt](https://github.com/reachbrt)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [GitHub Repository](https://github.com/reachbrt/vueai)
- [Demo](https://aivue.netlify.app)
- [Report Issues](https://github.com/reachbrt/vueai/issues)

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.

---

Made with ❤️ by [reachbrt](https://github.com/reachbrt)


