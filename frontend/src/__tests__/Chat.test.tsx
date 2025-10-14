import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Chat from '../components/Chat';
import { useChat } from '../hooks/useChat';

// Clean up after each test
beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock the useChat hook
vi.mock('../hooks/useChat', () => ({
  useChat: () => ({
    peerId: 'test-peer-id',
    connectedPeers: [],
    messages: [],
    error: null,
    connectToPeer: vi.fn(),
    sendMessage: vi.fn()
  })
}));

describe('Chat Component', () => {
  it('renders chat interface', () => {
    render(<Chat />);
    expect(screen.getByText('Secure Chat')).toBeInTheDocument();
  });

  it('displays peer ID', () => {
    render(<Chat />);
    expect(screen.getByText(/test-peer-id/)).toBeInTheDocument();
  });

  it('handles peer connection', () => {
    const mockConnectToPeer = vi.fn();
    vi.mocked(useChat).mockReturnValue({
      peerId: 'test-peer-id',
      connectedPeers: [],
      messages: [],
      error: null,
      connectToPeer: mockConnectToPeer,
      sendMessage: vi.fn()
    });

    render(<Chat />);
    
    const input = screen.getByPlaceholderText('Enter peer ID to connect...');
    const connectButton = screen.getByText('Connect');

    fireEvent.change(input, { target: { value: 'target-peer-id' } });
    fireEvent.click(connectButton);

    expect(mockConnectToPeer).toHaveBeenCalledWith('target-peer-id');
  });

  it('shows error message when present', () => {
    vi.mocked(useChat).mockReturnValue({
      peerId: 'test-peer-id',
      connectedPeers: [],
      messages: [],
      error: 'Connection failed',
      connectToPeer: vi.fn(),
      sendMessage: vi.fn()
    });

    render(<Chat />);
    expect(screen.getByText('Connection failed')).toBeInTheDocument();
  });

  it('displays connected peers', () => {
    vi.mocked(useChat).mockReturnValue({
      peerId: 'test-peer-id',
      connectedPeers: ['peer-1', 'peer-2'],
      messages: [],
      error: null,
      connectToPeer: vi.fn(),
      sendMessage: vi.fn()
    });

    render(<Chat />);
    expect(screen.getByText('Connected Peers:')).toBeInTheDocument();
    expect(screen.getByText('peer-1')).toBeInTheDocument();
    expect(screen.getByText('peer-2')).toBeInTheDocument();
  });
});