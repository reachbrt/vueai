import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAiTableQuery } from '../../src/composables/useAiTableQuery';
import type { AIClient } from '@aivue/core';
import type { TableSchema } from '../../src/types/ai';

describe('useAiTableQuery', () => {
  let mockAiClient: AIClient;
  let mockSchema: TableSchema;

  beforeEach(() => {
    mockAiClient = {
      chat: vi.fn()
    } as any;

    mockSchema = {
      columns: [
        { name: 'id', type: 'number', sample: [1, 2, 3] },
        { name: 'customer', type: 'string', sample: ['Acme Corp', 'Tech Inc'] },
        { name: 'total', type: 'number', sample: [5000, 3000] },
        { name: 'country', type: 'string', sample: ['USA', 'India'] },
        { name: 'status', type: 'string', sample: ['delivered', 'shipped'] }
      ],
      rowCount: 20,
      sampleRows: [
        { id: 1, customer: 'Acme Corp', total: 5000, country: 'USA', status: 'delivered' },
        { id: 2, customer: 'Tech Inc', total: 3000, country: 'India', status: 'shipped' }
      ]
    };
  });

  it('should initialize with correct schema', () => {
    const { schema } = useAiTableQuery({
      aiClient: mockAiClient,
      schema: mockSchema
    });

    expect(schema.value).toEqual(mockSchema);
  });

  it('should convert natural language query to filter', async () => {
    const mockResponse = JSON.stringify({
      filter: {
        conditions: [
          { column: 'country', operator: 'equals', value: 'India' },
          { column: 'total', operator: 'gt', value: 3000 }
        ],
        operator: 'AND'
      },
      explanation: 'Filtering orders from India with total greater than 3000'
    });

    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const { queryToFilter } = useAiTableQuery({
      aiClient: mockAiClient,
      schema: mockSchema
    });

    const result = await queryToFilter('show orders from India where total > 3000');

    expect(result.filter).toBeDefined();
    expect(result.filter?.conditions).toHaveLength(2);
    expect(result.explanation).toContain('India');
  });

  it('should apply filter correctly to data', () => {
    const { applyFilter } = useAiTableQuery({
      aiClient: mockAiClient,
      schema: mockSchema
    });

    const testData = [
      { id: 1, country: 'USA', total: 5000 },
      { id: 2, country: 'India', total: 4000 },
      { id: 3, country: 'India', total: 2000 },
      { id: 4, country: 'UK', total: 6000 }
    ];

    const filter = {
      conditions: [
        { column: 'country', operator: 'equals', value: 'India' },
        { column: 'total', operator: 'gt', value: 3000 }
      ],
      operator: 'AND' as const
    };

    const filtered = applyFilter(testData, filter);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(2);
  });

  it('should handle OR operator in filters', () => {
    const { applyFilter } = useAiTableQuery({
      aiClient: mockAiClient,
      schema: mockSchema
    });

    const testData = [
      { id: 1, country: 'USA', status: 'delivered' },
      { id: 2, country: 'India', status: 'shipped' },
      { id: 3, country: 'UK', status: 'pending' }
    ];

    const filter = {
      conditions: [
        { column: 'country', operator: 'equals', value: 'USA' },
        { column: 'status', operator: 'equals', value: 'shipped' }
      ],
      operator: 'OR' as const
    };

    const filtered = applyFilter(testData, filter);

    expect(filtered).toHaveLength(2);
    expect(filtered.map(r => r.id)).toEqual([1, 2]);
  });

  it('should handle contains operator', () => {
    const { applyFilter } = useAiTableQuery({
      aiClient: mockAiClient,
      schema: mockSchema
    });

    const testData = [
      { id: 1, customer: 'Acme Corporation' },
      { id: 2, customer: 'Tech Industries' },
      { id: 3, customer: 'Acme Tech' }
    ];

    const filter = {
      conditions: [
        { column: 'customer', operator: 'contains', value: 'Acme' }
      ],
      operator: 'AND' as const
    };

    const filtered = applyFilter(testData, filter);

    expect(filtered).toHaveLength(2);
    expect(filtered.map(r => r.id)).toEqual([1, 3]);
  });

  it('should handle comparison operators (gt, lt, gte, lte)', () => {
    const { applyFilter } = useAiTableQuery({
      aiClient: mockAiClient,
      schema: mockSchema
    });

    const testData = [
      { id: 1, total: 1000 },
      { id: 2, total: 3000 },
      { id: 3, total: 5000 },
      { id: 4, total: 7000 }
    ];

    const filter = {
      conditions: [
        { column: 'total', operator: 'gte', value: 3000 },
        { column: 'total', operator: 'lte', value: 5000 }
      ],
      operator: 'AND' as const
    };

    const filtered = applyFilter(testData, filter);

    expect(filtered).toHaveLength(2);
    expect(filtered.map(r => r.id)).toEqual([2, 3]);
  });
});

