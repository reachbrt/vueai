import { ref, reactive, Ref } from 'vue';
import { AIClient } from '@aivue/core';

export interface SmartFormOptions {
  client: AIClient;
  schema: Record<string, any>;
  initialData?: Record<string, any>;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  autoCorrect?: boolean;
  feedbackDelay?: number;
  onError?: (error: Error) => void;
}

export interface SmartFormReturn {
  formData: Record<string, any>;
  errors: Record<string, string>;
  isLoading: Ref<boolean>;
  handleChange: (field: string, value: any) => void;
  validate: (field?: string) => Promise<boolean>;
  fixWithAI: (field: string) => Promise<void>;
  reset: () => void;
  submitForm: () => Promise<boolean>;
}

/**
 * Composable for AI-powered form validation and correction
 * 
 * @param options Configuration options
 * @returns SmartForm state and methods
 */
export function useSmartForm(options: SmartFormOptions): SmartFormReturn {
  const {
    client,
    schema,
    initialData = {},
    validationMode = 'onChange',
    autoCorrect = false,
    feedbackDelay = 500,
    onError = () => {}
  } = options;

  // Initialize form data from schema and initial data
  const formData = reactive<Record<string, any>>({});
  const errors = reactive<Record<string, string>>({});
  const isLoading = ref(false);
  let debounceTimeout: number | null = null;

  // Initialize form data
  for (const field in schema) {
    if (initialData[field] !== undefined) {
      formData[field] = initialData[field];
    } else if (schema[field].type === 'checkbox') {
      formData[field] = schema[field].defaultValue || false;
    } else if (schema[field].type === 'select' || schema[field].type === 'radio') {
      formData[field] = schema[field].defaultValue || '';
    } else {
      formData[field] = schema[field].defaultValue || '';
    }
  }

  /**
   * Handle field change
   * 
   * @param field Field name
   * @param value New value
   */
  const handleChange = (field: string, value: any): void => {
    formData[field] = value;
    
    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    // Validate after delay if validationMode is onChange
    if (validationMode === 'onChange') {
      debounceTimeout = window.setTimeout(() => {
        validate(field);
      }, feedbackDelay);
    }
  };

  /**
   * Validate a field or the entire form
   * 
   * @param field Optional field name to validate
   * @returns Promise<boolean> indicating if validation passed
   */
  const validate = async (field?: string): Promise<boolean> => {
    // If field is provided, validate only that field
    if (field) {
      return validateField(field);
    }
    
    // Otherwise validate all fields
    const validationPromises = Object.keys(schema).map(validateField);
    const results = await Promise.all(validationPromises);
    return results.every(Boolean);
  };

  /**
   * Validate a specific field
   * 
   * @param field Field name
   * @returns Promise<boolean> indicating if validation passed
   */
  const validateField = async (field: string): Promise<boolean> => {
    const fieldSchema = schema[field];
    const value = formData[field];
    
    // Clear previous error
    delete errors[field];
    
    // Required field validation
    if (fieldSchema.required && (value === undefined || value === null || value === '')) {
      errors[field] = fieldSchema.requiredMessage || `${fieldSchema.label || field} is required`;
      return false;
    }
    
    // Pattern validation
    if (fieldSchema.pattern && value) {
      const regex = new RegExp(fieldSchema.pattern);
      if (!regex.test(String(value))) {
        errors[field] = fieldSchema.patternMessage || `Invalid ${fieldSchema.label || field}`;
        return false;
      }
    }
    
    // Custom validation function
    if (fieldSchema.validate && typeof fieldSchema.validate === 'function') {
      try {
        const result = await fieldSchema.validate(value, formData);
        if (result !== true) {
          errors[field] = result || `Invalid ${fieldSchema.label || field}`;
          return false;
        }
      } catch (error: any) {
        errors[field] = error.message || `Validation error for ${fieldSchema.label || field}`;
        return false;
      }
    }
    
    // AI validation
    if (fieldSchema.aiValidation && value) {
      try {
        const isValid = await validateWithAI(field, value);
        return isValid;
      } catch (error: any) {
        onError(error);
        return true; // Don't fail validation on AI error
      }
    }
    
    return true;
  };

  /**
   * Validate a field value using AI
   * 
   * @param field Field name
   * @param value Field value
   * @returns Promise<boolean> indicating if validation passed
   */
  const validateWithAI = async (field: string, value: any): Promise<boolean> => {
    const fieldSchema = schema[field];
    
    try {
      // Create a prompt for the AI to validate the field
      const prompt = `
        Validate this ${fieldSchema.type || 'text'} input for a field named "${fieldSchema.label || field}": "${value}"
        
        Field description: ${fieldSchema.description || 'No description provided'}
        
        If it's valid, respond with "VALID".
        If it's invalid, respond with "INVALID: [reason]".
        
        Be concise and specific.
      `;
      
      // Call the AI client to validate the field
      const response = await client.chat([
        { role: 'system', content: 'You are a helpful assistant validating form inputs.' },
        { role: 'user', content: prompt }
      ]);
      
      if (response.startsWith('VALID')) {
        return true;
      } else if (response.startsWith('INVALID:')) {
        errors[field] = response.substring(9).trim();
        
        // Auto-correct if enabled
        if (autoCorrect) {
          await fixWithAI(field);
        }
        
        return false;
      }
      
      return true;
    } catch (error: any) {
      onError(error);
      return true; // Don't fail validation on AI error
    }
  };

  /**
   * Fix a field value using AI
   * 
   * @param field Field name
   */
  const fixWithAI = async (field: string): Promise<void> => {
    const fieldSchema = schema[field];
    const value = formData[field];
    
    try {
      // Create a prompt for the AI to fix the field
      const prompt = `
        Fix this ${fieldSchema.type || 'text'} input for a field named "${fieldSchema.label || field}": "${value}"
        
        The current error is: "${errors[field]}"
        Field description: ${fieldSchema.description || 'No description provided'}
        
        Provide only the corrected value, nothing else.
      `;
      
      // Call the AI client to fix the field
      const response = await client.chat([
        { role: 'system', content: 'You are a helpful assistant fixing form inputs.' },
        { role: 'user', content: prompt }
      ]);
      
      // Update the field value
      formData[field] = response.trim();
      
      // Validate the field again
      await validateField(field);
    } catch (error: any) {
      onError(error);
    }
  };

  /**
   * Reset the form to initial values
   */
  const reset = (): void => {
    // Reset form data
    for (const field in schema) {
      if (initialData[field] !== undefined) {
        formData[field] = initialData[field];
      } else if (schema[field].type === 'checkbox') {
        formData[field] = schema[field].defaultValue || false;
      } else if (schema[field].type === 'select' || schema[field].type === 'radio') {
        formData[field] = schema[field].defaultValue || '';
      } else {
        formData[field] = schema[field].defaultValue || '';
      }
    }
    
    // Clear errors
    for (const field in errors) {
      delete errors[field];
    }
  };

  /**
   * Submit the form
   * 
   * @returns Promise<boolean> indicating if submission was successful
   */
  const submitForm = async (): Promise<boolean> => {
    isLoading.value = true;
    
    try {
      const isValid = await validate();
      return isValid;
    } catch (error: any) {
      onError(error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    validate,
    fixWithAI,
    reset,
    submitForm
  };
}

export default useSmartForm;
