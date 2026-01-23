
import React, { useState, useCallback, useEffect } from 'react';
import { ALGORITHMS } from '../algorithms';
import SortCard from './SortCard';

const Dashboard = ({ 
  data, 
  arraySize, 
  speed, 
  soundEnabled, 
  volume,
  triggerRun,
  triggerReset,
  selectedIds // Set of IDs to show
}) => {
  const [results, setResults] = useState({});

  const handleComplete = useCallback((id, stats) => {
    setResults(prev => ({ ...prev, [id]: stats }));
  }, []);

  // Filter based on selection
  const visibleAlgos = ALGORITHMS.filter(algo => selectedIds.has(algo.id));
  const isCinema = visibleAlgos.length === 1;

  return (
    <div className={`w-full mx-auto px-6 py-10 transition-all duration-500 ${isCinema ? 'max-w-[1200px]' : 'max-w-[1600px]'}`}>
      <div className={`grid gap-10 ${
        isCinema 
          ? 'grid-cols-1' 
          : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
      }`}>
        {visibleAlgos.map((algo) => (
          <div key={algo.id} className={isCinema ? 'transform scale-100' : ''}>
            <SortCard
              item={algo}
              isCinema={isCinema}
              initialArray={data}
              arraySize={arraySize}
              speed={speed}
              soundEnabled={soundEnabled}
              volume={volume}
              triggerRun={triggerRun}
              triggerReset={triggerReset}
              onComplete={handleComplete}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
