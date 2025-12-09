/**
 * useAiTransformations - AI-powered Data Cleaning & Enrichment
 * 
 * Apply AI operations to transform data:
 * - Fill missing values
 * - Standardize formats
 * - Translate text
 * - Categorize free text
 * - Enrich with external data
 */

import { ref, type Ref } from 'vue';
import type { AIClient } from '@aivue/core';
import type {
  AITransformation,
  TransformationResult,
  TransformationChange,
  TableSchema
} from '../types/ai';

export interface UseAiTransformationsOptions {
  aiClient: AIClient;
  schema: Ref<TableSchema>;
  data: Ref<any[]>;
  transformations?: AITransformation[];
}

export function useAiTransformations(options: UseAiTransformationsOptions) {
  const { aiClient, schema, data, transformations: initialTransformations = [] } = options;

  const transformations = ref<AITransformation[]>(initialTransformations);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const previewChanges = ref<TransformationChange[]>([]);

  /**
   * Execute a transformation on the data
   */
  async function executeTransformation(
    transformation: AITransformation,
    targetData?: any[]
  ): Promise<TransformationResult> {
    loading.value = true;
    error.value = null;

    try {
      const dataToTransform = targetData || data.value;
      const changes: TransformationChange[] = [];

      if (transformation.scope === 'column') {
        // Transform entire column
        const result = await transformColumn(
          transformation,
          dataToTransform,
          transformation.targetColumn!
        );
        changes.push(...result);
      } else if (transformation.scope === 'row') {
        // Transform each row
        for (let i = 0; i < dataToTransform.length; i++) {
          const rowChanges = await transformRow(transformation, dataToTransform[i], i);
          changes.push(...rowChanges);
        }
      } else if (transformation.scope === 'selection') {
        // Transform selected rows
        for (let i = 0; i < dataToTransform.length; i++) {
          const rowChanges = await transformRow(transformation, dataToTransform[i], i);
          changes.push(...rowChanges);
        }
      } else if (transformation.scope === 'table') {
        // Transform entire table
        const result = await transformTable(transformation, dataToTransform);
        changes.push(...result);
      }

      const transformationResult: TransformationResult = {
        transformationId: transformation.id,
        affectedRows: changes.length,
        changes,
        preview: transformation.preview
      };

      if (transformation.preview) {
        previewChanges.value = changes;
      } else {
        applyChanges(changes);
      }

      return transformationResult;
    } catch (err: any) {
      error.value = err.message || 'Failed to execute transformation';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Transform a single column
   */
  async function transformColumn(
    transformation: AITransformation,
    dataToTransform: any[],
    columnKey: string
  ): Promise<TransformationChange[]> {
    const values = dataToTransform.map(row => row[columnKey]);
    const uniqueValues = [...new Set(values)].slice(0, 50); // Limit to 50 unique values

    const prompt = interpolatePrompt(transformation.promptTemplate, {
      column: columnKey,
      values: uniqueValues,
      sampleRows: dataToTransform.slice(0, 5)
    });

    const systemPrompt = `You are transforming data in a table column.

Column: ${columnKey}
Type: ${schema.value.columns.find(c => c.key === columnKey)?.type}

Return a JSON object mapping old values to new values:
{
  "oldValue1": "newValue1",
  "oldValue2": "newValue2"
}`;

    const response = await aiClient.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.3,
      maxTokens: 2000
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON mapping');
    }

    const mapping = JSON.parse(jsonMatch[0]);
    const changes: TransformationChange[] = [];

    dataToTransform.forEach((row, index) => {
      const oldValue = row[columnKey];
      const newValue = mapping[oldValue];
      
      if (newValue !== undefined && newValue !== oldValue) {
        changes.push({
          rowIndex: index,
          column: columnKey,
          oldValue,
          newValue
        });
      }
    });

    return changes;
  }

  /**
   * Transform a single row
   */
  async function transformRow(
    transformation: AITransformation,
    row: any,
    rowIndex: number
  ): Promise<TransformationChange[]> {
    const prompt = interpolatePrompt(transformation.promptTemplate, row);

    const systemPrompt = `You are transforming a row of data.

Return JSON with the transformed values:
{
  "column1": "newValue1",
  "column2": "newValue2"
}`;

    const response = await aiClient.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.3,
      maxTokens: 500
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return [];
    }

    const transformed = JSON.parse(jsonMatch[0]);
    const changes: TransformationChange[] = [];

    Object.keys(transformed).forEach(column => {
      if (row[column] !== transformed[column]) {
        changes.push({
          rowIndex,
          column,
          oldValue: row[column],
          newValue: transformed[column]
        });
      }
    });

    return changes;
  }

  /**
   * Transform entire table
   */
  async function transformTable(
    transformation: AITransformation,
    dataToTransform: any[]
  ): Promise<TransformationChange[]> {
    // For table-level transformations, we might add new columns or restructure
    // This is a placeholder for more complex transformations
    return [];
  }

  function interpolatePrompt(template: string, data: any): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], data);
      return value !== undefined ? JSON.stringify(value) : match;
    });
  }

  function applyChanges(changes: TransformationChange[]) {
    changes.forEach(change => {
      if (data.value[change.rowIndex]) {
        data.value[change.rowIndex][change.column] = change.newValue;
      }
    });
  }

  function applyPreview() {
    applyChanges(previewChanges.value);
    previewChanges.value = [];
  }

  function cancelPreview() {
    previewChanges.value = [];
  }

  function registerTransformation(transformation: AITransformation) {
    transformations.value.push(transformation);
  }

  return {
    transformations,
    loading,
    error,
    previewChanges,
    executeTransformation,
    applyPreview,
    cancelPreview,
    registerTransformation
  };
}

