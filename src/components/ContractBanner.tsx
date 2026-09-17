import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Box, Code2, Cpu } from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS } from '../hooks/useShadowVote';
import { shortenAddress } from '../utils/formatters';

export const ContractBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PREPROD_CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-midnight-900 via-midnight-850 to-midnight-900 border border-cyan-500/25 p-5 sm:p-6 shadow-xl mb-8">
      {/* Glow decorative element */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Contract Information */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Deployed on Midnight Preprod</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono">
              <Box className="w-3 h-3" />
              <span>Verifiable Address</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
              <Code2 className="w-3 h-3" />
              <span>Compact 0.23</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
              <Cpu className="w-3 h-3" />
              <span>Runtime 0.16.0</span>
            </span>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1">
              Preprod Smart Contract Address:
            </span>
            <div className="flex items-center space-x-2">
              <code className="text-sm sm:text-base font-mono font-semibold text-slate-100 bg-midnight-950/80 px-3 py-1.5 rounded-lg border border-midnight-700/80 break-all select-all">
                {PREPROD_CONTRACT_ADDRESS}
              </code>
              <button
                onClick={handleCopy}
                title="Copy Address"
                className="p-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 border border-midnight-600 text-slate-300 hover:text-cyan-300 transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`https://explorer.midnight.network/contract/${PREPROD_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Midnight Preprod Explorer"
                className="p-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 border border-midnight-600 text-slate-300 hover:text-cyan-300 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Circuits Summary */}
        <div className="flex items-center lg:justify-end gap-3 lg:border-l lg:border-midnight-700/80 lg:pl-6 pt-2 lg:pt-0">
          <div className="text-left">
            <span className="text-xs text-slate-400 font-mono block">Compiled Circuits</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-midnight-950 border border-midnight-700 text-slate-200">
                initialize()
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-midnight-950 border border-cyan-500/40 text-cyan-300">
                cast_vote()
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-midnight-950 border border-midnight-700 text-slate-200">
                close_election()
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
