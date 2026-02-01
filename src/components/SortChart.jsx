import React from 'react';
import { COLORS } from '../constants/colors';

const SortChart = ({ array, arraySize, sortedIndices, swapIndices, goodIndices, compareIndices, isCinema }) => {
  
  const getBarColorClass = (idx) => {
    if (swapIndices.includes(idx)) return COLORS.SWAP;      
    if (compareIndices.includes(idx)) return COLORS.COMPARE; 
    if (goodIndices.includes(idx)) return COLORS.TARGET;    
    if (sortedIndices.includes(idx)) {
        return COLORS.SORTED;
    }
    return COLORS.UNSORTED;                                 
  };

  const maxVal = Math.max(...array, 1);

  return (
    <div className={`relative w-full flex items-end justify-center transition-[padding,gap,height] duration-500 overflow-hidden ${
      isCinema 
        ? 'flex-1 gap-[4px] p-8 bg-slate-900/60 rounded-[40px]' 
        : 'h-80 md:h-[450px] gap-[2px] p-4 bg-slate-900/40 rounded-2xl'
    } border border-white/5 shadow-inner`}>
      {array.map((value, idx) => {
        const colorClass = getBarColorClass(idx);
        const isNormal = colorClass === COLORS.UNSORTED;
        return (
          <div
            key={idx}
            className={`w-full rounded-t-sm transition-[height,background-color] duration-75 flex items-end justify-center pb-3 text-white font-black ${colorClass}`}
            style={{ height: `${(value / maxVal) * 92 + 3}%` }}
          >
            {/* Only show text if bars are not too thin */}
            {arraySize <= (isCinema ? 40 : 25) && (
              <span className={`drop-shadow-lg mb-1 hidden sm:block opacity-95 ${isCinema ? 'text-sm' : 'text-[10px] md:text-xs'}`}>
                {idx + 1}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SortChart;
