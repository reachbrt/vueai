// Export components
import Autosuggest from './components/Autosuggest.vue';

// Export composables
import useAutosuggest from './composables/useAutosuggest';

// Export types
export * from './types';
export * from './composables/useAutosuggest';

// Export components
export { Autosuggest, useAutosuggest };

// Default export
export default {
  Autosuggest,
  useAutosuggest
};
