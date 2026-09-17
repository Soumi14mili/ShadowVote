import React, { useState } from 'react';
import { GitCommit, ShieldCheck, Key, RefreshCw, CheckCircle2, ArrowRight, Lock, Sparkles, Layers } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const MerkleTreeVisualizer: React.FC = () => {
  const [selectedLeafIndex, setSelectedLeafIndex] = useState<number>(2);
  const [voterCommitment, setVoterCommitment] = useState<string>('0x9a8f2c...4d1e');
  const [nullifierHash, setNullifierHash] = useState<string>('0x3b7e19...8c2f');

  // 8 Leaf hashes
  const leaves = [
    '0x1a4f...e2b1',
    '0x7c9d...3f0a',
    '0x9a8f...4d1e', // Selected leaf
    '0x2e1b...9a4c',
    '0x5d3a...8e7f',
    '0x8c2e...1b9d',
    '0x4f7b...2a3c',
    '0x6e9a...5d1f',
  ];

  const handleSelectLeaf = (idx: number) => {
    soundFx.playSelect();
    setSelectedLeafIndex(idx);
    setVoterCommitment(leaves[idx]);
  };

  const handleGenerateNewSecret = () => {
    soundFx.playSuccess();
    const chars = '0123456789abcdef';
    let rand = '0x';
    for (let i = 0; i < 6; i++) rand += chars[Math.floor(Math.random() * chars.length)];
    rand += '...';
    for (let i = 0; i < 4; i++) rand += chars[Math.floor(Math.random() * chars.length)];
    setVoterCommitment(rand);
    setNullifierHash(`0x${chars[Math.floor(Math.random() * chars.length)]}${rand.slice(2, 6)}...null`);
  };

  // Sibling indices for binary tree of 8 leaves
  const siblingIndex = selectedLeafIndex % 2 === 0 ? selectedLeafIndex + 1 : selectedLeafIndex - 1;
  const parentIndex = Math.floor(selectedLeafIndex / 2);
  const uncleIndex = parentIndex % 2 === 0 ? parentIndex + 1 : parentIndex - 1;

  return (
    <div className="rounded-2xl bg-midnight-900/90 border border-midnight-700/80 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-midnight-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <Layers className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Interactive Merkle Allowlist & Witness Path</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 font-semibold">
                Private Membership Proof
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Prove that you are an eligible voter without disclosing your identity or which allowlist leaf belongs to you.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateNewSecret}
          className="px-3 py-1.5 rounded-xl bg-midnight-950 hover:bg-midnight-850 border border-purple-500/40 text-purple-300 text-xs font-mono transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Voter Secret</span>
        </button>
      </div>

      {/* Merkle Tree Diagram */}
      <div className="p-6 rounded-2xl bg-midnight-950/90 border border-midnight-800 space-y-6 overflow-x-auto">
        {/* Level 3: Merkle Root */}
        <div className="flex justify-center">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-950 via-purple-950 to-amber-950 border border-cyan-400 text-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <span className="text-[10px] font-mono text-cyan-300 block uppercase font-bold">On-Chain Governance Merkle Root</span>
            <span className="text-xs font-mono text-slate-100 font-extrabold">0x94f8e32a...7c1b</span>
          </div>
        </div>

        {/* Connectors to Root */}
        <div className="flex justify-around px-24 text-slate-600 text-xs font-mono">
          <span>/</span>
          <span>\</span>
        </div>

        {/* Level 2: Intermediate Hashes */}
        <div className="flex justify-around gap-4 text-xs font-mono">
          <div className="px-4 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-center">
            <span className="text-[10px] text-slate-500 block">Sub-Tree Hash (H0-3)</span>
            <span className="text-slate-300 text-[11px]">0x5c8e...a1b2</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-midnight-900 border border-midnight-700 text-center">
            <span className="text-[10px] text-slate-500 block">Sub-Tree Hash (H4-7)</span>
            <span className="text-slate-300 text-[11px]">0x3f1a...9e8c</span>
          </div>
        </div>

        {/* Connectors to Leaves */}
        <div className="text-center text-slate-600 text-xs">
          <span>↓ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ↓</span>
        </div>

        {/* Level 1: 8 Allowlist Voter Leaves */}
        <div>
          <span className="text-xs font-mono text-slate-400 block mb-2 font-semibold">
            Eligible Voter Leaves (Click to select your anonymous commitment):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {leaves.map((leaf, idx) => {
              const isSelected = idx === selectedLeafIndex;
              const isSibling = idx === siblingIndex;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectLeaf(idx)}
                  className={`p-2.5 rounded-xl border text-center transition-all text-xs font-mono ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                      : isSibling
                      ? 'bg-amber-950/30 border-amber-500/60 text-amber-300'
                      : 'bg-midnight-900 border-midnight-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-[10px] block opacity-70">
                    {isSelected ? '★ YOUR LEAF' : isSibling ? 'SIBLING HASH' : `VOTER #${idx}`}
                  </span>
                  <span className="font-bold text-[11px] truncate block">{leaf}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Generated Witness Path Card */}
      <div className="p-4 rounded-xl bg-midnight-950 border border-midnight-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generated Merkle Witness Authentication Path:</span>
          </span>
          <span className="text-emerald-400 font-semibold">ZK-SNARK Invariant: Satisfied</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-midnight-900 border border-midnight-800">
            <span className="text-[10px] text-slate-500 block uppercase">Path Depth 1</span>
            <span className="text-cyan-300 font-semibold truncate block">{leaves[siblingIndex]}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-midnight-900 border border-midnight-800">
            <span className="text-[10px] text-slate-500 block uppercase">Path Depth 2</span>
            <span className="text-amber-300 font-semibold truncate block">0x3f1a...9e8c</span>
          </div>
          <div className="p-2.5 rounded-lg bg-midnight-900 border border-midnight-800">
            <span className="text-[10px] text-slate-500 block uppercase">Target Root Match</span>
            <span className="text-emerald-400 font-semibold truncate block">MATCHES ON-CHAIN ROOT</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-midnight-800/80 leading-relaxed">
          💡 <strong>Zero-Knowledge Allowlist Guarantee:</strong> The voter demonstrates knowledge of a valid path from an undisclosed leaf to the root. The validator verifies membership without learning <em>which</em> of the 8 leaves was used.
        </p>
      </div>
    </div>
  );
};
