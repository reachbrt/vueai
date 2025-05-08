<template>
  <div class="app">
    <header>
      <h1>AIVue Chatbot Demo</h1>
      <p>A demonstration of the @aivue/chatbot package with TypeScript support</p>
    </header>

    <main>
      <div class="demo-container">
        <h2>Basic Chat Window</h2>
        <AiChatWindow
          :client="aiClient"
          title="AI Assistant"
          placeholder="Ask me anything..."
          :show-avatars="true"
          theme="light"
        />
      </div>

      <div class="demo-container">
        <h2>Custom Chat Implementation</h2>
        <CustomChat />
      </div>

      <div class="demo-container">
        <h2>TypeScript Example</h2>
        <TypeScriptExample />
      </div>
    </main>

    <footer>
      <p>Powered by <a href="https://github.com/reachbrt/vueai" target="_blank">AIVue</a></p>
    </footer>

    <!-- Intercom-like Chat Toggle -->
    <AiChatToggle
      :client="aiClient"
      title="AI Assistant"
      position="bottom"
      theme="light"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AiChatWindow, AiChatToggle } from '@aivue/chatbot';
import { aiClient } from './ai-client';
import CustomChat from './components/CustomChat.vue';
import TypeScriptExample from './components/TypeScriptExample.vue';

export default defineComponent({
  name: 'App',
  components: {
    AiChatWindow,
    AiChatToggle,
    CustomChat,
    TypeScriptExample
  },
  setup() {
    return {
      aiClient
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
  margin-bottom: 40px;
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

.demo-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 30px;
}

.demo-container h2 {
  margin-top: 0;
  color: #1e40af;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
  margin-bottom: 20px;
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
