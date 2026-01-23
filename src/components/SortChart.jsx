import React from 'react';
import { COLORS } from '../constants/colors';

const SortChart = ({ array, arraySize, sortedIndices, swapIndices, goodIndices, compareIndices, isCinema }) => {
  
  const getBarColorClass = (idx) => {
    if (swapIndices.includes(idx)) return COLORS.SWAP;      // Priority 1: Red (Active Swap)
    if (compareIndices.includes(idx)) return COLORS.COMPARE; // Priority 2: Yellow (Active Compare)
    if (goodIndices.includes(idx)) return COLORS.TARGET;    // Priority 3: Purple (Target Element)
    if (sortedIndices.includes(idx)) return COLORS.SORTED;  // Priority 4: Green (Final State)
    return COLORS.UNSORTED;                                 // Priority 5: Blue (Initial State)
  };

  const maxVal = Math.max(...array, 1);

  return (
    <div className={`relative w-full flex items-end justify-center transition-all duration-500 overflow-hidden ${
      isCinema 
        ? 'flex-1 gap-[4px] p-8 bg-slate-900/60 rounded-[40px]' 
        : 'h-80 md:h-[450px] gap-[2px] p-4 bg-slate-900/40 rounded-2xl'
    } border border-white/5 shadow-inner`}>
      {array.map((value, idx) => (
        <div
          key={idx}
          className={`w-full rounded-t-lg transition-all duration-200 ease-in-out flex items-end justify-center pb-3 text-white font-black shadow-sm bg-gradient-to-t ${getBarColorClass(idx)}`}
          style={{ height: `${(value / maxVal) * 92 + 3}%` }}
        >
          {/* Only show text if bars are not too thin */}
          {arraySize <= (isCinema ? 40 : 25) && (
            <span className={`drop-shadow-lg mb-1 hidden sm:block opacity-95 ${isCinema ? 'text-sm' : 'text-[10px] md:text-xs'}`}>
              {idx + 1}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SortChart;
