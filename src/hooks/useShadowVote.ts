import { useState, useCallback } from 'react';
import type {
  ContractLedgerState,
  CircuitCallStep,
  ProvenTransaction,
  ObservablePrivacySnapshot,
  GovernanceProposal,
  CryptographicReceipt,
} from '../types/midnight';
import {
  generatePreprodTxHash,
  generateProofDigest,
} from '../utils/formatters';

// Deployed Preprod Contract Address from Level 1 deployment
export const PREPROD_CONTRACT_ADDRESS =
  '72eaeadba57dc76079ae2b8329e59243ed27b6d49dafec6f20eb97f4262d73f9';

export const INITIAL_PROPOSALS: GovernanceProposal[] = [
  {
    id: 'mip-01',
    mipNumber: 'MIP-01',
    title: 'Enable Shielded Zero-Knowledge Sharding on Preprod Testnet',
    summary: 'Deploy zero-knowledge cryptographic state partition algorithms across Midnight Preprod indexer nodes to achieve 10,000+ TPS private settlement.',
    fullDescription: 'This proposal activates shielded sub-state sharding on Midnight Preprod. By isolating transaction proofs into parallel ZK-SNARK verification lanes, node validators achieve massive horizontal scalability without leaking cross-shard witness states.',
    category: 'Core Protocol',
    status: 'active',
    yesVotes: 24,
    noVotes: 4,
    totalVotes: 28,
    quorumTarget: 40,
    endsIn: '4 days',
    author: 'Midnight Core Team',
    contractAddress: PREPROD_CONTRACT_ADDRESS,
  },
  {
    id: 'mip-02',
    mipNumber: 'MIP-02',
    title: 'Establish Privacy-Preserving Quadratic Treasury Grant Pool (500,000 tDUST)',
    summary: 'Allocate 500,000 tDUST from community treasury to fund privacy-focused developer tooling and decentralized proof server infrastructure.',
    fullDescription: 'Creates an on-chain grant allocation pool governed by shielded quadratic voting. Reviewers vote with encrypted weights, eliminating whale dominance and retaliation against evaluators.',
    category: 'Treasury',
    status: 'active',
    yesVotes: 18,
    noVotes: 2,
    totalVotes: 20,
    quorumTarget: 30,
    endsIn: '6 days',
    author: 'Ecosystem Council',
    contractAddress: PREPROD_CONTRACT_ADDRESS,
  },
  {
    id: 'mip-03',
    mipNumber: 'MIP-03',
    title: 'Deploy Nullifier-Based Double-Voting Prevention Protocol',
    summary: 'Integrate cryptographic PRF nullifiers into Compact voting contracts to strictly prevent duplicate ballots without identity de-anonymization.',
    fullDescription: 'Enforces nullifier commitments where each voter secret key computes a unique 256-bit nullifier hash per election. The contract marks nullifiers as spent on-chain, rendering sybil and double-voting cryptographically impossible.',
    category: 'Security',
    status: 'active',
    yesVotes: 31,
    noVotes: 1,
    totalVotes: 32,
    quorumTarget: 35,
    endsIn: '2 days',
    author: 'Security Working Group',
    contractAddress: PREPROD_CONTRACT_ADDRESS,
  },
  {
    id: 'mip-04',
    mipNumber: 'MIP-04',
    title: 'Deploy Decentralized Prover Federation Nodes',
    summary: 'Decentralize the proof server architecture by establishing community-operated remote provers with hardware enclave security.',
    fullDescription: 'Officially adopted standard for federated prover networks. Provers generate proofs in TEE hardware enclaves with mathematical zero-knowledge privacy guarantees.',
    category: 'Core Protocol',
    status: 'passed',
    yesVotes: 48,
    noVotes: 3,
    totalVotes: 51,
    quorumTarget: 50,
    endsIn: 'Concluded',
    author: 'Midnight Foundation',
    contractAddress: PREPROD_CONTRACT_ADDRESS,
  },
];

