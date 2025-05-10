import { SmartForm } from './components/SmartForm';
import { useSmartForm } from './hooks/useSmartForm';

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
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  validate: (field?: string) => Promise<boolean>;
  fixWithAI: (field: string) => Promise<void>;
  reset: () => void;
  submitForm: () => Promise<boolean>;
}

// Export components and hooks
export { SmartForm, useSmartForm };

// Default export
export default {
  SmartForm,
  useSmartForm
};
