/**
 * @aivue/tabular-intelligence
 * Tabular Foundation Model (TFM) integration for Vue.js
 */

// Import Vue compatibility utilities from core
import {
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin
} from '@aivue/core';

// Import core classes and composables
import { TabularIntelligence } from './core/TabularIntelligence';
import { useTabularIntelligence } from './composables/useTabularIntelligence';

// Export core classes and composables
export { TabularIntelligence };
export { useTabularIntelligence };
export type { UseTabularIntelligenceOptions, UseTabularIntelligenceReturn } from './composables/useTabularIntelligence';

// Import components
import QuestionInputComponent from './components/QuestionInput.vue';
import AnswerDisplayComponent from './components/AnswerDisplay.vue';
import QuestionHistoryComponent from './components/QuestionHistory.vue';

// Export components with compatibility layer
export const QuestionInput = createCompatComponent(QuestionInputComponent);
export const AnswerDisplay = createCompatComponent(AnswerDisplayComponent);
export const QuestionHistory = createCompatComponent(QuestionHistoryComponent);

// Utils
export { inferSchema, inferColumnType, calculateStats, detectAnomalies } from './utils/helpers';
export { QAEngine, type QAEngineConfig } from './utils/qaEngine';
export { extractFromDOM, normalizeVueData } from './utils/tableExtractor';
export { parsePostmanCollection, replaceVariables, type ParsedCollection, type ParsedEndpoint } from './utils/postmanParser';
export { executeAPIRequest, executeMultipleRequests, convertToTabular, type APIRequestOptions, type APIResponse } from './utils/apiClient';

// Types - Export all types
export * from './types';

// ============================================================================
// ADVANCED FEATURES
// ============================================================================

// Data Quality & Profiling
export {
  profileData,
  assessDataQuality,
  detectDataIssues,
  suggestCleaningSteps
} from './quality/profiling';

// Data Cleaning & Preprocessing
export { imputeMissingValues } from './preprocessing/imputation';
export { handleOutliers } from './preprocessing/outliers';

// Time Series Analysis
export {
  forecastTimeSeries,
  detectTrends,
  detectSeasonality,
  detectChangePoints
} from './advanced/timeseries';

// AutoML Capabilities
export {
  autoTrain,
  compareModels,
  tuneHyperparameters
} from './advanced/automl';

// Feature Engineering
export {
  autoGenerateFeatures,
  createFeatures,
  analyzeFeatureImportance,
  selectBestFeatures
} from './advanced/featureEngineering';

// Model Explainability
export {
  explainPrediction,
  getFeatureImportance,
  getPartialDependence,
  generateCounterfactuals
} from './advanced/explainability';

// Statistical Testing & A/B Testing
export {
  analyzeABTest,
  testSignificance,
  calculateSampleSize
} from './advanced/statistical';

// Visualization Recommendations
export {
  recommendVisualizations,
  generateChartSpec,
  detectPatterns
} from './advanced/visualization';

// Multi-Table Analysis
export {
  joinTables,
  detectRelationships,
  analyzeCrossTables,
  inferDatabaseSchema
} from './advanced/multitable';

// Reporting & Insights
export {
  generateReport,
  generateExecutiveSummary,
  generateInsights
} from './advanced/reporting';

// Privacy & Compliance
export {
  detectPII,
  anonymizeData,
  checkCompliance
} from './advanced/privacy';

// Data Versioning & Pipelines
export {
  createSnapshot,
  compareSnapshots,
  trackLineage,
  addTransformation,
  createPipeline,
  executePipeline,
  savePipeline,
  loadPipeline
} from './advanced/versioning';

// Streaming & Real-time
export {
  connectStream,
  monitorAnomalies,
  streamingAggregation,
  detectStreamingAnomalies,
  calculateWindowedAggregations,
  smartSample
} from './advanced/streaming';

// ============================================================================
// VUE PLUGIN
// ============================================================================

import { App } from 'vue';

/**
 * Vue Plugin for Tabular Intelligence
 * Provides global component registration with Vue 2/3 compatibility
 */
export const TabularIntelligencePlugin = createCompatPlugin({
  install(app: App) {
    // Register components globally using the compatibility helper
    registerCompatComponent(app, 'QuestionInput', QuestionInputComponent);
    registerCompatComponent(app, 'AnswerDisplay', AnswerDisplayComponent);
    registerCompatComponent(app, 'QuestionHistory', QuestionHistoryComponent);
  }
});

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Core
  TabularIntelligence,

  // Composables
  useTabularIntelligence,

  // Components
  QuestionInput,
  AnswerDisplay,
  QuestionHistory,

  // Plugin
  TabularIntelligencePlugin,

  // Re-export compatibility utilities for advanced users
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin
};
