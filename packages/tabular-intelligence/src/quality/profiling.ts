/**
 * Data Quality Profiling
 * Comprehensive data profiling and quality assessment
 */

import type {
  DataProfile,
  ColumnProfile,
  DataQualityReport,
  DataIssue,
  CleaningRecommendation,
  TableSchema,
  CorrelationMatrix
} from '../types';

/**
 * Profile dataset comprehensively
 */
export async function profileData(
  data: any[],
  options?: {
    includeDistributions?: boolean;
    detectDataTypes?: boolean;
    findPatterns?: boolean;
  }
): Promise<DataProfile> {
  if (!data || data.length === 0) {
    throw new Error('Cannot profile empty dataset');
  }

  const columns = Object.keys(data[0]);
  const columnProfiles: ColumnProfile[] = [];

  // Profile each column
  for (const column of columns) {
    const profile = await profileColumn(data, column, options);
    columnProfiles.push(profile);
  }

  // Calculate correlations for numeric columns
  const numericColumns = columnProfiles
    .filter(c => c.type === 'numeric')
    .map(c => c.name);
  
  const correlations = calculateCorrelations(data, numericColumns);

  // Detect duplicates
  const duplicates = detectDuplicates(data);

  // Calculate memory usage
  const memoryUsage = estimateMemoryUsage(data);

  // Generate warnings
  const warnings = generateWarnings(columnProfiles, duplicates.count);

  // Calculate overall quality score
  const qualityScore = calculateQualityScore(columnProfiles, duplicates.percentage);

  return {
    overview: {
      totalRows: data.length,
      totalColumns: columns.length,
      memoryUsage,
      duplicateRows: duplicates.count,
      duplicatePercentage: duplicates.percentage
    },
    columns: columnProfiles,
    correlations,
    warnings,
    qualityScore
  };
}

/**
 * Profile a single column
 */
async function profileColumn(
  data: any[],
  column: string,
  options?: any
): Promise<ColumnProfile> {
  const values = data.map(row => row[column]);
  const type = detectColumnType(values);
  
  // Count missing values
  const missingCount = values.filter(v => v === null || v === undefined || v === '').length;
  const missingPercentage = (missingCount / values.length) * 100;

  // Count unique values
  const uniqueValues = new Set(values.filter(v => v !== null && v !== undefined && v !== ''));
  const uniqueCount = uniqueValues.size;
  const uniquePercentage = (uniqueCount / values.length) * 100;

  const profile: ColumnProfile = {
    name: column,
    type,
    missingCount,
    missingPercentage,
    uniqueCount,
    uniquePercentage,
    quality: {
      score: 0,
      issues: [],
      recommendations: []
    }
  };

  // Type-specific profiling
  if (type === 'numeric') {
    profile.stats = calculateNumericStats(values);
  } else if (type === 'categorical') {
    profile.categories = analyzeCategorical(values);
  } else if (type === 'datetime') {
    profile.dateRange = analyzeDateRange(values);
  }

  // Assess column quality
  profile.quality = assessColumnQuality(profile);

  return profile;
}

/**
 * Detect column data type
 */
function detectColumnType(values: any[]): 'numeric' | 'categorical' | 'datetime' | 'text' | 'boolean' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'text';

  // Check for boolean
  const uniqueValues = new Set(nonNullValues);
  if (uniqueValues.size <= 2 && 
      Array.from(uniqueValues).every(v => 
        v === true || v === false || v === 'true' || v === 'false' || v === 0 || v === 1
      )) {
    return 'boolean';
  }

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

  // Check for categorical (low cardinality)
  if (uniqueValues.size < nonNullValues.length * 0.5) {
    return 'categorical';
  }

  return 'text';
}

/**
 * Calculate numeric statistics
 */
