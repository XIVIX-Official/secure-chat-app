# Secure Chat App

A peer-to-peer (P2P) chat application with end-to-end encryption built for privacy-first messaging. This project eliminates the need for central servers, putting complete control in the hands of users.

## 🔐 Features

- **End-to-End Encryption**: Military-grade encryption (AES-256) ensures only sender and recipient can read messages
- **Peer-to-Peer Architecture**: Direct communication between users without relying on central servers
- **Privacy-First Design**: No message logs, no user profiling, no data collection
- **Cross-Platform Support**: Available on web, desktop, and mobile platforms
- **Decentralized Identity**: Users maintain complete control over their identities without central registration
- **Real-time Messaging**: Low-latency message delivery with offline message queuing
- **Group Chat Support**: Secure encrypted conversations with multiple participants
- **File Sharing**: Send encrypted files directly between peers

## 📁 Project Structure

```
secure-chat-app/
├── .gitignore              # Git ignore rules
├── LICENSE                 # Project license
├── README.md              # This file
├── start.bat
├── cleanup.bat
│
├── backend/               # Backend services
│   ├── src/
│   │   ├── crypto/        # Encryption/decryption utilities
│   │   ├── p2p/           # P2P networking logic
│   │   ├── storage/       # Local storage handlers
│   │   └── server.ts      # Bootstrap server (optional signaling)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/              # Web client
│   ├── src/
│   │   ├── components/    # React components (Chat, UI elements)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API & P2P services
│   │   ├── utils/         # Helper functions
│   │   ├── hooks/         # Custom React hooks
│   │   └── App.tsx
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── mobile/                # React Native mobile app
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── app.json
│
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # Detailed architecture design
│   ├── ENCRYPTION.md      # Encryption protocols explained
│   ├── CONTRIBUTING.md    # Contribution guidelines
│   └── API.md             # API documentation
│
├── tests/                 # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── .github/
    └── workflows/         # CI/CD pipelines (GitHub Actions)
        ├── tests.yml
        └── build.yml
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/XIVIX-Official/secure-chat-app.git
   cd secure-chat-app
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend (in a new terminal)
   cd frontend
   npm install

   # Mobile (optional)
   cd mobile
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # In backend directory
   cp .env.example .env
   
   # In frontend directory
   cp .env.example .env.local
   ```

4. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Without step 2, 3, 4, and 5(the easiest way): Using Environment Scripts

The project includes two utility scripts to help manage your development environment:

#### cleanup.bat
This script helps clean up your development environment:
```batch
cleanup.bat
```

Use this script when:
- You want to do a clean reinstall
- You're experiencing dependency conflicts
- You want to reset your development environment

#### start.bat
This script automates the project startup process:
```batch
start.bat
```

Use this script to:
- Start the development environment
- Ensure all dependencies are properly installed
- Launch both backend and frontend servers

## 💬 Usage

### Basic Chat Flow

1. **Generate a unique peer ID**: Your ID is generated automatically and securely stored locally
2. **Share your peer ID**: Exchange your ID with friends through any channel
3. **Start chatting**: Enter their peer ID and begin sending encrypted messages
4. **Send files**: Drag and drop files to share securely with peers
5. **Group conversations**: Add multiple peer IDs to create a group chat

### Example Commands (CLI)

```bash
# Start chat with a peer
./chat connect <peer-id>

# List active connections
./chat list

# Send message
./chat send <peer-id> "Your message here"
```

## 🏗️ Architecture

### Core Components

**P2P Network Layer**: Utilizes WebRTC and libp2p for peer discovery and direct peer connections.

**Encryption Layer**: Implements TweetNaCl.js for end-to-end encryption with forward secrecy using double ratchet algorithm.

**Storage Layer**: Uses IndexedDB (browser) and SQLite (desktop) for local, encrypted message storage.

**UI Layer**: React-based responsive user interface with real-time message updates.

### Data Flow

```
User A sends message
    ↓
Message encrypted (AES-256)
    ↓
Routed through P2P network
    ↓
Message encrypted (User B's public key)
    ↓
Delivered to User B
    ↓
User B decrypts and displays
```

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React, TypeScript, Tailwind CSS | User interface |
| **Backend** | Node.js, Express, TypeScript | Signaling & utilities |
| **P2P** | WebRTC, libp2p | Peer connectivity |
| **Encryption** | TweetNaCl.js, libsodium | Cryptography |
| **Storage** | IndexedDB, SQLite | Data persistence |
| **Mobile** | React Native, Expo | iOS/Android apps |
| **Testing** | Jest, Vitest | Unit & integration tests |
| **CI/CD** | GitHub Actions | Automated testing & deployment |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

### Encryption Specifications

- **Transport Security**: TLS 1.3 for signaling connections
- **Message Encryption**: AES-256-GCM for symmetric encryption
- **Key Exchange**: ECDH with Curve25519 for key derivation
- **Authentication**: Ed25519 signatures for message authentication
- **Perfect Forward Secrecy**: Double ratchet algorithm implementation

## ❓ FAQ

**Q: Can administrators read my messages?**
A: No. Since this is fully decentralized P2P, there are no administrators or central servers. Only you and your recipient can decrypt messages.

**Q: What happens if the internet connection drops?**
A: Messages are queued locally and sent automatically when the connection is restored.

**Q: Is this app truly open-source?**
A: Yes, released under the MIT License. You can review all source code, modify it, and self-host it.

**Q: How do I know the peer ID I'm connecting to is actually my friend?**
A: You should verify peer IDs through a trusted channel (phone call, in-person, etc.) to prevent man-in-the-middle attacks.

**Q: Can I use this on mobile?**
A: Yes! We're actively developing mobile apps for iOS and Android.

**Q: Is there a server-based option?**
A: This project is designed for P2P. However, you can optionally use a signaling server for NAT traversal without exposing message content.

**Q: How are messages stored?**
A: Messages are encrypted and stored locally on your device. You control all your data.

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/XIVIX-Official/secure-chat-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/XIVIX-Official/secure-chat-app/discussions)
- **Documentation**: [Full docs](docs/)

## 📚 Additional Resources

- [Architecture Deep Dive](docs/ARCHITECTURE.md)
- [Encryption Explained](docs/ENCRYPTION.md)
- [API Reference](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

---

**Powered by XIVIX**