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
  compatCreateElementBlock: () => compatCreateElementBlock2,
  compatCreateElementVNode: () => compatCreateElementVNode2,
  compatNormalizeClass: () => compatNormalizeClass2,
  createCompatComponent: () => createCompatComponent2,
  createCompatPlugin: () => createCompatPlugin2,
  createCompatRef: () => createCompatRef2,
  createNode: () => createNode2,
  createReactiveState: () => createReactiveState2,
  default: () => index_default,
  installCompatPlugin: () => installCompatPlugin2,
  isOlderVue3: () => isOlderVue32,
  providerRegistry: () => providerRegistry,
  registerCompatComponent: () => registerCompatComponent2,
  registerProviders: () => registerProviders,
  vueVersion: () => vueVersion2
});
module.exports = __toCommonJS(index_exports);

// src/utils/vue-compat.ts
var vueVersion = 3;
var isOlderVue3 = false;
try {
  if (typeof window !== "undefined" && window.Vue) {
    const version = window.Vue.version;
    if (version && version.startsWith("2.")) {
      vueVersion = 2;
    }
  } else {
    try {
      const vueModule = require("vue");
      if (vueModule.default && vueModule.default.version && vueModule.default.version.startsWith("2.")) {
        vueVersion = 2;
      } else if (vueModule.version && vueModule.version.startsWith("3.") && !vueModule.createElementBlock) {
        isOlderVue3 = true;
      }
    } catch (e) {
      console.warn("@aivue/core: Unable to determine Vue version, assuming Vue 3");
    }
  }
} catch (e) {
  console.warn("@aivue/core: Error detecting Vue version, assuming Vue 3");
}
function createNode(type, props, children) {
  if (vueVersion === 2) {
    try {
      const Vue = require("vue").default || require("vue");
      return Vue.createElement(type, props, children);
    } catch (e) {
      console.error("@aivue/core: Error creating Vue 2 node:", e);
      throw new Error("Failed to create Vue 2 node. Make sure Vue is installed correctly.");
    }
  } else {
    try {
      const { h } = require("vue");
      return h(type, props, children);
    } catch (e) {
      console.error("@aivue/core: Error creating Vue 3 node:", e);
      throw new Error("Failed to create Vue 3 node. Make sure Vue is installed correctly.");
    }
  }
}
function compatCreateElementBlock(type, props, children) {
  return createNode(type, props, children);
}
function compatCreateElementVNode(type, props, children) {
  return createNode(type, props, children);
}
function compatNormalizeClass(value) {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(compatNormalizeClass).filter(Boolean).join(" ");
  }
  if (typeof value === "object" && value !== null) {
    return Object.keys(value).filter((key) => value[key]).join(" ");
  }
  return "";
}
function createCompatComponent(options) {
  if (vueVersion === 2) {
    if (options.template && !options.render) {
      console.warn("@aivue/core: Component has template but no render function. This may not work in Vue 2.");
    }
    return options;
  } else if (isOlderVue3) {
    try {
      const { defineComponent } = require("vue");
      return defineComponent(options);
    } catch (e) {
      console.error("@aivue/core: Error defining Vue 3 component:", e);
      return options;
    }
  } else {
    return options;
  }
}
function registerCompatComponent(app, name, component) {
  if (vueVersion === 2) {
    try {
      const Vue = require("vue").default || require("vue");
      Vue.component(name, component);
      return Vue;
    } catch (e) {
      console.error("@aivue/core: Error registering Vue 2 component:", e);
      throw new Error("Failed to register Vue 2 component. Make sure Vue is installed correctly.");
    }
  } else {
    if (!app || typeof app.component !== "function") {
      console.error("@aivue/core: Invalid Vue 3 app instance provided for component registration");
      return app;
    }
    app.component(name, createCompatComponent(component));
    return app;
  }
}
function createCompatPlugin(options) {
  return options;
}
function installCompatPlugin(app, plugin, options) {
  if (vueVersion === 2) {
    try {
      const Vue = require("vue").default || require("vue");
      Vue.use(plugin, options);
      return Vue;
    } catch (e) {
      console.error("@aivue/core: Error installing Vue 2 plugin:", e);
      throw new Error("Failed to install Vue 2 plugin. Make sure Vue is installed correctly.");
    }
  } else {
    if (!app || typeof app.use !== "function") {
      console.error("@aivue/core: Invalid Vue 3 app instance provided for plugin installation");
      return app;
    }
    app.use(plugin, options);
    return app;
  }
}
function createReactiveState(state) {
  if (vueVersion === 2) {
    try {
      const Vue = require("vue").default || require("vue");
      return Vue.observable(state);
    } catch (e) {
      console.error("@aivue/core: Error creating Vue 2 reactive state:", e);
      return state;
    }
  } else {
    try {
      const { reactive } = require("vue");
      return reactive(state);
    } catch (e) {
      console.error("@aivue/core: Error creating Vue 3 reactive state:", e);
      return state;
    }
  }
}
function createCompatRef(initialValue) {
  if (vueVersion === 2) {
    try {
      const Vue = require("vue").default || require("vue");
      const data = Vue.observable({ value: initialValue });
      return data;
    } catch (e) {
      console.error("@aivue/core: Error creating Vue 2 ref:", e);
      return { value: initialValue };
    }
  } else {
    try {
      const { ref } = require("vue");
      return ref(initialValue);
    } catch (e) {
      console.error("@aivue/core: Error creating Vue 3 ref:", e);
      return { value: initialValue };
    }
  }
}
var vue_compat_default = {
  vueVersion,
  isOlderVue3,
  createNode,
  compatCreateElementBlock,
  compatCreateElementVNode,
  compatNormalizeClass,
  createCompatComponent,
  registerCompatComponent,
  createCompatPlugin,
  installCompatPlugin,
  createReactiveState,
  createCompatRef
};

