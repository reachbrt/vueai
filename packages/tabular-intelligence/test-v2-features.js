/**
 * Test Suite for Tabular Intelligence v2.0 Advanced Features
 */

import {
  profileData,
  assessDataQuality,
  detectDataIssues,
  suggestCleaningSteps,
  imputeMissingValues,
  handleOutliers,
  autoGenerateFeatures,
  analyzeFeatureImportance,
  forecastTimeSeries,
  detectTrends,
  autoTrain,
  explainPrediction,
  analyzeABTest,
  recommendVisualizations,
  joinTables,
  generateReport,
  detectPII,
  createSnapshot,
  smartSample
} from './dist/index.mjs';

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (message) console.log(`   ${message}`);
  
  results.tests.push({ name, passed, message });
  if (passed) results.passed++;
  else results.failed++;
}

// Sample test data
const testData = [
  { id: 1, name: 'Alice', age: 25, salary: 50000, department: 'Engineering', email: 'alice@example.com' },
  { id: 2, name: 'Bob', age: 30, salary: 60000, department: 'Sales', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', age: null, salary: 55000, department: 'Engineering', email: 'charlie@example.com' },
  { id: 4, name: 'Diana', age: 28, salary: 70000, department: 'Marketing', email: 'diana@example.com' },
  { id: 5, name: 'Eve', age: 35, salary: 80000, department: 'Engineering', email: 'eve@example.com' },
  { id: 6, name: 'Frank', age: 32, salary: 65000, department: 'Sales', email: 'frank@example.com' },
  { id: 7, name: 'Grace', age: 27, salary: 58000, department: 'Marketing', email: 'grace@example.com' },
  { id: 8, name: 'Henry', age: 40, salary: 90000, department: 'Engineering', email: 'henry@example.com' },
  { id: 9, name: 'Ivy', age: 29, salary: null, department: 'Sales', email: 'ivy@example.com' },
  { id: 10, name: 'Jack', age: 33, salary: 75000, department: 'Engineering', email: 'jack@example.com' }
];

const timeSeriesData = [
  { date: '2024-01-01', sales: 100 },
  { date: '2024-01-02', sales: 110 },
  { date: '2024-01-03', sales: 105 },
  { date: '2024-01-04', sales: 115 },
  { date: '2024-01-05', sales: 120 },
  { date: '2024-01-06', sales: 125 },
  { date: '2024-01-07', sales: 130 },
  { date: '2024-01-08', sales: 135 },
  { date: '2024-01-09', sales: 128 },
  { date: '2024-01-10', sales: 140 },
  { date: '2024-01-11', sales: 145 },
  { date: '2024-01-12', sales: 142 },
  { date: '2024-01-13', sales: 150 },
  { date: '2024-01-14', sales: 155 },
  { date: '2024-01-15', sales: 160 }
];

async function runTests() {
  console.log('\n🧪 Tabular Intelligence v2.0 Feature Test Suite\n');
  console.log('='.repeat(70));
  
  try {
    // Test 1: Data Quality Profiling
    console.log('\n📊 Test 1: Data Quality Profiling');
    console.log('-'.repeat(70));
    
    const profile = await profileData(testData);
    logTest('1.1 Profile Data', profile && profile.columns && profile.columns.length > 0, 
      `Profiled ${profile.columns.length} columns`);
    
    const qualityReport = await assessDataQuality(testData);
    logTest('1.2 Assess Data Quality', qualityReport && qualityReport.overallScore >= 0, 
      `Quality Score: ${qualityReport.overallScore.toFixed(1)}/100`);
    
    const issues = await detectDataIssues(testData);
    logTest('1.3 Detect Data Issues', Array.isArray(issues), 
      `Found ${issues.length} issues`);
    
    const recommendations = await suggestCleaningSteps(testData);
    logTest('1.4 Suggest Cleaning Steps', Array.isArray(recommendations), 
      `Generated ${recommendations.length} recommendations`);
    
    // Test 2: Data Cleaning
    console.log('\n🧹 Test 2: Data Cleaning');
    console.log('-'.repeat(70));
    
    const imputationResult = await imputeMissingValues(testData, {
      strategy: 'mean',
      columns: ['age', 'salary']
    });
    logTest('2.1 Impute Missing Values', imputationResult && imputationResult.data, 
      `Imputed ${imputationResult.imputedCount} values`);
    
    const outlierResult = await handleOutliers(testData, {
      method: 'cap',
      strategy: 'iqr',
      columns: ['salary']
    });
    logTest('2.2 Handle Outliers', outlierResult && outlierResult.data, 
      `Handled ${outlierResult.outliersDetected} outliers`);
    
    // Test 3: Feature Engineering
    console.log('\n🔧 Test 3: Feature Engineering');
    console.log('-'.repeat(70));
    
    const featureResult = await autoGenerateFeatures(testData, {
      targetColumn: 'salary',
      maxFeatures: 10,
      includeInteractions: true
    });
    logTest('3.1 Auto Generate Features', featureResult && featureResult.newFeatures,
      `Generated ${featureResult.newFeatures.length} features`);
    
    const importance = await analyzeFeatureImportance(testData, 'salary');
    logTest('3.2 Analyze Feature Importance', Array.isArray(importance), 
      `Analyzed ${importance.length} features`);
    
    // Test 4: Time Series Analysis
    console.log('\n⏰ Test 4: Time Series Analysis');
    console.log('-'.repeat(70));
    
    const forecast = await forecastTimeSeries(timeSeriesData, {
      dateColumn: 'date',
      valueColumn: 'sales',
      horizon: 3,
      method: 'exponential_smoothing'
    });
    logTest('4.1 Forecast Time Series', forecast && forecast.predictions, 
      `Forecasted ${forecast.predictions.length} periods`);
    
    const trends = await detectTrends(timeSeriesData, {
      dateColumn: 'date',
      valueColumns: ['sales']
    });
    logTest('4.2 Detect Trends', Array.isArray(trends),
      `Detected trends in ${trends.length} columns`);

    // Test 5: AutoML
    console.log('\n🤖 Test 5: AutoML');
    console.log('-'.repeat(70));

    const autoMLResult = await autoTrain(testData, {
      targetColumn: 'salary',
      taskType: 'regression',
      timeLimit: 10
    });
    logTest('5.1 Auto Train Model', autoMLResult && autoMLResult.bestModel,
      `Best model: ${autoMLResult.bestModel}`);

    // Test 6: Model Explainability
    console.log('\n🔍 Test 6: Model Explainability');
    console.log('-'.repeat(70));

    const explanation = await explainPrediction(testData, {
      rowIndex: 0,
      targetColumn: 'salary'
    });
    logTest('6.1 Explain Prediction', explanation && explanation.shapValues,
      `Explained with ${explanation.shapValues.length} features`);

    // Test 7: Statistical Testing
    console.log('\n📈 Test 7: Statistical Testing');
    console.log('-'.repeat(70));

    const controlGroup = testData.slice(0, 5);
    const treatmentGroup = testData.slice(5, 10);

    const abTest = await analyzeABTest({
      controlGroup,
      treatmentGroup,
      metric: 'salary',
      confidenceLevel: 0.95
    });
    logTest('7.1 Analyze A/B Test', abTest && abTest.winner,
      `Winner: ${abTest.winner}, p-value: ${abTest.pValue.toFixed(4)}`);

    // Test 8: Visualization Recommendations
    console.log('\n📊 Test 8: Visualization Recommendations');
    console.log('-'.repeat(70));

    const vizRecommendations = await recommendVisualizations(testData, {
      purpose: 'exploration'
    });
    logTest('8.1 Recommend Visualizations', Array.isArray(vizRecommendations),
      `Generated ${vizRecommendations.length} recommendations`);

    // Test 9: Multi-Table Analysis
    console.log('\n🔗 Test 9: Multi-Table Analysis');
    console.log('-'.repeat(70));

    const table1 = testData.slice(0, 5);
    const table2 = testData.slice(5, 10).map(row => ({
      id: row.id,
      bonus: row.salary * 0.1
    }));

    const joined = await joinTables({
      leftTable: table1,
      rightTable: table2,
      leftKey: 'id',
      rightKey: 'id',
      joinType: 'inner'
    });
    logTest('9.1 Join Tables', Array.isArray(joined),
      `Joined ${joined.length} rows`);

    // Test 10: Reporting
    console.log('\n📝 Test 10: Reporting');
    console.log('-'.repeat(70));

    const report = await generateReport(testData, {
      format: 'markdown',
      sections: ['summary', 'stats']
    });
    logTest('10.1 Generate Report', report && report.sections,
      `Generated ${report.sections.length} sections`);

    // Test 11: Privacy & Compliance
    console.log('\n🔒 Test 11: Privacy & Compliance');
    console.log('-'.repeat(70));

    const piiDetection = await detectPII(testData);
    logTest('11.1 Detect PII', piiDetection && piiDetection.piiColumns,
      `Found ${piiDetection.piiColumns.length} PII columns`);

    // Test 12: Data Versioning
    console.log('\n📦 Test 12: Data Versioning');
    console.log('-'.repeat(70));

    const snapshot = await createSnapshot(testData, 'Test Snapshot');
    logTest('12.1 Create Snapshot', snapshot && snapshot.id,
      `Created snapshot: ${snapshot.label}`);

    // Test 13: Smart Sampling
    console.log('\n🎯 Test 13: Smart Sampling');
    console.log('-'.repeat(70));

    const sample = await smartSample(testData, {
      size: 5,
      method: 'random'
    });
    logTest('13.1 Smart Sample', sample && sample.data,
      `Sampled ${sample.sampleSize} from ${sample.originalSize} rows`);

  } catch (error) {
    console.error('\n❌ Test Suite Error:', error.message);
    console.error(error.stack);
  }

  // Print Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log('='.repeat(70));

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests.filter(t => !t.passed).forEach(t => {
      console.log(`  - ${t.name}: ${t.message}`);
    });
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

runTests();

