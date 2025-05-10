import React, { useState, useEffect } from 'react';
import { useSmartForm } from '../hooks/useSmartForm';
import { SmartFormSchema, SmartFormData } from '../index';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SmartFormProps {
  schema: SmartFormSchema;
  initialData?: SmartFormData;
  onSubmit?: (data: SmartFormData) => void;
  onChange?: (data: SmartFormData) => void;
  submitButtonText?: string;
  className?: string;
}

export function SmartForm({
  schema,
  initialData = {},
  onSubmit,
  onChange,
  submitButtonText = 'Submit',
  className = ''
}: SmartFormProps) {
  const {
    formData,
    errors,
    handleChange,
    validate,
    fixWithAI,
    reset,
    submitForm
  } = useSmartForm(schema, initialData);
  
  // Update parent component when form data changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await submitForm();
    
    if (isValid && onSubmit) {
      onSubmit(formData);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleChange(e);
  };
  
  const handleSelectChange = (field: string, value: string) => {
    const fakeEvent = {
      target: {
        name: field,
        value
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    handleChange(fakeEvent);
  };
  
  const handleFix = async (field: string) => {
    await fixWithAI(field);
  };
  
  const renderField = (name: string, config: SmartFormSchema[string]) => {
    const { type, label, placeholder, options, required } = config;
    const value = formData[name] || '';
    const hasError = !!errors[name];
    
    const fieldLabel = label || name.charAt(0).toUpperCase() + name.slice(1);
    
    return (
      <div key={name} className="mb-4">
        <Label htmlFor={name} className="mb-1 block">
          {fieldLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {type === 'text' || type === 'email' || type === 'number' || type === 'tel' || type === 'url' ? (
          <Input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            className={hasError ? "border-red-500" : ""}
            onBlur={() => validate(name)}
          />
        ) : type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            className={`flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${hasError ? "border-red-500" : ""}`}
            onBlur={() => validate(name)}
          />
        ) : type === 'select' && options ? (
          <Select
            value={value}
            onValueChange={(value) => handleSelectChange(name, value)}
            onOpenChange={() => validate(name)}
          >
            <SelectTrigger className={hasError ? "border-red-500" : ""}>
              <SelectValue placeholder={placeholder || `Select ${fieldLabel}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        
        {hasError && (
          <div className="mt-1 text-sm text-red-500 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors[name]}</span>
            </div>
            {config.aiValidation && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary text-xs"
                onClick={() => handleFix(name)}
              >
                Fix with AI
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <form onSubmit={handleFormSubmit} className={className}>
      {Object.entries(schema).map(([name, config]) => renderField(name, config))}
      
      <Button type="submit" className="w-full mt-4">
        {submitButtonText}
      </Button>
    </form>
  );
}
