/**
 * Vue Compatibility Layer
 *
 * This module provides compatibility functions for different versions of Vue (2.x and 3.x).
 * It ensures that the package works across all Vue versions by detecting the Vue version
 * and providing appropriate polyfills and adapters.
 */

// Detect Vue version
let vueVersion = 3; // Default to Vue 3
let isOlderVue3 = false;

try {
  // Try to access Vue global (Vue 2 style)
  // @ts-ignore - Intentional global check
  if (typeof window !== 'undefined' && window.Vue) {
    // @ts-ignore - Intentional global check
    const version = window.Vue.version;
    if (version && version.startsWith('2.')) {
      vueVersion = 2;
    }
  } else {
    // Try to import Vue (ESM style)
    try {
      // @ts-ignore - Dynamic import
      const vueModule = require('vue');

      // Check if it's Vue 2 (has default export with version)
      if (vueModule.default && vueModule.default.version && vueModule.default.version.startsWith('2.')) {
        vueVersion = 2;
      }
      // Check if it's older Vue 3 (missing createElementBlock)
      else if (vueModule.version && vueModule.version.startsWith('3.') && !vueModule.createElementBlock) {
        isOlderVue3 = true;
      }
    } catch (e) {
      // Unable to determine version, use defaults
      console.warn('@aivue/core: Unable to determine Vue version, assuming Vue 3');
    }
  }
} catch (e) {
  // Error in detection, use defaults
  console.warn('@aivue/core: Error detecting Vue version, assuming Vue 3');
}

/**
 * Create a VNode - works in both Vue 2 and Vue 3
 */
export function createNode(type: any, props?: any, children?: any): any {
  if (vueVersion === 2) {
    // Vue 2 approach
    try {
      // @ts-ignore - Dynamic import
      const Vue = require('vue').default || require('vue');
      return Vue.createElement(type, props, children);
    } catch (e) {
      console.error('@aivue/core: Error creating Vue 2 node:', e);
      throw new Error('Failed to create Vue 2 node. Make sure Vue is installed correctly.');
    }
  } else {
    // Vue 3 approach
    try {
      // @ts-ignore - Dynamic import
      const { h } = require('vue');
      return h(type, props, children);
    } catch (e) {
      console.error('@aivue/core: Error creating Vue 3 node:', e);
      throw new Error('Failed to create Vue 3 node. Make sure Vue is installed correctly.');
    }
  }
}

/**
 * Polyfill for createElementBlock (Vue 3.2+)
 */
export function compatCreateElementBlock(type: any, props?: any, children?: any): any {
  return createNode(type, props, children);
}

/**
 * Polyfill for createElementVNode (Vue 3.2+)
 */
export function compatCreateElementVNode(type: any, props?: any, children?: any): any {
  return createNode(type, props, children);
}

/**
 * Polyfill for normalizeClass (Vue 3.2+)
 * This function normalizes class values into a string
 */
export function compatNormalizeClass(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(compatNormalizeClass).filter(Boolean).join(' ');
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value)
      .filter(key => (value as Record<string, boolean>)[key])
      .join(' ');
  }

  return '';
}

/**
 * Create a component that works in both Vue 2 and Vue 3
 */
export function createCompatComponent(options: any): any {
  if (vueVersion === 2) {
    // For Vue 2, ensure options has a render function if using template
    if (options.template && !options.render) {
      console.warn('@aivue/core: Component has template but no render function. This may not work in Vue 2.');
    }
    return options;
  } else if (isOlderVue3) {
    // For Vue 3.0.x, we need to ensure the component is created with defineComponent
    try {
      // @ts-ignore - Dynamic import
      const { defineComponent } = require('vue');
      return defineComponent(options);
    } catch (e) {
      console.error('@aivue/core: Error defining Vue 3 component:', e);
      return options; // Fallback to returning options directly
    }
  } else {
    // For Vue 3.2+, we can use the options directly
    return options;
  }
}

/**
 * Register a component globally - works in both Vue 2 and Vue 3
 */
export function registerCompatComponent(app: any, name: string, component: any): any {
  if (vueVersion === 2) {
    // Vue 2 global registration
    try {
      // @ts-ignore - Dynamic import
      const Vue = require('vue').default || require('vue');
      Vue.component(name, component);
      return Vue;
    } catch (e) {
      console.error('@aivue/core: Error registering Vue 2 component:', e);
      throw new Error('Failed to register Vue 2 component. Make sure Vue is installed correctly.');
    }
  } else {
    // Vue 3 global registration
    if (!app || typeof app.component !== 'function') {
      console.error('@aivue/core: Invalid Vue 3 app instance provided for component registration');
      return app;
    }
    app.component(name, createCompatComponent(component));
    return app;
  }
}

/**
 * Create a Vue plugin that works in both Vue 2 and Vue 3
 */
export function createCompatPlugin(options: { install: Function }): any {
  return options;
}

/**
 * Install a plugin - works in both Vue 2 and Vue 3
 */
export function installCompatPlugin(app: any, plugin: any, options?: any): any {
  if (vueVersion === 2) {
    // Vue 2 plugin installation
    try {
      // @ts-ignore - Dynamic import
      const Vue = require('vue').default || require('vue');
      Vue.use(plugin, options);
      return Vue;
    } catch (e) {
      console.error('@aivue/core: Error installing Vue 2 plugin:', e);
      throw new Error('Failed to install Vue 2 plugin. Make sure Vue is installed correctly.');
    }
  } else {
    // Vue 3 plugin installation
    if (!app || typeof app.use !== 'function') {
      console.error('@aivue/core: Invalid Vue 3 app instance provided for plugin installation');
      return app;
    }
    app.use(plugin, options);
    return app;
  }
}

/**
 * Create a reactive object - works in both Vue 2 and Vue 3
 */
export function createReactiveState(state: any): any {
  if (vueVersion === 2) {
    // Vue 2 reactivity
    try {
      // @ts-ignore - Dynamic import
      const Vue = require('vue').default || require('vue');
      return Vue.observable(state);
    } catch (e) {
      console.error('@aivue/core: Error creating Vue 2 reactive state:', e);
      return state; // Fallback to non-reactive state
    }
  } else {
    // Vue 3 reactivity
    try {
      // @ts-ignore - Dynamic import
      const { reactive } = require('vue');
      return reactive(state);
    } catch (e) {
      console.error('@aivue/core: Error creating Vue 3 reactive state:', e);
      return state; // Fallback to non-reactive state
    }
  }
}

/**
 * Create a ref - works in both Vue 2 and Vue 3
 */
export function createCompatRef<T>(initialValue: T): any {
  if (vueVersion === 2) {
    // Vue 2 ref equivalent
    try {
      // @ts-ignore - Dynamic import
      const Vue = require('vue').default || require('vue');
      const data = Vue.observable({ value: initialValue });
      return data;
    } catch (e) {
      console.error('@aivue/core: Error creating Vue 2 ref:', e);
      return { value: initialValue }; // Fallback to plain object
    }
  } else {
    // Vue 3 ref
    try {
      // @ts-ignore - Dynamic import
      const { ref } = require('vue');
      return ref(initialValue);
    } catch (e) {
      console.error('@aivue/core: Error creating Vue 3 ref:', e);
      return { value: initialValue }; // Fallback to plain object
    }
  }
}

export default {
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
