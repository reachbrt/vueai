/**
 * @aivue/guided-form - Persistence Adapters
 * Provides storage adapters for save-and-resume functionality
 */

import type { FormState, PersistenceAdapter } from '../types';

/**
 * LocalStorage Persistence Adapter
 * Stores form state in browser localStorage
 */
export class LocalStoragePersistenceAdapter implements PersistenceAdapter {
  private prefix: string;

  constructor(prefix: string = 'guided-form') {
    this.prefix = prefix;
  }

  async save(sessionId: string, state: FormState): Promise<void> {
    const key = `${this.prefix}:${sessionId}`;
    const data = JSON.stringify(state);
    localStorage.setItem(key, data);
  }

  async load(sessionId: string): Promise<FormState | null> {
    const key = `${this.prefix}:${sessionId}`;
    const data = localStorage.getItem(key);
    
    if (!data) return null;

    try {
      return JSON.parse(data) as FormState;
    } catch {
      return null;
    }
  }

  async delete(sessionId: string): Promise<void> {
    const key = `${this.prefix}:${sessionId}`;
    localStorage.removeItem(key);
  }

  async generateResumeToken(sessionId: string): Promise<string> {
    // For localStorage, we can just use the sessionId as the token
    // In production, you'd want to encrypt or hash this
    return btoa(sessionId);
  }

  async validateResumeToken(token: string): Promise<string | null> {
    try {
      return atob(token);
    } catch {
      return null;
    }
  }
}

/**
 * SessionStorage Persistence Adapter
 * Stores form state in browser sessionStorage (cleared when tab closes)
 */
export class SessionStoragePersistenceAdapter implements PersistenceAdapter {
  private prefix: string;

  constructor(prefix: string = 'guided-form') {
    this.prefix = prefix;
  }

  async save(sessionId: string, state: FormState): Promise<void> {
    const key = `${this.prefix}:${sessionId}`;
    const data = JSON.stringify(state);
    sessionStorage.setItem(key, data);
  }

  async load(sessionId: string): Promise<FormState | null> {
    const key = `${this.prefix}:${sessionId}`;
    const data = sessionStorage.getItem(key);
    
    if (!data) return null;

    try {
      return JSON.parse(data) as FormState;
    } catch {
      return null;
    }
  }

  async delete(sessionId: string): Promise<void> {
    const key = `${this.prefix}:${sessionId}`;
    sessionStorage.removeItem(key);
  }
}

/**
 * Memory Persistence Adapter
 * Stores form state in memory (lost on page refresh)
 * Useful for testing or when persistence is not needed
 */
export class MemoryPersistenceAdapter implements PersistenceAdapter {
  private storage: Map<string, FormState> = new Map();

  async save(sessionId: string, state: FormState): Promise<void> {
    this.storage.set(sessionId, { ...state });
  }

  async load(sessionId: string): Promise<FormState | null> {
    return this.storage.get(sessionId) || null;
  }

  async delete(sessionId: string): Promise<void> {
    this.storage.delete(sessionId);
  }

  clear(): void {
    this.storage.clear();
  }
}

/**
 * Custom Persistence Adapter
 * Allows users to provide their own save/load functions
 */
export class CustomPersistenceAdapter implements PersistenceAdapter {
  constructor(
    private saveFn: (sessionId: string, state: FormState) => Promise<void>,
    private loadFn: (sessionId: string) => Promise<FormState | null>,
    private deleteFn: (sessionId: string) => Promise<void>,
    private generateTokenFn?: (sessionId: string) => Promise<string>,
    private validateTokenFn?: (token: string) => Promise<string | null>
  ) {}

  async save(sessionId: string, state: FormState): Promise<void> {
    return this.saveFn(sessionId, state);
  }

  async load(sessionId: string): Promise<FormState | null> {
    return this.loadFn(sessionId);
  }

  async delete(sessionId: string): Promise<void> {
    return this.deleteFn(sessionId);
  }

  async generateResumeToken(sessionId: string): Promise<string> {
    if (this.generateTokenFn) {
      return this.generateTokenFn(sessionId);
    }
    return sessionId;
  }

  async validateResumeToken(token: string): Promise<string | null> {
    if (this.validateTokenFn) {
      return this.validateTokenFn(token);
    }
    return token;
  }
}

