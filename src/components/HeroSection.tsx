import React from 'react';
import { Sparkles, ShieldCheck, Cpu, ArrowRight, Lock, Key, Layers, Globe } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeroSectionProps {
  onOpenVoting: () => void;
  onOpenMerkle: () => void;
  onOpenAudit: () => void;
  onOpenCreateProposal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenVoting,
  onOpenMerkle,
  onOpenAudit,
  onOpenCreateProposal,
}) => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-midnight-950/80 shadow-[0_0_50px_rgba(6,182,212,0.15)] mb-8">
      {/* Background Hero Banner Art with Vignette and Gradient Overlay */}
      <div className="relative w-full h-72 sm:h-84 md:h-96 overflow-hidden">
        <img
          src="/assets/hero_lunar_circuit.jpg"
          alt="Midnight Lunar Circuit Architecture"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-90 hover:scale-100 transition-transform duration-1000"
        />
        {/* Deep ambient dark overlays for high contrast readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-950 via-midnight-950/80 to-transparent" />

        {/* Content Container overlaid on Hero */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 space-y-4">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-xs text-cyan-300 font-mono shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Midnight Preprod Testnet Active</span>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/40 text-xs text-purple-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>BLS12-381 Shielded State Diffs</span>
            </div>

            <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/40 text-xs text-amber-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Compact 0.23 Verifier</span>
            </div>
          </div>

          {/* Epic Title */}
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              SHADOW<span className="text-cyan-400">VOTE</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-sans max-w-xl drop-shadow">
              Next-generation confidential decentralized governance powered by the Midnight network. Ballots remain completely invisible on-chain while the collective tally is mathematically guaranteed by zero-knowledge proofs.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenVoting();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center space-x-2"
            >
              <span>Cast Shielded Ballot</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenMerkle();
              }}
              className="px-4 py-2.5 rounded-xl bg-midnight-900/90 hover:bg-midnight-800 border border-cyan-500/40 text-cyan-300 font-mono text-xs sm:text-sm transition-all flex items-center space-x-2"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Merkle Allowlist</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onOpenCreateProposal();
              }}
              className="px-4 py-2.5 rounded-xl bg-midnight-900/90 hover:bg-midnight-800 border border-purple-500/40 text-purple-300 font-mono text-xs sm:text-sm transition-all flex items-center space-x-2"
            >
              <span>+ Propose MIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar: Key Cryptographic Invariants */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-midnight-800 bg-midnight-900/60 divide-y md:divide-y-0 md:divide-x divide-midnight-800 text-xs font-mono">
        <div className="p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Ballot Privacy</span>
            <span className="text-slate-200 font-bold text-xs">Witness Choice Hidden</span>
          </div>
        </div>

        <div className="p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Double-Vote Defense</span>
            <span className="text-slate-200 font-bold text-xs">Deterministic Nullifiers</span>
          </div>
        </div>

        <div className="p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Constraint Count</span>
            <span className="text-emerald-400 font-bold text-xs">14,097 R1CS Gates</span>
          </div>
        </div>

        <div className="p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Preprod Network</span>
            <span className="text-amber-400 font-bold text-xs">Block #1,421,089+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
