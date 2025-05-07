// src/index.ts
function useChatEngine(options) {
  return {
    messages: options.initialMessages || [],
    isLoading: false,
    error: null,
    sendMessage: async () => {
      console.log("Message sent");
    },
    resetConversation: () => {
      console.log("Conversation reset");
    }
  };
}
var AiChatWindow = {
  name: "AiChatWindow"
  // Component implementation would go here
};
var index_default = {
  useChatEngine,
  AiChatWindow
};
export {
  AiChatWindow,
  index_default as default,
  useChatEngine
};
