/**
 * Missing Value Imputation
 * Smart strategies for handling missing data
 */

import type { ImputationResult } from '../types';

/**
 * Impute missing values using various strategies
 */
export async function imputeMissingValues(
  data: any[],
  options: {
    strategy: 'mean' | 'median' | 'mode' | 'knn' | 'iterative' | 'ai';
    columns?: string[];
  }
): Promise<ImputationResult> {
  const { strategy, columns } = options;
  const targetColumns = columns || Object.keys(data[0]);
  
  let imputedData = JSON.parse(JSON.stringify(data)); // Deep clone
  let totalImputed = 0;
  const details: Array<{ column: string; imputedValues: number; strategy: string }> = [];

  for (const column of targetColumns) {
    const values = imputedData.map((row: any) => row[column]);
    const missingIndices = values
      .map((v: any, i: number) => (v === null || v === undefined || v === '') ? i : -1)
      .filter((i: number) => i !== -1);

    if (missingIndices.length === 0) continue;

    let imputedValue: any;

    switch (strategy) {
      case 'mean':
        imputedValue = calculateMean(values);
        break;
      case 'median':
        imputedValue = calculateMedian(values);
        break;
      case 'mode':
        imputedValue = calculateMode(values);
        break;
      case 'knn':
        // KNN imputation - use nearest neighbors
        imputedData = await knnImputation(imputedData, column, missingIndices);
        break;
      case 'iterative':
        // Iterative imputation - use other columns to predict
        imputedData = await iterativeImputation(imputedData, column, missingIndices);
        break;
      case 'ai':
        // AI-based imputation
        imputedData = await aiImputation(imputedData, column, missingIndices);
        break;
    }

    // Apply simple imputation (mean, median, mode)
    if (['mean', 'median', 'mode'].includes(strategy)) {
      for (const idx of missingIndices) {
        imputedData[idx][column] = imputedValue;
      }
    }

    totalImputed += missingIndices.length;
    details.push({
      column,
      imputedValues: missingIndices.length,
      strategy
    });
  }

  return {
    data: imputedData,
    imputedCount: totalImputed,
    method: strategy,
    columns: targetColumns,
    confidence: calculateImputationConfidence(strategy),
    details
  };
}

/**
 * Calculate mean of non-null values
 */
function calculateMean(values: any[]): number {
  const numericValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => Number(v))
    .filter(v => !isNaN(v));
  
  if (numericValues.length === 0) return 0;
  return numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
}

/**
 * Calculate median of non-null values
 */
function calculateMedian(values: any[]): number {
  const numericValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => Number(v))
    .filter(v => !isNaN(v))
    .sort((a, b) => a - b);
  
  if (numericValues.length === 0) return 0;
  const mid = Math.floor(numericValues.length / 2);
  return numericValues.length % 2 === 0
    ? (numericValues[mid - 1] + numericValues[mid]) / 2
    : numericValues[mid];
}

/**
 * Calculate mode of non-null values
 */
function calculateMode(values: any[]): any {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  if (nonNullValues.length === 0) return null;

  const counts = new Map<any, number>();
  for (const value of nonNullValues) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  let maxCount = 0;
  let mode = null;
  for (const [value, count] of counts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mode = value;
    }
  }

  return mode;
}

/**
 * KNN-based imputation
 */
async function knnImputation(data: any[], column: string, missingIndices: number[], k: number = 5): Promise<any[]> {
  const result = [...data];
  const allColumns = Object.keys(data[0]);
  const otherColumns = allColumns.filter(c => c !== column);

  for (const missingIdx of missingIndices) {
    // Find k nearest neighbors based on other columns
    const distances = data.map((row, idx) => {
      if (idx === missingIdx || row[column] === null || row[column] === undefined || row[column] === '') {
        return { idx, distance: Infinity };
      }

      // Calculate Euclidean distance based on other columns
      let distance = 0;
      for (const col of otherColumns) {
        const val1 = Number(data[missingIdx][col]);
        const val2 = Number(row[col]);
        if (!isNaN(val1) && !isNaN(val2)) {
          distance += Math.pow(val1 - val2, 2);
        }
      }

      return { idx, distance: Math.sqrt(distance) };
    });

    // Get k nearest neighbors
    const neighbors = distances
      .filter(d => d.distance !== Infinity)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, k);

    if (neighbors.length > 0) {
      // Average the values from neighbors
      const neighborValues = neighbors.map(n => data[n.idx][column]);
      result[missingIdx][column] = calculateMean(neighborValues);
    }
  }

  return result;
}

/**
 * Iterative imputation (MICE - Multivariate Imputation by Chained Equations)
 */
async function iterativeImputation(data: any[], column: string, missingIndices: number[]): Promise<any[]> {
  // Simplified iterative imputation
  // In production, this would use a more sophisticated algorithm
  const result = [...data];
  const allColumns = Object.keys(data[0]);
  const predictorColumns = allColumns.filter(c => c !== column);

  // Build a simple linear model using complete cases
  const completeCases = data.filter((row, idx) =>
    !missingIndices.includes(idx) &&
    row[column] !== null &&
    row[column] !== undefined &&
    row[column] !== ''
  );

  if (completeCases.length < 10) {
    // Fall back to mean imputation if not enough complete cases
    const mean = calculateMean(data.map(row => row[column]));
    for (const idx of missingIndices) {
      result[idx][column] = mean;
    }
    return result;
  }

  // For each missing value, predict using other columns
  for (const missingIdx of missingIndices) {
    // Simple prediction: weighted average based on similarity
    let weightedSum = 0;
    let totalWeight = 0;

    for (const completeCase of completeCases) {
      let similarity = 0;
      let validComparisons = 0;

      for (const col of predictorColumns) {
        const val1 = Number(data[missingIdx][col]);
        const val2 = Number(completeCase[col]);

        if (!isNaN(val1) && !isNaN(val2)) {
          similarity += 1 / (1 + Math.abs(val1 - val2));
          validComparisons++;
        }
      }

      if (validComparisons > 0) {
        const weight = similarity / validComparisons;
        weightedSum += weight * Number(completeCase[column]);
        totalWeight += weight;
      }
    }

    result[missingIdx][column] = totalWeight > 0 ? weightedSum / totalWeight : calculateMean(data.map(row => row[column]));
  }

  return result;
}

/**
 * AI-based imputation (placeholder for future ML integration)
 */
async function aiImputation(data: any[], column: string, missingIndices: number[]): Promise<any[]> {
  // This would integrate with ML models in production
  // For now, fall back to iterative imputation
  return iterativeImputation(data, column, missingIndices);
}

/**
 * Calculate confidence score for imputation method
 */
function calculateImputationConfidence(strategy: string): number {
  const confidenceMap: Record<string, number> = {
    'mean': 0.6,
    'median': 0.65,
    'mode': 0.7,
    'knn': 0.8,
    'iterative': 0.85,
    'ai': 0.9
  };
  return confidenceMap[strategy] || 0.5;
}

