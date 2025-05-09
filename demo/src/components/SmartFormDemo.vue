<template>
  <div class="smartform-demo">
    <h3>Basic Smart Form</h3>
    <AiSmartForm
      :client="aiClient"
      :schema="basicSchema"
      @submit="handleSubmit"
    />

    <h3>Advanced Smart Form</h3>
    <AiSmartForm
      :client="aiClient"
      :schema="advancedSchema"
      :validation="'ai'"
      theme="light"
      @submit="handleAdvancedSubmit"
    />

    <!-- Form Results Section -->
    <div v-if="submittedData" class="results">
      <h3>Form Submitted Successfully</h3>

      <!-- AI Analysis Section - Displayed prominently -->
      <div v-if="submittedData._aiAnalysis" class="ai-analysis">
        <h3>AI Analysis of Your Submission:</h3>
        <div class="analysis-content" v-html="formatAnalysis(submittedData._aiAnalysis)"></div>
      </div>

      <!-- Error Message Section -->
      <div v-if="submittedData._error" class="error-message">
        <h3>Error:</h3>
        <div class="error-content">{{ submittedData._error }}</div>
      </div>

      <!-- Submitted Data Section (Collapsed) -->
      <details class="submitted-data-details">
        <summary>View Submitted Data</summary>
        <pre>{{ JSON.stringify(submittedData._aiAnalysis ? {...submittedData, _aiAnalysis: '(See analysis above)'} : submittedData, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { AiSmartForm } from '../../node_modules/@aivue/smartform';
import { aiClient } from '../ai-client';

export default defineComponent({
  name: 'SmartFormDemo',
  components: {
    AiSmartForm,
  },
  setup() {
    const submittedData = ref<any>(null);

    // Basic form schema
    const basicSchema = {
      title: 'Contact Information',
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          type: 'text',
          required: true
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea'
        }
      ]
    };

    // Advanced form schema
    const advancedSchema = {
      title: 'Registration Form',
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          required: true
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          required: true,
          validation: {
            pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
            message: 'Please enter a valid email address'
          }
        },
        {
          name: 'dob',
          label: 'Date of Birth',
          type: 'date'
        },
        {
          name: 'interests',
          label: 'Interests',
          type: 'select',
          multiple: true,
          options: [
            { value: 'tech', label: 'Technology' },
            { value: 'music', label: 'Music' },
            { value: 'sports', label: 'Sports' },
            { value: 'reading', label: 'Reading' }
          ]
        },
        {
          name: 'subscribe',
          label: 'Subscribe to newsletter',
          type: 'checkbox'
        }
      ]
    };

    const handleSubmit = (data: any) => {
      submittedData.value = data;
      console.log('Basic form submitted:', data);
    };

    const handleAdvancedSubmit = (data: any) => {
      submittedData.value = data;
      console.log('Advanced form submitted:', data);
    };

    // Format the AI analysis to make it more readable
    const formatAnalysis = (analysis: string): string => {
      if (!analysis) return '';

      // Replace numbered points with styled elements
      let formatted = analysis.replace(/(\d+\.\s*"[^"]+"):\s*([^\n]+)/g,
        '<div class="analysis-point"><span class="field-name">$1:</span> <span class="field-analysis">$2</span></div>');

      // Replace newlines with <br> tags
      formatted = formatted.replace(/\n\n/g, '<br><br>');

      // Highlight key phrases
      formatted = formatted.replace(/(improvement|issue|concern|good|excellent|missing|invalid|suggestion)/gi,
        '<span class="highlight">$1</span>');

      return formatted;
    };

    return {
      aiClient,
      basicSchema,
      advancedSchema,
      submittedData,
      handleSubmit,
      handleAdvancedSubmit,
      formatAnalysis
    };
  }
});
</script>

<style scoped>
.smartform-demo {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

h3 {
  margin-bottom: 10px;
  color: #334155;
}

.results {
  margin-top: 20px;
  padding: 15px;
  background-color: #f1f5f9;
  border-radius: 8px;
}

pre {
  white-space: pre-wrap;
  font-family: monospace;
  color: #334155;
  padding: 10px;
  background-color: #e2e8f0;
  border-radius: 4px;
}

.ai-analysis {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.analysis-content {
  white-space: pre-wrap;
  padding: 15px;
  background-color: #dbeafe;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
}

.analysis-point {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.analysis-point:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.field-name {
  font-weight: bold;
  color: #1e40af;
  display: block;
  margin-bottom: 4px;
}

.field-analysis {
  display: block;
  padding-left: 12px;
  border-left: 2px solid #93c5fd;
}

.highlight {
  font-weight: bold;
  color: #2563eb;
  background-color: rgba(59, 130, 246, 0.1);
  padding: 0 4px;
  border-radius: 3px;
}

.submitted-data-details {
  margin-top: 20px;
}

.submitted-data-details summary {
  cursor: pointer;
  padding: 10px;
  background-color: #e2e8f0;
  border-radius: 4px;
  font-weight: bold;
  color: #475569;
}

.submitted-data-details summary:hover {
  background-color: #cbd5e1;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #fef2f2;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
}

.error-content {
  white-space: pre-wrap;
  padding: 10px;
  background-color: #fee2e2;
  border-radius: 4px;
}
</style>