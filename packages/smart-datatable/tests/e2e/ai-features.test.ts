/**
 * E2E Tests for AI-Native Features
 * These tests use real AI API calls (requires API key)
 * Run with: VITE_OPENAI_API_KEY=your-key npm run test:e2e
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { AIClient } from '@aivue/core';
import { useAiTableQuery, useAiInsights, useAiRowAgents } from '../../src/index';
import { ref } from 'vue';

describe('E2E: AI-Native Features with Real AI', () => {
  let aiClient: AIClient;
  const testData = [
    { id: 'ORD-001', customer: 'Acme Corp', total: 5000, country: 'USA', status: 'delivered', orderDate: '2024-01-15' },
    { id: 'ORD-002', customer: 'Tech Industries', total: 3000, country: 'India', status: 'shipped', orderDate: '2024-01-20' },
    { id: 'ORD-003', customer: 'Global Solutions', total: 7500, country: 'UK', status: 'delivered', orderDate: '2024-01-25' },
    { id: 'ORD-004', customer: 'Innovation Labs', total: 2000, country: 'India', status: 'pending', orderDate: '2024-02-01' },
    { id: 'ORD-005', customer: 'Future Tech', total: 4500, country: 'USA', status: 'shipped', orderDate: '2024-02-05' }
  ];

  const tableSchema = {
    columns: [
      { name: 'id', type: 'string', sample: ['ORD-001', 'ORD-002'] },
      { name: 'customer', type: 'string', sample: ['Acme Corp', 'Tech Industries'] },
      { name: 'total', type: 'number', sample: [5000, 3000, 7500] },
      { name: 'country', type: 'string', sample: ['USA', 'India', 'UK'] },
      { name: 'status', type: 'string', sample: ['delivered', 'shipped', 'pending'] },
      { name: 'orderDate', type: 'string', sample: ['2024-01-15', '2024-01-20'] }
    ],
    rowCount: 5,
    sampleRows: testData.slice(0, 2)
  };

  beforeAll(() => {
    const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️  No API key found. Skipping E2E tests. Set VITE_OPENAI_API_KEY to run these tests.');
      return;
    }

    aiClient = new AIClient({
      provider: 'openai',
      apiKey,
      model: 'gpt-4'
    });
  });

  it('should convert natural language query to filter', async () => {
    if (!aiClient) {
      console.log('⏭️  Skipping: No API key');
      return;
    }

    const { queryToFilter, applyFilter } = useAiTableQuery({
      aiClient,
      schema: tableSchema
    });

    console.log('🧪 Testing: Natural language query to filter conversion');
    const result = await queryToFilter('show orders from India where total is greater than 2500');

    console.log('✅ Query result:', JSON.stringify(result, null, 2));

    expect(result.filter).toBeDefined();
    expect(result.filter?.conditions).toBeDefined();
    expect(result.explanation).toBeDefined();

    // Apply the filter
    const filtered = applyFilter(testData, result.filter);
    console.log('✅ Filtered data:', filtered);

    // Should return ORD-002 (India, 3000)
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(row => row.country === 'India')).toBe(true);
  }, 30000);

  it('should generate AI insights from data', async () => {
    if (!aiClient) {
      console.log('⏭️  Skipping: No API key');
      return;
    }

    const { generateInsights, insights } = useAiInsights({
      aiClient,
      schema: tableSchema,
      data: ref(testData)
    });

    console.log('🧪 Testing: AI insights generation');
    await generateInsights();

    console.log('✅ Generated insights:', JSON.stringify(insights.value, null, 2));

    expect(insights.value.length).toBeGreaterThan(0);
    expect(insights.value[0]).toHaveProperty('category');
    expect(insights.value[0]).toHaveProperty('title');
    expect(insights.value[0]).toHaveProperty('description');
    expect(insights.value[0]).toHaveProperty('confidence');
  }, 30000);

  it('should generate summary of data', async () => {
    if (!aiClient) {
      console.log('⏭️  Skipping: No API key');
      return;
    }

    const { getSummary } = useAiInsights({
      aiClient,
      schema: tableSchema,
      data: ref(testData)
    });

    console.log('🧪 Testing: AI summary generation');
    const summary = await getSummary();

    console.log('✅ Generated summary:', summary);

    expect(summary).toBeDefined();
    expect(summary.length).toBeGreaterThan(0);
    expect(typeof summary).toBe('string');
  }, 30000);

  it('should execute row agent on single row', async () => {
    if (!aiClient) {
      console.log('⏭️  Skipping: No API key');
      return;
    }

    const rowAgent = {
      id: 'explain',
      label: 'Explain Order',
      icon: '📝',
      promptTemplate: 'Explain this order in one sentence: Customer {{customer}} ordered for ${{total}}, status is {{status}}',
      scope: 'single' as const
    };

    const { executeAgent } = useAiRowAgents({
      aiClient,
      schema: tableSchema,
      agents: [rowAgent]
    });

    console.log('🧪 Testing: Row agent execution');
    const result = await executeAgent(rowAgent, testData[0]);

    console.log('✅ Agent result:', result);

    expect(result.agentId).toBe('explain');
    expect(result.result).toBeDefined();
    expect(result.result.length).toBeGreaterThan(0);
    expect(result.row).toEqual(testData[0]);
  }, 30000);

  it('should handle complex queries with multiple conditions', async () => {
    if (!aiClient) {
      console.log('⏭️  Skipping: No API key');
      return;
    }

    const { queryToFilter, applyFilter } = useAiTableQuery({
      aiClient,
      schema: tableSchema
    });

    console.log('🧪 Testing: Complex multi-condition query');
    const result = await queryToFilter('show delivered orders from USA or UK with total above 4000');

    console.log('✅ Complex query result:', JSON.stringify(result, null, 2));

    expect(result.filter).toBeDefined();
    
    const filtered = applyFilter(testData, result.filter);
    console.log('✅ Filtered results:', filtered);

    // Should include ORD-001 (USA, 5000, delivered) and ORD-003 (UK, 7500, delivered)
    expect(filtered.length).toBeGreaterThan(0);
  }, 30000);
});

