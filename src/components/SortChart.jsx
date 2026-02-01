import React, { useMemo } from 'react';
import { COLORS } from '../constants/colors';

const SortChart = ({ array, arraySize, sortedIndices, swapIndices, goodIndices, compareIndices, groupIndices = {}, pivotOrders = {}, isCinema }) => {
  
  const swapSet = useMemo(() => new Set(swapIndices), [swapIndices]);
  const compareSet = useMemo(() => new Set(compareIndices), [compareIndices]);
  const goodSet = useMemo(() => new Set(goodIndices), [goodIndices]);
  const sortedSet = useMemo(() => new Set(sortedIndices), [sortedIndices]);

  const getBarColorClass = (idx) => {
    if (swapSet.has(idx)) return COLORS.SWAP;      
    if (compareSet.has(idx)) return COLORS.COMPARE; 
    if (goodSet.has(idx)) return COLORS.TARGET;    
    if (groupIndices[idx]) return groupIndices[idx]; // Custom Group Color (Pivot Walls) takes priority
    if (sortedSet.has(idx)) return COLORS.SORTED;
    return COLORS.UNSORTED;                                 
  };

  const maxVal = Math.max(...array, 1);

  return (
    <div className={`relative w-full flex items-end justify-center transition-all duration-500 overflow-visible ${
      isCinema 
        ? 'flex-1 gap-[4px] p-8 bg-slate-900/60 rounded-[40px]' 
        : 'h-80 md:h-[450px] gap-[2px] p-4 bg-slate-900/40 rounded-2xl'
    } border border-white/5 shadow-inner`}>
      {array.map((value, idx) => {
        const colorClass = getBarColorClass(idx);
        const pivotOrder = pivotOrders[idx];
        
        // --- [Divide 시각화 핵심] 그룹이 다르면 간격을 물리적으로 벌립니다 (Divider) ---
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
              transition: 'background-color 75ms linear, margin-right 700ms ease-out, height 700ms ease-out'
            }}
          >
            {/* Pivot Order Badge */}
            {pivotOrder && (
              <div className="absolute -top-10 flex flex-col items-center animate-in zoom-in duration-500">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-white text-slate-900 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black shadow-xl border-2 border-emerald-500">
                  {pivotOrder}
                </div>
                <div className="w-0.5 h-2 bg-white/50" />
              </div>
            )}

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
