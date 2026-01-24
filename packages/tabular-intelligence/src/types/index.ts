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

// ============================================================================
// Data Quality & Profiling Types
// ============================================================================

export interface DataProfile {
  overview: {
    totalRows: number;
    totalColumns: number;
    memoryUsage: string;
    duplicateRows: number;
    duplicatePercentage: number;
  };
  columns: ColumnProfile[];
  correlations: CorrelationMatrix;
  warnings: string[];
  qualityScore: number; // 0-100
}

export interface ColumnProfile {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime' | 'text' | 'boolean';
  missingCount: number;
  missingPercentage: number;
  uniqueCount: number;
  uniquePercentage: number;

  // For numeric columns
  stats?: {
    mean: number;
    median: number;
    std: number;
    min: number;
    max: number;
    skewness: number;
    kurtosis: number;
    outliers: number;
    q1: number;
    q3: number;
    iqr: number;
  };

  // For categorical columns
  categories?: {
    topValues: Array<{ value: any; count: number; percentage: number }>;
    cardinality: 'low' | 'medium' | 'high';
    entropy: number;
  };

  // For datetime columns
  dateRange?: {
    earliest: Date;
    latest: Date;
    span: string;
  };

  // Data quality
  quality: {
    score: number; // 0-100
    issues: string[];
    recommendations: string[];
  };
}

export interface DataQualityReport {
  overallScore: number; // 0-100
  dimensions: {
    completeness: number;
    accuracy: number;
    consistency: number;
    validity: number;
    uniqueness: number;
  };
  issues: DataIssue[];
  recommendations: string[];
  timestamp: Date;
}

export interface DataIssue {
  severity: 'critical' | 'warning' | 'info';
  type: 'missing_values' | 'outliers' | 'duplicates' | 'inconsistency' | 'invalid_format' | 'data_type_mismatch';
  column?: string;
  description: string;
  affectedRows: number;
  suggestedFix?: string;
}

export interface CleaningRecommendation {
  priority: 'high' | 'medium' | 'low';
  action: string;
  description: string;
  columns: string[];
  estimatedImpact: string;
  autoFixable: boolean;
}

// ============================================================================
// Data Cleaning & Preprocessing Types
// ============================================================================

export interface ImputationResult {
  data: any[];
  imputedCount: number;
  method: string;
  columns: string[];
  confidence: number;
  details: Array<{
    column: string;
    imputedValues: number;
    strategy: string;
  }>;
}

export interface OutlierHandlingResult {
  data: any[];
  outliersDetected: number;
  outliersRemoved: number;
  method: string;
  columns: string[];
  details: Array<{
    column: string;
    outliers: Array<{ index: number; value: any; score: number }>;
  }>;
}

export interface DeduplicationResult {
  data: any[];
  duplicatesFound: number;
  duplicatesRemoved: number;
  strategy: string;
  keptIndices: number[];
}

export interface NormalizationResult {
  data: any[];
  method: string;
  columns: string[];
  parameters: Record<string, any>;
  reversible: boolean;
}

// ============================================================================
// Feature Engineering Types
// ============================================================================

export interface FeatureEngineeringResult {
  data: any[];
  newFeatures: FeatureDescription[];
  originalFeatureCount: number;
  newFeatureCount: number;
  totalFeatureCount: number;
  importanceScores?: FeatureImportance[];
}

export interface FeatureDescription {
  name: string;
  type: 'polynomial' | 'interaction' | 'binning' | 'encoding' | 'aggregation' | 'derived';
  sourceColumns: string[];
  formula?: string;
  description: string;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  rank: number;
  method: string;
}

export interface FeatureTransformation {
  type: 'polynomial' | 'interaction' | 'binning' | 'encoding' | 'scaling' | 'log' | 'sqrt' | 'reciprocal' | 'box_cox';
  columns: string[];
  params?: any;
  outputName?: string;
}

export interface FeatureSelectionResult {
  selectedFeatures: string[];
  scores: FeatureImportance[];
  method: string;
  threshold?: number;
}

// ============================================================================
// Time Series Analysis Types
// ============================================================================

export interface TimeSeriesForecast {
  predictions: Array<{
    timestamp: Date | string;
    value: number;
    lower: number; // confidence interval lower bound
    upper: number; // confidence interval upper bound
  }>;
  method: 'arima' | 'prophet' | 'exponential_smoothing' | 'lstm';
  horizon: number;
  confidence: number;
  trend?: {
    direction: 'increasing' | 'decreasing' | 'stable';
    strength: number;
  };
  seasonality?: SeasonalityPattern;
  accuracy?: {
    mape: number; // Mean Absolute Percentage Error
    rmse: number; // Root Mean Square Error
    mae: number;  // Mean Absolute Error
  };
}

export interface TrendAnalysis {
  column: string;
  trend: {
    type: 'linear' | 'polynomial' | 'exponential';
    direction: 'increasing' | 'decreasing' | 'stable';
    strength: number; // 0-1
    equation?: string;
    r_squared?: number;
  };
  changePoints?: ChangePoint[];
  summary: string;
}

