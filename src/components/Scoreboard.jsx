import React from 'react';
import { X, Trophy, Clock, Activity, ArrowLeftRight } from 'lucide-react';

const Scoreboard = ({ results, onClose }) => {
  if (!results || results.length === 0) return null;

  // Sort by time for ranking
  const sortedByTime = [...results].sort((a, b) => a.time - b.time);
  const maxTime = Math.max(...results.map(r => r.time), 1);
  
  const getMedalColor = (rank) => {
    if (rank === 1) return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]';
    if (rank === 2) return 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]';
    if (rank === 3) return 'text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.4)]';
    return 'text-slate-500';
  };

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const remainMs = Math.floor((ms % 1000) / 10);
    return `${s}.${remainMs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-slate-900/80 border border-white/20 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/20 p-3 rounded-2xl">
              <Trophy className="text-amber-400" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter">Ranking Scoreboard</h2>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest italic opacity-60">Performance showdown results</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          
          {/* Time Chart List */}
          <div className="space-y-4">
            {sortedByTime.map((result, idx) => {
              const fastestTime = sortedByTime[0]?.time || 1;
              const percentage = Math.round((result.time / fastestTime) * 100);
              const rank = idx + 1;

              return (
                <div key={result.id} className="relative group">
                  <div className="flex items-center gap-6 mb-2">
                    <span className={`w-8 text-2xl font-black text-center ${getMedalColor(rank)}`}>
                      {rank}
                    </span>
                    <div className="flex-1">
                       <div className="flex justify-between items-end mb-1">
                          <span className="text-lg font-black text-white tracking-tight">{result.title}</span>
                          <span className="text-sm font-mono font-bold text-emerald-400">{formatTime(result.time)}</span>
                       </div>
                       
                       {/* Glass Bar Container */}
                       <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
                         <div 
                           className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)] ${
                             rank === 1 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                             rank === 2 ? 'bg-gradient-to-r from-slate-400 to-slate-200' :
                             rank === 3 ? 'bg-gradient-to-r from-amber-700 to-amber-500' :
                             'bg-gradient-to-r from-emerald-600 to-teal-500'
                           }`}
                           style={{ width: `${(result.time / maxTime) * 100}%` }}
                         />
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Summary Table */}
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <th className="p-4 pl-6">Rank & Algorithm</th>
                  <th className="p-4 text-center"><Activity size={14} className="inline mr-1 mb-0.5" /> Comps</th>
                  <th className="p-4 text-center"><ArrowLeftRight size={14} className="inline mr-1 mb-0.5" /> Swaps</th>
                  <th className="p-4 text-right pr-6"><Clock size={14} className="inline mr-1 mb-0.5" /> Efficiency</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-slate-200">
                {sortedByTime.map((result, idx) => (
                  <tr key={result.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <span className={`${getMedalColor(idx + 1)}`}>{idx + 1}.</span>
                      <span className="text-white">{result.title}</span>
                    </td>
                    <td className="p-4 text-center font-mono opacity-80">{result.comparisons.toLocaleString()}</td>
                    <td className="p-4 text-center font-mono opacity-80">{result.swaps.toLocaleString()}</td>
                    <td className="p-4 text-right pr-6 text-emerald-400 font-black">
                       {idx === 0 ? "WINNER" : `+${((result.time / sortedByTime[0].time - 1) * 100).toFixed(0)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white/5 border-t border-white/10 flex justify-center">
          <button
            onClick={onClose}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] uppercase tracking-tighter text-xl"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
