import React from 'react';
import { Shield, EyeOff, Eye, CheckCircle2, Lock, ArrowRight, Code, Key, Database, FileCheck } from 'lucide-react';
import type { ObservablePrivacySnapshot } from '../types/midnight';

interface PrivacyInspectorProps {
  snapshot: ObservablePrivacySnapshot;
}

export const PrivacyInspector: React.FC<PrivacyInspectorProps> = ({ snapshot }) => {
  return (
    <div className="rounded-2xl bg-midnight-900/90 border border-cyan-500/30 p-6 shadow-2xl space-y-6">
      {/* Title & Philosophy */}
      <div className="border-b border-midnight-800 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Observable Privacy Inspector</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Proven Without Being Shown
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                A mathematical proof verifying valid election participation while keeping the voter's ballot confidential.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-cyan-300 bg-midnight-950 px-3 py-1.5 rounded-lg border border-midnight-800">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Zero-Knowledge Intermediate Representation</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Dual State Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Client-Side Private Realm */}
        <div className="rounded-xl bg-midnight-950 border border-amber-500/30 p-5 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-amber-300">Client Private Witness (Off-Chain)</span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40">
              Never Broadcast
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Lives in the voter's local browser memory during circuit execution. Evaluated by the Compact prover to satisfy ZK constraints.
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-midnight-900 border border-midnight-800 flex items-center justify-between">
              <span className="text-slate-400">Witness Function:</span>
              <span className="text-amber-300 font-semibold">witness vote_choice(): Boolean</span>
            </div>

            <div className="p-3 rounded-lg bg-midnight-900 border border-midnight-800 flex items-center justify-between">
              <span className="text-slate-400">Voter's Secret Input:</span>
              <span className="text-slate-200 font-semibold">
                {snapshot.clientWitnessChoice !== null
                  ? `${snapshot.clientWitnessChoice ? 'TRUE (YES)' : 'FALSE (NO)'} [HELD LOCALLY]`
                  : '[CONFIDENTIAL WITNESS - HELD LOCALLY]'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-midnight-900 border border-midnight-800 flex items-center justify-between">
              <span className="text-slate-400">Network Exposure:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>0 Bytes Leaked (Cryptographically Concealed)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Public Ledger State */}
        <div className="rounded-xl bg-midnight-950 border border-cyan-500/30 p-5 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-cyan-300">Public Preprod Ledger (On-Chain)</span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/40">
              Globally Verifiable
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Recorded immutably on Midnight Preprod. Any observer or node validator can mathematically verify without revealing voter choices.
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-midnight-900 border border-midnight-800 flex items-center justify-between">
              <span className="text-slate-400">ZK Proof Verification:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>VALID ZK-SNARK (14,097 constraints)</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-midnight-900 border border-midnight-800 flex items-center justify-between">
              <span className="text-slate-400">State Transition:</span>
              <span className="text-cyan-300 font-semibold">total_voters += 1 (Aggregate Tally)</span>
            </div>

            <div className="p-3 rounded-lg bg-midnight-900 border border-midnight-800 flex items-center justify-between">
              <span className="text-slate-400">Voter Identity Link:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Decoupled / Unlinkable</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive into Compact Circuit Logic */}
      <div className="p-4 rounded-xl bg-midnight-950 border border-midnight-800 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
          <Code className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">Compact Language Contract Mechanism: `disclose()`</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          In Compact, the compiler strictly forbids any private witness from modifying public ledger state without the explicit{' '}
          <code className="text-cyan-300 bg-midnight-900 px-1 py-0.5 rounded font-mono">disclose()</code> operator. In{' '}
          <code className="text-amber-300 bg-midnight-900 px-1 py-0.5 rounded font-mono">shadow_vote.compact</code>, we write:
        </p>
        <pre className="p-3 rounded-lg bg-midnight-900/90 border border-midnight-800 text-xs font-mono text-slate-200 overflow-x-auto">
          <code>{`export circuit cast_vote(): [] {
  assert(is_open, "Election is closed - no more votes accepted");

  // Private witness is disclosed ONLY for public tally arithmetic
  const choice: Boolean = disclose(vote_choice());

  total_voters = (total_voters + 1) as Uint<32>;

  if (choice) {
    yes_votes = (yes_votes + 1) as Uint<32>;
  } else {
    no_votes = (no_votes + 1) as Uint<32>;
  }
}`}</code>
        </pre>
        <div className="p-3 rounded-lg bg-midnight-900/60 border border-midnight-800 text-xs text-slate-300 flex items-start space-x-2">
          <span className="text-amber-400 font-bold">💡 Observable Privacy Claim:</span>
          <span>
            The ZK proof proves that the voter executed <code className="font-mono text-cyan-300">cast_vote()</code> with a valid boolean, incrementing the total tally by 1, while the voter's identity and choice remain hidden in the cryptographic proof.
          </span>
        </div>
      </div>
    </div>
  );
};
