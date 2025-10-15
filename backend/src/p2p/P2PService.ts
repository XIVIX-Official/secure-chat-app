import { createLibp2p } from 'libp2p';
import { webRTCStar } from '@libp2p/webrtc-star';
import { noise } from '@chainsafe/libp2p-noise';
import { mplex } from '@libp2p/mplex';
import type { Connection } from '@libp2p/interface-connection';
import { createFromB58String } from '@libp2p/peer-id';
import EventEmitter from 'events';

export class P2PService extends EventEmitter {
  private node: any;
  private connections: Map<string, Connection>;

  constructor() {
    super();
    this.connections = new Map();
  }

  async initialize() {
    this.node = await createLibp2p({
      addresses: {
        listen: ['/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star']
      },
      transports: [webRTCStar()],
      connectionEncrypters: [noise()],
      streamMuxers: [mplex()],
    });

    await this.node.start();

    this.node.connectionManager.on('peer:connect', this.handlePeerConnect.bind(this));
    this.node.connectionManager.on('peer:disconnect', this.handlePeerDisconnect.bind(this));

    return this.node.peerId.toString();
  }

  private handlePeerConnect(connection: Connection) {
    const peerId = connection.remotePeer.toString();
    this.connections.set(peerId, connection);
    this.emit('peer:connect', peerId);
  }

  private handlePeerDisconnect(connection: Connection) {
    const peerId = connection.remotePeer.toString();
    this.connections.delete(peerId);
    this.emit('peer:disconnect', peerId);
  }

  async connectToPeer(peerId: string) {
    try {
      const connection = await this.node.dial(PeerId.createFromB58String(peerId));
      this.connections.set(peerId, connection);
      return true;
    } catch (error) {
      console.error('Failed to connect to peer:', error);
      return false;
    }
  }

  async sendMessage(peerId: string, message: any) {
    const connection = this.connections.get(peerId);
    if (!connection) {
      throw new Error('No connection to peer');
    }

    const stream = await connection.newStream('/chat/1.0.0');
    await stream.sink([Buffer.from(JSON.stringify(message))]);
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