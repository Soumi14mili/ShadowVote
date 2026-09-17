import React, { useState } from 'react';
import { Vote, Shield, CheckCircle2, Clock, Users, ArrowUpRight, Flame, Layers, Sparkles, Filter } from 'lucide-react';
import type { GovernanceProposal } from '../types/midnight';
import { soundFx } from '../utils/audio';

interface ProposalSelectorProps {
  proposals: GovernanceProposal[];
  selectedProposalId: string;
  onSelectProposal: (proposalId: string) => void;
}

export const ProposalSelector: React.FC<ProposalSelectorProps> = ({
  proposals,
  selectedProposalId,
  onSelectProposal,
}) => {
  const [filter, setFilter] = useState<string>('All');

  const filteredProposals = proposals.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'Active') return p.status === 'active';
    if (filter === 'Passed') return p.status === 'passed';
    return p.category === filter;
  });

  const handleSelect = (id: string) => {
    soundFx.playClick();
    onSelectProposal(id);
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Vote className="w-5 h-5 text-cyan-400" />
            <span>Midnight Governance Hub</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              {proposals.length} Proposals
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select an active Midnight Improvement Proposal (MIP) to cast your shielded zero-knowledge vote.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-midnight-900 border border-midnight-800">
          {['All', 'Active', 'Core Protocol', 'Treasury', 'Security'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setFilter(cat);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                filter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProposals.map((prop) => {
          const isSelected = prop.id === selectedProposalId;
          const quorumPercent = Math.min(100, Math.round((prop.totalVotes / prop.quorumTarget) * 100));
          const yesPercent = prop.totalVotes > 0 ? Math.round((prop.yesVotes / prop.totalVotes) * 100) : 0;
          const noPercent = prop.totalVotes > 0 ? Math.round((prop.noVotes / prop.totalVotes) * 100) : 0;

          return (
            <div
              key={prop.id}
              onClick={() => handleSelect(prop.id)}
              className={`relative cursor-pointer rounded-2xl p-5 border transition-all duration-200 overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-br from-midnight-900 via-midnight-850 to-midnight-900 border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                  : 'bg-midnight-900/80 hover:bg-midnight-850/90 border-midnight-700/70 hover:border-slate-500'
              }`}
            >
              {/* Selected Glow Accent */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
              )}

              {/* Badges row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-midnight-950 text-amber-300 border border-amber-500/30">
                    {prop.mipNumber}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-midnight-950 text-slate-300 border border-midnight-800">
                    {prop.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {prop.status === 'active' ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Passed</span>
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{prop.endsIn}</span>
                  </span>
                </div>
              </div>

              {/* Title & Summary */}
              <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-200 transition-colors mb-1.5 line-clamp-1">
                {prop.title}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {prop.summary}
              </p>

              {/* Progress & Quorum */}
              <div className="space-y-2 pt-3 border-t border-midnight-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">
                    Quorum: <strong className="text-slate-200">{prop.totalVotes}</strong> / {prop.quorumTarget}
                  </span>
                  <span className="text-cyan-400 font-bold">{quorumPercent}%</span>
                </div>

                {/* Quorum Bar */}
                <div className="h-2 w-full rounded-full bg-midnight-950 overflow-hidden flex border border-midnight-800">
                  <div
                    style={{ width: `${yesPercent}%` }}
                    className="bg-emerald-400 transition-all duration-300"
                    title={`YES: ${yesPercent}%`}
                  />
                  <div
                    style={{ width: `${noPercent}%` }}
                    className="bg-rose-400 transition-all duration-300"
                    title={`NO: ${noPercent}%`}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="text-emerald-400 font-medium">YES: {yesPercent}% ({prop.yesVotes})</span>
                  <span className="text-rose-400 font-medium">NO: {noPercent}% ({prop.noVotes})</span>
                </div>
              </div>

              {/* Select Indicator */}
              <div className="mt-3 pt-2 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500">Author: {prop.author}</span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    isSelected ? 'text-cyan-300 font-bold' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                >
                  <span>{isSelected ? 'Currently Voting' : 'Select Proposal'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
