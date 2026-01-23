/**
 * Comprehensive Test Suite for Tabular Intelligence Package
 * Tests all major features including Postman integration, Q&A, and data analysis
 */

import { TabularIntelligence } from './dist/index.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MARKETSTACK_API_KEY = 'c85c73e6bb279b8e52aaaf714ff21228';

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

async function runTests() {
  console.log('\n🧪 Comprehensive Tabular Intelligence Test Suite\n');
  console.log('='.repeat(70));
  
  try {
    // ========================================================================
    // SECTION 1: Postman Collection Integration
    // ========================================================================
    console.log('\n📦 SECTION 1: Postman Collection Integration');
    console.log('='.repeat(70));
    
    const collectionPath = join(__dirname, '../../sample data/Marketstack.postman_collection.json');
    const collectionJson = JSON.parse(readFileSync(collectionPath, 'utf-8'));
    
    const client = new TabularIntelligence({ provider: 'local' });
    const parsed = client.loadPostmanCollection(collectionJson);
    
    logTest(
      '1.1 Load Postman Collection',
      parsed && parsed.name === 'Marketstack',
      `Collection: ${parsed.name}, Endpoints: ${parsed.endpoints.length}`
    );
    
    // ========================================================================
    // Test 1.2: Fetch Real Stock Data
    // ========================================================================
    console.log('\n📊 Test 1.2: Fetch Real Stock Data');
    console.log('-'.repeat(70));
    
    const { data: stockData, schema } = await client.fetchDataFromAPI(
      'Basic – End-of-Day Data',
      {
        access_key: MARKETSTACK_API_KEY,
        symbols: 'AAPL,MSFT,GOOGL',
        limit: '15'
      }
    );
    
    console.log(`✓ Fetched ${stockData.length} rows`);
    console.log(`✓ Unique symbols: ${[...new Set(stockData.map(r => r.symbol))].join(', ')}`);
    console.log(`✓ Date range: ${stockData[stockData.length - 1]?.date} to ${stockData[0]?.date}`);
    
    logTest(
      '1.2 Fetch Real Stock Data',
      stockData.length >= 10 && stockData[0].symbol,
      `Fetched ${stockData.length} rows with valid data`
    );
    
    // ========================================================================
    // SECTION 2: Data Analysis Features
    // ========================================================================
    console.log('\n📈 SECTION 2: Data Analysis Features');
    console.log('='.repeat(70));
    
    // Test 2.1: Descriptive Statistics
    console.log('\n📊 Test 2.1: Descriptive Statistics');
    console.log('-'.repeat(70));
    
    try {
      const stats = await client.analyze({
        type: 'descriptive',
        data: stockData,
        schema: schema,
        columns: ['close', 'volume']
      });
      
      console.log('✓ Statistics computed:');
      if (stats.results?.close) {
        console.log(`  - Close price: mean=${stats.results.close.mean?.toFixed(2)}, std=${stats.results.close.std?.toFixed(2)}`);
      }
      if (stats.results?.volume) {
        console.log(`  - Volume: mean=${stats.results.volume.mean?.toFixed(0)}, max=${stats.results.volume.max?.toFixed(0)}`);
      }
      
      logTest(
        '2.1 Descriptive Statistics',
        stats.results && Object.keys(stats.results).length > 0,
        'Successfully computed statistics'
      );
    } catch (error) {
      logTest('2.1 Descriptive Statistics', false, error.message);
    }
    
    // Test 2.2: Anomaly Detection
    console.log('\n🚨 Test 2.2: Anomaly Detection');
    console.log('-'.repeat(70));
    
    try {
      const anomalies = await client.analyze({
        type: 'anomaly',
        data: stockData,
        schema: schema,
        column: 'volume',
        method: 'zscore',
        threshold: 2.0
      });
      
      console.log(`✓ Detected ${anomalies.anomalies?.length || 0} anomalies in volume`);
      if (anomalies.anomalies && anomalies.anomalies.length > 0) {
        console.log(`  First anomaly: row ${anomalies.anomalies[0].index}, score=${anomalies.anomalies[0].score?.toFixed(2)}`);
      }
      
      logTest(
        '2.2 Anomaly Detection',
        anomalies.anomalies !== undefined,
        `Detected ${anomalies.anomalies?.length || 0} anomalies`
      );
    } catch (error) {
      logTest('2.2 Anomaly Detection', false, error.message);
    }
    
    // Test 2.3: Correlation Analysis
    console.log('\n📈 Test 2.3: Correlation Analysis');
    console.log('-'.repeat(70));
    
    try {
      const correlation = await client.analyze({
        type: 'correlation',
        data: stockData,
        schema: schema,
        columns: ['open', 'high', 'low', 'close']
      });
      
      console.log('✓ Correlation matrix computed');
      if (correlation.matrix) {
        console.log(`  Matrix size: ${Object.keys(correlation.matrix).length}x${Object.keys(correlation.matrix).length}`);
      }
      
      logTest(
        '2.3 Correlation Analysis',
        correlation.matrix && Object.keys(correlation.matrix).length > 0,
        'Successfully computed correlation matrix'
      );
    } catch (error) {
      logTest('2.3 Correlation Analysis', false, error.message);
    }
    
    // ========================================================================
    // SECTION 3: Schema and Data Validation
    // ========================================================================
    console.log('\n🔍 SECTION 3: Schema and Data Validation');
    console.log('='.repeat(70));

    // Test 3.1: Schema Inference
    console.log('\n📋 Test 3.1: Schema Inference');
    console.log('-'.repeat(70));

    const hasValidSchema = schema && schema.columns && Object.keys(schema.columns).length > 0;
    if (hasValidSchema) {
      console.log(`✓ Schema has ${Object.keys(schema.columns).length} columns`);
      console.log('Column types:');
      Object.entries(schema.columns).slice(0, 5).forEach(([name, col]) => {
        console.log(`  - ${name}: ${col.type}`);
      });
    }

    logTest(
      '3.1 Schema Inference',
      hasValidSchema,
      `Inferred ${Object.keys(schema?.columns || {}).length} columns`
    );

    // Test 3.2: Data Integrity
    console.log('\n✓ Test 3.2: Data Integrity');
    console.log('-'.repeat(70));

    const hasRequiredFields = stockData.every(row =>
      row.symbol && row.close !== undefined && row.date && row.volume !== undefined
    );

    const hasValidPrices = stockData.every(row =>
      row.close > 0 && row.high >= row.low && row.close >= row.low && row.close <= row.high
    );

    console.log(`✓ All rows have required fields: ${hasRequiredFields}`);
    console.log(`✓ All prices are valid: ${hasValidPrices}`);

    logTest(
      '3.2 Data Integrity',
      hasRequiredFields && hasValidPrices,
      'All data integrity checks passed'
    );

    // ========================================================================
    // SECTION 4: Multiple Endpoints
    // ========================================================================
    console.log('\n🌐 SECTION 4: Multiple Endpoints');
    console.log('='.repeat(70));

    // Test 4.1: Fetch Exchanges
    console.log('\n🏦 Test 4.1: Fetch Exchanges');
    console.log('-'.repeat(70));

    try {
      const { data: exchanges } = await client.fetchDataFromAPI(
        'Exchanges',
        { access_key: MARKETSTACK_API_KEY }
      );

      console.log(`✓ Fetched ${exchanges.length} exchanges`);
      if (exchanges.length > 0) {
        console.log(`  Sample: ${exchanges[0].name} (${exchanges[0].mic})`);
      }

      logTest(
        '4.1 Fetch Exchanges',
        exchanges.length > 0,
        `Fetched ${exchanges.length} exchanges`
      );
    } catch (error) {
      logTest('4.1 Fetch Exchanges', false, error.message);
    }

    // ========================================================================
    // Test Summary
    // ========================================================================
    console.log('\n' + '='.repeat(70));
    console.log('📊 COMPREHENSIVE TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total Tests: ${results.tests.length}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);

    if (results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      results.tests.filter(t => !t.passed).forEach(t => {
        console.log(`  - ${t.name}: ${t.message}`);
      });
    } else {
      console.log('\n🎉 All tests passed successfully!');
    }

    console.log('\n' + '='.repeat(70));

    process.exit(results.failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('\n❌ Test suite error:', error);
    logTest('Test Suite Execution', false, error.message);
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

