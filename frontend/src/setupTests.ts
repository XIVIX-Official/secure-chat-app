import '@testing-library/jest-dom';
import { vi } from 'vitest'

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  url: string;
  readyState: number = MockWebSocket.CONNECTING;
  
  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
  }

  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  send = vi.fn();
  close = vi.fn();
}

// Mock WebSocket API
global.WebSocket = MockWebSocket as any;