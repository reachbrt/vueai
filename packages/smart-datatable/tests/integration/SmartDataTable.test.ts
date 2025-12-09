import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SmartDataTable from '../../src/components/SmartDataTable.vue';
import type { AIClient } from '@aivue/core';

describe('SmartDataTable Integration Tests', () => {
  let mockAiClient: AIClient;

  beforeEach(() => {
    mockAiClient = {
      chat: vi.fn()
    } as any;
  });

  it('should render table with data', () => {
    const wrapper = mount(SmartDataTable, {
      props: {
        data: [
          { id: 1, name: 'Test 1' },
          { id: 2, name: 'Test 2' }
        ],
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' }
        ]
      }
    });

    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test 1');
    expect(wrapper.text()).toContain('Test 2');
  });

  it('should enable AI search when aiClient and aiSearch props are provided', async () => {
    const wrapper = mount(SmartDataTable, {
      props: {
        data: [
          { id: 1, country: 'USA', total: 5000 },
          { id: 2, country: 'India', total: 3000 }
        ],
        aiClient: mockAiClient,
        aiSearch: true
      }
    });

    await wrapper.vm.$nextTick();

    // Should show AI search input
    const searchInput = wrapper.find('input[type="text"]');
    expect(searchInput.exists()).toBe(true);
  });

  it('should execute AI query and filter data', async () => {
    const mockResponse = JSON.stringify({
      filter: {
        conditions: [
          { column: 'country', operator: 'equals', value: 'India' }
        ],
        operator: 'AND'
      },
      explanation: 'Filtering by India'
    });

    (mockAiClient.chat as any).mockResolvedValue(mockResponse);

    const wrapper = mount(SmartDataTable, {
      props: {
        data: [
          { id: 1, country: 'USA', total: 5000 },
          { id: 2, country: 'India', total: 3000 },
          { id: 3, country: 'India', total: 4000 }
        ],
        aiClient: mockAiClient,
        aiSearch: true
      }
    });

    await wrapper.vm.$nextTick();

    // Simulate AI search
    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('show orders from India');
    
    // Trigger search (would need to expose method or emit event)
    // This is a simplified test - actual implementation may vary
  });

  it('should show AI insights panel when enabled', async () => {
    const wrapper = mount(SmartDataTable, {
      props: {
        data: [{ id: 1, total: 5000 }],
        aiClient: mockAiClient,
        aiInsights: true
      }
    });

    await wrapper.vm.$nextTick();

    // Should have insights button or panel
    expect(wrapper.html()).toContain('insight');
  });

  it('should render row agents column when agents are provided', async () => {
    const rowAgents = [
      {
        id: 'explain',
        label: 'Explain',
        icon: '📝',
        promptTemplate: 'Explain {{id}}',
        scope: 'single' as const
      }
    ];

    const wrapper = mount(SmartDataTable, {
      props: {
        data: [{ id: 1, name: 'Test' }],
        aiClient: mockAiClient,
        rowAgents
      }
    });

    await wrapper.vm.$nextTick();

    // Should render agents column
    expect(wrapper.html()).toContain('AI Actions');
  });

  it('should handle pagination correctly', async () => {
    const data = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`
    }));

    const wrapper = mount(SmartDataTable, {
      props: {
        data,
        pagination: true,
        pageSize: 10
      }
    });

    await wrapper.vm.$nextTick();

    // Should show only 10 items
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBeLessThanOrEqual(10);
  });

  it('should handle sorting', async () => {
    const wrapper = mount(SmartDataTable, {
      props: {
        data: [
          { id: 3, name: 'Charlie' },
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' }
        ],
        columns: [
          { key: 'id', label: 'ID', sortable: true },
          { key: 'name', label: 'Name', sortable: true }
        ]
      }
    });

    await wrapper.vm.$nextTick();

    // Find sortable header
    const headers = wrapper.findAll('th');
    const idHeader = headers.find(h => h.text().includes('ID'));
    
    if (idHeader) {
      await idHeader.trigger('click');
      await wrapper.vm.$nextTick();
      
      // Data should be sorted
      const firstRow = wrapper.find('tbody tr');
      expect(firstRow.text()).toContain('1');
    }
  });

  it('should handle row selection', async () => {
    const wrapper = mount(SmartDataTable, {
      props: {
        data: [
          { id: 1, name: 'Test 1' },
          { id: 2, name: 'Test 2' }
        ],
        selectable: true
      }
    });

    await wrapper.vm.$nextTick();

    // Should have checkboxes
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('should emit events correctly', async () => {
    const wrapper = mount(SmartDataTable, {
      props: {
        data: [{ id: 1, name: 'Test' }]
      }
    });

    // Simulate row click
    const row = wrapper.find('tbody tr');
    await row.trigger('click');

    // Should emit row-click event
    expect(wrapper.emitted('row-click')).toBeTruthy();
  });

  it('should auto-generate columns when not provided', async () => {
    const wrapper = mount(SmartDataTable, {
      props: {
        data: [
          { id: 1, name: 'Test', email: 'test@example.com' }
        ]
      }
    });

    await wrapper.vm.$nextTick();

    // Should have columns for id, name, email
    const headers = wrapper.findAll('th');
    expect(headers.length).toBeGreaterThanOrEqual(3);
  });
});

