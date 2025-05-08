var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

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
      const vueModule = __require("vue");
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
      const Vue = __require("vue").default || __require("vue");
      return Vue.createElement(type, props, children);
    } catch (e) {
      console.error("@aivue/core: Error creating Vue 2 node:", e);
      throw new Error("Failed to create Vue 2 node. Make sure Vue is installed correctly.");
    }
  } else {
    try {
      const { h } = __require("vue");
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
      const { defineComponent } = __require("vue");
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
      const Vue = __require("vue").default || __require("vue");
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
      const Vue = __require("vue").default || __require("vue");
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
      const Vue = __require("vue").default || __require("vue");
      return Vue.observable(state);
    } catch (e) {
      console.error("@aivue/core: Error creating Vue 2 reactive state:", e);
      return state;
    }
  } else {
    try {
      const { reactive } = __require("vue");
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
      const Vue = __require("vue").default || __require("vue");
      const data = Vue.observable({ value: initialValue });
      return data;
    } catch (e) {
      console.error("@aivue/core: Error creating Vue 2 ref:", e);
      return { value: initialValue };
    }
  } else {
    try {
      const { ref } = __require("vue");
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
export {
  AIClient,
  compatCreateElementBlock2 as compatCreateElementBlock,
  compatCreateElementVNode2 as compatCreateElementVNode,
  compatNormalizeClass2 as compatNormalizeClass,
  createCompatComponent2 as createCompatComponent,
  createCompatPlugin2 as createCompatPlugin,
  createCompatRef2 as createCompatRef,
  createNode2 as createNode,
  createReactiveState2 as createReactiveState,
  index_default as default,
  installCompatPlugin2 as installCompatPlugin,
  isOlderVue32 as isOlderVue3,
  providerRegistry,
  registerCompatComponent2 as registerCompatComponent,
  registerProviders,
  vueVersion2 as vueVersion
};
