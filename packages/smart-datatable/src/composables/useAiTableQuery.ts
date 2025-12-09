/**
 * useAiTableQuery - Natural Language Querying for DataTables
 * 
 * Converts natural language queries into structured filters and sorts
 * Example: "show only orders from India last 30 days where total > 500"
 */

import { ref, type Ref } from 'vue';
import type { AIClient } from '@aivue/core';
import type {
  TableSchema,
  AISearchResult,
  FilterDefinition,
  SortDefinition
} from '../types/ai';

export interface UseAiTableQueryOptions {
  aiClient: AIClient;
  schema: Ref<TableSchema>;
  onQueryResult?: (result: AISearchResult) => void;
}

export function useAiTableQuery(options: UseAiTableQueryOptions) {
  const { aiClient, schema, onQueryResult } = options;

  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastQuery = ref<string>('');
  const lastResult = ref<AISearchResult | null>(null);

  /**
   * Build a system prompt that explains the table schema to the LLM
   */
  function buildSchemaPrompt(): string {
    const cols = schema.value.columns.map(col => {
      const examples = col.examples?.slice(0, 3).join(', ') || '';
      return `- ${col.key} (${col.type}): ${col.label}${examples ? ` [examples: ${examples}]` : ''}`;
    }).join('\n');

    return `You are analyzing a data table with the following schema:

Columns:
${cols}

Total rows: ${schema.value.rowCount}

Sample data (first 3 rows):
${JSON.stringify(schema.value.sampleRows.slice(0, 3), null, 2)}`;
  }

  /**
   * Convert natural language query to structured filter
   */
  async function queryToFilter(query: string): Promise<AISearchResult> {
    loading.value = true;
    error.value = null;
    lastQuery.value = query;

    try {
      const systemPrompt = buildSchemaPrompt();
      const userPrompt = `User query: "${query}"

Convert this natural language query into a JSON filter definition. Return ONLY valid JSON with this structure:
{
  "filter": {
    "conditions": [
      {
        "column": "columnName",
        "operator": "equals|contains|gt|lt|gte|lte|in|between|regex",
        "value": "value"
      }
    ],
    "operator": "AND|OR"
  },
  "sort": {
    "column": "columnName",
    "order": "asc|desc"
  },
  "explanation": "Brief explanation of what the filter does"
}

If no filter is needed, return { "filter": null, "sort": null, "explanation": "..." }`;

      const response = await aiClient.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.3, // Lower temperature for more consistent JSON
        maxTokens: 1000
      });

      // Parse the AI response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI did not return valid JSON');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const result: AISearchResult = {
        query,
        filter: parsed.filter || undefined,
        sort: parsed.sort || undefined,
        explanation: parsed.explanation
      };

      lastResult.value = result;
      onQueryResult?.(result);

      return result;
    } catch (err: any) {
      error.value = err.message || 'Failed to process query';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get query suggestions based on partial input
   */
  async function getSuggestions(partialQuery: string): Promise<string[]> {
    if (!partialQuery || partialQuery.length < 3) {
      return [];
    }

    try {
      const systemPrompt = buildSchemaPrompt();
      const userPrompt = `The user is typing: "${partialQuery}"

Suggest 3-5 complete query examples they might want to make based on this table's data.
Return ONLY a JSON array of strings, no other text.

Example: ["show orders from last week", "find customers in USA", "sort by price descending"]`;

      const response = await aiClient.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], {
        temperature: 0.7,
        maxTokens: 200
      });

      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error('Failed to get suggestions:', err);
      return [];
    }
  }

  /**
   * Apply filter definition to data array
   */
  function applyFilter(data: any[], filter?: FilterDefinition): any[] {
    if (!filter || !filter.conditions || filter.conditions.length === 0) {
      return data;
    }

    const filtered = data.filter(row => {
      const results = filter.conditions.map(condition => {
        const value = row[condition.column];
        const conditionValue = condition.value;

        // Handle numeric comparisons with type conversion
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        const numConditionValue = typeof conditionValue === 'number' ? conditionValue : parseFloat(conditionValue);

        switch (condition.operator) {
          case 'equals':
            // Try numeric comparison first, then string comparison
            if (!isNaN(numValue) && !isNaN(numConditionValue)) {
              return numValue === numConditionValue;
            }
            return value === conditionValue || String(value).toLowerCase() === String(conditionValue).toLowerCase();

          case 'contains':
            return String(value).toLowerCase().includes(String(conditionValue).toLowerCase());

          case 'gt':
            if (!isNaN(numValue) && !isNaN(numConditionValue)) {
              return numValue > numConditionValue;
            }
            return value > conditionValue;

          case 'lt':
            if (!isNaN(numValue) && !isNaN(numConditionValue)) {
              return numValue < numConditionValue;
            }
            return value < conditionValue;

          case 'gte':
            if (!isNaN(numValue) && !isNaN(numConditionValue)) {
              return numValue >= numConditionValue;
            }
            return value >= conditionValue;

          case 'lte':
            if (!isNaN(numValue) && !isNaN(numConditionValue)) {
              return numValue <= numConditionValue;
            }
            return value <= conditionValue;

          case 'in':
            if (Array.isArray(conditionValue)) {
              return conditionValue.some(v =>
                String(value).toLowerCase() === String(v).toLowerCase()
              );
            }
            return false;

          case 'between':
            if (Array.isArray(conditionValue) && conditionValue.length === 2) {
              const min = parseFloat(conditionValue[0]);
              const max = parseFloat(conditionValue[1]);
              if (!isNaN(numValue) && !isNaN(min) && !isNaN(max)) {
                return numValue >= min && numValue <= max;
              }
            }
            return false;

          case 'regex':
            try {
              return new RegExp(String(conditionValue), 'i').test(String(value));
            } catch (e) {
              console.error('Invalid regex:', conditionValue);
              return false;
            }

          default:
            console.warn('Unknown operator:', condition.operator);
            return true;
        }
      });

      const match = filter.operator === 'AND'
        ? results.every(r => r)
        : results.some(r => r);

      return match;
    });

    console.log(`AI Filter applied: ${data.length} rows → ${filtered.length} rows`);
    return filtered;
  }

  return {
    loading,
    error,
    lastQuery,
    lastResult,
    queryToFilter,
    getSuggestions,
    applyFilter
  };
}

