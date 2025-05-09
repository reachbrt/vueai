import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChatEngine } from '../src/composables/useChatEngine';
import { AIClient } from '@aivue/core';

// Mock AIClient
vi.mock('@aivue/core', () => {
  return {
    AIClient: vi.fn().mockImplementation(() => {
      return {
        chat: vi.fn().mockResolvedValue('This is a mock response'),
        chatStream: vi.fn().mockImplementation((messages, callbacks) => {
          callbacks.onStart?.();
          callbacks.onToken?.('This ');
          callbacks.onToken?.('is ');
          callbacks.onToken?.('a ');
          callbacks.onToken?.('mock ');
          callbacks.onToken?.('streaming ');
          callbacks.onToken?.('response');
          callbacks.onComplete?.('This is a mock streaming response');
          return Promise.resolve();
        })
      };
    })
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useChatEngine', () => {
  let mockClient: AIClient;
  
  beforeEach(() => {
    mockClient = new AIClient({ provider: 'fallback' });
    vi.clearAllMocks();
    localStorageMock.clear();
  });
  
  it('should initialize with empty messages', () => {
    const { messages } = useChatEngine({
      client: mockClient
    });
    
    expect(messages.value).toEqual([]);
  });
  
  it('should add a user message when sending a message', async () => {
    const { messages, sendMessage } = useChatEngine({
      client: mockClient,
      streaming: false
    });
    
    await sendMessage('Hello, AI!');
    
    expect(messages.value.length).toBe(2);
    expect(messages.value[0].role).toBe('user');
    expect(messages.value[0].content).toBe('Hello, AI!');
    expect(messages.value[1].role).toBe('assistant');
  });
  
  it('should handle streaming responses', async () => {
    const { messages, sendMessage } = useChatEngine({
      client: mockClient,
      streaming: true
    });
    
    await sendMessage('Hello, AI!');
    
    expect(messages.value.length).toBe(2);
    expect(messages.value[0].role).toBe('user');
    expect(messages.value[0].content).toBe('Hello, AI!');
    expect(messages.value[1].role).toBe('assistant');
    expect(messages.value[1].content).toBe('This is a mock streaming response');
  });
  
  it('should clear messages', () => {
    const { messages, sendMessage, clearMessages } = useChatEngine({
      client: mockClient
    });
    
    // Add some messages
    sendMessage('Hello');
    
    // Clear messages
    clearMessages();
    
    expect(messages.value).toEqual([]);
  });
  
  it('should persist messages to localStorage if persistenceKey is provided', async () => {
    const persistenceKey = 'test-chat';
    
    const { messages, sendMessage } = useChatEngine({
      client: mockClient,
      persistenceKey
    });
    
    await sendMessage('Hello, AI!');
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      persistenceKey,
      expect.any(String)
    );
    
    const savedMessages = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedMessages.length).toBe(2);
    expect(savedMessages[0].content).toBe('Hello, AI!');
  });
  
  it('should load messages from localStorage if persistenceKey is provided', () => {
    const persistenceKey = 'test-chat';
    const savedMessages = [
      { role: 'user', content: 'Previous message', id: '123', timestamp: new Date().toISOString() }
    ];
    
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedMessages));
    
    const { messages } = useChatEngine({
      client: mockClient,
      persistenceKey
    });
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith(persistenceKey);
    expect(messages.value.length).toBe(1);
    expect(messages.value[0].content).toBe('Previous message');
  });
  
  it('should limit the number of messages if maxMessages is provided', async () => {
    const { messages, sendMessage } = useChatEngine({
      client: mockClient,
      maxMessages: 2
    });
    
    // Send 3 messages (which will result in 6 messages total - 3 user, 3 assistant)
    await sendMessage('Message 1');
    await sendMessage('Message 2');
    await sendMessage('Message 3');
    
    // Should only keep the last 2 messages (1 user, 1 assistant)
    expect(messages.value.length).toBe(2);
    expect(messages.value[0].content).toBe('Message 3');
    expect(messages.value[1].content).toBe('This is a mock response');
  });
});
