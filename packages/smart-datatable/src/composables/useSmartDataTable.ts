import { ref, computed, Ref } from 'vue';
import type { AIClient } from '@aivue/core';

export interface UseSmartDataTableOptions {
  data: Ref<any[]>;
  aiClient?: AIClient;
  searchable?: boolean;
  sortable?: boolean;
}

export function useSmartDataTable(options: UseSmartDataTableOptions) {
  const { data, aiClient, searchable = true, sortable = true } = options;

  const searchQuery = ref('');
  const sortKey = ref('');
  const sortOrder = ref<'asc' | 'desc'>('asc');
  const loading = ref(false);

  // Filtered data based on search
  const filteredData = computed(() => {
    if (!searchable || !searchQuery.value) {
      return data.value;
    }

    const query = searchQuery.value.toLowerCase();
    return data.value.filter(item => {
      return Object.values(item).some(value =>
        String(value).toLowerCase().includes(query)
      );
    });
  });

  // Sorted data
  const sortedData = computed(() => {
    if (!sortable || !sortKey.value) {
      return filteredData.value;
    }

    return [...filteredData.value].sort((a, b) => {
      const aVal = a[sortKey.value];
      const bVal = b[sortKey.value];

      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      if (aVal > bVal) comparison = 1;

      return sortOrder.value === 'asc' ? comparison : -comparison;
    });
  });

  // Search with AI
  async function searchWithAI(query: string) {
    if (!aiClient) {
      console.warn('AI Client not configured');
      return;
    }

    loading.value = true;
    try {
      const prompt = `Given this search query: "${query}", help me find relevant items in the dataset. Return a JSON array of search terms that would match the query.`;
      
      const response = await aiClient.chat([
        { role: 'user', content: prompt }
      ]);

      // Parse AI response and update search
      searchQuery.value = query;
    } catch (error) {
      console.error('AI search failed:', error);
    } finally {
      loading.value = false;
    }
  }

  // Get AI insights about the data
  async function getInsights() {
    if (!aiClient) {
      throw new Error('AI Client not configured');
    }

    loading.value = true;
    try {
      const dataSnapshot = data.value.slice(0, 10);
      const prompt = `Analyze this dataset and provide key insights, patterns, and recommendations:\n${JSON.stringify(dataSnapshot, null, 2)}`;
      
      const response = await aiClient.chat([
        { role: 'user', content: prompt }
      ]);

      return response.content;
    } finally {
      loading.value = false;
    }
  }

  // Sort data
  function sort(key: string) {
    if (sortKey.value === key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey.value = key;
      sortOrder.value = 'asc';
    }
  }

  // Search data
  function search(query: string) {
    searchQuery.value = query;
  }

  // Reset filters
  function reset() {
    searchQuery.value = '';
    sortKey.value = '';
    sortOrder.value = 'asc';
  }

  return {
    // State
    searchQuery,
    sortKey,
    sortOrder,
    loading,
    
    // Computed
    filteredData,
    sortedData,
    
    // Methods
    search,
    searchWithAI,
    sort,
    getInsights,
    reset
  };
}

