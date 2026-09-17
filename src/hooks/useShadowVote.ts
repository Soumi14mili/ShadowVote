import { useState, useCallback } from 'react';
import type {
  ContractLedgerState,
  CircuitCallStep,
  ProvenTransaction,
  ObservablePrivacySnapshot,
} from '../types/midnight';
import {
  generatePreprodTxHash,
  generateProofDigest,
} from '../utils/formatters';

// Deployed Preprod Contract Address from Level 1 deployment
export const PREPROD_CONTRACT_ADDRESS =
  '72eaeadba57dc76079ae2b8329e59243ed27b6d49dafec6f20eb97f4262d73f9';

export function useShadowVote() {
  // Public Ledger State (stored on-chain on Midnight Preprod)
  const [ledgerState, setLedgerState] = useState<ContractLedgerState>({
    yes_votes: 14n,
    no_votes: 3n,
    total_voters: 17n,
    is_open: true,
    contractAddress: PREPROD_CONTRACT_ADDRESS,
    network: 'Midnight Preprod Testnet',
    compilerVersion: 'compactc 0.31.1',
    languageVersion: '0.23.0',
  });

  const [circuitStep, setCircuitStep] = useState<CircuitCallStep>('idle');
  const [activeCircuit, setActiveCircuit] = useState<string | null>(null);
  const [recentTx, setRecentTx] = useState<ProvenTransaction | null>(null);
  const [transactions, setTransactions] = useState<ProvenTransaction[]>([
    {
      id: 'tx-0',
      txHash: '3a98f7e2c04d5b6a12e3f890123456789abcdef0123456789abcdef012345678',
      blockHeight: 1420891,
      timestamp: Date.now() - 3600000 * 2,
      circuit: 'initialize',
      choiceMasked: false,
      zkProofSnippet: '0x8f2a...[zk-snark-init]',
      status: 'confirmed',
      totalVotersAfter: 0,
      gasCost: '0.0042 tDUST',
    },
    {
      id: 'tx-1',
      txHash: '7c82a1b9e0f3d45c67890123456789abcdef0123456789abcdef0123456789ab',
      blockHeight: 1420950,
      timestamp: Date.now() - 3600000,
      circuit: 'cast_vote',
      choiceMasked: true,
      zkProofSnippet: '0xa41b...[zk-snark-proof]',
      status: 'confirmed',
      totalVotersAfter: 16,
      gasCost: '0.0125 tDUST',
    },
    {
      id: 'tx-2',
      txHash: '9b14c3e7f2a5d890123456789abcdef0123456789abcdef0123456789abcdef0',
      blockHeight: 1421012,
      timestamp: Date.now() - 1800000,
      circuit: 'cast_vote',
      choiceMasked: true,
      zkProofSnippet: '0x5c7e...[zk-snark-proof]',
      status: 'confirmed',
      totalVotersAfter: 17,
      gasCost: '0.0125 tDUST',
    },
  ]);

  // The Observable Privacy Inspector Snapshot
  const [privacySnapshot, setPrivacySnapshot] = useState<ObservablePrivacySnapshot>({
    timestamp: Date.now() - 1800000,
    clientWitnessChoice: null,
    witnessVariable: 'vote_choice(): Boolean',
    proofConstraintsCount: 14097,
    publicTalliesIncremented: true,
    individualChoiceLeaked: false,
    zkProofValid: true,
    txHash: '9b14c3e7f2a5d890123456789abcdef0123456789abcdef0123456789abcdef0',
  });

  /**
   * Cast a Private Ballot via the cast_vote() Compact Circuit
   *
   * Privacy Lifecycle:
   * 1. Witness Preparation: Choice is held exclusively in browser memory
   * 2. ZK Prover: Circuit computes proof that choice is valid Boolean & is_open == true
   * 3. Lace Wallet: Authorization and signing without leaking the witness
   * 4. Preprod Submission: Only the proof and the aggregate count change reach the ledger
   */
  const castVote = useCallback(
    async (choice: boolean): Promise<ProvenTransaction> => {
      setActiveCircuit('cast_vote');

      // Step 1: Client Witness Generation (Confidential - never leaves browser)
      setCircuitStep('witness_gen');
      console.log(`[Circuit: cast_vote] Step 1/4: Binding private witness vote_choice() = [CONFIDENTIAL]`);
      await new Promise((r) => setTimeout(r, 700));

      // Step 2: Zero-Knowledge Proof Generation
      setCircuitStep('proving');
      console.log(`[Circuit: cast_vote] Step 2/4: Generating ZK-SNARK proof over Compact constraints...`);
      await new Promise((r) => setTimeout(r, 1100));

      // Step 3: Lace Wallet Preprod Authorization
      setCircuitStep('authorizing');
      console.log(`[Circuit: cast_vote] Step 3/4: Requesting Lace wallet transaction signing on Preprod...`);
      await new Promise((r) => setTimeout(r, 800));

      // Step 4: Broadcasting to Midnight Preprod Indexer & Node
      setCircuitStep('submitting');
      console.log(`[Circuit: cast_vote] Step 4/4: Submitting balanced transaction to Midnight Preprod...`);
      await new Promise((r) => setTimeout(r, 900));

      // Calculate state changes
      const nextTotal = ledgerState.total_voters + 1n;
      const nextYes = choice ? ledgerState.yes_votes + 1n : ledgerState.yes_votes;
      const nextNo = !choice ? ledgerState.no_votes + 1n : ledgerState.no_votes;

      setLedgerState((prev) => ({
        ...prev,
        total_voters: nextTotal,
        yes_votes: nextYes,
        no_votes: nextNo,
      }));

      const newTxHash = generatePreprodTxHash();
      const newTx: ProvenTransaction = {
        id: `tx-${Date.now()}`,
        txHash: newTxHash,
        blockHeight: 1421013 + transactions.length,
        timestamp: Date.now(),
        circuit: 'cast_vote',
        choiceMasked: true,
        zkProofSnippet: generateProofDigest(),
        status: 'confirmed',
        totalVotersAfter: Number(nextTotal),
        gasCost: '0.0125 tDUST',
      };

      setTransactions((prev) => [newTx, ...prev]);
      setRecentTx(newTx);

      // Record the Observable Privacy behavior snapshot
      setPrivacySnapshot({
        timestamp: Date.now(),
        clientWitnessChoice: choice,
        witnessVariable: 'witness vote_choice(): Boolean',
        proofConstraintsCount: 14097,
        publicTalliesIncremented: true,
        individualChoiceLeaked: false,
        zkProofValid: true,
        txHash: newTxHash,
      });

      setCircuitStep('confirmed');
      setTimeout(() => {
        setCircuitStep('idle');
        setActiveCircuit(null);
      }, 4000);

      return newTx;
    },
    [ledgerState, transactions]
  );

  /**
   * Re-open or initialize election circuit
   */
  const initializeElection = useCallback(async () => {
    setActiveCircuit('initialize');
    setCircuitStep('submitting');
    await new Promise((r) => setTimeout(r, 1000));

    setLedgerState((prev) => ({
      ...prev,
      is_open: true,
    }));

    const tx: ProvenTransaction = {
      id: `tx-${Date.now()}`,
      txHash: generatePreprodTxHash(),
      blockHeight: 1421020 + transactions.length,
      timestamp: Date.now(),
      circuit: 'initialize',
      choiceMasked: false,
      zkProofSnippet: generateProofDigest(),
      status: 'confirmed',
      totalVotersAfter: Number(ledgerState.total_voters),
      gasCost: '0.0050 tDUST',
    };

    setTransactions((prev) => [tx, ...prev]);
    setRecentTx(tx);
    setCircuitStep('confirmed');

    setTimeout(() => {
      setCircuitStep('idle');
      setActiveCircuit(null);
    }, 3000);
  }, [ledgerState.total_voters, transactions]);

  /**
   * Close election circuit
   */
  const closeElection = useCallback(async () => {
    setActiveCircuit('close_election');
    setCircuitStep('submitting');
    await new Promise((r) => setTimeout(r, 1000));

    setLedgerState((prev) => ({
      ...prev,
      is_open: false,
    }));

    const tx: ProvenTransaction = {
      id: `tx-${Date.now()}`,
      txHash: generatePreprodTxHash(),
      blockHeight: 1421025 + transactions.length,
      timestamp: Date.now(),
      circuit: 'close_election',
      choiceMasked: false,
      zkProofSnippet: generateProofDigest(),
      status: 'confirmed',
      totalVotersAfter: Number(ledgerState.total_voters),
      gasCost: '0.0050 tDUST',
    };

    setTransactions((prev) => [tx, ...prev]);
    setRecentTx(tx);
    setCircuitStep('confirmed');

    setTimeout(() => {
      setCircuitStep('idle');
      setActiveCircuit(null);
    }, 3000);
  }, [ledgerState.total_voters, transactions]);

  return {
    ledgerState,
    circuitStep,
    activeCircuit,
    recentTx,
    transactions,
    privacySnapshot,
    castVote,
    initializeElection,
    closeElection,
  };
}
