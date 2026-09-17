import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, Database, Cpu, Wifi, Globe, RefreshCw } from 'lucide-react';

export const NetworkRadar: React.FC = () => {
  const [blockHeight, setBlockHeight] = useState(1421089);
  const [lastBlockTime, setLastBlockTime] = useState(3);
  const [tps, setTps] = useState(84.2);
  const [shieldedRatio, setShieldedRatio] = useState(94.8);

  useEffect(() => {
    // Ticker for block height every 6 seconds
    const interval = setInterval(() => {
      setBlockHeight((prev) => prev + 1);
      setLastBlockTime(0);
      setTps(+(80 + Math.random() * 8).toFixed(1));
      setShieldedRatio(+(94 + Math.random() * 1.5).toFixed(1));
    }, 6000);

    // Sub-second timer for block seconds
    const secTimer = setInterval(() => {
      setLastBlockTime((prev) => (prev < 6 ? prev + 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(secTimer);
    };
  }, []);

  return (
    <div className="rounded-2xl bg-midnight-900/80 border border-cyan-500/20 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Background ambient radar sweep effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-midnight-800 gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
            <span>Midnight Preprod Node Telemetry</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono">
              OPERATIONAL
            </span>
          </h3>
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center space-x-1">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <span>18ms Ping</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center space-x-1">
            <Globe className="w-3 h-3 text-purple-400" />
            <span>Epoch 42</span>
          </span>
        </div>
      </div>

      {/* Grid of live stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-midnight-950/80 border border-midnight-800 hover:border-cyan-500/30 transition-all">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Block Height</span>
            <Database className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-base font-bold text-cyan-300 mt-1">
            #{blockHeight.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Updated {lastBlockTime}s ago (avg 6.0s)
          </div>
        </div>

        <div className="p-3 rounded-xl bg-midnight-950/80 border border-midnight-800 hover:border-purple-500/30 transition-all">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Shielded Ratio</span>
            <ShieldCheck className="w-3 h-3 text-purple-400" />
          </div>
          <div className="text-base font-bold text-purple-300 mt-1">
            {shieldedRatio}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Zero-knowledge state diffs
          </div>
        </div>

        <div className="p-3 rounded-xl bg-midnight-950/80 border border-midnight-800 hover:border-emerald-500/30 transition-all">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Throughput</span>
            <Zap className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-base font-bold text-emerald-300 mt-1">
            {tps} TPS
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Preprod network capacity
          </div>
        </div>

        <div className="p-3 rounded-xl bg-midnight-950/80 border border-midnight-800 hover:border-amber-500/30 transition-all">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Avg Shielded Fee</span>
            <Cpu className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-base font-bold text-amber-300 mt-1">
            0.00042 tDUST
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Dual-token shielded gas
          </div>
        </div>
      </div>
    </div>
  );
};
