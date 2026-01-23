
import React, { useState, useCallback, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import Dashboard from './components/Dashboard';
import { ALGORITHMS } from './algorithms';

function App() {
  const [arraySize, setArraySize] = useState(25);
  const [speed, setSpeed] = useState(500);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.1);
  const [selectedIds, setSelectedIds] = useState(new Set(['bubble', 'selection', 'insertion']));
  
  const [data, setData] = useState([]);
  const [triggerRun, setTriggerRun] = useState(0);
  const [triggerReset, setTriggerReset] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

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
  }, [arraySize]);

  useEffect(() => {
    generateData();
  }, [generateData]);

  const handleRun = () => {
    setTriggerRun(prev => prev + 1);
  };

  const handleReset = () => {
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

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(67,56,202,0.15),transparent)] pointer-events-none" />
      
      <ControlPanel 
        arraySize={arraySize}
        setArraySize={setArraySize}
        speed={speed}
        setSpeed={setSpeed}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        volume={volume}
        setVolume={setVolume}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        onRun={handleRun}
        onReset={handleReset}
        isAnyRunning={false} // Will need better sync for this later
      />

      <main className="relative">
        <Dashboard 
          data={data}
          arraySize={arraySize}
          speed={speed}
          soundEnabled={soundEnabled}
          volume={volume}
          triggerRun={triggerRun}
          triggerReset={triggerReset}
          selectedIds={selectedIds}
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
