import { box, randomBytes, BoxKeyPair } from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

export class CryptoService {
  private keyPair: BoxKeyPair;

  constructor() {
    this.keyPair = box.keyPair();
  }

  /**
   * Get the public key for sharing with peers
   */
  getPublicKey(): string {
    return encodeBase64(this.keyPair.publicKey);
  }

  /**
   * Encrypt a message for a specific recipient
   */
  encrypt(message: string, recipientPublicKey: string): { encrypted: string; nonce: string } {
    const messageUint8 = decodeUTF8(message);
    const recipientPublicKeyUint8 = decodeBase64(recipientPublicKey);
    const nonce = randomBytes(box.nonceLength);
    
    const encrypted = box(
      messageUint8,
      nonce,
      recipientPublicKeyUint8,
      this.keyPair.secretKey
    );

    return {
      encrypted: encodeBase64(encrypted),
      nonce: encodeBase64(nonce)
    };
  }

  /**
   * Decrypt a message from a specific sender
   */
  decrypt(encryptedMessage: string, nonce: string, senderPublicKey: string): string {
    const encryptedUint8 = decodeBase64(encryptedMessage);
    const nonceUint8 = decodeBase64(nonce);
    const senderPublicKeyUint8 = decodeBase64(senderPublicKey);
    
    const decrypted = box.open(
      encryptedUint8,
      nonceUint8,
      senderPublicKeyUint8,
      this.keyPair.secretKey
    );

    if (!decrypted) {
      throw new Error('Failed to decrypt message');
    }

    return encodeUTF8(decrypted);
  }

  /**
   * Generate a random encryption key for group chats
   */
  generateGroupKey(): string {
    return encodeBase64(randomBytes(box.secretKeyLength));
  }
}