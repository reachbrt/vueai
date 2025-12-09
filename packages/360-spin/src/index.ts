import type { App } from 'vue';
import Ai360Spin from './components/Ai360Spin.vue';
import { use360Spin } from './composables/use360Spin';
import type { Spin360Config, SpinMode, SpinTrigger, SpinDirection, Spin360Events } from './types';

// Import styles
import './styles/360-spin.css';

// Export components
export { Ai360Spin };

// Export composables
export { use360Spin };

// Export types
export type {
  Spin360Config,
  SpinMode,
  SpinTrigger,
  SpinDirection,
  Spin360Events
};

// Vue plugin
export default {
  install(app: App) {
    app.component('Ai360Spin', Ai360Spin);
  }
};

