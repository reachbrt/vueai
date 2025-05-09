<template>
  <nav class="navbar">
    <h3>AIVue Components</h3>
    <div class="nav-links">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="selectTab(tab.id)"
        :class="{ 'active': activeTab === tab.id }"
      >
        {{ tab.name }}
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'NavBar',
  setup(_, { emit }) {
    const tabs = [
      { id: 'chatbot', name: 'Chatbot' },
      { id: 'autosuggest', name: 'Autosuggest' },
      { id: 'smartform', name: 'SmartForm' },
      { id: 'all', name: 'All Components' }
    ];
    
    const activeTab = ref('all');
    
    const selectTab = (tabId: string) => {
      activeTab.value = tabId;
      emit('tab-change', tabId);
    };
    
    return {
      tabs,
      activeTab,
      selectTab
    };
  }
});
</script>

<style scoped>
.navbar {
  background-color: #2563eb;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
}

h3 {
  margin: 0;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.nav-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

button.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: white;
}
</style>