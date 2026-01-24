/**
 * @aivue/guided-form - Core Form Engine
 * Handles schema processing, navigation, validation, and state management
 */

import type {
  FormSchema,
  FormState,
  Step,
  ValidationResult,
  ValidationError,
  Condition,
  FormHooks,
  PersistenceAdapter,
} from '../types';

export class GuidedFormEngine {
  private schema: FormSchema;
  private state: FormState;
  private hooks: FormHooks;
  private persistenceAdapter?: PersistenceAdapter;

  constructor(
    schema: FormSchema,
    hooks: FormHooks = {},
    persistenceAdapter?: PersistenceAdapter
  ) {
    this.schema = schema;
    this.hooks = hooks;
    this.persistenceAdapter = persistenceAdapter;
    
    // Initialize state
    this.state = this.createInitialState();
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  private createInitialState(): FormState {
    const firstStep = this.schema.steps[0];
    return {
      currentStepIndex: 0,
      currentStepId: firstStep?.id || '',
      answers: {},
      visitedSteps: [firstStep?.id || ''],
      completedSteps: [],
      startedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      isComplete: false,
    };
  }

  public getState(): FormState {
    return { ...this.state };
  }

  public setState(state: Partial<FormState>): void {
    this.state = {
      ...this.state,
      ...state,
      lastUpdatedAt: new Date().toISOString(),
    };
  }

  public resetState(): void {
    this.state = this.createInitialState();
  }

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  public getCurrentStep(): Step | null {
    return this.schema.steps[this.state.currentStepIndex] || null;
  }

  public async goToNext(): Promise<boolean> {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return false;

    // Validate current step
    const validation = await this.validateStep(currentStep);
    if (!validation.valid) {
      if (this.hooks.onValidationError) {
        this.hooks.onValidationError(validation.errors);
      }
      return false;
    }

    // Mark current step as completed
    if (!this.state.completedSteps.includes(currentStep.id)) {
      this.state.completedSteps.push(currentStep.id);
    }

    // Determine next step
    const nextStepId = this.determineNextStep(currentStep);
    if (!nextStepId) {
      // Form is complete
      this.state.isComplete = true;
      if (this.hooks.onComplete) {
        await this.hooks.onComplete(this.state.answers);
      }
      return true;
    }

    // Find next step index
    const nextStepIndex = this.schema.steps.findIndex(s => s.id === nextStepId);
    if (nextStepIndex === -1) return false;

    const previousStep = currentStep;
    this.state.currentStepIndex = nextStepIndex;
    this.state.currentStepId = nextStepId;

    // Add to visited steps
    if (!this.state.visitedSteps.includes(nextStepId)) {
      this.state.visitedSteps.push(nextStepId);
    }

    // Call hook
    if (this.hooks.onStepChange) {
      await this.hooks.onStepChange(this.getCurrentStep()!, previousStep);
    }

    return true;
  }

  public goToPrevious(): boolean {
    if (this.state.currentStepIndex === 0) return false;

    const previousStep = this.getCurrentStep();
    this.state.currentStepIndex--;
    this.state.currentStepId = this.schema.steps[this.state.currentStepIndex].id;

    if (this.hooks.onStepChange) {
      this.hooks.onStepChange(this.getCurrentStep()!, previousStep || undefined);
    }

    return true;
  }

  public goToStep(stepId: string): boolean {
    const stepIndex = this.schema.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return false;

    const previousStep = this.getCurrentStep();
    this.state.currentStepIndex = stepIndex;
    this.state.currentStepId = stepId;

    if (!this.state.visitedSteps.includes(stepId)) {
      this.state.visitedSteps.push(stepId);
    }

    if (this.hooks.onStepChange) {
      this.hooks.onStepChange(this.getCurrentStep()!, previousStep || undefined);
    }

    return true;
  }

  // ============================================================================
  // CONDITIONAL LOGIC
  // ============================================================================

  private determineNextStep(currentStep: Step): string | null {
    if (!currentStep.logic) {
      // No logic, go to next step in sequence
      const nextIndex = this.state.currentStepIndex + 1;
      return nextIndex < this.schema.steps.length
        ? this.schema.steps[nextIndex].id
        : null;
    }

    // Check conditional jumps
    if (currentStep.logic.conditionalJumps) {
      for (const jump of currentStep.logic.conditionalJumps) {
        if (this.evaluateConditions(jump.conditions, jump.logic)) {
          return jump.nextStepId;
        }
      }
    }

    // Use explicit nextStepId if provided
    if (currentStep.logic.nextStepId) {
      return currentStep.logic.nextStepId;
    }

    // Default to next step in sequence
    const nextIndex = this.state.currentStepIndex + 1;
    return nextIndex < this.schema.steps.length
      ? this.schema.steps[nextIndex].id
      : null;
  }

  private evaluateConditions(conditions: Condition[], logic: 'and' | 'or'): boolean {
    if (conditions.length === 0) return true;

    const results = conditions.map(condition => this.evaluateCondition(condition));

    return logic === 'and'
      ? results.every(r => r)
      : results.some(r => r);
  }

  private evaluateCondition(condition: Condition): boolean {
    const answer = this.state.answers[condition.fieldId];

    switch (condition.operator) {
      case 'equals':
        return answer === condition.value;
      case 'notEquals':
        return answer !== condition.value;
      case 'contains':
        return String(answer || '').includes(String(condition.value));
      case 'greaterThan':
        return Number(answer) > Number(condition.value);
      case 'lessThan':
        return Number(answer) < Number(condition.value);
      case 'isEmpty':
        return !answer || answer === '' || (Array.isArray(answer) && answer.length === 0);
      case 'isNotEmpty':
        return !!answer && answer !== '' && (!Array.isArray(answer) || answer.length > 0);
      default:
        return false;
    }
  }

  public isStepVisible(step: Step): boolean {
    if (!step.logic?.visibilityConditions) return true;
    return this.evaluateConditions(step.logic.visibilityConditions, 'and');
  }

  // ============================================================================
  // ANSWERS
  // ============================================================================

  public setAnswer(fieldId: string, value: any): void {
    this.state.answers[fieldId] = value;
    this.state.lastUpdatedAt = new Date().toISOString();

    if (this.hooks.onAnswerChange) {
      this.hooks.onAnswerChange(fieldId, value, this.state.answers);
    }
  }

  public getAnswer(fieldId: string): any {
    return this.state.answers[fieldId];
  }

  public clearAnswer(fieldId: string): void {
    delete this.state.answers[fieldId];
    this.state.lastUpdatedAt = new Date().toISOString();
  }

  public getAllAnswers(): Record<string, any> {
    return { ...this.state.answers };
  }

  // ============================================================================
  // VALIDATION
  // ============================================================================

  public async validateStep(step: Step): Promise<ValidationResult> {
    if (step.type !== 'question' || !step.field) {
      return { valid: true, errors: [] };
    }

    return this.validateField(step.field.fieldId, this.state.answers[step.field.fieldId]);
  }

  public async validateField(fieldId: string, value: any): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Find the field in the schema
    const step = this.schema.steps.find(s => s.field?.fieldId === fieldId);
    if (!step || !step.field) {
      return { valid: true, errors: [] };
    }

    const field = step.field;

    // Required validation
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push({
        fieldId,
        message: 'This field is required',
        type: 'required',
      });
    }

