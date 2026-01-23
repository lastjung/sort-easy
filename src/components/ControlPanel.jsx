
import React from 'react';
import { Settings, Play, RotateCcw, Volume2, VolumeX, CheckCircle, Circle } from 'lucide-react';
import { ALGORITHMS } from '../algorithms';

const ControlPanel = ({
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  soundEnabled,
  setSoundEnabled,
  volume,
  setVolume,
  selectedIds,
  toggleSelect,
  onRun,
  onReset,
  isAnyRunning
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 py-4 px-6 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* Top Row: Title and Global Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
              <Settings className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">SORT<span className="text-emerald-400">EASY</span></h1>
          </div>

          <div className="flex items-center gap-4">
             {/* Volume */}
             <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

              <button
                onClick={onReset}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-slate-300 font-bold rounded-xl border border-white/5 hover:bg-white/10 hover:text-white transition-all active:scale-95"
              >
                <RotateCcw size={18} /> <span>Reset All</span>
              </button>

              <button
                onClick={onRun}
                disabled={isAnyRunning || selectedIds.size === 0}
                className={`flex items-center gap-2 px-8 py-2.5 text-white font-black rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isAnyRunning ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-500'
                }`}
              >
                <Play size={18} fill="currentColor" /> <span>Run Selected</span>
              </button>
          </div>
        </div>

        {/* Bottom Row: Settings and Selectors */}
        <div className="flex flex-wrap items-center gap-8 py-2 border-t border-white/10 mt-2">
            
            {/* Speed & Size Sliders */}
            <div className="flex flex-wrap items-center gap-6 flex-1 min-w-[300px]">
                <div className="flex items-center gap-3 flex-1 min-w-[140px]">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Speed</span>
                    <input 
                        type="range" min="1" max="100" defaultValue="50"
                        onChange={(e) => setSpeed(1010 - Number(e.target.value) * 10)}
                        className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-[140px]">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Size</span>
                    <input 
                        type="range" min="5" max="50" value={arraySize}
                        onChange={(e) => setArraySize(Number(e.target.value))}
                        disabled={isAnyRunning}
                        className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500 disabled:opacity-30"
                    />
                </div>
            </div>

            {/* Algorithm Selectors */}
            <div className="flex flex-wrap items-center gap-2">
                {ALGORITHMS.map(algo => (
                    <button
                        key={algo.id}
                        onClick={() => toggleSelect(algo.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all border ${
                            selectedIds.has(algo.id)
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                        }`}
                    >
                        {selectedIds.has(algo.id) ? <CheckCircle size={12} /> : <Circle size={12} />}
                        {algo.title}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </header>
  );
};

export default ControlPanel;
