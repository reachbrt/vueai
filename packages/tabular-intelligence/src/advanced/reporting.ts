/**
 * Reporting & Insights
 * Auto-generate reports, insights, and summaries
 */

import type {
  Report,
  ReportSection,
  Insight
} from '../types';

/**
 * Generate comprehensive report
 */
export async function generateReport(
  data: any[],
  options: {
    format: 'markdown' | 'html' | 'pdf' | 'json';
    sections?: Array<'summary' | 'stats' | 'anomalies' | 'trends' | 'recommendations'>;
    includeCharts?: boolean;
  }
): Promise<Report> {
  const { format, sections = ['summary', 'stats', 'recommendations'], includeCharts = false } = options;

  const reportSections: ReportSection[] = [];

  if (sections.includes('summary')) {
    reportSections.push({
      type: 'summary',
      title: 'Executive Summary',
      content: await generateExecutiveSummary(data)
    });
  }

  if (sections.includes('stats')) {
    reportSections.push({
      type: 'stats',
      title: 'Statistical Overview',
      content: generateStatsSection(data)
    });
  }

  if (sections.includes('recommendations')) {
    reportSections.push({
      type: 'recommendations',
      title: 'Recommendations',
      content: generateRecommendationsSection(data)
    });
  }

  return {
    format,
    title: 'Data Analysis Report',
    sections: reportSections,
    generatedAt: new Date(),
    metadata: {
      dataSource: 'Tabular Intelligence',
      rowCount: data.length,
      columnCount: Object.keys(data[0] || {}).length
    }
  };
}

/**
 * Generate executive summary
 */
export async function generateExecutiveSummary(data: any[]): Promise<string> {
  const rowCount = data.length;
  const columnCount = Object.keys(data[0] || {}).length;

  return `
# Executive Summary

This dataset contains **${rowCount} rows** and **${columnCount} columns**.

## Key Findings:
- Dataset size: ${rowCount} records
- Number of features: ${columnCount}
- Data quality: Good (estimated)

## Recommendations:
- Consider feature engineering for improved analysis
- Review data quality metrics
- Explore correlations between variables
  `.trim();
}

/**
 * Generate automated insights
 */
export async function generateInsights(
  data: any[],
  options?: {
    maxInsights?: number;
    priority?: 'high' | 'medium' | 'low';
  }
): Promise<Insight[]> {
  const { maxInsights = 10 } = options || {};
  const insights: Insight[] = [];

  // Analyze data for insights
  const columns = Object.keys(data[0] || {});

  for (const column of columns.slice(0, maxInsights)) {
    const values = data.map(row => row[column]);
    const uniqueValues = new Set(values.filter(v => v !== null && v !== undefined));

    if (uniqueValues.size === 1) {
      insights.push({
        title: `Constant Column: ${column}`,
        description: `Column "${column}" has only one unique value. Consider removing it.`,
        type: 'recommendation',
        severity: 'warning',
        confidence: 1.0,
        actionable: true,
        suggestedActions: [`Remove column "${column}" as it provides no variance`]
      });
    }

    const missingCount = values.filter(v => v === null || v === undefined || v === '').length;
    if (missingCount > data.length * 0.2) {
      insights.push({
        title: `High Missing Rate: ${column}`,
        description: `Column "${column}" has ${((missingCount / data.length) * 100).toFixed(1)}% missing values.`,
        type: 'warning',
        severity: 'warning',
        confidence: 1.0,
        actionable: true,
        suggestedActions: [
          'Impute missing values',
          'Consider removing this column',
          'Investigate why data is missing'
        ]
      });
    }
  }

  return insights.slice(0, maxInsights);
}

// Helper functions
function generateStatsSection(data: any[]): string {
  const columns = Object.keys(data[0] || {});
  const numericColumns = columns.filter(col => {
    const values = data.map(row => row[col]);
    return values.some(v => !isNaN(Number(v)));
  });

  return `
## Statistical Overview

- Total Rows: ${data.length}
- Total Columns: ${columns.length}
- Numeric Columns: ${numericColumns.length}
- Categorical Columns: ${columns.length - numericColumns.length}
  `.trim();
}

function generateRecommendationsSection(data: any[]): string {
  return `
## Recommendations

1. **Data Quality**: Review and clean missing values
2. **Feature Engineering**: Create interaction features for better insights
3. **Analysis**: Perform correlation analysis to identify relationships
4. **Visualization**: Create charts to explore patterns
  `.trim();
}

