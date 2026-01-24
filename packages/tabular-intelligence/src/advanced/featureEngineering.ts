/**
 * Feature Engineering
 * Automated feature generation and selection
 */

import type {
  FeatureEngineeringResult,
  FeatureDescription,
  FeatureImportance,
  FeatureTransformation,
  FeatureSelectionResult
} from '../types';

/**
 * Auto-generate features
 */
export async function autoGenerateFeatures(
  data: any[],
  options: {
    targetColumn?: string;
    maxFeatures?: number;
    includeInteractions?: boolean;
    includePolynomials?: boolean;
    includeAggregations?: boolean;
  }
): Promise<FeatureEngineeringResult> {
  const {
    maxFeatures = 20,
    includeInteractions = true,
    includePolynomials = true
  } = options;

  const originalColumns = Object.keys(data[0]);
  const numericColumns = originalColumns.filter(col => {
    const values = data.map(row => row[col]);
    return values.some(v => !isNaN(Number(v)));
  });

  let newData = JSON.parse(JSON.stringify(data));
  const newFeatures: FeatureDescription[] = [];

  // Polynomial features
  if (includePolynomials && numericColumns.length > 0) {
    for (const col of numericColumns.slice(0, 5)) {
      const squaredName = `${col}_squared`;
      newData = newData.map((row: any) => ({
        ...row,
        [squaredName]: Math.pow(Number(row[col]) || 0, 2)
      }));

      newFeatures.push({
        name: squaredName,
        type: 'polynomial',
        sourceColumns: [col],
        formula: `${col}^2`,
        description: `Square of ${col}`
      });

      if (newFeatures.length >= maxFeatures) break;
    }
  }

  // Interaction features
  if (includeInteractions && numericColumns.length > 1) {
    for (let i = 0; i < Math.min(numericColumns.length, 5); i++) {
      for (let j = i + 1; j < Math.min(numericColumns.length, 5); j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        const interactionName = `${col1}_x_${col2}`;

        newData = newData.map((row: any) => ({
          ...row,
          [interactionName]: (Number(row[col1]) || 0) * (Number(row[col2]) || 0)
        }));

        newFeatures.push({
          name: interactionName,
          type: 'interaction',
          sourceColumns: [col1, col2],
          formula: `${col1} * ${col2}`,
          description: `Interaction between ${col1} and ${col2}`
        });

        if (newFeatures.length >= maxFeatures) break;
      }
      if (newFeatures.length >= maxFeatures) break;
    }
  }

  return {
    data: newData,
    newFeatures,
    originalFeatureCount: originalColumns.length,
    newFeatureCount: newFeatures.length,
    totalFeatureCount: originalColumns.length + newFeatures.length
  };
}

/**
 * Create features with specific transformations
 */
export async function createFeatures(
  data: any[],
  transformations: FeatureTransformation[]
): Promise<any[]> {
  let result = JSON.parse(JSON.stringify(data));

  for (const transform of transformations) {
    result = applyTransformation(result, transform);
  }

  return result;
}

/**
 * Analyze feature importance
 */
export async function analyzeFeatureImportance(
  data: any[],
  targetColumn: string
): Promise<FeatureImportance[]> {
  const features = Object.keys(data[0]).filter(k => k !== targetColumn);
  const importances: FeatureImportance[] = [];

  for (const feature of features) {
    // Calculate correlation with target
    const featureValues = data.map(row => Number(row[feature]) || 0);
    const targetValues = data.map(row => Number(row[targetColumn]) || 0);
    const correlation = Math.abs(calculateCorrelation(featureValues, targetValues));

    importances.push({
      feature,
      importance: correlation,
      rank: 0,
      method: 'correlation'
    });
  }

  // Sort by importance and assign ranks
  importances.sort((a, b) => b.importance - a.importance);
  importances.forEach((imp, idx) => imp.rank = idx + 1);

  return importances;
}

/**
 * Select best features
 */
export async function selectBestFeatures(
  data: any[],
  options: {
    targetColumn: string;
    method: 'correlation' | 'mutual_info' | 'chi2' | 'recursive';
    topK?: number;
  }
): Promise<FeatureSelectionResult> {
  const { targetColumn, method, topK = 10 } = options;

  const importances = await analyzeFeatureImportance(data, targetColumn);
  const selectedFeatures = importances.slice(0, topK).map(imp => imp.feature);

  return {
    selectedFeatures,
    scores: importances,
    method,
    threshold: importances[Math.min(topK - 1, importances.length - 1)]?.importance
  };
}

// Helper functions
function applyTransformation(data: any[], transform: FeatureTransformation): any[] {
  const { type, columns, outputName } = transform;

  return data.map(row => {
    const newRow = { ...row };
    const values = columns.map(col => Number(row[col]) || 0);

    let result: number;
    switch (type) {
      case 'log':
        result = Math.log(Math.abs(values[0]) + 1);
        break;
      case 'sqrt':
        result = Math.sqrt(Math.abs(values[0]));
        break;
      case 'reciprocal':
        result = values[0] !== 0 ? 1 / values[0] : 0;
        break;
      case 'polynomial':
        result = Math.pow(values[0], 2);
        break;
      case 'interaction':
        result = values.reduce((a, b) => a * b, 1);
        break;
      default:
        result = values[0];
    }

    newRow[outputName || `${columns.join('_')}_${type}`] = result;
    return newRow;
  });
}

function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let sumXSquared = 0;
  let sumYSquared = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - meanX;
    const yDiff = y[i] - meanY;
    numerator += xDiff * yDiff;
    sumXSquared += xDiff * xDiff;
    sumYSquared += yDiff * yDiff;
  }

  const denominator = Math.sqrt(sumXSquared * sumYSquared);
  return denominator === 0 ? 0 : numerator / denominator;
}

