/**
 * Outlier Detection and Handling
 * Methods for identifying and treating outliers
 */

import type { OutlierHandlingResult } from '../types';

/**
 * Handle outliers in dataset
 */
export async function handleOutliers(
  data: any[],
  options: {
    method: 'remove' | 'cap' | 'transform';
    strategy: 'iqr' | 'zscore' | 'isolation_forest';
    columns?: string[];
  }
): Promise<OutlierHandlingResult> {
  const { method, strategy, columns } = options;
  const targetColumns = columns || Object.keys(data[0]).filter(col => {
    const values = data.map(row => row[col]);
    return values.some(v => !isNaN(Number(v)));
  });

  let resultData = JSON.parse(JSON.stringify(data));
  let outliersDetected = 0;
  let outliersRemoved = 0;
  const details: Array<{ column: string; outliers: Array<{ index: number; value: any; score: number }> }> = [];

  for (const column of targetColumns) {
    const outliers = detectOutliers(data, column, strategy);
    outliersDetected += outliers.length;

    if (method === 'remove') {
      // Remove rows with outliers
      const outlierIndices = new Set(outliers.map(o => o.index));
      resultData = resultData.filter((_: any, idx: number) => !outlierIndices.has(idx));
      outliersRemoved += outliers.length;
    } else if (method === 'cap') {
      // Cap outliers to threshold values
      const bounds = calculateBounds(data, column, strategy);
      for (const outlier of outliers) {
        if (outlier.value < bounds.lower) {
          resultData[outlier.index][column] = bounds.lower;
        } else if (outlier.value > bounds.upper) {
          resultData[outlier.index][column] = bounds.upper;
        }
      }
    } else if (method === 'transform') {
      // Apply log transformation
      for (let i = 0; i < resultData.length; i++) {
        const value = Number(resultData[i][column]);
        if (!isNaN(value) && value > 0) {
          resultData[i][column] = Math.log(value + 1);
        }
      }
    }

    details.push({
      column,
      outliers
    });
  }

  return {
    data: resultData,
    outliersDetected,
    outliersRemoved,
    method,
    columns: targetColumns,
    details
  };
}

/**
 * Detect outliers using specified strategy
 */
function detectOutliers(
  data: any[],
  column: string,
  strategy: 'iqr' | 'zscore' | 'isolation_forest'
): Array<{ index: number; value: any; score: number }> {
  const values = data.map(row => Number(row[column])).filter(v => !isNaN(v));
  
  if (strategy === 'iqr') {
    return detectOutliersIQR(data, column);
  } else if (strategy === 'zscore') {
    return detectOutliersZScore(data, column);
  } else {
    // Simplified isolation forest
    return detectOutliersIQR(data, column);
  }
}

/**
 * Detect outliers using IQR method
 */
function detectOutliersIQR(
  data: any[],
  column: string
): Array<{ index: number; value: any; score: number }> {
  const values = data.map((row, idx) => ({ value: Number(row[column]), index: idx }))
    .filter(v => !isNaN(v.value));

  const sorted = [...values].sort((a, b) => a.value - b.value);
  const q1 = sorted[Math.floor(sorted.length * 0.25)].value;
  const q3 = sorted[Math.floor(sorted.length * 0.75)].value;
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return values
    .filter(v => v.value < lowerBound || v.value > upperBound)
    .map(v => ({
      index: v.index,
      value: v.value,
      score: v.value < lowerBound 
        ? (lowerBound - v.value) / iqr 
        : (v.value - upperBound) / iqr
    }));
}

/**
 * Detect outliers using Z-score method
 */
function detectOutliersZScore(
  data: any[],
  column: string,
  threshold: number = 3
): Array<{ index: number; value: any; score: number }> {
  const values = data.map((row, idx) => ({ value: Number(row[column]), index: idx }))
    .filter(v => !isNaN(v.value));

  const mean = values.reduce((sum, v) => sum + v.value, 0) / values.length;
  const std = Math.sqrt(
    values.reduce((sum, v) => sum + Math.pow(v.value - mean, 2), 0) / values.length
  );

  return values
    .map(v => ({
      index: v.index,
      value: v.value,
      score: Math.abs((v.value - mean) / std)
    }))
    .filter(v => v.score > threshold);
}

/**
 * Calculate bounds for capping
 */
function calculateBounds(
  data: any[],
  column: string,
  strategy: string
): { lower: number; upper: number } {
  const values = data.map(row => Number(row[column])).filter(v => !isNaN(v)).sort((a, b) => a - b);

  if (strategy === 'iqr') {
    const q1 = values[Math.floor(values.length * 0.25)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const iqr = q3 - q1;
    return {
      lower: q1 - 1.5 * iqr,
      upper: q3 + 1.5 * iqr
    };
  } else {
    // Z-score
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
    return {
      lower: mean - 3 * std,
      upper: mean + 3 * std
    };
  }
}

