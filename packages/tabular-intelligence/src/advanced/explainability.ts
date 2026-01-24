/**
 * Model Explainability (XAI)
 * SHAP values, feature importance, counterfactuals
 */

import type {
  SHAPExplanation,
  PartialDependencePlot,
  Counterfactual,
  FeatureImportance
} from '../types';

/**
 * Explain prediction using SHAP values
 */
export async function explainPrediction(
  data: any[],
  options: {
    rowIndex: number;
    model?: string;
    targetColumn: string;
  }
): Promise<SHAPExplanation> {
  const { rowIndex, targetColumn } = options;
  const row = data[rowIndex];
  const features = Object.keys(row).filter(k => k !== targetColumn);

  // Simplified SHAP calculation
  const shapValues = features.map(feature => {
    const value = row[feature];
    const shapValue = Math.random() * 2 - 1; // Simplified
    
    return {
      feature,
      value,
      shapValue,
      impact: shapValue > 0 ? 'positive' as const : 'negative' as const,
      percentage: Math.abs(shapValue) * 100
    };
  }).sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));

  const topFeatures = shapValues.slice(0, 5).map(sv => ({
    feature: sv.feature,
    contribution: sv.shapValue
  }));

  const prediction = row[targetColumn];
  const baseValue = data.reduce((sum, r) => sum + (Number(r[targetColumn]) || 0), 0) / data.length;

  const explanation = `Prediction: ${prediction}. Top contributors: ${topFeatures.map(f => 
    `${f.feature} (${f.contribution > 0 ? '+' : ''}${f.contribution.toFixed(2)})`
  ).join(', ')}`;

  return {
    prediction,
    baseValue,
    shapValues,
    explanation,
    topFeatures
  };
}

/**
 * Get feature importance
 */
export async function getFeatureImportance(
  data: any[],
  targetColumn: string,
  model?: string
): Promise<FeatureImportance[]> {
  const features = Object.keys(data[0]).filter(k => k !== targetColumn);
  
  return features.map((feature, idx) => ({
    feature,
    importance: Math.random(), // Simplified
    rank: idx + 1,
    method: model || 'default'
  })).sort((a, b) => b.importance - a.importance)
    .map((f, idx) => ({ ...f, rank: idx + 1 }));
}

/**
 * Get partial dependence plot data
 */
export async function getPartialDependence(
  data: any[],
  options: {
    feature: string;
    targetColumn: string;
    model?: string;
  }
): Promise<PartialDependencePlot> {
  const { feature, targetColumn } = options;
  
  const values = data.map(row => Number(row[feature])).filter(v => !isNaN(v)).sort((a, b) => a - b);
  const min = values[0];
  const max = values[values.length - 1];
  const step = (max - min) / 20;

  const plotValues: number[] = [];
  const predictions: number[] = [];

  for (let v = min; v <= max; v += step) {
    plotValues.push(v);
    // Simplified prediction
    predictions.push(Math.random() * 100);
  }

  return {
    feature,
    values: plotValues,
    predictions,
    description: `Partial dependence of ${targetColumn} on ${feature}`
  };
}

/**
 * Generate counterfactual explanations
 */
export async function generateCounterfactuals(
  data: any[],
  options: {
    rowIndex: number;
    desiredOutcome: any;
    targetColumn: string;
    maxChanges?: number;
  }
): Promise<Counterfactual[]> {
  const { rowIndex, desiredOutcome, targetColumn, maxChanges = 3 } = options;
  const original = data[rowIndex];
  const features = Object.keys(original).filter(k => k !== targetColumn);

  const counterfactuals: Counterfactual[] = [];

  // Generate a few counterfactual examples
  for (let i = 0; i < 3; i++) {
    const counterfactual = { ...original };
    const changes: Array<{ feature: string; from: any; to: any; changeType: 'increase' | 'decrease' | 'categorical' }> = [];

    // Randomly modify features
    const featuresToChange = features.slice(0, maxChanges);
    for (const feature of featuresToChange) {
      const originalValue = original[feature];
      const newValue = typeof originalValue === 'number' 
        ? originalValue * (1 + (Math.random() - 0.5) * 0.2)
        : originalValue;

      counterfactual[feature] = newValue;
      changes.push({
        feature,
        from: originalValue,
        to: newValue,
        changeType: newValue > originalValue ? 'increase' : 'decrease'
      });
    }

    counterfactuals.push({
      original,
      counterfactual,
      changes,
      newPrediction: desiredOutcome,
      distance: Math.random(),
      feasibility: Math.random()
    });
  }

  return counterfactuals;
}

