/**
 * Test Suite for Tabular Intelligence - Postman Integration
 * Tests the MarketStack API integration using real API calls
 */

import { TabularIntelligence } from './dist/index.mjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MarketStack API Key
const MARKETSTACK_API_KEY = 'c85c73e6bb279b8e52aaaf714ff21228';

// Test results tracking
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
  console.log('\n🧪 Starting Tabular Intelligence - Postman Integration Tests\n');
  console.log('='.repeat(70));
  
  try {
    // ========================================================================
    // Test 1: Load Postman Collection
    // ========================================================================
    console.log('\n📋 Test 1: Load Postman Collection');
    console.log('-'.repeat(70));
    
    const collectionPath = join(__dirname, '../../sample data/Marketstack.postman_collection.json');
    const collectionJson = JSON.parse(readFileSync(collectionPath, 'utf-8'));
    
    const client = new TabularIntelligence({ provider: 'local' });
    const parsed = client.loadPostmanCollection(collectionJson);
    
    logTest(
      'Load Postman Collection',
      parsed && parsed.name === 'Marketstack',
      `Loaded collection: ${parsed.name}`
    );
    
    // ========================================================================
    // Test 2: List Endpoints
    // ========================================================================
    console.log('\n📋 Test 2: List Endpoints');
    console.log('-'.repeat(70));
    
    const endpoints = client.listEndpoints();
    console.log(`Found ${endpoints.length} endpoints:`);
    endpoints.forEach((ep, i) => {
      console.log(`  ${i + 1}. [${ep.method}] ${ep.name}`);
    });
    
    logTest(
      'List Endpoints',
      endpoints.length > 0,
      `Found ${endpoints.length} endpoints`
    );
    
    // ========================================================================
    // Test 3: Fetch End-of-Day Data
    // ========================================================================
    console.log('\n📊 Test 3: Fetch End-of-Day Data');
    console.log('-'.repeat(70));
    
    try {
      const { data, schema } = await client.fetchDataFromAPI(
        'Basic – End-of-Day Data',
        {
          access_key: MARKETSTACK_API_KEY,
          symbols: 'AAPL',
          limit: '5'
        }
      );
      
      console.log(`✓ Fetched ${data.length} rows`);
      console.log(`✓ Schema columns: ${Object.keys(schema?.columns || {}).length}`);
      console.log('\nSample data (first row):');
      console.log(JSON.stringify(data[0], null, 2));
      
      logTest(
        'Fetch End-of-Day Data',
        data.length > 0 && data[0].symbol === 'AAPL',
        `Fetched ${data.length} rows for AAPL`
      );
    } catch (error) {
      logTest('Fetch End-of-Day Data', false, error.message);
    }
    
    // ========================================================================
    // Test 4: Fetch Multiple Symbols
    // ========================================================================
    console.log('\n📊 Test 4: Fetch Multiple Symbols');
    console.log('-'.repeat(70));
    
    try {
      const { data } = await client.fetchDataFromAPI(
        'Basic – End-of-Day Data',
        {
          access_key: MARKETSTACK_API_KEY,
          symbols: 'AAPL,GOOGL,MSFT',
          limit: '10'
        }
      );
      
      const symbols = [...new Set(data.map(row => row.symbol))];
      console.log(`✓ Fetched ${data.length} rows`);
      console.log(`✓ Symbols: ${symbols.join(', ')}`);
      
      logTest(
        'Fetch Multiple Symbols',
        symbols.length >= 2,
        `Fetched data for ${symbols.length} symbols: ${symbols.join(', ')}`
      );
    } catch (error) {
      logTest('Fetch Multiple Symbols', false, error.message);
    }
    
    // ========================================================================
    // Test 5: Data Conversion to Tabular Format
    // ========================================================================
    console.log('\n🔄 Test 5: Data Conversion to Tabular Format');
    console.log('-'.repeat(70));
    
    try {
      const { data, schema } = await client.fetchDataFromAPI(
        'Basic – End-of-Day Data',
        {
          access_key: MARKETSTACK_API_KEY,
          symbols: 'AAPL',
          limit: '3'
        }
      );
      
      const hasRequiredFields = data.every(row => 
        row.symbol && row.close !== undefined && row.date
      );
      
      console.log(`✓ All rows have required fields: ${hasRequiredFields}`);
      console.log(`✓ Columns: ${Object.keys(data[0]).join(', ')}`);
      
      logTest(
        'Data Conversion',
        hasRequiredFields && data.length > 0,
        `Converted ${data.length} rows with all required fields`
      );
    } catch (error) {
      logTest('Data Conversion', false, error.message);
    }
    
    // ========================================================================
    // Test 6: Schema Inference
    // ========================================================================
    console.log('\n🔍 Test 6: Schema Inference');
    console.log('-'.repeat(70));

    try {
      const { schema } = await client.fetchDataFromAPI(
        'Basic – End-of-Day Data',
        {
          access_key: MARKETSTACK_API_KEY,
          symbols: 'AAPL',
          limit: '5'
        }
      );

      const hasSchema = schema && schema.columns;
      const columnTypes = hasSchema ? Object.entries(schema.columns).map(
        ([name, col]) => `${name}: ${col.type}`
      ) : [];

      console.log(`✓ Schema inferred: ${hasSchema}`);
      if (hasSchema) {
        console.log('Column types:');
        columnTypes.forEach(ct => console.log(`  - ${ct}`));
      }

      logTest(
        'Schema Inference',
        hasSchema && Object.keys(schema.columns).length > 0,
        `Inferred ${Object.keys(schema.columns || {}).length} columns`
      );
    } catch (error) {
      logTest('Schema Inference', false, error.message);
    }

    // ========================================================================
    // Test 7: Error Handling - Invalid Endpoint
    // ========================================================================
    console.log('\n⚠️  Test 7: Error Handling - Invalid Endpoint');
    console.log('-'.repeat(70));

    try {
      await client.fetchDataFromAPI(
        'NonExistentEndpoint',
        { access_key: MARKETSTACK_API_KEY }
      );
      logTest('Error Handling - Invalid Endpoint', false, 'Should have thrown error');
    } catch (error) {
      console.log(`✓ Correctly threw error: ${error.message}`);
      logTest(
        'Error Handling - Invalid Endpoint',
        true,
        'Correctly handled invalid endpoint'
      );
    }

    // ========================================================================
    // Test 8: Variable Replacement
    // ========================================================================
    console.log('\n🔧 Test 8: Variable Replacement');
    console.log('-'.repeat(70));

    try {
      const collection = client.getCollection();
      const hasVariables = collection && collection.variables;

      console.log(`✓ Collection has variables: ${hasVariables}`);
      if (hasVariables) {
        console.log('Variables:');
        Object.entries(collection.variables).forEach(([key, value]) => {
          console.log(`  - ${key}: ${value}`);
        });
      }

      logTest(
        'Variable Replacement',
        hasVariables,
        `Collection has ${Object.keys(collection?.variables || {}).length} variables`
      );
    } catch (error) {
      logTest('Variable Replacement', false, error.message);
    }

    // ========================================================================
    // Test Summary
    // ========================================================================
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST SUMMARY');
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
    }

    console.log('\n' + '='.repeat(70));

    // Exit with appropriate code
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

