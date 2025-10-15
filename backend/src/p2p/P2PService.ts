import { createLibp2p } from 'libp2p';
import type { Libp2p } from 'libp2p';
import type { Components } from 'libp2p/dist/src/components';
import { webRTCStar } from '@libp2p/webrtc-star';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import type { Connection, Stream } from '@libp2p/interface-connection';
import type { PeerId } from '@libp2p/interface-peer-id';
import { peerIdFromString } from '@libp2p/peer-id';
import EventEmitter from 'events';

interface P2PConnection {
  id: string;
  connection: Connection;
  stream?: Stream;
}

export class P2PService extends EventEmitter {
  private node: Libp2p | null = null;
  private connections: Map<string, P2PConnection> = new Map();

  constructor() {
    super();
  }

  async initialize(): Promise<string> {
    try {
      this.node = await createLibp2p({
        addresses: {
          listen: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star']
        },
        transports: [webRTCStar()],
        connectionEncrypter: [noise()],
        streamMuxers: [mplex()]
      });

    await this.node.start();

    this.node.addEventListener('peer:connect', async (event: any) => {
      if (!this.node) return;
      try {
        const connection = event.detail as Connection;
        const peerId = connection.remotePeer.toString();
        await this.handlePeerConnect(peerId, connection);
      } catch (error) {
        console.error('Failed to handle peer connection:', error);
      }
    });

    this.node.addEventListener('peer:disconnect', (event: any) => {
      const connection = event.detail as Connection;
      const peerId = connection.remotePeer.toString();
      this.handlePeerDisconnect(peerId);
    });

    return this.node.peerId.toString();
  }

  private async handlePeerConnect(peerId: string, connection: Connection) {
    try {
      const stream = await connection.newStream('/chat/1.0.0');
      const p2pConnection: P2PConnection = {
        id: peerId,
        connection,
        stream
      };
      this.connections.set(peerId, p2pConnection);
    } catch (error) {
      console.error('Failed to handle peer connection:', error);
    }
    this.emit('peer:connect', peerId);
  }

  private handlePeerDisconnect(peerId: string) {
    this.connections.delete(peerId);
    this.emit('peer:disconnect', peerId);
  }

  async connectToPeer(peerId: string): Promise<boolean> {
    if (!this.node) {
      throw new Error('P2P service not initialized');
    }

    try {
      const peerIdObj = peerIdFromString(peerId);
      const rawConnection = await this.node.dial(peerIdObj as any);
      const connection = {
        ...rawConnection,
        stat: {},
        tags: new Map(),
        addStream: (stream: Stream) => {},
        removeStream: (stream: Stream) => {}
      } as unknown as Connection;
      
      const stream = await connection.newStream('/chat/1.0.0');
      const p2pConnection: P2PConnection = {
        id: peerId,
        connection,
        stream
      };
      this.connections.set(peerId, p2pConnection);
      return true;
    } catch (error) {
      console.error('Failed to connect to peer:', error);
      return false;
    }
  }

  async sendMessage(peerId: string, message: any): Promise<void> {
    const p2pConnection = this.connections.get(peerId);
    if (!p2pConnection) {
      throw new Error('No connection to peer');
    }

    if (!p2pConnection.stream) {
      p2pConnection.stream = await p2pConnection.connection.newStream('/chat/1.0.0');
    }

    await p2pConnection.stream.sink([Buffer.from(JSON.stringify(message))]);
  }

  async stop() {
    if (this.node) {
      await this.node.stop();
    }
  }

  getConnectedPeers(): string[] {
    return Array.from(this.connections.keys());
  }
}