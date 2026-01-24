/**
 * Data Versioning & Pipelines
 * Snapshots, lineage tracking, transformation pipelines
 */

import type {
  DataSnapshot,
  DataDiff,
  DataLineage,
  DataPipeline,
  PipelineStep,
  PipelineResult
} from '../types';

// In-memory storage for snapshots
const snapshots = new Map<string, DataSnapshot>();
const lineages = new Map<string, DataLineage>();

/**
 * Create data snapshot
 */
export async function createSnapshot(
  data: any[],
  label?: string
): Promise<DataSnapshot> {
  const id = `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const columns = Object.keys(data[0] || {});

  const snapshot: DataSnapshot = {
    id,
    label: label || `Snapshot ${new Date().toISOString()}`,
    data: JSON.parse(JSON.stringify(data)),
    schema: {
      columns: columns.map(name => ({
        name,
        type: detectColumnType(data.map(row => row[name]))
      })),
      rowCount: data.length
    },
    timestamp: new Date(),
    metadata: {
      rowCount: data.length,
      columnCount: columns.length,
      checksum: calculateChecksum(data)
    }
  };

  snapshots.set(id, snapshot);
  return snapshot;
}

/**
 * Compare two snapshots
 */
export async function compareSnapshots(
  snapshot1Id: string,
  snapshot2Id: string
): Promise<DataDiff> {
  const snap1 = snapshots.get(snapshot1Id);
  const snap2 = snapshots.get(snapshot2Id);

  if (!snap1 || !snap2) {
    throw new Error('Snapshot not found');
  }

  const columns1 = new Set(snap1.schema.columns.map(c => c.name));
  const columns2 = new Set(snap2.schema.columns.map(c => c.name));

  const columnsAdded = Array.from(columns2).filter(c => !columns1.has(c));
  const columnsRemoved = Array.from(columns1).filter(c => !columns2.has(c));

  const rowsAdded = snap2.data.length - snap1.data.length;
  const rowsRemoved = rowsAdded < 0 ? Math.abs(rowsAdded) : 0;

  return {
    snapshot1: snapshot1Id,
    snapshot2: snapshot2Id,
    changes: {
      rowsAdded: Math.max(0, rowsAdded),
      rowsRemoved,
      rowsModified: 0, // Simplified
      columnsAdded,
      columnsRemoved,
      columnsModified: []
    },
    details: []
  };
}

/**
 * Track data lineage
 */
export async function trackLineage(
  dataId: string,
  source: string
): Promise<DataLineage> {
  const lineage: DataLineage = {
    source,
    transformations: [],
    currentState: {
      rowCount: 0,
      columnCount: 0,
      lastModified: new Date()
    }
  };

  lineages.set(dataId, lineage);
  return lineage;
}

/**
 * Add transformation to lineage
 */
export function addTransformation(
  dataId: string,
  operation: string,
  params: any
): void {
  const lineage = lineages.get(dataId);
  if (lineage) {
    lineage.transformations.push({
      operation,
      timestamp: new Date(),
      params
    });
  }
}

/**
 * Create data pipeline
 */
export async function createPipeline(
  steps: PipelineStep[]
): Promise<DataPipeline> {
  const id = `pipeline_${Date.now()}`;

  return {
    id,
    name: 'Data Processing Pipeline',
    steps,
    createdAt: new Date()
  };
}

/**
 * Execute pipeline
 */
export async function executePipeline(
  pipeline: DataPipeline,
  data: any[]
): Promise<PipelineResult> {
  const startTime = Date.now();
  let currentData = JSON.parse(JSON.stringify(data));
  const errors: Array<{ step: number; error: string }> = [];
  let stepsExecuted = 0;

  for (let i = 0; i < pipeline.steps.length; i++) {
    const step = pipeline.steps[i];

    try {
      // Check condition if exists
      if (step.condition && !step.condition(currentData)) {
        continue;
      }

      // Execute step (simplified - would call actual operations)
      currentData = await executeStep(currentData, step);
      stepsExecuted++;
    } catch (error) {
      errors.push({
        step: i,
        error: error instanceof Error ? error.message : String(error)
      });

      if (step.onError === 'stop') {
        break;
      }
    }
  }

  return {
    success: errors.length === 0,
    data: currentData,
    stepsExecuted,
    totalSteps: pipeline.steps.length,
    executionTime: Date.now() - startTime,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Save pipeline
 */
export async function savePipeline(
  pipeline: DataPipeline,
  name: string
): Promise<void> {
  // In production, this would save to database or file system
  console.log(`Pipeline "${name}" saved`);
}

/**
 * Load pipeline
 */
export async function loadPipeline(name: string): Promise<DataPipeline> {
  // In production, this would load from database or file system
  return {
    id: 'loaded_pipeline',
    name,
    steps: [],
    createdAt: new Date()
  };
}

// Helper functions
function detectColumnType(values: any[]): 'string' | 'number' | 'boolean' | 'date' | 'categorical' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'string';

  const numericCount = nonNullValues.filter(v => !isNaN(Number(v))).length;
  if (numericCount / nonNullValues.length > 0.8) {
    return 'number';
  }

  return 'categorical';
}

function calculateChecksum(data: any[]): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

async function executeStep(data: any[], step: PipelineStep): Promise<any[]> {
  // Simplified step execution
  // In production, this would call actual transformation functions
  return data;
}

