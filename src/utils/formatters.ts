/**
 * Utility functions for formatting addresses, hashes, and dates
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