    // Run validation rules
    if (field.validationRules && value !== undefined && value !== null && value !== '') {
      for (const rule of field.validationRules) {
        const error = this.validateRule(fieldId, value, rule);
        if (error) {
          errors.push(error);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private validateRule(fieldId: string, value: any, rule: any): ValidationError | null {
    const stringValue = String(value);
    const numValue = Number(value);

    switch (rule.type) {
      case 'minLength':
        if (stringValue.length < rule.value) {
          return {
            fieldId,
            message: rule.message || `Minimum length is ${rule.value} characters`,
            type: 'minLength',
          };
        }
        break;

      case 'maxLength':
        if (stringValue.length > rule.value) {
          return {
            fieldId,
            message: rule.message || `Maximum length is ${rule.value} characters`,
            type: 'maxLength',
          };
        }
        break;

      case 'min':
        if (numValue < rule.value) {
          return {
            fieldId,
            message: rule.message || `Minimum value is ${rule.value}`,
            type: 'min',
          };
        }
        break;

      case 'max':
        if (numValue > rule.value) {
          return {
            fieldId,
            message: rule.message || `Maximum value is ${rule.value}`,
            type: 'max',
          };
        }
        break;

      case 'pattern':
        const regex = new RegExp(rule.value);
        if (!regex.test(stringValue)) {
          return {
            fieldId,
            message: rule.message || 'Invalid format',
            type: 'pattern',
          };
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue)) {
          return {
            fieldId,
            message: rule.message || 'Invalid email address',
            type: 'email',
          };
        }
        break;

      case 'url':
        try {
          new URL(stringValue);
        } catch {
          return {
            fieldId,
            message: rule.message || 'Invalid URL',
            type: 'url',
          };
        }
        break;
    }

    return null;
  }

  // ============================================================================
  // PERSISTENCE
  // ============================================================================

  public async saveProgress(sessionId?: string): Promise<void> {
    if (!this.persistenceAdapter) return;

    const id = sessionId || this.state.resumeToken || `session_${Date.now()}`;
    await this.persistenceAdapter.save(id, this.state);

    if (this.hooks.onSave) {
      await this.hooks.onSave(this.state);
    }
  }

  public async resumeSession(token: string): Promise<boolean> {
    if (!this.persistenceAdapter) return false;

    let sessionId = token;

    // Validate token if validator exists
    if (this.persistenceAdapter.validateResumeToken) {
      const validatedId = await this.persistenceAdapter.validateResumeToken(token);
      if (!validatedId) return false;
      sessionId = validatedId;
    }

    // Load state
    const savedState = await this.persistenceAdapter.load(sessionId);
    if (!savedState) return false;

    this.state = savedState;

    if (this.hooks.onResume) {
      await this.hooks.onResume(this.state);
    }

    return true;
  }

  public async generateResumeToken(sessionId: string): Promise<string | null> {
    if (!this.persistenceAdapter?.generateResumeToken) return null;
    return this.persistenceAdapter.generateResumeToken(sessionId);
  }

  // ============================================================================
  // PROGRESS
  // ============================================================================

  public getProgress(): number {
    if (this.schema.steps.length === 0) return 0;
    return Math.round((this.state.completedSteps.length / this.schema.steps.length) * 100);
  }

  public canGoBack(): boolean {
    return this.state.currentStepIndex > 0 &&
           (this.schema.settings?.navigation?.allowBack !== false);
  }

  public canGoNext(): boolean {
    return this.state.currentStepIndex < this.schema.steps.length - 1;
  }

  public getTotalSteps(): number {
    return this.schema.steps.length;
  }

  public getCurrentStepIndex(): number {
    return this.state.currentStepIndex;
  }
}
