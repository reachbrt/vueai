/**
 * @aivue/guided-form - Vue Composable
 * Main composable for guided form functionality
 * Compatible with Vue 2.6+ and Vue 3.x
 */

import { ref, computed, onMounted, onUnmounted } from 'vue-demi';
import { GuidedFormEngine } from '../core/GuidedFormEngine';
import { AIAssistanceProvider } from '../utils/aiAssistance';
import { KeyboardNavigationHandler } from '../utils/keyboardNavigation';
import type {
  UseGuidedFormOptions,
  UseGuidedFormReturn,
  FormSchema,
  Step,
  FormState,
  ValidationResult,
  ValidationError,
  AIHint,
  AIAssistanceRequest,
} from '../types';

export function useGuidedForm(options: UseGuidedFormOptions): UseGuidedFormReturn {
  // ============================================================================
  // STATE
  // ============================================================================

  const engine = new GuidedFormEngine(
    options.schema,
    options.hooks || {},
    options.persistenceAdapter
  );

  const currentStep = ref<Step | null>(null);
  const currentStepIndex = ref(0);
  const totalSteps = ref(0);
  const answers = ref<Record<string, any>>({});
  const isComplete = ref(false);
  const isLoading = ref(false);
  const validationErrors = ref<ValidationError[]>([]);
  const formState = ref<FormState | null>(null);
  const schema = ref<FormSchema>(options.schema);

  // AI Assistance
  let aiProvider: AIAssistanceProvider | null = null;
  if (options.schema.settings?.aiFlags?.enabled) {
    aiProvider = new AIAssistanceProvider(options.schema.settings.aiFlags);
  }

  // Keyboard Navigation
  let keyboardHandler: KeyboardNavigationHandler | null = null;

  // ============================================================================
  // COMPUTED
  // ============================================================================

  const progress = computed(() => {
    return engine.getProgress();
  });

  const canGoBack = computed(() => {
    return engine.canGoBack();
  });

  const canGoNext = computed(() => {
    return engine.canGoNext();
  });

  // ============================================================================
  // METHODS - NAVIGATION
  // ============================================================================

  const updateState = () => {
    currentStep.value = engine.getCurrentStep();
    currentStepIndex.value = engine.getCurrentStepIndex();
    totalSteps.value = engine.getTotalSteps();
    formState.value = engine.getState();
    answers.value = engine.getAllAnswers();
    isComplete.value = formState.value.isComplete;
  };

  const goToNext = async (): Promise<boolean> => {
    isLoading.value = true;
    validationErrors.value = [];

    try {
      const success = await engine.goToNext();
      updateState();
      return success;
    } catch (error) {
      console.error('Error navigating to next step:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const goToPrevious = (): void => {
    engine.goToPrevious();
    updateState();
    validationErrors.value = [];
  };

  const goToStep = (stepId: string): void => {
    engine.goToStep(stepId);
    updateState();
    validationErrors.value = [];
  };

  // ============================================================================
  // METHODS - ANSWERS
  // ============================================================================

  const setAnswer = (fieldId: string, value: any): void => {
    engine.setAnswer(fieldId, value);
    answers.value = engine.getAllAnswers();
    validationErrors.value = [];
  };

  const getAnswer = (fieldId: string): any => {
    return engine.getAnswer(fieldId);
  };

  const clearAnswer = (fieldId: string): void => {
    engine.clearAnswer(fieldId);
    answers.value = engine.getAllAnswers();
  };

  // ============================================================================
  // METHODS - VALIDATION
  // ============================================================================

  const validateCurrentStep = async (): Promise<ValidationResult> => {
    const step = engine.getCurrentStep();
    if (!step) {
      return { valid: true, errors: [] };
    }

    const result = await engine.validateStep(step);
    validationErrors.value = result.errors;
    return result;
  };

  const validateField = async (fieldId: string, value: any): Promise<ValidationResult> => {
    const result = await engine.validateField(fieldId, value);
    return result;
  };

  // ============================================================================
  // METHODS - AI ASSISTANCE
  // ============================================================================

  const getAIHint = async (type: 'explain' | 'rewrite' | 'example'): Promise<AIHint[]> => {
    if (!aiProvider || !currentStep.value) {
      return [];
    }

    const request: AIAssistanceRequest = {
      type,
      fieldId: currentStep.value.field?.fieldId || '',
      question: currentStep.value.ui.title,
      context: answers.value,
    };

    const response = await aiProvider.getAssistance(request);
    return response.success ? response.hints : [];
  };

  // ============================================================================
  // METHODS - SESSION MANAGEMENT
  // ============================================================================

  const saveProgress = async (): Promise<void> => {
    isLoading.value = true;
    try {
      await engine.saveProgress(options.sessionId);
    } finally {
      isLoading.value = false;
    }
  };

  const resumeSession = async (token: string): Promise<boolean> => {
    isLoading.value = true;
    try {
      const success = await engine.resumeSession(token);
      if (success) {
        updateState();
      }
      return success;
    } finally {
      isLoading.value = false;
    }
  };

  const resetForm = (): void => {
    engine.resetState();
    updateState();
    validationErrors.value = [];
  };

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  onMounted(async () => {
    // Initialize state
    if (options.initialState) {
      engine.setState(options.initialState);
    }

    // Try to resume session if token provided
    if (options.resumeToken) {
      await resumeSession(options.resumeToken);
    }

    updateState();

    // Setup keyboard navigation
    if (schema.value.settings?.keyboard) {
      const { createKeyboardNavigation } = await import('../utils/keyboardNavigation');
      keyboardHandler = createKeyboardNavigation({
        enterToNext: schema.value.settings.keyboard.enterToNext,
        numericShortcuts: schema.value.settings.keyboard.numericShortcuts,
        tabNavigation: schema.value.settings.keyboard.tabNavigation,
        onNext: () => goToNext(),
        onPrevious: () => goToPrevious(),
        onSelectOption: (index) => {
          const step = currentStep.value;
          if (step?.field?.options && step.field.options[index]) {
            setAnswer(step.field.fieldId, step.field.options[index].value);
          }
        },
      });
      keyboardHandler.attach();
    }

    // Setup auto-save if enabled
    if (schema.value.settings?.timeouts?.autoSaveInterval) {
      const interval = setInterval(() => {
        saveProgress();
      }, schema.value.settings.timeouts.autoSaveInterval);

      onUnmounted(() => {
        clearInterval(interval);
      });
    }
  });

  onUnmounted(() => {
    // Cleanup keyboard navigation
    if (keyboardHandler) {
      keyboardHandler.detach();
    }
  });

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    currentStep,
    currentStepIndex,
    totalSteps,
    answers,
    isComplete,
    isLoading,
    validationErrors,
    formState,
    schema,

    // Progress
    progress,
    canGoBack,
    canGoNext,

    // Navigation
    goToNext,
    goToPrevious,
    goToStep,

    // Answers
    setAnswer,
    getAnswer,
    clearAnswer,

    // Validation
    validateCurrentStep,
    validateField,

    // AI Assistance
    getAIHint,

    // Session Management
    saveProgress,
    resumeSession,
    resetForm,
  };
}
