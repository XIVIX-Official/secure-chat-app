# Architecture Overview

## High-Level Architecture

The Secure Chat App is built on a peer-to-peer architecture with end-to-end encryption. Here's how the different components interact:

### Core Components

1. **P2P Network Layer (backend/src/p2p)**
   - Uses WebRTC for direct peer connections
   - Implements libp2p for peer discovery and routing
   - Handles connection management and peer addressing

2. **Encryption Layer (backend/src/crypto)**
   - Implements TweetNaCl.js for cryptographic operations
   - Handles key generation and management
   - Provides end-to-end encryption for all messages

3. **Storage Layer (backend/src/storage)**
   - Manages local message storage
   - Handles chat history persistence
   - Implements secure data storage patterns

4. **Frontend Layer (frontend/src)**
   - React-based user interface
   - Real-time message updates
   - Responsive design for all devices

## Data Flow

```
User Action -> Frontend Component
    ↓
State Management (React Hooks)
    ↓
P2P Service
    ↓
Encryption Layer
    ↓
Network Transport (WebRTC)
    ↓
Remote Peer
    ↓
Decryption Layer
    ↓
Message Display
```

## Security Architecture

1. **End-to-End Encryption**
   - AES-256-GCM for symmetric encryption
   - ECDH with Curve25519 for key exchange
   - Ed25519 signatures for message authentication

2. **Network Security**
   - Direct P2P connections via WebRTC
   - No central message routing
   - TLS 1.3 for signaling connections

3. **Data Privacy**
   - Local-only storage
   - No server-side message logs
   - No user tracking or profiling

## Implementation Details

### Backend Services

1. **P2PService**
   - Manages peer connections
   - Handles message routing
   - Implements peer discovery

2. **CryptoService**
   - Key generation and management
   - Message encryption/decryption
   - Secure key exchange

3. **StorageService**
   - Message persistence
   - Chat history management
   - Secure data handling

### Frontend Components

1. **Chat Component**
   - Message display and input
   - Peer connection UI
   - Real-time updates

2. **Hooks**
   - useChat: Chat functionality
   - Custom state management
   - WebSocket integration

## Development Workflow

1. Code organization follows the modular pattern
2. Each component is independently testable
3. Security is considered at every layer
4. Performance optimization is built-in