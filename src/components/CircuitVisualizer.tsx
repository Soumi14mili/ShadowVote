import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Play, CheckCircle2, Shield, Activity, RefreshCw, Copy, Check } from 'lucide-react';
import type { CircuitCallStep, ProverLog } from '../types/midnight';
import { soundFx } from '../utils/audio';

interface CircuitVisualizerProps {
  circuitStep: CircuitCallStep;
  activeCircuit: string | null;
  selectedChoice: boolean | null;
}

export const CircuitVisualizer: React.FC<CircuitVisualizerProps> = ({
  circuitStep,
  activeCircuit,
  selectedChoice,
}) => {
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Dynamic Prover Logs
  const [logs, setLogs] = useState<ProverLog[]>([
    {
      id: '1',
      timestamp: '14:20:01.102',
      stage: 'WITNESS',
      message: 'Midnight ZK Prover Runtime initialized (compactc 0.31.1 / language 0.23)',
      type: 'info',
    },
    {
      id: '2',
      timestamp: '14:20:01.145',
      stage: 'CONSTRAINT',
      message: 'Synthesizing R1CS constraint system from managed/zkir/cast_vote.zkir...',
      type: 'zk',
    },
    {
      id: '3',
      timestamp: '14:20:01.189',
      stage: 'PROVER',
      message: 'Loaded proving key cast_vote.prover (148,115 bytes). Prover ready.',
      type: 'success',
    },
  ]);

  // Append new logs when circuit step changes
  useEffect(() => {
    const time = new Date().toLocaleTimeString() + '.' + Math.floor(Math.random() * 900 + 100);

    if (circuitStep === 'witness_gen') {
      soundFx.playProverHum();
      setLogs((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          timestamp: time,
          stage: 'WITNESS',
          message: `[WITNESS] Querying vote_choice() -> confidential client secret allocated in browser memory (0 bytes leaked)`,
          type: 'zk',
        },
      ]);
    } else if (circuitStep === 'proving') {
      setLogs((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          timestamp: time,
          stage: 'CONSTRAINT',
          message: `[CONSTRAINT] Enforcing: assert(is_open == true) -> SATISFIED (14,097 R1CS constraints verified)`,
          type: 'info',
        },
        {
          id: String(Date.now() + 1),
          timestamp: time,
          stage: 'PROVER',
          message: `[PROVER] Generating succinct ZK-SNARK proof over Jubjub / BLS12-381 elliptic curve...`,
          type: 'zk',
        },
      ]);
    } else if (circuitStep === 'authorizing') {
      setLogs((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          timestamp: time,
          stage: 'SIGN',
          message: `[LACE] Requesting shielded transaction witness signing on Midnight Preprod...`,
          type: 'info',
        },
      ]);
    } else if (circuitStep === 'submitting') {
      setLogs((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          timestamp: time,
          stage: 'PREPROD',
          message: `[PREPROD] Broadcasting transaction: proof π serialized (256 bytes) to Preprod Indexer...`,
          type: 'info',
        },
      ]);
    } else if (circuitStep === 'confirmed') {
      soundFx.playSuccess();
      setLogs((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          timestamp: time,
          stage: 'PREPROD',
          message: `[CONFIRMED] Preprod Block included! State diff applied: total_voters += 1. Zero-knowledge proof VALID.`,
          type: 'success',
        },
      ]);
    }
  }, [circuitStep]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCopyLogs = () => {
    soundFx.playClick();
    const text = logs.map((l) => `[${l.timestamp}] [${l.stage}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-midnight-900/90 border border-midnight-700/80 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-midnight-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Zero-Knowledge Circuit Visualizer</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                Compact 0.23 · ZK-SNARK
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time visualization of off-chain cryptographic proving and on-chain constraint validation.
            </p>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1 rounded-lg bg-midnight-950 border border-midnight-800 text-slate-300">
            <span className="text-slate-500 block text-[10px]">Constraints</span>
            <span className="text-cyan-400 font-bold">14,097</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-midnight-950 border border-midnight-800 text-slate-300">
            <span className="text-slate-500 block text-[10px]">Proof Size</span>
            <span className="text-amber-400 font-bold">256 bytes</span>
          </div>
          <div className="px-3 py-1 rounded-lg bg-midnight-950 border border-midnight-800 text-slate-300">
            <span className="text-slate-500 block text-[10px]">Curve</span>
            <span className="text-emerald-400 font-bold">BLS12-381</span>
          </div>
        </div>
      </div>

      {/* Interactive Circuit DAG Execution Graph */}
      <div className="p-4 rounded-xl bg-midnight-950/80 border border-midnight-800">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold mb-4">
          Proof Generation Pipeline (DAG)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
          {/* Node 1: Witness Ingestion */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              circuitStep === 'witness_gen'
                ? 'bg-amber-950/30 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : circuitStep !== 'idle'
                ? 'bg-midnight-900 border-emerald-500/50'
                : 'bg-midnight-900 border-midnight-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 font-mono">1. Witness</span>
              {circuitStep !== 'idle' && circuitStep !== 'witness_gen' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-300 font-mono font-semibold">vote_choice()</p>
            <span className="text-[10px] text-slate-500 block mt-1">
              Private input (1 bit, local memory)
            </span>
          </div>

          {/* Node 2: Constraint Solver */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              circuitStep === 'proving'
                ? 'bg-cyan-950/30 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse'
                : circuitStep === 'authorizing' || circuitStep === 'submitting' || circuitStep === 'confirmed'
                ? 'bg-midnight-900 border-emerald-500/50'
                : 'bg-midnight-900 border-midnight-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-300 font-mono">2. Constraints</span>
              {(circuitStep === 'authorizing' || circuitStep === 'submitting' || circuitStep === 'confirmed') && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-300 font-mono font-semibold">assert(is_open)</p>
            <span className="text-[10px] text-slate-500 block mt-1">
              R1CS circuit synthesis & evaluation
            </span>
          </div>

          {/* Node 3: Lace Authorization */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              circuitStep === 'authorizing'
                ? 'bg-purple-950/30 border-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)] animate-pulse'
                : circuitStep === 'submitting' || circuitStep === 'confirmed'
                ? 'bg-midnight-900 border-emerald-500/50'
                : 'bg-midnight-900 border-midnight-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-300 font-mono">3. Lace Sign</span>
              {(circuitStep === 'submitting' || circuitStep === 'confirmed') && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-300 font-mono font-semibold">Shielded Tx</p>
            <span className="text-[10px] text-slate-500 block mt-1">
              Wallet balances fee without seeing ballot
            </span>
          </div>

          {/* Node 4: On-Chain Broadcast */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              circuitStep === 'submitting'
                ? 'bg-emerald-950/30 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                : circuitStep === 'confirmed'
                ? 'bg-midnight-900 border-emerald-400'
                : 'bg-midnight-900 border-midnight-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-300 font-mono">4. Preprod Finality</span>
              {circuitStep === 'confirmed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-300 font-mono font-semibold">total_voters +1</p>
            <span className="text-[10px] text-slate-500 block mt-1">
              Aggregate tally incremented on-chain
            </span>
          </div>
        </div>
      </div>

      {/* Live Terminal & Prover Console */}
      <div className="rounded-xl bg-midnight-950 border border-midnight-800 overflow-hidden">
        <div className="px-4 py-2.5 bg-midnight-900/90 border-b border-midnight-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">Midnight Prover Console Output</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLogs}
              className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Logs'}</span>
            </button>
          </div>
        </div>

        {/* Log stream */}
        <div className="p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5 scrollbar-thin">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2">
              <span className="text-slate-600 flex-shrink-0 select-none">[{log.timestamp}]</span>
              <span
                className={`font-semibold px-1 py-0.2 rounded text-[10px] flex-shrink-0 ${
                  log.stage === 'WITNESS'
                    ? 'text-amber-400 bg-amber-950/40'
                    : log.stage === 'CONSTRAINT'
                    ? 'text-cyan-400 bg-cyan-950/40'
                    : log.stage === 'PROVER'
                    ? 'text-purple-400 bg-purple-950/40'
                    : 'text-emerald-400 bg-emerald-950/40'
                }`}
              >
                {log.stage}
              </span>
              <span
                className={`${
                  log.type === 'zk'
                    ? 'text-cyan-200'
                    : log.type === 'success'
                    ? 'text-emerald-300 font-semibold'
                    : 'text-slate-300'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
