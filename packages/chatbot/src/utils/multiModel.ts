// Optional multi-model support utilities for enhanced chatbot features
// These are only used if multiModel options are provided in ChatOptions

import { AIClient, AIProvider } from '@aivue/core';
import { Message } from '../composables/useChatEngine';

export interface ModelConfig {
  name: string;
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  specialty?: string;
  priority?: number;
  maxTokens?: number;
  temperature?: number;
}

export interface MultiModelConfig {
  enabled?: boolean;
  models?: ModelConfig[];
  autoSwitch?: boolean;
  fallbackStrategy?: 'sequential' | 'random' | 'priority';
  loadBalancing?: boolean;
}

export interface ModelPerformance {
  modelName: string;
  responseTime: number;
  successRate: number;
  errorCount: number;
  totalRequests: number;
  lastUsed: Date;
}

export interface ModelSelection {
  selectedModel: ModelConfig;
  reason: string;
  confidence: number;
}

// Multi-model manager class
export class MultiModelManager {
  private models: Map<string, AIClient> = new Map();
  private modelConfigs: ModelConfig[] = [];
  private performance: Map<string, ModelPerformance> = new Map();
  private config: MultiModelConfig;

  constructor(config: MultiModelConfig) {
    this.config = config;
    this.initializeModels();
    this.loadPerformanceData();
  }

  private initializeModels(): void {
    if (!this.config.models) return;

    this.config.models.forEach(modelConfig => {
      try {
        const client = new AIClient({
          provider: modelConfig.provider,
          apiKey: modelConfig.apiKey,
          model: modelConfig.model,
          baseUrl: modelConfig.baseUrl
        });

        this.models.set(modelConfig.name, client);
        this.modelConfigs.push(modelConfig);

        // Initialize performance tracking
        if (!this.performance.has(modelConfig.name)) {
          this.performance.set(modelConfig.name, {
            modelName: modelConfig.name,
            responseTime: 0,
            successRate: 1.0,
            errorCount: 0,
            totalRequests: 0,
            lastUsed: new Date()
          });
        }
      } catch (error) {
        console.error(`Failed to initialize model ${modelConfig.name}:`, error);
      }
    });
  }

