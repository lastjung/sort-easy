import React from 'react';
import { COLORS } from '../constants/colors';

const SortChart = ({ array, arraySize, sortedIndices, swapIndices, goodIndices, compareIndices }) => {
  
  const getBarColorClass = (idx) => {
    if (swapIndices.includes(idx)) return COLORS.SWAP;      // Priority 1: Red (Active Swap)
    if (compareIndices.includes(idx)) return COLORS.COMPARE; // Priority 2: Yellow (Active Compare)
    if (goodIndices.includes(idx)) return COLORS.TARGET;    // Priority 3: Purple (Target Element)
    if (sortedIndices.includes(idx)) return COLORS.SORTED;  // Priority 4: Green (Final State)
    return COLORS.UNSORTED;                                 // Priority 5: Blue (Initial State)
  };

  return (
    <div className="relative w-full h-[400px] flex items-end justify-center gap-[2px] p-6 bg-slate-100/50 rounded-3xl border border-slate-200 shadow-inner overflow-hidden">
      {array.map((value, idx) => (
        <div
          key={idx}
          className={`w-full rounded-t-md transition-all duration-200 ease-in-out flex items-end justify-center pb-2 text-white font-bold shadow-sm bg-gradient-to-t ${getBarColorClass(idx)}`}
          style={{ height: `${value}%` }}
        >
          {/* Only show text if bars are not too thin */}
          {arraySize <= 25 && (
            <span className="text-[10px] md:text-xs drop-shadow-md mb-1 hidden sm:block opacity-90">{idx + 1}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SortChart;
