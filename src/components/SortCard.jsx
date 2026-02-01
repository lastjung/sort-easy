import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Sparkles, Play, RotateCcw, Pause, Activity, ArrowLeftRight } from 'lucide-react';
import SortChart from './SortChart';
import { COLORS } from '../constants/colors';
import { ALGO_MESSAGES, MSG_TYPES } from '../constants/messages';

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
  const arrayRef = useRef([...initialArray]); // To avoid stale closures in handleStart
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [compareIndices, setCompareIndices] = useState([]);
  const [swapIndices, setSwapIndices] = useState([]);
  const [goodIndices, setGoodIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [description, setDescription] = useState({ text: "", type: MSG_TYPES.INFO }); 
  const [elapsedTime, setElapsedTime] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const sortingRef = useRef(false);
  const pausedRef = useRef(false); // Ref for immediate access in wait()
  // sessionIdRef: Prevents multiple sorting instances from overlapping.
  // Each start increments this, and the active loop checks it to know if it should abort.
  const sessionIdRef = useRef(0);
  const speedRef = useRef(speed);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const baseTimeRef = useRef(0); 
  const onRunningRef = useRef(onRunning);
  const onCompleteRef = useRef(onComplete);

  // Sync refs
  useEffect(() => { 
    arrayRef.current = array;
  }, [array]);

  useEffect(() => { 
    speedRef.current = speed; 
  }, [speed]);

  useEffect(() => { 
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => { 
    onRunningRef.current = onRunning; 
  }, [onRunning]);

  // --- 1. Functions & Callbacks ---
  const stopSorting = useCallback(() => {
    if (!sortingRef.current) return;
    
    sortingRef.current = false;
    setIsSorting(false);
    sessionIdRef.current++; // Instant session kill
    
    if (timerRef.current) clearInterval(timerRef.current);
    baseTimeRef.current += Date.now() - startTimeRef.current;
  }, [item.id]);

  const localReset = useCallback(() => {
    // 1. Kill animation session immediately
    sortingRef.current = false;
    pausedRef.current = false;
    sessionIdRef.current++; 
    if (timerRef.current) clearInterval(timerRef.current);
    
    // 2. Reset internal visual states
    setIsSorting(false);
    setIsPaused(false);
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setElapsedTime(0);
    baseTimeRef.current = 0;
    
    const freshArray = [...initialArray];
    setArray(freshArray);
    arrayRef.current = freshArray;
    setDescription({ text: "", type: MSG_TYPES.INFO });
    setComparisons(0);
    setSwaps(0);
  }, [initialArray, item.id]);

  // Responsive wait loop: Checks for pause/stop signals frequently.
  // Using a power-based curve to make high-speed settings feel significantly faster.
  const wait = useCallback(async (factor = 1) => {
    // Formula: (101-speed)^1.5 * factor * 0.4.
    // Speed 100: ~0.4ms (Instant)
    // Speed 90: ~14.6ms
    // Speed 50: ~145ms
    // Speed 1: ~400ms
    const totalMs = Math.pow(101 - speedRef.current, 1.5) * factor * 0.4;
    let startTime = Date.now();

    while (Date.now() - startTime < totalMs) {
      if (!sortingRef.current) return false;
      
      if (pausedRef.current) {
        const pauseStart = Date.now();
        while (pausedRef.current && sortingRef.current) {
          await new Promise(r => setTimeout(r, 50));
        }
        // Offset the startTime by how long we were paused
        startTime += (Date.now() - pauseStart);
      }

      // Check every 4ms for better granularity at high speeds
      const remaining = totalMs - (Date.now() - startTime);
      if (remaining <= 0) break;
      await new Promise(r => setTimeout(r, Math.min(remaining, 4)));
    }
    return sortingRef.current;
  }, []);

  const playSound = useCallback((freq, type) => {
    playTone(freq, type, 0.1, volume, soundEnabled);
  }, [volume, soundEnabled]);

  const togglePause = useCallback(() => {
    if (!isSorting) return;
    
    if (isPaused) {
      // Resume
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(baseTimeRef.current + (Date.now() - startTimeRef.current));
      }, 50);
      setIsPaused(false);
      pausedRef.current = false;
    } else {
      // Pause
      if (timerRef.current) clearInterval(timerRef.current);
      baseTimeRef.current += Date.now() - startTimeRef.current;
      setIsPaused(true);
      pausedRef.current = true;
    }
  }, [isSorting, isPaused]);

  const handleStart = useCallback(async () => {
    const mySessionId = ++sessionIdRef.current;
    sortingRef.current = true;
    setIsSorting(true);
    setIsPaused(false);
    pausedRef.current = false;
    
    setSortedIndices([]);
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(0);
    baseTimeRef.current = 0;
    startTimeRef.current = Date.now();
    setDescription({ text: "Starting...", type: MSG_TYPES.INFO });
    timerRef.current = setInterval(() => {
      setElapsedTime(baseTimeRef.current + (Date.now() - startTimeRef.current));
    }, 50);

    const checkSession = () => {
      if (mySessionId !== sessionIdRef.current) throw new Error('STOP');
    };

    const helpers = {
      array: [...arrayRef.current],
      setArray: (newArr) => {
         checkSession();
         setArray(newArr);
      },
      setCompareIndices: (indices) => {
         checkSession();
         setCompareIndices(indices);
      },
      setSwapIndices: (indices) => {
         checkSession();
         setSwapIndices(indices);
      },
      setGoodIndices: (indices) => {
         checkSession();
         setGoodIndices(indices);
      },
      setSortedIndices: (indices) => {
         checkSession();
         setSortedIndices(indices);
      },
      setDescription: (desc) => {
         checkSession();
         setDescription(desc);
      },
      countCompare: () => {
         checkSession();
         setComparisons(prev => prev + 1);
      },
      countSwap: () => {
         checkSession();
         setSwaps(prev => prev + 1);
      },
      playSound,
      wait: async (f) => {
        checkSession();
        return await wait(f);
      },
      msg: ALGO_MESSAGES[item.id] || {},
      sortingRef,
      checkSession
    };

    try {
      const finished = await item.fn(helpers);
      if (finished && mySessionId === sessionIdRef.current) {
        setCompareIndices([]);
        setSwapIndices([]);
        setGoodIndices([]);
        setSortedIndices([...Array(arraySize).keys()]);
        setDescription(ALGO_MESSAGES[item.id]?.FINISHED || { text: "COMPLETED! ✨", type: MSG_TYPES.SUCCESS });
        if (onCompleteRef.current) {
          onCompleteRef.current(item.id, { 
            time: baseTimeRef.current + (Date.now() - (isPaused ? 0 : startTimeRef.current)),
            comparisons,
            swaps 
          }); 
        }
      }
    } catch (err) {
      if (err.message !== 'STOP') console.error(err);
    } finally {
      if (mySessionId === sessionIdRef.current) {
          setIsSorting(false);
          sortingRef.current = false;
          if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  }, [arraySize, item, wait, playSound, isSorting, isPaused, togglePause]);

  // --- 2. Side Effects (Triggers & Sync) ---
  // Signals from parent (App/Dashboard) to control sorting state globally.
  // Using lastTrigger refs to ensure and idempotent execution on increment only.
  const lastRunTrigger = React.useRef(0);
  const lastStopTrigger = React.useRef(0);

  useEffect(() => {
    if (triggerRun > lastRunTrigger.current) {
      lastRunTrigger.current = triggerRun;
      if (!sortingRef.current) {
        handleStart();
      } else if (pausedRef.current) {
        togglePause();
      }
    }
  }, [triggerRun, handleStart, togglePause]);

  useEffect(() => {
    if (triggerStop > lastStopTrigger.current) {
      lastStopTrigger.current = triggerStop;
      if (sortingRef.current && !pausedRef.current) {
        togglePause();
      }
    }
  }, [triggerStop, togglePause]);

  useEffect(() => {
    localReset();
  }, [initialArray, triggerReset, localReset]);

  useEffect(() => { 
    if (onRunningRef.current) {
      onRunningRef.current(item.id, { sorting: isSorting, paused: isPaused });
    }
  }, [item.id, isSorting, isPaused]);

  useEffect(() => { 
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    return () => {
      if (onRunningRef.current) {
        onRunningRef.current(item.id, { sorting: false, paused: false });
      }
    };
  }, [item.id]);

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const remainMs = Math.floor((ms % 1000) / 10);
    return `${s}.${remainMs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className={`flex flex-col bg-slate-900/60 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden transition-[transform,box-shadow,ring] duration-500 group ${isCinema ? 'ring-12 ring-emerald-500/10 h-full' : ''}`}>
      <div className={`${isCinema ? 'p-6' : 'p-3 md:p-4'} bg-white/5 border-b border-white/5 flex flex-col gap-1.5 order-first`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 min-w-0">
            <span className={isCinema ? 'text-3xl' : 'text-lg md:text-xl'}>{item.icon}</span>
            <h3 className={`${isCinema ? 'text-3xl' : 'text-base md:text-lg'} font-black text-white tracking-tighter truncate leading-none`}>{item.title}</h3>
            <span className={`${isCinema ? 'text-sm' : 'text-[10px]'} font-black text-slate-500 uppercase tracking-widest opacity-70`}>{item.complexity}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded-xl border border-white/10 shadow-sm`}>
              <button onClick={localReset} className="p-0.5 text-slate-500 hover:text-white transition-colors" title="Reset">
                  <RotateCcw size={isCinema ? 20 : 16} />
              </button>
              <button 
                onClick={isSorting ? togglePause : handleStart} 
                className={`p-0.5 transition-[transform,color] active:scale-75 ${isSorting ? (isPaused ? 'text-slate-500 hover:text-white' : 'text-amber-500 hover:text-amber-400') : 'text-slate-500 hover:text-white'}`} 
                title={isSorting ? (isPaused ? "Resume" : "Pause") : "Run"}
              >
                  {isSorting && !isPaused ? <Pause size={isCinema ? 20 : 16} fill="currentColor" /> : <Play size={isCinema ? 20 : 16} fill={isSorting ? "currentColor" : "none"} />}
              </button>
            </div>
          </div>
        </div>
        
        <p className={`${isCinema ? 'text-lg' : 'text-sm md:text-base'} font-black text-orange-400 italic tracking-tight line-clamp-2 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}>
          {item.slogan}
        </p>
      </div>

      <div className={`${isCinema ? 'p-4 flex-1' : 'px-0 pt-2 pb-0'} bg-black/10 flex flex-col justify-end`}>
        <SortChart 
          array={array}
          isCinema={isCinema}
          arraySize={arraySize}
          sortedIndices={sortedIndices}
          swapIndices={swapIndices}
          goodIndices={goodIndices}
          compareIndices={compareIndices}
        />
        
        {/* Bottom Description & Stats Bar */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="min-h-[2.5em] flex items-center justify-center px-4">
             <p className={`${isCinema ? 'text-2xl' : 'text-sm md:text-lg'} font-black italic text-center animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                description.type === MSG_TYPES.COMPARE
                  ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]'
                  : description.type === MSG_TYPES.SWAP
                  ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.4)]'
                  : description.type === MSG_TYPES.TARGET
                  ? 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.4)]'
                  : description.type === MSG_TYPES.SUCCESS
                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                  : 'text-slate-200'
             }`}>
                {description.text || "Ready to sort..."}
             </p>
          </div>
          
          <div className="grid grid-cols-3 gap-0 py-1.5 md:py-3 bg-black/20 md:rounded-2xl border-y md:border border-white/5">
            <div className="flex flex-col items-center border-r border-white/5">
              <div className="flex items-center gap-1 mb-0.5 md:mb-1">
                <Timer size={isCinema ? 20 : 12} className="text-emerald-400" />
                <span className={`${isCinema ? 'text-lg' : 'text-[9px] md:text-sm'} font-black text-slate-500 uppercase tracking-widest`}>Time</span>
              </div>
              <span className={`${isCinema ? 'text-2xl' : 'text-base md:text-xl'} font-mono font-black text-slate-200 tracking-tighter`}>{formatTime(elapsedTime)}</span>
            </div>

            <div className="flex flex-col items-center border-r border-white/5">
              <div className="flex items-center gap-1 mb-0.5 md:mb-1">
                <Activity size={isCinema ? 20 : 12} className="text-amber-400" />
                <span className={`${isCinema ? 'text-lg' : 'text-[9px] md:text-sm'} font-black text-slate-500 uppercase tracking-widest`}>Comp</span>
              </div>
              <span className={`${isCinema ? 'text-2xl' : 'text-base md:text-xl'} font-mono font-black text-slate-200 tracking-tighter`}>{comparisons.toLocaleString()}</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-0.5 md:mb-1">
                <ArrowLeftRight size={isCinema ? 20 : 12} className="text-rose-400" />
                <span className={`${isCinema ? 'text-lg' : 'text-[9px] md:text-sm'} font-black text-slate-500 uppercase tracking-widest`}>Swap</span>
              </div>
              <span className={`${isCinema ? 'text-2xl' : 'text-base md:text-xl'} font-mono font-black text-slate-200 tracking-tighter`}>{swaps.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortCard;
