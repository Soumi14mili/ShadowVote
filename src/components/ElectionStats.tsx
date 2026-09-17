import React from 'react';
import { Users, ThumbsUp, ThumbsDown, Activity, CheckCircle2, XCircle } from 'lucide-react';
import type { ContractLedgerState } from '../types/midnight';
import { formatBigInt } from '../utils/formatters';

interface ElectionStatsProps {
  ledgerState: ContractLedgerState;
}

export const ElectionStats: React.FC<ElectionStatsProps> = ({ ledgerState }) => {
  const total = Number(ledgerState.total_voters);
  const yes = Number(ledgerState.yes_votes);
  const no = Number(ledgerState.no_votes);

  const yesPercent = total > 0 ? Math.round((yes / total) * 100) : 0;
  const noPercent = total > 0 ? Math.round((no / total) * 100) : 0;

  return (
    <div className="space-y-4 mb-8">
      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Card */}
        <div className="rounded-xl bg-midnight-900/90 border border-midnight-700/80 p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Election Status</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-center space-x-2">
            {ledgerState.is_open ? (
              <>
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
                <span className="text-xl font-extrabold text-emerald-300">OPEN / ACTIVE</span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
                <span className="text-xl font-extrabold text-rose-300">CLOSED</span>
              </>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">
            Accepting Zero-Knowledge Proofs
          </span>
        </div>

        {/* Total Ballots Cast */}
        <div className="rounded-xl bg-midnight-900/90 border border-midnight-700/80 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">Total Ballots Cast</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-slate-100">
              {formatBigInt(ledgerState.total_voters)}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">
            Public On-Chain Ledger Counter
          </span>
        </div>

        {/* YES Votes */}
        <div className="rounded-xl bg-midnight-900/90 border border-emerald-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>YES Tallies</span>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">{yesPercent}%</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-emerald-300">
              {formatBigInt(ledgerState.yes_votes)}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">
            Verified Boolean = true
          </span>
        </div>

        {/* NO Votes */}
        <div className="rounded-xl bg-midnight-900/90 border border-rose-500/20 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-rose-400 font-semibold flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>NO Tallies</span>
            </span>
            <span className="text-xs font-mono text-rose-400 font-bold">{noPercent}%</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold font-mono text-rose-300">
              {formatBigInt(ledgerState.no_votes)}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 mt-1 block">
            Verified Boolean = false
          </span>
        </div>
      </div>

      {/* Visual Percentage Progress Bar */}
      <div className="p-4 rounded-xl bg-midnight-900/60 border border-midnight-700/60">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>YES: {yes} ({yesPercent}%)</span>
          </span>
          <span className="text-slate-500">Aggregate Distribution</span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span>NO: {no} ({noPercent}%)</span>
            <ThumbsDown className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-midnight-950 overflow-hidden flex border border-midnight-700/60">
          <div
            style={{ width: `${yesPercent}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 shadow-[0_0_12px_#10b981]"
          />
          <div
            style={{ width: `${noPercent}%` }}
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500 shadow-[0_0_12px_#f43f5e]"
          />
        </div>
      </div>
    </div>
  );
};