function calculateNumericStats(values: any[]) {
  const numericValues = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => Number(v))
    .filter(v => !isNaN(v));

  if (numericValues.length === 0) return undefined;

  const sorted = [...numericValues].sort((a, b) => a - b);
  const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  // Standard deviation
  const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
  const std = Math.sqrt(variance);

  // Quartiles
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  // Outliers (using IQR method)
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  const outliers = numericValues.filter(v => v < lowerBound || v > upperBound).length;

  // Skewness
  const skewness = numericValues.reduce((sum, val) =>
    sum + Math.pow((val - mean) / std, 3), 0) / numericValues.length;

  // Kurtosis
  const kurtosis = numericValues.reduce((sum, val) =>
    sum + Math.pow((val - mean) / std, 4), 0) / numericValues.length - 3;

  return {
    mean,
    median,
    std,
    min,
    max,
    skewness,
    kurtosis,
    outliers,
    q1,
    q3,
    iqr
  };
}

/**
 * Analyze categorical column
 */
function analyzeCategorical(values: any[]) {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  const valueCounts = new Map<any, number>();

  for (const value of nonNullValues) {
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  const topValues = Array.from(valueCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({
      value,
      count,
      percentage: (count / nonNullValues.length) * 100
    }));

  // Calculate entropy
  const entropy = Array.from(valueCounts.values())
    .map(count => {
      const p = count / nonNullValues.length;
      return -p * Math.log2(p);
    })
    .reduce((a, b) => a + b, 0);

  // Determine cardinality
  const uniqueRatio = valueCounts.size / nonNullValues.length;
  let cardinality: 'low' | 'medium' | 'high';
  if (uniqueRatio < 0.1) cardinality = 'low';
  else if (uniqueRatio < 0.5) cardinality = 'medium';
  else cardinality = 'high';

  return {
    topValues,
    cardinality,
    entropy
  };
}

/**
 * Analyze date range
 */
function analyzeDateRange(values: any[]) {
  const dates = values
    .filter(v => v !== null && v !== undefined && v !== '')
    .map(v => new Date(v))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return undefined;

  const earliest = dates[0];
  const latest = dates[dates.length - 1];
  const spanMs = latest.getTime() - earliest.getTime();
  const spanDays = Math.floor(spanMs / (1000 * 60 * 60 * 24));

  let span: string;
  if (spanDays < 7) span = `${spanDays} days`;
  else if (spanDays < 365) span = `${Math.floor(spanDays / 7)} weeks`;
  else span = `${Math.floor(spanDays / 365)} years`;

  return {
    earliest,
    latest,
    span
  };
}

/**
 * Assess column quality
 */
function assessColumnQuality(profile: ColumnProfile): { score: number; issues: string[]; recommendations: string[] } {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Missing values
  if (profile.missingPercentage > 50) {
    issues.push(`High missing rate: ${profile.missingPercentage.toFixed(1)}%`);
    recommendations.push('Consider removing this column or imputing missing values');
    score -= 30;
  } else if (profile.missingPercentage > 20) {
    issues.push(`Moderate missing rate: ${profile.missingPercentage.toFixed(1)}%`);
    recommendations.push('Consider imputing missing values');
    score -= 15;
  } else if (profile.missingPercentage > 5) {
    issues.push(`Some missing values: ${profile.missingPercentage.toFixed(1)}%`);
    score -= 5;
  }

  // Uniqueness
  if (profile.uniquePercentage === 100 && profile.type !== 'text') {
    issues.push('All values are unique - might be an ID column');
    recommendations.push('Consider if this column is useful for analysis');
  }

  if (profile.uniqueCount === 1) {
    issues.push('Only one unique value - constant column');
    recommendations.push('Consider removing this column');
    score -= 40;
  }

  // Numeric-specific
  if (profile.stats) {
    if (profile.stats.outliers > profile.missingCount * 0.1) {
      issues.push(`${profile.stats.outliers} outliers detected`);
      recommendations.push('Consider outlier treatment');
      score -= 10;
    }

    if (Math.abs(profile.stats.skewness) > 2) {
      issues.push(`High skewness: ${profile.stats.skewness.toFixed(2)}`);
      recommendations.push('Consider log transformation');
      score -= 5;
    }
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations
  };
}

/**
 * Calculate correlations between numeric columns
 */
function calculateCorrelations(data: any[], columns: string[]): CorrelationMatrix {
  if (columns.length < 2) {
    return {
      columns: [],
      matrix: [],
      significant: []
    };
  }

  const matrix: number[][] = [];
  const significant: Array<{ col1: string; col2: string; correlation: number }> = [];

  for (let i = 0; i < columns.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < columns.length; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else {
        const correlation = calculatePearsonCorrelation(
          data.map(row => Number(row[columns[i]])),
          data.map(row => Number(row[columns[j]]))
        );
        matrix[i][j] = correlation;

        if (i < j && Math.abs(correlation) > 0.7) {
          significant.push({
            col1: columns[i],
            col2: columns[j],
            correlation
          });
        }
      }
    }
  }

  return {
    columns,
    matrix,
    significant
  };
}

