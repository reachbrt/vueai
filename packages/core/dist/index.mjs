// src/index.ts
var AIClient = class {
  constructor(options) {
    this.provider = options.provider;
    this.apiKey = options.apiKey;
    this.model = options.model;
    this.baseUrl = options.baseUrl;
    this.organizationId = options.organizationId;
  }
  // Chat functionality
  async chat(messages, options) {
    console.log(`Using provider: ${this.provider}`);
    console.log(`Messages: ${JSON.stringify(messages)}`);
    return "This is a simulated response from the AI. In a real implementation, this would be a response from the provider API.";
  }
  // Streaming chat functionality
  async chatStream(messages, callbacks, options) {
    callbacks.onStart?.();
    const response = "This is a simulated streaming response from the AI.";
    for (const char of response) {
      callbacks.onToken?.(char);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    callbacks.onComplete?.(response);
  }
};
var providerRegistry = /* @__PURE__ */ new Map();
function registerProviders(providers) {
  for (const [providerName, config] of Object.entries(providers)) {
    providerRegistry.set(providerName, config);
  }
}
var index_default = {
  AIClient,
  registerProviders
};
export {
  AIClient,
  index_default as default,
  providerRegistry,
  registerProviders
};
