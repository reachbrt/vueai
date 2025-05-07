"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AIClient: () => AIClient,
  default: () => index_default,
  providerRegistry: () => providerRegistry,
  registerProviders: () => registerProviders
});
module.exports = __toCommonJS(index_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AIClient,
  providerRegistry,
  registerProviders
});
