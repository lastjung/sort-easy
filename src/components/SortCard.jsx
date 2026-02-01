import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Sparkles, Play, RotateCcw, Pause, Activity, ArrowLeftRight, Zap } from 'lucide-react';
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
  triggerResume, // To resume from outside
  triggerStop, // To stop from outside
  triggerReset, // To reset from outside
  onComplete,
  onRunning, // To notify parent about execution state
  isTubeMode
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
  const comparisonsRef = useRef(0);
  const swapsRef = useRef(0);
  const arraySizeRef = useRef(arraySize);

  const sortingRef = useRef(false);
  const pausedRef = useRef(false);
  const sessionIdRef = useRef(0);
  const speedRef = useRef(speed);
  const isTubeModeRef = useRef(isTubeMode);
  const sortedCountRef = useRef(0);
  const [tubeMultiplier, setTubeMultiplier] = useState(0.7);
  const stepsRef = useRef(0);
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
    isTubeModeRef.current = isTubeMode; 
  }, [isTubeMode]);
  
  useEffect(() => {
    arraySizeRef.current = arraySize;
  }, [arraySize]);

  useEffect(() => {
    comparisonsRef.current = comparisons;
  }, [comparisons]);

  useEffect(() => {
    swapsRef.current = swaps;
  }, [swaps]);

  useEffect(() => {
    sortedCountRef.current = sortedIndices.length;
  }, [sortedIndices]);

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
    comparisonsRef.current = 0;
    swapsRef.current = 0;
  }, [initialArray, item.id]);

  // Responsive wait loop: Checks for pause/stop signals frequently.
  // Using a power-based curve to make high-speed settings feel significantly faster.
  const wait = useCallback(async (factor = 1) => {
    // Formula: (101-speed)^1.5 * factor * 0.4.
    let currentSpeed = speedRef.current;
    
    // --- Tube Mode (Dynamic Acceleration + Safe Zone) Logic ---
    if (isTubeModeRef.current) {
        // Calculate progress: combine real sorted bars + virtual progress from steps
        // estimatedTotalSteps for 16 bars is roughly 100-200.
        const currentArraySize = arraySizeRef.current;
        const realProgress = sortedCountRef.current / currentArraySize;
        const virtualProgress = Math.min(0.9, stepsRef.current / (currentArraySize * currentArraySize * 0.5));
        const progress = Math.max(realProgress, virtualProgress);
        
        let tubeFactor = 0.7; // Start slow
        
        if (progress >= 0.15) {
            // Accelerate from 0.7x to 1.8x
            tubeFactor = 0.7 + ((progress - 0.15) / 0.85) * (1.8 - 0.7);
        }
        
        tubeFactor = Math.min(1.8, tubeFactor);
        setTubeMultiplier(Number(tubeFactor.toFixed(1)));
        currentSpeed = Math.min(100, currentSpeed * tubeFactor);
    } else {
        if (tubeMultiplier !== 1.0) setTubeMultiplier(1.0);
    }
    
    const totalMs = Math.pow(101 - currentSpeed, 1.5) * factor * 0.4;
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
    // 0. Safety measure: Cleanup any existing session first
    if (timerRef.current) clearInterval(timerRef.current);
    sessionIdRef.current++;
    
    const mySessionId = sessionIdRef.current; // New session ID
    
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
    comparisonsRef.current = 0;
    swapsRef.current = 0;
    
    setElapsedTime(0);
    setTubeMultiplier(0.7);
    stepsRef.current = 0;
    baseTimeRef.current = 0;
    startTimeRef.current = Date.now();
    setDescription({ text: "Initializing...", type: MSG_TYPES.INFO });
    
    // CRITICAL: Always reset to initial unscented data on a fresh start
    const freshArray = [...initialArray];
    setArray(freshArray);
    arrayRef.current = freshArray;
    
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
         if (desc) setDescription(desc);
      },
      countCompare: () => {
         checkSession();
         stepsRef.current++;
         setComparisons(prev => {
            const next = prev + 1;
            comparisonsRef.current = next; // Sync Ref immediately
            return next;
         });
      },
      countSwap: () => {
         checkSession();
         stepsRef.current++;
         setSwaps(prev => {
            const next = prev + 1;
            swapsRef.current = next; // Sync Ref immediately
            return next;
         });
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
        
        // Success Sweep Effect: Gradually fill sortedIndices for a 'scanning' feel
        const allIndices = [...Array(arraySizeRef.current).keys()];
        for (let i = 0; i <= arraySizeRef.current; i++) {
            if (mySessionId !== sessionIdRef.current) break;
            setSortedIndices(allIndices.slice(0, i));
            if (i < arraySizeRef.current) {
                // Play a high-pitched success tone during sweep
                playSound(880 + (i * 20), 'sine');
                await new Promise(r => setTimeout(r, 30));
            }
        }

        setDescription(msg.FINISHED || { text: "COMPLETED! ✨", type: MSG_TYPES.SUCCESS });
        if (onCompleteRef.current) {
          onCompleteRef.current(item.id, { 
            time: baseTimeRef.current + (Date.now() - (pausedRef.current ? 0 : startTimeRef.current)),
            comparisons: comparisonsRef.current, // Use Ref for fresh value
            swaps: swapsRef.current // Use Ref for fresh value
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
  const lastRunTrigger = React.useRef(triggerRun);
  const lastResumeTrigger = React.useRef(triggerResume);
  const lastStopTrigger = React.useRef(triggerStop);

  useEffect(() => {
    if (triggerRun > lastRunTrigger.current) {
      lastRunTrigger.current = triggerRun;
      // Fresh run should always restart from beginning, even if finished
      handleStart();
    }
  }, [triggerRun, handleStart]);

  useEffect(() => {
    if (triggerResume > lastResumeTrigger.current) {
      lastResumeTrigger.current = triggerResume;
      if (pausedRef.current) {
        togglePause();
      }
    }
  }, [triggerResume, togglePause]);

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
      // Cleanup on unmount
      sessionIdRef.current++; // Invalidate any running session
      sortingRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      
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

  const getDescriptionClass = () => {
    if (isPaused) return 'text-amber-500/60 grayscale-[0.5]';
    
    switch (description?.type) {
      case MSG_TYPES.COMPARE: return 'text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.5)]';
      case MSG_TYPES.SWAP: return 'text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.5)]';
      case MSG_TYPES.TARGET: return 'text-fuchsia-400 drop-shadow-[0_0_12px_rgba(232,121,249,0.5)]';
      case MSG_TYPES.SUCCESS: return 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]';
      default: return 'text-slate-100';
    }
  };

  return (
    <div className={`flex flex-col bg-slate-900/60 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden transition-all duration-700 group ${
      isCinema ? 'ring-12 ring-emerald-500/10 h-full' : ''
    } ${isCinema && isTubeMode ? 'translate-y-[-80px] scale-[0.98]' : ''}`}>
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
                className={`p-0.5 transition-[transform,color] active:scale-75 ${
                  isSorting 
                    ? (isPaused ? 'text-amber-500 hover:text-amber-400' : 'text-orange-500 hover:text-orange-400') 
                    : 'text-slate-500 hover:text-white'
                }`} 
                title={isSorting ? (isPaused ? "Resume" : "Pause") : "Run"}
              >
                  {isSorting && !isPaused ? <Pause size={isCinema ? 20 : 16} fill="currentColor" /> : <Play size={isCinema ? 20 : 16} fill={isPaused ? "currentColor" : (isSorting ? "currentColor" : "none")} />}
              </button>
            </div>
          </div>
        </div>
        
        <p className={`${isCinema ? 'text-xl' : 'text-base md:text-xl'} font-black text-orange-400 italic tracking-tight line-clamp-2 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}>
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
        <div className="mt-2 flex flex-col gap-1">
          <div className="min-h-[3.5em] flex items-center justify-center px-6 relative">
             {isPaused && (
               <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-2">
                 <span className="bg-amber-500/20 text-amber-500 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-500/30 tracking-widest uppercase animate-pulse">Hold</span>
               </div>
             )}
             <p className={`${isCinema ? 'text-2xl' : 'text-base md:text-2xl'} font-black italic text-center animate-in fade-in slide-in-from-bottom-2 duration-300 ${getDescriptionClass()}`}>
                {description?.text || "Ready to sort..."}
             </p>
          </div>
          
          <div className={`flex items-center justify-center ${isCinema ? 'gap-8 md:gap-12 py-3' : 'gap-3 md:gap-6 py-1.5'} border-t border-white/5 opacity-80`}>
            <div className="flex items-center gap-1.5 md:gap-2">
              <Timer size={isCinema ? 20 : 10} className="text-emerald-400/70" />
              <span className={`${isCinema ? 'text-lg md:text-2xl' : 'text-[12px] md:text-xs'} font-mono font-normal text-slate-300 tracking-tighter`}>{formatTime(elapsedTime)}</span>
            </div>
            <div className={`w-px ${isCinema ? 'h-6' : 'h-2.5'} bg-white/10`} />
            <div className="flex items-center gap-1.5 md:gap-2">
              <Activity size={isCinema ? 20 : 10} className="text-amber-400/70" />
              <span className={`${isCinema ? 'text-lg md:text-2xl' : 'text-[12px] md:text-xs'} font-mono font-normal text-slate-300 tracking-tighter`}>{comparisons.toLocaleString()}</span>
            </div>
            <div className={`w-px ${isCinema ? 'h-6' : 'h-2.5'} bg-white/10`} />
            <div className="flex items-center gap-1.5 md:gap-2">
              <ArrowLeftRight size={isCinema ? 20 : 10} className="text-rose-400/70" />
              <span className={`${isCinema ? 'text-lg md:text-2xl' : 'text-[12px] md:text-xs'} font-mono font-normal text-slate-300 tracking-tighter`}>{swaps.toLocaleString()}</span>
            </div>
            <div className={`w-px ${isCinema ? 'h-6' : 'h-2.5'} bg-white/10`} />
            <div className="flex items-center gap-1.5 md:gap-2">
              <Zap size={isCinema ? 20 : 10} className="text-amber-500/70" />
              <span className={`${isCinema ? 'text-lg md:text-2xl' : 'text-[12px] md:text-xs'} font-mono font-normal text-slate-300 tracking-tighter`}>{((speed || 0) * (tubeMultiplier || 1)).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortCard;
