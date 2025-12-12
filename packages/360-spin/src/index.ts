import type { App } from 'vue';
import Ai360Spin from './components/Ai360Spin.vue';
import Ai360Generator from './components/Ai360Generator.vue';
import { use360Spin } from './composables/use360Spin';
import { AI360Generator } from './utils/ai-generator';
import type {
  Spin360Config,
  SpinMode,
  SpinTrigger,
  SpinDirection,
  Spin360Events,
  AIProvider,
  BackgroundColor,
  AI360GeneratorConfig,
  AI360GenerationProgress,
  AI360GenerationResult
} from './types';

// Import styles
import './styles/360-spin.css';

// Export components
export { Ai360Spin, Ai360Generator };

// Export composables
export { use360Spin };

// Export utilities
export { AI360Generator };

// Export types
export type {
  Spin360Config,
  SpinMode,
  SpinTrigger,
  SpinDirection,
  Spin360Events,
  AIProvider,
  BackgroundColor,
  AI360GeneratorConfig,
  AI360GenerationProgress,
  AI360GenerationResult
};

// Vue plugin
export default {
  install(app: App) {
    app.component('Ai360Spin', Ai360Spin);
    app.component('Ai360Generator', Ai360Generator);
  }
};

