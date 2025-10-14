import '@testing-library/jest-dom';
import { vi } from 'vitest'

// Mock WebSocket API
global.WebSocket = vi.fn(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  send: vi.fn(),
  close: vi.fn(),
}));