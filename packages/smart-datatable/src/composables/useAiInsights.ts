/**
 * useAiInsights - Auto-Insights & Summaries for DataTables
 * 
 * Generates AI-powered insights about table data:
 * - Trends and patterns
 * - Outliers and anomalies
 * - Summaries and recommendations
 */

import { ref, computed, type Ref } from 'vue';
import type { AIClient } from '@aivue/core';
import type {
  TableSchema,
  AIInsight,
  InsightCategory,
  AIInsightsConfig
} from '../types/ai';

export interface UseAiInsightsOptions {
  aiClient: AIClient;
  schema: Ref<TableSchema>;
  data: Ref<any[]>;
  config?: AIInsightsConfig;
}

export function useAiInsights(options: UseAiInsightsOptions) {
  const { aiClient, schema, data, config } = options;

  const insights = ref<AIInsight[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const hasInsights = computed(() => insights.value.length > 0);

  /**
   * Generate comprehensive insights about the entire table
   */
  async function generateInsights(categories?: InsightCategory[]): Promise<AIInsight[]> {
    loading.value = true;
    error.value = null;

    try {
      const targetCategories = categories || config?.categories || [
        'trends', 'outliers', 'patterns', 'recommendations', 'summary'
      ];

      const systemPrompt = buildInsightsPrompt();
      const userPrompt = `Analyze this dataset and provide insights in these categories: ${targetCategories.join(', ')}.

Return a JSON array of insights with this structure:
[
  {
    "category": "trends|outliers|patterns|recommendations|summary|predictions",
    "title": "Short title",
    "description": "Detailed description",
    "confidence": 0.85,
    "data": { "optional": "supporting data" }
  }
]

Focus on actionable insights that would help a business user understand and act on this data.`;

      const response = await aiClient.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.7,
        maxTokens: 2000
      });

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('AI did not return valid JSON');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const newInsights: AIInsight[] = parsed.map((item: any, index: number) => ({
        id: `insight-${Date.now()}-${index}`,
        category: item.category,
        title: item.title,
        description: item.description,
        confidence: item.confidence || 0.7,
        data: item.data,
        actions: []
      }));

      insights.value = newInsights;
      return newInsights;
    } catch (err: any) {
      error.value = err.message || 'Failed to generate insights';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Generate contextual insights for selected rows
   */
  async function generateContextualInsights(selectedRows: any[]): Promise<AIInsight[]> {
    if (!selectedRows.length) {
      return [];
    }

    loading.value = true;
    error.value = null;

    try {
      const systemPrompt = `You are analyzing a subset of ${selectedRows.length} selected rows from a larger dataset.

Table schema:
${JSON.stringify(schema.value.columns, null, 2)}

Selected rows:
${JSON.stringify(selectedRows.slice(0, 10), null, 2)}`;

      const userPrompt = `Provide a summary and key insights about these selected rows.
Focus on what makes them unique or interesting compared to the full dataset.

Return JSON array of insights with structure:
[
  {
    "category": "summary|patterns|recommendations",
    "title": "Short title",
    "description": "Detailed description",
    "confidence": 0.85
  }
]`;

      const response = await aiClient.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.7,
        maxTokens: 1000
      });

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((item: any, index: number) => ({
        id: `contextual-${Date.now()}-${index}`,
        category: item.category,
        title: item.title,
        description: item.description,
        confidence: item.confidence || 0.7,
        data: item.data,
        actions: []
      }));
    } catch (err: any) {
      error.value = err.message || 'Failed to generate contextual insights';
      return [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get a quick summary of the current view
   */
  async function getSummary(currentData?: any[]): Promise<string> {
    const targetData = currentData || data.value;
    
    try {
      const systemPrompt = buildInsightsPrompt();
      const userPrompt = `Provide a concise 2-3 sentence summary of this dataset for a business user.
Focus on the most important high-level takeaways.

Current view has ${targetData.length} rows.`;

      const response = await aiClient.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.7,
        maxTokens: 200
      });

      return response.trim();
    } catch (err) {
      console.error('Failed to generate summary:', err);
      return 'Unable to generate summary';
    }
  }

  function buildInsightsPrompt(): string {
    return `You are analyzing a business dataset with ${data.value.length} rows.

Schema:
${JSON.stringify(schema.value.columns, null, 2)}

Sample data (first 5 rows):
${JSON.stringify(data.value.slice(0, 5), null, 2)}

Statistical overview:
- Total rows: ${data.value.length}
- Columns: ${schema.value.columns.length}`;
  }

  function clearInsights() {
    insights.value = [];
  }

  return {
    insights,
    loading,
    error,
    hasInsights,
    generateInsights,
    generateContextualInsights,
    getSummary,
    clearInsights
  };
}

