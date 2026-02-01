
import React, { useState, useCallback, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';
import FloatingActionDock from './components/FloatingActionDock';
import { ALGORITHMS } from './algorithms';

function App() {
  const [arraySize, setArraySize] = useState(16);
  const [speed, setSpeed] = useState(50);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.1);
  const [selectedIds, setSelectedIds] = useState(new Set(['bubble']));
  
  const [data, setData] = useState([]);
  const [triggerRun, setTriggerRun] = useState(0);   // Global Play/Resume signal (increments to trigger)
  const [triggerStop, setTriggerStop] = useState(0);  // Global Pause signal (increments to trigger)
  const [triggerReset, setTriggerReset] = useState(0); // Global Reset signal (increments to trigger)
  const [runState, setRunState] = useState({ running: 0, paused: 0 });

  // Initial data generation
  const generateData = useCallback(() => {
    const newArray = [];
    for (let i = 1; i <= arraySize; i++) newArray.push(i);
    // Shuffle
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setData(newArray);
    setRunState({ running: 0, paused: 0 });
  }, [arraySize]);

  useEffect(() => {
    generateData();
  }, [generateData]);

  const handleRun = () => {
    setTriggerRun(prev => prev + 1);
  };

  const handleStop = () => {
    setTriggerStop(prev => prev + 1);
  };

  const handleReset = () => {
    // Hard reset of global state
    setRunState({ running: 0, paused: 0 }); 
    setTriggerStop(prev => prev + 1);
    setTriggerReset(prev => prev + 1);
    generateData();
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });
  };

  const handleRunningChange = useCallback((state) => {
    setRunState(prev => {
      if (prev.running === state.running && prev.paused === state.paused) return prev;
      return state;
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(67,56,202,0.15),transparent)] pointer-events-none" />
      
      {/* Simplified Modern Header */}
      <header className="relative z-50 w-full pt-8 pb-4 px-6 text-center">
        <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                SORT<span className="text-emerald-400">EASY</span>
            </h1>
            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.4em] opacity-80">
                Advanced Sorting Environment • v2.0
            </p>
        </div>
      </header>

      <main className="relative">
        <Dashboard 
          data={data}
          arraySize={arraySize}
          speed={speed}
          soundEnabled={soundEnabled}
          volume={volume}
          triggerRun={triggerRun}
          triggerStop={triggerStop}
          triggerReset={triggerReset}
          selectedIds={selectedIds}
          onRunningChange={handleRunningChange}
        />

        <FloatingActionDock 
          onRun={handleRun}
          onStop={handleStop}
          onReset={handleReset}
          isAnyRunning={runState.running > 0} 
          isAnyPaused={runState.paused > 0}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          visibleCount={selectedIds.size}
          // New Props for Drawer
          arraySize={arraySize}
          setArraySize={setArraySize}
          speed={speed}
          setSpeed={setSpeed}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          isAnyActive={runState.running > 0 || runState.paused > 0}
        />
      </main>

      {/* Footer */}
      <footer className="mt-12 py-12 border-t border-white/5 text-center relative z-10">
        <p className="text-slate-500 text-xs font-black tracking-[0.2em] uppercase">
          SortEasy Pro • Elite Sorting Visualizer
        </p>
      </footer>
    </div>
  );
}

export default App;
