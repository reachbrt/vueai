<template>
  <div class="ai-smart-form" :class="themeClass">
    <h2 v-if="schema.title" class="form-title">{{ schema.title }}</h2>
    <p v-if="schema.description" class="form-description">{{ schema.description }}</p>

    <div v-if="validation === 'ai'" class="validation-mode">
      <span class="ai-badge">AI-Powered Validation</span>
      <p class="ai-description">This form uses AI to analyze your input for better suggestions.</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <div v-for="field in schema.fields" :key="field.name" class="form-field">
        <!-- Text, Email, Password, Number inputs -->
        <template v-if="['text', 'email', 'password', 'number'].includes(field.type)">
          <label :for="field.name">{{ field.label }}</label>
          <input
            :id="field.name"
            :type="field.type"
            :name="field.name"
            v-model="formData[field.name]"
            :required="field.required"
            :placeholder="field.placeholder || ''"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            @blur="validateField(field)"
            @input="validateField(field)"
            :class="{ 'invalid': fieldErrors[field.name], 'valid': fieldValid[field.name] }"
          />
        </template>

        <!-- Textarea -->
        <template v-else-if="field.type === 'textarea'">
          <label :for="field.name">{{ field.label }}</label>
          <textarea
            :id="field.name"
            :name="field.name"
            v-model="formData[field.name]"
            :required="field.required"
            :placeholder="field.placeholder || ''"
            :rows="field.rows || 4"
            @blur="validateField(field)"
            @input="validateField(field)"
            :class="{ 'invalid': fieldErrors[field.name], 'valid': fieldValid[field.name] }"
          ></textarea>
        </template>

        <!-- Select -->
        <template v-else-if="field.type === 'select'">
          <label :for="field.name">{{ field.label }}</label>
          <select
            :id="field.name"
            :name="field.name"
            v-model="formData[field.name]"
            :required="field.required"
            :multiple="field.multiple"
            @change="validateField(field)"
            :class="{ 'invalid': fieldErrors[field.name], 'valid': fieldValid[field.name] }"
          >
            <option v-if="!field.multiple" value="" disabled>{{ field.placeholder || 'Select an option' }}</option>
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </template>

        <!-- Checkbox -->
        <template v-else-if="field.type === 'checkbox'">
          <div class="checkbox-field">
            <input
              :id="field.name"
              type="checkbox"
              :name="field.name"
              v-model="formData[field.name]"
              :required="field.required"
              @change="validateField(field)"
              :class="{ 'invalid': fieldErrors[field.name], 'valid': fieldValid[field.name] }"
            />
            <label :for="field.name">{{ field.label }}</label>
          </div>
        </template>

        <!-- Radio buttons -->
        <template v-else-if="field.type === 'radio'">
          <fieldset>
            <legend>{{ field.label }}</legend>
            <div
              v-for="option in field.options"
              :key="option.value"
              class="radio-option"
            >
              <input
                :id="`${field.name}_${option.value}`"
                type="radio"
                :name="field.name"
                :value="option.value"
                v-model="formData[field.name]"
                :required="field.required"
                @change="validateField(field)"
                :class="{ 'invalid': fieldErrors[field.name], 'valid': fieldValid[field.name] }"
              />
              <label :for="`${field.name}_${option.value}`">{{ option.label }}</label>
            </div>
          </fieldset>
        </template>

        <!-- Date input -->
        <template v-else-if="field.type === 'date'">
          <label :for="field.name">{{ field.label }}</label>
          <input
            :id="field.name"
            type="date"
            :name="field.name"
            v-model="formData[field.name]"
            :required="field.required"
            :min="field.min"
            :max="field.max"
            @blur="validateField(field)"
            @input="validateField(field)"
            :class="{ 'invalid': fieldErrors[field.name], 'valid': fieldValid[field.name] }"
          />
        </template>

        <!-- Error message -->
        <div v-if="fieldErrors[field.name]" class="error-message">
          {{ fieldErrors[field.name] }}
        </div>

        <!-- Valid message -->
        <div v-else-if="fieldValid[field.name] && formData[field.name]" class="valid-message">
          Field is valid
        </div>
      </div>

      <div class="form-actions">
        <button
          v-if="validation === 'ai' && hasErrors"
          type="button"
          class="fix-button"
          @click="fixFormWithAI"
          :disabled="isFixing"
        >
          {{ isFixing ? 'Fixing...' : 'Fix with AI' }}
        </button>
        <button type="submit" class="submit-button" :disabled="isSubmitting || isFixing">
          {{ isSubmitting ? 'Processing...' : submitButtonText }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AiSmartForm',
  props: {
    schema: {
      type: Object,
      required: true
    },
    client: {
      type: Object,
      required: true
    },
    validation: {
      type: String,
      default: 'basic', // 'basic', 'ai', 'none'
      validator: (value) => ['basic', 'ai', 'none'].includes(value)
    },
    theme: {
      type: String,
      default: 'light', // 'light', 'dark'
      validator: (value) => ['light', 'dark'].includes(value)
    },
    submitButtonText: {
      type: String,
      default: 'Submit'
    }
  },
  data() {
    return {
      formData: {},
      fieldErrors: {},
      fieldValid: {},
      isSubmitting: false,
      isFixing: false,
      aiSuggestions: {}
    };
  },
  computed: {
    themeClass() {
      return `theme-${this.theme}`;
    },
    hasErrors() {
      return Object.keys(this.fieldErrors).some(key => this.fieldErrors[key] !== null);
    }
  },
  created() {
    // Initialize form data with empty values
    this.initializeFormData();
  },
  methods: {
    initializeFormData() {
      this.schema.fields.forEach(field => {
        if (field.type === 'checkbox') {
          this.formData[field.name] = field.default || false;
        } else if (field.type === 'select' && field.multiple) {
          this.formData[field.name] = field.default || [];
        } else {
          this.formData[field.name] = field.default || '';
        }
      });
    },
    validateField(field) {
      // Skip validation if empty and not required
      const value = this.formData[field.name];
      if (!field.required && (value === '' || value === null || value === undefined)) {
        this.fieldErrors[field.name] = null;
        this.fieldValid[field.name] = false;
        return true;
      }

      // Skip validation if validation is disabled
      if (this.validation === 'none') {
        return true;
      }

      // Clear previous validation
      this.fieldErrors[field.name] = null;

      // Required field validation
      if (field.required && (value === '' || value === null || value === undefined ||
          (Array.isArray(value) && value.length === 0))) {
        this.fieldErrors[field.name] = `${field.label} is required`;
        this.fieldValid[field.name] = false;
        return false;
      }

      // Pattern validation
      if (field.validation && field.validation.pattern && value) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(value)) {
          this.fieldErrors[field.name] = field.validation.message || `Invalid ${field.label}`;
          this.fieldValid[field.name] = false;
          return false;
        }
      }

      // Additional validations based on field type
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.fieldErrors[field.name] = 'Please enter a valid email address';
          this.fieldValid[field.name] = false;
          return false;
        }
      }

      // Mark as valid only if there's a value
      if (value && value !== '') {
        this.fieldValid[field.name] = true;
      } else {
        this.fieldValid[field.name] = false;
      }

      return true;
    },
    validateForm() {
      let isValid = true;

      this.schema.fields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      console.log('Form validation mode:', this.validation);

      try {
        let result = { ...this.formData };

        // If AI validation is enabled, analyze the form data
        if (this.validation === 'ai' && this.client) {
          console.log('Running AI analysis with client:', this.client);
          try {
            const analysis = await this.analyzeFormWithAI();
            console.log('AI analysis result:', analysis);
            result._aiAnalysis = analysis;
          } catch (error) {
            console.error('AI analysis error:', error);
            result._error = 'Failed to analyze form data with AI';
          }
        } else {
          console.log('Skipping AI analysis, validation mode:', this.validation);
        }

        this.$emit('submit', result);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async analyzeFormWithAI() {
      // Create a prompt for the AI to analyze the form data
      const formDataString = JSON.stringify(this.formData, null, 2);
      const schemaString = JSON.stringify(this.schema, null, 2);

      const prompt = `Analyze this form submission:

Form Schema:
${schemaString}

Submitted Data:
${formDataString}

Please provide a detailed analysis of this form submission. For each field, provide:
1. Completeness assessment (if required fields are filled)
2. Data quality evaluation (is the data appropriate, well-formatted, etc.)
3. Specific suggestions for improvement
4. Any potential security or validation concerns

Format your response as follows for each field:
1. "Field Name": Your detailed analysis of this field.

Keep your analysis concise but thorough. Highlight both positive aspects and areas for improvement.
If a field looks good, say so explicitly.
If there are issues, explain them clearly and provide specific suggestions.`;

      try {
        // Show loading state
        this.isSubmitting = true;

        // Get analysis from AI
        const response = await this.client.complete(prompt, {
          maxTokens: 800
        });

        return response.text;
      } catch (error) {
        console.error('AI analysis error:', error);
        return 'Error analyzing form data. Please try again.';
      } finally {
        // Reset loading state
        this.isSubmitting = false;
      }
    },

    async fixFormWithAI() {
      this.isFixing = true;

      try {
        // Create a prompt for the AI to fix the form data
        const formDataString = JSON.stringify(this.formData, null, 2);
        const schemaString = JSON.stringify(this.schema, null, 2);
        const errorsString = JSON.stringify(this.fieldErrors, null, 2);

        const prompt = `Fix this form submission:

Form Schema:
${schemaString}

Current Form Data:
${formDataString}

Validation Errors:
${errorsString}

Please provide corrected values for the fields with errors. For each field that needs fixing:
1. Analyze what's wrong with the current value
2. Provide a fixed value that would pass validation
3. Explain why the fix works

Return your response as a JSON object with field names as keys and fixed values as values.
For example:
{
  "email": "corrected@example.com",
  "firstName": "John",
  ...
}

Only include fields that need fixing. Do not include fields that are already valid.`;

        // Get suggestions from AI
        const response = await this.client.complete(prompt, {
          maxTokens: 800
        });

        // Parse the response
        const responseText = response.text;
        console.log('AI fix response:', responseText);

        // Extract the JSON object from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const suggestions = JSON.parse(jsonMatch[0]);
            console.log('Parsed suggestions:', suggestions);

            // Apply the suggestions to the form data
            for (const field in suggestions) {
              if (this.formData.hasOwnProperty(field)) {
                this.formData[field] = suggestions[field];

                // Validate the field with the new value
                const fieldObj = this.schema.fields.find(f => f.name === field);
                if (fieldObj) {
                  this.validateField(fieldObj);
                }
              }
            }

            // Show a success message
            alert('Form has been fixed with AI suggestions!');
          } catch (parseError) {
            console.error('Error parsing AI suggestions:', parseError);
            alert('Could not parse AI suggestions. Please try again.');
          }
        } else {
          console.error('No JSON object found in AI response');
          alert('Could not extract suggestions from AI response. Please try again.');
        }
      } catch (error) {
        console.error('AI fix error:', error);
        alert('Error fixing form with AI. Please try again.');
      } finally {
        this.isFixing = false;
      }
    }
  }
};
</script>

