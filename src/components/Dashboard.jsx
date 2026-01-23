
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
  triggerStop,
  triggerReset,
  selectedIds, // Set of IDs to show
  onRunningChange
}) => {
  const [results, setResults] = useState({});
  const [activeAlgorithms, setActiveAlgorithms] = useState(new Set());

  // Notify parent of active algorithm count
  useEffect(() => {
    if (onRunningChange) onRunningChange(activeAlgorithms.size);
  }, [activeAlgorithms.size, onRunningChange]);

  const handleComplete = useCallback((id, stats) => {
    setResults(prev => ({ ...prev, [id]: stats }));
    setActiveAlgorithms(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleRunning = useCallback((id, running) => {
    setActiveAlgorithms(prev => {
      const next = new Set(prev);
      if (running) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // Filter based on selection
  const visibleAlgos = ALGORITHMS.filter(algo => selectedIds.has(algo.id));
  const isCinema = visibleAlgos.length === 1;

  return (
    <div className={`w-full mx-auto px-6 py-4 transition-all duration-500 ${isCinema ? 'max-w-[1800px] h-[calc(100vh-180px)] overflow-hidden' : 'max-w-[1600px]'}`}>
      <div className={`grid gap-6 h-full ${
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
              triggerStop={triggerStop}
              triggerReset={triggerReset}
              onComplete={(stats) => handleComplete(algo.id, stats)}
              onRunning={(running) => handleRunning(algo.id, running)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
