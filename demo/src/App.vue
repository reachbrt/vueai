<template>
  <div class="app">
    <header>
      <h1>Vue AI Components</h1>
      <p>Powerful AI-powered components for Vue.js applications</p>
    </header>

    <NavBar @tab-change="activeTab = $event" />

    <main>
      <section v-if="activeTab === 'all'">
        <h2>Welcome to Vue AI Components</h2>
        <div class="demo-container">
          <p>This is a demo of the Vue AI Components library.</p>
          <p>Select a tab above to explore different components:</p>
          <ul>
            <li>AI Chat Components</li>
            <li>AI Autosuggest Components</li>
            <li>AI Smart Form Components</li>
            <li>TypeScript Integration</li>
          </ul>
          <p>Visit our <a href="https://github.com/reachbrt/vueai" target="_blank">GitHub Repository</a> to learn more.</p>
        </div>
      </section>

      <section v-if="activeTab === 'chatbot'" class="chatbot-section">
        <h2>Chatbot Component</h2>
        <div class="demo-container">
          <AiChatWindow
            :client="aiClient"
            title="AI Assistant"
            placeholder="Ask me anything..."
            :show-avatars="true"
          />
        </div>
      </section>

      <section v-if="activeTab === 'autosuggest'">
        <h2>Autosuggest Component</h2>
        <div class="demo-container">
          <AutosuggestDemo />
        </div>
      </section>

      <section v-if="activeTab === 'smartform'">
        <h2>Smart Form Component</h2>
        <div class="demo-container">
          <SmartFormDemo />
        </div>
      </section>

      <section v-if="activeTab === 'typescript'">
        <h2>TypeScript Integration</h2>
        <div class="demo-container">
          <TypeScriptExample />
        </div>
      </section>
    </main>

    <footer>
      <p>Created by <a href="https://github.com/reachbrt" target="_blank">reachbrt</a> | <a href="https://github.com/reachbrt/vueai" target="_blank">GitHub Repository</a></p>
    </footer>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import AutosuggestDemo from './components/AutosuggestDemo.vue';
import SmartFormDemo from './components/SmartFormDemo.vue';
import TypeScriptExample from './components/TypeScriptExample.vue';
import { AiChatWindow } from '@aivue/chatbot';
import { aiClient } from './ai-client';

export default {
  name: 'App',
  components: {
    NavBar,
    AutosuggestDemo,
    SmartFormDemo,
    TypeScriptExample,
    AiChatWindow
  },
  data() {
    return {
      activeTab: 'all',
      aiClient
    }
  }
}
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
