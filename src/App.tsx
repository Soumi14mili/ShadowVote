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
import { useLaceWallet } from './hooks/useLaceWallet';
import { useShadowVote } from './hooks/useShadowVote';
import { Moon, Shield, Sparkles, BookOpen, Github, Cpu, FileCheck, Terminal, History, Settings, ExternalLink } from 'lucide-react';
import { soundFx } from './utils/audio';

export const App: React.FC = () => {
  const { wallet, isLaceAvailable, connect, disconnect } = useLaceWallet();
  const {
    proposals,
    selectedProposalId,
    activeProposal,
    selectProposal,
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

  const [activeTab, setActiveTab] = useState<'governance' | 'prover' | 'receipt' | 'privacy' | 'transactions' | 'admin'>('governance');

  const handleTabClick = (tab: typeof activeTab) => {
    soundFx.playClick();
    setActiveTab(tab);
  };

  const handleClaimFaucet = () => {
    if (wallet.address) {
      // Simulate adding 500 tDUST
      wallet.balance = `${(parseFloat(wallet.balance.replace(/[^0-9.]/g, '')) + 500).toLocaleString('en-US', { minimumFractionDigits: 2 })} tDUST`;
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Interactive Cosmic Background Canvas */}
      <CosmicBackground />

      {/* Header */}
      <Header
        wallet={wallet}
        isLaceAvailable={isLaceAvailable}
        onConnect={connect}
        onDisconnect={disconnect}
        onClaimFaucet={handleClaimFaucet}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-6">
        {/* Poetic Intro & Midnight Branding */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-midnight-900/90 border border-cyan-500/30 text-xs text-cyan-300 font-mono shadow-crescent">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Midnight Challenge Level 3 · First Quarter</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-cyan-100 to-amber-200">
            The Shielded Governance Frontier
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            "Half light, half shadow — exactly half the moon is lit, and exactly as much of your governance participation is disclosed as you decide."
          </p>
        </div>

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
            <span>Proof Verifier & Receipt</span>
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
              onCastVote={castVote}
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

        {/* TAB 2: ZK PROVER CONSOLE */}
        {activeTab === 'prover' && (
          <div className="space-y-6">
            <CircuitVisualizer
              circuitStep={circuitStep}
              activeCircuit={activeCircuit}
              selectedChoice={privacySnapshot.clientWitnessChoice}
            />
          </div>
        )}

        {/* TAB 3: PROOF VERIFIER & RECEIPT */}
        {activeTab === 'receipt' && (
          <div className="space-y-6">
            <ProofVerifier recentReceipt={recentReceipt} />
          </div>
        )}

        {/* TAB 4: PRIVACY INSPECTOR & ADVERSARY SIMULATOR */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <PrivacyInspector snapshot={privacySnapshot} />
          </div>
        )}

        {/* TAB 5: ON-CHAIN TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionHistory transactions={transactions} />
          </div>
        )}

        {/* TAB 6: ADMIN LIFECYCLE */}
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
