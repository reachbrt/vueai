/**
 * useOpenApiIntegration - OpenAPI Schema Integration
 * 
 * Automatically infer table columns from OpenAPI schemas
 * Convert natural language to API queries
 */

import { ref, type Ref } from 'vue';
import type { AIClient } from '@aivue/core';
import type {
  OpenAPIConfig,
  OpenAPIOperation,
  TableSchema,
  ColumnSchema
} from '../types/ai';
import type { Column } from '../components/SmartDataTable.vue';

export interface UseOpenApiIntegrationOptions {
  aiClient: AIClient;
  config: OpenAPIConfig;
}

export function useOpenApiIntegration(options: UseOpenApiIntegrationOptions) {
  const { aiClient, config } = options;

  const schema = ref<Record<string, any> | null>(null);
  const operations = ref<OpenAPIOperation[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Load OpenAPI schema from URL or use provided schema
   */
  async function loadSchema(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      if (config.schema) {
        schema.value = config.schema;
      } else if (config.schemaUrl) {
        const response = await fetch(config.schemaUrl);
        schema.value = await response.json();
      } else {
        throw new Error('No schema or schemaUrl provided');
      }

      // Parse operations
      if (schema.value?.paths) {
        operations.value = parseOperations(schema.value);
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load OpenAPI schema';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Infer table columns from OpenAPI operation response schema
   */
  async function inferColumns(operationId?: string): Promise<Column[]> {
    if (!schema.value) {
      await loadSchema();
    }

    const targetOperation = operationId || config.operationId;
    if (!targetOperation) {
      throw new Error('No operation ID specified');
    }

    const operation = operations.value.find(op => op.operationId === targetOperation);
    if (!operation) {
      throw new Error(`Operation ${targetOperation} not found`);
    }

    // Use AI to infer columns from the response schema
    const systemPrompt = `You are analyzing an OpenAPI operation to generate table columns.

Operation: ${operation.operationId}
Method: ${operation.method}
Path: ${operation.path}

Response schema:
${JSON.stringify(operation.responses['200'] || operation.responses['default'], null, 2)}`;

    const userPrompt = `Generate table column definitions for this API response.

Return a JSON array of columns:
[
  {
    "key": "fieldName",
    "label": "Display Label",
    "type": "string|number|date|boolean",
    "sortable": true,
    "visible": true
  }
]

Focus on the most important fields for a data table view.`;

    const response = await aiClient.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], {
      temperature: 0.3,
      maxTokens: 1500
    });

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid column definitions');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Convert natural language query to API parameters
   */
  async function queryToApiParams(
    query: string,
    operationId?: string
  ): Promise<Record<string, any>> {
    if (!schema.value) {
      await loadSchema();
    }

    const targetOperation = operationId || config.operationId;
    if (!targetOperation) {
      throw new Error('No operation ID specified');
    }

    const operation = operations.value.find(op => op.operationId === targetOperation);
    if (!operation) {
      throw new Error(`Operation ${targetOperation} not found`);
    }

    const systemPrompt = `You are converting natural language queries to API parameters.

Operation: ${operation.operationId}
Available parameters:
${JSON.stringify(operation.parameters, null, 2)}`;

    const userPrompt = `User query: "${query}"

Convert this to API query parameters. Return JSON:
{
  "path": {},
  "query": {},
  "header": {},
  "body": {}
}`;

    const response = await aiClient.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], {
      temperature: 0.3,
      maxTokens: 1000
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid parameters');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Parse OpenAPI schema to extract operations
   */
  function parseOperations(openApiSchema: Record<string, any>): OpenAPIOperation[] {
    const ops: OpenAPIOperation[] = [];

    Object.entries(openApiSchema.paths || {}).forEach(([path, pathItem]: [string, any]) => {
      ['get', 'post', 'put', 'delete', 'patch'].forEach(method => {
        if (pathItem[method]) {
          const operation = pathItem[method];
          ops.push({
            operationId: operation.operationId || `${method}_${path}`,
            method: method.toUpperCase(),
            path,
            parameters: operation.parameters || [],
            responses: operation.responses || {}
          });
        }
      });
    });

    return ops;
  }

  return {
    schema,
    operations,
    loading,
    error,
    loadSchema,
    inferColumns,
    queryToApiParams
  };
}