export interface SeasonalityPattern {
  detected: boolean;
  period?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  strength: number; // 0-1
  peaks?: Array<{ period: string; value: number }>;
  troughs?: Array<{ period: string; value: number }>;
}

export interface ChangePoint {
  index: number;
  timestamp: Date | string;
  type: 'mean_shift' | 'variance_shift' | 'trend_change';
  confidence: number;
  before: number;
  after: number;
  magnitude: number;
}

// ============================================================================
// AutoML Types
// ============================================================================

export interface AutoMLResult {
  bestModel: {
    name: string;
    type: 'classification' | 'regression';
    accuracy: number;
    parameters: any;
    trainingTime: number;
    predictions?: any[];
  };
  allModels: ModelPerformance[];
  recommendations: string[];
  featureImportance: FeatureImportance[];
  confusionMatrix?: number[][];
  metrics: Record<string, number>;
}

export interface ModelPerformance {
  name: string;
  type: 'linear' | 'tree' | 'ensemble' | 'neural' | 'svm' | 'naive_bayes';
  metrics: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
    r2Score?: number;
    mse?: number;
    mae?: number;
  };
  trainingTime: number;
  parameters: any;
}

export interface ModelComparison {
  models: ModelPerformance[];
  winner: string;
  comparisonMetric: string;
  visualizations?: ChartSpecification[];
}

export interface TuningResult {
  bestParameters: any;
  bestScore: number;
  allTrials: Array<{
    parameters: any;
    score: number;
    iteration: number;
  }>;
  improvementOverDefault: number;
}

// ============================================================================
// Model Explainability Types
// ============================================================================

export interface SHAPExplanation {
  prediction: any;
  baseValue: number;
  shapValues: Array<{
    feature: string;
    value: any;
    shapValue: number;
    impact: 'positive' | 'negative';
    percentage: number;
  }>;
  explanation: string;
  topFeatures: Array<{ feature: string; contribution: number }>;
}

export interface PartialDependencePlot {
  feature: string;
  values: number[];
  predictions: number[];
  iceLines?: number[][]; // Individual Conditional Expectation
  description: string;
}

export interface Counterfactual {
  original: any;
  counterfactual: any;
  changes: Array<{
    feature: string;
    from: any;
    to: any;
    changeType: 'increase' | 'decrease' | 'categorical';
  }>;
  newPrediction: any;
  distance: number; // how different from original
  feasibility: number; // 0-1, how realistic the changes are
}

// ============================================================================
// Statistical Testing & A/B Testing Types
// ============================================================================

export interface ABTestResult {
  winner: 'control' | 'treatment' | 'inconclusive';
  pValue: number;
  confidenceInterval: [number, number];
  effectSize: number;
  statisticalPower: number;
  recommendation: string;
  controlStats: {
    mean: number;
    std: number;
    size: number;
  };
  treatmentStats: {
    mean: number;
    std: number;
    size: number;
  };
  visualizations?: ChartSpecification[];
}

export interface SignificanceTest {
  testType: 'ttest' | 'chi2' | 'anova' | 'mann_whitney' | 'kruskal_wallis';
  pValue: number;
  statistic: number;
  significant: boolean;
  alpha: number;
  degreesOfFreedom?: number;
  interpretation: string;
  groups: Array<{
    name: string;
    mean?: number;
    std?: number;
    size: number;
  }>;
}

export interface SampleSizeResult {
  requiredSampleSize: number;
  effect: number;
  power: number;
  alpha: number;
  recommendation: string;
}

// ============================================================================
// Visualization Types
// ============================================================================

export interface VisualizationRecommendation {
  chartType: 'bar' | 'line' | 'scatter' | 'heatmap' | 'box' | 'histogram' | 'pie' | 'area' | 'violin';
  columns: string[];
  reason: string;
  priority: number;
  spec: ChartSpecification;
  insights?: string[];
}

export interface ChartSpecification {
  type: string;
  title: string;
  xAxis?: {
    column: string;
    label: string;
    type: 'categorical' | 'numeric' | 'datetime';
  };
  yAxis?: {
    column: string;
    label: string;
    type: 'categorical' | 'numeric';
  };
  groupBy?: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  data: any[];
  options?: any;
}

export interface PatternInsight {
  type: 'trend' | 'outlier' | 'cluster' | 'correlation' | 'seasonality';
  description: string;
  confidence: number;
  location?: any; // coordinates or indices
  recommendation?: string;
}

// ============================================================================
// Multi-Table Analysis Types
// ============================================================================

export interface TableRelationship {
  fromTable: string;
  toTable: string;
  fromColumn: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  confidence: number;
  matchingRows: number;
  totalRows: number;
}

export interface CrossTableAnalysis {
  query: string;
  tables: string[];
  relationships: TableRelationship[];
  result: any[];
  insights: string[];
  joinOperations: Array<{
    left: string;
    right: string;
    type: string;
    on: string;
  }>;
}

