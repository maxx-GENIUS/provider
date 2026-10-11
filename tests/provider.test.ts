import { describe, it, expect, vi, beforeEach } from 'vitest';
import { provider } from '../src/index';

describe('@sorocrew/provider Freighter Compatibility Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Core Connection & Public Key API', () => {
    it('returns true for isConnected() simulation', async () => {
      const connected = await provider.isConnected();
      expect(connected).toBe(true);
    });

    it('returns valid Stellar public key format (G... 56 chars)', async () => {
      const publicKey = await provider.getPublicKey();
      expect(publicKey).toBeDefined();
      expect(typeof publicKey).toBe('string');
      expect(publicKey).toMatch(/^G[A-Z0-9]{55}$/);
      expect(publicKey.length).toBe(56);
    });
  });

  describe('Network Configuration Queries', () => {
    it('returns active network name', async () => {
      const network = await provider.getNetwork();
      expect(network).toBeDefined();
      expect(typeof network).toBe('string');
    });

    it('returns full FreighterNetworkDetails struct', async () => {
      const details = await provider.getNetworkDetails();
      expect(details).toBeDefined();
      expect(details.network).toBeDefined();
      expect(details.networkUrl).toBeDefined();
      expect(details.networkPassphrase).toBeDefined();
      expect(details.sorobanRpcUrl).toBeDefined();
    });
  });

  describe('Transaction & Auth Entry Signing', () => {
    it('simulates signTransaction and returns signed XDR payload', async () => {
      const mockXdr = 'AAAAAG...';
      const result = await provider.signTransaction(mockXdr);
      expect(result).toBe(mockXdr);
    });

    it('simulates signBlob with signed prefix', async () => {
      const rawBlob = 'sample_raw_bytes';
      const result = await provider.signBlob(rawBlob);
      expect(result).toBe(`signed_${rawBlob}`);
    });

    it('simulates signAuthEntry for Soroban authorization', async () => {
      const mockAuthXdr = 'AUTH_ENTRY_XDR';
      const result = await provider.signAuthEntry(mockAuthXdr);
      expect(result).toBe(mockAuthXdr);
    });
  });

  describe('Event Listener & Teardown Architecture', () => {
    it('successfully registers and invokes networkChange callbacks', () => {
      const callback = vi.fn();
      provider.on('networkChange', callback);

      // Emit simulated event
      (provider as any).emit('networkChange', {
        network: 'TESTNET',
        networkUrl: 'https://horizon-testnet.stellar.org',
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith({
        network: 'TESTNET',
        networkUrl: 'https://horizon-testnet.stellar.org',
      });
    });

    it('successfully unregisters listeners using off() to prevent memory leaks', () => {
      const callback = vi.fn();
      provider.on('accountChange', callback);
      provider.off('accountChange', callback);

      (provider as any).emit('accountChange', 'GAA...');
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
