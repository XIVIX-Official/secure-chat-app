import { useEffect, useState, useCallback } from 'react';
import { ChatService, ChatEvent, Message } from '../services/ChatService';

export function useChat() {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const chatService = new ChatService();

    const initialize = async () => {
      try {
        const id = await chatService.joinNetwork();
        setPeerId(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to join network');
      }
    };

    const handleEvent = (event: ChatEvent) => {
      switch (event.type) {
        case 'message':
          setMessages(prev => [...prev, event.payload]);
          break;
        case 'peer-connected':
          setConnectedPeers(prev => [...prev, event.payload.peerId]);
          break;
        case 'peer-disconnected':
          setConnectedPeers(prev => 
            prev.filter(id => id !== event.payload.peerId)
          );
          break;
      }
    };

    initialize();
    const cleanup = chatService.onEvent(handleEvent);

    return () => {
      cleanup();
      chatService.disconnect();
    };
  }, []);

  const connectToPeer = useCallback(async (targetPeerId: string) => {
    try {
      const chatService = new ChatService();
      await chatService.connectToPeer(targetPeerId);
      setConnectedPeers(prev => [...prev, targetPeerId]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to peer');
    }
  }, []);

  const sendMessage = useCallback(async (recipientId: string, content: string) => {
    try {
      const chatService = new ChatService();
      await chatService.sendMessage(recipientId, content);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          senderId: peerId!,
          content,
          timestamp: Date.now()
        }
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  }, [peerId]);

  return {
    peerId,
    connectedPeers,
    messages,
    error,
    connectToPeer,
    sendMessage
  };
}