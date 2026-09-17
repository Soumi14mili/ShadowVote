import React, { useState } from 'react';
import { History, CheckCircle2, ShieldCheck, Copy, Check, ExternalLink, Hash, Clock } from 'lucide-react';
import type { ProvenTransaction } from '../types/midnight';
import { shortenAddress, formatTimestamp } from '../utils/formatters';

interface TransactionHistoryProps {
  transactions: ProvenTransaction[];
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl bg-midnight-900/90 border border-midnight-700/80 p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-midnight-800">
        <div className="flex items-center space-x-2.5">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-slate-100">Verified On-Chain Transactions (Preprod)</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {transactions.length} Verified Circuit Invocations
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-midnight-800 text-slate-400 pb-2">
              <th className="py-2.5 px-3">Circuit Called</th>
              <th className="py-2.5 px-3">Preprod Tx Hash</th>
              <th className="py-2.5 px-3">Block</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Privacy Guarantee</th>
              <th className="py-2.5 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-midnight-800/60 text-slate-300">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-midnight-850/50 transition-colors">
                <td className="py-3 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      tx.circuit === 'cast_vote'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                        : 'bg-purple-950 text-purple-300 border border-purple-800/60'
                    }`}
                  >
                    {tx.circuit}()
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-200">{shortenAddress(tx.txHash, 6)}</span>
                    <button
                      onClick={() => handleCopy(tx.id, tx.txHash)}
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                      title="Copy Transaction Hash"
                    >
                      {copiedId === tx.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://explorer.midnight.network/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-cyan-400 transition-colors"
                      title="View in Preprod Explorer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-400">#{tx.blockHeight}</td>
                <td className="py-3 px-3 text-slate-400">{formatTimestamp(tx.timestamp)}</td>
                <td className="py-3 px-3">
                  {tx.choiceMasked ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Ballot Concealed</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Public Admin</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmed</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
