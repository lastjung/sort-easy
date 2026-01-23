import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Sparkles, Play, RotateCcw } from 'lucide-react';
import SortChart from './SortChart';
import { COLORS } from '../constants/colors';

// --- Shared Sound Utility (Singleton Pattern) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

const playTone = (freq, type = 'sine', duration = 0.1, vol = 0.1, enabled = true) => {
  if (!enabled) return;
  if (!audioCtx) audioCtx = new AudioContext();
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

const SortCard = ({ 
  item, // { id, title, fn, complexity, desc, icon, slogan }
  isCinema,
  initialArray, 
  arraySize, 
  speed, 
  soundEnabled, 
  volume,
  triggerRun, // To start from outside
  triggerStop, // To stop from outside
  triggerReset, // To reset from outside
  onComplete,
  onRunning // To notify parent about execution state
}) => {
  const [array, setArray] = useState([...initialArray]);
  const [isSorting, setIsSorting] = useState(false);
  const [compareIndices, setCompareIndices] = useState([]);
  const [swapIndices, setSwapIndices] = useState([]);
  const [goodIndices, setGoodIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [description, setDescription] = useState(item.slogan);
  const [elapsedTime, setElapsedTime] = useState(0);

  const sortingRef = useRef(false);
  const sessionIdRef = useRef(0);
  const speedRef = useRef(speed);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  // Sync speed ref
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const stopSorting = useCallback(() => {
    sessionIdRef.current++; // Instant session kill
    sortingRef.current = false;
    setIsSorting(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (onRunning) onRunning(false);
  }, [onRunning]);

  const localReset = useCallback(() => {
    stopSorting();
    setArray([...initialArray]);
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setDescription(item.slogan);
    setElapsedTime(0);
  }, [initialArray, item.slogan, stopSorting]);

  // Handle outside reset
  useEffect(() => {
    localReset();
  }, [initialArray, triggerReset, localReset]);

  // Handle outside stop
  useEffect(() => {
    if (triggerStop > 0) stopSorting();
  }, [triggerStop, stopSorting]);

  // Handle outside run
  useEffect(() => {
    if (triggerRun > 0 && !isSorting) {
      handleStart();
    }
  }, [triggerRun, isSorting]);

  const wait = async (factor = 1) => {
    // Prevent "shaking/falling" by ensuring a minimum frame time (min 20ms)
    const ms = Math.max(20, speedRef.current * factor);
    await new Promise(resolve => setTimeout(resolve, ms));
    return sortingRef.current;
  };

  const playSound = (freq, type) => {
    playTone(freq, type, 0.1, volume, soundEnabled);
  };

  const handleStart = async () => {
    if (isSorting || sortingRef.current) return;

    const mySessionId = ++sessionIdRef.current;
    setIsSorting(true);
    sortingRef.current = true;
    if (onRunning) onRunning(true); // Signal to Dashboard/App IMMEDIATELY
    
    setElapsedTime(0);
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current);
    }, 50);

    const checkSession = () => {
      if (mySessionId !== sessionIdRef.current) throw new Error('STOP');
    };

    const helpers = {
      array: [...array],
      setArray,
      setCompareIndices,
      setSwapIndices,
      setGoodIndices,
      setSortedIndices,
      setDescription,
      playSound,
      wait: async (f) => {
        checkSession();
        return await wait(f);
      },
      sortingRef,
      checkSession
    };

    try {
      const finished = await item.fn(helpers);
      if (finished && mySessionId === sessionIdRef.current) {
        setSortedIndices([...Array(arraySize).keys()]);
        setDescription("COMPLETED! ✨");
        if (onComplete) onComplete({ time: elapsedTime });
      }
    } catch (err) {
      if (err.message !== 'STOP') console.error(err);
    } finally {
      if (mySessionId === sessionIdRef.current) {
        stopSorting();
      }
    }
  };

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const remainMs = Math.floor((ms % 1000) / 10);
    return `${s}.${remainMs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className={`flex flex-col bg-slate-900/60 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 group ${isCinema ? 'ring-12 ring-emerald-500/10 h-full' : ''}`}>
      
      {/* Card Header */}
      <div className={`${isCinema ? 'p-10' : 'p-6'} bg-white/5 border-b border-white/5 flex justify-between items-center order-first`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-4 mb-1 flex-wrap">
            <span className={isCinema ? 'text-5xl' : 'text-3xl'}>{item.icon}</span>
            <h3 className={`${isCinema ? 'text-5xl' : 'text-2xl'} font-black text-white tracking-tighter truncate`}>{item.title}</h3>
            <span className={`${isCinema ? 'text-xl' : 'text-xs'} font-black text-slate-500 uppercase tracking-[0.2em]`}>{item.complexity}</span>
            <span className="mx-2 text-slate-700 hidden lg:inline">|</span>
            <p className={`${isCinema ? 'text-2xl' : 'text-base'} font-bold text-emerald-400/90 italic tracking-tight line-clamp-1`}>
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 ml-4">
           <div className={`flex items-center gap-2 px-5 py-2 bg-black/20 rounded-2xl border border-white/5 shadow-sm ${isCinema ? 'scale-125 origin-right' : ''}`}>
              {/* Local Controls (Minimal Ghost Style) */}
              <div className="flex items-center gap-1 mr-2 pr-2 border-r border-white/10">
                <button
                    onClick={localReset}
                    className="p-1 text-slate-500 hover:text-white transition-colors"
                    title="Reset"
                >
                    <RotateCcw size={isCinema ? 20 : 14} />
                </button>
                <button
                    onClick={handleStart}
                    disabled={isSorting}
                    className={`p-1 transition-colors ${isSorting ? 'text-emerald-500' : 'text-slate-500 hover:text-white'}`}
                    title="Run"
                >
                    <Play size={isCinema ? 22 : 16} fill={isSorting ? "currentColor" : "none"} />
                </button>
              </div>
              <Timer size={isCinema ? 24 : 18} className="text-emerald-400" />
              <span className={`${isCinema ? 'text-2xl' : 'text-lg'} font-mono font-black text-slate-200`}>{formatTime(elapsedTime)}</span>
           </div>
           {isSorting && (
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-black text-emerald-400 animate-pulse uppercase">Live Sorting</span>
               <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
             </div>
           )}
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className={`${isCinema ? 'p-10 flex-1' : 'p-4'} bg-black/10 flex flex-col justify-end`}>
        <SortChart 
          array={array}
          isCinema={isCinema}
          arraySize={arraySize}
          sortedIndices={sortedIndices}
          swapIndices={swapIndices}
          goodIndices={goodIndices}
          compareIndices={compareIndices}
        />
      </div>
    </div>
  );
};

export default SortCard;
