/**
 * TypeScript Type Definitions for ShadowVote Frontend & Midnight Lace Integration
 */

export type WalletType = 'lace' | 'simulator';

export interface LaceWalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  network: 'preprod' | 'preview' | 'devnet';
  balance: string; // e.g. "1,500.00 tDUST"
  walletType: WalletType;
  error: string | null;
}

export interface ContractLedgerState {
  yes_votes: bigint;
  no_votes: bigint;
  total_voters: bigint;
  is_open: boolean;
  contractAddress: string;
  network: string;
  compilerVersion: string;
  languageVersion: string;
}

export type CircuitCallStep =
  | 'idle'
  | 'witness_gen'
  | 'proving'
  | 'authorizing'
  | 'submitting'
  | 'confirmed'
  | 'failed';

export interface ProvenTransaction {
  id: string;
  txHash: string;
  blockHeight: number;
  timestamp: number;
  circuit: 'cast_vote' | 'initialize' | 'close_election';
  choiceMasked: boolean;
  zkProofSnippet: string;
  status: 'confirmed' | 'pending' | 'failed';
  totalVotersAfter: number;
  gasCost: string;
  proposalId?: string;
}

export interface ObservablePrivacySnapshot {
  timestamp: number;
  clientWitnessChoice: boolean | null;
  witnessVariable: string;
  proofConstraintsCount: number;
  publicTalliesIncremented: boolean;
  individualChoiceLeaked: boolean;
  zkProofValid: boolean;
  txHash: string;
}

export interface GovernanceProposal {
  id: string;
  mipNumber: string;
  title: string;
  summary: string;
  fullDescription: string;
  category: 'Core Protocol' | 'Treasury' | 'Security' | 'Ecosystem';
  status: 'active' | 'passed' | 'closed';
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  quorumTarget: number;
  endsIn: string;
  author: string;
  contractAddress: string;
}

export interface CryptographicReceipt {
  receiptId: string;
  proposalId: string;
  proposalTitle: string;
  txHash: string;
  blockHeight: number;
  timestamp: number;
  nullifierHash: string;
  zkProofSnippet: string;
  verifierKeyFingerprint: string;
  circuitConstraints: number;
  privacyGuarantee: string;
}

export interface ProverLog {
  id: string;
  timestamp: string;
  stage: 'WITNESS' | 'CONSTRAINT' | 'PROVER' | 'SIGN' | 'PREPROD';
  message: string;
  type: 'info' | 'zk' | 'success' | 'warn';
}

// Global window declaration for Midnight Lace wallet DApp connector
declare global {
  interface Window {
    midnight?: {
      mnLace?: {
        isEnabled: () => Promise<boolean>;
        enable: () => Promise<any>;
        apiVersion?: string;
        name?: string;
        icon?: string;
      };
      [key: string]: any;
    };
  }
}
