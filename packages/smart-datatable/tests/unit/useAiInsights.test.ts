import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAiInsights } from '../../src/composables/useAiInsights';
import type { AIClient } from '@aivue/core';
import type { TableSchema } from '../../src/types/ai';
import { ref } from 'vue';

describe('useAiInsights', () => {
  let mockAiClient: AIClient;
  let mockSchema: TableSchema;
  let mockData: any[];

  beforeEach(() => {
    mockAiClient = {
      chat: vi.fn()
    } as any;

    mockSchema = {
      columns: [
        { name: 'id', type: 'number', sample: [1, 2, 3] },
        { name: 'total', type: 'number', sample: [5000, 3000, 4000] },
        { name: 'country', type: 'string', sample: ['USA', 'India', 'UK'] }
      ],
      rowCount: 20,
      sampleRows: []
    };

    mockData = [
      { id: 1, total: 5000, country: 'USA' },
      { id: 2, total: 3000, country: 'India' },
      { id: 3, total: 4000, country: 'UK' }
    ];
  });

  it('should initialize correctly', () => {
    const { insights, isGenerating } = useAiInsights({
      aiClient: mockAiClient,
      schema: mockSchema,
      data: ref(mockData)
    });

    expect(insights.value).toEqual([]);
    expect(isGenerating.value).toBe(false);
  });

  it('should generate insights from AI', async () => {
    const mockResponse = JSON.stringify({
      insights: [
        {
          category: 'trend',
          title: 'Increasing Order Values',
          description: 'Order values are trending upward',
          confidence: 0.85,
          impact: 'high'
        },
        {
          category: 'outlier',
          title: 'Unusual High Value Order',
          description: 'Order #1 has unusually high value',
          confidence: 0.92,
          impact: 'medium'
        }
      ]
    });

    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const { generateInsights, insights, isGenerating } = useAiInsights({
      aiClient: mockAiClient,
      schema: mockSchema,
      data: ref(mockData)
    });

    expect(isGenerating.value).toBe(false);
    
    const promise = generateInsights();
    expect(isGenerating.value).toBe(true);
    
    await promise;

    expect(isGenerating.value).toBe(false);
    expect(insights.value).toHaveLength(2);
    expect(insights.value[0].category).toBe('trend');
    expect(insights.value[1].category).toBe('outlier');
  });

  it('should filter insights by category', async () => {
    const mockResponse = JSON.stringify({
      insights: [
        {
          category: 'trend',
          title: 'Trend 1',
          description: 'Description',
          confidence: 0.8,
          impact: 'high'
        }
      ]
    });

    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const { generateInsights, insights } = useAiInsights({
      aiClient: mockAiClient,
      schema: mockSchema,
      data: ref(mockData)
    });

    await generateInsights(['trend']);

    expect(mockAiClient.chat).toHaveBeenCalled();
    const callArgs = (mockAiClient.chat as any).mock.calls[0];
    expect(callArgs[0][1].content).toContain('trend');
  });

  it('should generate contextual insights for selected rows', async () => {
    const mockResponse = JSON.stringify({
      insights: [
        {
          category: 'pattern',
          title: 'Selected Orders Pattern',
          description: 'Selected orders show similar characteristics',
          confidence: 0.75,
          impact: 'medium'
        }
      ]
    });

    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const { generateContextualInsights, insights } = useAiInsights({
      aiClient: mockAiClient,
      schema: mockSchema,
      data: ref(mockData)
    });

    const selectedRows = [mockData[0], mockData[1]];
    await generateContextualInsights(selectedRows);

    expect(insights.value).toHaveLength(1);
    expect(insights.value[0].category).toBe('pattern');
  });

  it('should generate summary', async () => {
    const mockResponse = 'The dataset contains 3 orders with an average value of $4000. USA has the highest order value.';

    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const { getSummary } = useAiInsights({
      aiClient: mockAiClient,
      schema: mockSchema,
      data: ref(mockData)
    });

    const summary = await getSummary();

    expect(summary).toContain('3 orders');
    expect(summary).toContain('$4000');
  });

  it('should handle AI errors gracefully', async () => {
    (mockAiClient.chat as any).mockRejectedValue(new Error('AI API Error'));

    const { generateInsights, insights, error } = useAiInsights({
      aiClient: mockAiClient,
      schema: mockSchema,
      data: ref(mockData)
    });

    await generateInsights();

    expect(insights.value).toEqual([]);
    expect(error.value).toBeTruthy();
  });

  it('should clear insights', async () => {
    const mockResponse = JSON.stringify({
      insights: [
        { category: 'trend', title: 'Test', description: 'Test', confidence: 0.8, impact: 'high' }
      ]
    });

    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const { generateInsights, insights, clearInsights } = useAiInsights({
      aiClient: mockAiClient,
      schema: mockSchema,
      data: ref(mockData)
    });

    await generateInsights();
    expect(insights.value).toHaveLength(1);

    clearInsights();
    expect(insights.value).toEqual([]);
  });
});

