<template>
  <div class="app">
    <header>
      <h1>AIVue Components Demo</h1>
      <p>A demonstration of all @aivue packages with TypeScript support</p>
    </header>

    <NavBar @tab-change="changeTab" />

    <main>
      <!-- Chatbot demos -->
      <section v-if="activeTab === 'chatbot' || activeTab === 'all'">
        <h2>Chatbot Components</h2>
        <div class="demo-container">
          <h3>Basic Chat Window</h3>
          <AiChatWindow
            :client="aiClient"
            title="AI Assistant"
            placeholder="Ask me anything..."
            :show-avatars="true"
            theme="light"
          />
        </div>

        <div class="demo-container">
          <h3>Custom Chat Implementation</h3>
          <CustomChat />
        </div>

        <div class="demo-container">
          <h3>TypeScript Example</h3>
          <TypeScriptExample />
        </div>
      </section>

      <!-- Autosuggest demos -->
      <section v-if="activeTab === 'autosuggest' || activeTab === 'all'">
        <h2>Autosuggest Components</h2>
        <div class="demo-container">
          <AutosuggestDemo />
        </div>
      </section>

      <!-- SmartForm demos -->
      <section v-if="activeTab === 'smartform' || activeTab === 'all'">
        <h2>SmartForm Components</h2>
        <div class="demo-container">
          <SmartFormDemo />
        </div>
      </section>
    </main>

    <footer>
      <p>Powered by <a href="https://github.com/reachbrt/vueai" target="_blank">AIVue</a></p>
    </footer>

    <!-- Intercom-like Chat Toggle -->
    <AiChatToggle
      :client="aiClient"
      title="Chat with AI"
      theme="light"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { aiClient } from './ai-client';
import CustomChat from './components/CustomChat.vue';
import TypeScriptExample from './components/TypeScriptExample.vue';
import AutosuggestDemo from './components/AutosuggestDemo.vue';
import SmartFormDemo from './components/SmartFormDemo.vue';
import NavBar from './components/NavBar.vue';

// Import components directly
import { AiChatWindow, AiChatToggle } from '@aivue/chatbot';

export default defineComponent({
  name: 'App',
  components: {
    AiChatWindow,
    AiChatToggle,
    CustomChat,
    TypeScriptExample,
    AutosuggestDemo,
    SmartFormDemo,
    NavBar
  },
  setup() {
    const activeTab = ref('all');

    const changeTab = (tabId: string) => {
      activeTab.value = tabId;
    };

    return {
      aiClient,
      activeTab,
      changeTab
    };
  }
});
</script>

<style>
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  color: #333;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #2563eb;
}

header p {
  font-size: 1.2rem;
  color: #64748b;
}

h2 {
  color: #1e40af;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

h3 {
  margin-top: 0;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.demo-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 30px;
}

section {
  margin-bottom: 40px;
}

footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
}

footer a {
  color: #2563eb;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>
