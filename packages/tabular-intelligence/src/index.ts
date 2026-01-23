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

// Types
export type {
  TFMProvider,
  TFMConfig,
  TableColumn,
  TableSchema,
  AnalysisType,
  AnalysisRequest,
  AnalysisOptions,
  AnalysisResult,
  DescriptiveStats,
  Anomaly,
  Cluster,
  Prediction,
  CorrelationMatrix,
  TFMRequest,
  TFMResponse,
  Question,
  Answer,
  QARequest,
  QAResponse,
  QAHistory,
  TableExtractionOptions,
  ExtractedTable,
  AISummary,
  APIDataSource,
  APIQueryRequest,
  APIQueryResponse,
} from './types';

