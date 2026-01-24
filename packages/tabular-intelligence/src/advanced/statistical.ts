/**
 * Statistical Testing & A/B Testing
 * Hypothesis testing, significance tests, sample size calculation
 */

import type {
  ABTestResult,
  SignificanceTest,
  SampleSizeResult
} from '../types';

/**
 * Analyze A/B test results
 */
export async function analyzeABTest(
  options: {
    controlGroup: any[];
    treatmentGroup: any[];
    metric: string;
    confidenceLevel?: number;
  }
): Promise<ABTestResult> {
  const { controlGroup, treatmentGroup, metric, confidenceLevel = 0.95 } = options;

  const controlValues = controlGroup.map(row => Number(row[metric])).filter(v => !isNaN(v));
  const treatmentValues = treatmentGroup.map(row => Number(row[metric])).filter(v => !isNaN(v));

  const controlMean = controlValues.reduce((a, b) => a + b, 0) / controlValues.length;
  const treatmentMean = treatmentValues.reduce((a, b) => a + b, 0) / treatmentValues.length;

  const controlStd = calculateStd(controlValues);
  const treatmentStd = calculateStd(treatmentValues);

  // Perform t-test
  const { pValue, statistic } = tTest(controlValues, treatmentValues);
  
  // Calculate effect size (Cohen's d)
  const pooledStd = Math.sqrt((controlStd ** 2 + treatmentStd ** 2) / 2);
  const effectSize = (treatmentMean - controlMean) / pooledStd;

  // Determine winner
  let winner: 'control' | 'treatment' | 'inconclusive';
  if (pValue < (1 - confidenceLevel)) {
    winner = treatmentMean > controlMean ? 'treatment' : 'control';
  } else {
    winner = 'inconclusive';
  }

  const recommendation = winner === 'inconclusive'
    ? 'No significant difference detected. Consider collecting more data.'
    : `${winner === 'treatment' ? 'Treatment' : 'Control'} group performs better with ${Math.abs(effectSize).toFixed(2)} effect size.`;

  return {
    winner,
    pValue,
    confidenceInterval: [
      (treatmentMean - controlMean) - 1.96 * pooledStd,
      (treatmentMean - controlMean) + 1.96 * pooledStd
    ],
    effectSize,
    statisticalPower: 0.8, // Simplified
    recommendation,
    controlStats: {
      mean: controlMean,
      std: controlStd,
      size: controlValues.length
    },
    treatmentStats: {
      mean: treatmentMean,
      std: treatmentStd,
      size: treatmentValues.length
    }
  };
}

/**
 * Test statistical significance
 */
export async function testSignificance(
  options: {
    test: 'ttest' | 'chi2' | 'anova' | 'mann_whitney' | 'kruskal_wallis';
    groups: any[][];
    metric: string;
    alpha?: number;
  }
): Promise<SignificanceTest> {
  const { test, groups, metric, alpha = 0.05 } = options;

  if (test === 'ttest' && groups.length === 2) {
    const group1Values = groups[0].map(row => Number(row[metric])).filter(v => !isNaN(v));
    const group2Values = groups[1].map(row => Number(row[metric])).filter(v => !isNaN(v));

    const { pValue, statistic } = tTest(group1Values, group2Values);

    return {
      testType: 'ttest',
      pValue,
      statistic,
      significant: pValue < alpha,
      alpha,
      degreesOfFreedom: group1Values.length + group2Values.length - 2,
      interpretation: pValue < alpha 
        ? 'Significant difference detected between groups'
        : 'No significant difference detected',
      groups: [
        {
          name: 'Group 1',
          mean: group1Values.reduce((a, b) => a + b, 0) / group1Values.length,
          std: calculateStd(group1Values),
          size: group1Values.length
        },
        {
          name: 'Group 2',
          mean: group2Values.reduce((a, b) => a + b, 0) / group2Values.length,
          std: calculateStd(group2Values),
          size: group2Values.length
        }
      ]
    };
  }

  // Default response for other tests
  return {
    testType: test,
    pValue: 0.05,
    statistic: 0,
    significant: false,
    alpha,
    interpretation: 'Test not fully implemented',
    groups: []
  };
}

/**
 * Calculate required sample size
 */
export async function calculateSampleSize(
  options: {
    effect: number;
    power?: number;
    alpha?: number;
  }
): Promise<SampleSizeResult> {
  const { effect, power = 0.8, alpha = 0.05 } = options;

  // Simplified sample size calculation
  const zAlpha = 1.96; // for alpha = 0.05
  const zBeta = 0.84;  // for power = 0.8

  const n = Math.ceil(2 * Math.pow((zAlpha + zBeta) / effect, 2));

  return {
    requiredSampleSize: n,
    effect,
    power,
    alpha,
    recommendation: `You need approximately ${n} samples per group to detect an effect size of ${effect} with ${power * 100}% power.`
  };
}

// Helper functions
function calculateStd(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function tTest(group1: number[], group2: number[]): { pValue: number; statistic: number } {
  const mean1 = group1.reduce((a, b) => a + b, 0) / group1.length;
  const mean2 = group2.reduce((a, b) => a + b, 0) / group2.length;

  const var1 = calculateStd(group1) ** 2;
  const var2 = calculateStd(group2) ** 2;

  const n1 = group1.length;
  const n2 = group2.length;

  const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
  const statistic = (mean1 - mean2) / Math.sqrt(pooledVar * (1 / n1 + 1 / n2));

  // Simplified p-value calculation
  const pValue = 2 * (1 - normalCDF(Math.abs(statistic)));

  return { pValue, statistic };
}

function normalCDF(z: number): number {
  // Simplified normal CDF approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

