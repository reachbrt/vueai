/**
 * @aivue/guided-form
 * AI-assisted guided form builder for Vue.js
 * Transform form schemas into one-question-at-a-time conversational experiences
 */

// Import Vue compatibility utilities from core
import {
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin
} from '@aivue/core';

// Import styles
import './styles/index.css';

// Core
export { GuidedFormEngine } from './core/GuidedFormEngine';

// Composables
export { useGuidedForm } from './composables/useGuidedForm';

// Utils
export { AIAssistanceProvider, createAIAssistance } from './utils/aiAssistance';
export { KeyboardNavigationHandler, createKeyboardNavigation } from './utils/keyboardNavigation';
export {
  LocalStoragePersistenceAdapter,
  SessionStoragePersistenceAdapter,
  MemoryPersistenceAdapter,
  CustomPersistenceAdapter,
} from './utils/persistence';

// Components
import GuidedFormContainerComponent from './components/GuidedFormContainer.vue';

// Export components with compatibility layer
export const GuidedFormContainer = createCompatComponent(GuidedFormContainerComponent);

// Export all types
export type {
  // Field Types
  FieldType,
  
  // Validation
  ValidationType,
  ValidationRule,
  ValidationError,
  ValidationResult,
  
  // Options
  Option,
  
  // AI Configuration
  AIConfig,
  FieldAIConfig,
  AIHint,
  AIAssistanceRequest,
  AIAssistanceResponse,
  
  // UI Configuration
  UIConfig,
  
  // Conditional Logic
  Condition,
  ConditionalJump,
  StepLogic,
  
  // Step Types
  StepType,
  Field,
  Step,
  
  // Form Schema
  FormStatus,
  FormSettings,
  FormSchema,
  
  // Form State & Session
  FormState,
  SessionData,
  
  // Events
  FormEvent,
  
  // Hooks & Callbacks
  FormHooks,
  
  // Persistence
  PersistenceAdapter,
  
  // Composable
  UseGuidedFormOptions,
  UseGuidedFormReturn,
} from './types';

// VUE PLUGIN
import { App } from 'vue';

export const GuidedFormPlugin = createCompatPlugin({
  install(app: App) {
    // Register components globally using the compatibility helper
    registerCompatComponent(app, 'GuidedFormContainer', GuidedFormContainerComponent);
  }
});

// DEFAULT EXPORT
import { GuidedFormEngine as Engine } from './core/GuidedFormEngine';
import { useGuidedForm as useForm } from './composables/useGuidedForm';
import { AIAssistanceProvider as AIProvider, createAIAssistance as createAI } from './utils/aiAssistance';
import { KeyboardNavigationHandler as KeyboardHandler, createKeyboardNavigation as createKeyboard } from './utils/keyboardNavigation';
import {
  LocalStoragePersistenceAdapter as LocalStorage,
  SessionStoragePersistenceAdapter as SessionStorage,
  MemoryPersistenceAdapter as Memory,
  CustomPersistenceAdapter as Custom,
} from './utils/persistence';

export default {
  // Core
  GuidedFormEngine: Engine,

  // Composables
  useGuidedForm: useForm,

  // Components
  GuidedFormContainer,

  // Utils
  AIAssistanceProvider: AIProvider,
  createAIAssistance: createAI,
  KeyboardNavigationHandler: KeyboardHandler,
  createKeyboardNavigation: createKeyboard,
  LocalStoragePersistenceAdapter: LocalStorage,
  SessionStoragePersistenceAdapter: SessionStorage,
  MemoryPersistenceAdapter: Memory,
  CustomPersistenceAdapter: Custom,

  // Plugin
  GuidedFormPlugin,
};

