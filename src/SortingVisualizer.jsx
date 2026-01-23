import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, RotateCcw, Turtle, Zap, BarChart2, Volume2, VolumeX, Timer, ChevronDown } from 'lucide-react';
import { bubbleSort, selectionSort } from './algorithms/sortingAlgorithms';

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
  const [compareIndices, setCompareIndices] = useState([]); // Yellow
  const [swapIndices, setSwapIndices] = useState([]); // Red
  const [goodIndices, setGoodIndices] = useState([]); // Purple
  const [sortedIndices, setSortedIndices] = useState([]); // Green
  const [description, setDescription] = useState("Press 'Start Sorting' to begin!");
  const [speed, setSpeed] = useState(500); // Animation delay (ms)
  const [arraySize, setArraySize] = useState(20); 
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.1); 
  const [elapsedTime, setElapsedTime] = useState(0);
  const [algorithm, setAlgorithm] = useState('bubble');

  // Refs for real-time control
  const sortingRef = useRef(false);
  const pausedRef = useRef(false);
  const speedRef = useRef(speed);
  const stopReasonRef = useRef(null); 
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const pauseStartTimeRef = useRef(0);

  // Keep speedRef in sync with state
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // --- Initialization ---
  const resetArray = () => {
    sortingRef.current = false;
    pausedRef.current = false;
    stopReasonRef.current = 'reset';
    
    setIsSorting(false);
    setIsPaused(false);
    
    // Generate Random Array
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
        newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArray);
    
    // Reset visual cues & timer
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setElapsedTime(0);
    clearInterval(timerRef.current);
    setDescription(`Ready with ${arraySize} bars!`);
  };

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  // --- Utility: Wait (Sleep + Pause Check) ---
  const wait = async (factor = 1) => {
     // 1. Basic sleep
     const ms = speedRef.current * factor;
     await new Promise((resolve) => setTimeout(resolve, ms));

     // 2. Pause Loop
     while (pausedRef.current) {
         if (!sortingRef.current) return false; // Exit if stopped/reset
         await new Promise((resolve) => setTimeout(resolve, 100));
     }
     
     // 3. Check if we should continue
     return sortingRef.current;
  };

  const playSound = (freq, type) => {
    if (soundEnabled) playTone(freq, type, 0.1, volume);
  };

  // --- Start / Stop Handler ---
  const handleStartStop = async () => {
    if (isSorting) {
      if (isPaused) {
        // RESUME
        pausedRef.current = false;
        setIsPaused(false);
        const pauseDuration = Date.now() - pauseStartTimeRef.current;
        startTimeRef.current += pauseDuration;
        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - startTimeRef.current);
        }, 50);
        setDescription("Resuming...");
      } else {
        // PAUSE
        pausedRef.current = true;
        setIsPaused(true);
        pauseStartTimeRef.current = Date.now();
        clearInterval(timerRef.current);
        setDescription("Paused");
      }
    } else {
      // START NEW SORT
      setIsSorting(true);
      setIsPaused(false);
      sortingRef.current = true;
      pausedRef.current = false;
      stopReasonRef.current = null;
      startTimeRef.current = Date.now() - elapsedTime;
      timerRef.current = setInterval(() => {
         setElapsedTime(Date.now() - startTimeRef.current);
      }, 50);

      // --- Execute Algorithm ---
      const helpers = {
          array: [...array], // Pass initial copy
          setArray, // Will update state
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

      // --- Finish ---
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

  // --- Helper: Bar Color Priority ---
  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return 'bg-green-500';
    if (swapIndices.includes(index)) return 'bg-red-500';   
    if (goodIndices.includes(index)) return 'bg-purple-500'; 
    if (compareIndices.includes(index)) return 'bg-yellow-400'; 
    return 'bg-blue-400'; 
  };

  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));
  const handleSpeedChange = (e) => setSpeed(1010 - Number(e.target.value) * 10);
  const handleSizeChange = (e) => setArraySize(Number(e.target.value));

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const remainS = s % 60;
    const remainMs = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${remainS.toString().padStart(2, '0')}:${remainMs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#EEF2FF] p-4 font-sans text-[#1E1B4B]">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[8px_8px_16px_#d1d9e6,-8px_-8px_16px_#ffffff] p-8 border border-white/50">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#4F46E5] mb-2 drop-shadow-sm flex items-center gap-3">
               {algorithm === 'bubble' ? '🫧 Bubble Sort' : '🎯 Selection Sort'}
            </h1>
            <p className="text-orange-500 font-medium text-lg">
                {algorithm === 'bubble' 
                    ? "Spot the largest values bubbling to the top!" 
                    : "Hunting for the smallest number to put first!"}
            </p>
          </div>
          <div className="flex items-center gap-4">
             {/* Algo Selector */}
             <div className="relative">
                 <select 
                    value={algorithm} 
                    onChange={(e) => {
                        setAlgorithm(e.target.value);
                        resetArray(); 
                    }}
                    disabled={isSorting}
                    className={`appearance-none bg-white font-bold py-2 px-4 pr-10 rounded-xl shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] ${isSorting ? 'text-gray-400 cursor-not-allowed' : 'text-[#4F46E5] cursor-pointer'}`}
                 >
                     <option value="bubble">Bubble Sort</option>
                     <option value="selection">Selection Sort</option>
                 </select>
                 <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${isSorting ? 'text-gray-400' : 'text-[#4F46E5]'}`}>
                    <ChevronDown size={16} />
                </div>
             </div>

             {soundEnabled && (
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                title="Volume"
              />
            )}
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 bg-white rounded-2xl shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] text-gray-500 hover:text-[#4F46E5] transition-all active:shadow-[inset_4px_4px_10px_#d1d9e6,inset_-4px_-4px_10px_#ffffff]"
            >
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>
        </div>

        {/* Description & Timer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2 bg-[#EEF2FF] p-5 rounded-2xl shadow-[inset_6px_6px_10px_#d1d9e6,inset_-6px_-6px_10px_#ffffff] flex items-center justify-center min-h-[80px]">
              <p className="text-xl font-semibold text-[#4F46E5] animate-pulse text-center">
                {description}
              </p>
            </div>
            <div className="bg-[#EEF2FF] p-5 rounded-2xl shadow-[inset_6px_6px_10px_#d1d9e6,inset_-6px_-6px_10px_#ffffff] flex items-center justify-center gap-2">
               <Timer size={24} className="text-gray-400" />
               <span className="text-2xl font-mono font-bold text-gray-600">{formatTime(elapsedTime)}</span>
            </div>
        </div>

        {/* Graph Area */}
        <div className="flex justify-center items-end h-80 w-full gap-2 mb-8 p-6 bg-[#EEF2FF] rounded-3xl shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff] overflow-hidden relative">
           {array.map((value, idx) => (
            <div
              key={idx}
              className={`w-full max-w-[60px] rounded-t-xl transition-all duration-300 ease-in-out flex items-end justify-center pb-2 text-white font-bold shadow-lg ${getBarColor(idx)}`}
              style={{ 
                  height: `${value}%`,
                  background: sortedIndices.includes(idx) ? 'linear-gradient(145deg, #22c55e, #16a34a)' :
                              swapIndices.includes(idx) ? 'linear-gradient(145deg, #ef4444, #dc2626)' :
                              goodIndices.includes(idx) ? 'linear-gradient(145deg, #a855f7, #9333ea)' :
                              compareIndices.includes(idx) ? 'linear-gradient(145deg, #fbbf24, #d97706)' :
                              'linear-gradient(145deg, #60a5fa, #3b82f6)'
              }}
            >
              {/* Only show text if bars are not too thin (arbitrary limit around 25 bars) */}
              {arraySize <= 25 && (
                <span className="text-sm drop-shadow-md hidden sm:block mb-1">{value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-gray-600 font-bold">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded-full shadow-md"></div>Idle</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-500 rounded-full shadow-md"></div>Target</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded-full shadow-md"></div>Scanning</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-full shadow-md"></div>Min Value</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded-full shadow-md"></div>Sorted</div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-8 bg-gray-50/50 p-6 rounded-3xl backdrop-blur-sm">
          
          {/* Row 1: Sliders */}
          <div className="flex flex-col md:flex-row gap-8 justify-between px-4">
            {/* Speed Slider */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                  <span className="flex items-center gap-2"><Turtle size={16} className="text-green-600"/> Slow</span>
                  <span className="flex items-center gap-2">Fast <Zap size={16} className="text-yellow-500"/></span>
              </div>
              <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  defaultValue="50"
                  className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#4F46E5] shadow-inner"
                  onChange={handleSpeedChange}
              />
            </div>

            {/* Size Slider */}
             <div className="flex flex-col w-full gap-2">
              <div className="flex justify-between text-sm text-gray-500 font-bold">
                  <span className="flex items-center gap-2"><BarChart2 size={16} className="text-blue-500"/> Few</span>
                  <span className="flex items-center gap-2">Many <BarChart2 size={16} className="text-purple-500"/></span>
              </div>
              <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={arraySize}
                  className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#4F46E5] shadow-inner"
                  onChange={handleSizeChange}
                  disabled={isSorting} 
              />
            </div>
          </div>

          {/* Row 2: Actions */}
          <div className="flex justify-center gap-6">
             <button
              onClick={resetArray}
              className="flex items-center gap-3 px-8 py-4 bg-[#EEF2FF] text-[#4F46E5] font-extrabold rounded-2xl shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] hover:scale-105 active:scale-95 active:shadow-[inset_6px_6px_12px_#d1d9e6,inset_-6px_-6px_12px_#ffffff] transition-all"
            >
              <RotateCcw size={24} /> Reset
            </button>
            <button
              onClick={handleStartStop}
              className={`flex items-center gap-3 px-10 py-4 font-extrabold rounded-2xl text-white shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 transition-all w-48 justify-center ${
                isSorting 
                  ? (isPaused ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-yellow-500 to-orange-500')
                  : 'bg-gradient-to-br from-[#4F46E5] to-[#818CF8]'
              }`}
            >
              {isSorting 
                ? (isPaused ? <><Play size={24} /> Resume</> : <><Square size={24} /> Pause</>) 
                : <><Play size={24} /> Start Sorting</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
