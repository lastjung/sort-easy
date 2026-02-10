import React, { useMemo, useState } from 'react';
import { COLORS } from '../constants/colors';

const SortChart = ({ array, arraySize, sortedIndices, swapIndices, goodIndices, compareIndices, groupIndices = {}, pivotOrders = {}, isCinema, title }) => {
  const isHeap = title?.toLowerCase().includes('heap');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  
  const swapSet = useMemo(() => new Set(swapIndices), [swapIndices]);
  const compareSet = useMemo(() => new Set(compareIndices), [compareIndices]);
  const goodSet = useMemo(() => new Set(goodIndices), [goodIndices]);
  const sortedSet = useMemo(() => new Set(sortedIndices), [sortedIndices]);

  const getBarColorClass = (idx) => {
    if (swapSet.has(idx)) {
      return COLORS.SWAP;
    }
    if (compareSet.has(idx)) return COLORS.COMPARE; 
    if (goodSet.has(idx)) return COLORS.TARGET;    
    if (sortedSet.has(idx)) return COLORS.SORTED;
    if (groupIndices[idx] && groupIndices[idx].startsWith('bg-')) return groupIndices[idx];
    return COLORS.UNSORTED;                                 
  };

  const maxVal = Math.max(...array, 1);

  // --- Heap Tree Layout Calculations ---
  const getHeapPos = (idx) => {
    if (!isHeap) return null;
    const depth = Math.floor(Math.log2(idx + 1));
    const posInRow = idx - (Math.pow(2, depth) - 1);
    const rowWidth = Math.pow(2, depth);
    const totalLevels = Math.floor(Math.log2(arraySize)) + 1;
    
    return {
      x: ((posInRow + 0.5) / rowWidth) * 100,
      y: ((depth + 0.5) / totalLevels) * 85 + 7.5
    };
  };

  if (isHeap) {
    return (
      <div className={`w-full flex flex-col gap-4 animate-in fade-in duration-700 ${isCinema ? 'flex-1 p-4' : ''}`}>
        {/* Top: Theoretical Heap Tree */}
        <div className={`relative w-full transition-all duration-700 overflow-visible bg-slate-900/40 rounded-2xl border border-white/5 shadow-inner ${
          isCinema ? 'h-[55%]' : 'h-48 md:h-64'
        } p-4`}>
            <div className="absolute top-2 left-4 flex items-center gap-2 opacity-30">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Logic: Max Heap Tree (Hover to Sync)</span>
            </div>
            {/* SVG Lines for Tree Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {array.map((_, i) => {
                const left = 2 * i + 1;
                const right = 2 * i + 2;
                if (left >= arraySize && right >= arraySize) return null;
                
                const p = getHeapPos(i);
                const l = left < arraySize ? getHeapPos(left) : null;
                const r = right < arraySize ? getHeapPos(right) : null;
                
                return (
                <React.Fragment key={i}>
                    {l && <line x1={`${p.x}%`} y1={`${p.y}%`} x2={`${l.x}%`} y2={`${l.y}%`} stroke="white" strokeWidth="1" />}
                    {r && <line x1={`${p.x}%`} y1={`${p.y}%`} x2={`${r.x}%`} y2={`${r.y}%`} stroke="white" strokeWidth="1" />}
                </React.Fragment>
                );
            })}
            </svg>

            {array.map((value, idx) => {
            const colorClass = getBarColorClass(idx);
            const pos = getHeapPos(idx);
            const size = isCinema ? 44 : 32; // Slightly larger for dual text
            const isHovered = hoveredIdx === idx;
            const isComparing = compareSet.has(idx);
            
            return (
                <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`absolute flex flex-col items-center justify-center rounded-full font-black shadow-xl cursor-pointer ${colorClass} ${
                    isHovered ? 'ring-4 ring-white scale-110 z-10' : ''
                } ${isComparing ? '!bg-yellow-400 !text-black ring-[6px] ring-white shadow-[0_0_50px_rgba(250,204,21,1)] z-30 scale-[1.3]' : 'text-white'}`}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 700ms ease-out, top 700ms ease-out, background-color 150ms ease, box-shadow 150ms ease, transform 150ms ease, ring 150ms ease'
                }}
                >
                  <span className={`${isCinema ? 'text-lg' : 'text-xs'}`}>{value}</span>
                </div>
            );
            })}
        </div>

        {/* Bottom: Physical Array Bar Chart */}
        <div className={`relative w-full flex items-end justify-center transition-all duration-500 overflow-visible bg-slate-900/40 rounded-2xl border border-white/5 shadow-inner p-4 ${
            isCinema ? 'h-[40%]' : 'h-32 md:h-48'
        } gap-[2px]`}>
            <div className="absolute top-2 left-4 flex items-center gap-2 opacity-30">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Physics: Array View</span>
            </div>
            {array.map((value, idx) => {
                const colorClass = getBarColorClass(idx);
                const isHovered = hoveredIdx === idx;
                return (
                <div
                    key={idx}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`w-full rounded-t-sm relative flex items-end justify-center pb-2 text-white font-black cursor-pointer ${colorClass} ${
                        isHovered ? 'brightness-150 ring-2 ring-white z-10' : ''
                    }`}
                    style={{ 
                        height: `${(value / maxVal) * 85 + 5}%`,
                        transition: 'background-color 75ms linear, height 700ms ease-out, filter 200ms ease'
                    }}
                >
                    {arraySize <= 25 && (
                        <span className="drop-shadow-lg mb-1 hidden sm:block opacity-95 text-[10px] md:text-sm">
                            {value}
                        </span>
                    )}
                </div>
                );
            })}
        </div>
      </div>
    );
  }

  // --- Default Bar Chart Layout ---
  return (
    <div className={`relative w-full flex items-end justify-center transition-all duration-500 overflow-visible ${
      isCinema 
        ? 'flex-1 gap-[4px] p-8 bg-slate-900/60 rounded-[40px]' 
        : 'h-80 md:h-[450px] gap-[2px] p-4 bg-slate-900/40 rounded-2xl'
    } border border-white/5 shadow-inner`}>
      {array.map((value, idx) => {
        const colorClass = getBarColorClass(idx);
        const pivotOrder = pivotOrders[idx];
        const groupColor = groupIndices[idx];
        const nextGroupColor = groupIndices[idx + 1];
        const hasGap = groupColor && nextGroupColor && groupColor !== nextGroupColor;

        return (
          <div
            key={idx}
            className={`w-full rounded-t-sm relative flex items-end justify-center pb-3 text-white font-black ${colorClass}`}
            style={{ 
              height: `${(value / maxVal) * 92 + 3}%`,
              marginRight: hasGap ? (isCinema ? '24px' : '10px') : '0px',
              transition: 'background-color 75ms linear, margin-right 300ms ease-out, height 700ms ease-out'
            }}
          >
            {pivotOrder && (
              <div className="absolute -top-10 flex flex-col items-center animate-in zoom-in duration-500">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-white text-slate-900 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black shadow-xl border-2 border-emerald-500">
                  {pivotOrder}
                </div>
                <div className="w-0.5 h-2 bg-white/50" />
              </div>
            )}
            {isHeap && arraySize <= (isCinema ? 40 : 25) && (
              <span className={`drop-shadow-lg mb-1 hidden sm:block opacity-95 ${isCinema ? 'text-sm' : 'text-[10px] md:text-xs'}`}>
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SortChart;
