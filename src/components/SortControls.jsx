import React from 'react';
import { Play, Square, RotateCcw, Turtle, Zap, BarChart2, Volume2, VolumeX } from 'lucide-react';

const SortControls = ({
  isSorting,
  isPaused,
  handleStartStop,
  resetArray,
  speed,
  setSpeed,
  arraySize,
  setArraySize,
  soundEnabled,
  setSoundEnabled,
  volume,
  setVolume
}) => {

  const handleSpeedChange = (e) => setSpeed(1010 - Number(e.target.value) * 10);
  const handleSizeChange = (e) => setArraySize(Number(e.target.value));
  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));

  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
      
      {/* Sliders Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        {/* Speed */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-sm font-bold text-slate-500">
            <span className="flex items-center gap-2"><Turtle size={16} className="text-emerald-500"/> Slow</span>
            <span className="flex items-center gap-2">Fast <Zap size={16} className="text-amber-500"/></span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            defaultValue="50"
            onChange={handleSpeedChange}
            className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-colors"
          />
        </div>

        {/* Count */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-sm font-bold text-slate-500">
             <span className="flex items-center gap-2"><BarChart2 size={16} className="text-blue-500"/> Few</span>
             <span className="flex items-center gap-2">Many <BarChart2 size={16} className="text-violet-500"/></span>
          </div>
           <input 
             type="range" 
             min="5" 
             max="100" 
             value={arraySize}
             onChange={handleSizeChange}
             disabled={isSorting} 
             className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           />
        </div>
      </div>

      <div className="h-px bg-slate-100 my-2"></div>

      {/* Buttons Row */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        
        {/* Volume - Compact */}
         <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            {soundEnabled && (
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-200 rounded-full accent-indigo-500"
              />
            )}
         </div>

         {/* Main Actions */}
         <div className="flex gap-4 flex-1 justify-end">
            <button
              onClick={resetArray}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 hover:text-slate-800 transition-all active:scale-95"
            >
              <RotateCcw size={20} /> <span className="hidden sm:inline">Reset</span>
            </button>
            
            <button
              onClick={handleStartStop}
              className={`flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all min-w-[140px] justify-center ${
                isSorting 
                  ? (isPaused ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600')
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
               {isSorting 
                ? (isPaused ? <><Play size={20} /> Resume</> : <><Square size={20} /> Pause</>) 
                : <><Play size={20} /> Start</>}
            </button>
         </div>
      </div>
    </div>
  );
};

export default SortControls;
