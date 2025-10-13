import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { CryptoService } from './crypto/CryptoService';
import { P2PService } from './p2p/P2PService';
import { StorageService } from './storage/StorageService';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

const cryptoService = new CryptoService();
const p2pService = new P2PService();
const storageService = new StorageService(
  path.join(__dirname, '../data'),
  cryptoService
);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize services
async function initializeServices() {
  try {
    await storageService.initialize();
    const peerId = await p2pService.initialize();
    console.log('Services initialized. Peer ID:', peerId);
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// WebSocket event handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-network', async (callback) => {
    try {
      const peerId = await p2pService.initialize();
      callback({ success: true, peerId });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('connect-peer', async ({ peerId }, callback) => {
    try {
      const success = await p2pService.connectToPeer(peerId);
      callback({ success });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('send-message', async ({ recipientId, message }, callback) => {
    try {
      await p2pService.sendMessage(recipientId, {
        type: 'chat',
        content: message,
        timestamp: Date.now()
      });
      callback({ success: true });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// HTTP routes
app.get('/api/peers', (req, res) => {
  const peers = p2pService.getConnectedPeers();
  res.json({ peers });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeServices();
});