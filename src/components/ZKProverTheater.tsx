import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Sparkles, CheckCircle2, Lock, Activity, X } from 'lucide-react';
import type { CircuitCallStep } from '../types/midnight';

interface ZKProverTheaterProps {
  isOpen: boolean;
  circuitStep: CircuitCallStep;
  onClose: () => void;
}

export const ZKProverTheater: React.FC<ZKProverTheaterProps> = ({
  isOpen,
  circuitStep,
  onClose,
}) => {
  const [constraintCount, setConstraintCount] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setConstraintCount(0);
      return;
    }

    let start = 0;
    const target = 14097;
    const duration = 2200;
    const stepTime = 25;
    const increment = Math.ceil(target / (duration / stepTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setConstraintCount(target);
        clearInterval(timer);
      } else {
        setConstraintCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/90 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Background ambient pulse */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-2xl rounded-3xl bg-midnight-900/95 border border-cyan-400/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden space-y-6">
        {/* Close Button (only when confirmed) */}
        {circuitStep === 'confirmed' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Top Badge */}
        <div className="flex items-center justify-between border-b border-midnight-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              Midnight ZK-SNARK Prover Engine
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Preprod Node #1421015</span>
        </div>

        {/* Center 3D ZK Seal & Progress */}
        <div className="flex flex-col items-center justify-center py-2 space-y-4 text-center">
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-500 shadow-crescent">
            <img
              src="/assets/zk_shield_seal.jpg"
              alt="Zero-Knowledge Shield Seal"
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-cyan-500/10 rounded-xl pointer-events-none animate-pulse" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              {circuitStep === 'witness_gen' && 'Binding Confidential Private Witness...'}
              {circuitStep === 'proving' && 'Synthesizing R1CS Constraint System...'}
              {circuitStep === 'authorizing' && 'Requesting Lace Preprod Authorization...'}
              {circuitStep === 'submitting' && 'Broadcasting Shielded State Diff...'}
              {circuitStep === 'confirmed' && 'Zero-Knowledge Proof Verified On-Chain!'}
            </h3>
            <p className="text-xs font-mono text-cyan-300 mt-1">
              {circuitStep === 'confirmed'
                ? 'Your ballot choice remains 100% private. On-chain tally incremented.'
                : 'Evaluating constraints over Jubjub / BLS12-381 elliptic curves...'}
            </p>
          </div>
        </div>

        {/* Live Constraint Ticker */}
        <div className="p-4 rounded-2xl bg-midnight-950 border border-midnight-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-[11px] font-mono text-slate-400 block">R1CS Constraints Evaluated</span>
              <span className="text-xl font-bold font-mono text-cyan-300">
                {constraintCount.toLocaleString()} / 14,097
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400 block">Prover Status</span>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              {circuitStep === 'confirmed' ? 'SATISFIED' : 'PROVING ACTIVE'}
            </span>
          </div>
        </div>

        {/* 4 Pipeline Stages */}
        <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono">
          <div className={`p-2 rounded-xl border ${circuitStep === 'witness_gen' ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-midnight-950 border-midnight-800 text-slate-400'}`}>
            1. Witness
          </div>
          <div className={`p-2 rounded-xl border ${circuitStep === 'proving' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-midnight-950 border-midnight-800 text-slate-400'}`}>
            2. Constraints
          </div>
          <div className={`p-2 rounded-xl border ${circuitStep === 'authorizing' ? 'bg-purple-500/20 border-purple-400 text-purple-200' : 'bg-midnight-950 border-midnight-800 text-slate-400'}`}>
            3. Lace Sign
          </div>
          <div className={`p-2 rounded-xl border ${circuitStep === 'submitting' || circuitStep === 'confirmed' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-midnight-950 border-midnight-800 text-slate-400'}`}>
            4. Finality
          </div>
        </div>

        {/* Close Button on Confirmation */}
        {circuitStep === 'confirmed' && (
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-midnight-950 font-extrabold text-sm transition-all shadow-crescent flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete & View Governance Dashboard</span>
          </button>
        )}
      </div>
    </div>
  );
};
