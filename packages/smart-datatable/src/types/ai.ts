/**
 * AI-native SmartDataTable Types
 * Comprehensive type definitions for AI-powered datatable features
 */

import type { AIClient } from '@aivue/core';

// ============================================================================
// Provider Configuration
// ============================================================================

export type AIProvider = 'openai' | 'claude' | 'gemini' | 'huggingface' | 'ollama' | 'deepseek' | 'custom';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  organizationId?: string;
}

// ============================================================================
// Table Schema & Metadata
// ============================================================================

export interface TableSchema {
  columns: ColumnSchema[];
  rowCount: number;
  sampleRows: any[];
  metadata?: Record<string, any>;
}

export interface ColumnSchema {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'array';
  nullable?: boolean;
  unique?: boolean;
  examples?: any[];
  description?: string;
}

// ============================================================================
// Natural Language Querying
// ============================================================================

export interface AISearchConfig {
  enabled: boolean;
  placeholder?: string;
  debounceMs?: number;
  maxSuggestions?: number;
}

export interface AISearchResult {
  query: string;
  filter?: FilterDefinition;
  sort?: SortDefinition;
  suggestions?: string[];
  explanation?: string;
}

export interface FilterDefinition {
  conditions: FilterCondition[];
  operator: 'AND' | 'OR';
}

export interface FilterCondition {
  column: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between' | 'regex';
  value: any;
}

export interface SortDefinition {
  column: string;
  order: 'asc' | 'desc';
}

// ============================================================================
// AI Insights
// ============================================================================

export interface AIInsightsConfig {
  enabled: boolean;
  autoGenerate?: boolean;
  contextual?: boolean; // Show insights for selected rows
  categories?: InsightCategory[];
}

export type InsightCategory = 'trends' | 'outliers' | 'patterns' | 'recommendations' | 'summary' | 'predictions';

export interface AIInsight {
  id: string;
  category: InsightCategory;
  title: string;
  description: string;
  confidence: number; // 0-1
  data?: any;
  actions?: InsightAction[];
}

export interface InsightAction {
  label: string;
  handler: () => void | Promise<void>;
}

// ============================================================================
// Row Agents
// ============================================================================

export interface RowAgent {
  id: string;
  label: string;
  icon?: string;
  promptTemplate: string;
  scope?: 'single' | 'multiple'; // Can handle single or multiple rows
  handler?: (row: any, result: string) => void | Promise<void>;
}

export interface RowAgentResult {
  agentId: string;
  row: any;
  result: string;
  timestamp: Date;
}

// ============================================================================
// AI Transformations
// ============================================================================

export interface AITransformation {
  id: string;
  label: string;
  description?: string;
  scope: 'column' | 'row' | 'selection' | 'table';
  promptTemplate: string;
  targetColumn?: string;
  outputColumn?: string;
  preview?: boolean; // Show preview before applying
  handler?: (data: any, result: any) => any;
}

export interface TransformationResult {
  transformationId: string;
  affectedRows: number;
  changes: TransformationChange[];
  preview?: boolean;
}

export interface TransformationChange {
  rowIndex: number;
  column: string;
  oldValue: any;
  newValue: any;
}

// ============================================================================
// OpenAPI Integration
// ============================================================================

export interface OpenAPIConfig {
  schema?: Record<string, any>; // OpenAPI schema object
  schemaUrl?: string; // URL to fetch schema
  operationId?: string; // Specific operation to use
  endpoint?: string; // Direct endpoint path
  autoInferColumns?: boolean;
}

export interface OpenAPIOperation {
  operationId: string;
  method: string;
  path: string;
  parameters: OpenAPIParameter[];
  responses: Record<string, any>;
}

export interface OpenAPIParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'body';
  required: boolean;
  schema: any;
}

