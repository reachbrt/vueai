// Autosuggest package implementation
import { h, ref, defineComponent, watch } from 'vue';

export const AiAutosuggest = defineComponent({
  name: 'AiAutosuggest',
  props: {
    client: Object,
    placeholder: String,
    modelValue: String,
    triggerChars: {
      type: Number,
      default: 3
    },
    maxTokens: {
      type: Number,
      default: 50
    },
    showLoading: {
      type: Boolean,
      default: false
    },
    theme: String
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue || '');
    const suggestion = ref('');
    const isLoading = ref(false);
    const inputRef = ref(null);

    // Watch for external changes to modelValue
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== undefined && newValue !== inputValue.value) {
        inputValue.value = newValue;
        suggestion.value = '';
      }
    });

    // Update the model value when input changes
    const updateInput = (e) => {
      const value = e.target.value;
      inputValue.value = value;
      emit('update:modelValue', value);

      // Generate suggestion if input is long enough
      if (value.length >= props.triggerChars) {
        generateSuggestion(value);
      } else {
        suggestion.value = '';
      }
    };

    // Simulate generating a suggestion
    const generateSuggestion = (text) => {
      if (isLoading.value) return;

      isLoading.value = true;
      setTimeout(() => {
        // Simple suggestion logic for demo
        const suggestions = [
          ' is a great choice!',
          ' could be improved by adding more details.',
          ' - would you like to know more about this?',
          ' is something I can help with.',
          ' sounds interesting. Tell me more!'
        ];

        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        suggestion.value = text + randomSuggestion;
        isLoading.value = false;
      }, 500);
    };

    // Accept the suggestion
    const acceptSuggestion = () => {
      if (suggestion.value) {
        inputValue.value = suggestion.value;
        emit('update:modelValue', suggestion.value);
        suggestion.value = '';
      }
    };

    // Handle tab key to accept suggestion
    const handleKeyDown = (e) => {
      if (e.key === 'Tab' && suggestion.value) {
        e.preventDefault();
        acceptSuggestion();
      }
    };

    return () => h('div', { class: 'ai-autosuggest-container' }, [
      h('div', { class: 'ai-autosuggest-input-wrapper' }, [
        h('input', {
          ref: inputRef,
          class: 'ai-autosuggest-input',
          value: inputValue.value,
          placeholder: props.placeholder || 'Type here...',
          onInput: updateInput,
          onKeydown: handleKeyDown
        }),
        props.showLoading && isLoading.value ? h('div', { class: 'ai-autosuggest-loading' }, '...') : null
      ]),
      suggestion.value ? h('div', { class: 'ai-autosuggest-suggestion' }, [
        h('span', {}, 'Suggestion: '),
        h('span', { class: 'suggestion-text' }, suggestion.value),
        h('button', {
          class: 'accept-suggestion',
          onClick: acceptSuggestion
        }, 'Accept (Tab)')
      ]) : null
    ]);
  }
});
