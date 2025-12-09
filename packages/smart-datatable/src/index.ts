import SmartDataTable from './components/SmartDataTable.vue';
import { useSmartDataTable } from './composables/useSmartDataTable';
import { exportToCSV, exportToJSON, exportToExcel } from './utils/export';

// AI Composables
import { useAiTableQuery } from './composables/useAiTableQuery';
import { useAiInsights } from './composables/useAiInsights';
import { useAiRowAgents } from './composables/useAiRowAgents';
import { useAiTransformations } from './composables/useAiTransformations';
import { useOpenApiIntegration } from './composables/useOpenApiIntegration';

export {
  SmartDataTable,
  useSmartDataTable,
  exportToCSV,
  exportToJSON,
  exportToExcel,
  // AI Composables
  useAiTableQuery,
  useAiInsights,
  useAiRowAgents,
  useAiTransformations,
  useOpenApiIntegration
};

export type { Column, Action } from './components/SmartDataTable.vue';
export type { UseSmartDataTableOptions } from './composables/useSmartDataTable';

// AI Types
export type {
  AIProvider,
  AIProviderConfig,
  TableSchema,
  ColumnSchema,
  AISearchConfig,
  AISearchResult,
  FilterDefinition,
  FilterCondition,
  SortDefinition,
  AIInsightsConfig,
  AIInsight,
  InsightCategory,
  InsightAction,
  RowAgent,
  RowAgentResult,
  AITransformation,
  TransformationResult,
  TransformationChange,
  OpenAPIConfig,
  OpenAPIOperation,
  OpenAPIParameter
} from './types/ai';

export default SmartDataTable;

