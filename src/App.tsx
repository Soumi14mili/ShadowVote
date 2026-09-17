import React, { useState } from 'react';
import { Header } from './components/Header';
import { ContractBanner } from './components/ContractBanner';
import { ElectionStats } from './components/ElectionStats';
import { ProposalSelector } from './components/ProposalSelector';
import { VotingBooth } from './components/VotingBooth';
import { CircuitVisualizer } from './components/CircuitVisualizer';
import { ProofVerifier } from './components/ProofVerifier';
import { PrivacyInspector } from './components/PrivacyInspector';
import { TransactionHistory } from './components/TransactionHistory';
import { AdminControls } from './components/AdminControls';
import { CosmicBackground } from './components/CosmicBackground';
import { HeroSection } from './components/HeroSection';
import { NetworkRadar } from './components/NetworkRadar';
import { MerkleTreeVisualizer } from './components/MerkleTreeVisualizer';
import { QuadraticVotingSim } from './components/QuadraticVotingSim';
import { CreateProposalModal } from './components/CreateProposalModal';
import { ZKProverTheater } from './components/ZKProverTheater';
import { useLaceWallet } from './hooks/useLaceWallet';
import { useShadowVote } from './hooks/useShadowVote';
import {
  Moon,
  Shield,
  Sparkles,
  BookOpen,
  Github,
  Cpu,
  FileCheck,
  History,
  Settings,
  ExternalLink,
  Layers,
  Scale,
} from 'lucide-react';
import { soundFx } from './utils/audio';

