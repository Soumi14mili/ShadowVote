import React, { useState } from 'react';
import { Lock, EyeOff, ShieldAlert, CheckCircle2, XCircle, ArrowRight, Loader2, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { LaceWalletState, CircuitCallStep, ProvenTransaction } from '../types/midnight';

interface VotingBoothProps {
  wallet: LaceWalletState;
  isOpen: boolean;
  circuitStep: CircuitCallStep;
  activeCircuit: string | null;
  onCastVote: (choice: boolean) => Promise<ProvenTransaction>;
  onConnectWallet: () => void;
}

export const VotingBooth: React.FC<VotingBoothProps> = ({
  wallet,
  isOpen,
  circuitStep,
  activeCircuit,
  onCastVote,
  onConnectWallet,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<boolean | null>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isVoting = circuitStep !== 'idle' && circuitStep !== 'confirmed' && activeCircuit === 'cast_vote';

  const handleVoteSubmit = async () => {
    if (selectedChoice === null || !wallet.isConnected || !isOpen || isVoting) return;

    try {
      const tx = await onCastVote(selectedChoice);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'],
      });
      setSuccessMessage(`Circuit cast_vote() confirmed! Tx: ${tx.txHash.slice(0, 10)}...`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error casting vote:', err);
    }
  };

  return (
    <div className="rounded-2xl bg-midnight-900/90 border border-midnight-700/80 p-6 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-midnight-800 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              <span>Private Voting Booth</span>
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              ZK Circuit: cast_vote()
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cast your ballot via zero-knowledge proof. Your choice is kept as a local private witness and is never sent to the network.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-midnight-950 border border-midnight-700 text-xs font-mono text-slate-300">
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Private Witness</span>
          </span>
        </div>
      </div>

      {/* Ballot Ballot Question */}
      <div className="my-6 p-4 rounded-xl bg-midnight-950/80 border border-midnight-800">
        <span className="text-xs font-mono text-cyan-400 font-semibold block mb-1">
          Governance Measure #42 — Midnight Preprod
        </span>
        <h3 className="text-base sm:text-lg font-medium text-slate-200">
          "Should Midnight Network implement Zero-Knowledge Autonomous Sharding on the Preprod testnet?"
        </h3>
      </div>

      {/* Choice Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* YES Option */}
        <button
          type="button"
          onClick={() => setSelectedChoice(true)}
          disabled={!isOpen || isVoting}
          className={`relative p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            selectedChoice === true
              ? 'bg-emerald-950/30 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'bg-midnight-850/60 border-midnight-700 hover:border-slate-500'
          } ${(!isOpen || isVoting) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className={`w-5 h-5 ${selectedChoice === true ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="font-bold text-base text-slate-100">VOTE YES (Approve)</span>
            </div>
            {selectedChoice === true && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-midnight-950 flex items-center justify-center font-bold text-xs">
                ✓
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Proves that <code className="font-mono text-emerald-300">vote_choice() = true</code> within the ZK circuit.
          </p>
        </button>

        {/* NO Option */}
        <button
          type="button"
          onClick={() => setSelectedChoice(false)}
          disabled={!isOpen || isVoting}
          className={`relative p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${
            selectedChoice === false
              ? 'bg-rose-950/30 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
              : 'bg-midnight-850/60 border-midnight-700 hover:border-slate-500'
          } ${(!isOpen || isVoting) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <XCircle className={`w-5 h-5 ${selectedChoice === false ? 'text-rose-400' : 'text-slate-500'}`} />
              <span className="font-bold text-base text-slate-100">VOTE NO (Reject)</span>
            </div>
            {selectedChoice === false && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-midnight-950 flex items-center justify-center font-bold text-xs">
                ✓
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Proves that <code className="font-mono text-rose-300">vote_choice() = false</code> within the ZK circuit.
          </p>
        </button>
      </div>

      {/* Action Area: Submit or Connect */}
      {!wallet.isConnected ? (
        <div className="p-4 rounded-xl bg-midnight-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-amber-200">Lace Wallet Required</h4>
              <p className="text-xs text-slate-400">
                Connect your Lace wallet on Midnight Preprod to sign and cast your zero-knowledge ballot.
              </p>
            </div>
          </div>
          <button
            onClick={onConnectWallet}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 text-midnight-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 flex-shrink-0"
          >
            <span>Connect Lace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : !isOpen ? (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-center">
          <p className="text-sm font-semibold text-rose-300">
            This election is currently CLOSED on-chain. No further ballots can be accepted.
          </p>
        </div>
      ) : (
        <div>
          <button
            onClick={handleVoteSubmit}
            disabled={isVoting || selectedChoice === null}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-midnight-950 font-extrabold text-base transition-all shadow-crescent hover:shadow-crescent-glow flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVoting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Executing ZK Circuit on Preprod...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>
                  Submit Private Ballot via ZK Circuit (cast_vote)
                </span>
              </>
            )}
          </button>

          {/* Stepper Display during circuit execution */}
          {isVoting && (
            <div className="mt-5 p-4 rounded-xl bg-midnight-950 border border-cyan-500/30 space-y-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                Zero-Knowledge Execution Pipeline
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className={`p-2 rounded border ${circuitStep === 'witness_gen' ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200' : 'bg-midnight-900 border-midnight-800 text-slate-500'}`}>
                  1. Witness Binding
                </div>
                <div className={`p-2 rounded border ${circuitStep === 'proving' ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200' : 'bg-midnight-900 border-midnight-800 text-slate-500'}`}>
                  2. ZK-SNARK Prover
                </div>
                <div className={`p-2 rounded border ${circuitStep === 'authorizing' ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200' : 'bg-midnight-900 border-midnight-800 text-slate-500'}`}>
                  3. Lace Preprod Sign
                </div>
                <div className={`p-2 rounded border ${circuitStep === 'submitting' ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200' : 'bg-midnight-900 border-midnight-800 text-slate-500'}`}>
                  4. On-Chain Ledger
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
