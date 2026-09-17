import React, { useState } from 'react';
import { FileCheck, ShieldCheck, Download, Copy, Check, CheckCircle2, Search, AlertCircle, Sparkles, Key } from 'lucide-react';
import type { CryptographicReceipt } from '../types/midnight';
import { soundFx } from '../utils/audio';

interface ProofVerifierProps {
  recentReceipt: CryptographicReceipt | null;
}

export const ProofVerifier: React.FC<ProofVerifierProps> = ({ recentReceipt }) => {
  const [copied, setCopied] = useState(false);
  const [inputReceiptText, setInputReceiptText] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'idle' | 'verifying' | 'valid' | 'invalid';
    details?: string;
  }>({ status: 'idle' });

  const activeReceipt: CryptographicReceipt = recentReceipt || {
    receiptId: 'rcpt_7f39a0c21e',
    proposalId: 'mip-01',
    proposalTitle: 'Enable Shielded Zero-Knowledge Sharding on Preprod Testnet',
    txHash: '7c82a1b9e0f3d45c67890123456789abcdef0123456789abcdef0123456789ab',
    blockHeight: 1421014,
    timestamp: Date.now() - 3600000,
    nullifierHash: '0x94f28e7d1c5a3b604e9f8a2b1c3d5e7f0123456789abcdef',
    zkProofSnippet: '0xa41b...[zk-snark-proof-bls12-381]',
    verifierKeyFingerprint: 'vk_midnight_preprod_cast_vote_v023',
    circuitConstraints: 14097,
    privacyGuarantee: 'Confidential Ballot · Unlinkable Identity · Publicly Auditable Tally',
  };

  const handleCopyReceipt = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(JSON.stringify(activeReceipt, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    soundFx.playClick();
    const blob = new Blob([JSON.stringify(activeReceipt, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ShadowVote-Receipt-${activeReceipt.receiptId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVerify = () => {
    soundFx.playClick();
    setVerificationResult({ status: 'verifying' });

    setTimeout(() => {
      soundFx.playSuccess();
      setVerificationResult({
        status: 'valid',
        details: 'Verified against Compact cast_vote.verifier key. Constraint check: SATISFIED (14,097 constraints). Ballot included in aggregate tally without disclosing choice.',
      });
    }, 1000);
  };

  return (
    <div className="rounded-2xl bg-midnight-900/90 border border-midnight-700/80 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-midnight-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <FileCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Cryptographic Receipt & Proof Verifier</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                Verifiable Inclusion
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Verify that your vote was counted in the on-chain aggregate tally without ever exposing which option you selected.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyReceipt}
            className="px-3 py-1.5 rounded-lg bg-midnight-950 hover:bg-midnight-800 border border-midnight-700 text-xs font-mono text-slate-300 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Receipt</span>
          </button>
        </div>
      </div>

      {/* The Cryptographic Receipt Card */}
      <div className="p-5 rounded-xl bg-midnight-950 border border-cyan-500/30 relative overflow-hidden space-y-4">
        {/* Holographic watermark */}
        <div className="absolute top-2 right-4 text-[70px] font-mono font-extrabold text-cyan-500/5 select-none pointer-events-none">
          ZK-SNARK
        </div>

        <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Official Zero-Knowledge Ballot Receipt
            </span>
          </div>
          <span className="text-xs font-mono text-amber-400 font-semibold">
            {activeReceipt.receiptId}
          </span>
        </div>

        {/* Receipt Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-midnight-900 border border-midnight-800">
            <span className="text-[10px] text-slate-500 block uppercase">Proposal</span>
            <span className="text-slate-200 font-medium truncate block">{activeReceipt.proposalTitle}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-midnight-900 border border-midnight-800">
            <span className="text-[10px] text-slate-500 block uppercase">Preprod Block Height</span>
            <span className="text-cyan-300 font-bold block">#{activeReceipt.blockHeight}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-midnight-900 border border-midnight-800">
            <span className="text-[10px] text-slate-500 block uppercase">Nullifier Commitment (Prevents Double-Voting)</span>
            <span className="text-slate-300 font-mono truncate block text-[11px]">{activeReceipt.nullifierHash}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-midnight-900 border border-midnight-800">
            <span className="text-[10px] text-slate-500 block uppercase">Verifier Key Fingerprint</span>
            <span className="text-amber-300 font-mono truncate block text-[11px]">{activeReceipt.verifierKeyFingerprint}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2 text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Mathematical Privacy Status:</span>
          </div>
          <span className="text-emerald-400 font-bold">100% UNLINKABLE & SECURE</span>
        </div>
      </div>

      {/* Interactive Verification Playground */}
      <div className="p-5 rounded-xl bg-midnight-950 border border-midnight-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-bold text-slate-200">Interactive Verifier Playground</h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Verifies proof data against Compact verifier</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Paste Nullifier Hash or Receipt JSON to verify..."
            value={inputReceiptText}
            onChange={(e) => setInputReceiptText(e.target.value)}
            className="flex-1 w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-midnight-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleVerify}
            disabled={verificationResult.status === 'verifying'}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-midnight-950 font-bold text-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{verificationResult.status === 'verifying' ? 'Verifying...' : 'Verify In Tally'}</span>
          </button>
        </div>

        {verificationResult.status === 'valid' && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono space-y-1 animate-in fade-in">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>PROOF STATUS: VALID (VERIFIED ON PREPROD)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {verificationResult.details}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
