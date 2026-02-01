
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
      <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/20 px-3 py-2 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2 group transition-transform duration-500 hover:scale-105 will-change-transform">
        
        {/* Sound Toggle */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-full transition-all duration-300 ${
            soundEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'
          } shadow-sm will-change-transform active:scale-90`}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <div className="w-px h-6 bg-white/10 mx-1" />

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
          }}
          disabled={visibleCount === 0}
          className={`group/btn flex items-center gap-2 px-4 py-2 rounded-full text-white font-black transition-transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl relative overflow-hidden w-[160px] justify-center voices-center will-change-transform ${
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
        {isIdle && visibleCount > 0 && (
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
