export const selectionSort = async ({ array, setArray, setCompareIndices, setSwapIndices, setGoodIndices, setSortedIndices, setDescription, playSound, wait, sortingRef, countCompare, countSwap, msg }) => {
    const arr = [...array];
    const n = arr.length;
    setSortedIndices([]); 
    let newSortedIndices = []; 
  
    setDescription(msg.START);
    setSortedIndices([]);
    setGoodIndices([]);
    if (!(await wait(1))) return;
  
    for (let i = 0; i < n; i++) {
        if (!sortingRef.current) break;
  
        let minIndex = i;
        // 1. Target (Purple)
        setGoodIndices([i]); 
        setDescription(msg.TARGET);
        if (!(await wait(1.5))) break;
  
        for (let j = i + 1; j < n; j++) {
            if (!sortingRef.current) break;
  
            // 2. Scanning (Yellow)
            setCompareIndices([j]); 
            setDescription(msg.SCAN);
            countCompare();
            playSound(300 + arr[j] * 5, 'sine'); 
            if (!(await wait(1))) break; // Scan 1.0
  
            if (arr[j] < arr[minIndex]) {
                // New minimum found (Red color highlight, but type is SWAP for visual feedback)
                minIndex = j;
                setDescription(msg.NEW_MIN); 
                setSwapIndices([minIndex]); 
                playSound(800, 'triangle'); 
                if (!(await wait(1))) break;
                setSwapIndices([]);
            }
        }
        
        if (!sortingRef.current) break;
        setCompareIndices([]);
  
        // 3. Action (Red)
        if (minIndex !== i) {
            setDescription(msg.SWAP);
            setSwapIndices([i, minIndex]); 
            playSound(150, 'sawtooth'); 
            countSwap();
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            setArray([...arr]);
            if (!(await wait(1))) break; // Action 1.0
            setSwapIndices([]);
        } else {
             if (!(await wait(0.5))) break; // Outro 0.5
        }
  
        // --- Baton Touch ---
        if (i + 1 < n) {
            setGoodIndices([i, i + 1]); 
            setDescription("Confirming position and preparing next target (Purple-Purple).");
            if (!(await wait(1))) break;
        }

        // Green confirm
        newSortedIndices.push(i);
        setSortedIndices([...newSortedIndices]);
        
        if (i + 1 < n) {
            setGoodIndices([i + 1]);
            if (!(await wait(0.5))) break; // Outro 0.5 
        } else {
            setGoodIndices([]);
        }
        
        playSound(600, 'square');
    }
    if (!sortingRef.current) return false;

    setSortedIndices([...Array(n).keys()]);
    setDescription(msg.FINISHED);
    return true;
};
