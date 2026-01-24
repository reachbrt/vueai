/**
 * @aivue/guided-form - Type Definitions
 * Comprehensive types for AI-assisted guided forms
 */

// ============================================================================
// FIELD TYPES
// ============================================================================

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'rating'
  | 'file'
  | 'yesno'
  | 'slider'
  | 'color';

// ============================================================================
// VALIDATION
// ============================================================================

export type ValidationType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'email'
  | 'url'
  | 'custom';

export interface ValidationRule {
  type: ValidationType;
  value?: any;
  message?: string;
  customFunctionName?: string;
}

// ============================================================================
// OPTIONS
// ============================================================================

export interface Option {
  label: string;
  value: any;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

// ============================================================================
// AI CONFIGURATION
// ============================================================================

export interface AIConfig {
  enabled: boolean;
  explainQuestion?: boolean;
  rewriteSimpler?: boolean;
  suggestExampleAnswer?: boolean;
  intentMapping?: boolean;
  provider?: 'openai' | 'anthropic' | 'custom';
  apiKey?: string;
  model?: string;
  customEndpoint?: string;
}

export interface FieldAIConfig {
  enabled: boolean;
  hints?: boolean;
  examples?: boolean;
  rewrite?: boolean;
  validation?: boolean;
}

// ============================================================================
// UI CONFIGURATION
// ============================================================================

export interface UIConfig {
  title: string;
  subtitle?: string;
  helpText?: string;
  placeholder?: string;
  exampleText?: string;
  icon?: string;
  layoutHints?: {
    width?: 'small' | 'medium' | 'large' | 'full';
    align?: 'left' | 'center' | 'right';
    showProgress?: boolean;
  };
}

// ============================================================================
// CONDITIONAL LOGIC
// ============================================================================

export interface Condition {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
  value?: any;
}

export interface ConditionalJump {
  conditions: Condition[];
  logic: 'and' | 'or';
  nextStepId: string;
}

export interface StepLogic {
  nextStepId?: string;
  conditionalJumps?: ConditionalJump[];
  visibilityConditions?: Condition[];
}

// ============================================================================
// STEP TYPES
// ============================================================================

export type StepType = 'question' | 'info' | 'group' | 'end';

export interface Field {
  fieldId: string;
  fieldType: FieldType;
  required: boolean;
  validationRules?: ValidationRule[];
  options?: Option[];
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  accept?: string; // For file inputs
  multiple?: boolean;
  aiConfig?: FieldAIConfig;
}

export interface Step {
  id: string;
  type: StepType;
  field?: Field;
  ui: UIConfig;
  logic?: StepLogic;
  metadata?: Record<string, any>;
}

// ============================================================================
// FORM SCHEMA
// ============================================================================

export type FormStatus = 'draft' | 'published' | 'archived';

export interface FormSettings {
  branding?: {
    logo?: string;
    primaryColor?: string;
    fontFamily?: string;
  };
  theme?: 'light' | 'dark' | 'auto';
  timeouts?: {
    sessionTimeout?: number;
    autoSaveInterval?: number;
  };
  saveAndResume?: {
    enabled: boolean;
    tokenExpiry?: number;
  };
  aiFlags?: AIConfig;
  navigation?: {
    allowBack?: boolean;
    showProgress?: boolean;
    progressType?: 'bar' | 'steps' | 'percentage';
  };
  keyboard?: {
    enterToNext?: boolean;
    numericShortcuts?: boolean;
    tabNavigation?: boolean;
  };
}

export interface FormSchema {
  id: string;
  name: string;
  version: string;
  status: FormStatus;
  steps: Step[];
  settings?: FormSettings;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    description?: string;
    tags?: string[];
  };
}

// ============================================================================
// FORM STATE & SESSION
// ============================================================================

export interface FormState {
  currentStepIndex: number;
  currentStepId: string;
  answers: Record<string, any>;
  visitedSteps: string[];
  completedSteps: string[];
  startedAt: string;
  lastUpdatedAt: string;
  isComplete: boolean;
  resumeToken?: string;
}

