<template>
  <div class="extracted-data-form">
    <div class="form-header">
      <h3>{{ title }}</h3>
      <p v-if="description" class="form-description">{{ description }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-content">
      <div
        v-for="(field, index) in formFields"
        :key="index"
        class="form-field"
        :class="`field-${field.type}`"
      >
        <label :for="`field-${index}`" class="field-label">
          {{ field.label }}
          <span v-if="field.required" class="required-mark">*</span>
          <span v-if="field.confidence" class="confidence-indicator" :class="getConfidenceClass(field.confidence)">
            {{ Math.round(field.confidence * 100) }}% confidence
          </span>
        </label>

        <!-- Text input -->
        <input
          v-if="field.type === 'text' || field.type === 'email' || field.type === 'tel'"
          :id="`field-${index}`"
          :type="field.type"
          v-model="formData[field.name]"
          :placeholder="field.placeholder"
          :required="field.required"
          class="field-input"
        />

        <!-- Number input -->
        <input
          v-else-if="field.type === 'number'"
          :id="`field-${index}`"
          type="number"
          v-model.number="formData[field.name]"
          :placeholder="field.placeholder"
          :required="field.required"
          :step="field.step || 'any'"
          class="field-input"
        />

        <!-- Date input -->
        <input
          v-else-if="field.type === 'date'"
          :id="`field-${index}`"
          type="date"
          v-model="formData[field.name]"
          :required="field.required"
          class="field-input"
        />

        <!-- Textarea -->
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="`field-${index}`"
          v-model="formData[field.name]"
          :placeholder="field.placeholder"
          :required="field.required"
          :rows="field.rows || 3"
          class="field-textarea"
        ></textarea>

        <!-- Select -->
        <select
          v-else-if="field.type === 'select'"
          :id="`field-${index}`"
          v-model="formData[field.name]"
          :required="field.required"
          class="field-select"
        >
          <option value="">Select {{ field.label }}</option>
          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <div v-if="field.helpText" class="field-help">
          {{ field.helpText }}
        </div>
      </div>

      <div class="form-actions">
        <button
          type="button"
          @click="handleReset"
          class="btn btn-secondary"
          :disabled="isSubmitting"
        >
          Reset
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : submitButtonText }}
        </button>
      </div>
    </form>

    <div v-if="submitMessage" class="submit-message" :class="submitMessageType">
      {{ submitMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { ExtractedData } from '../utils/entityExtraction';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'textarea' | 'select';
  value?: any;
  placeholder?: string;
  required?: boolean;
  confidence?: number;
  helpText?: string;
  options?: Array<{ label: string; value: any }>;
  rows?: number;
  step?: string;
}

interface Props {
  title?: string;
  description?: string;
  fields?: FormField[];
  extractedData?: ExtractedData;
  autoGenerateFields?: boolean;
  submitButtonText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Extracted Data Form',
  description: 'Review and edit the extracted information',
  autoGenerateFields: true,
  submitButtonText: 'Submit'
});

const emit = defineEmits<{
  'submit': [data: Record<string, any>];
  'reset': [];
  'field-change': [field: string, value: any];
}>();

const formData = reactive<Record<string, any>>({});
const isSubmitting = ref(false);
const submitMessage = ref('');
const submitMessageType = ref<'success' | 'error'>('success');

const formFields = ref<FormField[]>([]);

// Initialize form fields
const initializeFields = () => {
  if (props.fields && props.fields.length > 0) {
    formFields.value = props.fields;
  } else if (props.autoGenerateFields && props.extractedData) {
    formFields.value = generateFieldsFromExtractedData(props.extractedData);
  }

  // Initialize form data with field values
  formFields.value.forEach(field => {
    formData[field.name] = field.value || '';
  });
};

