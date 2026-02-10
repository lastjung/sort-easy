import React from "react";
import { ALGORITHMS } from "../algorithms";
import { CheckCircle, Circle, Zap, Layers } from "lucide-react";

const Sidebar = ({
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  selectedIds,
  toggleSelect,
  onSelectAll,
  onDeselectAll,
  isAnyActive,
}) => {
  const isAllSelected = selectedIds.size === ALGORITHMS.length;

  return (
    <aside className="fixed right-8 top-1/2 -translate-y-1/2 z-[40] hidden lg:flex flex-col gap-4 w-64 animate-in slide-in-from-right-10 duration-700 ease-out">
      {/* Environment Config Card */}
      <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl flex flex-col gap-6">
        {/* Section: Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 opacity-50">
            <Zap size={14} className="text-emerald-400" />
            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
              Environment
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-400 uppercase tracking-widest">
                  Speed
                </span>
                <span className="text-emerald-400 font-mono text-sm">
                  {speed}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-400 uppercase tracking-widest">
                  Size
                </span>
                <span className="text-emerald-400 font-mono text-sm">
                  {arraySize}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                disabled={isAnyActive}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500 disabled:opacity-30"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-white/5 w-full" />

        {/* Section: Algorithms */}
        <div className="space-y-4">
          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-indigo-400" />
              <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
                Selection
              </span>
            </div>
            <button
              onClick={() => (isAllSelected ? onDeselectAll() : onSelectAll())}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
            >
              {isAllSelected ? "None" : "All"}
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                onClick={() => toggleSelect(algo.id)}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all group ${
                  selectedIds.has(algo.id)
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                }`}
              >
                <span className="tracking-tight">{algo.title}</span>
                {selectedIds.has(algo.id) ? (
                  <CheckCircle size={14} className="text-emerald-500" />
                ) : (
                  <Circle
                    size={14}
                    className="opacity-20 group-hover:opacity-40 transition-opacity"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Branding inside Sidebar */}
      <div className="px-6 space-y-1">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
          SortEasy Logic
        </p>
        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em] italic opacity-40">
          Engineered for Performance
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
