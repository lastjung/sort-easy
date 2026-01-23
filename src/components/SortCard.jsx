import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Sparkles, Play, RotateCcw, Pause } from 'lucide-react';
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
  const arrayRef = useRef([...initialArray]); // To avoid stale closures in handleStart
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
    onRunningRef.current = onRunning; 
    onCompleteRef.current = onComplete;
  }, [onRunning, onComplete]);

  const stopSorting = useCallback(() => {
    if (!sortingRef.current) return;
    
    sortingRef.current = false;
    setIsSorting(false);
    sessionIdRef.current++; // Instant session kill
    
    if (timerRef.current) clearInterval(timerRef.current);
    baseTimeRef.current += Date.now() - startTimeRef.current;
    
    if (onRunningRef.current) onRunningRef.current(false);
  }, []);

  const localReset = useCallback(() => {
    stopSorting();
    const freshArray = [...initialArray];
    setArray(freshArray);
    arrayRef.current = freshArray;
    setCompareIndices([]);
    setSwapIndices([]);
    setGoodIndices([]);
    setSortedIndices([]);
    setDescription(item.slogan);
    setElapsedTime(0);
    baseTimeRef.current = 0;
  }, [initialArray, item.slogan, stopSorting]);

  // Handle outside reset
  useEffect(() => {
    localReset();
  }, [initialArray, triggerReset, localReset]);

  // Handle outside stop
  useEffect(() => {
    if (triggerStop > 0) stopSorting();
  }, [triggerStop, stopSorting]);

  const wait = useCallback(async (factor = 1) => {
    const delay = 1001 - speedRef.current;
    const ms = Math.max(20, delay * factor); 
    await new Promise(resolve => setTimeout(resolve, ms));
    return sortingRef.current;
  }, []);

  const playSound = useCallback((freq, type) => {
    playTone(freq, type, 0.1, volume, soundEnabled);
  }, [volume, soundEnabled]);

  const handleStart = useCallback(async () => {
    if (sortingRef.current) return;

    const mySessionId = ++sessionIdRef.current;
    sortingRef.current = true;
    setIsSorting(true);
    if (onRunningRef.current) onRunningRef.current(true); 
    
    startTimeRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
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
        if (onCompleteRef.current) onCompleteRef.current(item.id, { time: baseTimeRef.current + (Date.now() - startTimeRef.current) }); 
      }
    } catch (err) {
      if (err.message !== 'STOP') console.error(err);
    } finally {
      if (mySessionId === sessionIdRef.current) stopSorting();
    }
  }, [arraySize, item, wait, playSound]);

  // Handle outside signals
  useEffect(() => {
    if (triggerRun > 0 && !sortingRef.current) handleStart();
  }, [triggerRun, handleStart]);

  const formatTime = (ms) => {
    const s = Math.floor(ms / 1000);
    const remainMs = Math.floor((ms % 1000) / 10);
    return `${s}.${remainMs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className={`flex flex-col bg-slate-900/60 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 group ${isCinema ? 'ring-12 ring-emerald-500/10 h-full' : ''}`}>
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
              <div className="flex items-center gap-1 mr-2 pr-2 border-r border-white/10">
                <button onClick={localReset} className="p-1 text-slate-500 hover:text-white transition-colors" title="Reset">
                    <RotateCcw size={isCinema ? 20 : 14} />
                </button>
                <button onClick={isSorting ? stopSorting : handleStart} className={`p-1 transition-all active:scale-75 ${isSorting ? 'text-amber-500 hover:text-amber-400' : 'text-slate-500 hover:text-white'}`} title={isSorting ? "Pause" : "Run"}>
                    {isSorting ? <Pause size={isCinema ? 22 : 16} fill="currentColor" /> : <Play size={isCinema ? 22 : 16} fill="none" />}
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
