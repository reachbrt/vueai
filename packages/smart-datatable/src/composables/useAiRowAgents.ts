/**
 * useAiRowAgents - AI-powered Row Actions
 * 
 * Execute AI operations on individual rows or selections:
 * - Explain records in simple terms
 * - Generate follow-up content
 * - Predict outcomes
 * - Classify or categorize
 */

import { ref, type Ref } from 'vue';
import type { AIClient } from '@aivue/core';
import type {
  RowAgent,
  RowAgentResult,
  TableSchema
} from '../types/ai';

export interface UseAiRowAgentsOptions {
  aiClient: AIClient;
  schema: Ref<TableSchema>;
  agents?: RowAgent[];
}

export function useAiRowAgents(options: UseAiRowAgentsOptions) {
  const { aiClient, schema, agents: initialAgents = [] } = options;

  const agents = ref<RowAgent[]>(initialAgents);
  const results = ref<RowAgentResult[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Execute an agent on a single row
   */
  async function executeAgent(
    agent: RowAgent,
    row: any
  ): Promise<RowAgentResult> {
    loading.value = true;
    error.value = null;

    try {
      // Interpolate row data into prompt template
      const prompt = interpolatePrompt(agent.promptTemplate, row);

      const systemPrompt = buildAgentSystemPrompt();
      const response = await aiClient.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ], {
        temperature: 0.7,
        maxTokens: 1000
      });

      const result: RowAgentResult = {
        agentId: agent.id,
        row,
        result: response.trim(),
        timestamp: new Date()
      };

      results.value.push(result);

      // Call custom handler if provided
      if (agent.handler) {
        await agent.handler(row, response.trim());
      }

      return result;
    } catch (err: any) {
      error.value = err.message || 'Failed to execute agent';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Execute an agent on multiple rows
   */
  async function executeAgentBatch(
    agent: RowAgent,
    rows: any[]
  ): Promise<RowAgentResult[]> {
    if (agent.scope === 'single') {
      // Execute sequentially for single-row agents
      const batchResults: RowAgentResult[] = [];
      for (const row of rows) {
        const result = await executeAgent(agent, row);
        batchResults.push(result);
      }
      return batchResults;
    }

    // For multi-row agents, send all rows at once
    loading.value = true;
    error.value = null;

    try {
      const prompt = interpolatePrompt(agent.promptTemplate, { rows });

      const systemPrompt = buildAgentSystemPrompt();
      const response = await aiClient.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ], {
        temperature: 0.7,
        maxTokens: 2000
      });

      // Create a single result for the batch
      const result: RowAgentResult = {
        agentId: agent.id,
        row: { count: rows.length, rows },
        result: response.trim(),
        timestamp: new Date()
      };

      results.value.push(result);

      if (agent.handler) {
        await agent.handler(rows, response.trim());
      }

      return [result];
    } catch (err: any) {
      error.value = err.message || 'Failed to execute batch agent';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Register a new agent
   */
  function registerAgent(agent: RowAgent) {
    agents.value.push(agent);
  }

  /**
   * Remove an agent
   */
  function unregisterAgent(agentId: string) {
    agents.value = agents.value.filter(a => a.id !== agentId);
  }

  /**
   * Get results for a specific row
   */
  function getRowResults(row: any): RowAgentResult[] {
    return results.value.filter(r => r.row === row);
  }

  /**
   * Clear all results
   */
  function clearResults() {
    results.value = [];
  }

  /**
   * Interpolate template variables with row data
   * Supports: {{column}}, {{column.nested}}, {{rows.length}}
   */
  function interpolatePrompt(template: string, data: any): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], data);
      return value !== undefined ? String(value) : match;
    });
  }

  function buildAgentSystemPrompt(): string {
    return `You are an AI assistant helping analyze data from a table.

Table schema:
${JSON.stringify(schema.value.columns, null, 2)}

Provide clear, concise, and actionable responses based on the row data provided.`;
  }

  return {
    agents,
    results,
    loading,
    error,
    executeAgent,
    executeAgentBatch,
    registerAgent,
    unregisterAgent,
    getRowResults,
    clearResults
  };
}

