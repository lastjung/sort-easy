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
  
            // 2. Scanning (Yellow for j, Red for current minIndex)
            setCompareIndices([j]); 
            setSwapIndices([minIndex]); // Keep current min highlighted in RED
            
            setDescription(msg.SCAN);
            countCompare();
            playSound(300 + arr[j] * 5, 'sine'); 
            if (!(await wait(1))) break; // Scan 1.0
  
            if (arr[j] < arr[minIndex]) {
                // New minimum found
                minIndex = j;
                setSwapIndices([minIndex]); // Update RED highlight to new min
                setDescription(msg.NEW_MIN); 
                playSound(800, 'triangle'); 
                if (!(await wait(1))) break;
            }
        }
        
        if (!sortingRef.current) break;
        setCompareIndices([]);
  
        // 3. Action (Red)
        // 3. Action (Red <-> Purple Swap)
        if (minIndex !== i) {
            setDescription(msg.SWAP);
            setGoodIndices([i]);          // Target: Purple
            setSwapIndices([minIndex]);   // Min: Red
            playSound(150, 'sawtooth'); 
            countSwap();
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            setArray([...arr]);
            if (!(await wait(1))) break; // Action 1.0
            setSwapIndices([]);
            setGoodIndices([]);
        } else {
             setSwapIndices([]); // Clear red if no swap needed
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
