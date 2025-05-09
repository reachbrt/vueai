// SmartForm package implementation
import { h, ref, defineComponent, computed, watch } from 'vue';

export const AiSmartForm = defineComponent({
  name: 'AiSmartForm',
  props: {
    client: Object,
    schema: Object,
    validation: {
      type: [Boolean, String],
      default: false
    },
    theme: String
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const formData = ref({});
    const errors = ref({});
    const isSubmitting = ref(false);

    // Initialize form data based on schema
    const initializeForm = () => {
      if (!props.schema || !props.schema.fields) return;

      const initialData = {};
      props.schema.fields.forEach(field => {
        // Set default values based on field type
        if (field.type === 'checkbox') {
          initialData[field.name] = false;
        } else if (field.type === 'select' && field.multiple) {
          initialData[field.name] = [];
        } else {
          initialData[field.name] = '';
        }
      });

      formData.value = initialData;
    };

    // Call initialize when component is created
    initializeForm();

    // Update form data when schema changes
    const schemaWatcher = computed(() => {
      return props.schema;
    });

    // Watch for schema changes
    watch(schemaWatcher, () => {
      if (props.schema) {
        initializeForm();
      }
    });

    // Field validation states
    const fieldStates = ref({});

    // Handle input changes
    const handleInput = async (field, event) => {
      let value;

      if (field.type === 'checkbox') {
        value = event.target.checked;
      } else if (field.type === 'select' && field.multiple) {
        // Handle multiple select
        const selectedOptions = Array.from(event.target.options)
          .filter(option => option.selected)
          .map(option => option.value);
        value = selectedOptions;
      } else {
        value = event.target.value;
      }

      formData.value[field.name] = value;

      // Clear error when field is modified
      if (errors.value[field.name]) {
        errors.value[field.name] = null;
      }

      // Reset field state
      fieldStates.value[field.name] = { status: 'default' };

      // If AI validation is enabled and we have a client, perform live validation
      if (props.validation === 'ai' && props.client && typeof props.client.chat === 'function' && value) {
        // Don't validate on every keystroke - wait until field loses focus or has substantial content
        if (field.type !== 'text' || value.length > 5) {
          await validateFieldWithAI(field, value);
        }
      }
    };

    // Validate a single field with AI
    const validateFieldWithAI = async (field, value) => {
      try {
        // Set field to loading state
        fieldStates.value[field.name] = { status: 'loading' };

        // Create a prompt for the AI to validate just this field
        const prompt = `
          Please validate this form field:

          Field name: "${field.name}"
          Field label: "${field.label}"
          Field type: "${field.type}"
          Field value: "${value}"

          Respond with a JSON object with the following structure:
          {
            "status": "valid" | "suggestion" | "error",
            "message": "Your validation message here"
          }

          Use "valid" for values that are completely acceptable.
          Use "suggestion" for values that are acceptable but could be improved.
          Use "error" for values that are problematic or invalid.

          Provide a helpful, concise message explaining your assessment.
          Respond ONLY with the JSON object, no additional text.
        `;

        // Call the AI
        console.log(`Validating field "${field.name}" with value "${value}"`);
        const response = await props.client.chat([
          { role: 'system', content: 'You are a form validation assistant. Respond only with the requested JSON format.' },
          { role: 'user', content: prompt }
        ]);

        if (!response || !response.content) {
          console.error('Invalid AI validation response:', response);
          fieldStates.value[field.name] = { status: 'default' };
          return;
        }

        // Parse the AI response
        try {
          // Extract JSON from the response
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const validationResult = JSON.parse(jsonMatch[0]);
            console.log(`Validation result for field "${field.name}":`, validationResult);

            // Update field state
            fieldStates.value[field.name] = {
              status: validationResult.status || 'default',
              message: validationResult.message || ''
            };

            // If it's an error, also update the errors object
            if (validationResult.status === 'error') {
              errors.value[field.name] = validationResult.message;
            }
          } else {
            console.log('No JSON found in AI validation response');
            fieldStates.value[field.name] = { status: 'default' };
          }
        } catch (parseError) {
          console.error('Error parsing AI validation response:', parseError);
          fieldStates.value[field.name] = { status: 'default' };
        }
      } catch (error) {
        console.error(`Error validating field "${field.name}":`, error);
        fieldStates.value[field.name] = { status: 'default' };
      }
    };

    // Validate form
    const validateForm = async () => {
      // Skip validation if validation is false
      if (props.validation === false) return true;

      // Determine if we should use AI validation
      const useAiValidation = props.validation === 'ai';

      const newErrors = {};
      let isValid = true;

      // Basic validation first
      props.schema.fields.forEach(field => {
        // Check required fields
        if (field.required && !formData.value[field.name]) {
          newErrors[field.name] = `${field.label} is required`;
          isValid = false;
        }

        // Check pattern validation
        if (field.validation && field.validation.pattern && formData.value[field.name]) {
          const pattern = new RegExp(field.validation.pattern);
          if (!pattern.test(formData.value[field.name])) {
            newErrors[field.name] = field.validation.message || `Invalid ${field.label}`;
            isValid = false;
          }
        }
      });

      // If basic validation passes and AI client is available, perform AI validation
      if (isValid && props.client && typeof props.client.chat === 'function' && useAiValidation) {
        try {
          isSubmitting.value = true;
          console.log('Using AI for advanced form validation');

          // Create a prompt for the AI to validate the form data
          const formDataStr = JSON.stringify(formData.value, null, 2);
          const schemaStr = JSON.stringify(props.schema, null, 2);

          const prompt = `
            I need to validate this form data against the schema:

            Schema:
            ${schemaStr}

            Form Data:
            ${formDataStr}

            Please validate the data and return a JSON object with any validation errors.
            The format should be: { "fieldName": "error message" }
            If there are no errors, return an empty object {}.
          `;

          // Call the AI
          console.log('Calling AI for form validation with prompt:', prompt);

          try {
            const response = await props.client.chat([
              { role: 'system', content: 'You are a form validation assistant. Respond only with valid JSON.' },
              { role: 'user', content: prompt }
            ]);

            console.log('Received AI validation response:', response);

            if (!response || !response.content) {
              console.error('Invalid AI validation response:', response);
              return;
            }

            // Parse the AI response
            try {
              // Extract JSON from the response (in case the AI includes explanatory text)
              const jsonMatch = response.content.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                console.log('Extracted JSON from AI response:', jsonMatch[0]);
                const aiErrors = JSON.parse(jsonMatch[0]);

                // Add AI validation errors
                for (const [field, message] of Object.entries(aiErrors)) {
                  console.log(`Adding AI validation error for field ${field}:`, message);
                  newErrors[field] = message;
                  isValid = false;
                }
              } else {
                console.log('No JSON found in AI response');
              }
            } catch (parseError) {
              console.error('Error parsing AI validation response:', parseError);
              // Don't fail validation due to parsing error
            }
          } catch (aiError) {
            console.error('Error during AI validation call:', aiError);
            // Don't fail validation due to AI error
          }
        } catch (error) {
          console.error('Error during AI validation:', error);
          // Don't fail validation due to AI error
        } finally {
          isSubmitting.value = false;
        }
      }

      errors.value = newErrors;
      return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Form submitted, validating...');

      isSubmitting.value = true;
      const isValid = await validateForm();

      if (isValid) {
        console.log('Form validation passed, processing submission...');

        try {
          // If client is available, use it to enhance the form data
          if (props.client && typeof props.client.chat === 'function') {
            console.log('Using AI to enhance form submission');

            // Create a prompt for the AI to analyze the form data
            const formDataStr = JSON.stringify(formData.value, null, 2);
            const prompt = `
              I have received the following form data:
              ${formDataStr}

              Please analyze this data and provide any insights or suggestions for improvement.
              If there are any potential issues with the data, please highlight them.
              Return your analysis in a concise, helpful format.
            `;

            // Call the AI
            console.log('Sending form data to AI for analysis:', formDataStr);

            try {
              // Make the API call
              const response = await props.client.chat([
                { role: 'system', content: 'You are a helpful assistant that analyzes form data.' },
                { role: 'user', content: prompt }
              ]);

              console.log('Received AI response for form analysis:', response);

              if (!response || !response.content) {
                throw new Error('Invalid response from AI: ' + JSON.stringify(response));
              }

              // Create enhanced data with AI analysis
              const enhancedData = {
                ...formData.value,
                _aiAnalysis: response.content
              };

              // Emit the enhanced data
              emit('submit', enhancedData);
              console.log('Form submitted with AI enhancement:', enhancedData);
            } catch (aiError) {
              console.error('Error getting AI analysis:', aiError);

              // Submit anyway with error information
              emit('submit', {
                ...formData.value,
                _error: 'AI analysis failed: ' + (aiError.message || 'Unknown error')
              });
            }
          } else {
            // No AI client available, just submit the form data as is
            console.log('Submitting form without AI enhancement');
            emit('submit', { ...formData.value });
          }
        } catch (error) {
          console.error('Error during form submission:', error);
          // Submit anyway even if AI enhancement fails
          emit('submit', {
            ...formData.value,
            _error: 'Form submission error: ' + (error.message || 'Unknown error')
          });
        } finally {
          isSubmitting.value = false;
        }
      } else {
        console.log('Form validation failed');
        isSubmitting.value = false;
      }
    };

    // Render form fields based on type
    const renderField = (field) => {
      // Get field state
      const fieldState = fieldStates.value[field.name] || { status: 'default' };

      // Determine field class based on validation status
      const fieldClass = [
        'ai-form-field',
        fieldState.status === 'valid' ? 'field-valid' : '',
        fieldState.status === 'suggestion' ? 'field-suggestion' : '',
        fieldState.status === 'error' ? 'field-error' : '',
        fieldState.status === 'loading' ? 'field-loading' : ''
      ].filter(Boolean).join(' ');

      const fieldProps = {
        name: field.name,
        id: `field-${field.name}`,
        value: formData.value[field.name],
        required: field.required,
        disabled: isSubmitting.value || fieldState.status === 'loading',
        onInput: (e) => handleInput(field, e),
        onChange: (e) => handleInput(field, e),
        onBlur: (e) => {
          // Validate on blur if we have content and AI validation is enabled
          if (e.target.value && props.validation === 'ai' && props.client) {
            validateFieldWithAI(field, e.target.value);
          }
        },
        class: fieldState.status ? `input-${fieldState.status}` : ''
      };

      let inputElement;

      switch (field.type) {
        case 'textarea':
          inputElement = h('textarea', {
            ...fieldProps,
            rows: 4
          });
          break;

        case 'select':
          inputElement = h('select', {
            ...fieldProps,
            multiple: field.multiple
          }, field.options.map(option =>
            h('option', { value: option.value }, option.label)
          ));
          break;

        case 'checkbox':
          inputElement = h('div', { class: 'checkbox-wrapper' }, [
            h('input', {
              ...fieldProps,
              type: 'checkbox',
              checked: formData.value[field.name] || false,
              value: 'true',
              onChange: (e) => {
                formData.value[field.name] = e.target.checked;
                // Clear error when field is modified
                if (errors.value[field.name]) {
                  errors.value[field.name] = null;
                }
                // Validate checkbox on change
                if (props.validation === 'ai' && props.client) {
                  validateFieldWithAI(field, e.target.checked);
                }
              }
            }),
            h('span', { class: 'checkbox-label' }, field.label)
          ]);
          break;

        default:
          inputElement = h('input', {
            ...fieldProps,
            type: field.type || 'text',
            placeholder: field.placeholder
          });
      }

      // Create validation indicator and message
      const validationElements = [];

      // Add validation message if available
      if (fieldState.message && fieldState.status !== 'default') {
        validationElements.push(
          h('div', { class: `validation-message ${fieldState.status}-message` }, fieldState.message)
        );
      }

      // Add error message if available (from basic validation)
      if (errors.value[field.name] && !validationElements.length) {
        validationElements.push(
          h('div', { class: 'validation-message error-message' }, errors.value[field.name])
        );
      }

      // Create loading indicator
      const loadingIndicator = fieldState.status === 'loading'
        ? h('div', { class: 'loading-indicator' }, 'Validating...')
        : null;

      return h('div', { class: fieldClass }, [
        // Label (except for checkboxes)
        field.type !== 'checkbox' ? h('label', { for: `field-${field.name}` }, [
          field.label,
          // Add validation icon
          fieldState.status === 'valid' ? h('span', { class: 'validation-icon valid-icon' }, '✓') : null,
          fieldState.status === 'suggestion' ? h('span', { class: 'validation-icon suggestion-icon' }, '!') : null,
          fieldState.status === 'error' ? h('span', { class: 'validation-icon error-icon' }, '✗') : null,
          loadingIndicator
        ]) : null,

        // Input element
        inputElement,

        // Validation messages
        ...validationElements
      ]);
    };

    return () => {
      if (!props.schema || !props.schema.fields) {
        return h('div', { class: 'ai-smart-form-error' }, 'No form schema provided');
      }

      return h('form', {
        class: ['ai-smart-form', props.theme],
        onSubmit: handleSubmit
      }, [
        props.schema.title ? h('h3', { class: 'form-title' }, props.schema.title) : null,
        ...props.schema.fields.map(field => renderField(field)),
        h('div', { class: 'form-actions' }, [
          h('button', {
            type: 'submit',
            disabled: isSubmitting.value,
            class: 'submit-button'
          }, isSubmitting.value ? 'Submitting...' : 'Submit')
        ])
      ]);
    };
  }
});