export const App: React.FC = () => {
  const { wallet, isLaceAvailable, connect, disconnect } = useLaceWallet();
  const {
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
  } = useShadowVote();

  const [activeTab, setActiveTab] = useState<
    'governance' | 'merkle' | 'quadratic' | 'prover' | 'receipt' | 'privacy' | 'transactions' | 'admin'
  >('governance');

  const [isCreateProposalOpen, setIsCreateProposalOpen] = useState(false);
  const [proverTheaterDismissed, setProverTheaterDismissed] = useState(false);

  const handleTabClick = (tab: typeof activeTab) => {
    soundFx.playClick();
    setActiveTab(tab);
  };

  const handleClaimFaucet = () => {
    if (wallet.address) {
      wallet.balance = `${(parseFloat(wallet.balance.replace(/[^0-9.]/g, '')) + 500).toLocaleString('en-US', { minimumFractionDigits: 2 })} tDUST`;
    }
  };

  const handleVoteSubmit = async (choice: boolean) => {
    setProverTheaterDismissed(false);
    return await castVote(choice);
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Interactive Cosmic Background Canvas */}
      <CosmicBackground />

      {/* Full-Screen Holographic ZK Prover Theater Modal */}
      <ZKProverTheater
        isOpen={circuitStep !== 'idle' && !proverTheaterDismissed}
        circuitStep={circuitStep}
        onClose={() => setProverTheaterDismissed(true)}
      />

      {/* Modal for drafting a new MIP proposal */}
      <CreateProposalModal
        isOpen={isCreateProposalOpen}
        onClose={() => setIsCreateProposalOpen(false)}
        onSubmit={(newProp) => addProposal(newProp)}
      />

      {/* Header */}
      <Header
        wallet={wallet}
        isLaceAvailable={isLaceAvailable}
        onConnect={connect}
        onDisconnect={disconnect}
        onClaimFaucet={handleClaimFaucet}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-6">
        {/* Cinematic 3D Lunar Circuit Hero Section */}
        <HeroSection
          onOpenVoting={() => handleTabClick('governance')}
          onOpenMerkle={() => handleTabClick('merkle')}
          onOpenAudit={() => handleTabClick('privacy')}
          onOpenCreateProposal={() => setIsCreateProposalOpen(true)}
        />

        {/* Real-time Preprod Network Telemetry Radar */}
        <NetworkRadar />

        {/* Verifiable Preprod Contract Address Banner */}
        <ContractBanner />

        {/* Live Public Ledger Counters */}
        <ElectionStats ledgerState={ledgerState} />

        {/* Futuristic Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-midnight-800 scrollbar-none">
          <button
            onClick={() => handleTabClick('governance')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'governance'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/50 shadow-crescent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-900'
            }`}
          >
            <Moon className="w-4 h-4 text-cyan-400" />
            <span>Governance Proposals</span>
          </button>

          <button
            onClick={() => handleTabClick('merkle')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'merkle'
                ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/50 shadow-crescent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-900'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Merkle Allowlist</span>
          </button>

          <button
            onClick={() => handleTabClick('quadratic')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'quadratic'
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/50 shadow-crescent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-900'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Quadratic Voting</span>
          </button>

          <button
            onClick={() => handleTabClick('prover')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'prover'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/50 shadow-crescent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>ZK Prover Console</span>
            {circuitStep !== 'idle' && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('receipt')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'receipt'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 shadow-crescent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Proof Verifier & Badge</span>
          </button>

          <button
            onClick={() => handleTabClick('privacy')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'privacy'
                ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-300 border border-amber-500/50 shadow-crescent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-900'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Privacy Audit & Attack Sim</span>
          </button>

          <button
            onClick={() => handleTabClick('transactions')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'transactions'
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/50 shadow-crescent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-900'
            }`}
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span>Transactions ({transactions.length})</span>
          </button>

          <button
            onClick={() => handleTabClick('admin')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/50 shadow-crescent'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-900'
            }`}
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>Admin</span>
          </button>
        </div>

        {/* TAB 1: GOVERNANCE & VOTING */}
        {activeTab === 'governance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-slate-400">
                Select an active proposal to inspect cryptographic parameters and cast your confidential ballot.
              </span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsCreateProposalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-xs transition-all flex items-center space-x-1.5"
              >
                <span>+ Create Proposal</span>
              </button>
            </div>

            <ProposalSelector
              proposals={proposals}
              selectedProposalId={selectedProposalId}
              onSelectProposal={selectProposal}
            />

            <VotingBooth
              wallet={wallet}
              activeProposal={activeProposal}
              circuitStep={circuitStep}
              activeCircuit={activeCircuit}
              onCastVote={handleVoteSubmit}
              onConnectWallet={() => connect('lace')}
              onViewReceipt={() => handleTabClick('receipt')}
            />

            {/* In-Line Circuit Prover Snapshot */}
            <CircuitVisualizer
              circuitStep={circuitStep}
              activeCircuit={activeCircuit}
              selectedChoice={privacySnapshot.clientWitnessChoice}
            />
          </div>
        )}

        {/* TAB 2: MERKLE ALLOWLIST VISUALIZER */}
        {activeTab === 'merkle' && (
          <div className="space-y-6">
            <MerkleTreeVisualizer />
          </div>
        )}

        {/* TAB 3: ANTI-WHALE QUADRATIC VOTING SIMULATOR */}
        {activeTab === 'quadratic' && (
          <div className="space-y-6">
            <QuadraticVotingSim />
          </div>
        )}

        {/* TAB 4: ZK PROVER CONSOLE */}
        {activeTab === 'prover' && (
          <div className="space-y-6">
            <CircuitVisualizer
              circuitStep={circuitStep}
              activeCircuit={activeCircuit}
              selectedChoice={privacySnapshot.clientWitnessChoice}
            />
          </div>
        )}

        {/* TAB 5: PROOF VERIFIER, RECEIPT & 3D MEDAL */}
        {activeTab === 'receipt' && (
          <div className="space-y-6">
            <ProofVerifier recentReceipt={recentReceipt} />
          </div>
        )}

        {/* TAB 6: PRIVACY INSPECTOR & ADVERSARY SIMULATOR */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <PrivacyInspector snapshot={privacySnapshot} />
          </div>
        )}

        {/* TAB 7: ON-CHAIN TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionHistory transactions={transactions} />
          </div>
        )}

        {/* TAB 8: ADMIN LIFECYCLE */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <AdminControls
              isOpen={ledgerState.is_open}
              circuitStep={circuitStep}
              activeCircuit={activeCircuit}
              onInitialize={initializeElection}
              onCloseElection={closeElection}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-midnight-800/80 bg-midnight-950/90 backdrop-blur-md py-8 relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Moon className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400">
              ShadowVote · Production Shielded Governance on Midnight Preprod
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono">
            <a
              href="https://github.com/Soumi14mili/ShadowVote"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://docs.midnight.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Midnight Docs</span>
            </a>
            <a
              href="https://explorer.midnight.network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center space-x-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preprod Explorer</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
