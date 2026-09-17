import React from 'react';
import { Settings, Play, StopCircle, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import type { CircuitCallStep } from '../types/midnight';

interface AdminControlsProps {
  isOpen: boolean;
  circuitStep: CircuitCallStep;
  activeCircuit: string | null;
  onInitialize: () => Promise<void>;
  onCloseElection: () => Promise<void>;
}

export const AdminControls: React.FC<AdminControlsProps> = ({
  isOpen,
  circuitStep,
  activeCircuit,
  onInitialize,
  onCloseElection,
}) => {
  const isExecuting = circuitStep !== 'idle' && circuitStep !== 'confirmed';

  return (
    <div className="rounded-2xl bg-midnight-900/90 border border-midnight-700/80 p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-midnight-800">
        <div className="flex items-center space-x-2.5">
          <Settings className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-slate-100">Contract Lifecycle Circuits</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Admin Authority</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Initialize Circuit */}
        <div className="p-5 rounded-xl bg-midnight-950 border border-midnight-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-200 font-mono">circuit initialize(): []</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-midnight-900 text-slate-400 border border-midnight-700">
              Opens Election
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Invokes the initialization circuit to open the election on Preprod (<code className="text-cyan-300 font-mono">is_open = true</code>).
          </p>
          <button
            onClick={onInitialize}
            disabled={isExecuting || isOpen}
            className="w-full py-2.5 px-4 rounded-xl bg-midnight-800 hover:bg-midnight-700 border border-midnight-600 hover:border-emerald-500/50 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {activeCircuit === 'initialize' && isExecuting
                ? 'Invoking initialize()...'
                : isOpen
                ? 'Election Already Open'
                : 'Invoke initialize()'}
            </span>
          </button>
        </div>

        {/* Close Election Circuit */}
        <div className="p-5 rounded-xl bg-midnight-950 border border-midnight-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-200 font-mono">circuit close_election(): []</h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-midnight-900 text-rose-300 border border-rose-900/60">
              Closes Election
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Permanently closes the election (<code className="text-rose-300 font-mono">is_open = false</code>). Any subsequent <code className="text-cyan-300 font-mono">cast_vote()</code> attempts will fail the ZK assertion.
          </p>
          <button
            onClick={onCloseElection}
            disabled={isExecuting || !isOpen}
            className="w-full py-2.5 px-4 rounded-xl bg-midnight-800 hover:bg-midnight-700 border border-midnight-600 hover:border-rose-500/50 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <StopCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>
              {activeCircuit === 'close_election' && isExecuting
                ? 'Invoking close_election()...'
                : !isOpen
                ? 'Election Already Closed'
                : 'Invoke close_election()'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
