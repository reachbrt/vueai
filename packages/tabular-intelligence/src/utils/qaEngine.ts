import type { QARequest, QAResponse, Answer, TableSchema } from '../types';
import { calculateStats } from './helpers';

export interface QAEngineConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Q&A Engine for natural language questions about table data
 */
export class QAEngine {
  private config: QAEngineConfig;

  constructor(config: QAEngineConfig) {
    this.config = {
      maxTokens: 1000,
      temperature: 0.3,
      ...config,
    };
  }

  /**
   * Answer a question about the table data
   */
  async answerQuestion(request: QARequest): Promise<QAResponse> {
    const startTime = Date.now();

    try {
      // Prepare data for LLM
      const { question, schema, data, sampleSize = 100, includeAggregates = true } = request;

      // Validate data exists and is an array
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No data available. Please load data first.');
      }

      // Validate schema exists
      if (!schema || !schema.columns || !Array.isArray(schema.columns)) {
        throw new Error('Invalid schema. Please ensure data has a valid schema.');
      }

      // Sample data if too large
      const sampledData = data.length > sampleSize ? this.sampleData(data, sampleSize) : data;

      // Calculate aggregates if requested
      const aggregates = includeAggregates ? this.calculateAggregates(data, schema) : undefined;

      // Build prompt
      const prompt = this.buildPrompt(question, schema, sampledData, aggregates, data.length);
      
      // Call LLM
      const llmResponse = await this.callLLM(prompt);
      
      // Parse response
      const answer = this.parseResponse(llmResponse, question, data.length > sampleSize);
      
      return {
        answer,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error('Q&A error:', error);
      
      // Return error answer
      return {
        answer: {
          questionId: this.generateId(),
          text: 'I encountered an error while processing your question. Please try again.',
          timestamp: new Date(),
          confidence: 0,
          cannotAnswer: true,
          reason: error instanceof Error ? error.message : 'Unknown error',
        },
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Sample data for large datasets
   */
  private sampleData(data: any[], sampleSize: number): any[] {
    // Validate data
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    if (data.length <= sampleSize) {
      return data;
    }

    const step = Math.floor(data.length / sampleSize);
    const sampled: any[] = [];

    for (let i = 0; i < data.length && sampled.length < sampleSize; i += step) {
      sampled.push(data[i]);
    }

    return sampled;
  }

  /**
   * Calculate aggregates for numeric columns
   */
  private calculateAggregates(data: any[], schema: TableSchema): Record<string, any> {
    const aggregates: Record<string, any> = {};

    // Validate data exists
    if (!data || !Array.isArray(data) || data.length === 0) {
      return aggregates;
    }

    // Validate schema and columns exist
    if (!schema || !schema.columns || !Array.isArray(schema.columns)) {
      return aggregates;
    }

    for (const column of schema.columns) {
      if (column.type === 'number' && data.length > 0) {
        try {
          const stats = calculateStats(data, column.name, 'number');
          aggregates[column.name] = {
            mean: stats.mean,
            median: stats.median,
            min: stats.min,
            max: stats.max,
            count: stats.count,
          };
        } catch (error) {
          // Skip columns with errors
        }
      } else if (column.type === 'categorical' || column.type === 'string') {
        // Count unique values
        const values = data.map(row => row[column.name]).filter(v => v != null);
        const uniqueValues = new Set(values);
        aggregates[column.name] = {
          uniqueCount: uniqueValues.size,
          totalCount: values.length,
          topValues: this.getTopValues(values, 5),
        };
      }
    }
    
    return aggregates;
  }

  /**
   * Get top N most frequent values
   */
  private getTopValues(values: any[], n: number): Array<{ value: any; count: number }> {
    const counts = new Map<any, number>();
    
    for (const value of values) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, n);
  }

  /**
   * Build prompt for LLM
   */
  private buildPrompt(
    question: string,
    schema: TableSchema,
    sampledData: any[],
    aggregates?: Record<string, any>,
    totalRows?: number
  ): string {
    const isSampled = totalRows && totalRows > sampledData.length;
    
    let prompt = `You are a data analyst assistant. Answer the following question about a table dataset.\n\n`;
    
    prompt += `**Table Schema:**\n`;
    prompt += `Table: ${schema.name}\n`;
    prompt += `Columns:\n`;
    for (const col of schema.columns) {
      prompt += `- ${col.name} (${col.type})\n`;
    }
    prompt += `\n`;
    
    if (aggregates && Object.keys(aggregates).length > 0) {
      prompt += `**Summary Statistics:**\n`;
      prompt += JSON.stringify(aggregates, null, 2);
      prompt += `\n\n`;
    }
    
    prompt += `**Sample Data** (${sampledData.length} rows${isSampled ? ` out of ${totalRows} total` : ''}):\n`;
    prompt += JSON.stringify(sampledData.slice(0, 10), null, 2);
    prompt += `\n\n`;
    
    prompt += `**Question:** ${question}\n\n`;

    prompt += `**Instructions:**\n`;
    prompt += `1. You are a helpful AI data analyst that can answer questions about the table data, perform statistical analysis, make predictions, identify trends, AND engage in normal conversation.\n`;
    prompt += `2. For data questions (e.g., "how many rows?", "what's the average?"), answer based on the data provided above.\n`;
    prompt += `3. For statistical analysis requests (e.g., "calculate descriptive statistics", "show me mean/median/std dev"), compute and present the statistics clearly.\n`;
    prompt += `4. For anomaly detection requests (e.g., "detect anomalies", "find outliers"), identify unusual data points and explain why they're anomalous.\n`;
    prompt += `5. For clustering requests (e.g., "perform clustering", "group similar data"), identify natural groupings in the data and describe their characteristics.\n`;
    prompt += `6. For correlation analysis requests (e.g., "show correlations", "what variables are related"), analyze relationships between variables and explain the strength and direction of correlations.\n`;
    prompt += `7. For predictive questions (e.g., "predict future trends", "what will happen next?", "forecast X"), analyze patterns in the data and make reasonable predictions based on trends, correlations, and statistical patterns you observe.\n`;
    prompt += `8. For analytical questions (e.g., "what insights?", "any patterns?", "recommendations?"), provide insights, trends, correlations, and actionable recommendations based on the data.\n`;
    prompt += `9. For conversational questions (e.g., "hi", "hello", "what can you do?"), respond naturally and mention your capabilities.\n`;
    prompt += `10. If a question is completely unrelated to data analysis (e.g., "what's the weather?"), politely explain you can only help with data analysis.\n`;
    prompt += `11. Provide clear, concise answers with specific numbers and examples.\n`;
    prompt += `12. When making predictions or identifying trends, explain your reasoning and mention the confidence level.\n`;
    prompt += `13. If the answer is based on sampled data, mention that it's an approximation.\n`;
    prompt += `14. Format your response as JSON with the following structure:\n`;
    prompt += `{\n`;
    prompt += `  "answer": "Your answer text here",\n`;
    prompt += `  "confidence": 0.0-1.0,\n`;
    prompt += `  "cannotAnswer": false,\n`;
    prompt += `  "isApproximate": ${isSampled},\n`;
    prompt += `  "supportingData": { "key": "value" } // optional\n`;
    prompt += `}\n\n`;
    prompt += `Examples:\n`;
    prompt += `- Question: "hi" → Answer: "Hello! I'm your AI data analyst. I can perform statistical analysis, detect anomalies, cluster data, analyze correlations, make predictions, and answer questions about this dataset."\n`;
    prompt += `- Question: "how many rows?" → Answer: "There are ${totalRows || sampledData.length} rows in the dataset."\n`;
    prompt += `- Question: "calculate descriptive statistics" → Answer: "Descriptive Statistics:\\n- Mean: 45.2\\n- Median: 42.0\\n- Std Dev: 12.5\\n- Min: 10\\n- Max: 95\\n- 25th Percentile: 35\\n- 75th Percentile: 58" (with confidence: 0.95)\n`;
    prompt += `- Question: "detect anomalies" → Answer: "I found 3 anomalies in the dataset:\\n1. Row 15: Value 250 is 3.5 standard deviations above the mean\\n2. Row 42: Value -10 is unusually low\\n3. Row 88: Value 300 is an extreme outlier" (with confidence: 0.85)\n`;
    prompt += `- Question: "perform clustering" → Answer: "I identified 3 natural clusters in the data:\\n- Cluster 1 (40%): Low values, avg 25\\n- Cluster 2 (35%): Medium values, avg 50\\n- Cluster 3 (25%): High values, avg 85" (with confidence: 0.8)\n`;
    prompt += `- Question: "show correlation analysis" → Answer: "Correlation Analysis:\\n- Price & Quantity: -0.65 (strong negative)\\n- Revenue & Price: 0.82 (strong positive)\\n- Quantity & Revenue: 0.45 (moderate positive)" (with confidence: 0.9)\n`;
    prompt += `- Question: "predict future sales" → Answer: "Based on the trend in the data, sales are increasing by 15% monthly. If this continues, next month's sales could reach approximately $50,000." (with confidence: 0.7)\n`;
    prompt += `- Question: "what insights can you give?" → Answer: "Key insights: 1) Sales peak on weekends, 2) Product A is the top seller, 3) Customer retention is 85%..."\n`;
    prompt += `- Question: "what's the weather?" → Answer: "I cannot answer this question as it's not related to the dataset. I can only help with questions about this data."\n`;
    
    return prompt;
  }

  /**
   * Call LLM API
   */
  private async callLLM(prompt: string): Promise<string> {
    const { provider, apiKey, baseUrl, model, maxTokens, temperature } = this.config;

    // If no API key, use fallback logic
    if (!apiKey && provider !== 'custom') {
      return this.fallbackResponse(prompt);
    }

    if (provider === 'openai') {
      return this.callOpenAI(prompt, apiKey!, model || 'gpt-4-turbo-preview', maxTokens!, temperature!);
    } else if (provider === 'anthropic') {
      return this.callAnthropic(prompt, apiKey!, model || 'claude-3-5-sonnet-20241022', maxTokens!, temperature!);
    } else if (provider === 'custom' && baseUrl) {
      return this.callCustomAPI(prompt, baseUrl, apiKey);
    }

    throw new Error(`Unsupported provider: ${provider}`);
  }

  /**
   * Fallback response when no API key is available
   */
  private fallbackResponse(prompt: string): string {
    // Extract the question from the prompt
    const questionMatch = prompt.match(/\*\*Question:\*\* (.+)/);
    const question = questionMatch ? questionMatch[1].trim() : '';

    const lowerQuestion = question.toLowerCase();

    // Handle greetings
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/.test(lowerQuestion)) {
      return JSON.stringify({
        answer: "Hello! 👋 I'm your data analysis assistant. I can help you explore and understand this dataset. Try asking questions like 'How many rows are there?', 'What columns do we have?', or 'Show me a summary of the data'. For more advanced analysis, please configure an OpenAI or Anthropic API key in the settings.",
        confidence: 1.0,
        cannotAnswer: false,
        isApproximate: false,
      });
    }

    // Handle "what can you do" type questions
    if (/what (can|do) you|help|capabilities|features/.test(lowerQuestion)) {
      return JSON.stringify({
        answer: "I can help you analyze tabular data! You can ask me questions like:\n• 'How many rows/columns are there?'\n• 'What are the column names?'\n• 'Show me basic statistics'\n• 'What's the data about?'\n\nWith an OpenAI or Anthropic API key, I can also:\n• Calculate descriptive statistics (mean, median, std dev, percentiles)\n• Detect anomalies and outliers\n• Perform clustering analysis\n• Analyze correlations between variables\n• Make predictions and forecasts\n• Identify trends and patterns\n• Provide insights and recommendations\n• Answer complex analytical questions\n\nPlease add your API key in the AI Chatbot Configuration section for advanced features.",
        confidence: 1.0,
        cannotAnswer: false,
        isApproximate: false,
      });
    }

    // Extract schema and data info from prompt
    const rowsMatch = prompt.match(/\*\*Sample Data\*\* \((\d+) rows/);
    const totalRowsMatch = prompt.match(/out of (\d+) total/);
    const columnsMatch = prompt.match(/Columns:\n((?:- .+\n)+)/);

    const sampleRows = rowsMatch ? parseInt(rowsMatch[1]) : 0;
    const totalRows = totalRowsMatch ? parseInt(totalRowsMatch[1]) : sampleRows;

    // Handle row count questions
    if (/how many (rows|records|entries|items)/.test(lowerQuestion)) {
      return JSON.stringify({
        answer: `There are ${totalRows} rows in the dataset.`,
        confidence: 1.0,
        cannotAnswer: false,
        isApproximate: false,
      });
    }

    // Handle column questions
    if (/how many columns|what columns|column names|list columns/.test(lowerQuestion)) {
      if (columnsMatch) {
        const columns = columnsMatch[1].trim().split('\n').map(line => line.replace(/^- /, '').split(' (')[0]);
        return JSON.stringify({
          answer: `The dataset has ${columns.length} columns: ${columns.join(', ')}.`,
          confidence: 1.0,
          cannotAnswer: false,
          isApproximate: false,
        });
      }
    }

    // Handle summary/overview questions
    if (/summary|overview|describe|what.*data|tell me about/.test(lowerQuestion)) {
      if (columnsMatch) {
        const columns = columnsMatch[1].trim().split('\n').map(line => line.replace(/^- /, '').split(' (')[0]);
        return JSON.stringify({
          answer: `This dataset contains ${totalRows} rows and ${columns.length} columns. The columns are: ${columns.join(', ')}. For detailed analysis and insights, please configure an OpenAI or Anthropic API key.`,
          confidence: 0.8,
          cannotAnswer: false,
          isApproximate: false,
        });
      }
    }

    // Handle statistical analysis requests
    if (/descriptive statistics|calculate statistics|mean|median|std dev|standard deviation|percentile/.test(lowerQuestion)) {
      return JSON.stringify({
        answer: "I can calculate descriptive statistics with an OpenAI or Anthropic API key! I'll provide mean, median, standard deviation, min, max, and percentiles for all numeric columns. Please add your API key in the 'AI Chatbot Configuration' section above.",
        confidence: 0.3,
        cannotAnswer: true,
        reason: "Statistical analysis requires AI. Please configure an API key.",
      });
    }

    // Handle anomaly detection requests
    if (/anomaly|anomalies|outlier|outliers|detect anomal|find outlier/.test(lowerQuestion)) {
      return JSON.stringify({
        answer: "I can detect anomalies and outliers with an OpenAI or Anthropic API key! I'll identify unusual data points and explain why they're anomalous. Please add your API key in the 'AI Chatbot Configuration' section above.",
        confidence: 0.3,
        cannotAnswer: true,
        reason: "Anomaly detection requires AI. Please configure an API key.",
      });
    }

    // Handle clustering requests
    if (/cluster|clustering|group|grouping|segment|segmentation/.test(lowerQuestion)) {
      return JSON.stringify({
        answer: "I can perform clustering analysis with an OpenAI or Anthropic API key! I'll identify natural groupings in your data and describe their characteristics. Please add your API key in the 'AI Chatbot Configuration' section above.",
        confidence: 0.3,
        cannotAnswer: true,
        reason: "Clustering analysis requires AI. Please configure an API key.",
      });
    }

    // Handle correlation analysis requests
    if (/correlation|correlate|relationship|relate|association/.test(lowerQuestion)) {
      return JSON.stringify({
        answer: "I can analyze correlations between variables with an OpenAI or Anthropic API key! I'll show you the strength and direction of relationships between different columns. Please add your API key in the 'AI Chatbot Configuration' section above.",
        confidence: 0.3,
        cannotAnswer: true,
        reason: "Correlation analysis requires AI. Please configure an API key.",
      });
    }

    // Handle prediction/forecast questions
    if (/predict|forecast|future|trend|next|will be|gonna be|going to be/.test(lowerQuestion)) {
      return JSON.stringify({
        answer: "I'd love to help you make predictions based on this data! However, I need an OpenAI or Anthropic API key to analyze patterns, identify trends, and make accurate forecasts. Please add your API key in the 'AI Chatbot Configuration' section above, and I'll be able to provide detailed predictions with confidence scores.",
        confidence: 0.3,
        cannotAnswer: true,
        reason: "Predictions require AI analysis. Please configure an API key for advanced features.",
      });
    }

    // Handle insights/analysis questions
    if (/insight|pattern|analysis|analyze|recommendation/.test(lowerQuestion)) {
      return JSON.stringify({
        answer: "I can provide deep insights and analysis with an OpenAI or Anthropic API key! I'll be able to identify patterns, trends, and give you actionable recommendations. Please add your API key in the 'AI Chatbot Configuration' section above.",
        confidence: 0.3,
        cannotAnswer: true,
        reason: "Advanced analysis requires AI. Please configure an API key.",
      });
    }

    // Default: Cannot answer without API key
    return JSON.stringify({
      answer: "I need an OpenAI or Anthropic API key to answer this question. Please add your API key in the 'AI Chatbot Configuration' section above. For now, I can only answer basic questions like 'How many rows?' or 'What columns are there?'",
      confidence: 0.5,
      cannotAnswer: true,
      reason: "No API key configured for advanced natural language processing",
    });
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string, apiKey: string, model: string, maxTokens: number, temperature: number): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(prompt: string, apiKey: string, model: string, maxTokens: number, temperature: number): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }

  /**
   * Call custom API
   */
  private async callCustomAPI(prompt: string, baseUrl: string, apiKey?: string): Promise<string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.answer || JSON.stringify(data);
  }

  /**
   * Parse LLM response
   */
  private parseResponse(llmResponse: string, question: string, isSampled: boolean): Answer {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(llmResponse);

      return {
        questionId: this.generateId(),
        text: parsed.answer || parsed.text || llmResponse,
        timestamp: new Date(),
        confidence: parsed.confidence || 0.8,
        cannotAnswer: parsed.cannotAnswer || false,
        isApproximate: parsed.isApproximate !== undefined ? parsed.isApproximate : isSampled,
        supportingData: parsed.supportingData,
        reason: parsed.reason,
      };
    } catch (error) {
      // If not JSON, treat as plain text answer
      return {
        questionId: this.generateId(),
        text: llmResponse,
        timestamp: new Date(),
        confidence: 0.7,
        isApproximate: isSampled,
      };
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `qa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

