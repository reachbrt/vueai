import { useState, useCallback } from 'react';
import { AIClient } from '@/packages/vueai-core';
import { SmartFormSchema, SmartFormData, SmartFormErrors, UseSmartFormResult } from '../index';

export function useSmartForm(
  schema: SmartFormSchema,
  initialData: SmartFormData = {}
): UseSmartFormResult {
  const [formData, setFormData] = useState<SmartFormData>(initialData);
  const [errors, setErrors] = useState<SmartFormErrors>({});
  
  // Initialize AI client for validation
  const aiClient = new AIClient({
    provider: 'openai',
    model: 'gpt-4o'
  });
  
  // Handle form field changes
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);
  
  // Basic validation without AI
  const basicValidate = useCallback((field: string, value: any): string | null => {
    const fieldSchema = schema[field];
    
    if (!fieldSchema) {
      return null;
    }
    
    const { type, required, min, max } = fieldSchema;
    
    // Check required
    if (required && (value === undefined || value === null || value === '')) {
      return `${field} is required`;
    }
    
    // If not required and empty, skip validation
    if (!required && (value === undefined || value === null || value === '')) {
      return null;
    }
    
    // Type-specific validation
    switch (type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'number':
        if (isNaN(Number(value))) {
          return 'Please enter a valid number';
        }
        if (min !== undefined && Number(value) < min) {
          return `Value must be at least ${min}`;
        }
        if (max !== undefined && Number(value) > max) {
          return `Value must not exceed ${max}`;
        }
        break;
      case 'url':
        try {
          new URL(value);
        } catch {
          return 'Please enter a valid URL';
        }
        break;
    }
    
    return null;
  }, [schema]);
  
  // AI-powered validation
  const aiValidate = useCallback(async (field: string, value: any): Promise<string | null> => {
    try {
      const fieldSchema = schema[field];
      
      // Skip AI validation if not enabled or field is empty and not required
      if (!fieldSchema.aiValidation) {
        return null;
      }
      
      // Generate rules based on schema
      const validationRules = [];
      
      if (fieldSchema.required) {
        validationRules.push('Required field');
      }
      
      if (fieldSchema.type === 'email') {
        validationRules.push('Must be a valid email address');
      } else if (fieldSchema.type === 'number') {
        validationRules.push('Must be a valid number');
        if (fieldSchema.min !== undefined) {
          validationRules.push(`Minimum value: ${fieldSchema.min}`);
        }
        if (fieldSchema.max !== undefined) {
          validationRules.push(`Maximum value: ${fieldSchema.max}`);
        }
      } else if (fieldSchema.type === 'url') {
        validationRules.push('Must be a valid URL');
      }
      
      const result = await aiClient.validateFormField(field, value, validationRules);
      
      return result.isValid ? null : result.errorMessage;
    } catch (error) {
      console.error('AI validation error:', error);
      // Fall back to basic validation
      return basicValidate(field, value);
    }
  }, [schema, aiClient, basicValidate]);
  
  // Validate a single field or all fields
  const validate = useCallback(async (field?: string): Promise<boolean> => {
    // If field is specified, validate only that field
    if (field) {
      const fieldSchema = schema[field];
      
      if (!fieldSchema) {
        return true;
      }
      
      const value = formData[field];
      
      // First run basic validation
      const basicError = basicValidate(field, value);
      
      if (basicError) {
        setErrors(prev => ({
          ...prev,
          [field]: basicError
        }));
        return false;
      }
      
      // If AI validation is enabled, run it
      if (fieldSchema.aiValidation) {
        const aiError = await aiValidate(field, value);
        
        if (aiError) {
          setErrors(prev => ({
            ...prev,
            [field]: aiError
          }));
          return false;
        }
      }
      
      // Clear any existing errors for this field
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      
      return true;
    }
    
    // Validate all fields
    const newErrors: SmartFormErrors = {};
    const fieldsToValidate = Object.keys(schema);
    let isValid = true;
    
    // First run basic validation on all fields
    for (const field of fieldsToValidate) {
      const value = formData[field];
      const basicError = basicValidate(field, value);
      
      if (basicError) {
        newErrors[field] = basicError;
        isValid = false;
      }
    }
    
    // If we have basic errors, return early
    if (!isValid) {
      setErrors(newErrors);
      return false;
    }
    
    // Run AI validation on fields that need it
    for (const field of fieldsToValidate) {
      const fieldSchema = schema[field];
      
      if (fieldSchema.aiValidation) {
        const value = formData[field];
        const aiError = await aiValidate(field, value);
        
        if (aiError) {
          newErrors[field] = aiError;
          isValid = false;
        }
      }
    }
    
    setErrors(newErrors);
    return isValid;
  }, [schema, formData, basicValidate, aiValidate]);
  
  // Fix a field using AI
  const fixWithAI = useCallback(async (field: string): Promise<void> => {
    try {
      const fieldSchema = schema[field];
      const value = formData[field];
      
      if (!fieldSchema || !fieldSchema.aiValidation) {
        return;
      }
      
      // Generate rules based on schema
      const validationRules = [];
      
      if (fieldSchema.required) {
        validationRules.push('Required field');
      }
      
      if (fieldSchema.type === 'email') {
        validationRules.push('Must be a valid email address');
      } else if (fieldSchema.type === 'number') {
        validationRules.push('Must be a valid number');
        if (fieldSchema.min !== undefined) {
          validationRules.push(`Minimum value: ${fieldSchema.min}`);
        }
        if (fieldSchema.max !== undefined) {
          validationRules.push(`Maximum value: ${fieldSchema.max}`);
        }
      } else if (fieldSchema.type === 'url') {
        validationRules.push('Must be a valid URL');
      }
      
      const result = await aiClient.validateFormField(field, value, validationRules);
      
      // If AI has a suggestion, apply it
      if (result.suggestion) {
        setFormData(prev => ({
          ...prev,
          [field]: result.suggestion
        }));
        
        // Clear error for this field
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } catch (error) {
      console.error('AI fix error:', error);
    }
  }, [schema, formData, aiClient]);
  
  // Reset form
  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
  }, [initialData]);
  
  // Submit form
  const submitForm = useCallback(async (): Promise<boolean> => {
    const isValid = await validate();
    return isValid;
  }, [validate]);
  
  return {
    formData,
    errors,
    handleChange,
    validate,
    fixWithAI,
    reset,
    submitForm
  };
}
