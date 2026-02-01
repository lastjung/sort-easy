
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ALGORITHMS } from '../algorithms';
import SortCard from './SortCard';
import Scoreboard from './Scoreboard';

const Dashboard = ({ 
  data, 
  arraySize, 
  speed, 
  soundEnabled, 
  volume,
  triggerRun,
  triggerResume,
  triggerStop,
  triggerReset,
  selectedIds, // Set of IDs to show
  onRunningChange,
  isTubeMode
}) => {
  const [results, setResults] = useState({});
  const [activeAlgorithms, setActiveAlgorithms] = useState(new Set());
  const [pausedAlgorithms, setPausedAlgorithms] = useState(new Set());
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [scoreboardResults, setScoreboardResults] = useState([]);
  const runningSetRef = useRef(new Set());

  // Clear everything on global reset
  useEffect(() => {
    if (triggerReset > 0) {
      setActiveAlgorithms(new Set());
      setPausedAlgorithms(new Set());
      setResults({});
      setShowScoreboard(false);
      runningSetRef.current = new Set();
    }
  }, [triggerReset]);

  // Track which algorithms are launched
  useEffect(() => {
    if (triggerRun > 0) {
      setShowScoreboard(false);
      runningSetRef.current = new Set(selectedIds);
    }
  }, [triggerRun, selectedIds]);

  // Notify parent of active algorithm count
  useEffect(() => {
    if (onRunningChange) {
      onRunningChange({
        running: activeAlgorithms.size,
        paused: pausedAlgorithms.size,
      });
    }
  }, [activeAlgorithms.size, pausedAlgorithms.size, onRunningChange]);

  const handleComplete = useCallback((id, stats) => {
    if (!id) return;
    
    setResults(prev => {
      const next = { ...prev, [id]: { ...stats, title: ALGORITHMS.find(a => a.id === id)?.title || id } };
      
      // Auto-open scoreboard when all selected tasks are done
      runningSetRef.current.delete(id);
      if (runningSetRef.current.size === 0 && Object.keys(next).length > 0) {
        setScoreboardResults(Object.values(next));
        // setShowScoreboard(true); // Disabled as requested
      }
      return next;
    });

    setActiveAlgorithms(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setPausedAlgorithms(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleRunning = useCallback((id, state) => {
    const isRunning = typeof state === 'boolean' ? state : state.sorting && !state.paused;
    const isPaused = typeof state === 'boolean' ? false : state.sorting && state.paused;

    setActiveAlgorithms(prev => {
      const next = new Set(prev);
      if (isRunning) next.add(id);
      else next.delete(id);
      return next;
    });
    setPausedAlgorithms(prev => {
      const next = new Set(prev);
      if (isPaused) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  // Filter based on selection
  const visibleAlgos = ALGORITHMS.filter(algo => selectedIds.has(algo.id));
  const isCinema = visibleAlgos.length === 1;

  return (
    <div className={`w-full mx-auto px-6 py-4 transition-all duration-500 ${isCinema ? 'max-w-[1800px] h-[calc(100vh-180px)] overflow-visible' : 'max-w-[1600px]'}`}>
        {/* Dashboard Padding / Space Sync (Ensures slogan doesn't clip) */}
        <div className={`grid gap-6 h-full transition-all duration-700 ${
          isCinema 
            ? 'grid-cols-1 pt-12 pb-24' 
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
              triggerResume={triggerResume}
              triggerStop={triggerStop}
              triggerReset={triggerReset}
              onComplete={handleComplete}
              onRunning={handleRunning}
              isTubeMode={isTubeMode}
            />
          </div>
        ))}
      </div>

      {showScoreboard && (
        <Scoreboard 
          results={scoreboardResults} 
          onClose={() => setShowScoreboard(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
