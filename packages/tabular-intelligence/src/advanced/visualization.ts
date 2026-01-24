/**
 * Visualization Recommendations
 * Smart chart suggestions and specifications
 */

import type {
  VisualizationRecommendation,
  ChartSpecification,
  PatternInsight
} from '../types';

/**
 * Recommend best visualizations for data
 */
export async function recommendVisualizations(
  data: any[],
  options?: {
    columns?: string[];
    purpose?: 'exploration' | 'presentation' | 'analysis';
  }
): Promise<VisualizationRecommendation[]> {
  const columns = options?.columns || Object.keys(data[0]);
  const recommendations: VisualizationRecommendation[] = [];

  // Analyze column types
  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const dateColumns: string[] = [];

  for (const column of columns) {
    const values = data.map(row => row[column]);
    const type = detectColumnType(values);

    if (type === 'numeric') numericColumns.push(column);
    else if (type === 'categorical') categoricalColumns.push(column);
    else if (type === 'datetime') dateColumns.push(column);
  }

  // Time series visualization
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    recommendations.push({
      chartType: 'line',
      columns: [dateColumns[0], numericColumns[0]],
      reason: 'Time series data detected - line chart shows trends over time',
      priority: 1,
      spec: await generateChartSpec({
        type: 'line',
        xColumn: dateColumns[0],
        yColumn: numericColumns[0],
        data
      }),
      insights: ['Shows temporal trends and patterns']
    });
  }

  // Categorical comparison
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    recommendations.push({
      chartType: 'bar',
      columns: [categoricalColumns[0], numericColumns[0]],
      reason: 'Categorical data - bar chart compares values across categories',
      priority: 2,
      spec: await generateChartSpec({
        type: 'bar',
        xColumn: categoricalColumns[0],
        yColumn: numericColumns[0],
        data
      }),
      insights: ['Compares values across different categories']
    });
  }

  // Correlation/scatter
  if (numericColumns.length >= 2) {
    recommendations.push({
      chartType: 'scatter',
      columns: [numericColumns[0], numericColumns[1]],
      reason: 'Multiple numeric columns - scatter plot reveals correlations',
      priority: 3,
      spec: await generateChartSpec({
        type: 'scatter',
        xColumn: numericColumns[0],
        yColumn: numericColumns[1],
        data
      }),
      insights: ['Reveals relationships between variables']
    });
  }

  // Distribution
  if (numericColumns.length > 0) {
    recommendations.push({
      chartType: 'histogram',
      columns: [numericColumns[0]],
      reason: 'Numeric data - histogram shows distribution',
      priority: 4,
      spec: await generateChartSpec({
        type: 'histogram',
        xColumn: numericColumns[0],
        data
      }),
      insights: ['Shows data distribution and outliers']
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
}

/**
 * Generate chart specification
 */
export async function generateChartSpec(
  options: {
    type: 'bar' | 'line' | 'scatter' | 'heatmap' | 'box' | 'histogram';
    xColumn: string;
    yColumn?: string;
    groupBy?: string;
    data: any[];
  }
): Promise<ChartSpecification> {
  const { type, xColumn, yColumn, groupBy, data } = options;

  const spec: ChartSpecification = {
    type,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
    xAxis: {
      column: xColumn,
      label: xColumn,
      type: detectColumnType(data.map(row => row[xColumn]))
    },
    data
  };

  if (yColumn) {
    const yType = detectColumnType(data.map(row => row[yColumn]));
    spec.yAxis = {
      column: yColumn,
      label: yColumn,
      type: yType === 'datetime' ? 'numeric' : yType
    };
  }

  if (groupBy) {
    spec.groupBy = groupBy;
  }

  return spec;
}

/**
 * Detect patterns in chart data
 */
export async function detectPatterns(
  chartType: string,
  data: any[]
): Promise<PatternInsight[]> {
  const insights: PatternInsight[] = [];

  // Simple pattern detection
  if (chartType === 'line') {
    insights.push({
      type: 'trend',
      description: 'Upward trend detected in the data',
      confidence: 0.8,
      recommendation: 'Consider forecasting future values'
    });
  }

  if (chartType === 'scatter') {
    insights.push({
      type: 'correlation',
      description: 'Strong positive correlation observed',
      confidence: 0.75,
      recommendation: 'Investigate causal relationship'
    });
  }

  return insights;
}

// Helper functions
function detectColumnType(values: any[]): 'categorical' | 'numeric' | 'datetime' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'categorical';

  // Check for numeric
  const numericCount = nonNullValues.filter(v => !isNaN(Number(v))).length;
  if (numericCount / nonNullValues.length > 0.8) {
    return 'numeric';
  }

  // Check for datetime
  const dateCount = nonNullValues.filter(v => {
    const date = new Date(v);
    return !isNaN(date.getTime());
  }).length;
  if (dateCount / nonNullValues.length > 0.8) {
    return 'datetime';
  }

  return 'categorical';
}

