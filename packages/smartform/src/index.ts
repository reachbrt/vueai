// AI-powered form validation for Vue.js
import { App } from 'vue';
import { AIClient } from '@aivue/core';

// Import Vue compatibility utilities from core
import {
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin
} from '@aivue/core';

// Import the real useSmartForm composable
import { useSmartForm as useSmartFormImpl, SmartFormOptions, SmartFormReturn } from './composables/useSmartForm';

// Re-export the types from the composable
export type { SmartFormOptions, SmartFormReturn };

// Export types
export interface SmartFormSchema {
  [field: string]: {
    type: string;
    aiValidation?: boolean;
    selfHeal?: boolean;
    required?: boolean;
    label?: string;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    min?: number;
    max?: number;
  };
}

export interface SmartFormData {
  [field: string]: any;
}

export interface SmartFormErrors {
  [field: string]: string;
}

// Re-export the useSmartForm composable
export function useSmartForm(options: SmartFormOptions): SmartFormReturn {
  return useSmartFormImpl(options);
}

// Import the SmartForm component
import SmartFormComponent from './components/SmartForm.vue';

// Create a compatible component
export const SmartForm = createCompatComponent({
  name: 'SmartForm',
  component: SmartFormComponent
});

// Vue Plugin with compatibility layer
export const SmartFormPlugin = createCompatPlugin({
  install(app: App) {
    // Register components globally using the compatibility helper
    registerCompatComponent(app, 'SmartForm', SmartForm);
  }
});

// No need to re-export Vue compatibility utilities

// Default export
export default {
  useSmartForm,
  SmartForm,
  SmartFormPlugin
};
