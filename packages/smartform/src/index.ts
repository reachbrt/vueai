// AI-powered form validation for Vue.js
import { App } from 'vue';
import { AIClient } from '@aivue/core';

// Import Vue compatibility utilities from core
import {
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin
} from '@aivue/core';

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

export interface UseSmartFormResult {
  formData: SmartFormData;
  errors: SmartFormErrors;
  handleChange: (field: string, value: any) => void;
  validate: (field?: string) => Promise<boolean>;
  fixWithAI: (field: string) => Promise<void>;
  reset: () => void;
  submitForm: () => Promise<boolean>;
}

// Import the real useSmartForm composable
import { useSmartForm as useSmartFormImpl, SmartFormOptions, SmartFormReturn } from './composables/useSmartForm';

// Re-export the useSmartForm composable with a simpler interface
export function useSmartForm(options: SmartFormOptions): SmartFormReturn {
  return useSmartFormImpl(options);
}

// Import the SmartForm component
import SmartFormComponent from './components/SmartForm.vue';

// Create a compatible component
export const SmartForm = createCompatComponent(SmartFormComponent);

// Export with the Ai prefix for consistency
export const AiSmartForm = SmartForm;

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
  AiSmartForm,
  SmartFormPlugin
};
