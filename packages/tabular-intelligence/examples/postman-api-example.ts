/**
 * Example: Using Postman Collection Integration with MarketStack API
 * 
 * This example demonstrates how to:
 * 1. Load a Postman collection
 * 2. Fetch data from MarketStack API
 * 3. Ask natural language questions about the data
 */

import { TabularIntelligence } from '@aivue/tabular-intelligence';
import marketstackCollection from './marketstack-collection.json';

async function main() {
  // ============================================================================
  // Step 1: Initialize the client
  // ============================================================================
  
  const client = new TabularIntelligence({
    provider: 'local', // Use local processing for data conversion
  });

  console.log('✅ Client initialized');

  // ============================================================================
  // Step 2: Load Postman Collection
  // ============================================================================
  
  const parsed = client.loadPostmanCollection(marketstackCollection);
  
  console.log(`✅ Loaded collection: ${parsed.name}`);
  console.log(`📋 Found ${parsed.endpoints.length} endpoints:`);
  
  // List all available endpoints
  const endpoints = client.listEndpoints();
  endpoints.forEach(endpoint => {
    console.log(`  - [${endpoint.method}] ${endpoint.name}`);
  });

  // ============================================================================
  // Step 3: Fetch Data from API
  // ============================================================================
  
  console.log('\n🚀 Fetching stock data...');
  
  const { data, schema } = await client.fetchDataFromAPI(
    'End of Day Data', // Endpoint name
    {
      access_key: process.env.MARKETSTACK_API_KEY || 'YOUR_API_KEY',
      symbols: 'AAPL,GOOGL,MSFT',
      limit: '10',
    }
  );

  console.log(`✅ Fetched ${data.length} rows`);
  console.log('📊 Schema:', schema);
  console.log('📈 Sample data:', data.slice(0, 3));

  // ============================================================================
  // Step 4: Initialize Q&A Engine
  // ============================================================================
  
  console.log('\n🤖 Initializing Q&A engine...');
  
  client.initializeQA({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY',
    model: 'gpt-4-turbo-preview',
  });

  console.log('✅ Q&A engine ready');

  // ============================================================================
  // Step 5: Ask Questions About the Data
  // ============================================================================
  
  const questions = [
    'Which stock had the highest closing price?',
    'What is the average volume across all stocks?',
    'Show me the price range for each stock',
    'Which stock had the biggest price change?',
  ];

  console.log('\n💬 Asking questions...\n');

  for (const question of questions) {
    console.log(`❓ ${question}`);
    
    const response = await client.queryAPI({
      question,
      dataSource: {
        type: 'postman',
        endpoint: 'End of Day Data',
      },
      variables: {
        access_key: process.env.MARKETSTACK_API_KEY || 'YOUR_API_KEY',
        symbols: 'AAPL,GOOGL,MSFT',
        limit: '10',
      },
    });

    console.log(`✅ ${response.answer.text}`);
    console.log(`   Confidence: ${(response.answer.confidence * 100).toFixed(0)}%`);
    console.log(`   Execution time: ${response.executionTime}ms\n`);
  }

  // ============================================================================
  // Step 6: Fetch Different Endpoint Data
  // ============================================================================
  
  console.log('🔄 Fetching ticker data...');
  
  const { data: tickers } = await client.fetchDataFromAPI(
    'Tickers',
    {
      access_key: process.env.MARKETSTACK_API_KEY || 'YOUR_API_KEY',
      limit: '20',
    }
  );

  console.log(`✅ Fetched ${tickers.length} tickers`);
  console.log('📋 Sample tickers:', tickers.slice(0, 5));

  // Ask questions about tickers
  const tickerResponse = await client.queryAPI({
    question: 'How many tickers are from the NASDAQ exchange?',
    dataSource: {
      type: 'postman',
      endpoint: 'Tickers',
    },
    variables: {
      access_key: process.env.MARKETSTACK_API_KEY || 'YOUR_API_KEY',
      limit: '20',
    },
  });

  console.log(`\n❓ How many tickers are from the NASDAQ exchange?`);
  console.log(`✅ ${tickerResponse.answer.text}`);

  // ============================================================================
  // Done!
  // ============================================================================
  
  console.log('\n🎉 All done!');
}

// Run the example
main().catch(console.error);

