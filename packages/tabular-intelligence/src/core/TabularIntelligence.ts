/**
 * TabularIntelligence - Core TFM Client
 * Generic client for Tabular Foundation Model APIs
 */

import type {
  TFMConfig,
  TFMRequest,
  TFMResponse,
  AnalysisRequest,
  AnalysisResult,
  AnalysisType,
  TableSchema,
  DescriptiveStats,
  Anomaly,
  Cluster,
  Prediction,
  CorrelationMatrix,
  QARequest,
  QAResponse,
  AISummary,
  TableExtractionOptions,
  ExtractedTable,
  APIDataSource,
  APIQueryRequest,
  APIQueryResponse,
} from '../types';
import { QAEngine, type QAEngineConfig } from '../utils/qaEngine';
import { extractFromDOM, normalizeVueData } from '../utils/tableExtractor';
import { parsePostmanCollection, type ParsedCollection, type ParsedEndpoint } from '../utils/postmanParser';
import { executeAPIRequest, convertToTabular } from '../utils/apiClient';
import { inferSchema } from '../utils/helpers';

export class TabularIntelligence {
  private config: TFMConfig;
  private qaEngine?: QAEngine;
  private parsedCollection?: ParsedCollection;

  constructor(config: TFMConfig, qaConfig?: QAEngineConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };

