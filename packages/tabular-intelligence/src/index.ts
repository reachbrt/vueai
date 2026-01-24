/**
 * @aivue/tabular-intelligence
 * Tabular Foundation Model (TFM) integration for Vue.js
 */

// Core
export { TabularIntelligence } from './core/TabularIntelligence';

// Composables
export { useTabularIntelligence } from './composables/useTabularIntelligence';
export type { UseTabularIntelligenceOptions, UseTabularIntelligenceReturn } from './composables/useTabularIntelligence';

// Components
export { default as QuestionInput } from './components/QuestionInput.vue';
export { default as AnswerDisplay } from './components/AnswerDisplay.vue';
export { default as QuestionHistory } from './components/QuestionHistory.vue';

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

