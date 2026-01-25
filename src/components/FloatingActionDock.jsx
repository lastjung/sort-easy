
import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Pause } from 'lucide-react';

const FloatingActionDock = ({
  onRun,
  onStop,
  onReset,
  isAnyRunning,
  isAnyPaused,
  soundEnabled,
  setSoundEnabled,
  visibleCount
}) => {
  const isIdle = !isAnyRunning && !isAnyPaused;
  const mainLabel = isAnyRunning ? 'Pause All' : isAnyPaused ? 'Resume All' : 'Run All';

  return (
    <div className="fixed bottom-10 left-0 right-0 mx-auto w-fit z-[100]">
      <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/20 px-4 py-3 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 group transition-transform duration-500 hover:scale-105 will-change-transform">
        
        {/* Sound Toggle */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3 rounded-full transition-all duration-300 ${
            soundEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'
          } shadow-sm will-change-transform active:scale-90`}
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>

        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Global Reset */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          className="p-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-transform active:rotate-180 duration-500 will-change-transform"
          title="Reset All"
        >
          <RotateCcw size={24} />
        </button>

        {/* Global Play/Pause - The Main iOS style button */}
        <button
          onClick={() => {
            if (isAnyRunning) onStop();
            else onRun();
          }}
          disabled={visibleCount === 0}
          className={`group/btn flex items-center gap-3 pl-5 pr-8 py-3 rounded-full text-white font-black transition-transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl relative overflow-hidden w-[200px] justify-center will-change-transform ${
            isAnyRunning 
              ? 'bg-gradient-to-r from-orange-500 to-rose-600 shadow-orange-500/40' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/40 hover:-translate-y-0.5'
          }`}
        >
          <div className="bg-white/20 p-2 rounded-full transition-transform group-active/btn:scale-75">
            {isAnyRunning ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
          </div>
          <span className="text-lg tracking-tight uppercase italic whitespace-nowrap">
            {mainLabel} 
          </span>
          {/* Subtle Glow on Running */}
          {isAnyRunning && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
        </button>

        {/* Info Badge - Moved to a non-layout-shifting position */}
        {isIdle && visibleCount > 0 && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max pointer-events-none">
              <div className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse uppercase">
                  Ready to sync {visibleCount} blocks
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default FloatingActionDock;
