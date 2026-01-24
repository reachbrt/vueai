/**
 * Time Series Analysis
 * Forecasting, trend detection, seasonality analysis
 */

import type {
  TimeSeriesForecast,
  TrendAnalysis,
  SeasonalityPattern,
  ChangePoint
} from '../types';

/**
 * Forecast time series data
 */
export async function forecastTimeSeries(
  data: any[],
  options: {
    dateColumn: string;
    valueColumn: string;
    horizon: number;
    method?: 'arima' | 'prophet' | 'exponential_smoothing' | 'lstm';
    seasonality?: 'auto' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    confidence?: number;
  }
): Promise<TimeSeriesForecast> {
  const { dateColumn, valueColumn, horizon, method = 'exponential_smoothing', confidence = 0.95 } = options;

  // Extract time series
  const timeSeries = data.map(row => ({
    timestamp: new Date(row[dateColumn]),
    value: Number(row[valueColumn])
  })).filter(d => !isNaN(d.value)).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  if (timeSeries.length < 10) {
    throw new Error('Insufficient data for forecasting (minimum 10 points required)');
  }

  // Simple exponential smoothing forecast
  const alpha = 0.3; // Smoothing parameter
  const predictions: Array<{ timestamp: Date | string; value: number; lower: number; upper: number }> = [];

  // Calculate initial level
  let level = timeSeries[0].value;
  for (let i = 1; i < timeSeries.length; i++) {
    level = alpha * timeSeries[i].value + (1 - alpha) * level;
  }

  // Generate forecasts
  const lastTimestamp = timeSeries[timeSeries.length - 1].timestamp;
  const interval = detectTimeInterval(timeSeries);

  for (let i = 1; i <= horizon; i++) {
    const forecastTimestamp = new Date(lastTimestamp.getTime() + i * interval);
    const forecastValue = level;
    
    // Calculate confidence interval (simplified)
    const std = calculateStd(timeSeries.map(d => d.value));
    const margin = 1.96 * std; // 95% confidence

    predictions.push({
      timestamp: forecastTimestamp,
      value: forecastValue,
      lower: forecastValue - margin,
      upper: forecastValue + margin
    });
  }

  // Detect trend
  const trendResult = detectTrend(timeSeries);

  // Detect seasonality
  const seasonality = await detectSeasonality(data, { dateColumn, valueColumn });

  return {
    predictions,
    method,
    horizon,
    confidence,
    trend: {
      direction: trendResult.direction as 'increasing' | 'decreasing' | 'stable',
      strength: trendResult.strength
    },
    seasonality
  };
}

/**
 * Detect trends in time series
 */
export async function detectTrends(
  data: any[],
  options: {
    dateColumn: string;
    valueColumns: string[];
    method?: 'linear' | 'polynomial' | 'moving_average';
  }
): Promise<TrendAnalysis[]> {
  const { dateColumn, valueColumns, method = 'linear' } = options;
  const results: TrendAnalysis[] = [];

  for (const column of valueColumns) {
    const timeSeries = data.map(row => ({
      timestamp: new Date(row[dateColumn]),
      value: Number(row[column])
    })).filter(d => !isNaN(d.value)).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const trendResult = detectTrend(timeSeries);

    results.push({
      column,
      trend: {
        type: 'linear',
        direction: trendResult.direction as 'increasing' | 'decreasing' | 'stable',
        strength: trendResult.strength,
        equation: trendResult.equation
      },
      summary: `${column} shows ${trendResult.direction} trend with strength ${(trendResult.strength * 100).toFixed(1)}%`
    });
  }

  return results;
}

/**
 * Detect seasonality patterns
 */