// src/index.ts
var vueVersion2 = vue_compat_default.vueVersion;
var isOlderVue32 = vue_compat_default.isOlderVue3;
var createNode2 = vue_compat_default.createNode;
var compatCreateElementBlock2 = vue_compat_default.compatCreateElementBlock;
var compatCreateElementVNode2 = vue_compat_default.compatCreateElementVNode;
var compatNormalizeClass2 = vue_compat_default.compatNormalizeClass;
var createCompatComponent2 = vue_compat_default.createCompatComponent;
var registerCompatComponent2 = vue_compat_default.registerCompatComponent;
var createCompatPlugin2 = vue_compat_default.createCompatPlugin;
var installCompatPlugin2 = vue_compat_default.installCompatPlugin;
var createReactiveState2 = vue_compat_default.createReactiveState;
var createCompatRef2 = vue_compat_default.createCompatRef;
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
    if (!this.apiKey && this.provider !== "ollama") {
      console.warn(`No API key provided for ${this.provider}. Using fallback response.`);
      return this.getFallbackResponse(messages);
    }
    try {
      switch (this.provider) {
        case "openai":
          return await this.callOpenAI(messages, options);
        case "claude":
          return await this.callClaude(messages, options);
        case "gemini":
          return await this.callGemini(messages, options);
        case "ollama":
          return await this.callOllama(messages, options);
        default:
          return this.getFallbackResponse(messages);
      }
    } catch (error) {
      console.error(`Error calling ${this.provider} API:`, error);
      throw error;
    }
  }
  // Streaming chat functionality
  async chatStream(messages, callbacks, options) {
    callbacks.onStart?.();
    if (!this.apiKey && this.provider !== "ollama") {
      console.warn(`No API key provided for ${this.provider}. Using fallback response.`);
      return this.streamFallbackResponse(callbacks);
    }
    try {
      switch (this.provider) {
        case "openai":
          await this.streamOpenAI(messages, callbacks, options);
          break;
        case "claude":
          await this.streamClaude(messages, callbacks, options);
          break;
        case "gemini":
          await this.streamGemini(messages, callbacks, options);
          break;
        case "ollama":
          await this.streamOllama(messages, callbacks, options);
          break;
        default:
          await this.streamFallbackResponse(callbacks);
      }
    } catch (error) {
      console.error(`Error streaming from ${this.provider} API:`, error);
      callbacks.onError?.(error);
    }
  }
  // OpenAI implementation
  async callOpenAI(messages, options) {
    const url = this.baseUrl || "https://api.openai.com/v1/chat/completions";
    const model = this.model || "gpt-3.5-turbo";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        ...this.organizationId ? { "OpenAI-Organization": this.organizationId } : {}
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens,
        top_p: options?.topP || 1,
        frequency_penalty: options?.frequencyPenalty || 0,
        presence_penalty: options?.presencePenalty || 0,
        stop: options?.stopSequences,
        stream: false
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  }
  async streamOpenAI(messages, callbacks, options) {
    const url = this.baseUrl || "https://api.openai.com/v1/chat/completions";
    const model = this.model || "gpt-3.5-turbo";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        ...this.organizationId ? { "OpenAI-Organization": this.organizationId } : {}
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens,
        top_p: options?.topP || 1,
        frequency_penalty: options?.frequencyPenalty || 0,
        presence_penalty: options?.presencePenalty || 0,
        stop: options?.stopSequences,
        stream: true
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }
    if (!response.body) {
      throw new Error("Response body is null");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let completeText = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              if (content) {
                callbacks.onToken?.(content);
                completeText += content;
              }
            } catch (e) {
              console.warn("Error parsing SSE message:", e);
            }
          }
        }
      }
    } finally {
      callbacks.onComplete?.(completeText);
    }
  }
  // Claude implementation
  async callClaude(messages, options) {
    return this.getFallbackResponse(messages);
  }
  async streamClaude(messages, callbacks, options) {
    await this.streamFallbackResponse(callbacks);
  }
  // Gemini implementation
  async callGemini(messages, options) {
    return this.getFallbackResponse(messages);
  }
  async streamGemini(messages, callbacks, options) {
    await this.streamFallbackResponse(callbacks);
  }
  // Ollama implementation
  async callOllama(messages, options) {
    return this.getFallbackResponse(messages);
  }
  async streamOllama(messages, callbacks, options) {
    await this.streamFallbackResponse(callbacks);
  }
  // Fallback implementations
  getFallbackResponse(messages) {
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    if (userMessage.includes("hello") || userMessage.includes("hi")) {
      return "Hello! I'm an AI assistant. How can I help you today?";
    } else if (userMessage.includes("help")) {
      return "I'm here to help! You can ask me questions, request information, or just chat.";
    } else {
      return "I'm an AI assistant powered by the @aivue library. To get real responses, please provide a valid API key for your chosen provider.";
    }
  }
  async streamFallbackResponse(callbacks) {
    const response = "I'm an AI assistant powered by the @aivue library. To get real responses, please provide a valid API key for your chosen provider.";
    for (const char of response) {
      callbacks.onToken?.(char);
      await new Promise((resolve) => setTimeout(resolve, 30));
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
  registerProviders,
  // Include compatibility utilities in default export
  vueVersion: vueVersion2,
  isOlderVue3: isOlderVue32,
  createNode: createNode2,
  compatCreateElementBlock: compatCreateElementBlock2,
  compatCreateElementVNode: compatCreateElementVNode2,
  compatNormalizeClass: compatNormalizeClass2,
  createCompatComponent: createCompatComponent2,
  registerCompatComponent: registerCompatComponent2,
  createCompatPlugin: createCompatPlugin2,
  installCompatPlugin: installCompatPlugin2,
  createReactiveState: createReactiveState2,
  createCompatRef: createCompatRef2
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AIClient,
  compatCreateElementBlock,
  compatCreateElementVNode,
  compatNormalizeClass,
  createCompatComponent,
  createCompatPlugin,
  createCompatRef,
  createNode,
  createReactiveState,
  installCompatPlugin,
  isOlderVue3,
  providerRegistry,
  registerCompatComponent,
  registerProviders,
  vueVersion
});
//# sourceMappingURL=index.js.map