export interface DatabaseSchema {
  tables: Array<{
    name: string;
    columns: TableColumn[];
    rowCount: number;
    primaryKey?: string;
    foreignKeys?: Array<{
      column: string;
      referencesTable: string;
      referencesColumn: string;
    }>;
  }>;
  relationships: TableRelationship[];
}

// ============================================================================
// Reporting & Insights Types
// ============================================================================

export interface Report {
  format: 'markdown' | 'html' | 'pdf' | 'json';
  title: string;
  sections: ReportSection[];
  generatedAt: Date;
  metadata?: {
    dataSource: string;
    rowCount: number;
    columnCount: number;
  };
}

export interface ReportSection {
  type: 'summary' | 'stats' | 'anomalies' | 'trends' | 'recommendations' | 'charts' | 'custom';
  title: string;
  content: string;
  data?: any;
  charts?: ChartSpecification[];
}

export interface Insight {
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'recommendation' | 'warning' | 'opportunity';
  severity: 'critical' | 'warning' | 'info';
  confidence: number;
  actionable: boolean;
  suggestedActions?: string[];
  supportingData?: any;
  visualizations?: ChartSpecification[];
}

// ============================================================================
// Privacy & Compliance Types
// ============================================================================

export interface PIIDetectionResult {
  piiColumns: Array<{
    column: string;
    type: 'email' | 'phone' | 'ssn' | 'credit_card' | 'name' | 'address' | 'ip_address' | 'custom';
    confidence: number;
    sampleValues: string[];
    count: number;
  }>;
  recommendations: string[];
  riskLevel: 'high' | 'medium' | 'low';
}

export interface AnonymizationResult {
  data: any[];
  method: 'masking' | 'hashing' | 'generalization' | 'differential_privacy' | 'tokenization';
  columns: string[];
  reversible: boolean;
  privacyLevel: number; // 0-100
}

export interface ComplianceReport {
  standard: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOC2';
  compliant: boolean;
  score: number; // 0-100
  violations: Array<{
    rule: string;
    description: string;
    severity: 'critical' | 'warning';
    affectedColumns: string[];
    remediation: string;
  }>;
  recommendations: string[];
  timestamp: Date;
}

// ============================================================================
// Data Versioning & Pipeline Types
// ============================================================================

export interface DataSnapshot {
  id: string;
  label: string;
  data: any[];
  schema: TableSchema;
  timestamp: Date;
  metadata?: {
    rowCount: number;
    columnCount: number;
    checksum: string;
  };
}

export interface DataDiff {
  snapshot1: string;
  snapshot2: string;
  changes: {
    rowsAdded: number;
    rowsRemoved: number;
    rowsModified: number;
    columnsAdded: string[];
    columnsRemoved: string[];
    columnsModified: string[];
  };
  details: Array<{
    type: 'add' | 'remove' | 'modify';
    row?: number;
    column?: string;
    oldValue?: any;
    newValue?: any;
  }>;
}

export interface DataLineage {
  source: string;
  transformations: Array<{
    operation: string;
    timestamp: Date;
    params: any;
    user?: string;
  }>;
  currentState: {
    rowCount: number;
    columnCount: number;
    lastModified: Date;
  };
}

export interface DataPipeline {
  id: string;
  name: string;
  steps: PipelineStep[];
  createdAt: Date;
  lastRun?: Date;
}

export interface PipelineStep {
  id: string;
  operation: string;
  params: any;
  condition?: (data: any[]) => boolean;
  onError?: 'stop' | 'skip' | 'retry';
}

export interface PipelineResult {
  success: boolean;
  data: any[];
  stepsExecuted: number;
  totalSteps: number;
  executionTime: number;
  errors?: Array<{
    step: number;
    error: string;
  }>;
}

// ============================================================================
// Streaming & Real-time Types
// ============================================================================

export interface StreamConnection {
  id: string;
  source: 'websocket' | 'sse' | 'polling';
  url: string;
  connected: boolean;
  onData: (data: any) => void;
  onError: (error: Error) => void;
  disconnect: () => void;
}

export interface StreamingAnomalyConfig {
  columns: string[];
  threshold: number;
  windowSize: number;
  method: 'statistical' | 'ml';
}

export interface AggregationConfig {
  windowType: 'tumbling' | 'sliding' | 'session';
  windowSize: number; // in seconds or rows
  aggregations: Array<{
    column: string;
    function: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'std';
    alias?: string;
  }>;
}

export interface AggregationResult {
  windowStart: Date;
  windowEnd: Date;
  results: Record<string, number>;
  rowCount: number;
}

// ============================================================================
// Sampling Types
// ============================================================================

export interface SamplingResult {
  data: any[];
  method: 'random' | 'stratified' | 'systematic' | 'cluster';
  originalSize: number;
  sampleSize: number;
  preservedDistribution: boolean;
  representativeness: number; // 0-1
}
