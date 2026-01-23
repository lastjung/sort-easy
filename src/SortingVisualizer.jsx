import React, { useState, useEffect, useRef } from 'react';
import { Timer } from 'lucide-react';
import { bubbleSort, selectionSort, insertionSort } from './algorithms/sortingAlgorithms';
import { LEGEND_ITEMS } from './constants/colors';
import SortHeader from './components/SortHeader';
import SortControls from './components/SortControls';
import SortChart from './components/SortChart';

// --- Sound Utility ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const playTone = (freq, type = 'sine', duration = 0.1, vol = 0.1) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

const SortingVisualizer = () => {
  // --- State Management ---
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false); 
  const [compareIndices, setCompareIndices] = useState([]); 
  const [swapIndices, setSwapIndices] = useState([]);
  const [goodIndices, setGoodIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [description, setDescription] = useState("Press 'Start' to begin visualization!");
  const [speed, setSpeed] = useState(500); 
  const [arraySize, setArraySize] = useState(25); 
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.1); 
  const [elapsedTime, setElapsedTime] = useState(0);
  const [algorithm, setAlgorithm] = useState('bubble');

  // Refs
  const sortingRef = useRef(false);
  const pausedRef = useRef(false);
  const speedRef = useRef(speed);
  const stopReasonRef = useRef(null); 
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const pauseStartTimeRef = useRef(0);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const resetArray = () => {
    sortingRef.current = false;
    pausedRef.current = false;
    stopReasonRef.current = 'reset';
    
    setIsSorting(false);
    setIsPaused(false);
    
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
        newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArray);
    
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setElapsedTime(0);
    clearInterval(timerRef.current);
    setDescription(`Ready with ${arraySize} elements`);
  };

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  const wait = async (factor = 1) => {
     const ms = speedRef.current * factor;
     await new Promise((resolve) => setTimeout(resolve, ms));

     while (pausedRef.current) {
         if (!sortingRef.current) return false; 
         await new Promise((resolve) => setTimeout(resolve, 100));
     }
     return sortingRef.current;
  };

  const playSound = (freq, type) => {
    if (soundEnabled) playTone(freq, type, 0.1, volume);
  };

  const handleStartStop = async () => {
    if (isSorting) {
      if (isPaused) {
        pausedRef.current = false;
        setIsPaused(false);
        const pauseDuration = Date.now() - pauseStartTimeRef.current;
        startTimeRef.current += pauseDuration;
        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - startTimeRef.current);
        }, 50);
        setDescription("Resuming...");
      } else {
        pausedRef.current = true;
        setIsPaused(true);
        pauseStartTimeRef.current = Date.now();
        clearInterval(timerRef.current);
        setDescription("Paused");
      }
    } else {
      setIsSorting(true);
      setIsPaused(false);
      sortingRef.current = true;
      pausedRef.current = false;
      stopReasonRef.current = null;
      startTimeRef.current = Date.now() - elapsedTime;
      timerRef.current = setInterval(() => {
         setElapsedTime(Date.now() - startTimeRef.current);
      }, 50);

      const helpers = {
          array: [...array], 
          setArray, 
          setCompareIndices,
          setSwapIndices,
          setGoodIndices,
          setSortedIndices,
          setDescription,
          playSound,
          wait,
          sortingRef
      };

      let finished = false;
      if (algorithm === 'bubble') finished = await bubbleSort(helpers);
      else if (algorithm === 'selection') finished = await selectionSort(helpers);
      else if (algorithm === 'insertion') finished = await insertionSort(helpers);

      clearInterval(timerRef.current);
      if (finished && sortingRef.current) {
           const n = array.length;
           if (!sortedIndices.includes(n-1)) setSortedIndices([...Array(n).keys()]);
           setDescription("Sorting Complete! 🎉");
           playSound(600, 'square');
           playSound(800, 'square');
      } else if (stopReasonRef.current === 'user') {
           setDescription("Stopped.");
      }
      
      setIsSorting(false);
      sortingRef.current = false;
    }
  };

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const remainS = s % 60;
    const remainMs = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${remainS.toString().padStart(2, '0')}:${remainMs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="w-full max-w-5xl">
        
        <SortHeader 
            algorithm={algorithm} 
            setAlgorithm={setAlgorithm} 
            isSorting={isSorting} 
            resetArray={resetArray} 
        />

        {/* Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2 bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-3"></div>
              <p className="text-lg font-semibold text-slate-700">
                {description}
              </p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
               <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Time</span>
               <div className="flex items-center gap-2">
                  <Timer size={20} className="text-slate-400" />
                  <span className="text-xl font-mono font-bold text-slate-700">{formatTime(elapsedTime)}</span>
               </div>
            </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 px-2">
            {LEGEND_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-xs font-bold text-slate-500">{item.label}</span>
                </div>
            ))}
        </div>

        {/* Chart */}
        <div className="mb-8">
            <SortChart 
                array={array}
                arraySize={arraySize}
                sortedIndices={sortedIndices}
                swapIndices={swapIndices}
                goodIndices={goodIndices}
                compareIndices={compareIndices}
            />
        </div>

        {/* Controls */}
        <SortControls 
            isSorting={isSorting}
            isPaused={isPaused}
            handleStartStop={handleStartStop}
            resetArray={resetArray}
            speed={speed}
            setSpeed={setSpeed}
            arraySize={arraySize}
            setArraySize={setArraySize}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            volume={volume}
            setVolume={setVolume}
        />

      </div>
    </div>
  );
};

export default SortingVisualizer;
