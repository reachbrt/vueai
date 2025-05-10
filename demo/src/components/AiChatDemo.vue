<template>
  <div class="ai-chat-demo">
    <AiChatWindow
      :client="aiClient"
      title="AI Assistant"
      placeholder="Ask me anything..."
      :show-avatars="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AiChatWindow } from '@aivue/chatbot';
import { AIClient } from '@aivue/core';

export default defineComponent({
  name: 'AiChatDemo',
  components: {
    AiChatWindow
  },
  setup() {
    // Create an AI client with fallback provider (no API key needed)
    const aiClient = new AIClient({
      provider: 'fallback',
      model: 'gpt-3.5-turbo'
    });
    
    return {
      aiClient
    };
  }
});
</script>

<style scoped>
.ai-chat-demo {
  height: 500px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}
</style>