/**
 * Calculate Pearson correlation coefficient
 */
function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const validPairs = x.map((xi, i) => [xi, y[i]])
    .filter(([xi, yi]) => !isNaN(xi) && !isNaN(yi));

  if (validPairs.length < 2) return 0;

  const xValues = validPairs.map(p => p[0]);
  const yValues = validPairs.map(p => p[1]);

  const meanX = xValues.reduce((a, b) => a + b, 0) / xValues.length;
  const meanY = yValues.reduce((a, b) => a + b, 0) / yValues.length;

  let numerator = 0;
  let sumXSquared = 0;
  let sumYSquared = 0;

  for (let i = 0; i < xValues.length; i++) {
    const xDiff = xValues[i] - meanX;
    const yDiff = yValues[i] - meanY;
    numerator += xDiff * yDiff;
    sumXSquared += xDiff * xDiff;
    sumYSquared += yDiff * yDiff;
  }

  const denominator = Math.sqrt(sumXSquared * sumYSquared);
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Detect duplicate rows
 */
function detectDuplicates(data: any[]): { count: number; percentage: number } {
  const seen = new Set<string>();
  let duplicates = 0;

  for (const row of data) {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      duplicates++;
    } else {
      seen.add(key);
    }
  }

  return {
    count: duplicates,
    percentage: (duplicates / data.length) * 100
  };
}

/**
 * Estimate memory usage
 */