export async function detectSeasonality(
  data: any[],
  options: {
    dateColumn: string;
    valueColumn: string;
  }
): Promise<SeasonalityPattern> {
  const { dateColumn, valueColumn } = options;

  const timeSeries = data.map(row => ({
    timestamp: new Date(row[dateColumn]),
    value: Number(row[valueColumn])
  })).filter(d => !isNaN(d.value));

  // Simple seasonality detection using autocorrelation
  const values = timeSeries.map(d => d.value);
  const periods = [7, 30, 90, 365]; // daily, monthly, quarterly, yearly
  
  let maxCorrelation = 0;
  let detectedPeriod: any = null;

  for (const period of periods) {
    if (values.length < period * 2) continue;
    
    const correlation = calculateAutocorrelation(values, period);
    if (correlation > maxCorrelation) {
      maxCorrelation = correlation;
      detectedPeriod = period;
    }
  }

  const detected = maxCorrelation > 0.5;
  let periodName: any = 'custom';
  if (detectedPeriod === 7) periodName = 'weekly';
  else if (detectedPeriod === 30) periodName = 'monthly';
  else if (detectedPeriod === 90) periodName = 'quarterly';
  else if (detectedPeriod === 365) periodName = 'yearly';

  return {
    detected,
    period: detected ? periodName : undefined,
    strength: maxCorrelation
  };
}

/**
 * Detect change points in time series
 */
export async function detectChangePoints(
  data: any[],
  options: {
    dateColumn: string;
    valueColumn: string;
    sensitivity?: number;
  }
): Promise<ChangePoint[]> {
  const { dateColumn, valueColumn, sensitivity = 0.5 } = options;

  const timeSeries = data.map(row => ({
    timestamp: new Date(row[dateColumn]),
    value: Number(row[valueColumn])
  })).filter(d => !isNaN(d.value)).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const changePoints: ChangePoint[] = [];
  const windowSize = Math.max(5, Math.floor(timeSeries.length * 0.1));

  for (let i = windowSize; i < timeSeries.length - windowSize; i++) {
    const before = timeSeries.slice(i - windowSize, i).map(d => d.value);
    const after = timeSeries.slice(i, i + windowSize).map(d => d.value);

    const meanBefore = before.reduce((a, b) => a + b, 0) / before.length;
    const meanAfter = after.reduce((a, b) => a + b, 0) / after.length;
    const magnitude = Math.abs(meanAfter - meanBefore);
    const std = calculateStd([...before, ...after]);

    if (magnitude > sensitivity * std) {
      changePoints.push({
        index: i,
        timestamp: timeSeries[i].timestamp,
        type: 'mean_shift',
        confidence: Math.min(magnitude / std, 1),
        before: meanBefore,
        after: meanAfter,
        magnitude
      });
    }
  }

  return changePoints;
}

// Helper functions
function detectTimeInterval(timeSeries: Array<{ timestamp: Date; value: number }>): number {
  if (timeSeries.length < 2) return 86400000; // 1 day default
  const intervals = [];
  for (let i = 1; i < Math.min(10, timeSeries.length); i++) {
    intervals.push(timeSeries[i].timestamp.getTime() - timeSeries[i - 1].timestamp.getTime());
  }
  return intervals.reduce((a, b) => a + b, 0) / intervals.length;
}

function detectTrend(timeSeries: Array<{ timestamp: Date; value: number }>) {
  const values = timeSeries.map(d => d.value);
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  
  // Linear regression
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (values[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }
  
  const slope = numerator / denominator;
  const direction = slope > 0.01 ? 'increasing' : slope < -0.01 ? 'decreasing' : 'stable';
  const strength = Math.min(Math.abs(slope) / (meanY || 1), 1);

  return {
    type: 'linear' as const,
    direction,
    strength,
    equation: `y = ${slope.toFixed(4)}x + ${(meanY - slope * meanX).toFixed(4)}`
  };
}

function calculateStd(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function calculateAutocorrelation(values: number[], lag: number): number {
  if (values.length < lag * 2) return 0;
  
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < values.length - lag; i++) {
    numerator += (values[i] - mean) * (values[i + lag] - mean);
  }

  for (let i = 0; i < values.length; i++) {
    denominator += Math.pow(values[i] - mean, 2);
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