// Generate form fields from extracted data
const generateFieldsFromExtractedData = (data: ExtractedData): FormField[] => {
  const fields: FormField[] = [];

  // Add date fields
  data.dates.forEach((date, index) => {
    fields.push({
      name: `date_${index}`,
      label: `Date ${index + 1}`,
      type: 'date',
      value: parseDate(date.value),
      confidence: date.confidence,
      required: false
    });
  });

  // Add amount fields
  data.amounts.forEach((amount, index) => {
    fields.push({
      name: `amount_${index}`,
      label: `Amount ${index + 1}`,
      type: 'number',
      value: parseAmount(amount.value),
      confidence: amount.confidence,
      required: false,
      step: '0.01'
    });
  });

  // Add name fields
  data.names.forEach((name, index) => {
    fields.push({
      name: `name_${index}`,
      label: `Name ${index + 1}`,
      type: 'text',
      value: name.value,
      confidence: name.confidence,
      required: false
    });
  });

  // Add email fields
  data.emails.forEach((email, index) => {
    fields.push({
      name: `email_${index}`,
      label: `Email ${index + 1}`,
      type: 'email',
      value: email.value,
      confidence: email.confidence,
      required: false
    });
  });

  // Add phone fields
  data.phones.forEach((phone, index) => {
    fields.push({
      name: `phone_${index}`,
      label: `Phone ${index + 1}`,
      type: 'tel',
      value: phone.value,
      confidence: phone.confidence,
      required: false
    });
  });

  // Add address fields
  data.addresses.forEach((address, index) => {
    fields.push({
      name: `address_${index}`,
      label: `Address ${index + 1}`,
      type: 'textarea',
      value: address.value,
      confidence: address.confidence,
      required: false,
      rows: 2
    });
  });

  // Add invoice number fields
  data.invoiceNumbers.forEach((invoice, index) => {
    fields.push({
      name: `invoice_number_${index}`,
      label: `Invoice Number ${index + 1}`,
      type: 'text',
      value: invoice.value,
      confidence: invoice.confidence,
      required: false
    });
  });

  // Add tax ID fields
  data.taxIds.forEach((taxId, index) => {
    fields.push({
      name: `tax_id_${index}`,
      label: `Tax ID ${index + 1}`,
      type: 'text',
      value: taxId.value,
      confidence: taxId.confidence,
      required: false
    });
  });

  return fields;
};

// Parse date string to YYYY-MM-DD format
const parseDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

// Parse amount string to number
const parseAmount = (amountStr: string): number => {
  try {
    const cleaned = amountStr.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  } catch {
    return 0;
  }
};

const getConfidenceClass = (confidence: number): string => {
  if (confidence >= 0.9) return 'high';
  if (confidence >= 0.7) return 'medium';
  return 'low';
};

const handleSubmit = () => {
  isSubmitting.value = true;
  submitMessage.value = '';

  try {
    emit('submit', { ...formData });
    submitMessage.value = 'Form submitted successfully!';
    submitMessageType.value = 'success';
  } catch (error) {
    submitMessage.value = 'Error submitting form. Please try again.';
    submitMessageType.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};

const handleReset = () => {
  Object.keys(formData).forEach(key => {
    const field = formFields.value.find(f => f.name === key);
    formData[key] = field?.value || '';
  });
  submitMessage.value = '';
  emit('reset');
};

// Watch for changes in extracted data
watch(() => props.extractedData, () => {
  initializeFields();
}, { immediate: true, deep: true });

// Watch for changes in fields
watch(() => props.fields, () => {
  initializeFields();
}, { immediate: true, deep: true });

// Watch for form data changes
watch(formData, (newData) => {
  Object.keys(newData).forEach(key => {
    emit('field-change', key, newData[key]);
  });
});

// Initialize on mount
initializeFields();
</script>

<style scoped>
.extracted-data-form {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-header {
  padding: 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.form-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.form-description {
  color: #718096;
  margin: 0;
}

.form-content {
  padding: 1.5rem;
}

.form-field {
  margin-bottom: 1.5rem;
}

.field-label {
  display: block;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.required-mark {
  color: #f56565;
  margin-left: 0.25rem;
}

.confidence-indicator {
  margin-left: 0.5rem;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.confidence-indicator.high {
  background: #c6f6d5;
  color: #22543d;
}

.confidence-indicator.medium {
  background: #feebc8;
  color: #7c2d12;
}

.confidence-indicator.low {
  background: #fed7d7;
  color: #742a2a;
}

.field-input,
.field-textarea,
.field-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.field-textarea {
  resize: vertical;
  font-family: inherit;
}

.field-help {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #718096;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4299e1;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3182ce;
}

.btn-secondary {
  background: #edf2f7;
  color: #2d3748;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.submit-message {
  margin: 1.5rem;
  padding: 1rem;
  border-radius: 6px;
  font-weight: 500;
}

.submit-message.success {
  background: #c6f6d5;
  color: #22543d;
}

.submit-message.error {
  background: #fed7d7;
  color: #742a2a;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .extracted-data-form {
    background: #1a202c;
  }

  .form-header {
    background: #2d3748;
    border-bottom-color: #4a5568;
  }

  .form-header h3,
  .field-label {
    color: #f7fafc;
  }

  .form-description,
  .field-help {
    color: #cbd5e0;
  }

  .field-input,
  .field-textarea,
  .field-select {
    background: #2d3748;
    border-color: #4a5568;
    color: #f7fafc;
  }

  .field-input:focus,
  .field-textarea:focus,
  .field-select:focus {
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
  }

  .form-actions {
    border-top-color: #4a5568;
  }

  .btn-secondary {
    background: #4a5568;
    color: #f7fafc;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #718096;
  }
}
</style>


