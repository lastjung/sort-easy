
import React, { useState, useCallback, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import FloatingActionDock from './components/FloatingActionDock';
import Sidebar from './components/Sidebar';
import { ALGORITHMS } from './algorithms';

function App() {
  const [arraySize, setArraySize] = useState(16);
  const [speed, setSpeed] = useState(50);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.1);
  const [selectedIds, setSelectedIds] = useState(new Set(['bubble']));
  const [isTubeMode, setIsTubeMode] = useState(false);
  
  const [data, setData] = useState([]);
  const [triggerRun, setTriggerRun] = useState(0);   // Global Start signal
  const [triggerResume, setTriggerResume] = useState(0); // Global Resume signal
  const [triggerStop, setTriggerStop] = useState(0);  // Global Pause signal
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
    if (runState.paused > 0) {
        setTriggerResume(prev => prev + 1);
    } else {
        setTriggerRun(prev => prev + 1);
    }
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

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(ALGORITHMS.map(a => a.id)));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleRunningChange = useCallback((state) => {
    setRunState(prev => {
      if (prev.running === state.running && prev.paused === state.paused) return prev;
      return state;
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 font-sans">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(67,56,202,0.15),transparent)] pointer-events-none" />
      
      {/* Brand Header - Left Aligned */}
      <header className="relative z-50 w-full pt-6 pb-2 px-10">
        <div className="flex flex-col items-start gap-0.5">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
                SORT<span className="text-emerald-400">EASY</span>
            </h1>
            <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] opacity-80">
                Advanced Environment Config v2.0
            </p>
        </div>
      </header>

      <main className="relative lg:pr-60 transition-all duration-700">
        {/* Desktop Configuration Sidebar (Hidden on Mobile) */}
        <Sidebar 
          arraySize={arraySize}
          setArraySize={setArraySize}
          speed={speed}
          setSpeed={setSpeed}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          isAnyActive={runState.running > 0 || runState.paused > 0}
        />

        <Dashboard 
          data={data}
          arraySize={arraySize}
          speed={speed}
          isTubeMode={isTubeMode}
          soundEnabled={soundEnabled}
          volume={volume}
          triggerRun={triggerRun}
          triggerResume={triggerResume}
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
          isTubeMode={isTubeMode}
          setIsTubeMode={setIsTubeMode}
          visibleCount={selectedIds.size}
          // Props for Drawer (Mobile Mode)
          arraySize={arraySize}
          setArraySize={setArraySize}
          speed={speed}
          setSpeed={setSpeed}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          isAnyActive={runState.running > 0 || runState.paused > 0}
        />
      </main>
    </div>
  );
}

export default App;
