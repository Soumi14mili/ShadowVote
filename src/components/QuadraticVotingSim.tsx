import React, { useState } from 'react';
import { Calculator, ShieldAlert, Sparkles, Scale, Info, CheckCircle2, TrendingUp } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const QuadraticVotingSim: React.FC = () => {
  const [whaleCredits, setWhaleCredits] = useState<number>(100);
  const [communityVoters, setCommunityVoters] = useState<number>(10);
  const [creditsPerVoter, setCreditsPerVoter] = useState<number>(10);

  // In 1-token-1-vote (Linear):
  const whaleLinearVotes = whaleCredits;
  const communityLinearVotes = communityVoters * creditsPerVoter;

  // In Quadratic Voting (Votes = sqrt(Credits)):
  const whaleQuadraticVotes = Math.floor(Math.sqrt(whaleCredits));
  const communityQuadraticVotes = communityVoters * Math.floor(Math.sqrt(creditsPerVoter));

  return (
    <div className="rounded-2xl bg-midnight-900/90 border border-midnight-700/80 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-midnight-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Anti-Whale Quadratic Voting Simulator</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-semibold">
                Level 4 Preview
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Explore how Midnight Zero-Knowledge quadratic voting empowers grassroots consensus over plutocratic governance whales.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Formula: Votes = ⌊√Credits⌋</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Whale slider */}
        <div className="p-4 rounded-xl bg-midnight-950 border border-rose-500/30 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Whale Voice Credits</span>
            </span>
            <span className="text-rose-300 font-extrabold text-sm">{whaleCredits} tDUST</span>
          </div>
          <input
            type="range"
            min="10"
            max="400"
            step="10"
            value={whaleCredits}
            onChange={(e) => {
              soundFx.playClick();
              setWhaleCredits(Number(e.target.value));
            }}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10 credits</span>
            <span>400 credits</span>
          </div>
        </div>

        {/* Community voter count */}
        <div className="p-4 rounded-xl bg-midnight-950 border border-cyan-500/30 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyan-400 font-bold">Community Members</span>
            <span className="text-cyan-300 font-extrabold text-sm">{communityVoters} Voters</span>
          </div>
          <input
            type="range"
            min="2"
            max="30"
            step="1"
            value={communityVoters}
            onChange={(e) => {
              soundFx.playClick();
              setCommunityVoters(Number(e.target.value));
            }}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>2 voters</span>
            <span>30 voters</span>
          </div>
        </div>

        {/* Credits per community member */}
        <div className="p-4 rounded-xl bg-midnight-950 border border-emerald-500/30 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-emerald-400 font-bold">Credits per Member</span>
            <span className="text-emerald-300 font-extrabold text-sm">{creditsPerVoter} tDUST</span>
          </div>
          <input
            type="range"
            min="4"
            max="25"
            step="1"
            value={creditsPerVoter}
            onChange={(e) => {
              soundFx.playClick();
              setCreditsPerVoter(Number(e.target.value));
            }}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>4 credits</span>
            <span>25 credits</span>
          </div>
        </div>
      </div>

      {/* Comparison Battlefield */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Linear System */}
        <div className="p-4 rounded-2xl bg-midnight-950 border border-midnight-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400 uppercase">Traditional 1-Token-1-Vote</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40">
              Whale-Dominated
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-rose-400">1 Whale ({whaleCredits} tokens)</span>
                <span className="text-slate-200 font-bold">{whaleLinearVotes} votes</span>
              </div>
              <div className="h-2 rounded-full bg-midnight-850 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{
                    width: `${(whaleLinearVotes / (whaleLinearVotes + communityLinearVotes || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-cyan-400">{communityVoters} Community ({communityLinearVotes} tokens)</span>
                <span className="text-slate-200 font-bold">{communityLinearVotes} votes</span>
              </div>
              <div className="h-2 rounded-full bg-midnight-850 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{
                    width: `${(communityLinearVotes / (whaleLinearVotes + communityLinearVotes || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-1">
            Result:{' '}
            <span className={whaleLinearVotes > communityLinearVotes ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
              {whaleLinearVotes > communityLinearVotes ? 'Whale dictates outcome single-handedly.' : 'Community overcomes whale.'}
            </span>
          </div>
        </div>

        {/* Quadratic System with Midnight Privacy */}
        <div className="p-4 rounded-2xl bg-midnight-950 border border-amber-500/40 space-y-3 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-amber-300 font-bold uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Midnight Shielded Quadratic Voting</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-bold">
              Grassroots Fair
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-rose-400">1 Whale (√{whaleCredits})</span>
                <span className="text-slate-200 font-bold">{whaleQuadraticVotes} effective votes</span>
              </div>
              <div className="h-2 rounded-full bg-midnight-850 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{
                    width: `${(whaleQuadraticVotes / (whaleQuadraticVotes + communityQuadraticVotes || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400">{communityVoters} Community ({communityVoters} × √{creditsPerVoter})</span>
                <span className="text-slate-200 font-bold">{communityQuadraticVotes} effective votes</span>
              </div>
              <div className="h-2 rounded-full bg-midnight-850 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{
                    width: `${(communityQuadraticVotes / (whaleQuadraticVotes + communityQuadraticVotes || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-300 pt-1 flex items-center justify-between">
            <span>Result:</span>
            <span className={communityQuadraticVotes >= whaleQuadraticVotes ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {communityQuadraticVotes >= whaleQuadraticVotes
                ? 'Community voice prevails by ' + (communityQuadraticVotes - whaleQuadraticVotes) + ' votes!'
                : 'Whale holds ' + (whaleQuadraticVotes - communityQuadraticVotes) + ' vote advantage.'}
            </span>
          </div>
        </div>
      </div>

      {/* Why Midnight is Crucial for Quadratic Voting */}
      <div className="p-4 rounded-xl bg-midnight-950/60 border border-midnight-800 flex items-start space-x-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans">
          <strong className="text-cyan-300 font-mono font-semibold">Why Zero-Knowledge is mandatory:</strong> On transparent blockchains, Quadratic Voting fails because users can split funds across Sybil addresses ($100 = 10 \times 10$ tokens yields $10 \times 3.16 = 31.6$ votes instead of $10$). Midnight’s shielded identity layer verifies unique Merkle allowlist credentials in zero-knowledge without revealing voter identities or balances.
        </p>
      </div>
    </div>
  );
};
