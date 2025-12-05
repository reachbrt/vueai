import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

global.localStorage = localStorageMock as Storage;

// Mock document.hidden for attention monitoring
Object.defineProperty(document, 'hidden', {
  writable: true,
  configurable: true,
  value: false
});

// Mock document.visibilityState
Object.defineProperty(document, 'visibilityState', {
  writable: true,
  configurable: true,
  value: 'visible'
});

// Mock Page Visibility API
global.addEventListener = vi.fn();
global.removeEventListener = vi.fn();

// Mock Notification API
class NotificationMock {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;

  constructor(title: string, options?: any) {
    this.title = title;
    this.body = options?.body;
    this.icon = options?.icon;
    this.tag = options?.tag;
  }

  close() {}
}

(NotificationMock as any).permission = 'granted';
(NotificationMock as any).requestPermission = vi.fn().mockResolvedValue('granted');

global.Notification = NotificationMock as any;