function estimateMemoryUsage(data: any[]): string {
  const jsonString = JSON.stringify(data);
  const bytes = new Blob([jsonString]).size;

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

/**
 * Generate warnings
 */
function generateWarnings(profiles: ColumnProfile[], duplicatePercentage: number): string[] {
  const warnings: string[] = [];

  if (duplicatePercentage > 10) {
    warnings.push(`High duplicate rate: ${duplicatePercentage.toFixed(1)}% of rows are duplicates`);
  }

  const lowQualityColumns = profiles.filter(p => p.quality.score < 50);
  if (lowQualityColumns.length > 0) {
    warnings.push(`${lowQualityColumns.length} columns have low quality scores`);
  }

  const highMissingColumns = profiles.filter(p => p.missingPercentage > 50);
  if (highMissingColumns.length > 0) {
    warnings.push(`${highMissingColumns.length} columns have >50% missing values`);
  }

  return warnings;
}

/**
 * Calculate overall quality score
 */
function calculateQualityScore(profiles: ColumnProfile[], duplicatePercentage: number): number {
  const avgColumnScore = profiles.reduce((sum, p) => sum + p.quality.score, 0) / profiles.length;
  const duplicatePenalty = Math.min(duplicatePercentage, 20);
  return Math.max(0, avgColumnScore - duplicatePenalty);
}

/**
 * Assess data quality
 */
export async function assessDataQuality(data: any[]): Promise<DataQualityReport> {
  const profile = await profileData(data);
  const issues = await detectDataIssues(data, profile);

  // Calculate dimension scores
  const completeness = 100 - (profile.columns.reduce((sum, c) => sum + c.missingPercentage, 0) / profile.columns.length);
  const uniqueness = 100 - profile.overview.duplicatePercentage;
  const consistency = profile.columns.filter(c => c.quality.score > 70).length / profile.columns.length * 100;
  const validity = profile.columns.filter(c => c.quality.issues.length === 0).length / profile.columns.length * 100;
  const accuracy = (completeness + consistency + validity) / 3;

  const overallScore = (completeness + accuracy + consistency + validity + uniqueness) / 5;

  const recommendations = generateRecommendations(issues, profile);

  return {
    overallScore,
    dimensions: {
      completeness,
      accuracy,
      consistency,
      validity,
      uniqueness
    },
    issues,
    recommendations,
    timestamp: new Date()
  };
}

/**
 * Detect data issues
 */
export async function detectDataIssues(data: any[], profile?: DataProfile): Promise<DataIssue[]> {
  if (!profile) {
    profile = await profileData(data);
  }

  const issues: DataIssue[] = [];

  for (const column of profile.columns) {
    // Missing values
    if (column.missingPercentage > 20) {
      issues.push({
        severity: column.missingPercentage > 50 ? 'critical' : 'warning',
        type: 'missing_values',
        column: column.name,
        description: `${column.missingPercentage.toFixed(1)}% missing values in column "${column.name}"`,
        affectedRows: column.missingCount,
        suggestedFix: 'Impute missing values using mean, median, or ML-based imputation'
      });
    }

    // Outliers
    if (column.stats && column.stats.outliers > 0) {
      issues.push({
        severity: 'warning',
        type: 'outliers',
        column: column.name,
        description: `${column.stats.outliers} outliers detected in column "${column.name}"`,
        affectedRows: column.stats.outliers,
        suggestedFix: 'Remove outliers or cap values using IQR method'
      });
    }
  }

  // Duplicates
  if (profile.overview.duplicateRows > 0) {
    issues.push({
      severity: profile.overview.duplicatePercentage > 10 ? 'critical' : 'warning',
      type: 'duplicates',
      description: `${profile.overview.duplicateRows} duplicate rows found`,
      affectedRows: profile.overview.duplicateRows,
      suggestedFix: 'Remove duplicate rows or aggregate them'
    });
  }

  return issues;
}

/**
 * Generate cleaning recommendations
 */
function generateRecommendations(issues: DataIssue[], profile: DataProfile): string[] {
  const recommendations: string[] = [];

  const missingIssues = issues.filter(i => i.type === 'missing_values');
  if (missingIssues.length > 0) {
    recommendations.push('Impute missing values using appropriate strategies (mean, median, KNN, or ML-based)');
  }

  const outlierIssues = issues.filter(i => i.type === 'outliers');
  if (outlierIssues.length > 0) {
    recommendations.push('Handle outliers using IQR method, capping, or transformation');
  }

  const duplicateIssues = issues.filter(i => i.type === 'duplicates');
  if (duplicateIssues.length > 0) {
    recommendations.push('Remove or aggregate duplicate rows');
  }

  if (profile.qualityScore < 70) {
    recommendations.push('Overall data quality is below acceptable threshold - consider data cleaning pipeline');
  }

  return recommendations;
}

/**
 * Suggest cleaning steps
 */
export async function suggestCleaningSteps(data: any[]): Promise<CleaningRecommendation[]> {
  const profile = await profileData(data);
  const issues = await detectDataIssues(data, profile);
  const recommendations: CleaningRecommendation[] = [];

  // Missing value recommendations
  const missingColumns = profile.columns.filter(c => c.missingPercentage > 5);
  if (missingColumns.length > 0) {
    recommendations.push({
      priority: 'high',
      action: 'Impute Missing Values',
      description: `Impute missing values in ${missingColumns.length} columns`,
      columns: missingColumns.map(c => c.name),
      estimatedImpact: `Will fill ${missingColumns.reduce((sum, c) => sum + c.missingCount, 0)} missing values`,
      autoFixable: true
    });
  }

  // Outlier recommendations
  const outlierColumns = profile.columns.filter(c => c.stats && c.stats.outliers > 0);
  if (outlierColumns.length > 0) {
    recommendations.push({
      priority: 'medium',
      action: 'Handle Outliers',
      description: `Treat outliers in ${outlierColumns.length} numeric columns`,
      columns: outlierColumns.map(c => c.name),
      estimatedImpact: `Will handle ${outlierColumns.reduce((sum, c) => sum + (c.stats?.outliers || 0), 0)} outliers`,
      autoFixable: true
    });
  }

  // Duplicate recommendations
  if (profile.overview.duplicateRows > 0) {
    recommendations.push({
      priority: 'high',
      action: 'Remove Duplicates',
      description: 'Remove duplicate rows from dataset',
      columns: [],
      estimatedImpact: `Will remove ${profile.overview.duplicateRows} duplicate rows`,
      autoFixable: true
    });
  }

  return recommendations;
}

