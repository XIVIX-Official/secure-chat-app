import { createECDH, randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { Buffer } from 'node:buffer';

export class CryptoService {
  private ecdh: ReturnType<typeof createECDH>;

  constructor() {
    this.ecdh = createECDH('secp256k1');
    this.ecdh.generateKeys();
  }

  /**
   * Get the public key for sharing with peers
   */
  getPublicKey(): string {
    return this.ecdh.getPublicKey().toString('base64');
  }

  /**
   * Encrypt a message for a specific recipient
   */
  encrypt(message: string, recipientPublicKey: string): { encrypted: string; nonce: string } {
    const nonce = randomBytes(16);
    const sharedSecret = this.ecdh.computeSecret(Buffer.from(recipientPublicKey, 'base64'));
    const cipher = createCipheriv('aes-256-gcm', sharedSecret.slice(0, 32), nonce);
    
    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(message, 'utf8')),
      cipher.final(),
      cipher.getAuthTag()
    ]);

    return {
      encrypted: encrypted.toString('base64'),
      nonce: nonce.toString('base64')
    };
  }

  /**
   * Decrypt a message from a specific sender
   */
  decrypt(encryptedMessage: string, nonce: string, senderPublicKey: string): string {
    try {
      const sharedSecret = this.ecdh.computeSecret(Buffer.from(senderPublicKey, 'base64'));
      const encryptedBuffer = Buffer.from(encryptedMessage, 'base64');
      const nonceBuffer = Buffer.from(nonce, 'base64');
      
      const decipher = createDecipheriv('aes-256-gcm', sharedSecret.slice(0, 32), nonceBuffer);
      decipher.setAuthTag(encryptedBuffer.slice(-16));
      
      const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer.slice(0, -16)),
        decipher.final()
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      throw new Error('Failed to decrypt message');
    }
  }

  /**
   * Generate a random encryption key for group chats
   */
  generateGroupKey(): string {
    return randomBytes(32).toString('base64');
  }
}