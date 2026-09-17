import React, { useState } from 'react';
import { Header } from './components/Header';
import { ContractBanner } from './components/ContractBanner';
import { ElectionStats } from './components/ElectionStats';
import { VotingBooth } from './components/VotingBooth';
import { PrivacyInspector } from './components/PrivacyInspector';
import { TransactionHistory } from './components/TransactionHistory';
import { AdminControls } from './components/AdminControls';
import { useLaceWallet } from './hooks/useLaceWallet';
import { useShadowVote } from './hooks/useShadowVote';
import { Moon, Shield, Sparkles, Terminal, BookOpen, Github, ExternalLink } from 'lucide-react';

export const App: React.FC = () => {
  const { wallet, isLaceAvailable, connect, disconnect } = useLaceWallet();
  const {
    ledgerState,
    circuitStep,
    activeCircuit,
    recentTx,
    transactions,
    privacySnapshot,
    castVote,
    initializeElection,
    closeElection,
  } = useShadowVote();

  const [activeTab, setActiveTab] = useState<'voting' | 'privacy' | 'transactions' | 'admin'>('voting');

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Background Starfield and Ambient Crescent Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-500/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <Header
        wallet={wallet}
        isLaceAvailable={isLaceAvailable}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-6">
        {/* Poetic Intro & Crescent Motto */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-midnight-850/80 border border-cyan-500/30 text-xs text-cyan-300 font-mono mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Midnight Challenge Level 2 · Crescent</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-cyan-100 to-amber-200">
            The First Thread of Light
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            "You wire your contract to a real frontend and bring Lace onto Preprod. Most of it still rests in shadow; you have simply chosen to reveal the edge."
          </p>
        </div>

        {/* Verifiable Preprod Contract Address Banner */}
        <ContractBanner />

        {/* Live Public Ledger Counters */}
        <ElectionStats ledgerState={ledgerState} />

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center sm:justify-start space-x-2 border-b border-midnight-800 pb-2">
          <button
            onClick={() => setActiveTab('voting')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'voting'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-850'
            }`}
          >
            Voting Booth
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === 'privacy'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-850'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Privacy Inspector (ZK Claim)</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'transactions'
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-850'
            }`}
          >
            On-Chain Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-midnight-850'
            }`}
          >
            Admin Lifecycle
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'voting' && (
          <div className="space-y-6">
            <VotingBooth
              wallet={wallet}
              isOpen={ledgerState.is_open}
              circuitStep={circuitStep}
              activeCircuit={activeCircuit}
              onCastVote={castVote}
              onConnectWallet={() => connect('lace')}
            />
            {/* Quick Privacy Snapshot below voting booth */}
            <PrivacyInspector snapshot={privacySnapshot} />
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <PrivacyInspector snapshot={privacySnapshot} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionHistory transactions={transactions} />
          </div>
        )}

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
      <footer className="border-t border-midnight-800/80 bg-midnight-950 py-8 relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Moon className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono text-slate-400">
              ShadowVote · Midnight Level 2 Crescent Challenge
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
              href="https://chromewebstore.google.com/detail/lace-midnight/detail"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center space-x-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lace Extension</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
