/**
 * Utility functions for formatting addresses, hashes, dates, and contract address validation
 */

export function shortenAddress(address: string | null | undefined, chars = 6): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatBigInt(val: bigint | number): string {
  return Number(val).toLocaleString();
}

/**
 * Generate a realistic Midnight Preprod transaction hash (64 hex characters)
 */
export function generatePreprodTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Generate a realistic ZK proof digest snippet
 */
export function generateProofDigest(): string {
  const chars = '0123456789abcdef';
  let snippet = '0x';
  for (let i = 0; i < 32; i++) {
    snippet += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${snippet}...[zk-snark]`;
}

export interface AddressValidationResult {
  isValid: boolean;
  format: 'hex64' | 'hex0x' | 'tagged0200' | 'bech32' | 'invalid';
  normalizedAddress: string;
  errorMessage?: string;
  explorerUrl?: string;
}

/**
 * Validates a Midnight Network contract address across supported formats:
 * - 64-character raw hex (Compact runtime address)
 * - 0x-prefixed 64-character hex
 * - 0200-tagged contract address (68 chars or 0x0200...)
 * - Bech32 format (midnight1..., contract1..., addr_preprod1...)
 */
export function validateContractAddress(address: string | null | undefined): AddressValidationResult {
  if (!address || !address.trim()) {
    return {
      isValid: false,
      format: 'invalid',
      normalizedAddress: '',
      errorMessage: 'Contract address cannot be empty.',
    };
  }

  const clean = address.trim();

  // 1. Raw 64 Hex characters (standard Compact runtime address representation)
  if (/^[0-9a-fA-F]{64}$/.test(clean)) {
    const norm = clean.toLowerCase();
    return {
      isValid: true,
      format: 'hex64',
      normalizedAddress: norm,
      explorerUrl: `https://explorer.midnight.network/contract/${norm}`,
    };
  }

  // 2. 0x-prefixed 64 Hex characters
  if (/^0x[0-9a-fA-F]{64}$/.test(clean)) {
    const rawHex = clean.slice(2).toLowerCase();
    return {
      isValid: true,
      format: 'hex0x',
      normalizedAddress: clean.toLowerCase(),
      explorerUrl: `https://explorer.midnight.network/contract/${rawHex}`,
    };
  }

  // 3. Tagged Contract Address (0200...) or 0x0200...
  if (/^(0x)?0200[0-9a-fA-F]{64}$/i.test(clean)) {
    const raw = clean.startsWith('0x') ? clean.slice(2).toLowerCase() : clean.toLowerCase();
    return {
      isValid: true,
      format: 'tagged0200',
      normalizedAddress: raw,
      explorerUrl: `https://explorer.midnight.network/contract/${raw}`,
    };
  }

  // 4. Bech32 formatted address (midnight1..., contract1..., addr_preprod1..., etc.)
  if (/^(midnight|contract|addr_preprod|addr_test|addr|preprod|preview)1[0-9a-z]{38,110}$/i.test(clean)) {
    return {
      isValid: true,
      format: 'bech32',
      normalizedAddress: clean.toLowerCase(),
      explorerUrl: `https://explorer.midnight.network/contract/${clean}`,
    };
  }

  return {
    isValid: false,
    format: 'invalid',
    normalizedAddress: clean,
    errorMessage: 'Invalid Midnight contract address. Expected 64-char hex, 0x-prefixed hex, 0200-tagged address, or valid Bech32 string.',
  };
}
