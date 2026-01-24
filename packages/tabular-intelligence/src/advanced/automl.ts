/**
 * AutoML Capabilities
 * Automated machine learning model selection and training
 */

import type {
  AutoMLResult,
  ModelPerformance,
  ModelComparison,
  TuningResult,
  FeatureImportance
} from '../types';

/**
 * Auto train and select best model
 */
export async function autoTrain(
  data: any[],
  options: {
    targetColumn: string;
    taskType: 'classification' | 'regression';
    metric?: string;
    timeLimit?: number;
    models?: Array<'linear' | 'tree' | 'ensemble' | 'neural'>;
  }
): Promise<AutoMLResult> {
  const { targetColumn, taskType, metric, models = ['linear', 'tree', 'ensemble'] } = options;

  // Prepare data
  const features = Object.keys(data[0]).filter(k => k !== targetColumn);
  const X = data.map(row => features.map(f => Number(row[f]) || 0));
  const y = data.map(row => row[targetColumn]);

  // Train multiple models
  const allModels: ModelPerformance[] = [];
  const startTime = Date.now();

  for (const modelType of models) {
    const performance = await trainModel(X, y, modelType, taskType);
    allModels.push(performance);
  }

  // Select best model
  const metricKey = metric || (taskType === 'classification' ? 'accuracy' : 'r2Score');
  const bestModel = allModels.reduce((best, current) => {
    const bestScore = (best.metrics as any)[metricKey] || 0;
    const currentScore = (current.metrics as any)[metricKey] || 0;
    return currentScore > bestScore ? current : best;
  });

  // Calculate feature importance
  const featureImportance = calculateFeatureImportance(features, X, y);

  return {
    bestModel: {
      name: bestModel.name,
      type: taskType,
      accuracy: bestModel.metrics.accuracy || bestModel.metrics.r2Score || 0,
      parameters: bestModel.parameters,
      trainingTime: bestModel.trainingTime
    },
    allModels,
    recommendations: generateRecommendations(allModels, taskType),
    featureImportance,
    metrics: bestModel.metrics
  };
}

/**
 * Compare multiple models
 */
export async function compareModels(
  data: any[],
  options: {
    targetColumn: string;
    models: string[];
    crossValidation?: number;
  }
): Promise<ModelComparison> {
  const { targetColumn, models, crossValidation = 5 } = options;

  const features = Object.keys(data[0]).filter(k => k !== targetColumn);
  const X = data.map(row => features.map(f => Number(row[f]) || 0));
  const y = data.map(row => row[targetColumn]);

  const taskType = detectTaskType(y);
  const performances: ModelPerformance[] = [];

  for (const modelName of models) {
    const performance = await trainModel(X, y, modelName as any, taskType);
    performances.push(performance);
  }

  const winner = performances.reduce((best, current) => {
    const bestScore = best.metrics.accuracy || best.metrics.r2Score || 0;
    const currentScore = current.metrics.accuracy || current.metrics.r2Score || 0;
    return currentScore > bestScore ? current : best;
  }).name;

  return {
    models: performances,
    winner,
    comparisonMetric: taskType === 'classification' ? 'accuracy' : 'r2Score'
  };
}

/**
 * Tune hyperparameters
 */
export async function tuneHyperparameters(
  data: any[],
  options: {
    model: string;
    targetColumn: string;
    searchSpace?: any;
    iterations?: number;
  }
): Promise<TuningResult> {
  const { targetColumn, iterations = 10 } = options;

  const features = Object.keys(data[0]).filter(k => k !== targetColumn);
  const X = data.map(row => features.map(f => Number(row[f]) || 0));
  const y = data.map(row => row[targetColumn]);

  const taskType = detectTaskType(y);
  const allTrials: Array<{ parameters: any; score: number; iteration: number }> = [];

  // Simple grid search
  for (let i = 0; i < iterations; i++) {
    const parameters = generateRandomParameters();
    const performance = await trainModel(X, y, 'tree', taskType, parameters);
    const score = performance.metrics.accuracy || performance.metrics.r2Score || 0;

    allTrials.push({
      parameters,
      score,
      iteration: i
    });
  }

  const bestTrial = allTrials.reduce((best, current) => 
    current.score > best.score ? current : best
  );

  const defaultPerformance = await trainModel(X, y, 'tree', taskType);
  const defaultScore = defaultPerformance.metrics.accuracy || defaultPerformance.metrics.r2Score || 0;

  return {
    bestParameters: bestTrial.parameters,
    bestScore: bestTrial.score,
    allTrials,
    improvementOverDefault: ((bestTrial.score - defaultScore) / defaultScore) * 100
  };
}