  private loadPerformanceData(): void {
    try {
      const stored = localStorage.getItem('aivue_model_performance');
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([modelName, perf]) => {
          this.performance.set(modelName, perf as ModelPerformance);
        });
      }
    } catch (error) {
      console.error('Error loading model performance data:', error);
    }
  }

  private savePerformanceData(): void {
    try {
      const data = Object.fromEntries(this.performance);
      localStorage.setItem('aivue_model_performance', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving model performance data:', error);
    }
  }

  // Select the best model for a given message
  selectModel(message: Message, context?: Record<string, any>): ModelSelection {
    if (this.modelConfigs.length === 0) {
      throw new Error('No models configured');
    }

    if (this.modelConfigs.length === 1) {
      return {
        selectedModel: this.modelConfigs[0],
        reason: 'Only model available',
        confidence: 1.0
      };
    }

    if (!this.config.autoSwitch) {
      // Use the first model if auto-switching is disabled
      return {
        selectedModel: this.modelConfigs[0],
        reason: 'Auto-switching disabled',
        confidence: 1.0
      };
    }

    // Analyze message to determine best model
    const messageAnalysis = this.analyzeMessage(message);
    
    // Score each model based on specialty, performance, and availability
    const modelScores = this.modelConfigs.map(model => {
      let score = 0;
      
      // Specialty matching
      if (model.specialty && messageAnalysis.category === model.specialty) {
        score += 50;
      }
      
      // Performance scoring
      const perf = this.performance.get(model.name);
      if (perf) {
        score += perf.successRate * 30;
        score += Math.max(0, 20 - perf.responseTime / 1000) * 2; // Prefer faster models
        score -= perf.errorCount * 5;
      }
      
      // Priority scoring
      if (model.priority) {
        score += model.priority * 10;
      }
      
      // Load balancing - prefer less recently used models
      if (this.config.loadBalancing && perf) {
        const timeSinceLastUse = Date.now() - perf.lastUsed.getTime();
        score += Math.min(timeSinceLastUse / (1000 * 60), 10); // Up to 10 points for 1+ minute
      }

      return { model, score };
    });

    // Sort by score and select the best
    modelScores.sort((a, b) => b.score - a.score);
    const selected = modelScores[0];

    return {
      selectedModel: selected.model,
      reason: `Best match for ${messageAnalysis.category} with score ${selected.score.toFixed(1)}`,
      confidence: Math.min(selected.score / 100, 1.0)
    };
  }

  private analyzeMessage(message: Message): { category: string; complexity: number; tokens: number } {
    const content = message.content.toLowerCase();
    const tokens = content.split(/\s+/).length;
    
    let category = 'general';
    let complexity = 1;

    // Categorize based on content
    if (content.includes('code') || content.includes('programming') || content.includes('function')) {
      category = 'coding';
      complexity = 2;
    } else if (content.includes('analyze') || content.includes('data') || content.includes('research')) {
      category = 'analysis';
      complexity = 3;
    } else if (content.includes('creative') || content.includes('story') || content.includes('write')) {
      category = 'creative';
      complexity = 2;
    } else if (content.includes('math') || content.includes('calculate') || content.includes('solve')) {
      category = 'math';
      complexity = 2;
    }

    // Adjust complexity based on length
    if (tokens > 100) complexity += 1;
    if (tokens > 500) complexity += 1;

    return { category, complexity, tokens };
  }

  // Send message using selected model
  async sendMessage(message: Message, selectedModel?: ModelConfig): Promise<string> {
    const modelSelection = selectedModel ? 
      { selectedModel, reason: 'Manually specified', confidence: 1.0 } :
      this.selectModel(message);

    const client = this.models.get(modelSelection.selectedModel.name);
    if (!client) {
      throw new Error(`Model ${modelSelection.selectedModel.name} not available`);
    }

    const startTime = Date.now();
    let success = false;
    let result = '';

    try {
      result = await client.chat([message]);
      success = true;
      return result;
    } catch (error) {
      success = false;
      
      // Try fallback strategy if enabled
      if (this.config.fallbackStrategy && this.modelConfigs.length > 1) {
        return this.tryFallback(message, modelSelection.selectedModel);
      }
      
      throw error;
    } finally {
      // Update performance metrics
      this.updatePerformance(modelSelection.selectedModel.name, startTime, success);
    }
  }

  private async tryFallback(message: Message, failedModel: ModelConfig): Promise<string> {
    const availableModels = this.modelConfigs.filter(m => m.name !== failedModel.name);
    
    if (availableModels.length === 0) {
      throw new Error('No fallback models available');
    }

    let modelsToTry: ModelConfig[];
    
    switch (this.config.fallbackStrategy) {
      case 'priority':
        modelsToTry = availableModels.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        break;
      case 'random':
        modelsToTry = availableModels.sort(() => Math.random() - 0.5);
        break;
      case 'sequential':
      default:
        modelsToTry = availableModels;
        break;
    }

    for (const model of modelsToTry) {
      try {
        const client = this.models.get(model.name);
        if (client) {
          const startTime = Date.now();
          const result = await client.chat([message]);
          this.updatePerformance(model.name, startTime, true);
          return result;
        }
      } catch (error) {
        this.updatePerformance(model.name, Date.now(), false);
        console.warn(`Fallback model ${model.name} also failed:`, error);
      }
    }

    throw new Error('All fallback models failed');
  }

  private updatePerformance(modelName: string, startTime: number, success: boolean): void {
    const perf = this.performance.get(modelName);
    if (!perf) return;

    const responseTime = Date.now() - startTime;
    perf.totalRequests++;
    perf.lastUsed = new Date();
    
    if (success) {
      // Update average response time
      perf.responseTime = (perf.responseTime + responseTime) / 2;
      perf.successRate = ((perf.successRate * (perf.totalRequests - 1)) + 1) / perf.totalRequests;
    } else {
      perf.errorCount++;
      perf.successRate = ((perf.successRate * (perf.totalRequests - 1)) + 0) / perf.totalRequests;
    }

    this.performance.set(modelName, perf);
    this.savePerformanceData();
  }

  // Get performance statistics
  getPerformanceStats(): ModelPerformance[] {
    return Array.from(this.performance.values());
  }

  // Get available models
  getAvailableModels(): ModelConfig[] {
    return this.modelConfigs.filter(model => this.models.has(model.name));
  }

  // Add a new model
  addModel(config: ModelConfig): void {
    try {
      const client = new AIClient({
        provider: config.provider,
        apiKey: config.apiKey,
        model: config.model,
        baseUrl: config.baseUrl
      });

      this.models.set(config.name, client);
      this.modelConfigs.push(config);

      this.performance.set(config.name, {
        modelName: config.name,
        responseTime: 0,
        successRate: 1.0,
        errorCount: 0,
        totalRequests: 0,
        lastUsed: new Date()
      });
    } catch (error) {
      console.error(`Failed to add model ${config.name}:`, error);
      throw error;
    }
  }

  // Remove a model
  removeModel(modelName: string): void {
    this.models.delete(modelName);
    this.modelConfigs = this.modelConfigs.filter(m => m.name !== modelName);
    this.performance.delete(modelName);
    this.savePerformanceData();
  }

  // Update model configuration
  updateModel(modelName: string, updates: Partial<ModelConfig>): void {
    const configIndex = this.modelConfigs.findIndex(m => m.name === modelName);
    if (configIndex >= 0) {
      Object.assign(this.modelConfigs[configIndex], updates);
      
      // Recreate client if provider settings changed
      if (updates.provider || updates.apiKey || updates.model || updates.baseUrl) {
        const config = this.modelConfigs[configIndex];
        const client = new AIClient({
          provider: config.provider,
          apiKey: config.apiKey,
          model: config.model,
          baseUrl: config.baseUrl
        });
        this.models.set(modelName, client);
      }
    }
  }
}

