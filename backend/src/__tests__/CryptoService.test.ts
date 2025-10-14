import { CryptoService } from '../crypto/CryptoService';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('CryptoService', () => {
  let cryptoService: CryptoService;

  beforeEach(() => {
    cryptoService = new CryptoService();
  });

  it('should generate a public key', () => {
    const publicKey = cryptoService.getPublicKey();
    expect(publicKey).toBeDefined();
    expect(typeof publicKey).toBe('string');
    expect(publicKey.length).toBeGreaterThan(0);
  });

  it('should encrypt and decrypt a message', () => {
    const message = 'Hello, World!';
    const recipientCrypto = new CryptoService();
    const recipientPublicKey = recipientCrypto.getPublicKey();
    
    const encrypted = cryptoService.encrypt(message, recipientPublicKey);
    expect(encrypted).toHaveProperty('encrypted');
    expect(encrypted).toHaveProperty('nonce');
    
    const decrypted = recipientCrypto.decrypt(
      encrypted.encrypted,
      encrypted.nonce,
      cryptoService.getPublicKey()
    );
    
    expect(decrypted).toBe(message);
  });

  it('should encrypt and decrypt messages of different sizes', () => {
    const messages = [
      'Short message',
      'A longer message with some numbers 12345',
      'A very long message that contains lots of text and special characters !@#$%^&*()'
    ];

    const recipientCrypto = new CryptoService();
    const recipientPublicKey = recipientCrypto.getPublicKey();

    for (const message of messages) {
      const encrypted = cryptoService.encrypt(message, recipientPublicKey);
      const decrypted = recipientCrypto.decrypt(
        encrypted.encrypted,
        encrypted.nonce,
        cryptoService.getPublicKey()
      );
      expect(decrypted).toBe(message);
    }
  });

  it('should generate unique group keys', () => {
    const key1 = cryptoService.generateGroupKey();
    const key2 = cryptoService.generateGroupKey();
    expect(key1).not.toBe(key2);
    expect(key1.length).toBeGreaterThan(0);
    expect(key2.length).toBeGreaterThan(0);
  });

  it('should throw error when decrypting with wrong key', () => {
    const message = 'Hello, World!';
    const wrongCrypto = new CryptoService();
    const recipientCrypto = new CryptoService();
    
    const encrypted = cryptoService.encrypt(message, recipientCrypto.getPublicKey());
    
    expect(() => {
      wrongCrypto.decrypt(
        encrypted.encrypted,
        encrypted.nonce,
        cryptoService.getPublicKey()
      );
    }).toThrow('Failed to decrypt message');
  });
});