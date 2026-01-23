/**
 * Tabular Intelligence Types
 * Type definitions for Tabular Foundation Model (TFM) integration
 */

// ============================================================================
// TFM Provider Configuration
// ============================================================================

export type TFMProvider = 'local' | 'tabpfn' | 'custom';

export interface TFMConfig {
  provider: TFMProvider;
  apiKey?: string;
  baseUrl: string;
  model?: string;
  headers?: Record<string, string>;
  timeout?: number;
  // CORS proxy configuration
  useCorsProxy?: boolean;
  corsProxyUrl?: string;
}

// ============================================================================
// Table Schema
// ============================================================================

export interface TableColumn {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'categorical';
  nullable?: boolean;
  unique?: boolean;
  description?: string;
}

export interface TableSchema {
  columns: TableColumn[];
  rowCount: number;
  name?: string;
  description?: string;
}

// ============================================================================
// Analysis Operations
// ============================================================================

export type AnalysisType =
  | 'descriptive_stats'
  | 'anomaly_detection'
  | 'segmentation'
  | 'clustering'
  | 'prediction'
  | 'correlation'
  | 'trend_analysis'
  | 'outlier_detection'
  | 'summary'
  | 'qa';

export interface AnalysisRequest {
  type: AnalysisType;
  data: any[];
  schema?: TableSchema;
  options?: AnalysisOptions;
}

export interface AnalysisOptions {
  // Descriptive stats
  includeDistribution?: boolean;
  percentiles?: number[];
  
  // Anomaly detection
  sensitivity?: number; // 0-1
  method?: 'statistical' | 'ml' | 'isolation_forest';
  
  // Segmentation/Clustering
  numClusters?: number;
  features?: string[];
  algorithm?: 'kmeans' | 'dbscan' | 'hierarchical';
  
  // Prediction
  targetColumn?: string;
  predictionHorizon?: number;
  confidenceLevel?: number;
  
  // General
  maxRows?: number;
  sampleSize?: number;
}

// ============================================================================
// Analysis Results
// ============================================================================

export interface DescriptiveStats {
  column: string;
  count: number;
  mean?: number;
  median?: number;
  mode?: any;
  std?: number;
  min?: any;
  max?: any;
  percentiles?: Record<string, number>;
  distribution?: {
    bins: number[];
    counts: number[];
  };
  uniqueValues?: number;
  nullCount?: number;
}

export interface Anomaly {
  rowIndex: number;
  row: any;
  score: number; // 0-1, higher = more anomalous
  reasons: string[];
  affectedColumns: string[];
}

export interface Cluster {
  id: number;
  label: string;
  size: number;
  centroid?: Record<string, any>;
  characteristics: string[];
  members?: number[]; // row indices
}

export interface Prediction {
  targetColumn: string;
  predictions: any[];
  confidence: number[];
  model?: string;
  accuracy?: number;
  featureImportance?: Record<string, number>;
}

export interface CorrelationMatrix {
  columns: string[];
  matrix: number[][];
  significant?: Array<{
    col1: string;
    col2: string;
    correlation: number;
    pValue?: number;
  }>;
}

export interface AnalysisResult {
  type: AnalysisType;
  timestamp: Date;

  // Result data based on type
  descriptiveStats?: DescriptiveStats[];
  anomalies?: Anomaly[];
  clusters?: Cluster[];
  predictions?: Prediction;
  correlations?: CorrelationMatrix;
  aiSummary?: AISummary;
  qaAnswer?: Answer;

  // Metadata
  summary: string;
  insights: string[];
  recommendations?: string[];
  confidence: number;
  processingTime?: number;
}

// ============================================================================
// TFM API Request/Response
// ============================================================================

export interface TFMRequest {
  operation: string;
  data: any[];
  schema?: TableSchema;
  parameters?: Record<string, any>;
}

export interface TFMResponse {
  success: boolean;
  result?: any;
  error?: string;
  metadata?: {
    processingTime: number;
    model: string;
    version?: string;
  };
}

// ============================================================================
// Q&A Types
// ============================================================================

export interface Question {
  id: string;
  text: string;
  timestamp: Date;
  context?: {
    tableSchema?: TableSchema;
    rowCount?: number;
    filters?: any;
  };
}

export interface Answer {
  questionId: string;
  text: string;
  timestamp: Date;
  confidence: number;
  supportingData?: {
    rows?: any[];
    aggregates?: Record<string, any>;
    breakdown?: any[];
    chart?: {
      type: string;
      data: any;
    };
  };
  sources?: string[];
  isApproximate?: boolean;
  cannotAnswer?: boolean;
  reason?: string;
}

export interface QARequest {
  question: string;
  schema: TableSchema;
  data?: any[];
  sampleSize?: number;
  includeAggregates?: boolean;
  maxRows?: number;
}

export interface QAResponse {
  answer: Answer;
  processingTime?: number;
}

export interface QAHistory {
  questions: Question[];
  answers: Answer[];
  maxHistory?: number;
}

// ============================================================================
// Table Extraction Types
// ============================================================================

export interface TableExtractionOptions {
  selector?: string;
  includeHeaders?: boolean;
  maxRows?: number;
  inferTypes?: boolean;
  skipEmptyRows?: boolean;
}

export interface ExtractedTable {
  schema: TableSchema;
  data: any[];
  source: 'dom' | 'vue' | 'api';
  metadata?: {
    selector?: string;
    rowCount: number;
    columnCount: number;
    extractedAt: Date;
  };
}

// ============================================================================
// AI Summary Types
// ============================================================================

export interface AISummary {
  overview: string;
  keyMetrics: Array<{
    name: string;
    value: any;
    insight: string;
  }>;
  trends: string[];
  distributions: Array<{
    column: string;
    description: string;
  }>;
  recommendations?: string[];
  confidence: number;
}

// ============================================================================
// API Integration Types
// ============================================================================

export interface APIDataSource {
  type: 'postman' | 'rest' | 'graphql';
  collection?: any; // Postman collection JSON
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, string>;
  auth?: {
    type: 'apikey' | 'bearer' | 'basic' | 'oauth2';
    credentials: Record<string, string>;
  };
}

export interface APIQueryRequest {
  question: string;
  dataSource: APIDataSource;
  variables?: Record<string, string>;
  context?: {
    previousQueries?: string[];
    filters?: any;
  };
}

export interface APIQueryResponse {
  answer: Answer;
  apiResponse?: any;
  endpoint?: string;
  executionTime?: number;
}