// Factory function to create multi-model manager
export function createMultiModelManager(config: MultiModelConfig): MultiModelManager | null {
  if (!config.enabled || !config.models || config.models.length === 0) {
    return null;
  }
  
  return new MultiModelManager(config);
}

// Multi-model utilities
export const multiModelUtils = {
  // Suggest best model for a task
  suggestModelForTask(task: string, availableModels: ModelConfig[]): ModelConfig | null {
    const taskLower = task.toLowerCase();
    
    // Find models with matching specialties
    const specialtyMatches = availableModels.filter(model => {
      if (!model.specialty) return false;
      return taskLower.includes(model.specialty.toLowerCase());
    });
    
    if (specialtyMatches.length > 0) {
      // Return highest priority specialty match
      return specialtyMatches.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0];
    }
    
    // Return highest priority general model
    return availableModels.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0] || null;
  },

  // Validate model configuration
  validateModelConfig(config: ModelConfig): string[] {
    const errors: string[] = [];
    
    if (!config.name) errors.push('Model name is required');
    if (!config.provider) errors.push('Provider is required');
    if (config.provider !== 'ollama' && !config.apiKey) {
      errors.push('API key is required for non-Ollama providers');
    }
    
    return errors;
  },

  // Get model capabilities
  getModelCapabilities(model: ModelConfig): string[] {
    const capabilities: string[] = ['text_generation'];
    
    if (model.provider === 'openai' && model.model?.includes('gpt-4')) {
      capabilities.push('vision', 'function_calling');
    }
    
    if (model.specialty === 'coding') {
      capabilities.push('code_generation', 'code_analysis');
    }
    
    if (model.specialty === 'analysis') {
      capabilities.push('data_analysis', 'research');
    }
    
    return capabilities;
  }
};
