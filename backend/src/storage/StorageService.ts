import { promises as fs } from 'fs';
import path from 'path';
import { CryptoService } from '../crypto/CryptoService';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
}

interface ChatSession {
  id: string;
  participants: string[];
  messages: Message[];
  lastUpdated: number;
}

export class StorageService {
  private dataDir: string;
  private cryptoService: CryptoService;
  private sessions: Map<string, ChatSession>;

  constructor(dataDir: string, cryptoService: CryptoService) {
    this.dataDir = dataDir;
    this.cryptoService = cryptoService;
    this.sessions = new Map();
  }

  async initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await this.loadSessions();
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      throw error;
    }
  }

  private async loadSessions() {
    try {
      const files = await fs.readdir(this.dataDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const sessionData = await fs.readFile(
            path.join(this.dataDir, file),
            'utf-8'
          );
          const session: ChatSession = JSON.parse(sessionData);
          this.sessions.set(session.id, session);
        }
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }

  async saveSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    try {
      await fs.writeFile(
        path.join(this.dataDir, `${sessionId}.json`),
        JSON.stringify(session, null, 2)
      );
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  }

  createSession(participants: string[]): string {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const session: ChatSession = {
      id: sessionId,
      participants,
      messages: [],
      lastUpdated: Date.now(),
    };
    this.sessions.set(sessionId, session);
    this.saveSession(sessionId);
    return sessionId;
  }

  async addMessage(sessionId: string, message: Message) {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.messages.push(message);
    session.lastUpdated = Date.now();
    await this.saveSession(sessionId);
  }

  getMessages(sessionId: string): Message[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];
    return session.messages;
  }

  getSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }
}