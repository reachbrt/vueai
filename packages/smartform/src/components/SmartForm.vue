<template>
  <form 
    class="ai-smartform" 
    :class="{ 'ai-smartform--dark': theme === 'dark' }"
    @submit.prevent="handleSubmit"
  >
    <slot
      :fields="formData"
      :errors="errors"
      :loading="isLoading"
      :submit="handleSubmit"
    >
      <div v-for="(field, key) in schema" :key="key" class="ai-smartform__field">
        <slot 
          :name="key" 
          :field="key" 
          :value="formData[key]" 
          :error="errors[key]" 
          :loading="fieldLoading[key]"
        >
          <div class="ai-smartform__field-wrapper">
            <label v-if="field.label" class="ai-smartform__label">
              {{ field.label }}
              <span v-if="field.required" class="ai-smartform__required">*</span>
            </label>
            
            <div class="ai-smartform__input-wrapper">
              <!-- Text input -->
              <input 
                v-if="field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number'"
                :type="field.type"
                :value="formData[key]"
                @input="handleFieldChange(key, $event.target.value)"
                @blur="handleFieldBlur(key)"
                :placeholder="field.placeholder"
                :disabled="disabled || isLoading || fieldLoading[key]"
                class="ai-smartform__input"
                :class="{ 'ai-smartform__input--error': errors[key] }"
              />
              
              <!-- Textarea -->
              <textarea 
                v-else-if="field.type === 'textarea'"
                :value="formData[key]"
                @input="handleFieldChange(key, $event.target.value)"
                @blur="handleFieldBlur(key)"
                :placeholder="field.placeholder"
                :disabled="disabled || isLoading || fieldLoading[key]"
                class="ai-smartform__textarea"
                :class="{ 'ai-smartform__textarea--error': errors[key] }"
              ></textarea>
              
              <!-- Select -->
              <select 
                v-else-if="field.type === 'select'"
                :value="formData[key]"
                @input="handleFieldChange(key, $event.target.value)"
                @blur="handleFieldBlur(key)"
                :disabled="disabled || isLoading || fieldLoading[key]"
                class="ai-smartform__select"
                :class="{ 'ai-smartform__select--error': errors[key] }"
              >
                <option v-if="field.placeholder" value="" disabled>{{ field.placeholder }}</option>
                <option 
                  v-for="option in field.options" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              
              <!-- Checkbox -->
              <div 
                v-else-if="field.type === 'checkbox'"
                class="ai-smartform__checkbox-wrapper"
              >
                <input 
                  type="checkbox"
                  :checked="formData[key]"
                  @input="handleFieldChange(key, $event.target.checked)"
                  @blur="handleFieldBlur(key)"
                  :disabled="disabled || isLoading || fieldLoading[key]"
                  class="ai-smartform__checkbox"
                  :class="{ 'ai-smartform__checkbox--error': errors[key] }"
                />
                <span v-if="field.placeholder" class="ai-smartform__checkbox-label">{{ field.placeholder }}</span>
              </div>
              
              <!-- Radio buttons -->
              <div 
                v-else-if="field.type === 'radio'"
                class="ai-smartform__radio-group"
              >
                <div 
                  v-for="option in field.options" 
                  :key="option.value"
                  class="ai-smartform__radio-wrapper"
                >
                  <input 
                    type="radio"
                    :name="key"
                    :value="option.value"
                    :checked="formData[key] === option.value"
                    @input="handleFieldChange(key, option.value)"
                    @blur="handleFieldBlur(key)"
                    :disabled="disabled || isLoading || fieldLoading[key]"
                    class="ai-smartform__radio"
                    :class="{ 'ai-smartform__radio--error': errors[key] }"
                  />
                  <span class="ai-smartform__radio-label">{{ option.label }}</span>
                </div>
              </div>
              
              <!-- Default fallback -->
              <input 
                v-else
                type="text"
                :value="formData[key]"
                @input="handleFieldChange(key, $event.target.value)"
                @blur="handleFieldBlur(key)"
                :placeholder="field.placeholder"
                :disabled="disabled || isLoading || fieldLoading[key]"
                class="ai-smartform__input"
                :class="{ 'ai-smartform__input--error': errors[key] }"
              />
              
              <!-- Loading indicator -->
              <div v-if="fieldLoading[key]" class="ai-smartform__field-loading">
                <slot name="field-loading">
                  <div class="ai-smartform__spinner"></div>
                </slot>
              </div>
              
              <!-- AI fix button -->
              <button 
                v-if="field.aiValidation && errors[key] && field.selfHeal"
                type="button"
                @click="fixWithAI(key)"
                class="ai-smartform__fix-button"
                :disabled="disabled || isLoading || fieldLoading[key]"
              >
                Fix with AI
              </button>
            </div>
            
            <!-- Error message -->
            <div v-if="errors[key]" class="ai-smartform__error">
              {{ errors[key] }}
            </div>
          </div>
        </slot>
      </div>
      
      <!-- Submit button -->
      <div class="ai-smartform__actions">
        <slot name="actions" :submit="handleSubmit" :loading="isLoading">
          <button 
            type="submit" 
            class="ai-smartform__submit"
            :disabled="disabled || isLoading"
          >
            <span v-if="isLoading" class="ai-smartform__submit-loading">
              <slot name="submit-loading">
                <div class="ai-smartform__spinner"></div>
                <span>{{ loadingText }}</span>
              </slot>
            </span>
            <span v-else>{{ submitText }}</span>
          </button>
        </slot>
      </div>
    </slot>
    
    <!-- Form-level error -->
    <div v-if="formError" class="ai-smartform__form-error">
      <slot name="form-error" :error="formError">
        {{ formError }}
      </slot>
    </div>
  </form>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue';