    // Initialize Q&A engine if config provided
    if (qaConfig) {
      this.qaEngine = new QAEngine(qaConfig);
    }
  }

  /**
   * Initialize or update Q&A engine
   */
  initializeQA(qaConfig: QAEngineConfig): void {
    this.qaEngine = new QAEngine(qaConfig);
  }

  /**
   * Generic API call to TFM endpoint
   */
  private async callTFM(request: TFMRequest): Promise<TFMResponse> {
    const startTime = Date.now();

    try {
      // Build URL with CORS proxy if enabled
      let url = this.config.baseUrl;

      if (this.config.useCorsProxy && this.config.corsProxyUrl) {
        // Handle different proxy URL formats
        if (this.config.corsProxyUrl.includes('?')) {
          // Format: https://corsproxy.io/?
          url = this.config.corsProxyUrl + encodeURIComponent(url);
        } else {
          // Format: https://cors-anywhere.herokuapp.com/
          const proxyUrl = this.config.corsProxyUrl.endsWith('/')
            ? this.config.corsProxyUrl
            : this.config.corsProxyUrl + '/';
          url = proxyUrl + url;
        }
        console.log('Using CORS proxy for TFM API call:', this.config.corsProxyUrl);
        console.log('Proxied URL:', url);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
          ...this.config.headers,
        },
        body: JSON.stringify({
          ...request,
          model: this.config.model,
        }),
        signal: AbortSignal.timeout(this.config.timeout || 30000),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`TFM API error: ${response.status} - ${error}`);
      }

      const result = await response.json();
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        result: result.result || result,
        metadata: {
          processingTime,
          model: this.config.model || 'unknown',
          version: result.version,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
          model: this.config.model || 'unknown',
        },
      };
    }
  }

  /**
   * Perform analysis on tabular data
   */
  async analyze(request: AnalysisRequest): Promise<AnalysisResult> {
    const tfmRequest: TFMRequest = {
      operation: request.type,
      data: request.data,
      schema: request.schema,
      parameters: request.options,
    };

    const response = await this.callTFM(tfmRequest);

    if (!response.success) {
      throw new Error(response.error || 'Analysis failed');
    }

    // Parse response based on analysis type
    return this.parseAnalysisResult(request.type, response.result, response.metadata);
  }

  /**
   * Parse TFM response into structured AnalysisResult
   */
  private parseAnalysisResult(
    type: AnalysisType,
    result: any,
    metadata?: any
  ): AnalysisResult {
    const baseResult: AnalysisResult = {
      type,
      timestamp: new Date(),
      summary: result.summary || '',
      insights: result.insights || [],
      recommendations: result.recommendations,
      confidence: result.confidence || 0.8,
      processingTime: metadata?.processingTime,
    };

    switch (type) {
      case 'descriptive_stats':
        return {
          ...baseResult,
          descriptiveStats: result.stats || result.descriptiveStats,
        };

      case 'anomaly_detection':
        return {
          ...baseResult,
          anomalies: result.anomalies || [],
        };

      case 'segmentation':
      case 'clustering':
        return {
          ...baseResult,
          clusters: result.clusters || [],
        };

      case 'prediction':
        return {
          ...baseResult,
          predictions: result.predictions || result,
        };

      case 'correlation':
        return {
          ...baseResult,
          correlations: result.correlations || result,
        };

      case 'summary':
        return {
          ...baseResult,
          aiSummary: result.summary || result,
        };

      case 'qa':
        return {
          ...baseResult,
          qaAnswer: result.answer || result,
        };

      default:
        return baseResult;
    }
  }

  /**
   * Ask a question about the data (Q&A)
   */
  async askQuestion(request: QARequest): Promise<QAResponse> {
    if (!this.qaEngine) {
      throw new Error('Q&A engine not initialized. Call initializeQA() first.');
    }

    return this.qaEngine.answerQuestion(request);
  }

  /**
   * Generate AI summary of table data
   */
  async generateSummary(data: any[], schema: TableSchema): Promise<AISummary> {
    const request: AnalysisRequest = {
      type: 'summary',
      data,
      schema,
    };

    const result = await this.analyze(request);

    if (!result.aiSummary) {
      throw new Error('Failed to generate summary');
    }

    return result.aiSummary;
  }

  /**
   * Extract table from DOM
   */
  extractFromDOM(options?: TableExtractionOptions): ExtractedTable | null {
    return extractFromDOM(options);
  }

  /**
   * Normalize Vue data grid data
   */
  normalizeVueData(
    data: any[],
    columns?: Array<{ field: string; header?: string; label?: string }>,
    options?: TableExtractionOptions
  ): ExtractedTable {
    return normalizeVueData(data, columns, options);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<TFMConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration (without sensitive data)
   */
  getConfig(): Omit<TFMConfig, 'apiKey'> {
    const { apiKey, ...safeConfig } = this.config;
    return safeConfig;
  }

  // ============================================================================
  // API Integration Methods
  // ============================================================================

  /**
   * Load Postman collection
   */
  loadPostmanCollection(collection: any): ParsedCollection {
    this.parsedCollection = parsePostmanCollection(collection);
    return this.parsedCollection;
  }

  /**
   * Get loaded collection
   */
  getCollection(): ParsedCollection | undefined {
    return this.parsedCollection;
  }

  /**
   * Get endpoints from loaded collection
   */
  getEndpoints(): ParsedEndpoint[] {
    return this.parsedCollection?.endpoints || [];
  }

  /**
   * Execute API request and get data
   */
  async fetchDataFromAPI(
    endpointName: string,
    variables?: Record<string, string>
  ): Promise<{ data: any[]; schema?: TableSchema }> {
    if (!this.parsedCollection) {
      throw new Error('No Postman collection loaded. Call loadPostmanCollection() first.');
    }

    const endpoint = this.parsedCollection.endpoints.find(e => e.name === endpointName);
    if (!endpoint) {
      throw new Error(`Endpoint "${endpointName}" not found in collection.`);
    }

    // Merge collection variables with provided variables
    const allVariables = {
      ...this.parsedCollection.variables,
      ...variables,
    };

    // Execute request
    const response = await executeAPIRequest({ endpoint, variables: allVariables });

    if (!response.success) {
      throw new Error(`API request failed: ${response.error}`);
    }

    // Convert to tabular format
    const data = convertToTabular(response);

    // Infer schema
    const schema = inferSchema(data);

    return { data, schema };
  }

  /**
   * Query API data with natural language
   */
  async queryAPI(request: APIQueryRequest): Promise<APIQueryResponse> {
    if (!this.qaEngine) {
      throw new Error('Q&A engine not initialized. Provide qaConfig in constructor or call initializeQA().');
    }

    const startTime = Date.now();

    // Fetch data from API
    const { data, schema } = await this.fetchDataFromAPI(
      request.dataSource.endpoint || '',
      request.variables
    );

    // Ask question about the data
    const qaRequest: QARequest = {
      question: request.question,
      schema: schema!,
      data,
    };

    const qaResponse = await this.qaEngine.answerQuestion(qaRequest);

    const executionTime = Date.now() - startTime;

    return {
      answer: qaResponse.answer,
      apiResponse: data,
      endpoint: request.dataSource.endpoint,
      executionTime,
    };
  }

  /**
   * List available endpoints from loaded collection
   */
  listEndpoints(): Array<{ name: string; method: string; description?: string }> {
    if (!this.parsedCollection) {
      return [];
    }

    return this.parsedCollection.endpoints.map(e => ({
      name: e.name,
      method: e.method,
      description: e.description,
    }));
  }
}

