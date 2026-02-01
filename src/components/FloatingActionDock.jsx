import React, { useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Pause, Settings, CheckCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { ALGORITHMS } from '../algorithms';

const FloatingActionDock = ({
  onRun,
  onStop,
  onReset,
  isAnyRunning,
  isAnyPaused,
  soundEnabled,
  setSoundEnabled,
  visibleCount,
  // New Props for Drawer
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  selectedIds,
  toggleSelect,
  isAnyActive
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const isIdle = !isAnyRunning && !isAnyPaused;
  const mainLabel = isAnyRunning ? 'Pause All' : isAnyPaused ? 'Resume All' : 'Run All';

  return (
    <div className="fixed bottom-10 left-0 right-0 mx-auto w-fit z-[100] flex flex-col items-center gap-4">
      
      {/* Configuration Drawer */}
      <div className={`transition-all duration-500 origin-bottom transform ${
        showConfig 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/20 p-6 rounded-[32px] shadow-2xl w-[90vw] max-w-[500px] flex flex-col gap-6">
            
            {/* Sliders Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Speed</span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">{speed}%</span>
                    </div>
                    <input 
                        type="range" min="1" max="100" value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Size</span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">{arraySize}</span>
                    </div>
                    <input 
                        type="range" min="5" max="50" value={arraySize}
                        onChange={(e) => setArraySize(Number(e.target.value))}
                        disabled={isAnyActive}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500 disabled:opacity-30"
                    />
                </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Algorithm Selectors */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                {ALGORITHMS.map(algo => (
                    <button
                        key={algo.id}
                        onClick={() => toggleSelect(algo.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all border ${
                            selectedIds.has(algo.id)
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                            : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                        }`}
                    >
                        {selectedIds.has(algo.id) ? <CheckCircle size={10} /> : <Circle size={10} />}
                        {algo.title}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Main Dock */}
      <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/20 px-3 py-2 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2 group transition-transform duration-500 hover:scale-105 will-change-transform">
        
        {/* Config Toggle */}
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className={`p-2 rounded-full transition-all duration-300 ${
            showConfig ? 'bg-indigo-500/20 text-indigo-400 rotate-90' : 'bg-white/5 text-slate-400 hover:bg-white/10'
          } shadow-sm will-change-transform active:scale-90`}
          title="Toggle Settings"
        >
          <Settings size={18} />
        </button>

        <div className="w-px h-6 bg-white/10 mx-0.5" />

        {/* Sound Toggle */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-full transition-all duration-300 ${
            soundEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'
          } shadow-sm will-change-transform active:scale-90`}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <div className="w-px h-6 bg-white/10 mx-0.5" />

        {/* Global Reset */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-transform active:rotate-180 duration-500 will-change-transform"
          title="Reset All"
        >
          <RotateCcw size={18} />
        </button>

        {/* Global Play/Pause - The Main iOS style button */}
        <button
          onClick={() => {
            if (isAnyRunning) onStop();
            else onRun();
            if (showConfig) setShowConfig(false); // Auto-close on run
          }}
          disabled={visibleCount === 0}
          className={`group/btn flex items-center gap-3 px-4 py-2 rounded-full text-white font-black transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl relative overflow-hidden w-[160px] justify-center will-change-transform ${
            isAnyRunning 
              ? 'bg-gradient-to-r from-orange-500 to-rose-600 shadow-orange-500/40' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/40 hover:-translate-y-0.5'
          }`}
        >
          <div className="bg-white/20 p-1.5 rounded-full transition-transform group-active/btn:scale-75">
            {isAnyRunning ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
          </div>
          <span className="text-sm tracking-tight uppercase italic whitespace-nowrap">
            {mainLabel} 
          </span>
          {/* Subtle Glow on Running */}
          {isAnyRunning && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
        </button>

        {/* Info Badge - Moved to a non-layout-shifting position */}
        {isIdle && visibleCount > 0 && !showConfig && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-max pointer-events-none">
              <div className="bg-emerald-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg animate-pulse uppercase">
                  Ready to sync {visibleCount} blocks
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FloatingActionDock;