<style scoped>
.ai-smart-form {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 100%;
  margin: 0 auto;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.form-description {
  margin-bottom: 1.5rem;
  color: #64748b;
}

.form-field {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.checkbox-field,
.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.checkbox-field label,
.radio-option label {
  margin-bottom: 0;
  cursor: pointer;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.submit-button:hover {
  background-color: #2563eb;
}

.submit-button:active {
  transform: translateY(1px);
}

.submit-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

.fix-button {
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
}

.fix-button::before {
  content: "🪄";
  margin-right: 0.5rem;
}

.fix-button:hover {
  background-color: #059669;
}

.fix-button:active {
  transform: translateY(1px);
}

.fix-button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

/* Validation styles */
input.valid,
textarea.valid,
select.valid {
  border-color: #10b981;
  background-color: rgba(16, 185, 129, 0.05);
}

input.invalid,
textarea.invalid,
select.invalid {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}

.valid-message {
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
}

.valid-message::before {
  content: "✓";
  display: inline-block;
  margin-right: 0.5rem;
  font-weight: bold;
}

.validation-mode {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background-color: #eff6ff;
  border-radius: 0.375rem;
  border-left: 4px solid #3b82f6;
}

.ai-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.ai-description {
  margin: 0;
  font-size: 0.875rem;
  color: #4b5563;
}

/* Theme: Dark */
.theme-dark {
  background-color: #1e293b;
  color: #f1f5f9;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.theme-dark .form-title {
  color: #f8fafc;
}

.theme-dark .form-description {
  color: #cbd5e1;
}

.theme-dark label {
  color: #e2e8f0;
}

.theme-dark input,
.theme-dark textarea,
.theme-dark select {
  background-color: #334155;
  border-color: #475569;
  color: #f8fafc;
}

.theme-dark input:focus,
.theme-dark textarea:focus,
.theme-dark select:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
}

.theme-dark .submit-button {
  background-color: #3b82f6;
}

.theme-dark .submit-button:hover {
  background-color: #2563eb;
}

.theme-dark .submit-button:disabled {
  background-color: #64748b;
}
</style>
