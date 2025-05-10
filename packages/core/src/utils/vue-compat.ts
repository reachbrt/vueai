/**
 * Vue Compatibility Layer
 *
 * This module provides compatibility functions for different versions of Vue (2.x and 3.x).
 * It ensures that the package works across all Vue versions by detecting the Vue version
 * and providing appropriate polyfills and adapters.
 */

// Default Vue version settings
const vueVersion: number = 3; // Default to Vue 3
const isOlderVue3: boolean = false;

// Runtime version detection will happen in the browser
// This simplified version is for type generation

/**
 * Create a VNode - works in both Vue 2 and Vue 3
 */
export function createNode(_type: any, _props?: any, _children?: any): any {
  // This is a simplified version for type generation
  return null;
}

/**
 * Polyfill for createElementBlock (Vue 3.2+)
 */
export function compatCreateElementBlock(_type: any, _props?: any, _children?: any): any {
  // This is a simplified version for type generation
  return null;
}

/**
 * Polyfill for createElementVNode (Vue 3.2+)
 */
export function compatCreateElementVNode(_type: any, _props?: any, _children?: any): any {
  // This is a simplified version for type generation
  return null;
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
  // This is a simplified version for type generation
  return options;
}

/**
 * Register a component globally - works in both Vue 2 and Vue 3
 */
export function registerCompatComponent(app: any, _name: string, _component: any): any {
  // This is a simplified version for type generation
  return app;
}

/**
 * Create a Vue plugin that works in both Vue 2 and Vue 3
 */
export function createCompatPlugin(options: { install: Function }): any {
  // This is a simplified version for type generation
  return options;
}

/**
 * Install a plugin - works in both Vue 2 and Vue 3
 */
export function installCompatPlugin(app: any, _plugin: any, _options?: any): any {
  // This is a simplified version for type generation
  return app;
}

/**
 * Create a reactive object - works in both Vue 2 and Vue 3
 */
export function createReactiveState(state: any): any {
  // This is a simplified version for type generation
  return state;
}

/**
 * Create a ref - works in both Vue 2 and Vue 3
 */
export function createCompatRef<T>(initialValue: T): any {
  // This is a simplified version for type generation
  return { value: initialValue };
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