export interface SessionData {
  sessionId: string;
  formId: string;
  formVersion: string;
  state: FormState;
  expiresAt?: string;
}

// ============================================================================
// VALIDATION RESULTS
// ============================================================================

export interface ValidationError {
  fieldId: string;
  message: string;
  type: ValidationType;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// ============================================================================
// AI ASSISTANCE
// ============================================================================

export interface AIHint {
  type: 'explanation' | 'example' | 'rewrite' | 'validation';
  content: string;
  confidence?: number;
}

export interface AIAssistanceRequest {
  type: 'explain' | 'rewrite' | 'example' | 'validate';
  fieldId: string;
  question: string;
  userInput?: string;
  context?: Record<string, any>;
}

export interface AIAssistanceResponse {
  success: boolean;
  hints: AIHint[];
  error?: string;
}

// ============================================================================
// EVENTS
// ============================================================================

export interface FormEvent {
  type: 'step-change' | 'answer-change' | 'validation-error' | 'complete' | 'save' | 'resume';
  timestamp: string;
  data: any;
}

// ============================================================================
// HOOKS & CALLBACKS
// ============================================================================

export interface FormHooks {
  onStepChange?: (currentStep: Step, previousStep?: Step) => void | Promise<void>;
  onAnswerChange?: (fieldId: string, value: any, allAnswers: Record<string, any>) => void | Promise<void>;
  onValidationError?: (errors: ValidationError[]) => void;
  onComplete?: (answers: Record<string, any>) => void | Promise<void>;
  onSave?: (state: FormState) => void | Promise<void>;
  onResume?: (state: FormState) => void | Promise<void>;
  onAIAssist?: (request: AIAssistanceRequest) => Promise<AIAssistanceResponse>;
}

// ============================================================================
// PERSISTENCE
// ============================================================================

export interface PersistenceAdapter {
  save: (sessionId: string, state: FormState) => Promise<void>;
  load: (sessionId: string) => Promise<FormState | null>;
  delete: (sessionId: string) => Promise<void>;
  generateResumeToken?: (sessionId: string) => Promise<string>;
  validateResumeToken?: (token: string) => Promise<string | null>; // Returns sessionId if valid
}

// ============================================================================
// COMPOSABLE OPTIONS & RETURN
// ============================================================================

export interface UseGuidedFormOptions {
  schema: FormSchema;
  hooks?: FormHooks;
  persistenceAdapter?: PersistenceAdapter;
  sessionId?: string;
  resumeToken?: string;
  initialState?: Partial<FormState>;
}

export interface UseGuidedFormReturn {
  // State
  currentStep: any; // Ref<Step | null>
  currentStepIndex: any; // Ref<number>
  totalSteps: any; // Ref<number>
  answers: any; // Ref<Record<string, any>>
  isComplete: any; // Ref<boolean>
  isLoading: any; // Ref<boolean>
  validationErrors: any; // Ref<ValidationError[]>

  // Progress
  progress: any; // Ref<number> (0-100)
  canGoBack: any; // Ref<boolean>
  canGoNext: any; // Ref<boolean>

  // Navigation
  goToNext: () => Promise<boolean>;
  goToPrevious: () => void;
  goToStep: (stepId: string) => void;

  // Answers
  setAnswer: (fieldId: string, value: any) => void;
  getAnswer: (fieldId: string) => any;
  clearAnswer: (fieldId: string) => void;

  // Validation
  validateCurrentStep: () => Promise<ValidationResult>;
  validateField: (fieldId: string, value: any) => Promise<ValidationResult>;

  // AI Assistance
  getAIHint: (type: 'explain' | 'rewrite' | 'example') => Promise<AIHint[]>;

  // Session Management
  saveProgress: () => Promise<void>;
  resumeSession: (token: string) => Promise<boolean>;
  resetForm: () => void;

  // State
  formState: any; // Ref<FormState>
  schema: any; // Ref<FormSchema>
}

