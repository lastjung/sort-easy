import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

const ALGO_CONFIG = {
  bubble: { icon: '🫧', slogan: "Spot the largest values bubbling to the top!" },
  selection: { icon: '🎯', slogan: "Hunting for the smallest number to put first!" },
  insertion: { icon: '📥', slogan: "Find small number by reverse bubbling sort." },
  quick: { icon: '⚡', slogan: "Divide and conquer with lightning speed!" },
  merge: { icon: '🧩', slogan: "Merge divided parts into a perfect whole!" },
  heap: { icon: '🏔️', slogan: "Build a mountain and pick the peak!" },
  shell: { icon: '🐚', slogan: "Sort with diminishing gaps for efficiency!" },
  cocktail: { icon: '🍹', slogan: "Shaking elements both ways for balance!" }
};

const SortHeader = ({ algorithm, setAlgorithm, isSorting, resetArray }) => {
  const currentAlgo = ALGO_CONFIG[algorithm] || ALGO_CONFIG.bubble;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
           <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
             {currentAlgo.icon}
           </span>
           {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort
        </h1>
        <p className="text-slate-500 font-medium text-lg mt-2 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            {currentAlgo.slogan}
        </p>
      </div>

       <div className="relative group">
           <select 
              value={algorithm} 
              onChange={(e) => {
                  setAlgorithm(e.target.value);
                  resetArray(); 
              }}
              disabled={isSorting}
              className={`appearance-none bg-white font-bold text-lg py-3 px-6 pr-12 rounded-2xl border-2 border-slate-100 shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer hover:border-indigo-200 ${isSorting ? 'opacity-50 cursor-not-allowed' : 'text-slate-700'}`}
           >
               <option value="bubble">Bubble Sort</option>
               <option value="selection">Selection Sort</option>
               <option value="insertion">Insertion Sort</option>
           </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-indigo-500 transition-colors">
              <ChevronDown size={20} strokeWidth={3} />
          </div>
       </div>
    </div>
  );
};

export default SortHeader;
