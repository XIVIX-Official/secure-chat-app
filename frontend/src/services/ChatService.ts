import { io, Socket } from 'socket.io-client';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
}

export interface ChatEvent {
  type: 'message' | 'peer-connected' | 'peer-disconnected';
  payload: any;
}

export class ChatService {
  private socket: Socket;
  private eventHandlers: ((event: ChatEvent) => void)[];

  constructor() {
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    this.eventHandlers = [];
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('peer-message', (message: Message) => {
      this.notifyHandlers({
        type: 'message',
        payload: message
      });
    });

    this.socket.on('peer-connected', (peerId: string) => {
      this.notifyHandlers({
        type: 'peer-connected',
        payload: { peerId }
      });
    });

    this.socket.on('peer-disconnected', (peerId: string) => {
      this.notifyHandlers({
        type: 'peer-disconnected',
        payload: { peerId }
      });
    });
  }

  private notifyHandlers(event: ChatEvent) {
    this.eventHandlers.forEach(handler => handler(event));
  }

  async joinNetwork(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.socket.emit('join-network', (response: any) => {
        if (response.success) {
          resolve(response.peerId);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async connectToPeer(peerId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket.emit('connect-peer', { peerId }, (response: any) => {
        if (response.success) {
          resolve(true);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  async sendMessage(recipientId: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.emit(
        'send-message',
        { recipientId, message: content },
        (response: any) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error(response.error));
          }
        }
      );
    });
  }

  onEvent(handler: (event: ChatEvent) => void) {
    this.eventHandlers.push(handler);
    return () => {
      this.eventHandlers = this.eventHandlers.filter(h => h !== handler);
    };
  }

  disconnect() {
    this.socket.disconnect();
  }
}