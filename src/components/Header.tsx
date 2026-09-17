import React, { useState } from 'react';
import { Moon, Wallet, LogOut, ExternalLink, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import type { LaceWalletState } from '../types/midnight';
import { shortenAddress } from '../utils/formatters';

interface HeaderProps {
  wallet: LaceWalletState;
  isLaceAvailable: boolean;
  onConnect: (type?: 'lace' | 'simulator') => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  isLaceAvailable,
  onConnect,
  onDisconnect,
}) => {
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-midnight-700/60 bg-midnight-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand / Crescent Motif */}
        <div className="flex items-center space-x-3">
          <div className="relative group flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-amber-500/20 border border-cyan-500/30 shadow-crescent">
            <Moon className="w-6 h-6 text-cyan-400 group-hover:text-amber-400 transition-colors" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-200 to-amber-300">
                ShadowVote
              </span>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 tracking-wider">
                Crescent · Level 2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span>The first thread of light</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-400">Midnight Preprod</span>
            </p>
          </div>
        </div>

        {/* Right: Network Badge & Lace Wallet */}
        <div className="flex items-center space-x-3">
          {/* Preprod Network Pill */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-midnight-850 border border-midnight-700/80 text-xs font-mono text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Preprod Testnet</span>
          </div>

          {/* Lace Connect / Disconnect */}
          {wallet.isConnected ? (
            <div className="relative">
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-midnight-850 hover:bg-midnight-800 border border-cyan-500/40 hover:border-cyan-400/80 transition-all text-sm font-medium shadow-sm group"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                <span className="font-mono text-cyan-200 group-hover:text-cyan-100">
                  {shortenAddress(wallet.address, 5)}
                </span>
                <span className="hidden md:inline-block text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                  {wallet.balance}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition-transform" />
              </button>

              {/* Wallet Dropdown Menu */}
              {showWalletMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-midnight-900 border border-midnight-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-midnight-800">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-semibold text-slate-200">
                        {wallet.walletType === 'lace' ? 'Lace Wallet (Connected)' : 'Preprod Demo Wallet'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      Preprod
                    </span>
                  </div>

                  <div className="py-3 space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">Account Address</span>
                      <span className="text-xs font-mono text-slate-200 break-all bg-midnight-950/80 p-1.5 rounded block border border-midnight-800 mt-1">
                        {wallet.address}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block font-mono">Available Balance</span>
                      <span className="text-sm font-semibold text-cyan-300 font-mono">
                        {wallet.balance}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-midnight-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setShowWalletMenu(false);
                        onDisconnect();
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Lace</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onConnect('lace')}
                disabled={wallet.isConnecting}
                className="relative inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-amber-500 hover:from-cyan-500 hover:to-amber-400 text-midnight-950 font-semibold text-sm transition-all shadow-crescent hover:shadow-crescent-glow disabled:opacity-50"
              >
                <Wallet className="w-4 h-4 text-midnight-950" />
                <span>{wallet.isConnecting ? 'Connecting Lace...' : 'Connect Lace Wallet'}</span>
              </button>

              {!isLaceAvailable && (
                <button
                  onClick={() => onConnect('simulator')}
                  title="Connect Preprod Testnet Simulator (No extension required)"
                  className="hidden sm:inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-midnight-850 hover:bg-midnight-800 border border-midnight-700 text-xs text-slate-300 font-mono transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo Mode</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
