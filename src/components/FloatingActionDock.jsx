
import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Pause } from 'lucide-react';

const FloatingActionDock = ({
  onRun,
  onStop,
  onReset,
  isAnyRunning,
  soundEnabled,
  setSoundEnabled,
  visibleCount
}) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform hover:scale-105">
      <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/20 px-4 py-3 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 group">
        
        {/* Sound Toggle */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3 rounded-full transition-all duration-300 ${
            soundEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'
          }`}
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Global Reset */}
        <button
          onClick={onReset}
          className="p-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          title="Reset All"
        >
          <RotateCcw size={24} />
        </button>

        {/* Global Play/Pause - The Main iOS style button */}
        <button
          onClick={isAnyRunning ? onStop : onRun}
          disabled={!isAnyRunning && visibleCount === 0}
          className={`flex items-center gap-3 pl-5 pr-8 py-3 rounded-full text-white font-black transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
            isAnyRunning 
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/20' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
          }`}
        >
          <div className="bg-white/20 p-2 rounded-full">
            {isAnyRunning ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
          </div>
          <span className="text-lg tracking-tight uppercase italic whitespace-nowrap">{isAnyRunning ? 'Pause All' : 'Run All'}</span>
        </button>

        {/* Info Badge */}
        {!isAnyRunning && visibleCount > 0 && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce uppercase">
                Ready to sync {visibleCount} blocks
            </div>
        )}
      </div>
    </div>
  );
};

export default FloatingActionDock;