import { useSmartForm } from '../composables/useSmartForm';

export default {
  name: 'SmartForm',
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    client: {
      type: Object,
      required: true
    },
    schema: {
      type: Object,
      default: () => ({})
    },
    validationMode: {
      type: String,
      default: 'onChange',
      validator: (value) => ['onChange', 'onBlur', 'onSubmit'].includes(value)
    },
    autoCorrect: {
      type: Boolean,
      default: false
    },
    feedbackDelay: {
      type: Number,
      default: 500
    },
    theme: {
      type: String,
      default: 'light',
      validator: (value) => ['light', 'dark'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: 'Submit'
    },
    loadingText: {
      type: String,
      default: 'Submitting...'
    }
  },
  emits: [
    'update:modelValue',
    'submit',
    'validation-error',
    'validation-success',
    'field-change',
    'field-blur',
    'error'
  ],
  setup(props, { emit }) {
    const formError = ref(null);
    const fieldLoading = reactive({});
    
    const options = computed(() => ({
      client: props.client,
      schema: props.schema,
      initialData: props.modelValue,
      validationMode: props.validationMode,
      autoCorrect: props.autoCorrect,
      feedbackDelay: props.feedbackDelay,
      onError: (error) => {
        formError.value = error.message;
        emit('error', error);
      }
    }));
    
    const {
      formData,
      errors,
      isLoading,
      handleChange,
      validate,
      fixWithAI: fixFieldWithAI,
      reset,
      submitForm
    } = useSmartForm(options.value);
    
    // Update modelValue when formData changes
    watch(formData, (newValue) => {
      emit('update:modelValue', newValue);
    }, { deep: true });
    
    // Update formData when modelValue changes
    watch(() => props.modelValue, (newValue) => {
      Object.keys(newValue).forEach(key => {
        if (formData[key] !== newValue[key]) {
          formData[key] = newValue[key];
        }
      });
    }, { deep: true });
    
    const handleFieldChange = (field, value) => {
      handleChange(field, value);
      emit('field-change', { field, value });
      
      if (props.validationMode === 'onChange') {
        validate(field);
      }
    };
    
    const handleFieldBlur = (field) => {
      emit('field-blur', { field, value: formData[field] });
      
      if (props.validationMode === 'onBlur') {
        validate(field);
      }
    };
    
    const fixWithAI = async (field) => {
      fieldLoading[field] = true;
      try {
        await fixFieldWithAI(field);
      } finally {
        fieldLoading[field] = false;
      }
    };
    
    const handleSubmit = async () => {
      formError.value = null;
      
      try {
        const isValid = await submitForm();
        
        if (isValid) {
          emit('submit', formData);
          emit('validation-success', formData);
        } else {
          emit('validation-error', errors);
        }
      } catch (error) {
        formError.value = error.message;
        emit('error', error);
        emit('validation-error', errors);
      }
    };
    
    return {
      formData,
      errors,
      isLoading,
      formError,
      fieldLoading,
      handleFieldChange,
      handleFieldBlur,
      fixWithAI,
      handleSubmit
    };
  }
};
</script>

