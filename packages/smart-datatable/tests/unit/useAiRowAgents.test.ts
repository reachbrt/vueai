import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAiRowAgents } from '../../src/composables/useAiRowAgents';
import type { AIClient } from '@aivue/core';
import type { RowAgent, TableSchema } from '../../src/types/ai';

describe('useAiRowAgents', () => {
  let mockAiClient: AIClient;
  let mockSchema: TableSchema;
  let mockAgents: RowAgent[];

  beforeEach(() => {
    mockAiClient = {
      chat: vi.fn()
    } as any;

    mockSchema = {
      columns: [
        { name: 'id', type: 'string', sample: ['ORD-001'] },
        { name: 'customer', type: 'string', sample: ['Acme Corp'] },
        { name: 'total', type: 'number', sample: [5000] }
      ],
      rowCount: 10,
      sampleRows: []
    };

    mockAgents = [
      {
        id: 'explain',
        label: 'Explain Order',
        icon: '📝',
        promptTemplate: 'Explain this order: {{customer}} ordered for ${{total}}',
        scope: 'single'
      },
      {
        id: 'predict',
        label: 'Predict Delivery',
        icon: '📅',
        promptTemplate: 'Predict delivery for order {{id}}',
        scope: 'single'
      }
    ];
  });

  it('should initialize with agents', () => {
    const { agents } = useAiRowAgents({
      aiClient: mockAiClient,
      schema: mockSchema,
      agents: mockAgents
    });

    expect(agents.value).toEqual(mockAgents);
  });

  it('should execute agent on single row', async () => {
    const mockResponse = 'This order from Acme Corp for $5000 is a high-value transaction.';
    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const { executeAgent } = useAiRowAgents({
      aiClient: mockAiClient,
      schema: mockSchema,
      agents: mockAgents
    });

    const testRow = { id: 'ORD-001', customer: 'Acme Corp', total: 5000 };
    const result = await executeAgent(mockAgents[0], testRow);

    expect(result.agentId).toBe('explain');
    expect(result.result).toContain('Acme Corp');
    expect(result.result).toContain('$5000');
    expect(result.row).toEqual(testRow);
  });

  it('should interpolate prompt template correctly', async () => {
    const mockResponse = 'Delivery predicted for ORD-001';
    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const { executeAgent } = useAiRowAgents({
      aiClient: mockAiClient,
      schema: mockSchema,
      agents: mockAgents
    });

    const testRow = { id: 'ORD-001', customer: 'Acme Corp', total: 5000 };
    await executeAgent(mockAgents[1], testRow);

    const callArgs = (mockAiClient.chat as any).mock.calls[0];
    expect(callArgs[0][1].content).toContain('ORD-001');
  });

  it('should handle nested property interpolation', async () => {
    const mockResponse = 'Analysis complete';
    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const agentWithNestedProps: RowAgent = {
      id: 'analyze',
      label: 'Analyze',
      promptTemplate: 'Analyze {{customer.name}} in {{location.country}}',
      scope: 'single'
    };

    const { executeAgent } = useAiRowAgents({
      aiClient: mockAiClient,
      schema: mockSchema,
      agents: [agentWithNestedProps]
    });

    const testRow = {
      customer: { name: 'Acme Corp' },
      location: { country: 'USA' }
    };

    await executeAgent(agentWithNestedProps, testRow);

    const callArgs = (mockAiClient.chat as any).mock.calls[0];
    expect(callArgs[0][1].content).toContain('Acme Corp');
    expect(callArgs[0][1].content).toContain('USA');
  });

  it('should call custom handler after execution', async () => {
    const mockResponse = 'Agent result';
    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const handlerMock = vi.fn();
    const agentWithHandler: RowAgent = {
      id: 'custom',
      label: 'Custom Action',
      promptTemplate: 'Process {{id}}',
      scope: 'single',
      handler: handlerMock
    };

    const { executeAgent } = useAiRowAgents({
      aiClient: mockAiClient,
      schema: mockSchema,
      agents: [agentWithHandler]
    });

    const testRow = { id: 'ORD-001' };
    await executeAgent(agentWithHandler, testRow);

    expect(handlerMock).toHaveBeenCalledWith(testRow, 'Agent result');
  });

  it('should execute agent on multiple rows', async () => {
    const mockResponse = 'Batch analysis complete';
    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const batchAgent: RowAgent = {
      id: 'batch',
      label: 'Batch Process',
      promptTemplate: 'Process these orders: {{rows}}',
      scope: 'multiple'
    };

    const { executeAgentBatch } = useAiRowAgents({
      aiClient: mockAiClient,
      schema: mockSchema,
      agents: [batchAgent]
    });

    const testRows = [
      { id: 'ORD-001', total: 5000 },
      { id: 'ORD-002', total: 3000 }
    ];

    const results = await executeAgentBatch(batchAgent, testRows);

    expect(results).toHaveLength(2);
    expect(results[0].agentId).toBe('batch');
  });

  it('should track execution history', async () => {
    const mockResponse = 'Result';
    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const { executeAgent, executionHistory } = useAiRowAgents({
      aiClient: mockAiClient,
      schema: mockSchema,
      agents: mockAgents
    });

    const testRow = { id: 'ORD-001', customer: 'Acme Corp', total: 5000 };
    
    await executeAgent(mockAgents[0], testRow);
    await executeAgent(mockAgents[1], testRow);

    expect(executionHistory.value).toHaveLength(2);
    expect(executionHistory.value[0].agentId).toBe('explain');
    expect(executionHistory.value[1].agentId).toBe('predict');
  });

  it('should handle AI errors gracefully', async () => {
    (mockAiClient.chat as any).mockRejectedValue(new Error('AI Error'));

    const { executeAgent } = useAiRowAgents({
      aiClient: mockAiClient,
      schema: mockSchema,
      agents: mockAgents
    });

    const testRow = { id: 'ORD-001' };

    await expect(executeAgent(mockAgents[0], testRow)).rejects.toThrow('AI Error');
  });
});

