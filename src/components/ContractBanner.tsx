import React, { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Box,
  Code2,
  Cpu,
  Edit3,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { PREPROD_CONTRACT_ADDRESS } from '../hooks/useShadowVote';
import { validateContractAddress, AddressValidationResult } from '../utils/formatters';

interface ContractBannerProps {
  contractAddress?: string;
  onUpdateContractAddress?: (address: string) => void;
  onResetContractAddress?: () => void;
}

export const ContractBanner: React.FC<ContractBannerProps> = ({
  contractAddress = PREPROD_CONTRACT_ADDRESS,
  onUpdateContractAddress,
  onResetContractAddress,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputAddress, setInputAddress] = useState(contractAddress);
  const [showFormatsInfo, setShowFormatsInfo] = useState(false);

  const validationResult: AddressValidationResult = validateContractAddress(contractAddress);
  const inputValidation: AddressValidationResult = validateContractAddress(inputAddress);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValidation.isValid && onUpdateContractAddress) {
      onUpdateContractAddress(inputAddress.trim());
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    if (onResetContractAddress) {
      onResetContractAddress();
    }
    setInputAddress(PREPROD_CONTRACT_ADDRESS);
    setIsEditing(false);
  };

  const explorerLink = validationResult.explorerUrl || `https://explorer.midnight.network/contract/${contractAddress}`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-midnight-900 via-midnight-850 to-midnight-900 border ${
        validationResult.isValid ? 'border-cyan-500/30' : 'border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
      } p-5 sm:p-6 shadow-xl mb-8 space-y-4`}
    >
      {/* Background glow elements */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Contract Information */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {validationResult.isValid ? (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Preprod Contract Address</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Invalid Contract Address Format</span>
              </span>
            )}

            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Midnight Preprod</span>
            </span>

            {validationResult.format !== 'invalid' && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-mono">
                <Box className="w-3 h-3" />
                <span>Format: {validationResult.format.toUpperCase()}</span>
              </span>
            )}

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
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-slate-400">
                Active Smart Contract Address:
              </span>
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <button
                  onClick={() => setShowFormatsInfo(!showFormatsInfo)}
                  className="text-slate-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Valid Formats</span>
                </button>
                <button
                  onClick={() => {
                    setInputAddress(contractAddress);
                    setIsEditing(!isEditing);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit / Switch'}</span>
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveAddress} className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    placeholder="Enter 64-char hex, 0x..., 0200... or Bech32 contract address..."
                    className={`flex-1 px-3 py-1.5 rounded-lg bg-midnight-950 border font-mono text-xs text-slate-100 focus:outline-none ${
                      inputValidation.isValid
                        ? 'border-emerald-500/60 focus:border-emerald-400'
                        : 'border-rose-500/60 focus:border-rose-400'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!inputValidation.isValid}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg bg-midnight-800 hover:bg-midnight-750 border border-midnight-700 text-slate-300 text-xs font-mono flex items-center space-x-1 transition-colors"
                    title="Restore Deployed Default Address"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset</span>
                  </button>
                </div>

                {!inputValidation.isValid && (
                  <p className="text-[11px] font-mono text-rose-400">
                    ⚠️ {inputValidation.errorMessage}
                  </p>
                )}
              </form>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <code
                  className={`text-xs sm:text-sm font-mono font-semibold px-3 py-1.5 rounded-lg border break-all select-all ${
                    validationResult.isValid
                      ? 'text-slate-100 bg-midnight-950/90 border-midnight-700/80'
                      : 'text-rose-200 bg-rose-950/40 border-rose-500/50'
                  }`}
                >
                  {contractAddress}
                </code>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handleCopy}
                    title="Copy Contract Address"
                    className="p-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 border border-midnight-600 text-slate-300 hover:text-cyan-300 transition-colors flex-shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {validationResult.isValid && (
                    <a
                      href={explorerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on Midnight Preprod Explorer"
                      className="p-2 rounded-lg bg-midnight-800 hover:bg-midnight-700 border border-midnight-600 text-slate-300 hover:text-cyan-300 transition-colors flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {contractAddress !== PREPROD_CONTRACT_ADDRESS && (
                    <button
                      onClick={handleReset}
                      title="Restore Default Level 1 Deployed Contract Address"
                      className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-colors flex-shrink-0 flex items-center space-x-1 text-xs font-mono"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset Default</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Compiled Circuits Summary */}
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

      {/* Invalid Address Alert Notification */}
      {!validationResult.isValid && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between font-bold text-rose-300">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>CONTRACT ADDRESS VALIDATION ERROR</span>
            </span>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-100 text-[11px] transition-colors border border-rose-400/40"
            >
              Restore Deployed Address
            </button>
          </div>
          <p className="text-[11px] leading-relaxed">
            {validationResult.errorMessage}
          </p>
        </div>
      )}

      {/* Accepted Contract Formats Information Box */}
      {showFormatsInfo && (
        <div className="p-4 rounded-xl bg-midnight-950 border border-midnight-700 text-xs font-mono space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-midnight-800 pb-2">
            <span>Midnight Network Contract Address Formats</span>
            <button
              onClick={() => setShowFormatsInfo(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              Close
            </button>
          </div>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">1. 64-char Hex (Compact Runtime):</span>
              <code className="text-slate-200 bg-midnight-900 px-1 rounded">72eaeadba57dc76079ae2b8329e59243ed27b6d49dafec6f20eb97f4262d73f9</code>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-purple-400 font-bold">2. 0x-prefixed Hex:</span>
              <code className="text-slate-200 bg-midnight-900 px-1 rounded">0x72eaeadba57dc76079ae2b8329e59243ed27b6d49dafec6f20eb97f4262d73f9</code>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-amber-400 font-bold">3. 0200 Tagged Contract:</span>
              <code className="text-slate-200 bg-midnight-900 px-1 rounded">020072eaeadba57dc76079ae2b8329e59243ed27b6d49dafec6f20eb97f4262d73f9</code>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-emerald-400 font-bold">4. Bech32 Format:</span>
              <code className="text-slate-200 bg-midnight-900 px-1 rounded">midnight1... / contract1... / addr_preprod1...</code>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
