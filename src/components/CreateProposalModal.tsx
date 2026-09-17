import React, { useState } from 'react';
import { PlusCircle, X, Shield, Sparkles, Check, Send } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proposal: {
    title: string;
    category: 'Protocol' | 'Treasury' | 'Privacy' | 'Governance';
    description: string;
    quorumThreshold: number;
    options: string[];
  }) => void;
}

export const CreateProposalModal: React.FC<CreateProposalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Protocol' | 'Treasury' | 'Privacy' | 'Governance'>('Privacy');
  const [description, setDescription] = useState('');
  const [quorumThreshold, setQuorumThreshold] = useState(25);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    soundFx.playSuccess();
    setSubmitted(true);

    setTimeout(() => {
      onSubmit({
        title,
        category,
        description: description || 'Proposed by sovereign Midnight community member.',
        quorumThreshold,
        options: ['Yes / Support', 'No / Oppose', 'Abstain'],
      });
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-midnight-900 border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-midnight-800 hover:bg-midnight-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 pb-3 border-b border-midnight-800">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Draft Midnight Improvement Proposal</h3>
            <p className="text-xs text-slate-400">Deploy a shielded governance referendum to the Preprod network</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-100">Proposal Registered On-Chain!</h4>
            <p className="text-xs font-mono text-cyan-300">Contract address synchronized with Preprod testnet.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Proposal Title</label>
              <input
                type="text"
                required
                placeholder="e.g. MIP-05: Enable Confidential Quadratic Funding for ZK Grants"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-midnight-700 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-midnight-700 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs"
                >
                  <option value="Privacy">Privacy</option>
                  <option value="Protocol">Protocol</option>
                  <option value="Treasury">Treasury</option>
                  <option value="Governance">Governance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Required Quorum (Votes)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={quorumThreshold}
                  onChange={(e) => setQuorumThreshold(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-midnight-700 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Executive Summary / Rationale</label>
              <textarea
                rows={3}
                placeholder="Describe the governance impact and cryptographic privacy parameters..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-midnight-950 border border-midnight-700 text-slate-200 focus:outline-none focus:border-cyan-400 text-xs resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center space-x-2 text-purple-300 text-[11px]">
              <Shield className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Ballots cast on this proposal will be shielded using Midnight BLS12-381 proofs.</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-midnight-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold hover:from-cyan-400 hover:to-purple-400 transition-all flex items-center space-x-1.5 shadow-crescent"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Preprod</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
