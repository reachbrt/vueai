/**
 * Helper utilities for tabular intelligence
 */

import type { TableSchema, TableColumn, DescriptiveStats, Anomaly, Cluster } from '../types';

/**
 * Infer table schema from data
 */
export function inferSchema(data: any[], name?: string): TableSchema {
  if (data.length === 0) {
    return { columns: [], rowCount: 0, name };
  }

  const firstRow = data[0];
  const columns: TableColumn[] = Object.keys(firstRow).map((key) => {
    const type = inferColumnType(data, key);
    return {
      name: key,
      type,
      nullable: data.some((row) => row[key] == null),
    };
  });

  return {
    columns,
    rowCount: data.length,
    name,
  };
}

/**
 * Infer column type from data
 */
export function inferColumnType(data: any[], column: string): TableColumn['type'] {
  const values = data.map((row) => row[column]).filter((v) => v != null);
  
  if (values.length === 0) return 'string';

  // Check if all values are numbers
  if (values.every((v) => typeof v === 'number' || !isNaN(Number(v)))) {
    return 'number';
  }

  // Check if all values are booleans
  if (values.every((v) => typeof v === 'boolean' || v === 'true' || v === 'false')) {
    return 'boolean';
  }

  // Check if values look like dates
  if (values.every((v) => !isNaN(Date.parse(v)))) {
    return 'date';
  }

  // Check if categorical (limited unique values)
  const uniqueValues = new Set(values);
  if (uniqueValues.size < values.length * 0.5 && uniqueValues.size < 20) {
    return 'categorical';
  }

  return 'string';
}

/**
 * Calculate basic descriptive statistics
 */
export function calculateStats(data: any[], column: string, type: TableColumn['type']): DescriptiveStats {
  const values = data.map((row) => row[column]).filter((v) => v != null);
  const count = values.length;
  const nullCount = data.length - count;

  const stats: DescriptiveStats = {
    column,
    count,
    nullCount,
  };

  if (type === 'number') {
    const numbers = values.map(Number).filter((n) => !isNaN(n));
    
    if (numbers.length > 0) {
      const sorted = [...numbers].sort((a, b) => a - b);
      const sum = numbers.reduce((a, b) => a + b, 0);
      
      stats.mean = sum / numbers.length;
      stats.median = sorted[Math.floor(sorted.length / 2)];
      stats.min = sorted[0];
      stats.max = sorted[sorted.length - 1];
      
      const variance = numbers.reduce((acc, val) => acc + Math.pow(val - stats.mean!, 2), 0) / numbers.length;
      stats.std = Math.sqrt(variance);
      
      stats.percentiles = {
        '25': sorted[Math.floor(sorted.length * 0.25)],
        '50': stats.median,
        '75': sorted[Math.floor(sorted.length * 0.75)],
        '90': sorted[Math.floor(sorted.length * 0.90)],
      };
    }
  } else {
    const uniqueValues = new Set(values);
    stats.uniqueValues = uniqueValues.size;
    
    const frequency: Record<string, number> = {};
    values.forEach((v) => {
      const key = String(v);
      frequency[key] = (frequency[key] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    stats.mode = Object.keys(frequency).find((k) => frequency[k] === maxFreq);
  }

  return stats;
}

/**
 * Detect anomalies using IQR method
 */
export function detectAnomalies(data: any[], columns: string[], sensitivity: number = 0.5): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const multiplier = 1.5 + (1 - sensitivity) * 1.5;

  columns.forEach((column) => {
    const values = data.map((row, idx) => ({ value: Number(row[column]), idx }))
      .filter((v) => !isNaN(v.value));

    if (values.length === 0) return;

    const sorted = [...values].sort((a, b) => a.value - b.value);
    const q1 = sorted[Math.floor(sorted.length * 0.25)].value;
    const q3 = sorted[Math.floor(sorted.length * 0.75)].value;
    const iqr = q3 - q1;
    const lowerBound = q1 - multiplier * iqr;
    const upperBound = q3 + multiplier * iqr;

    values.forEach(({ value, idx }) => {
      if (value < lowerBound || value > upperBound) {
        const existing = anomalies.find((a) => a.rowIndex === idx);
        const reason = value < lowerBound
          ? `${column}: ${value.toFixed(2)} < ${lowerBound.toFixed(2)}`
          : `${column}: ${value.toFixed(2)} > ${upperBound.toFixed(2)}`;

        if (existing) {
          existing.reasons.push(reason);
          existing.affectedColumns.push(column);
          existing.score = Math.min(1, existing.score + 0.2);
        } else {
          anomalies.push({
            rowIndex: idx,
            row: data[idx],
            score: 0.7,
            reasons: [reason],
            affectedColumns: [column],
          });
        }
      }
    });
  });

  return anomalies.sort((a, b) => b.score - a.score);
}

