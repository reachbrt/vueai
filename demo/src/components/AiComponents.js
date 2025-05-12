// This file imports and re-exports the components directly from their source files
// to avoid any issues with the package exports

// Import directly from the packages
import Autosuggest from '@aivue/autosuggest';
import SmartForm from '@aivue/smartform';

// Re-export with consistent naming
export const AiAutosuggest = Autosuggest;
export const AiSmartForm = SmartForm;