<style>
.ai-smartform {
  font-family: var(--aivue-smartform-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
  color: var(--aivue-smartform-text, #333333);
  width: 100%;
}

.ai-smartform--dark {
  --aivue-smartform-bg: #1e1e1e;
  --aivue-smartform-text: #f0f0f0;
  --aivue-smartform-border: #444444;
  --aivue-smartform-input-bg: #2d2d2d;
  --aivue-smartform-input-text: #f0f0f0;
  --aivue-smartform-error: #f44336;
  --aivue-smartform-button-bg: #4a6da7;
  --aivue-smartform-button-text: #ffffff;
  --aivue-smartform-button-hover-bg: #5d80ba;
  --aivue-smartform-fix-button-bg: #2d2d2d;
  --aivue-smartform-fix-button-text: #4a6da7;
}

.ai-smartform__field {
  margin-bottom: 20px;
}

.ai-smartform__field-wrapper {
  position: relative;
}

.ai-smartform__label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  font-size: 14px;
}

.ai-smartform__required {
  color: var(--aivue-smartform-error, #f44336);
  margin-left: 2px;
}

.ai-smartform__input-wrapper {
  position: relative;
}

.ai-smartform__input,
.ai-smartform__textarea,
.ai-smartform__select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--aivue-smartform-border, #e0e0e0);
  border-radius: var(--aivue-smartform-border-radius, 4px);
  background-color: var(--aivue-smartform-input-bg, #ffffff);
  color: var(--aivue-smartform-input-text, #333333);
  font-size: 14px;
  line-height: 1.5;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.ai-smartform__textarea {
  min-height: 100px;
  resize: vertical;
}

.ai-smartform__input:focus,
.ai-smartform__textarea:focus,
.ai-smartform__select:focus {
  outline: none;
  border-color: var(--aivue-smartform-focus-border, #2196f3);
  box-shadow: 0 0 0 2px var(--aivue-smartform-focus-shadow, rgba(33, 150, 243, 0.2));
}

.ai-smartform__input--error,
.ai-smartform__textarea--error,
.ai-smartform__select--error {
  border-color: var(--aivue-smartform-error, #f44336);
}

.ai-smartform__checkbox-wrapper,
.ai-smartform__radio-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.ai-smartform__checkbox,
.ai-smartform__radio {
  margin-right: 8px;
}

.ai-smartform__checkbox-label,
.ai-smartform__radio-label {
  font-size: 14px;
}

.ai-smartform__field-loading {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.ai-smartform__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--aivue-smartform-spinner, #e0e0e0);
  border-top-color: var(--aivue-smartform-spinner-active, #2196f3);
  border-radius: 50%;
  animation: ai-smartform-spin 0.8s linear infinite;
}

@keyframes ai-smartform-spin {
  to { transform: rotate(360deg); }
}

.ai-smartform__error {
  margin-top: 4px;
  color: var(--aivue-smartform-error, #f44336);
  font-size: 12px;
}

.ai-smartform__fix-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--aivue-smartform-fix-button-bg, #f5f5f5);
  color: var(--aivue-smartform-fix-button-text, #2196f3);
  border: none;
  border-radius: var(--aivue-smartform-border-radius, 4px);
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ai-smartform__fix-button:hover {
  background-color: var(--aivue-smartform-fix-button-hover-bg, #e0e0e0);
}

.ai-smartform__actions {
  margin-top: 24px;
}

.ai-smartform__submit {
  background-color: var(--aivue-smartform-button-bg, #2196f3);
  color: var(--aivue-smartform-button-text, #ffffff);
  border: none;
  border-radius: var(--aivue-smartform-border-radius, 4px);
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ai-smartform__submit:hover:not(:disabled) {
  background-color: var(--aivue-smartform-button-hover-bg, #1976d2);
}

.ai-smartform__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.ai-smartform__submit-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-smartform__submit-loading .ai-smartform__spinner {
  margin-right: 8px;
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
}

.ai-smartform__form-error {
  margin-top: 16px;
  padding: 12px;
  background-color: var(--aivue-smartform-error-bg, rgba(244, 67, 54, 0.1));
  color: var(--aivue-smartform-error, #f44336);
  border-radius: var(--aivue-smartform-border-radius, 4px);
  font-size: 14px;
}
</style>
