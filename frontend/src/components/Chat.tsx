import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

const Chat: React.FC = () => {
  const [targetPeerId, setTargetPeerId] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    peerId,
    connectedPeers,
    messages,
    error,
    connectToPeer,
    sendMessage
  } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPeerId) {
      await connectToPeer(targetPeerId);
      setTargetPeerId('');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput && connectedPeers.length > 0) {
      await sendMessage(connectedPeers[0], messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Secure Chat</h1>
        {peerId && (
          <p className="text-sm text-gray-600">
            Your ID: <span className="font-mono">{peerId}</span>
          </p>
        )}
      </header>

      <main className="flex-1 p-4 flex flex-col space-y-4 max-w-4xl mx-auto w-full">
        {/* Connection Form */}
        <form onSubmit={handleConnect} className="flex gap-2">
          <input
            type="text"
            value={targetPeerId}
            onChange={(e) => setTargetPeerId(e.target.value)}
            placeholder="Enter peer ID to connect..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Connect
          </button>
        </form>

        {/* Connected Peers */}
        {connectedPeers.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Connected Peers:</h2>
            <ul className="space-y-1">
              {connectedPeers.map(peer => (
                <li key={peer} className="font-mono text-sm">
                  {peer}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 bg-white rounded shadow overflow-y-auto">
          <div className="p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`max-w-xs p-3 rounded ${
                  message.senderId === peerId
                    ? 'ml-auto bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={connectedPeers.length === 0}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default Chat;