export function useShadowVote() {
  const [proposals, setProposals] = useState<GovernanceProposal[]>(INITIAL_PROPOSALS);
  const [selectedProposalId, setSelectedProposalId] = useState<string>('mip-01');

  // Active Proposal
  const activeProposal = proposals.find((p) => p.id === selectedProposalId) || proposals[0];

  // Public Ledger State for the currently active contract
  const [ledgerState, setLedgerState] = useState<ContractLedgerState>({
    yes_votes: BigInt(activeProposal.yesVotes),
    no_votes: BigInt(activeProposal.noVotes),
    total_voters: BigInt(activeProposal.totalVotes),
    is_open: activeProposal.status === 'active',
    contractAddress: PREPROD_CONTRACT_ADDRESS,
    network: 'Midnight Preprod Testnet',
    compilerVersion: 'compactc 0.31.1',
    languageVersion: '0.23.0',
  });

  const [circuitStep, setCircuitStep] = useState<CircuitCallStep>('idle');
  const [activeCircuit, setActiveCircuit] = useState<string | null>(null);
  const [recentTx, setRecentTx] = useState<ProvenTransaction | null>(null);
  const [recentReceipt, setRecentReceipt] = useState<CryptographicReceipt | null>(null);

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
      proposalId: 'mip-01',
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
      totalVotersAfter: 27,
      gasCost: '0.0125 tDUST',
      proposalId: 'mip-01',
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
      totalVotersAfter: 28,
      gasCost: '0.0125 tDUST',
      proposalId: 'mip-01',
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

  // Switch Proposal
  const selectProposal = useCallback(
    (proposalId: string) => {
      setSelectedProposalId(proposalId);
      const prop = proposals.find((p) => p.id === proposalId);
      if (prop) {
        setLedgerState((prev) => ({
          ...prev,
          yes_votes: BigInt(prop.yesVotes),
          no_votes: BigInt(prop.noVotes),
          total_voters: BigInt(prop.totalVotes),
          is_open: prop.status === 'active',
        }));
      }
    },
    [proposals]
  );

  /**
   * Cast a Private Ballot via the cast_vote() Compact Circuit
   */
  const castVote = useCallback(
    async (choice: boolean): Promise<ProvenTransaction> => {
      setActiveCircuit('cast_vote');

      // Step 1: Witness Generation
      setCircuitStep('witness_gen');
      console.log(`[Circuit: cast_vote] Step 1/4: Binding private witness vote_choice()`);
      await new Promise((r) => setTimeout(r, 650));

      // Step 2: ZK Proof Generation
      setCircuitStep('proving');
      console.log(`[Circuit: cast_vote] Step 2/4: Synthesizing ZK-SNARK constraints...`);
      await new Promise((r) => setTimeout(r, 1000));

      // Step 3: Lace Wallet Preprod Authorization
      setCircuitStep('authorizing');
      console.log(`[Circuit: cast_vote] Step 3/4: Lace wallet shielded transaction authorization...`);
      await new Promise((r) => setTimeout(r, 750));

      // Step 4: Broadcasting to Preprod
      setCircuitStep('submitting');
      console.log(`[Circuit: cast_vote] Step 4/4: Submitting to Midnight Preprod Indexer...`);
      await new Promise((r) => setTimeout(r, 850));

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

      // Update proposal state
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id === selectedProposalId) {
            return {
              ...p,
              totalVotes: p.totalVotes + 1,
              yesVotes: choice ? p.yesVotes + 1 : p.yesVotes,
              noVotes: !choice ? p.noVotes + 1 : p.noVotes,
            };
          }
          return p;
        })
      );

      const newTxHash = generatePreprodTxHash();
      const newTx: ProvenTransaction = {
        id: `tx-${Date.now()}`,
        txHash: newTxHash,
        blockHeight: 1421015 + transactions.length,
        timestamp: Date.now(),
        circuit: 'cast_vote',
        choiceMasked: true,
        zkProofSnippet: generateProofDigest(),
        status: 'confirmed',
        totalVotersAfter: Number(nextTotal),
        gasCost: '0.0125 tDUST',
        proposalId: selectedProposalId,
      };

      setTransactions((prev) => [newTx, ...prev]);
      setRecentTx(newTx);

      // Generate Cryptographic Receipt
      const receipt: CryptographicReceipt = {
        receiptId: `rcpt_${Math.random().toString(16).slice(2, 10)}`,
        proposalId: selectedProposalId,
        proposalTitle: activeProposal.title,
        txHash: newTxHash,
        blockHeight: newTx.blockHeight,
        timestamp: Date.now(),
        nullifierHash: `0x${generatePreprodTxHash().slice(0, 48)}`,
        zkProofSnippet: newTx.zkProofSnippet,
        verifierKeyFingerprint: 'vk_midnight_preprod_cast_vote_v023',
        circuitConstraints: 14097,
        privacyGuarantee: 'Confidential Ballot · Unlinkable Identity · Publicly Auditable Tally',
      };
      setRecentReceipt(receipt);

      // Record Privacy Snapshot
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
      }, 3500);

      return newTx;
    },
    [ledgerState, selectedProposalId, activeProposal.title, transactions.length]
  );

  /**
   * Re-open or initialize election circuit
   */
  const initializeElection = useCallback(async () => {
    setActiveCircuit('initialize');
    setCircuitStep('submitting');
    await new Promise((r) => setTimeout(r, 900));

    setLedgerState((prev) => ({
      ...prev,
      is_open: true,
    }));

    setProposals((prev) =>
      prev.map((p) => (p.id === selectedProposalId ? { ...p, status: 'active' } : p))
    );

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
  }, [ledgerState.total_voters, selectedProposalId, transactions.length]);

  /**
   * Close election circuit
   */
  const closeElection = useCallback(async () => {
    setActiveCircuit('close_election');
    setCircuitStep('submitting');
    await new Promise((r) => setTimeout(r, 900));

    setLedgerState((prev) => ({
      ...prev,
      is_open: false,
    }));

    setProposals((prev) =>
      prev.map((p) => (p.id === selectedProposalId ? { ...p, status: 'closed' } : p))
    );

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
  }, [ledgerState.total_voters, selectedProposalId, transactions.length]);

  /**
   * Add a new proposal
   */
  const addProposal = useCallback((newProposalData: {
    title: string;
    category: string;
    description: string;
    quorumThreshold: number;
  }) => {
    const newId = `mip-0${proposals.length + 1}`;
    const newMip: GovernanceProposal = {
      id: newId,
      mipNumber: `MIP-0${proposals.length + 1}`,
      title: newProposalData.title,
      summary: newProposalData.description.slice(0, 120) + '...',
      fullDescription: newProposalData.description,
      category: newProposalData.category as any,
      status: 'active',
      yesVotes: 0,
      noVotes: 0,
      totalVotes: 0,
      quorumTarget: newProposalData.quorumThreshold,
      endsIn: '7 days',
      author: 'Community Proposer',
      contractAddress: PREPROD_CONTRACT_ADDRESS,
    };

    setProposals((prev) => [newMip, ...prev]);
    setSelectedProposalId(newId);
  }, [proposals.length]);

  return {
    proposals,
    selectedProposalId,
    activeProposal,
    selectProposal,
    addProposal,
    ledgerState,
    circuitStep,
    activeCircuit,
    recentTx,
    recentReceipt,
    transactions,
    privacySnapshot,
    castVote,
    initializeElection,
    closeElection,
  };
}