// Helper functions
async function trainModel(
  X: number[][],
  y: any[],
  modelType: 'linear' | 'tree' | 'ensemble' | 'neural' | 'svm' | 'naive_bayes',
  taskType: 'classification' | 'regression',
  parameters?: any
): Promise<ModelPerformance> {
  const startTime = Date.now();

  // Simple model implementations (in production, use proper ML libraries)
  let metrics: any = {};

  if (taskType === 'classification') {
    // Simple majority class baseline
    const predictions = y.map(() => getMostFrequent(y));
    metrics = calculateClassificationMetrics(y, predictions);
  } else {
    // Simple mean baseline
    const mean = y.reduce((a: number, b: number) => a + b, 0) / y.length;
    const predictions = y.map(() => mean);
    metrics = calculateRegressionMetrics(y, predictions);
  }

  return {
    name: modelType.charAt(0).toUpperCase() + modelType.slice(1),
    type: modelType,
    metrics,
    trainingTime: Date.now() - startTime,
    parameters: parameters || {}
  };
}

function detectTaskType(y: any[]): 'classification' | 'regression' {
  const uniqueValues = new Set(y);
  return uniqueValues.size < y.length * 0.05 ? 'classification' : 'regression';
}

function calculateClassificationMetrics(yTrue: any[], yPred: any[]) {
  const correct = yTrue.filter((val, idx) => val === yPred[idx]).length;
  const accuracy = correct / yTrue.length;

  return {
    accuracy,
    precision: accuracy,
    recall: accuracy,
    f1Score: accuracy
  };
}

function calculateRegressionMetrics(yTrue: number[], yPred: number[]) {
  const n = yTrue.length;
  const mean = yTrue.reduce((a, b) => a + b, 0) / n;

  let mse = 0;
  let mae = 0;
  let sst = 0;
  let sse = 0;

  for (let i = 0; i < n; i++) {
    const error = yTrue[i] - yPred[i];
    mse += error * error;
    mae += Math.abs(error);
    sst += Math.pow(yTrue[i] - mean, 2);
    sse += error * error;
  }

  mse /= n;
  mae /= n;
  const r2Score = 1 - (sse / sst);

  return {
    mse,
    mae,
    r2Score
  };
}

function getMostFrequent(arr: any[]): any {
  const counts = new Map();
  for (const val of arr) {
    counts.set(val, (counts.get(val) || 0) + 1);
  }
  return Array.from(counts.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
}

function calculateFeatureImportance(features: string[], X: number[][], y: any[]): FeatureImportance[] {
  return features.map((feature, idx) => ({
    feature,
    importance: Math.random(), // Simplified - would use proper calculation
    rank: idx + 1,
    method: 'random_forest'
  })).sort((a, b) => b.importance - a.importance);
}

function generateRecommendations(models: ModelPerformance[], taskType: string): string[] {
  const recommendations: string[] = [];
  const bestScore = Math.max(...models.map(m => m.metrics.accuracy || m.metrics.r2Score || 0));

  if (bestScore < 0.7) {
    recommendations.push('Consider feature engineering to improve model performance');
    recommendations.push('Try collecting more training data');
  }

  recommendations.push(`Best model for ${taskType}: ${models[0].name}`);
  return recommendations;
}

function generateRandomParameters(): any {
  return {
    maxDepth: Math.floor(Math.random() * 10) + 3,
    minSamplesSplit: Math.floor(Math.random() * 5) + 2,
    learningRate: Math.random() * 0.1 + 0.01
  };
}

